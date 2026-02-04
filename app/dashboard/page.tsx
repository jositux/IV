"use client";
import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import {
  Video, FileText, Monitor, Search, ArrowRight, Play, Clock, CreditCard, RefreshCw, Plus, Sparkles, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoPreviewModal } from "./components/video-preview-modal";
import Link from "next/link";
import Image from "next/image"; 
import useSWR from "swr"; 
import { motion, AnimatePresence } from "framer-motion";

import { useBackendAuth } from "@/hooks/use-backend-auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { getVideosByUser, type UserVideo } from "@/services/video/video-by-user";
import { getAuthToken } from "@/lib/get-auth-token";
import { getListProjects, type Project } from "@/services/get-list-projects";
import { getProjectById } from "@/services/get-project-by-id";

// --- INTERFACES ---
interface ActivePrompt {
  projectId: string;
  title?: string;
  topic?: string;
  replicaId?: string;
}

// --- HELPERS ---
const formatVideoDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const dayMonthYear = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date: dayMonthYear, time };
};

const projectFetcher = async ([_, token, projectId]: [string, string, string]) => {
  const res = await getProjectById(token, projectId);
  return res.data;
};

const dashboardFetcher = async ([_, token, userId]: [string, string, string]) => {
  const [vRes, pRes] = await Promise.all([
    getVideosByUser(token, userId),
    getListProjects(token)
  ]);
  return {
    videos: vRes.data || [],
    projects: pRes.success ? pRes.data : []
  };
};

// --- SKELETON COMPONENT ---
const VideoCardSkeleton = () => (
  <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-none h-full">
    <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
    <div className="p-5 space-y-4">
      <div className="h-7 bg-gray-100 animate-pulse rounded-md w-3/4" />
      <div className="h-4 bg-gray-50 animate-pulse rounded-md w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-100 animate-pulse rounded-full w-20" />
        <div className="h-6 bg-gray-100 animate-pulse rounded-md w-16" />
      </div>
      <div className="h-10 bg-gray-50 animate-pulse rounded-[20px] w-full mt-4" />
    </div>
  </div>
);

// --- VIDEO CARD COMPONENT ---
const VideoCard = memo(function VideoCard({ 
  video: initialVideo, 
  token, 
  projectName, 
  onOpenVideo, 
  getStatusBadge,
  onFinalized,
  priority = false // Prop para prioridad de carga
}: any) {
  const isTransient = ["processing", "queued", "pending"].includes(initialVideo.status?.toLowerCase());
  
  const { data: updatedData } = useSWR(
    isTransient && token && initialVideo.projectId ? ["project-status", token, initialVideo.projectId] : null,
    projectFetcher, { refreshInterval: 8000, revalidateOnFocus: false, dedupingInterval: 2000 }
  );
  
  const video = updatedData?.videos?.[0] || initialVideo;
  const status = video.status.toLowerCase();
  const isProcessing = status === "processing" || status === "queued";
  const dateTime = formatVideoDate(video.createdAt);

  useEffect(() => {
    if (initialVideo.status.toLowerCase() !== "completed" && status === "completed") {
      if (video.projectId) onFinalized(video.projectId);
    }
  }, [status, initialVideo.status, onFinalized, video.projectId]);

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full transition-shadow hover:shadow-md rounded-[24px] overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image 
              src={`/assets/avatars/${video.replicaId || "default"}.jpg`} 
              alt={projectName || "Video thumbnail"}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover object-top transition-transform group-hover:scale-105"
            />
            {status === "completed" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button className="rounded-full bg-white text-gray-900 w-16 h-16 shadow-lg cursor-pointer" onClick={() => onOpenVideo(video)}>
                  <Play className="w-8 h-8 ml-1" fill="#6D58BB" color="#6D58BB" />
                </Button>
              </div>
            )}
            <Badge className={`rounded-[20px] font-normal absolute top-2 right-2 z-20 ${getStatusBadge(status).color}`}>
              {status}
            </Badge>
          </div>
          <div className="p-5 space-y-2">
            <Link href={`/generation/${video.projectId}/`} className="cursor-pointer">
              <h2 className="text-2xl text-[#272830] font-medium truncate hover:text-[#6D58BB] cursor-pointer">{projectName || "Untitled Project"}</h2>
            </Link>
            <p className="text-sm text-[#272830] line-clamp-1 italic min-h-[40px]">"{video.prompt?.replace(/<[^>]*>?/gm, "")}"</p>
            <div className="flex items-center justify-between pt-3">
              <div className="flex gap-2 text-[12px]">
                {video.duration > 0 && <span className="bg-[#E2F2FE] text-[#2056E0] font-light px-2 py-1 rounded-[20px]"><Clock className="w-3 h-3 inline mr-1" />{video.duration} sec</span>}
                {video.creditsCharged > 0 && <span className="bg-[#FFF4CA] text-[#8F3F01] font-light px-2 py-1 rounded-[20px]"><CreditCard className="w-3 h-3 inline mr-1" />{video.creditsCharged} credits</span>}
              </div>
              {dateTime && <div className="text-[11px] text-[#272830] font-light text-right"><div>{dateTime.date}</div><div className="opacity-80">{dateTime.time}</div></div>}
            </div>
            <div className="pt-3">
              {isProcessing ? (
                <Button disabled className="w-full h-10 bg-[#E2F2FE] text-[#2056E0] rounded-[20px] gap-2 border-none"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...</Button>
              ) : status === "completed" ? (
                <Link href={`/generation/${video.projectId}/`} className="w-full cursor-pointer">
                  <Button variant="ghost" className="w-full h-10 bg-[#E2F2FE] text-[#080936] rounded-[20px] hover:bg-[#6D58BB] hover:text-white transition-all cursor-pointer">View Project <ArrowRight className="w-3.5 h-3.5 ml-2" /></Button>
                </Link>
              ) : <Button disabled className="w-full h-10 bg-red-50 text-red-600 rounded-[20px] border-none italic">Failed</Button>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// --- DASHBOARD PAGE ---
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const { backendUser, loading: authLoading } = useBackendAuth();
  const { projectedBalance, mutate: mutateUserProfile } = useUserProfile();
  
  const frozenVideoRef = useRef<UserVideo | null>(null);

  useEffect(() => {
    getAuthToken().then(setToken);
  }, []);

  const { data, isLoading: dataLoading, mutate: mutateDashboard } = useSWR(
    token && backendUser?.id ? ["dashboard-data", token, backendUser.id] : null,
    dashboardFetcher,
    { refreshInterval: 25000, revalidateOnFocus: true }
  );

  const videos = data?.videos || [];
  const projects = data?.projects || [];

  const handleOpenVideo = useCallback((v: UserVideo) => { 
    frozenVideoRef.current = JSON.parse(JSON.stringify(v)); 
    setIsVideoModalOpen(true); 
  }, []);
  
  const handleCloseVideo = useCallback(() => setIsVideoModalOpen(false), []);

  const cleanupStaleStates = useCallback((projectId: string) => {
    if (typeof window === 'undefined' || !projectId) return;
    const genProjectsStr = localStorage.getItem("active_generation_projects");
    if (genProjectsStr) {
      try {
        const genProjects = JSON.parse(genProjectsStr);
        const projectData = genProjects[projectId];
        if (projectData && projectData.activeStep !== "DELIVERABLES") {
          delete genProjects[projectId];
          localStorage.setItem("active_generation_projects", JSON.stringify(genProjects));
          const promptsStr = localStorage.getItem("active_prompt_generations");
          if (promptsStr) {
            const prompts = JSON.parse(promptsStr);
            const filteredPrompts = prompts.filter((p: any) => p.projectId !== projectId);
            localStorage.setItem("active_prompt_generations", JSON.stringify(filteredPrompts));
          }
        }
      } catch (e) { console.error("Cleanup error", e); }
    }
  }, []);

  useEffect(() => {
    videos.forEach(v => {
      if (v.status?.toLowerCase() === "completed" && v.projectId) {
        cleanupStaleStates(v.projectId);
      }
    });
  }, [videos, cleanupStaleStates]);

  const handleFinalizedSinc = useCallback(async (projectId?: string) => {
    if (projectId) cleanupStaleStates(projectId);
    mutateDashboard();
    mutateUserProfile();
  }, [cleanupStaleStates, mutateDashboard, mutateUserProfile]);

  const getStatusBadge = (s: string) => {
    const v: any = { completed: "bg-[#6D58BB] text-white", processing: "bg-[#E2F2FE] text-[#2056E0]", failed: "bg-red-100 text-red-800" };
    return { color: v[s.toLowerCase()] || "bg-[#FFF4CA] text-[#8F3F01]" };
  };

  const activePrompts = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const prompts: ActivePrompt[] = JSON.parse(localStorage.getItem("active_prompt_generations") || "[]");
    const genProjects = JSON.parse(localStorage.getItem("active_generation_projects") || "{}");
    return prompts.filter((p: ActivePrompt) => {
      const isStillInPromptStep = genProjects[p.projectId]?.activeStep === "PROMPT";
      const isNotYetInBackend = !videos.some(v => v.projectId === p.projectId);
      return isStillInPromptStep && isNotYetInBackend;
    });
  }, [videos, dataLoading]);

  const getProjectName = useCallback((id: string | null) => 
    projects.find(p => p.projectId === id)?.projectName || "", [projects]
  );
  
  const filteredVideos = useMemo(() => 
    videos.filter(v => 
      getProjectName(v.projectId).toLowerCase().includes(searchQuery.toLowerCase()) || 
      (v.prompt || "").toLowerCase().includes(searchQuery.toLowerCase())
    ), [videos, searchQuery, getProjectName]
  );

  const filteredPrompts = useMemo(() => 
    activePrompts.filter((p: ActivePrompt) => 
      (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.topic || "").toLowerCase().includes(searchQuery.toLowerCase())
    ), [activePrompts, searchQuery]
  );

  const totalCompletedCount = useMemo(() => 
    videos.filter(v => v.status?.toLowerCase() === "completed").length, 
  [videos]);

  const hasContent = videos.length > 0 || activePrompts.length > 0;
  const hasNoResults = searchQuery && filteredVideos.length === 0 && filteredPrompts.length === 0;
  const showSkeleton = (dataLoading || authLoading) && !data;

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-medium text-[#080936]">Dashboard</h1>
          {hasContent && !showSkeleton && (
            <Link href="/inputs">
              <Button size="lg" className="rounded-xl bg-[#6D58BB] px-6 py-6 text-xl font-normal text-white hover:bg-[#080936] cursor-pointer">
                <Plus className="mr-2 h-5 w-5" /> Create new project
              </Button>
            </Link>
          )}
        </div>

        {/* STATS SECTION */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total videos", value: totalCompletedCount, icon: Video }, 
            { label: "Available Credits", value: projectedBalance ?? 0, icon: CreditCard }, 
            { label: "Deliverables", value: totalCompletedCount * 5, icon: FileText }, 
            { label: "Landing Pages", value: 0, icon: Monitor }
          ].map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-1 bg-white shadow-none border-gray-200 rounded-[24px]">
                <CardContent className="px-6 flex flex-col justify-center">
                  <div className="mb-1 flex items-center justify-between"><p className="text-sm text-gray-500">{stat.label}</p><stat.icon className="h-4 w-4 text-[#080936]" /></div>
                  <p className="text-4xl font-regular text-[#080936]">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {hasContent && !showSkeleton && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#080936]">View projects</h2>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-[14px] border-gray-300 bg-white pl-10 h-11 shadow-none focus-visible:ring-1 focus-visible:ring-[#6D58BB]" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="min-h-[400px]">
          {showSkeleton ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => <VideoCardSkeleton key={i} />)}
             </div>
          ) : (
            <>
              {!hasContent ? (
                <motion.div initial={{ opacity: 0, scale:0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[24px] border border-gray-200 py-24">
                    <h2 className="mb-2 text-5xl font-medium text-[#080936]">Create My First Video</h2>
                    <p className="mb-8 text-gray-500">Scale your reach with high-converting AI videos</p>
                    <Link href="/inputs">
                      <Button size="lg" className="rounded-xl bg-[#6D58BB] px-8 py-7 text-xl font-normal text-white hover:bg-[#080936] cursor-pointer">
                        Start Creating Now <ArrowRight className="ml-2 h-6 w-6" />
                      </Button>
                    </Link>
                  </CardContent>
                </motion.div>
              ) : hasNoResults ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-[#080936]">No results for "{searchQuery}"</h3>
                  <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 text-[#6D58BB]">Clear search</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredPrompts.map((p: ActivePrompt, idx: number) => (
                      <motion.div key={p.projectId} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full transition-shadow hover:shadow-md rounded-[24px] overflow-hidden">
                          <CardContent className="p-0">   
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                              <Image 
                                src={`/assets/avatars/${p.replicaId || "default"}.jpg`} 
                                alt={p.title || "Project preview"}
                                fill
                                priority={idx < 2} // Prioridad a los primeros prompts ficticios
                                className="object-cover object-top grayscale-[0.2]"
                              />
                              <Badge className="rounded-[20px] font-normal absolute top-2 right-2 z-10 bg-[#FFF4CA] text-[#8F3F01]">queued</Badge>
                            </div>
                            <div className="p-5 space-y-2">
                              <h2 className="text-2xl text-[#272830] font-medium truncate">{p.title || "New Project"}</h2>
                              <div className="flex items-center gap-2 pt-3">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                <span className="text-[12px] text-gray-400">Generating script...</span>
                              </div>
                              <Button disabled className="w-full h-10 mt-3 bg-[#E2F2FE] text-[#2056E0] rounded-[20px] gap-2 border-none">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Queued...
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                    {filteredVideos.map((v, idx) => (
                      <VideoCard 
                        key={v.videoId} 
                        video={v} 
                        token={token} 
                        projectName={getProjectName(v.projectId)} 
                        onOpenVideo={handleOpenVideo} 
                        getStatusBadge={getStatusBadge}
                        onFinalized={handleFinalizedSinc}
                        priority={idx < 4} // Carga prioritaria para los primeros 4 videos reales
                      />
                    ))}

                    {!searchQuery && (
                      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Link href="/inputs" className="h-full block group">
                          <Card className="border-2 border-dashed border-gray-200 bg-transparent h-full min-h-[380px] flex flex-col items-center justify-center p-8 transition-all hover:border-[#6D58BB] hover:bg-white rounded-[24px]">
                            <div className="rounded-full bg-gray-100 p-4 mb-4 group-hover:bg-[#E2F2FE]">
                              <Plus className="h-8 w-8 text-gray-400 group-hover:text-[#6D58BB]" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 group-hover:text-[#6D58BB]">Create new project</h3>
                          </Card>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {isVideoModalOpen && frozenVideoRef.current && (
        <VideoPreviewModal videoHtml={frozenVideoRef.current.embed || (frozenVideoRef.current as any).metaData?.embed} onClose={handleCloseVideo} />
      )}
      <AppFooter />
    </div>
  );
}