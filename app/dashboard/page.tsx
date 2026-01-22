"use client";
import { useState, useEffect } from "react";
import {
  Video,
  FileText,
  FileCheck,
  Monitor,
  Search,
  ArrowRight,
  Play,
  Clock,
  CreditCard,
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
  const [activeFilter, setActiveFilter] = useState("All videos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [fullUserData, setFullUserData] = useState<UserProfile | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [videoCount, setVideoCount] = useState(0);
  // CAMBIO: Inicializamos en true para evitar el destello del empty state
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const {
    user: auth0User,
    isLoading: auth0Loading,
    getAccessTokenSilently,
  } = useAuth0();
  const {
    backendUser,
    loading: backendLoading,
    error: backendError,
  } = useBackendAuth();

  useEffect(() => {
    if (backendUser?.id) {
      const loadFullProfile = async () => {
        setDetailsLoading(true);
        try {
          const data = await fetchUserProfile(backendUser.id);
          setFullUserData(data);
          localStorage.setItem("user", backendUser.id);
        } catch (err) {
          console.error("Error fetching full profile:", err);
        } finally {
          setDetailsLoading(false);
        }
      };
      loadFullProfile();
    }
  }, [backendUser?.id]);

  useEffect(() => {
    if (backendUser?.id) {
      const loadVideosAndProjects = async () => {
        setVideosLoading(true);
        setVideosError(null);
        try {
          const token = await getAuthToken();
          const [videosResponse, projectsResponse] = await Promise.all([
            getVideosByUser(token, backendUser.id),
            getListProjects(token),
          ]);
          setVideos(videosResponse.data);
          setVideoCount(videosResponse.count);
          if (projectsResponse.success) {
            setProjects(projectsResponse.data);
          }
        } catch (err) {
          console.error("Error fetching videos:", err);
          setVideosError("Failed to load videos");
        } finally {
          setVideosLoading(false);
        }
      };
      loadVideosAndProjects();
    }
  }, [backendUser?.id, getAccessTokenSilently]);

  const getProjectName = (projectId: string | null): string | null => {
    if (!projectId) return null;
    const project = projects.find((p) => p.projectId === projectId);
    return project?.projectName || null;
  };

  const filteredVideos = videos.filter((video) => {
    const title = getProjectName(video.projectId)?.toLowerCase() || "";
    const prompt = (video.prompt || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || prompt.includes(query);
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        color: string;
      }
    > = {
      completed: { variant: "default", color: "bg-green-100 text-green-800" },
      processing: { variant: "secondary", color: "bg-blue-100 text-blue-800" },
      pending: { variant: "outline", color: "bg-yellow-100 text-yellow-800" },
      failed: { variant: "destructive", color: "bg-red-100 text-red-800" },
    };
    return variants[status.toLowerCase()] || variants.pending;
  };

  const handlePlayVideo = (video: UserVideo) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const updatedStats = [
    { label: "Total videos", value: videoCount, icon: Video },
    { label: "Total deliverables", value: 0, icon: FileCheck },
    { label: "long form articles", value: 0, icon: FileText },
    { label: "Landing pages", value: 0, icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />

      <main className="mx-auto py-16">
        <h1 className="mb-8 text-5xl font-medium text-[#080936]">Dashboard</h1>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {updatedStats.map((stat) => (
            <Card
              key={stat.label}
              className="border-1 bg-white shadow-none border-gray-200"
            >
              <CardContent className="px-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <stat.icon className="h-5 w-5 text-gray-900" />
                </div>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold text-[#080936]">
            View projects
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-light transition-colors ${
                  activeFilter === filter
                    ? "bg-gray-700 text-white"
                    : "bg-[#E2F2FE] text-[#080936] hover:bg-gray-300"
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

        {videosLoading ? (
          <Card className="border-0 bg-white">
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-600">Loading your videos...</p>
            </CardContent>
          </Card>
        ) : videosError ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-600">{videosError}</p>
            </CardContent>
          </Card>
        ) : !videosLoading && videos.length === 0 ? ( // CAMBIO: Solo muestra si terminó de cargar Y no hay videos
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
            <h2 className="mb-4 text-5xl font-medium text-[#080936]">
              Create My First video
            </h2>
            <p className="mb-4 text-[#3E4462]">
              PDFs, Word docs, and Web pages are ≈ 400 words each
            </p>
            <Link href="/inputs">
              <Button
                size="lg"
                className="rounded-xl bg-[#6D58BB] px-4 py-6 text-lg font-semibold text-white hover:bg-gray-900 cursor-pointer"
              >
                Start Creating Now
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredVideos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex min-h-[200px] items-center justify-center text-gray-400 italic"
                >
                  No projects found matching your search.
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  <AnimatePresence>
                    {filteredVideos
                      .filter(
                        (video) => video.status.toLowerCase() !== "failed"
                      )
                      .map((video) => (
                        <motion.div
                          key={video.videoId}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full">
                            <CardContent className="p-0">
                              <div className="relative aspect-video">
                                {video.thumbnailURL ? (
                                  <img
                                    src={`/assets/avatars/${video.replicaId}.jpg`}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover rounded-t-lg"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-t-lg flex items-center justify-center">
                                    <Video className="w-12 h-12 text-white" />
                                  </div>
                                )}
                                {video.status.toLowerCase() === "completed" &&
                                  video.embed && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                                      <Button
                                        size="lg"
                                        className="rounded-full bg-white/90 hover:bg-white text-gray-900 w-16 h-16 p-0 cursor-pointer"
                                        onClick={() => handlePlayVideo(video)}
                                      >
                                        <Play
                                          className="w-8 h-8 ml-1"
                                          fill="#6D58BB"
                                          color="#6D58BB"
                                        />
                                      </Button>
                                    </div>
                                  )}
                                <div className="absolute top-2 right-2">
                                  <Badge
                                    className={
                                      getStatusBadge(video.status).color
                                    }
                                  >
                                    {video.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="p-5 space-y-4 bg-white rounded-b-xl border-t border-gray-100">
                                {getProjectName(video.projectId) && (
                                  <div className="flex items-center gap-2">
                                    <Link
                                      href={`/generation/${video?.videoId}/`}
                                      className="w-full"
                                    >
                                      <h2 className="text-2xl text-[#272830] font-medium truncate">
                                        {getProjectName(video.projectId)}
                                      </h2>
                                    </Link>
                                  </div>
                                )}
                                <div className="relative">
                                  <p className="text-sm leading-relaxed text-[#272830] line-clamp-1 min-h-[40px] italic">
                                    "{video.prompt?.replace(/<[^>]*>?/gm, "")}"
                                  </p>
                                </div>
                                <div className="h-px bg-gray-50 w-full" />
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {video.duration && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium text-[10px] uppercase tracking-wider">
                                          <Clock className="w-3 h-3" />
                                          <span>{video.duration} sec</span>
                                        </div>
                                      )}
                                      {video.creditsCharged && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-md font-medium text-[10px] uppercase tracking-wider">
                                          <CreditCard className="w-3 h-3" />
                                          <span>
                                            {video.creditsCharged} credits
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-[12px] font-light text-gray-400">
                                      {new Date(
                                        video.createdAt
                                      ).toLocaleDateString("es-ES", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                                    {video.status.toLowerCase() ===
                                      "completed" && (
                                      <Link
                                        href={`/generation/${video?.videoId}/`}
                                        className="w-full"
                                      >
                                        <Button
                                          variant="ghost"
                                          className="w-full h-10 px-4 flex items-center justify-center gap-2 bg-[#E2F2FE] text-[#080936] hover:bg-[#6D58BB] hover:text-white text-[13px] font-normal rounded-[20px] transition-all border-none cursor-pointer"
                                        >
                                          View Project{" "}
                                          <ArrowRight className="w-3.5 h-3.5" />
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Create More section */}
        {!videosLoading && videos.length > 0 && (
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center bg-white rounded-[20px] mt-16">
            <h2 className="mb-4 text-5xl font-medium text-[#080936]">
              Create More Videos
            </h2>
            <p className="mb-4 text-[#3E4462]">
              PDFs, Word docs, and Web pages are ≈ 400 words each
            </p>
            <Link href="/inputs">
              <Button
                size="lg"
                className="rounded-xl bg-[#6D58BB] px-4 py-6 text-lg font-semibold text-white hover:bg-gray-900 cursor-pointer"
              >
                Go to create <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        )}
      </main>

      {/* DIALOG ORIGINAL (SIN TOCAR) */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden &>button]:hidden">
          <Button
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-2 right-2 z-100 bg-black"
          >
            Close
          </Button>
          <DialogHeader className="sr-only">
            <DialogTitle>Video Player</DialogTitle>
          </DialogHeader>
          {selectedVideo?.embed ? (
            <div className="aspect-video w-full bg-black">
              <div
                className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full"
                dangerouslySetInnerHTML={{ __html: selectedVideo.embed }}
              />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-200 w-full text-gray-500">
              No video available
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AppFooter />
    </div>
  );
}
