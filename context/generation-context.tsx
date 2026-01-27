"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { getAuthToken } from "@/lib/get-auth-token";
import { getPromptStatus } from "@/services/video/prompt-status";
import { getVideoStatus } from "@/services/video/video-status";
import { generateVideoFromScript } from "@/services/video/generate-video-from-script";

// Servicios de Entregables
import { generateCompleteHtmlCode } from "@/services/deliverables/generate-complete-html-code"; 
import { generateKeywordResearch } from "@/services/deliverables/generate-keyword-research";
import { generateGeoReport } from "@/services/deliverables/generate-geo-report";
import { generateSeoGeoPackage } from "@/services/deliverables/generate-seo-gio-package";
import { generateCustomerInstructions } from "@/services/deliverables/generate-customer-instructions";
import { getHtmlDeliverableStatus } from "@/services/deliverables/get-html-deliverable-status";

type Step = "PROMPT" | "VIDEO" | "DELIVERABLES" | "COMPLETED";

interface ProjectState {
  projectId: string;
  activeStep: Step;
  currentJobId: string | null;
  deliverableJobs: string[];
  completedDeliverables: string[];
  error: string | null;
}

interface PromptStatusData {
  status: "queued" | "processing" | "completed" | "failed";
  scriptId: string;
}

interface GenerationContextType {
  projects: Record<string, ProjectState>;
  startNewProject: (jobId: string, userId: string, replicaId: string, options: { projectId: string; documentId?: string }) => void;
  removeProject: (projectId: string) => void;
  clearAllProjects: () => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export function GenerationProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Record<string, ProjectState>>({});

  useEffect(() => {
    const saved = localStorage.getItem("active_generation_projects");
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("active_generation_projects", JSON.stringify(projects));
  }, [projects]);

  // AUTO-LIMPIEZA: Borra proyectos terminados tras 30 segundos
  useEffect(() => {
    const finishedIds = Object.values(projects)
      .filter(p => p.activeStep === "COMPLETED" || p.error !== null)
      .map(p => p.projectId);

    if (finishedIds.length > 0) {
      const timer = setTimeout(() => {
        setProjects(prev => {
          const newState = { ...prev };
          finishedIds.forEach(id => {
            delete newState[id];
            localStorage.removeItem(`u_${id}`);
            localStorage.removeItem(`r_${id}`);
          });
          return newState;
        });
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [projects]);

  const activeProjectsList = useMemo(() => 
    Object.values(projects).filter(p => p.activeStep !== "COMPLETED"), 
  [projects]);

  useSWR(activeProjectsList.length > 0 ? "global-polling" : null, async () => {
    const token = await getAuthToken();
    if (!token) return;

    const updatedProjects = { ...projects };
    let hasChanges = false;

    for (const project of activeProjectsList) {
      const { projectId, activeStep, currentJobId, deliverableJobs, completedDeliverables } = project;

      if ((activeStep === "PROMPT" || activeStep === "VIDEO") && currentJobId) {
        const res = activeStep === "PROMPT" ? await getPromptStatus(token, currentJobId) : await getVideoStatus(token, currentJobId);
        
        if (res?.success && res.data.status === "completed") {
          hasChanges = true;
          if (activeStep === "PROMPT") {
            const scriptId = (res.data as PromptStatusData).scriptId;
            const userId = localStorage.getItem(`u_${projectId}`) || "";
            const replicaId = localStorage.getItem(`r_${projectId}`) || "";
            
            try {
              const [videoRes, ...delivRes] = await Promise.all([
                generateVideoFromScript(token, { scriptId, userId, replicaId, projectId, options: { waitForCompletion: false } }),
                generateCompleteHtmlCode(token, { scriptId, projectId }),
                generateKeywordResearch(token, { scriptId, projectId }),
                generateGeoReport(token, { scriptId, projectId }),
                generateSeoGeoPackage(token, { scriptId, projectId }),
                generateCustomerInstructions(token, { scriptId, projectId })
              ]);

              if (videoRes.success) {
                updatedProjects[projectId].activeStep = "VIDEO";
                updatedProjects[projectId].currentJobId = videoRes.data.tavusVideoId;
                updatedProjects[projectId].deliverableJobs = delivRes.map(r => r.data.jobId);
              }
            } catch (e) { updatedProjects[projectId].error = "Error triggering assets"; }
          } else {
            updatedProjects[projectId].activeStep = "DELIVERABLES";
            updatedProjects[projectId].currentJobId = null;
          }
        }
      }

      const pending = deliverableJobs.filter(id => !completedDeliverables.includes(id));
      if (pending.length > 0) {
        const statuses = await Promise.all(pending.map(id => getHtmlDeliverableStatus({ token, jobId: id })));
        const newlyDone = statuses.filter(s => s?.success && s.data.status === "completed").map(s => s.data.jobId);
        if (newlyDone.length > 0) {
          hasChanges = true;
          updatedProjects[projectId].completedDeliverables = [...new Set([...completedDeliverables, ...newlyDone])];
        }
      }

      if (updatedProjects[projectId].activeStep === "DELIVERABLES" && 
          updatedProjects[projectId].completedDeliverables.length >= updatedProjects[projectId].deliverableJobs.length) {
        updatedProjects[projectId].activeStep = "COMPLETED";
        hasChanges = true;
      }
    }
    if (hasChanges) setProjects(updatedProjects);
  }, { refreshInterval: 5000 });

  const startNewProject = (jobId: string, userId: string, replicaId: string, options: { projectId: string }) => {
    localStorage.setItem(`u_${options.projectId}`, userId);
    localStorage.setItem(`r_${options.projectId}`, replicaId);
    setProjects(prev => ({
      ...prev,
      [options.projectId]: {
        projectId: options.projectId,
        activeStep: "PROMPT",
        currentJobId: jobId,
        deliverableJobs: [],
        completedDeliverables: [],
        error: null,
      }
    }));
  };

  const removeProject = (id: string) => {
    setProjects(prev => { const n = {...prev}; delete n[id]; return n; });
    localStorage.removeItem(`u_${id}`); localStorage.removeItem(`r_${id}`);
  };

  const clearAllProjects = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(k => (k.startsWith("u_") || k.startsWith("r_") || k === "active_generation_projects") && localStorage.removeItem(k));
    setProjects({});
  };

  return (
    <GenerationContext.Provider value={{ projects, startNewProject, removeProject, clearAllProjects }}>
      {children}
    </GenerationContext.Provider>
  );
}

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) throw new Error("useGeneration must be used within GenerationProvider");
  return context;
};