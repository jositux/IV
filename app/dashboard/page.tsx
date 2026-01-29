"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Video, FileText, Monitor, Search, ArrowRight, Play, Clock, CreditCard, RefreshCw, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { useBackendAuth } from "@/hooks/use-backend-auth";
import { useProjectStatus } from "./hooks/use-project-status";
import { useUserProfile } from "@/hooks/use-user-profile"; // Importamos el hook compartido
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { fetchUserProfile, type UserProfile } from "@/services/user-full-service";
import { getVideosByUser, type UserVideo } from "@/services/video/video-by-user";
import { getAuthToken } from "@/lib/get-auth-token";
import { getListProjects, type Project } from "@/services/get-list-projects";
import { getCreditHistory } from "@/services/get-credits";
import { reprocessVideo } from "@/services/video/reprocess-video";
import { motion, AnimatePresence } from "framer-motion";

// --- VIDEO CARD COMPONENT ---
function VideoCard({ video: initialVideo, token, getProjectName, rebuildingIds, currentBalance, handleRebuild, setSelectedVideo, setIsVideoModalOpen, getStatusBadge }: any) {
  const { updatedVideo } = useProjectStatus(initialVideo.projectId, token, initialVideo.status);
  const video = updatedVideo || initialVideo;
  const status = video.status.toLowerCase();
  const isFailed = status === "failed";
  const isProcessing = status === "processing" || status === "queued";
  const isCurrentlyRebuilding = rebuildingIds.includes(video.projectId || "");
  const canRebuild = isFailed && currentBalance >= (video.creditsCharged || 0);
  const displayStatus = (isCurrentlyRebuilding && isFailed) ? "queued" : status;

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <img src={`/assets/avatars/${video.replicaId || 'default'}.jpg`} alt="Video" className="w-full h-full object-cover rounded-t-lg" />
            {status === "completed" && (video.embed || video.metaData?.embed) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button className="rounded-full bg-white text-gray-900 w-16 h-16" onClick={() => { setSelectedVideo(video); setIsVideoModalOpen(true); }}>
                  <Play className="w-8 h-8 ml-1" fill="#6D58BB" color="#6D58BB" />
                </Button>
              </div>
            )}
            <Badge className={`absolute top-2 right-2 ${getStatusBadge(displayStatus).color}`}>{displayStatus}</Badge>
          </div>
          <div className="p-5 space-y-4">
            <Link href={`/generation/${video.projectId}/`}><h2 className="text-2xl text-[#272830] font-medium truncate">{getProjectName(video.projectId) || "Untitled Project"}</h2></Link>
            <p className="text-sm text-[#272830] line-clamp-1 min-h-[40px] italic">"{video.prompt?.replace(/<[^>]*>?/gm, "")}"</p>
            <div className="flex items-center justify-between pt-3 border-t">
  <div className="flex gap-2">
    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
      <Clock className="w-3 h-3 inline mr-1" />
      {video.duration || 0} sec
    </span>
    <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
      <CreditCard className="w-3 h-3 inline mr-1" />
      {video.creditsCharged || 0} credits
    </span>
  </div>
  
  {/* Sección de Fecha añadida */}
  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter flex items-center">
    {video.createdAt ? new Date(video.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) : 'No date'}
  </div>
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
                <Button onClick={() => handleRebuild(video.tavusVideoId, video.projectId!)} className="w-full h-10 bg-[#6D58BB] text-white rounded-[20px] gap-2">
                  <RefreshCw className="w-3.5 h-3.5" /> Rebuild Video
                </Button>
              ) : (
                <Button disabled variant="outline" className="w-full h-10 rounded-[20px] text-gray-400 italic border-none bg-gray-50">Processing...</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- MAIN DASHBOARD PAGE ---
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [rebuildingIds, setRebuildingIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const { backendUser } = useBackendAuth();
  const { mutate: mutateUser } = useUserProfile(); // Hook para sincronizar con el Header
  const hasLoadedInitialData = useRef(false);

  const loadDashboardData = useCallback(async (authToken: string, userId: string) => {
    try {
      const [profileData, videosResponse, projectsResponse, creditsResponse] = await Promise.all([
        fetchUserProfile(userId),
        getVideosByUser(authToken, userId),
        getListProjects(authToken),
        getCreditHistory(authToken, userId)
      ]);

      setVideos(videosResponse.data);
      setVideoCount(videosResponse.count);
      if (projectsResponse.success) setProjects(projectsResponse.data);
      
      if (creditsResponse.success) {
        setCurrentBalance(creditsResponse.data.currentBalance);
        // MUTAMOS EL PERFIL: Esto actualiza el Header instantáneamente
        mutateUser(profileData, false); 
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [mutateUser]);

  useEffect(() => {
    async function init() {
      if (backendUser?.id && !hasLoadedInitialData.current) {
        localStorage.setItem("user", backendUser.id);
        const authToken = await getAuthToken();
        setToken(authToken);
        await loadDashboardData(authToken, backendUser.id);
        hasLoadedInitialData.current = true;
      }
    }
    init();
  }, [backendUser?.id, loadDashboardData]);

  const handleRebuild = async (videoId: string, projectId: string) => {
    if (!backendUser?.id || !token) return;
    try {
      setRebuildingIds(prev => [...prev, projectId]);
      await reprocessVideo(token, videoId);
      // Recargar créditos tras el rebuild para actualizar Header
      const creditsRes = await getCreditHistory(token, backendUser.id);
      if (creditsRes.success) {
          setCurrentBalance(creditsRes.data.currentBalance);
          const freshProfile = await fetchUserProfile(backendUser.id);
          mutateUser(freshProfile, false);
      }
    } catch (error) {
      setRebuildingIds(prev => prev.filter(id => id !== projectId));
    }
  };

  const getProjectName = (id: string | null) => projects.find(p => p.projectId === id)?.projectName || null;
  const filteredVideos = videos.filter(v => (getProjectName(v.projectId) || "").toLowerCase().includes(searchQuery.toLowerCase()));
  const getStatusBadge = (s: string) => {
    const v: any = { completed: "bg-green-100 text-green-800", processing: "bg-blue-100 text-blue-800", queued: "bg-blue-100 text-blue-800", failed: "bg-red-100 text-red-800" };
    return { color: v[s.toLowerCase()] || "bg-yellow-100 text-yellow-800" };
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto py-16">
      <div className="flex items-center justify-between mb-8">
  <h1 className="text-5xl font-medium text-[#080936]">
    Dashboard
  </h1>

  <Link href="/inputs">
    <Button
      size="lg"
      className="rounded-xl bg-[#6D58BB] px-6 py-6 text-lg font-semibold text-white hover:bg-gray-900 cursor-pointer"
    >
      Create new project <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  </Link>
</div>

        {/* STATS */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total videos", value: videoCount, icon: Video },
            { label: "Available Credits", value: currentBalance, icon: CreditCard },
            { label: "Articles", value: 0, icon: FileText },
            { label: "Landing Pages", value: 0, icon: Monitor },
          ].map((stat) => (
            <Card key={stat.label} className="border-1 bg-white shadow-none border-gray-200">
              <CardContent className="px-6 py-0 flex flex-col justify-center">
                <div className="mb-2 flex items-center justify-between"><p className="text-sm text-gray-600">{stat.label}</p><stat.icon className="h-5 w-5 text-gray-900" /></div>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SEARCH */}
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#080936]">View projects</h2>
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-full border-gray-300 bg-white pl-10" />
            </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredVideos.map((video) => (
                  <VideoCard key={video.videoId} video={video} token={token} getProjectName={getProjectName} rebuildingIds={rebuildingIds} currentBalance={currentBalance} handleRebuild={handleRebuild} setSelectedVideo={setSelectedVideo} setIsVideoModalOpen={setIsVideoModalOpen} getStatusBadge={getStatusBadge} />
                ))}
              </AnimatePresence>
            </div>
            
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center bg-white rounded-[20px] mt-16 border border-gray-100">
              <h2 className="mb-4 text-5xl font-medium text-[#080936]">Create More Videos</h2>
              <p className="mb-4 text-[#3E4462]">PDFs, Word docs, and Web pages are ≈ 400 words each</p>
              <Link href="/inputs">
                <Button size="lg" className="rounded-xl bg-[#6D58BB] px-6 py-6 text-lg font-semibold text-white hover:bg-gray-900 cursor-pointer">
                  Go to create <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </>
        )}
      </main>

      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
  <DialogContent className="max-w-5xl p-0 bg-black overflow-hidden border-none ring-0 sm:rounded-2xl">
    <DialogHeader className="sr-only">
      <DialogTitle>Video Player</DialogTitle>
    </DialogHeader>
    
    <div className="relative aspect-video w-full flex items-center justify-center bg-black">
      {/* Botón de cerrar con mejor contraste y posición */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsVideoModalOpen(false)} 
        className="absolute top-3 right-3 z-[110] bg-black/100 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
      >
        <X className="h-6 w-6" />
      </Button>

      {selectedVideo && (
        <div 
          className="w-full h-full flex items-center justify-center 
                     [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:object-contain" 
          dangerouslySetInnerHTML={{ 
            __html: selectedVideo.embed || (selectedVideo as any).metaData?.embed || "" 
          }} 
        />
      )}
    </div>
  </DialogContent>
</Dialog>
      <AppFooter />
    </div>
  );
}