"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import { useBackendAuth } from "@/hooks/use-backend-auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getVideosByUser, type UserVideo } from "@/services/video/video-by-user";
import { getAuthToken } from "@/lib/get-auth-token";
import { getListProjects, type Project } from "@/services/get-list-projects";

import {
  VideoCard,
  StatsSection,
  SearchBar,
  EmptyState,
  NoResultsState,
  PromptCard,
  CreateProjectCard,
  DashboardHeader,
} from "./index";
import { VideoPreviewModal } from "./video-preview-modal";

interface ActivePrompt {
  projectId: string;
  title?: string;
  topic?: string;
  replicaId?: string;
}

interface DashboardContentProps {
  initialVideos: UserVideo[];
  initialProjects: Project[];
  initialHasContent: boolean;
}

export function DashboardContent({
  initialVideos,
  initialProjects,
  initialHasContent,
}: DashboardContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<UserVideo[]>(initialVideos);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activePrompts, setActivePrompts] = useState<ActivePrompt[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const { backendUser } = useBackendAuth();
  const { mutate: mutateUserProfile, projectedBalance } = useUserProfile();

  const frozenVideoRef = useRef<UserVideo | null>(null);

  const totalCompletedCount = videos.filter(
    (v) => v.status?.toLowerCase() === "completed"
  ).length;

  const handleOpenVideo = useCallback((v: UserVideo) => {
    frozenVideoRef.current = JSON.parse(JSON.stringify(v));
    setIsVideoModalOpen(true);
  }, []);

  const handleCloseVideo = useCallback(() => setIsVideoModalOpen(false), []);

  // Load active prompts from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const promptsStr = localStorage.getItem("active_prompt_generations") || "[]";
    const genProjectsStr = localStorage.getItem("active_generation_projects") || "{}";
    const prompts = JSON.parse(promptsStr);
    const genProjects = JSON.parse(genProjectsStr);
    
    setActivePrompts(
      prompts.filter(
        (p: ActivePrompt) => genProjects[p.projectId]?.activeStep === "PROMPT"
      )
    );
  }, []);

  const refreshData = useCallback(async (authToken: string, userId: string) => {
    setIsRefreshing(true);
    try {
      const [vRes, pRes] = await Promise.all([
        getVideosByUser(authToken, userId),
        getListProjects(authToken),
      ]);
      setVideos(vRes.data || []);
      if (pRes.success) setProjects(pRes.data);

      // Sync active prompts
      const promptsStr = localStorage.getItem("active_prompt_generations") || "[]";
      const genProjectsStr = localStorage.getItem("active_generation_projects") || "{}";
      const prompts = JSON.parse(promptsStr);
      const genProjects = JSON.parse(genProjectsStr);
      setActivePrompts(
        prompts.filter(
          (p: ActivePrompt) => genProjects[p.projectId]?.activeStep === "PROMPT"
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleFinalizedSync = useCallback(async () => {
    if (token && backendUser?.id) {
      await refreshData(token, backendUser.id);
      mutateUserProfile();
    }
  }, [token, backendUser?.id, refreshData, mutateUserProfile]);

  // Polling for active tasks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    async function init() {
      if (!backendUser?.id) return;
      const authToken = await getAuthToken();
      setToken(authToken);

      interval = setInterval(() => {
        const hasActiveTasks =
          typeof window !== "undefined" &&
          localStorage.getItem("active_generation_projects") !== "{}";
        const hasProcessing = videos.some((v) =>
          ["processing", "queued", "pending"].includes(v.status?.toLowerCase())
        );
        if (hasActiveTasks || hasProcessing) {
          refreshData(authToken, backendUser.id);
        }
      }, 15000);
    }
    
    init();
    return () => clearInterval(interval);
  }, [backendUser?.id, refreshData, videos]);

  const getStatusBadge = (s: string) => {
    const variants: Record<string, string> = {
      completed: "bg-[#6D58BB] text-white",
      processing: "bg-[#E2F2FE] text-[#2056E0]",
      failed: "bg-red-100 text-red-800",
    };
    return { color: variants[s.toLowerCase()] || "bg-[#FFF4CA] text-[#8F3F01]" };
  };

  const getProjectName = (id: string | null) =>
    projects.find((p) => p.projectId === id)?.projectName || "";

  // Filter videos and prompts
  const filteredVideos = videos.filter(
    (v) =>
      getProjectName(v.projectId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.prompt || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPrompts = activePrompts.filter(
    (p) =>
      (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.topic || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasContent = videos.length > 0 || activePrompts.length > 0;
  const hasNoResults =
    searchQuery && filteredVideos.length === 0 && filteredPrompts.length === 0;

  // Si no hay contenido inicial, mostrar empty state inmediatamente (sin skeleton)
  if (!initialHasContent && !hasContent) {
    return (
      <>
        <DashboardHeader showCreateButton={false} />
        <StatsSection
          totalCompletedCount={0}
          projectedBalance={projectedBalance ?? null}
        />
        <div className="min-h-[400px]">
          <EmptyState />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader showCreateButton={hasContent} />

      <StatsSection
        totalCompletedCount={totalCompletedCount}
        projectedBalance={projectedBalance ?? null}
      />

      {hasContent && (
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      )}

      <div className="min-h-[400px]">
        {hasNoResults ? (
          <NoResultsState
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {/* Active prompts (queued) */}
              {filteredPrompts.map((p) => (
                <PromptCard key={p.projectId} prompt={p} />
              ))}

              {/* Videos list */}
              {filteredVideos.map((v) => (
                <VideoCard
                  key={v.videoId}
                  video={v}
                  token={token}
                  projectName={getProjectName(v.projectId)}
                  onOpenVideo={handleOpenVideo}
                  getStatusBadge={getStatusBadge}
                  onFinalized={handleFinalizedSync}
                />
              ))}

              {/* Create new project card */}
              {!searchQuery && <CreateProjectCard />}
            </AnimatePresence>
          </div>
        )}
      </div>

      {isVideoModalOpen && frozenVideoRef.current && (
        <VideoPreviewModal
          videoHtml={
            frozenVideoRef.current.embed ??
            frozenVideoRef.current.metaData?.embed ??
            undefined
          }
          onClose={handleCloseVideo}
        />
      )}
    </>
  );
}
