"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Plus, X, FileText, Globe, Trash2, Loader2, Play } from "lucide-react"
import { getVideoReplicas, type Replica } from "@/services/video/video-replicas"
import { generateVideo } from "@/services/video/video-generate"
import { uploadDocument } from "@/services/documents/document-upload"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image" 

const videoLengths = ["30s", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "10m"]

const languages = [
  { code: "en", label: "US English" },
  { code: "es", label: "Es Spanish" },
  { code: "fr", label: "Fr French" },
  { code: "ch", label: "Ch Chinese" },
  { code: "de", label: "De German" },
]

const additionalProducts = [
  {
    title: "Long-Form Article",
    credits: 15,
    description:
      "Transform your video content into comprehensive written articles with GEO optimization for AI search engines, embedded video, and AI-generated images.",
    features: [
      "GEO Optimized for AI Search (ChatGPT, Perplexity, Claude, Gemini)",
      "Auto-Generated Images",
      "SEO & Schema Markup",
    ],
  },
  {
    title: "Video Landing Page",
    credits: 8,
    description:
      "Professional landing page with GEO optimization for AI discovery. Maximize engagement with optimal above-the-fold placement, enhanced typography, and strategic content organization.",
    features: ["GEO Optimized for AI Search Engines", "341% Higher Conversion", "SEO Schema Markup & Mobile Optimized"],
  },
  {
    title: "Omni-Channel Communication Suite",
    credits: 10,
    description:
      "Complete communication package with video-enhanced content across all channels. Includes PowerPoint, LinkedIn/X posts, and email templates.",
    features: ["PowerPoint Presentation", "LinkedIn & X Posts", "Multi-Platform Emails"],
  },
]

export default function VideoInputsPage() {
  const [replicas, setReplicas] = useState<Replica[]>([])
  const [loadingReplicas, setLoadingReplicas] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [selectedReplica, setSelectedReplica] = useState<string>("")
  const [videoLength, setVideoLength] = useState("2m")
  const [language, setLanguage] = useState("en")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [videoPosition, setVideoPosition] = useState("left")
  const [videoSize, setVideoSize] = useState("standard")
  const [primaryFocus, setPrimaryFocus] = useState<"files" | "urls">("files")
  const [topic, setTopic] = useState("")
  const [keywordPhrases, setKeywordPhrases] = useState("")
  const [audience, setAudience] = useState("")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [previewReplicaName, setPreviewReplicaName] = useState<string>("")

  const maxWords = 20000
  const wordsUsed = topic.split(/\s+/).filter((word) => word.length > 0).length
  const wordsRemaining = maxWords - wordsUsed

  useEffect(() => {
    const loadReplicas = async () => {
      try {
        const token = localStorage.getItem("auth_token") || ""
        const response = await getVideoReplicas(token)
        if (response.success && response.data.length > 0) {
          setReplicas(response.data)
          setSelectedReplica(response.data[0].replica_id)
        }
      } catch (err) {
        setError("Failed to load avatars. Please refresh the page.")
        console.error("[v0] Error loading replicas:", err)
      } finally {
        setLoadingReplicas(false)
      }
    }

    loadReplicas()
  }, [])

  const addUrl = () => {
    if (newUrl.trim()) {
      setUrls((prev) => [...prev, newUrl])
      setNewUrl("")
    }
  }

  const removeUrl = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const triggerFileInput = () => {
    document.getElementById("file-upload")?.click()
  }

  const toggleProduct = (title: string) => {
    setSelectedProducts((prev) => (prev.includes(title) ? prev.filter((p) => p !== title) : [...prev, title]))
  }

  const calculateTotalCredits = () => {
    const baseCredits = 4
    const productCredits = selectedProducts.reduce((sum, title) => {
      const product = additionalProducts.find((p) => p.title === title)
      return sum + (product?.credits || 0)
    }, 0)
    return baseCredits + productCredits
  }

  const handleGenerate = async () => {
    setError("")
    setSuccess("")
    setGenerating(true)

    try {
      const token = localStorage.getItem("auth_token") || ""
      const userStr = localStorage.getItem("user")
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id

      if (!userId) {
        setError("Please login to generate videos")
        return
      }

      if (!selectedReplica) {
        setError("Please select an avatar")
        return
      }

      if (!topic && files.length === 0) {
        setError("Please provide a topic or upload a file")
        return
      }

      let documentId: string | undefined

      // Upload document if files exist
     /* if (files.length > 0) {
        const uploadResponse = await uploadDocument(token, files[0])
        if (uploadResponse.success) {
          documentId = uploadResponse.data.id
        }
      }*/

      // Generate video
      const generateRequest = {
        userId,
        replicaId: selectedReplica,
        userInput: topic || keywordPhrases,
        documentId,
        options: {
          waitForCompletion: false,
        },
      }

      const response = await generateVideo(token, generateRequest)

      if (response.success) {
        setSuccess(`Video generation started! Video ID: ${response.data.videoId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video")
      console.error("[v0] Error generating video:", err)
    } finally {
      setGenerating(false)
    }
  }

  const handlePlayVideo = (videoUrl: string, replicaName: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent replica selection when clicking play
    setPreviewVideo(videoUrl)
    setPreviewReplicaName(replicaName)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple Inputs, Extraordinary Results</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Our AGI-powered platform needs minimal input to generate results that are more human than human
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="p-4 sm:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Choose any one input method below or combine multiple to better align with your specific vision.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <Label className="text-base font-semibold mb-2 block">Enter Topic or Text</Label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your topic or text here..."
                className="min-h-[120px] resize-none"
              />
            </div>
            <div>
              <Label className="text-base font-semibold mb-2 block">Keywords / Keyword Phrases</Label>
              <Textarea
                value={keywordPhrases}
                onChange={(e) => setKeywordPhrases(e.target.value)}
                placeholder="Coffee, Health, Health benefits of coffee"
                className="min-h-[120px] resize-none"
              />
            </div>
            <div>
              <Label className="text-base font-semibold mb-2 block">Target Audience (Optional)</Label>
              <Textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Marketing specialists / Business executives"
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>
              Words used <span className="font-semibold">{wordsUsed.toLocaleString()}</span>
            </span>
            <span>
              Maximum Words allowed <span className="font-semibold">{maxWords.toLocaleString()}</span>
            </span>
            <span>
              Words remaining <span className="font-semibold">{wordsRemaining.toLocaleString()}</span>
            </span>
          </div>
        </Card>

        <Card className="p-4 sm:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Upload Documents and Web Urls</h2>
              <p className="text-gray-600">Up to 20,000 words</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <Label className="text-base font-semibold mb-3 block">PDF, PowerPoint, JPEG, XLSX, Word</Label>
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center mb-4 hover:border-blue-400 transition-colors cursor-pointer"
              >
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-gray-600 mb-1">Drag & drop files here or click to browse</p>
                <p className="text-xs sm:text-sm text-gray-500">Supports: PDF, PPT, JPEG, XLSX, Word</p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2 mb-4">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-2">
                <input
                  type="radio"
                  id="files-primary"
                  name="primary-focus"
                  checked={primaryFocus === "files"}
                  onChange={() => setPrimaryFocus("files")}
                  className="mt-1 cursor-pointer"
                />
                <div>
                  <label htmlFor="files-primary" className="text-sm font-medium cursor-pointer">
                    Set these files as Primary Focus
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Example: If the PDF(s) you enter is about training, you may want to select Primary Focus to ensure
                    the training closely follows the PDF(s)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Web URLs</Label>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="www.anyurl.com"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addUrl()
                    }
                  }}
                />
                <Button onClick={addUrl} type="button" className="flex-shrink-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {urls.length > 0 && (
                <div className="space-y-2 mb-4">
                  {urls.map((url, index) => (
                    <div key={`url-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{url}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeUrl(index)} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-2">
                <input
                  type="radio"
                  id="urls-primary"
                  name="primary-focus"
                  checked={primaryFocus === "urls"}
                  onChange={() => setPrimaryFocus("urls")}
                  className="mt-1 cursor-pointer"
                />
                <div>
                  <label htmlFor="urls-primary" className="text-sm font-medium cursor-pointer">
                    Set these URLs as Primary Focus
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Example: If you want to add video to a web page, you may want to Select Primary Focus for Web URLs
                    to ensure the video closely follows the existing web page content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Choose Your Studio-Grade Avatar</h2>
              <p className="text-gray-600 mb-4">
                Pick the digital avatar who will deliver your content. Each has different voice, tone, and language.
              </p>
            </div>
          </div>

          {loadingReplicas ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading avatars...</span>
            </div>
          ) : replicas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No avatars available</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {replicas.slice(0, 8).map((replica) => (
                  <div key={replica.replica_id} className="text-center">
                    <div
                      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all ${
                        selectedReplica === replica.replica_id
                          ? "ring-4 ring-indigo-600 shadow-xl"
                          : "ring-2 ring-gray-200 hover:ring-indigo-300 hover:shadow-lg"
                      }`}
                    >

<div
  onClick={() => setSelectedReplica(replica.replica_id)}
  className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer overflow-hidden group"
>
  {replica.thumbnail_video_url ? (
    <video
      src={replica.thumbnail_video_url}
      className="w-full h-full object-cover"
      muted
      playsInline
      loop
      autoPlay
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-6xl font-bold text-white">{replica.replica_name[0]}</span>
    </div>
  )}

  {replica.thumbnail_video_url && (
    <button
      onClick={(e) => handlePlayVideo(replica.thumbnail_video_url, replica.replica_name, e)}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
    >
      {/* Contenedor del Botón Play e Imagen */}
      <div className="flex flex-col items-center gap-4">
        {/* Círculo del Play */}
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all">
          <Play className="w-8 h-8 text-indigo-600 fill-indigo-600 ml-1" />
        </div>

        {/* Imagen del Avatar debajo */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
          <Image
            src={`/assets/avatars/${replica.replica_id}.jpg`}
            alt={replica.replica_name}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </button>
  )}

  {selectedReplica === replica.replica_id && (
    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg z-10">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  )}
</div>

                      <div
                        className={`py-3 px-2 ${
                          selectedReplica === replica.replica_id ? "bg-indigo-600 text-white" : "bg-white text-gray-900"
                        }`}
                      >
                        <p className="text-sm font-semibold truncate">{replica.replica_name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs sm:text-sm text-gray-700">
                  <strong>Authentic Digital Human Technology.</strong> While typical AI avatars only animate the lower
                  face, our advanced 3D rendering captures every subtle movement that creates genuine human presence
                  with pixel-perfect lip synchronization and consistent identity preservation that crosses the threshold
                  from AI-generated to indistinguishable from human video.
                </p>
              </div>
            </>
          )}
        </Card>

        <Card className="p-4 sm:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Choose Your Output Format</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <Label className="text-xl sm:text-2xl font-semibold mb-4 block text-gray-800">Video Length</Label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {videoLengths.map((length) => (
                  <Button
                    key={length}
                    variant={videoLength === length ? "default" : "outline"}
                    onClick={() => setVideoLength(length)}
                    className={`h-10 sm:h-12 rounded-full text-sm sm:text-base ${
                      videoLength === length
                        ? "bg-gray-500 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {length}
                  </Button>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 italic mt-4">
                30s and 1m are 4 credits, each additional minute is 3 credits
              </p>
            </div>

            <div>
              <Label className="text-xl sm:text-2xl font-semibold mb-4 block text-gray-800">
                Position of Sticky Video
              </Label>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setVideoPosition("left")}
                  className={`flex-1 h-28 sm:h-32 bg-gray-200 rounded-lg relative cursor-pointer transition-all ${
                    videoPosition === "left" ? "ring-4 ring-indigo-500" : "hover:ring-4 hover:ring-indigo-100"
                  }`}
                >
                  <div className="absolute bottom-4 left-4 w-12 sm:w-16 h-10 sm:h-12 bg-gray-500 rounded"></div>
                </button>
                <button
                  onClick={() => setVideoPosition("right")}
                  className={`flex-1 h-28 sm:h-32 bg-gray-200 rounded-lg relative cursor-pointer transition-all ${
                    videoPosition === "right" ? "ring-4 ring-indigo-500" : "hover:ring-4 hover:ring-indigo-100"
                  }`}
                >
                  <div className="absolute bottom-4 right-4 w-12 sm:w-16 h-10 sm:h-12 bg-gray-500 rounded"></div>
                </button>
              </div>

              <div className="mt-4">
                <Label className="text-base sm:text-lg font-semibold mb-3 block text-gray-700">Size of video</Label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => setVideoSize("compact")}
                    className={`w-full rounded-full h-10 sm:h-12 text-sm sm:text-base ${
                      videoSize === "compact"
                        ? "bg-gray-400 text-white hover:bg-gray-500"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Compact 280×158px
                  </Button>
                  <p className="text-xs text-gray-400 text-center">Minimal footprint</p>

                  <Button
                    variant="outline"
                    onClick={() => setVideoSize("standard")}
                    className={`w-full rounded-full h-10 sm:h-12 text-sm sm:text-base ${
                      videoSize === "standard"
                        ? "bg-gray-800 text-white hover:bg-gray-900"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Standard 400×225px
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    <span className="text-yellow-500">⭐</span> Recommended <span className="text-yellow-500">⭐</span>{" "}
                    (default)
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => setVideoSize("large")}
                    className={`w-full rounded-full h-10 sm:h-12 text-sm sm:text-base ${
                      videoSize === "large"
                        ? "bg-gray-800 text-white hover:bg-gray-900"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Large 560×315px
                  </Button>
                  <p className="text-xs text-gray-400 text-center">Maximum impact</p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xl sm:text-2xl font-semibold mb-4 block text-gray-800">Language</Label>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="outline"
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full h-10 sm:h-12 rounded-full text-sm sm:text-base ${
                      language === lang.code
                        ? "bg-gray-800 text-white hover:bg-gray-900"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              5
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Additional Products (Optional)</h2>
              <p className="text-gray-600">Enhance your video with complementary content products</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {additionalProducts.map((product) => (
              <Card
                key={product.title}
                className={`p-4 cursor-pointer transition-all ${
                  selectedProducts.includes(product.title)
                    ? "ring-4 ring-indigo-500 bg-indigo-50"
                    : "hover:ring-2 hover:ring-indigo-100"
                }`}
                onClick={() => toggleProduct(product.title)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-semibold text-gray-900">{product.title}</h3>
                  <span className="text-sm font-bold text-blue-600">{product.credits} credits</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <ul className="space-y-1">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Card>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">Total Credits Required</p>
              <p className="text-2xl font-bold text-gray-900">{calculateTotalCredits()} credits</p>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating || !selectedReplica || (!topic && files.length === 0)}
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Video"
              )}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!previewVideo} onOpenChange={(open) => !open && setPreviewVideo(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewReplicaName} - Preview</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {previewVideo && (
              <video src={previewVideo} className="w-full h-full object-contain" controls autoPlay loop />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
