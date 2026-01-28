"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Video,
  FileText,
  Monitor,
  Search,
  ArrowRight,
  Play,
  Clock,
  CreditCard,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { useBackendAuth } from "@/hooks/use-backend-auth";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import {
  fetchUserProfile,
  type UserProfile,
} from "@/services/user-full-service";
import {
  getVideosByUser,
  type UserVideo,
} from "@/services/video/video-by-user";
import { getAuthToken } from "@/lib/get-auth-token";
import { getListProjects, type Project } from "@/services/get-list-projects";
import { getCreditHistory } from "@/services/get-credits";
import { reprocessVideo } from "@/services/video/reprocess-video";
import { motion, AnimatePresence } from "framer-motion";

const filters = [
  "All videos",
  "Videos only",
  "Articles",
  "Landing pages",
  "Ommny channel",
  "Documents",
];

export default function Dashboard() {
  // --- UI STATE ---
  const [activeFilter, setActiveFilter] = useState("All videos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // --- DATA STATE ---
  const [fullUserData, setFullUserData] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  // --- PERSISTENCE STATE ---
  const [rebuildingIds, setRebuildingIds] = useState<string[]>([]);

  // --- LOADING & ERROR STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [videosError, setVideosError] = useState<string | null>(null);

  const { backendUser } = useBackendAuth();

  /**
   * INITIAL HYDRATION
   */
  useEffect(() => {
    const saved = localStorage.getItem("pending_rebuilds");
    if (saved) setRebuildingIds(JSON.parse(saved));
  }, []);

  /**
   * CENTRALIZED DATA LOADING
   */
  const loadDashboardData = useCallback(async () => {
    if (!backendUser?.id) return;

    setIsLoading(true);
    setVideosError(null);

    try {
      const token = await getAuthToken();

      const [profileData, videosResponse, projectsResponse, creditsResponse] = await Promise.all([
        fetchUserProfile(backendUser.id),
        getVideosByUser(token, backendUser.id),
        getListProjects(token),
        getCreditHistory(token, backendUser.id)
      ]);

      const freshVideos = videosResponse.data;

      // CLEANUP LOGIC: Remove project if status is "completed"
      const saved = localStorage.getItem("pending_rebuilds");
      if (saved) {
        const pendingList: string[] = JSON.parse(saved);
        const stillPending = pendingList.filter(id => {
          const video = freshVideos.find((v: any) => v.projectId === id);
          return video && video.status.toLowerCase() !== "completed";
        });
        localStorage.setItem("pending_rebuilds", JSON.stringify(stillPending));
        setRebuildingIds(stillPending);
      }

      setFullUserData(profileData);
      setVideos(freshVideos);
      setVideoCount(videosResponse.count);
      
      if (projectsResponse.success) setProjects(projectsResponse.data);
      if (creditsResponse.success) setCurrentBalance(creditsResponse.data.currentBalance);

      localStorage.setItem("user", backendUser.id);
    } catch (err) {
      console.error("Critical Dashboard Error:", err);
      setVideosError("Failed to load your creative studio data");
    } finally {
      setIsLoading(false);
    }
  }, [backendUser?.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /**
   * REBUILD VIDEO
   */
  const handleRebuild = async (videoId: string, projectId: string) => {
    if (!backendUser?.id) return;
    try {
      const newRebuildingList = [...rebuildingIds, projectId];
      setRebuildingIds(newRebuildingList);
      localStorage.setItem("pending_rebuilds", JSON.stringify(newRebuildingList));

      const token = await getAuthToken();
      setVideos((prev) =>
        prev.map((v) => (v.tavusVideoId === videoId ? { ...v, status: "queued" } : v))
      );
      await reprocessVideo(token, videoId);
      const creditsRes = await getCreditHistory(token, backendUser.id);
      if (creditsRes.success) setCurrentBalance(creditsRes.data.currentBalance);
    } catch (error) {
      console.error("Video rebuild failed:", error);
      const rollback = rebuildingIds.filter(id => id !== projectId);
      setRebuildingIds(rollback);
      localStorage.setItem("pending_rebuilds", JSON.stringify(rollback));
    }
  };

  const getProjectName = (projectId: string | null): string | null => {
    if (!projectId) return null;
    return projects.find((p) => p.projectId === projectId)?.projectName || null;
  };

  const filteredVideos = videos.filter((video) => {
    const title = getProjectName(video.projectId)?.toLowerCase() || "";
    const prompt = (video.prompt || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || prompt.includes(query);
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string }> = {
      completed: { color: "bg-green-100 text-green-800" },
      processing: { color: "bg-blue-100 text-blue-800" },
      queued: { color: "bg-blue-100 text-blue-800" },
      failed: { color: "bg-red-100 text-red-800" },
      pending: { color: "bg-yellow-100 text-yellow-800" },
    };
    return variants[status.toLowerCase()] || variants.pending;
  };

  const stats = [
    { label: "Total videos", value: videoCount, icon: Video },
    { label: "Available Credits", value: currentBalance, icon: CreditCard },
    { label: "long form articles", value: 0, icon: FileText },
    { label: "Landing pages", value: 0, icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />

      <main className="mx-auto py-16">
        <h1 className="mb-8 text-5xl font-medium text-[#080936]">Dashboard</h1>

        {/* --- STATS SECTION --- */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-1 bg-white shadow-none border-gray-200">
              <CardContent className="px-6 py-0">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <stat.icon className="h-5 w-5 text-gray-900" />
                </div>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- FILTERS SECTION --- */}
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold text-[#080936]">View projects</h2>
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-light transition-colors ${
                  activeFilter === filter ? "bg-gray-700 text-white" : "bg-[#E2F2FE] text-[#080936] hover:bg-gray-300"
                }`}
              >
                {filter}
              </button>
            ))}
            <div className="relative ml-auto w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border-gray-300 bg-white pl-10 pr-4"
              />
            </div>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        {isLoading ? (
          <Card className="border-0 bg-white">
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-600">Syncing dashboard...</p>
            </CardContent>
          </Card>
        ) : videosError ? (
          <Card className="border-red-200 bg-red-50 p-6"><p className="text-red-600">{videosError}</p></Card>
        ) : filteredVideos.length === 0 ? (
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
            <h2 className="mb-4 text-5xl font-medium text-[#080936]">Create My First video</h2>
            <Link href="/inputs">
              <Button size="lg" className="rounded-xl bg-[#6D58BB] px-6 py-6 text-lg font-semibold text-white hover:bg-gray-900">
                Start Creating Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((video) => {
                  const status = video.status.toLowerCase();
                  const isFailed = status === "failed";
                  const isProcessing = status === "processing" || status === "queued";
                  const isCurrentlyRebuilding = rebuildingIds.includes(video.projectId || "");
                  const canRebuild = isFailed && currentBalance >= (video.creditsCharged || 0);
                  
                  // Badge logic
                  const displayStatus = (isCurrentlyRebuilding && isFailed) ? "queued" : status;

                  return (
                    <motion.div key={video.videoId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full">
                        <CardContent className="p-0">
                          <div className="relative aspect-video">
                            <img src={`/assets/avatars/${video.replicaId || 'default'}.jpg`} alt="Video" className="w-full h-full object-cover rounded-t-lg" />
                            {status === "completed" && video.embed && (
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
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider"><Clock className="w-3 h-3 inline mr-1" />{video.duration || 0} sec</span>
                                <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider"><CreditCard className="w-3 h-3 inline mr-1" />{video.creditsCharged || 0} credits</span>
                              </div>
                            </div>
                            <div className="pt-3">
                              {isCurrentlyRebuilding || isProcessing ? (
                                <Button disabled className="w-full h-10 bg-blue-50 text-blue-600 rounded-[20px] gap-2 border-none">
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {status === "processing" ? "Processing..." : "Queued..."}
                                </Button>
                              ) : status === "completed" ? (
                                <Link href={`/generation/${video.projectId}/`} className="w-full"><Button variant="ghost" className="w-full h-10 bg-[#E2F2FE] text-[#080936] rounded-[20px] hover:bg-[#6D58BB] hover:text-white transition-all cursor-pointer">View Project <ArrowRight className="w-3.5 h-3.5 ml-2" /></Button></Link>
                              ) : isFailed && canRebuild ? (
                                <Button onClick={() => handleRebuild(video.tavusVideoId, video.projectId!)} className="w-full h-10 bg-[#6D58BB] text-white rounded-[20px] gap-2"><RefreshCw className="w-3.5 h-3.5" /> Rebuild Video</Button>
                              ) : isFailed && !canRebuild ? (
                                <Link href="/credits" className="w-full">
                                  <Button className="w-full h-10 bg-red-600 text-white rounded-[20px] gap-2">
                                    <CreditCard className="w-3.5 h-3.5" /> Buy Credits
                                  </Button>
                                </Link>
                              ) : (
                                <Button disabled variant="outline" className="w-full h-10 rounded-[20px] text-gray-400 italic border-none bg-gray-50">Processing...</Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* CREATE MORE SECTION */}
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

      {/* --- VIDEO PLAYER MODAL --- */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black border-none ring-0">
          <div className="relative aspect-video w-full">
            <Button variant="ghost" size="icon" onClick={() => setIsVideoModalOpen(false)} className="absolute top-4 right-4 z-[110] bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md">
              <X className="h-6 w-6" />
            </Button>
            <DialogHeader className="sr-only"><DialogTitle>Video Player</DialogTitle></DialogHeader>
            {selectedVideo?.embed ? (
              <div className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full" dangerouslySetInnerHTML={{ __html: selectedVideo.embed }} />
            ) : (
              <div className="flex h-full items-center justify-center text-white italic">Video source not found.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AppFooter />
    </div>
  );
}