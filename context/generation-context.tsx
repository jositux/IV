"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { getAuthToken } from "@/lib/get-auth-token";
import { getPromptStatus } from "@/services/video/prompt-status";
import { getVideoStatus } from "@/services/video/video-status";
import { generateVideoFromScript } from "@/services/video/generate-video-from-script";

// Deliverables Services
import { generateCompleteHtmlCode } from "@/services/deliverables/generate-complete-html-code"; 
import { generateKeywordResearch } from "@/services/deliverables/generate-keyword-research";
import { generateGeoReport } from "@/services/deliverables/generate-geo-report";
import { generateSeoGeoPackage } from "@/services/deliverables/generate-seo-gio-package";
import { generateCustomerInstructions } from "@/services/deliverables/generate-customer-instructions";
import { getHtmlDeliverableStatus } from "@/services/deliverables/get-html-deliverable-status";

// Hooks
import { useUserProfile } from "@/hooks/use-user-profile";

// UI Components
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

type Step = "PROMPT" | "VIDEO" | "VIDEO_PROCESSING" | "DELIVERABLES" | "COMPLETED";

interface ProjectState {
  projectId: string;
  activeStep: Step;
  currentJobId: string | null;
  deliverableJobs: string[];
  completedDeliverables: string[];
  error: string | null;
  keywords?: string;
  targetAudience?: string;
  duration: number;
  initialBalanceSnapshot: number; 
}

interface PromptStatusData {
  status: "queued" | "processing" | "completed" | "failed";
  scriptId: string;
}

interface GenerationContextType {
  projects: Record<string, ProjectState>;
  startNewProject: (
    jobId: string, 
    userId: string, 
    replicaId: string, 
    options: { projectId: string; keywords?: string; targetAudience?: string; duration?: number }
  ) => void;
  removeProject: (projectId: string) => void;
  clearAllProjects: () => void;
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export function GenerationProvider({ children }: { children: React.ReactNode }) {
  const { realBalance } = useUserProfile();

  const [projects, setProjects] = useState<Record<string, ProjectState>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("active_generation_projects");
      try {
        return saved ? JSON.parse(saved) : {};
      } catch (e) { return {}; }
    }
    return {};
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCompletedProjectId, setLastCompletedProjectId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("active_generation_projects", JSON.stringify(projects));
  }, [projects]);

  const allProjects = useMemo(() => Object.values(projects), [projects]);

  // Helper para limpiar el prompt temporal del Dashboard
  const cleanPromptFromDashboard = useCallback((projectId: string) => {
    const stored = localStorage.getItem("active_prompt_generations");
    if (stored) {
      const prompts = JSON.parse(stored);
      const filtered = prompts.filter((p: any) => p.projectId !== projectId);
      localStorage.setItem("active_prompt_generations", JSON.stringify(filtered));
      // Disparar evento para que el Dashboard reaccione instantáneamente
      window.dispatchEvent(new Event("storage"));
    }
  }, []);

  // Polling Engine
  useSWR(allProjects.length > 0 ? "global-polling" : null, async () => {
    const token = await getAuthToken();
    if (!token) return;

    const updatedProjects = { ...projects };
    let hasChanges = false;

    for (const project of allProjects) {
      const { projectId, activeStep, currentJobId, deliverableJobs, completedDeliverables, keywords, targetAudience } = project;

      // Limpieza en caso de error
      if (project.error) {
        delete updatedProjects[projectId];
        localStorage.removeItem(`u_${projectId}`);
        localStorage.removeItem(`r_${projectId}`);
        cleanPromptFromDashboard(projectId);
        hasChanges = true;
        continue;
      }

      // 1. PROMPT -> VIDEO -> DELIVERABLES
      if ((activeStep === "PROMPT" || activeStep === "VIDEO_PROCESSING") && currentJobId) {
        const res = activeStep === "PROMPT" 
          ? await getPromptStatus(token, currentJobId) 
          : await getVideoStatus(token, currentJobId);
        
        if (res?.success && res.data.status === "completed") {
          hasChanges = true;

          if (activeStep === "PROMPT") {
            const scriptId = (res.data as PromptStatusData).scriptId;
            const userId = localStorage.getItem(`u_${projectId}`) || "";
            const replicaId = localStorage.getItem(`r_${projectId}`) || "";
            
            try {
              // Disparamos todo el paquete de generación
              const [videoRes, ...delivRes] = await Promise.all([
                generateVideoFromScript(token, { 
                    scriptId, userId, replicaId, projectId, keywords, targetAudience, 
                    options: { waitForCompletion: false } 
                }),
                generateCompleteHtmlCode(token, { scriptId, projectId }),
                generateKeywordResearch(token, { scriptId, projectId }),
                generateGeoReport(token, { scriptId, projectId }),
                generateSeoGeoPackage(token, { scriptId, projectId }),
                generateCustomerInstructions(token, { scriptId, projectId })
              ]);

              if (videoRes.success) {
                // --- CAMBIO CLAVE ---
                // Solo borramos el prompt temporal CUANDO el video ya está aceptado
                cleanPromptFromDashboard(projectId);

                updatedProjects[projectId].activeStep = "VIDEO_PROCESSING";
                updatedProjects[projectId].currentJobId = videoRes.data.tavusVideoId;
                updatedProjects[projectId].deliverableJobs = delivRes.map(r => r.data.jobId);
              }
            } catch (e) { 
                updatedProjects[projectId].error = "Trigger error in deliverables"; 
            }
          } else {
            // Pasamos a entregables y saltamos el modal de éxito (Video listo)
            updatedProjects[projectId].activeStep = "DELIVERABLES";
            updatedProjects[projectId].currentJobId = null;
            setLastCompletedProjectId(projectId);
            setShowSuccessModal(true);
          }
        }
      }

      // 2. MONITOREO SILENCIOSO DE ENTREGABLES
      const pending = deliverableJobs.filter(id => !completedDeliverables.includes(id));
      if (pending.length > 0) {
        const statuses = await Promise.all(pending.map(id => getHtmlDeliverableStatus({ token, jobId: id })));
        const newlyDone = statuses.filter(s => s?.success && s.data.status === "completed").map(s => s.data.jobId);
        
        if (newlyDone.length > 0) {
          hasChanges = true;
          updatedProjects[projectId].completedDeliverables = [...new Set([...completedDeliverables, ...newlyDone])];
        }
      }

      // 3. FINALIZACIÓN Y LIMPIEZA DE METADATOS
      const isFinished = updatedProjects[projectId].activeStep === "DELIVERABLES" && 
                        updatedProjects[projectId].completedDeliverables.length >= updatedProjects[projectId].deliverableJobs.length &&
                        updatedProjects[projectId].deliverableJobs.length > 0;

      if (isFinished) {
        hasChanges = true;
        delete updatedProjects[projectId];
        localStorage.removeItem(`u_${projectId}`);
        localStorage.removeItem(`r_${projectId}`);
      }
    }

    if (hasChanges) setProjects(updatedProjects);
  }, { refreshInterval: 5000 });

  const startNewProject = (
    jobId: string, 
    userId: string, 
    replicaId: string, 
    options: { projectId: string; keywords?: string; targetAudience?: string; duration?: number }
  ) => {
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
        keywords: options.keywords,
        targetAudience: options.targetAudience,
        duration: options.duration || 0,
        initialBalanceSnapshot: realBalance 
      }
    }));
  };

  const removeProject = useCallback((id: string) => {
    setProjects(prev => { const n = {...prev}; delete n[id]; return n; });
    localStorage.removeItem(`u_${id}`); 
    localStorage.removeItem(`r_${id}`);
    cleanPromptFromDashboard(id);
  }, [cleanPromptFromDashboard]);

  const clearAllProjects = () => {
    setProjects({});
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith("u_") || k.startsWith("r_") || k === "active_generation_projects" || k === "active_prompt_generations") {
        localStorage.removeItem(k);
      }
    });
  };

  return (
    <GenerationContext.Provider value={{ projects, startNewProject, removeProject, clearAllProjects, showSuccessModal, setShowSuccessModal }}>
      {children}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-white rounded-[24px] p-8 border-none shadow-2xl max-w-sm outline-none">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-[#080936]">Project Ready!</DialogTitle>
            <DialogDescription className="text-[#3E4462] mt-2 mb-6">
              Your video is ready. Other assets are being finalized in the background.
            </DialogDescription>
            <Link href={lastCompletedProjectId ? `/generation/${lastCompletedProjectId}` : "/dashboard"} className="w-full">
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#6D58BB] hover:bg-[#080936] text-white h-12 rounded-xl flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg"
              >
                View Project <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </GenerationContext.Provider>
  );
}

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) throw new Error("useGeneration must be used within GenerationProvider");
  return context;
};