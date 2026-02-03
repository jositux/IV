"use client";
import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import {
  Video, FileText, Monitor, Search, ArrowRight, Play, Clock, CreditCard, RefreshCw, Plus, Sparkles, X,
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

// --- HELPERS ---
const formatVideoDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const dayMonthYear = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return { date: dayMonthYear, time };
};

const projectFetcher = async ([_, token, projectId]: [string, string, string]) => {
  const res = await getProjectById(token, projectId);
  return res.data;
};

// --- VIDEO CARD COMPONENT ---
const VideoCard = memo(function VideoCard({ video: initialVideo, token, projectName, onOpenVideo, getStatusBadge, onFinalized }: any) {
  const initialStatus = initialVideo.status?.toLowerCase();
  const isInitiallyTransient = ["processing", "queued", "pending"].includes(initialStatus);

  const { data: updatedData } = useSWR(
    isInitiallyTransient && token && initialVideo.projectId ? ["project-status", token, initialVideo.projectId] : null,
    projectFetcher,
    { refreshInterval: 8000, revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const video = updatedData?.videos?.[0] || initialVideo;
  const status = video.status.toLowerCase();
  const isProcessing = ["processing", "queued", "pending"].includes(status);
  const dateTime = formatVideoDate(video.createdAt);

  useEffect(() => {
    if (initialStatus !== "completed" && status === "completed") onFinalized();
  }, [status, initialStatus, onFinalized]);

  return (
    <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full transition-shadow hover:shadow-md rounded-[24px] overflow-hidden flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img src={`/assets/avatars/${video.replicaId || "default"}.jpg`} className="w-full h-full object-cover object-top" alt="" />
          {status === "completed" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button className="rounded-full bg-white text-gray-900 w-16 h-16 shadow-lg cursor-pointer" onClick={() => onOpenVideo(video)}>
                <Play className="w-8 h-8 ml-1" fill="#6D58BB" color="#6D58BB" />
              </Button>
            </div>
          )}
          <Badge className={`rounded-[20px] font-normal absolute top-2 right-2 pointer-events-none ${getStatusBadge(status).color}`}>{status}</Badge>
        </div>
        <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <Link href={`/generation/${video.projectId}/`} className="cursor-pointer">
              <h2 className="text-2xl text-[#272830] font-medium truncate hover:text-[#6D58BB]">{projectName || "Untitled Project"}</h2>
            </Link>
            <p className="text-sm text-[#272830] line-clamp-1 italic min-h-[40px]">"{video.prompt?.replace(/<[^>]*>?/gm, "") || ""}"</p>
          </div>
          <div className="pt-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2 text-[12px]">
                {(video.duration || 0) > 0 && <span className="bg-[#E2F2FE] text-[#2056E0] font-light px-2 py-1 rounded-[20px] flex items-center"><Clock className="w-3 h-3 mr-1" />{video.duration} sec</span>}
                {(video.creditsCharged || 0) > 0 && <span className="bg-[#FFF4CA] text-[#8F3F01] font-light px-2 py-1 rounded-[20px] flex items-center"><CreditCard className="w-3 h-3 mr-1" />{video.creditsCharged} credits</span>}
              </div>
              {dateTime && <div className="text-[11px] text-[#272830] font-light text-right leading-tight"><div>{dateTime.date}</div><div className="opacity-80">{dateTime.time}</div></div>}
            </div>
            {isProcessing ? (
              <Button disabled className="w-full h-10 bg-[#E2F2FE] text-[#2056E0] rounded-[20px] gap-2 border-none"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...</Button>
            ) : status === "completed" ? (
              <Link href={`/generation/${video.projectId}/`} className="w-full"><Button variant="ghost" className="w-full h-10 bg-[#E2F2FE] text-[#080936] rounded-[20px] hover:bg-[#6D58BB] hover:text-white transition-all">View Project <ArrowRight className="w-3.5 h-3.5 ml-2" /></Button></Link>
            ) : <Button disabled className="w-full h-10 bg-red-50 text-red-600 rounded-[20px] border-none italic">Failed</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// --- SKELETON ---
const VideoCardSkeleton = () => (
  <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden h-full">
    <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
    <div className="p-5 space-y-4">
      <div className="h-7 bg-gray-100 animate-pulse rounded-md w-3/4" />
      <div className="h-4 bg-gray-50 animate-pulse rounded-md w-full" />
      <div className="h-10 bg-gray-50 animate-pulse rounded-[20px] w-full mt-4" />
    </div>
  </div>
);

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activePrompts, setActivePrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const { backendUser } = useBackendAuth();
  const { projectedBalance, mutate: mutateUserProfile } = useUserProfile();
  const frozenVideoRef = useRef<UserVideo | null>(null);
  const hasLoadedInitialData = useRef(false);

  const handleOpenVideo = useCallback((v: UserVideo) => { frozenVideoRef.current = JSON.parse(JSON.stringify(v)); setIsVideoModalOpen(true); }, []);
  const handleCloseVideo = useCallback(() => setIsVideoModalOpen(false), []);

  const loadDashboardData = useCallback(async (authToken: string, userId: string) => {
    try {
      const [vRes, pRes] = await Promise.all([getVideosByUser(authToken, userId), getListProjects(authToken)]);
      const currentVideos = vRes.data || [];
      const videoIds = new Set(currentVideos.map((v: any) => v.projectId));
      const promptsStr = typeof window !== "undefined" ? localStorage.getItem("active_prompt_generations") || "[]" : "[]";
      const filteredPrompts = JSON.parse(promptsStr).filter((p: any) => !videoIds.has(p.projectId));

      setVideos(currentVideos);
      if (pRes.success) setProjects(pRes.data);
      setActivePrompts(filteredPrompts);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function init() {
      if (!backendUser?.id) return;
      const authToken = await getAuthToken();
      setToken(authToken);
      if (!hasLoadedInitialData.current) { await loadDashboardData(authToken, backendUser.id); mutateUserProfile(); hasLoadedInitialData.current = true; }
      interval = setInterval(() => loadDashboardData(authToken, backendUser.id), 20000);
    }
    init();
    return () => clearInterval(interval);
  }, [backendUser?.id, loadDashboardData, mutateUserProfile]);

  const getProjectName = useCallback((id: string | null) => projects.find((p) => p.projectId === id)?.projectName || "", [projects]);

  const visibleItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const items = [
      ...activePrompts.map(p => ({ type: "prompt", data: p, id: p.projectId, uniqueKey: `prompt-${p.projectId}` })),
      ...videos.map(v => ({ type: "video", data: v, id: v.projectId, uniqueKey: `video-${v.projectId}` }))
    ];
    if (!q) return items;
    return items.filter(item => {
      const title = item.type === "video" ? getProjectName(item.id) : (item.data.title || "");
      const promptText = item.type === "video" ? (item.data.prompt || "") : (item.data.topic || "");
      return String(title).toLowerCase().includes(q) || String(promptText).toLowerCase().includes(q);
    });
  }, [videos, activePrompts, searchQuery, getProjectName]);

  const hasContentInSystem = videos.length > 0 || activePrompts.length > 0;
  const getStatusBadge = (s: string) => {
    const v: any = { completed: "bg-[#6D58BB] text-white", processing: "bg-[#E2F2FE] text-[#2056E0]", failed: "bg-red-100 text-red-800" };
    return { color: v[s.toLowerCase()] || "bg-[#FFF4CA] text-[#8F3F01]" };
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto py-16 px-4 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-medium text-[#080936]">Dashboard</h1>
          {hasContentInSystem && !isLoading && (
            <Link href="/inputs">
              <Button size="lg" className="rounded-xl bg-[#6D58BB] px-6 py-6 text-xl font-normal text-white hover:bg-[#080936] cursor-pointer"><Plus className="mr-2 h-5 w-5" /> Create new project</Button>
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[{ label: "Total videos", value: videos.filter(v => v.status?.toLowerCase() === "completed").length, icon: Video },
            { label: "Available Credits", value: projectedBalance ?? 0, icon: CreditCard },
            { label: "Deliverables", value: videos.filter(v => v.status?.toLowerCase() === "completed").length * 5, icon: FileText },
            { label: "Landing Pages", value: 0, icon: Monitor }].map((stat) => (
            <Card key={stat.label} className="border-1 bg-white shadow-none border-gray-200 rounded-[24px]">
              <CardContent className="px-6 flex flex-col justify-center">
                <div className="mb-1 flex items-center justify-between"><p className="text-sm text-gray-500">{stat.label}</p><stat.icon className="h-4 w-4 text-[#080936]" /></div>
                <p className="text-4xl font-regular text-[#080936]">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {hasContentInSystem && !isLoading && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#080936]">View projects</h2>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-[14px] border-gray-300 bg-white pl-10 h-11 focus-visible:ring-[#6D58BB]" />
              {searchQuery && <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" onClick={() => setSearchQuery("")} />}
            </div>
          </div>
        )}

        <div className="min-h-[400px]">
          {isLoading && !hasLoadedInitialData.current ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <VideoCardSkeleton key={i} />)}
            </div>
          ) : !hasContentInSystem ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[24px] border border-gray-200 py-24">
              <h2 className="mb-2 text-5xl font-medium text-[#080936]">Create My First Video</h2>
              <p className="mb-8 text-gray-500">Scale your reach with high-converting AI videos</p>
              <Link href="/inputs"><Button size="lg" className="rounded-xl bg-[#6D58BB] px-8 py-7 text-xl text-white cursor-pointer">Start Creating Now <ArrowRight className="ml-2 h-6 w-6" /></Button></Link>
            </div>
          ) : searchQuery && visibleItems.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 bg-white rounded-[24px] border border-dashed border-gray-300 w-full">
               <div className="bg-gray-100 p-4 rounded-full mb-4"><Search className="h-8 w-8 text-gray-400" /></div>
               <h3 className="text-xl font-medium text-[#080936]">No projects found</h3>
               <p className="text-gray-500 mt-1">We couldn't find anything matching "{searchQuery}"</p>
               <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 text-[#6D58BB] cursor-pointer">Clear search</Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleItems.map((item) => (
                  <motion.div key={item.uniqueKey} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    {item.type === "video" ? (
                      <VideoCard video={item.data} token={token} projectName={getProjectName(item.id)} onOpenVideo={handleOpenVideo} getStatusBadge={getStatusBadge} onFinalized={() => loadDashboardData(token!, backendUser!.id)} />
                    ) : (
                      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 h-full overflow-hidden rounded-[24px] flex flex-col">
                        <CardContent className="p-0 flex-1 flex flex-col">
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <img src={`/assets/avatars/${item.data.replicaId || "default"}.jpg`} className="w-full h-full object-cover object-top grayscale-[0.2]" alt="" />
                            <Badge className="rounded-[20px] font-normal absolute top-2 right-2 bg-[#FFF4CA] text-[#8F3F01] pointer-events-none">queued</Badge>
                          </div>
                          <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                            <div>
                              <h2 className="text-2xl text-[#272830] font-medium truncate">{item.data.title || "New Project"}</h2>
                              <p className="text-sm text-[#272830] line-clamp-1 italic min-h-[40px] opacity-60">"{item.data.topic || "Processing content..."}"</p>
                            </div>
                            <div className="pt-3">
                              <div className="flex items-center gap-2 mb-3 text-amber-500 font-light text-[12px]"><Sparkles className="w-3.5 h-3.5 animate-pulse" /> Generating script...</div>
                              <Button disabled className="w-full h-10 bg-[#E2F2FE] text-[#2056E0] rounded-[20px] border-none"><RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" /> Queued...</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
                {!searchQuery && (
                  <motion.div key="add-new-card" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Link href="/inputs" className="h-full block group">
                      <Card className="border-2 border-dashed border-gray-200 bg-transparent h-full min-h-[380px] flex flex-col items-center justify-center p-8 transition-all hover:border-[#6D58BB] hover:bg-white rounded-[24px]">
                        <div className="rounded-full bg-gray-100 p-4 mb-4 group-hover:bg-[#E2F2FE] transition-colors"><Plus className="h-8 w-8 text-gray-400 group-hover:text-[#6D58BB]" /></div>
                        <h3 className="text-xl font-medium text-gray-900 group-hover:text-[#6D58BB] cursor-pointer">Create new project</h3>
                      </Card>
                    </Link>
                  </motion.div>
                )}
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