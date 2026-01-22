"use client"
import { useState, useEffect } from "react"
import { Video, FileText, FileCheck, Monitor, Search, ArrowRight, Play, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { useUser } from "@/hooks/use-user"
import { useBackendAuth } from "@/hooks/use-backend-auth"
import { AppHeader } from "@/components/shared/app-header"
import { fetchUserProfile, type UserProfile } from "@/services/user-full-service"
import { getVideosByUser, type UserVideo } from "@/services/video/video-by-user"
import { getAuthToken } from "@/lib/get-auth-token"

const stats = [
  { label: "Total videos", value: 0, icon: Video },
  { label: "Total deliverables", value: 0, icon: FileCheck },
  { label: "long form articles", value: 0, icon: FileText },
  { label: "Landing pages", value: 0, icon: Monitor },
]

const filters = ["All videos", "Videos only", "Articles", "Landing pages", "Ommny channel", "Documents"]

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("All videos")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const [fullUserData, setFullUserData] = useState<UserProfile | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const [videos, setVideos] = useState<UserVideo[]>([])
  const [videoCount, setVideoCount] = useState(0)
  const [videosLoading, setVideosLoading] = useState(false)
  const [videosError, setVideosError] = useState<string | null>(null)

  const { user: auth0User, isLoading: auth0Loading } = useUser()
  const { backendUser, loading: backendLoading, error: backendError } = useBackendAuth()

  useEffect(() => {
    if (backendUser?.id) {
      const loadFullProfile = async () => {
        setDetailsLoading(true)
        try {
          const data = await fetchUserProfile(backendUser.id)
          setFullUserData(data)
          localStorage.setItem("user", backendUser.id)
        } catch (err) {
          console.error("Error fetching full profile:", err)
        } finally {
          setDetailsLoading(false)
        }
      }
      loadFullProfile()
    }
  }, [backendUser?.id])

  useEffect(() => {
    if (backendUser?.id) {
      const loadVideos = async () => {
        setVideosLoading(true)
        setVideosError(null)
        try {
          const token = await getAuthToken()
          const response = await getVideosByUser(token, backendUser.id)
          setVideos(response.data)
          setVideoCount(response.count)
        } catch (err) {
          console.error("Error fetching videos:", err)
          setVideosError("Failed to load videos")
        } finally {
          setVideosLoading(false)
        }
      }
      loadVideos()
    }
  }, [backendUser?.id])

  const isLoading = auth0Loading || backendLoading

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
      completed: { variant: "default", color: "bg-green-100 text-green-800" },
      processing: { variant: "secondary", color: "bg-blue-100 text-blue-800" },
      pending: { variant: "outline", color: "bg-yellow-100 text-yellow-800" },
      failed: { variant: "destructive", color: "bg-red-100 text-red-800" },
    }
    return variants[status.toLowerCase()] || variants.pending
  }

  const handlePlayVideo = (video: UserVideo) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }

  const updatedStats = [
    { label: "Total videos", value: videoCount, icon: Video },
    { label: "Total deliverables", value: 0, icon: FileCheck },
    { label: "long form articles", value: 0, icon: FileText },
    { label: "Landing pages", value: 0, icon: Monitor },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-8 text-5xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-bold text-lg">Auth0 Profile</h3>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div className="text-base">{auth0User?.email}</div>
              </div>
              {auth0User?.picture && (
                <img src={auth0User.picture || "/placeholder.svg"} alt="Profile" className="w-12 h-12 rounded-full" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-bold text-lg">Account Details</h3>
              {isLoading || detailsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                  Cargando información de cuenta...
                </div>
              ) : backendError ? (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded">Error: {backendError}</div>
              ) : fullUserData ? (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">User ID</div>
                    <div className="text-xs font-mono bg-gray-100 p-1 rounded">{fullUserData.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Available Credits</div>
                    <div className="text-2xl font-bold text-pink-600">
                      {fullUserData.currentCreditBalance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Subscription</div>
                    <div className="text-base capitalize">{fullUserData.subscriptionType || "Free Plan"}</div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No details found.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {updatedStats.map((stat) => (
            <Card key={stat.label} className="border-gray-200 bg-white">
              <CardContent className="p-6">
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
          <h2 className="mb-4 text-xl font-semibold text-gray-900">View projects</h2>
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          <Card className="border-gray-200 bg-white">
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
        ) : videos.length === 0 ? (
          <Card className="border-gray-200 bg-white">
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
              <p className="mb-6 text-lg text-gray-600">No videos yet</p>
              <h2 className="mb-4 text-5xl font-bold text-gray-900">Create My First Video</h2>
              <Link href="/video-inputs">
                <Button
                  size="lg"
                  className="rounded-full bg-pink-500 px-8 py-6 text-lg font-semibold text-white hover:bg-pink-600"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Go to create
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card key={video.videoId} className="border-gray-200 bg-white hover:shadow-lg transition-shadow group">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    {video.thumbnailURL ? (
                      <img
                        src={video.thumbnailURL || "/placeholder.svg"}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-t-lg flex items-center justify-center">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                    )}

                    {video.status.toLowerCase() === "completed" && video.embed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                        <Button
                          size="lg"
                          className="rounded-full bg-white/90 hover:bg-white text-gray-900 w-16 h-16 p-0"
                          onClick={() => handlePlayVideo(video)}
                        >
                          <Play className="w-8 h-8 ml-1" fill="currentColor" />
                        </Button>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      <Badge className={getStatusBadge(video.status).color}>{video.status}</Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-sm text-gray-700 line-clamp-2 min-h-[40px]">{video.prompt}</p>

                    <div className="flex flex-col gap-2 text-xs text-gray-500">
                      {video.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{video.duration}s</span>
                        </div>
                      )}
                      {video.creditsCharged && (
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          <span>{video.creditsCharged} credits</span>
                        </div>
                      )}
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Player</DialogTitle>
          </DialogHeader>
          {selectedVideo?.embed && (
            <div className="aspect-video">
              <iframe
                src={selectedVideo.embed}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
