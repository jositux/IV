"use client"

import React from "react"

import { useState, useEffect } from "react"
import { getVideoReplicas, type Replica } from "@/services/video/video-replicas"
import { generateVideo } from "@/services/video/video-generate"
import { generateVideoFromScript } from "@/services/video/generate-video-from-script"
import { uploadDocument } from "@/services/documents/document-upload"
import { generateVideoPrompt } from "@/services/video/generate-video-prompt"
import { getAuthToken } from "@/lib/get-auth-token"
import { getListFolders } from "@/services/get-list-folders"
import { getListProjects } from "@/services/get-list-projects"
import { createFolder } from "@/services/create-folder"
import { createProject } from "@/services/create-project"
import { ADDITIONAL_PRODUCTS } from "../types"

export function useVideoCreator() {
  const [replicas, setReplicas] = useState<Replica[]>([])
  const [loadingReplicas, setLoadingReplicas] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [selectedReplica, setSelectedReplica] = useState<string>("")
  const [videoLength, setVideoLength] = useState("30s")
  const [language, setLanguage] = useState("english")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [videoPosition, setVideoPosition] = useState("bottom-left")
  const [videoSize, setVideoSize] = useState("standard")
  const [primaryFocus, setPrimaryFocus] = useState<"files" | "urls">("files")
  const [topic, setTopic] = useState("")
  const [keywordPhrases, setKeywordPhrases] = useState("")
  const [audience, setAudience] = useState("")
  const [generating, setGenerating] = useState(false)
  const [prompting, setPrompting] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [previewReplicaName, setPreviewReplicaName] = useState<string>("")
  const [generatedScript, setGeneratedScript] = useState<string>("")
  const [scriptId, setScriptId] = useState<string>("")
  const [projectName, setProjectName] = useState<string>("")
  const [projectId, setProjectId] = useState<string>("")
  const [projectError, setProjectError] = useState<string>("")
  const [checkingProject, setCheckingProject] = useState(false)
  const [targetAudience, setTargetAudience] = useState<string[]>([])
  const [customAudience, setCustomAudience] = useState("")
  const [customAudienceOptions, setCustomAudienceOptions] = useState<string[]>([])

  useEffect(() => {
    const loadReplicas = async () => {
      try {
        const token = await getAuthToken()
        const response = await getVideoReplicas(token)
        if (response.success && response.data.length > 0) {
          setReplicas(response.data)
          setSelectedReplica(response.data[0].replica_id)
        }
      } catch (err) {
        setError("Failed to load avatars. Please refresh the page.")
      } finally {
        setLoadingReplicas(false)
      }
    }

    loadReplicas()
  }, [])

  const getOrCreateFolder = async (token: string): Promise<string> => {
    const foldersResponse = await getListFolders(token)
    if (foldersResponse.success && foldersResponse.data.length > 0) {
      return foldersResponse.data[0].folderId
    }

    const newFolder = await createFolder(token, { folderName: "Main" })
    if (newFolder && (newFolder as any).folderId) {
      return (newFolder as any).folderId
    }

    const updatedFolders = await getListFolders(token)
    if (updatedFolders.success && updatedFolders.data.length > 0) {
      return updatedFolders.data[0].folderId
    }

    throw new Error("Could not create or find a folder")
  }

  const calculateTotalCredits = () => {
    let total = 4
    for (const title of selectedProducts) {
      const product = ADDITIONAL_PRODUCTS.find((p) => p.title === title)
      if (product) total += product.credits
    }
    return total
  }

  const getDurationInSeconds = () => {
    const match = videoLength.match(/(\d+)(s|m)/)
    if (!match) return 30
    const value = parseInt(match[1])
    const unit = match[2]
    return unit === "m" ? value * 60 : value
  }

  const handleGeneratePrompt = async () => {
    setError("")
    setSuccess("")
    setPrompting(true)

    try {
      const token = await getAuthToken()
      const userStr = localStorage.getItem("user")
      const userId = userStr

      if (!userId) {
        setError("Please login to generate prompts")
        setPrompting(false)
        return
      }

      if (!topic) {
        setError("Please provide a topic to generate a prompt")
        setPrompting(false)
        return
      }

      const response = await generateVideoPrompt(token, {
        userInput: topic,
        userId,
        duration: getDurationInSeconds(),
        style: "professional",
        language,
        position: videoPosition,
        size: videoSize,
        trainingType: "Product and Sales",
      })

      if (response.success) {
        setGeneratedScript(response.data.extractedScript)
        setScriptId(response.data.scriptId)
        setSuccess("Prompt generated successfully!")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate prompt")
    } finally {
      setPrompting(false)
    }
  }

  const handleGenerate = async () => {
    setError("")
    setSuccess("")
    setProjectError("")
    setGenerating(true)

    try {
      const token = await getAuthToken()
      const userStr = localStorage.getItem("user")
      const userId = userStr

      if (!userId) {
        setError("Please login to generate videos")
        setGenerating(false)
        return
      }

      if (!projectName.trim() || projectName.trim().length < 4) {
        setProjectError("Project name must be at least 4 characters")
        setGenerating(false)
        return
      }

      if (!selectedReplica) {
        setError("Please select an avatar")
        setGenerating(false)
        return
      }

      if (!topic && files.length === 0) {
        setError("Please provide a topic or upload a file")
        setGenerating(false)
        return
      }

      // Step 1: Check if project name already exists
      const projectsResponse = await getListProjects(token)
      if (projectsResponse.success) {
        const existingProject = projectsResponse.data.find(
          (project) =>
            project.projectName.toLowerCase() === projectName.trim().toLowerCase()
        )
        if (existingProject) {
          setProjectError("A project with this name already exists")
          setGenerating(false)
          return
        }
      }

      // Step 2: Get or create folder and create project
      const folderId = await getOrCreateFolder(token)
      const projectResponse = await createProject(token, {
        folderId,
        projectName: projectName.trim(),
      })

      if (!projectResponse.success) {
        setError("Failed to create project")
        setGenerating(false)
        return
      }

      const currentProjectId = projectResponse.data.projectId
      setProjectId(currentProjectId)

      let documentId: string | undefined

      if (files.length > 0) {
        const uploadResponse = await uploadDocument(token, files[0], {
          userId,
          saveToS3: true,
          isPrimaryFocus: false,
        })
        if (uploadResponse.success) {
          documentId = uploadResponse.data.id
        }
      }

      // Step 3: Generate prompt if we have a topic
      let currentScriptId = scriptId

      if (topic) {
        const promptResponse = await generateVideoPrompt(token, {
          userInput: topic,
          userId,
          duration: getDurationInSeconds(),
          style: "professional",
          language,
          position: videoPosition,
          size: videoSize,
          trainingType: "Product and Sales",
        })

        if (promptResponse.success) {
          currentScriptId = promptResponse.data.scriptId
          setScriptId(currentScriptId)
          setGeneratedScript(promptResponse.data.extractedScript)
        }
      }

      // Step 4: Generate video
      let response

      if (currentScriptId) {
        response = await generateVideoFromScript(token, {
          scriptId: currentScriptId,
          userId,
          replicaId: selectedReplica,
          documentId,
          projectId: currentProjectId,
          duration: getDurationInSeconds(),
          style: "professional",
          language,
          position: videoPosition,
          size: videoSize,
          options: {
            waitForCompletion: false,
            voice: "default",
          },
        })
      } else {
        response = await generateVideo(token, {
          userId,
          replicaId: selectedReplica,
          userInput: topic || keywordPhrases,
          documentId,
          options: {
            waitForCompletion: false,
          },
        })
      }

      if (response.success) {
        setSuccess(`Video generation started! Video ID: ${response.data.videoId}`)
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video")
    } finally {
      setGenerating(false)
    }
  }

  const handlePlayVideo = (
    videoUrl: string,
    replicaName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    setPreviewVideo(videoUrl)
    setPreviewReplicaName(replicaName)
  }

  const toggleProduct = (title: string) => {
    if (selectedProducts.includes(title)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== title))
    } else {
      setSelectedProducts([...selectedProducts, title])
    }
  }

  const handleProjectNameChange = (value: string) => {
    setProjectName(value)
    setProjectError("")
    setProjectId("")
  }

  const canGenerate =
    !!selectedReplica &&
    projectName.trim().length >= 4 &&
    (!!topic || files.length > 0)

  const canPrompt = !!topic

  return {
    // State
    replicas,
    loadingReplicas,
    files,
    urls,
    newUrl,
    selectedReplica,
    videoLength,
    language,
    selectedProducts,
    videoPosition,
    videoSize,
    primaryFocus,
    topic,
    keywordPhrases,
    audience,
    generating,
    prompting,
    error,
    success,
    previewVideo,
    previewReplicaName,
    generatedScript,
    scriptId,
    projectName,
    projectId,
    projectError,
    checkingProject,
    targetAudience,
    customAudience,
    customAudienceOptions,
    canGenerate,
    canPrompt,

    // Setters
    setFiles,
    setUrls,
    setNewUrl,
    setSelectedReplica,
    setVideoLength,
    setLanguage,
    setVideoPosition,
    setVideoSize,
    setPrimaryFocus,
    setTopic,
    setKeywordPhrases,
    setAudience,
    setPreviewVideo,
    setTargetAudience,
    setCustomAudience,
    setCustomAudienceOptions,

    // Actions
    handleGeneratePrompt,
    handleGenerate,
    handlePlayVideo,
    toggleProduct,
    handleProjectNameChange,
    calculateTotalCredits,
  }
}
