"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { getAuthToken } from "@/lib/get-auth-token";
import { getPromptStatus } from "@/services/video/prompt-status";
import { getVideoStatus } from "@/services/video/video-status";
import { generateVideoFromScript } from "@/services/video/generate-video-from-script";

// --- TIPOS ---
type Step = "PROMPT" | "VIDEO" | "COMPLETED";

interface ProjectState {
  projectId: string;
  activeStep: Step;
  currentJobId: string;
  error: string | null;
}

interface PromptStatusData {
  status: "queued" | "processing" | "completed" | "failed";
  scriptId: string;
}

interface GenerationOptions {
  projectId: string; // Obligatorio para multianclaje
  documentId?: string;
}

interface GenerationContextType {
  projects: Record<string, ProjectState>;
  startNewProject: (jobId: string, userId: string, replicaId: string, options: GenerationOptions) => void;
  resetProject: (projectId: string) => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export function GenerationProvider({ children }: { children: React.ReactNode }) {
  // Mapa de proyectos: { "id_1": { ... }, "id_2": { ... } }
  const [projects, setProjects] = useState<Record<string, ProjectState>>({});

  // 1. Hidratación
  useEffect(() => {
    const saved = localStorage.getItem("active_multi_projects");
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem("active_multi_projects", JSON.stringify(projects));
  }, [projects]);

  // 2. Polling Unificado con SWR
  // Solo consultamos si hay proyectos que no han terminado
  const activeProjects = useMemo(() => 
    Object.values(projects).filter(p => p.activeStep !== "COMPLETED"), 
  [projects]);

  useSWR(activeProjects.length > 0 ? "multi-project-polling" : null, async () => {
    const token = await getAuthToken();
    if (!token) return;

    const updatedProjects = { ...projects };
    let hasChanges = false;

    for (const project of activeProjects) {
      const res = project.activeStep === "PROMPT" 
        ? await getPromptStatus(token, project.currentJobId) 
        : await getVideoStatus(token, project.currentJobId);

      if (!res?.success || !res.data) continue;

      const remoteStatus = res.data.status;

      // Manejo de Errores
      if (remoteStatus === "failed" || remoteStatus === "error") {
        updatedProjects[project.projectId].error = `Failed at ${project.activeStep}`;
        updatedProjects[project.projectId].activeStep = "COMPLETED"; // Cerramos por error
        hasChanges = true;
        continue;
      }

      // Manejo de Éxito y Transición
      if (remoteStatus === "completed") {
        hasChanges = true;
        
        if (project.activeStep === "PROMPT") {
          // TRANSICIÓN A VIDEO
          const promptData = res.data as PromptStatusData;
          const scriptId = promptData.scriptId;

          // Recuperar metadatos guardados para este proyecto específico
          const userId = localStorage.getItem(`u_${project.projectId}`) || "";
          const replicaId = localStorage.getItem(`r_${project.projectId}`) || "";
          
          try {
            const videoRes = await generateVideoFromScript(token, {
              scriptId, userId, replicaId, projectId: project.projectId,
              options: { waitForCompletion: false }
            });

            if (videoRes.success) {
              updatedProjects[project.projectId].activeStep = "VIDEO";
              updatedProjects[project.projectId].currentJobId = videoRes.data.tavusVideoId;
            }
          } catch (e) {
            updatedProjects[project.projectId].error = "Video trigger failed";
          }
        } else {
          // FINALIZACIÓN DEL VIDEO
          updatedProjects[project.projectId].activeStep = "COMPLETED";
        }
      }
    }

    if (hasChanges) setProjects(updatedProjects);
  }, { refreshInterval: 5000 });

  // 3. Funciones de Control
  const startNewProject = (jobId: string, userId: string, replicaId: string, options: GenerationOptions) => {
    // Guardamos params de usuario asociados al ID del proyecto
    localStorage.setItem(`u_${options.projectId}`, userId);
    localStorage.setItem(`r_${options.projectId}`, replicaId);

    setProjects(prev => ({
      ...prev,
      [options.projectId]: {
        projectId: options.projectId,
        activeStep: "PROMPT",
        currentJobId: jobId,
        error: null
      }
    }));
  };

  const resetProject = (projectId: string) => {
    setProjects(prev => {
      const next = { ...prev };
      delete next[projectId];
      return next;
    });
    localStorage.removeItem(`u_${projectId}`);
    localStorage.removeItem(`r_${projectId}`);
  };

  return (
    <GenerationContext.Provider value={{ projects, startNewProject, resetProject }}>
      {children}
    </GenerationContext.Provider>
  );
}

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) throw new Error("useGeneration must be used within GenerationProvider");
  return context;
};