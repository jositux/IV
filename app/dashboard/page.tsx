"use client";
import { useState, useEffect, useCallback, useRef, memo } from "react";
import {
  Video, FileText, Monitor, Search, ArrowRight, Play, Clock, CreditCard, RefreshCw, SearchX, Plus, Sparkles,
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
import { getAuthToken } from "@/lib/get-auth-token";
import { getListProjects, type Project } from "@/services/get-list-projects";
import { getProjectById } from "@/services/get-project-by-id";
import { getCreditHistory } from "@/services/get-credits";
import { reprocessVideo } from "@/services/video/reprocess-video";

// --- HELPERS ---
const formatVideoDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const dayMonthYear = date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
  return { date: dayMonthYear, time };
};

// --- SKELETON ---
function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <div className="p-5 space-y-4">
            <div className="h-7 bg-gray-200 rounded-md w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded-md w-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

const projectFetcher = async ([_, token, projectId]: [string, string, string]) => {
  const res = await getProjectById(token, projectId);
  return res.data;
};

// --- VIDEO CARD ---
const VideoCard = memo(function VideoCard({
  video: initialVideo,
  token,
  projectName,
  rebuildingIds,
  currentBalance,
  handleRebuild,
  onOpenVideo,
  getStatusBadge,
}: any) {
  const isTransient = ["processing", "queued", "pending"].includes(initialVideo.status?.toLowerCase());
  const { data: updatedData } = useSWR(
    isTransient && token && initialVideo.projectId ? ["project-status", token, initialVideo.projectId] : null,
    projectFetcher,
    { refreshInterval: 5000, revalidateOnFocus: false }
  );

  const video = updatedData?.videos?.[0] || initialVideo;
  const status = video.status.toLowerCase();
  const isFailed = status === "failed";
  const isProcessing = status === "processing" || status === "queued";
  const isCurrentlyRebuilding = rebuildingIds.includes(video.projectId || "");
  const canRebuild = isFailed && currentBalance >= (video.creditsCharged || 0);
  const displayStatus = isCurrentlyRebuilding && isFailed ? "queued" : status;

  const showDuration = video.duration && video.duration > 0;
  const showCredits = video.creditsCharged && video.creditsCharged > 0;
  const dateTime = formatVideoDate(video.createdAt);

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <img src={`/assets/avatars/${video.replicaId || "default"}.jpg`} className="w-full h-full object-cover rounded-t-lg" alt="" />
            {status === "completed" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button className="rounded-full bg-white text-gray-900 w-16 h-16 shadow-lg" onClick={() => onOpenVideo(video)}>
                  <Play className="w-8 h-8 ml-1" fill="#6D58BB" color="#6D58BB" />
                </Button>
              </div>
            )}
            <Badge className={`absolute top-2 right-2 ${getStatusBadge(displayStatus).color}`}>
              {displayStatus}
            </Badge>
          </div>
          <div className="p-5 space-y-4">
            <Link href={`/generation/${video.projectId}/`}>
              <h2 className="text-2xl text-[#272830] font-medium truncate hover:text-[#6D58BB]">{projectName || "Untitled Project"}</h2>
            </Link>
            <p className="text-sm text-[#272830] line-clamp-1 italic min-h-[40px]">"{video.prompt?.replace(/<[^>]*>?/gm, "")}"</p>
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex gap-2 text-[10px] font-bold uppercase">
                {showDuration && <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded"><Clock className="w-3 h-3 inline mr-1" />{video.duration} sec</span>}
                {showCredits && <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded"><CreditCard className="w-3 h-3 inline mr-1" />{video.creditsCharged}</span>}
              </div>
              {dateTime && (
                <div className="text-[10px] text-gray-400 font-medium uppercase text-right leading-tight">
                  <div className="whitespace-nowrap">{dateTime.date}</div>
                  <div className="opacity-80 whitespace-nowrap">{dateTime.time}</div>
                </div>
              )}
            </div>
            <div className="pt-3">
              {isCurrentlyRebuilding || isProcessing ? (
                <Button disabled className="w-full h-10 bg-blue-50 text-blue-600 rounded-[20px] gap-2 border-none">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {status === "processing" ? "Processing..." : "Queued..."}
                </Button>
              ) : status === "completed" ? (
                <Link href={`/generation/${video.projectId}/`} className="w-full">
                  <Button variant="ghost" className="w-full h-10 bg-[#E2F2FE] text-[#080936] rounded-[20px] hover:bg-[#6D58BB] hover:text-white transition-all">
                    View Project <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              ) : isFailed && canRebuild ? (
                <Button onClick={() => handleRebuild(video.tavusVideoId, video.projectId!)} className="w-full h-10 bg-[#6D58BB] text-white rounded-[20px] gap-2 hover:bg-[#080936]">
                  <RefreshCw className="w-3.5 h-3.5" /> Rebuild Video
                </Button>
              ) : (
                <Button disabled className="w-full h-10 rounded-[20px] text-gray-400 italic bg-gray-50 border-none">Processing...</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [rebuildingIds, setRebuildingIds] = useState<string[]>([]);
  const [activePrompts, setActivePrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const frozenVideoRef = useRef<UserVideo | null>(null);

  const { backendUser } = useBackendAuth();
  const { mutate: mutateUser } = useUserProfile();
  const hasLoadedInitialData = useRef(false);

  const handleOpenVideo = useCallback((v: UserVideo) => { 
    frozenVideoRef.current = JSON.parse(JSON.stringify(v)); 
    setIsVideoModalOpen(true); 
  }, []);
  const handleCloseVideo = useCallback(() => setIsVideoModalOpen(false), []);

  const loadDashboardData = useCallback(async (authToken: string, userId: string) => {
    try {
      const [vRes, pRes, cRes] = await Promise.all([
        getVideosByUser(authToken, userId),
        getListProjects(authToken),
        getCreditHistory(authToken, userId)
      ]);
      
      setVideos(vRes.data || []);
      if (pRes.success) setProjects(pRes.data);
      
      if (cRes?.success) {
        const newBalance = cRes.data.currentBalance;
        setCurrentBalance(newBalance);
        
        // 1. Intentamos actualizar el objeto actual
        const rawUser = localStorage.getItem("user");
        let updatedUser;

        if (rawUser) {
          updatedUser = JSON.parse(rawUser);
          updatedUser.currentCreditBalance = newBalance;
        } else {
          // Si no existe, lo creamos con lo mínimo para que el Header no explote
          updatedUser = { 
            id: userId, 
            currentCreditBalance: newBalance 
          };
        }

        // 2. Escribimos en LocalStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // 3. ¡ESTA ES LA CLAVE! Disparamos un evento global para que el Header despierte
        window.dispatchEvent(new Event("storage"));

        // 4. Forzamos al Hook de SWR a aceptar el nuevo valor
        mutateUser(updatedUser, false);
      }
      
      const promptsStr = localStorage.getItem("active_prompt_generations") || "[]";
      const genProjectsStr = localStorage.getItem("active_generation_projects") || "{}";
      const prompts = JSON.parse(promptsStr);
      const genProjects = JSON.parse(genProjectsStr);
      setActivePrompts(prompts.filter((p: any) => genProjects[p.projectId]?.activeStep === "PROMPT"));

    } catch (err) { console.error("Dashboard data error:", err); } finally { setIsLoading(false); }
  }, [mutateUser]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function init() {
      if (!backendUser?.id) return;
      const authToken = await getAuthToken();
      setToken(authToken);
      if (!hasLoadedInitialData.current) { 
        await loadDashboardData(authToken, backendUser.id); 
        hasLoadedInitialData.current = true; 
      }
      interval = setInterval(() => {
        loadDashboardData(authToken, backendUser.id);
      }, 10000);
    }
    init();
    return () => clearInterval(interval);
  }, [backendUser?.id, loadDashboardData]);

  const getStatusBadge = (s: string) => {
    const v: any = { completed: "bg-green-100 text-green-800", processing: "bg-blue-100 text-blue-800", failed: "bg-red-100 text-red-800" };
    return { color: v[s.toLowerCase()] || "bg-yellow-100 text-yellow-800" };
  };

  const handleRebuild = async (videoId: string, projectId: string) => {
    if (!token) return;
    setRebuildingIds(prev => [...prev, projectId]);
    await reprocessVideo(token, videoId);
    loadDashboardData(token, backendUser!.id);
  };

  const getProjectName = (id: string | null) => projects.find(p => p.projectId === id)?.projectName || "";

  const filteredVideos = videos.filter(v => 
    getProjectName(v.projectId).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.prompt || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPrompts = activePrompts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-medium text-[#080936]">Dashboard</h1>
          <Link href="/inputs"><Button size="lg" className="rounded-xl bg-[#6D58BB] px-6 py-6 text-lg font-semibold text-white hover:bg-black"><Plus className="mr-2 h-5 w-5" /> Create new project</Button></Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total videos", value: videos.length, icon: Video },
            { label: "Available Credits", value: currentBalance, icon: CreditCard },
            { label: "Articles", value: 0, icon: FileText },
            { label: "Landing Pages", value: 0, icon: Monitor },
          ].map((stat) => (
            <Card key={stat.label} className="border-1 bg-white shadow-none border-gray-200">
              <CardContent className="px-6 h-24 flex flex-col justify-center">
                <div className="mb-1 flex items-center justify-between"><p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p><stat.icon className="h-4 w-4 text-gray-900" /></div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#080936]">View projects</h2>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-full border-gray-300 bg-white pl-10 h-11" />
          </div>
        </div>

        <div className="min-h-[400px]">
          {isLoading ? <DashboardSkeleton /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPrompts.map((p) => (
                  <motion.div key={p.projectId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Card className="border-1 bg-white p-0 shadow-none border-gray-200 h-full overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-[#6D58BB]/10 to-[#E2F2FE] flex items-center justify-center"><RefreshCw className="w-10 h-10 text-[#6D58BB] animate-spin" /></div>
                      <div className="p-5"><h2 className="text-2xl text-[#6D58BB] font-medium truncate">{p.title}</h2><div className="flex items-center gap-2 mt-2"><Sparkles className="w-3.5 h-3.5 text-amber-500" /><p className="text-sm text-gray-400 italic">Generating script...</p></div></div>
                    </Card>
                  </motion.div>
                ))}
                {filteredVideos.map((v) => (
                  <VideoCard key={v.videoId} video={v} token={token} projectName={getProjectName(v.projectId)} rebuildingIds={rebuildingIds} currentBalance={currentBalance} handleRebuild={handleRebuild} onOpenVideo={handleOpenVideo} getStatusBadge={getStatusBadge} />
                ))}
              </AnimatePresence>
            </div>
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