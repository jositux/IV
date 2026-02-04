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
import useSWR from "swr"; 
import { motion, AnimatePresence } from "framer-motion";

import { useBackendAuth } from "@/hooks/use-backend-auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { getVideosByUser, type UserVideo } from "@/services/video/video-by-user";
import { getListProjects, type Project } from "@/services/get-list-projects";
import { getProjectById } from "@/services/get-project-by-id";

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

// --- VIDEO CARD COMPONENT ---
const VideoCard = memo(function VideoCard({ 
  video: initialVideo, 
  token, 
  projectName, 
  onOpenVideo, 
  getStatusBadge,
  onFinalized 
}: {
  video: UserVideo;
  token: string | null;
  projectName: string;
  onOpenVideo: (v: UserVideo) => void;
  getStatusBadge: (s: string) => { color: string };
  onFinalized: () => void;
}) {
  const isTransient = ["processing", "queued", "pending"].includes(initialVideo.status?.toLowerCase());
  
  const { data: updatedData } = useSWR(
    isTransient && token && initialVideo.projectId ? ["project-status", token, initialVideo.projectId] : null,
    projectFetcher, { refreshInterval: 8000, revalidateOnFocus: false }
  );
  
  const video = (updatedData?.videos?.[0] || initialVideo) as UserVideo;
  const status = video.status.toLowerCase();
  const isProcessing = ["processing", "queued", "pending"].includes(status);
  const dateTime = formatVideoDate(video.createdAt);

  useEffect(() => {
    if (initialVideo.status.toLowerCase() !== "completed" && status === "completed") {
      onFinalized();
    }
  }, [status, initialVideo.status, onFinalized]);

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full rounded-[24px] overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <img src={`/assets/avatars/${video.replicaId || "default"}.jpg`} className="w-full h-full object-cover object-top" alt="" />
            {status === "completed" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button className="rounded-full bg-white text-gray-900 w-16 h-16 shadow-lg cursor-pointer" onClick={() => onOpenVideo(video)}>
                  <Play className="w-8 h-8 ml-1" fill="#6D58BB" color="#6D58BB" />
                </Button>
              </div>
            )}
            <Badge className={`rounded-[20px] font-normal absolute top-2 right-2 ${getStatusBadge(status).color}`}>
              {status}
            </Badge>
          </div>
          <div className="p-5 space-y-2">
            <Link href={`/generation/${video.projectId}/`}>
              <h2 className="text-2xl text-[#272830] font-medium truncate hover:text-[#6D58BB] cursor-pointer">{projectName || "Untitled Project"}</h2>
            </Link>
            <p className="text-sm text-[#272830] line-clamp-1 italic min-h-[40px]">"{video.prompt?.replace(/<[^>]*>?/gm, "")}"</p>
            <div className="flex items-center justify-between pt-3">
              <div className="flex gap-2 text-[12px]">
                {(video.duration ?? 0) > 0 && <span className="bg-[#E2F2FE] text-[#2056E0] font-light px-2 py-1 rounded-[20px]"><Clock className="w-3 h-3 inline mr-1" />{video.duration} sec</span>}
                {(video.creditsCharged ?? 0) > 0 && <span className="bg-[#FFF4CA] text-[#8F3F01] font-light px-2 py-1 rounded-[20px]"><CreditCard className="w-3 h-3 inline mr-1" />{video.creditsCharged} credits</span>}
              </div>
              {dateTime && <div className="text-[11px] text-[#272830] font-light text-right leading-tight"><div>{dateTime.date}</div><div className="opacity-80">{dateTime.time}</div></div>}
            </div>
            <div className="pt-3">
              {isProcessing ? (
                <Button disabled className="w-full h-10 bg-[#E2F2FE] text-[#2056E0] rounded-[20px] gap-2 border-none">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                </Button>
              ) : status === "completed" ? (
                <Link href={`/generation/${video.projectId}/`} className="w-full">
                  <Button variant="ghost" className="w-full h-10 bg-[#E2F2FE] text-[#080936] rounded-[20px] hover:bg-[#6D58BB] hover:text-white transition-all cursor-pointer">
                    View Project <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              ) : <Button disabled className="w-full h-10 bg-red-50 text-red-600 rounded-[20px] border-none italic">Failed</Button>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// --- DASHBOARD CLIENT ---
interface DashboardClientProps {
  initialVideos: UserVideo[];
  initialProjects: Project[];
  serverToken: string;
}

export default function DashboardClient({ initialVideos, initialProjects, serverToken }: DashboardClientProps) {
  const [videos, setVideos] = useState<UserVideo[]>(initialVideos);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activePrompts, setActivePrompts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const { backendUser } = useBackendAuth();
  const { projectedBalance, mutate: mutateUserProfile } = useUserProfile();
  const frozenVideoRef = useRef<UserVideo | null>(null);

  // Hydration guard para evitar el parpadeo
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const loadDashboardData = useCallback(async (authToken: string, userId: string) => {
    try {
      const [vRes, pRes] = await Promise.all([getVideosByUser(authToken, userId), getListProjects(authToken)]);
      if (vRes.data) setVideos(vRes.data);
      if (pRes.success) setProjects(pRes.data);
      
      const promptsStr = localStorage.getItem("active_prompt_generations") || "[]";
      const genProjectsStr = localStorage.getItem("active_generation_projects") || "{}";
      const prompts = JSON.parse(promptsStr);
      const genProjects = JSON.parse(genProjectsStr);
      // Filtramos proyectos que están en fase de PROMPT localmente
      setActivePrompts(prompts.filter((p: any) => genProjects[p.projectId]?.activeStep === "PROMPT"));
    } catch (err) { console.error("Error al refrescar dashboard:", err); }
  }, []);

  const handleFinalizedSync = useCallback(async () => {
    if (serverToken && backendUser?.id) {
      await loadDashboardData(serverToken, backendUser.id);
      mutateUserProfile();
    }
  }, [serverToken, backendUser?.id, loadDashboardData, mutateUserProfile]);

  useEffect(() => {
    if (!backendUser?.id || !serverToken) return;
    loadDashboardData(serverToken, backendUser.id);
    const interval = setInterval(() => {
      loadDashboardData(serverToken, backendUser.id);
    }, 15000);
    return () => clearInterval(interval);
  }, [backendUser?.id, serverToken, loadDashboardData]);

  const filteredVideos = useMemo(() => videos.filter(v => {
    const pName = projects.find(p => p.projectId === v.projectId)?.projectName || "";
    const q = searchQuery.toLowerCase();
    return pName.toLowerCase().includes(q) || (v.prompt || "").toLowerCase().includes(q);
  }), [videos, projects, searchQuery]);

  const filteredPrompts = useMemo(() => activePrompts.filter(p => {
    const q = searchQuery.toLowerCase();
    return (p.title || "").toLowerCase().includes(q) || (p.topic || "").toLowerCase().includes(q);
  }), [activePrompts, searchQuery]);

  const totalCompletedCount = useMemo(() => videos.filter(v => v.status?.toLowerCase() === "completed").length, [videos]);

  const getStatusBadge = (s: string) => {
    const v: any = { completed: "bg-[#6D58BB] text-white", processing: "bg-[#E2F2FE] text-[#2056E0]", failed: "bg-red-100 text-red-800" };
    return { color: v[s.toLowerCase()] || "bg-[#FFF4CA] text-[#8F3F01]" };
  };

  // La lógica clave: Si hay algo en el servidor, ya tiene contenido.
  const hasContent = initialVideos.length > 0 || videos.length > 0 || activePrompts.length > 0;

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto py-16 px-4 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-medium text-[#080936]">Dashboard</h1>
          {hasContent && (
            <Link href="/inputs">
              <Button size="lg" className="rounded-xl bg-[#6D58BB] px-6 py-6 text-xl font-normal text-white hover:bg-[#080936] cursor-pointer">
                <Plus className="mr-2 h-5 w-5" /> Create new project
              </Button>
            </Link>
          )}
        </div>

        {/* STATS */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total videos", value: totalCompletedCount, icon: Video }, 
            { label: "Available Credits", value: projectedBalance ?? 0, icon: CreditCard }, 
            { label: "Deliverables", value: totalCompletedCount * 5, icon: FileText }, 
            { label: "Landing Pages", value: 0, icon: Monitor }
          ].map((stat) => (
            <Card key={stat.label} className="border-1 bg-white shadow-none border-gray-200 rounded-[24px]">
              <CardContent className="px-6 flex flex-col justify-center min-h-[110px]">
                <div className="mb-1 flex items-center justify-between"><p className="text-sm text-gray-500">{stat.label}</p><stat.icon className="h-4 w-4 text-[#080936]" /></div>
                <p className="text-4xl font-regular text-[#080936]">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="min-h-[400px]">
          {hasContent ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#080936]">View projects</h2>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search projects..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="rounded-[14px] border-gray-300 bg-white pl-10 h-11 focus-visible:ring-[#6D58BB]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredPrompts.map((p) => (
                    <motion.div key={`prompt-${p.projectId}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 h-full overflow-hidden rounded-[24px]">
                        <div className="aspect-video relative">
                          <img src={`/assets/avatars/${p.replicaId || "default"}.jpg`} className="w-full h-full object-cover grayscale-[0.2]" alt="" />
                          <Badge className="absolute top-2 right-2 bg-[#FFF4CA] text-[#8F3F01]">queued</Badge>
                        </div>
                        <div className="p-5 space-y-2">
                          <h2 className="text-2xl text-[#272830] font-medium truncate">{p.title || "New Project"}</h2>
                          <div className="flex items-center gap-2 pt-3">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            <span className="text-[12px] text-gray-400">Generating script...</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {filteredVideos.map((v) => (
                    <VideoCard 
                      key={v.videoId} 
                      video={v} 
                      token={serverToken} 
                      projectName={projects.find(p => p.projectId === v.projectId)?.projectName || ""} 
                      onOpenVideo={(vid) => { frozenVideoRef.current = vid; setIsVideoModalOpen(true); }} 
                      getStatusBadge={getStatusBadge}
                      onFinalized={handleFinalizedSync}
                    />
                  ))}

                  {!searchQuery && (
                    <motion.div layout key="new-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Link href="/inputs" className="h-full block group">
                        <Card className="border-2 border-dashed border-gray-200 bg-transparent h-full min-h-[380px] flex flex-col items-center justify-center p-8 transition-all hover:border-[#6D58BB] hover:bg-white rounded-[24px] cursor-pointer">
                          <div className="rounded-full bg-gray-100 p-4 mb-4 group-hover:bg-[#E2F2FE] transition-colors">
                            <Plus className="h-8 w-8 text-gray-400 group-hover:text-[#6D58BB]" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 group-hover:text-[#6D58BB]">Create new project</h3>
                        </Card>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            // Solo mostramos el estado vacío si realmente no hay nada y el cliente ya hidrató
            isHydrated && (
              <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[24px] border border-gray-200 py-24">
                <h2 className="mb-2 text-5xl font-medium text-[#080936]">Create My First Video</h2>
                <p className="mb-8 text-gray-500">Scale your reach with high-converting AI videos</p>
                <Link href="/inputs">
                  <Button size="lg" className="rounded-xl bg-[#6D58BB] px-8 py-7 text-xl text-white">
                    Start Creating Now <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </CardContent>
            )
          )}
        </div>
      </main>

      {isVideoModalOpen && frozenVideoRef.current && (
        <VideoPreviewModal 
          videoHtml={frozenVideoRef.current.embed || (frozenVideoRef.current as any).metaData?.embed} 
          onClose={() => setIsVideoModalOpen(false)} 
        />
      )}
      <AppFooter />
    </div>
  );
}