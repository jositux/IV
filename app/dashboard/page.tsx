"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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
  SearchX,
  Plus,
  Sparkles,
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
import useSWR from "swr";

import { useBackendAuth } from "@/hooks/use-backend-auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { fetchUserProfile } from "@/services/user-full-service";
import {
  getVideosByUser,
  type UserVideo,
} from "@/services/video/video-by-user";
import { getAuthToken } from "@/lib/get-auth-token";
import { getListProjects, type Project } from "@/services/get-list-projects";
import { getProjectById } from "@/services/get-project-by-id";
import { getCreditHistory } from "@/services/get-credits";
import { reprocessVideo } from "@/services/video/reprocess-video";
import { motion, AnimatePresence } from "framer-motion";

// --- FETCHERS ---
const projectFetcher = async ([_, token, projectId]: [
  string,
  string,
  string
]) => {
  const res = await getProjectById(token, projectId);
  return res.data;
};

// --- SIMULATED PROMPT CARD ---
function PromptPlaceholderCard({
  title,
}: {
  title: string;
  projectId: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 h-full overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-gradient-to-br from-[#6D58BB]/10 via-[#F3F0FF] to-[#E2F2FE] flex items-center justify-center overflow-hidden">
            <Sparkles className="w-10 h-10 text-[#6D58BB] animate-pulse" />
            <Badge className="absolute top-2 right-2 bg-[#6D58BB] text-white border-none">
              PHASE: PROMPT
            </Badge>
          </div>
          <div className="p-5 space-y-4">
            <h2 className="text-2xl text-[#6D58BB] font-medium truncate">
              {title}
            </h2>
            <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">
              Generating script and preparing AI assets...
            </p>
            <div className="pt-3 border-t">
              <Button
                disabled
                variant="outline"
                className="w-full h-10 rounded-[20px] text-[#6D58BB] border-[#6D58BB]/20 bg-[#F3F0FF]/30 gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing
                Prompt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- VIDEO CARD COMPONENT ---
function VideoCard({
  video: initialVideo,
  token,
  getProjectName,
  rebuildingIds,
  currentBalance,
  handleRebuild,
  setSelectedVideo,
  setIsVideoModalOpen,
  getStatusBadge,
}: any) {
  const isTransient = ["processing", "queued", "pending"].includes(
    initialVideo.status?.toLowerCase()
  );

  const { data: updatedData } = useSWR(
    () => {
      if (!isTransient || !initialVideo.projectId || !token) return null;
      const stored = localStorage.getItem("active_generation_projects");
      if (stored) {
        const projects = JSON.parse(stored);
        const currentProject = projects[initialVideo.projectId];
        if (currentProject && currentProject.activeStep !== "VIDEO")
          return null;
      }
      return ["project-status", token, initialVideo.projectId];
    },
    projectFetcher,
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  const video = updatedData?.videos?.[0] || initialVideo;
  const status = video.status.toLowerCase();
  const isFailed = status === "failed";
  const isProcessing = status === "processing" || status === "queued";
  const isCurrentlyRebuilding = rebuildingIds.includes(video.projectId || "");
  const canRebuild = isFailed && currentBalance >= (video.creditsCharged || 0);
  const displayStatus = isCurrentlyRebuilding && isFailed ? "queued" : status;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <img
              src={`/assets/avatars/${video.replicaId || "default"}.jpg`}
              alt="Video"
              className="w-full h-full object-cover rounded-t-lg"
            />
            {status === "completed" &&
              (video.embed || video.metaData?.embed) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    className="rounded-full bg-white text-gray-900 w-16 h-16 shadow-lg"
                    onClick={() => {
                      setSelectedVideo(video);
                      setIsVideoModalOpen(true);
                    }}
                  >
                    <Play
                      className="w-8 h-8 ml-1"
                      fill="#6D58BB"
                      color="#6D58BB"
                    />
                  </Button>
                </div>
              )}
            <Badge
              className={`absolute top-2 right-2 ${
                getStatusBadge(displayStatus).color
              }`}
            >
              {displayStatus}
            </Badge>
          </div>
          <div className="p-5 space-y-4">
            <Link href={`/generation/${video.projectId}/`}>
              <h2 className="text-2xl text-[#272830] font-medium truncate hover:text-[#6D58BB] transition-colors">
                {getProjectName(video.projectId) || "Untitled Project"}
              </h2>
            </Link>
            <p className="text-sm text-[#272830] line-clamp-1 min-h-[40px] italic">
              "{video.prompt?.replace(/<[^>]*>?/gm, "")}"
            </p>
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
              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                {video.createdAt
                  ? new Date(video.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No date"}
              </div>
            </div>
            <div className="pt-3">
              {isCurrentlyRebuilding || isProcessing ? (
                <Button
                  disabled
                  className="w-full h-10 bg-blue-50 text-blue-600 rounded-[20px] gap-2 border-none"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />{" "}
                  {status === "processing" ? "Processing..." : "Queued..."}
                </Button>
              ) : status === "completed" ? (
                <Link
                  href={`/generation/${video.projectId}/`}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    className="w-full h-10 bg-[#E2F2FE] text-[#080936] rounded-[20px] hover:bg-[#6D58BB] hover:text-white transition-all cursor-pointer"
                  >
                    View Project <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              ) : isFailed && canRebuild ? (
                <Button
                  onClick={() =>
                    handleRebuild(video.tavusVideoId, video.projectId!)
                  }
                  className="w-full h-10 bg-[#6D58BB] text-white rounded-[20px] gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Rebuild Video
                </Button>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="w-full h-10 rounded-[20px] text-gray-400 italic border-none bg-gray-50"
                >
                  Processing...
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- MAIN DASHBOARD ---
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [rebuildingIds, setRebuildingIds] = useState<string[]>([]);
  const [activePrompts, setActivePrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const { backendUser } = useBackendAuth();
  const { mutate: mutateUser } = useUserProfile();
  const hasLoadedInitialData = useRef(false);

  const syncActivePrompts = useCallback(() => {
    const promptsStr = localStorage.getItem("active_prompt_generations");
    const genProjectsStr = localStorage.getItem("active_generation_projects");
    if (!promptsStr) {
      setActivePrompts([]);
      return;
    }
    const prompts = JSON.parse(promptsStr);
    const genProjects = genProjectsStr ? JSON.parse(genProjectsStr) : {};
    const updatedPrompts = prompts.filter((p: any) => {
      const state = genProjects[p.projectId];
      return state && state.activeStep === "PROMPT";
    });
    if (updatedPrompts.length !== prompts.length) {
      localStorage.setItem(
        "active_prompt_generations",
        JSON.stringify(updatedPrompts)
      );
    }
    setActivePrompts(updatedPrompts);
  }, []);

  const loadDashboardData = useCallback(
    async (authToken: string, userId: string, includeCredits = false) => {
      try {
        const tasks: any[] = [
          getVideosByUser(authToken, userId),
          getListProjects(authToken),
        ];
        if (includeCredits) {
          tasks.push(fetchUserProfile(userId));
          tasks.push(getCreditHistory(authToken, userId));
        }
        const results = await Promise.all(tasks);
        setVideos(results[0].data || []);
        setVideoCount(results[0].count || 0);
        if (results[1].success) setProjects(results[1].data);
        if (includeCredits && results[3]?.success) {
          setCurrentBalance(results[3].data.currentBalance);
          mutateUser(results[2], false);
        }
        syncActivePrompts();
        return results[0].data;
      } catch (err) {
        console.error(err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [mutateUser, syncActivePrompts]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function init() {
      if (backendUser?.id) {
        localStorage.setItem("user", backendUser.id);
        const authToken = await getAuthToken();
        setToken(authToken);
        if (!hasLoadedInitialData.current) {
          await loadDashboardData(authToken, backendUser.id, true);
          hasLoadedInitialData.current = true;
        }
        interval = setInterval(async () => {
          syncActivePrompts();
          const stored = localStorage.getItem("active_generation_projects");
          if (!stored || stored === "{}") return;
          const waiting = Object.keys(JSON.parse(stored)).filter(
            (id) => JSON.parse(stored)[id].activeStep === "VIDEO"
          );
          if (waiting.length === 0) return;
          const current = await loadDashboardData(
            authToken,
            backendUser.id,
            false
          );
          if (
            waiting.every((id) =>
              current.map((v: any) => v.projectId).includes(id)
            )
          ) {
            await loadDashboardData(authToken, backendUser.id, true);
          }
        }, 8000);
      }
    }
    init();
    return () => clearInterval(interval);
  }, [backendUser?.id, loadDashboardData, syncActivePrompts]);

  const handleRebuild = async (videoId: string, projectId: string) => {
    if (!backendUser?.id || !token) return;
    try {
      setRebuildingIds((prev) => [...prev, projectId]);
      await reprocessVideo(token, videoId);
      await loadDashboardData(token, backendUser.id, true);
    } catch (error) {
      setRebuildingIds((prev) => prev.filter((id) => id !== projectId));
    }
  };

  const getProjectName = (id: string | null) =>
    projects.find((p) => p.projectId === id)?.projectName || null;
  const filteredVideos = videos.filter((v) =>
    (getProjectName(v.projectId) || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const filteredPrompts = activePrompts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getStatusBadge = (s: string) => {
    const v: any = {
      completed: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
    };
    return { color: v[s.toLowerCase()] || "bg-yellow-100 text-yellow-800" };
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-medium text-[#080936]">Dashboard</h1>
          <Link href="/inputs">
            <Button
              size="lg"
              className="rounded-xl bg-[#6D58BB] px-6 py-6 text-lg font-semibold text-white hover:bg-[#080936] cursor-pointer"
            >
              <Plus className="mr-2 h-5 w-5" /> Create new project
            </Button>
          </Link>
        </div>

        {/* STATS GRID - 4 CARDS RESTORED */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total videos", value: videoCount, icon: Video },
            {
              label: "Available Credits",
              value: currentBalance,
              icon: CreditCard,
            },
            { label: "Articles", value: 0, icon: FileText },
            { label: "Landing Pages", value: 0, icon: Monitor },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="border-1 bg-white shadow-none border-gray-200"
            >
              <CardContent className="px-6 flex flex-col justify-center">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-gray-600 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <stat.icon className="h-4 w-4 text-gray-900" />
                </div>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#080936]">
            View projects
          </h2>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full border-gray-300 bg-white pl-10 h-11"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="min-h-[400px]">
            {videos.length === 0 && activePrompts.length === 0 ? (
              <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[24px] border-1 border-gray-200 py-24">
                <p className="mb-2 text-gray-500 max-w-sm text-lg">
                  No video yet{" "}
                </p>
                <h2 className="mb-2 text-5xl font-medium text-[#080936]">
                  Create My First Video{" "}
                </h2>
                <p className="mb-8 text-gray-500 max-w-sm text-sm">
                PDFs, Word docs, and Web pages are ≈ 400 words each
                </p>
               

                <Link href="/inputs">
                  <Button
                    size="lg"
                    className="rounded-xl bg-[#6D58BB] px-8 py-7 text-xl font-semibold text-white hover:bg-[#080936] transition-all cursor-pointer"
                  >
                    Start Creating Now{" "}
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </CardContent>
            ) : filteredVideos.length === 0 && filteredPrompts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200 py-20"
              >
                <SearchX className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-2xl font-medium text-[#080936]">
                  No results for "{searchQuery}"
                </h3>
                <Button
                  variant="link"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-[#6D58BB] font-semibold underline"
                >
                  Clear search
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredPrompts.map((p) => (
                      <PromptPlaceholderCard
                        key={p.projectId}
                        title={p.title}
                        projectId={p.projectId}
                      />
                    ))}
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video.videoId}
                        video={video}
                        token={token}
                        getProjectName={getProjectName}
                        rebuildingIds={rebuildingIds}
                        currentBalance={currentBalance}
                        handleRebuild={handleRebuild}
                        setSelectedVideo={setSelectedVideo}
                        setIsVideoModalOpen={setIsVideoModalOpen}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center bg-white rounded-[20px] mt-16 border border-gray-100">
                  <h2 className="mb-4 text-5xl font-medium text-[#080936]">
                    Create More Videos
                  </h2>
                  <p className="mb-4 text-[#3E4462]">
                    PDFs, Word docs, and Web pages are ≈ 400 words each
                  </p>
                  <Link href="/inputs">
                    <Button
                      size="lg"
                      className="rounded-xl bg-[#6D58BB] px-6 py-6 text-lg font-semibold text-white hover:bg-black cursor-pointer transition-all"
                    >
                      Go to create <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </>
            )}
          </div>
        )}
      </main>

      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black overflow-hidden border-none sm:rounded-2xl">
          <div className="relative aspect-video w-full flex items-center justify-center bg-black">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-3 right-3 z-[110] bg-black text-white rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
            {selectedVideo && (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedVideo.embed ||
                    (selectedVideo as any).metaData?.embed ||
                    "",
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
