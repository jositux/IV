"use client"
import { useState, useEffect, useMemo } from "react"
import { useGeneration } from "@/context/generation-context"
import { getAuthToken } from "@/lib/get-auth-token"
import { getVideoReplicas, type Replica } from "@/services/video/video-replicas"
import { generatePrompt } from "@/services/video/generate-prompt"
import { getListFolders } from "@/services/get-list-folders"
import { createFolder } from "@/services/create-folder"
import { createProject } from "@/services/create-project"
import { getCreditHistory } from "@/services/get-credits"
import { uploadDocumentFile } from "@/services/documents/document-upload"
import { uploadDocumentFromUrl } from "@/services/documents/document-upload-from-url"
import { setDocumentPrimaryFocus } from "@/services/documents/set-document-as-primary-focus"

/**
 * Custom hook to manage the video creation workflow.
 * Handles state for avatars, file uploads, project metadata, and credit validation.
 */
export function useVideoCreator() {
  const { startNewProject, projects } = useGeneration()

  // --- ASSET & CONFIGURATION STATES ---
  const [replicas, setReplicas] = useState<Replica[]>([])
  const [loadingReplicas, setLoadingReplicas] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [selectedReplica, setSelectedReplica] = useState("")
  const [videoLength, setVideoLength] = useState("30s")
  const [language, setLanguage] = useState("english")
  const [videoPosition, setVideoPosition] = useState("bottom-left")
  const [videoSize, setVideoSize] = useState("standard")
  
  // --- USER INPUT STATES ---
  const [primaryFocus, setPrimaryFocus] = useState<"files" | "urls">("files") // Toggle for data source
  const [targetAudience, setTargetAudience] = useState("") // Intended viewer profile
  const [topic, setTopic] = useState("") // Main content description
  const [keywords, setKeywords] = useState("") // SEO and context tags
  const [projectName, setProjectName] = useState("")

  // --- STRATEGY/TRAINING STATES ---
  const [trainingType, setTrainingType] = useState<string>("")
  const [customTrainingType, setCustomTrainingType] = useState("")
  const [customTrainingOptions, setCustomTrainingOptions] = useState<string[]>([])

  // --- UI FEEDBACK & BILLING ---
  const [isLocalGenerating, setIsLocalGenerating] = useState(false)
  const [error, setError] = useState("")
  const [projectError, setProjectError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [previewReplicaName, setPreviewReplicaName] = useState("")
  const [availableCredits, setAvailableCredits] = useState<number>(0)

  /**
   * Converts the selected duration string (e.g., "1m") into total seconds.
   */
  const calculateTotalCredits = () => {
    const value = parseInt(videoLength.match(/(\d+)/)?.[0] || "0")
    return videoLength.toLowerCase().includes("m") ? value * 60 : value
  }

  const totalRequired = calculateTotalCredits()
  const hasEnoughCredits = availableCredits >= totalRequired

  /**
   * Checks if there's any ongoing generation in the global context.
   */
  const currentActiveProject = useMemo(() => 
    Object.values(projects).find(p => p.activeStep !== "COMPLETED"), 
  [projects])

  /**
   * Initial Data Fetching:
   * Syncs user credits and available AI avatars on mount.
   */
  useEffect(() => {
    const initData = async () => {
      try {
        const token = await getAuthToken()
        const userId = localStorage.getItem("user") || "user_temp"
        const [creditsRes, replicasRes] = await Promise.all([
          getCreditHistory(token, userId),
          getVideoReplicas(token)
        ])
        if (creditsRes?.success) setAvailableCredits(creditsRes.data.currentBalance)
        if (replicasRes.success && replicasRes.data.length > 0) {
          setReplicas(replicasRes.data)
          setSelectedReplica(replicasRes.data[0].replica_id)
        }
      } catch (e) { setError("Error loading initial data") }
      finally { setLoadingReplicas(false) }
    }
    initData()
  }, [isLocalGenerating])

  /**
   * Main Execution Handler:
   * 1. Validates inputs and credits.
   * 2. Orchestrates folder and project creation.
   * 3. Uploads documents or processes URLs.
   * 4. Initiates the AI Script (Prompt) generation.
   * 5. Registers the task in the global polling context.
   */
  const handleGenerate = async () => {
    if (!hasEnoughCredits) { setError("Insufficient credits for this duration"); return }
    if (projectName.trim().length < 4) { setProjectError("Project name is too short"); return }
    
    setIsLocalGenerating(true)
    setError("")

    try {
      const token = await getAuthToken()
      const userId = localStorage.getItem("user") || "user_temp"
      
      // STEP 1: Ensure project structure exists
      const folders = await getListFolders(token)
      let folderId = folders.data?.[0]?.folderId || (await createFolder(token, { folderName: "Main" }) as any).folderId
      const proj = await createProject(token, { folderId, projectName: projectName.trim() })
      
      // STEP 2: Process Document Uploads
      let documentId: string | undefined = undefined;

      if (primaryFocus === "files" && files.length > 0) {
        const up = await uploadDocumentFile(token, files[0], userId, true)
        if (up.success) {
          documentId = up.data.documentId;
          await setDocumentPrimaryFocus(token, documentId!, userId)
        }
      } else if (primaryFocus === "urls" && urls.length > 0) {
        const up = await uploadDocumentFromUrl(token, urls[0], userId, true)
        if (up.success) {
          documentId = up.data.documentId;
          await setDocumentPrimaryFocus(token, documentId!, userId)
        }
      }
      
      // STEP 3: Initiate Script Generation
      const response = await generatePrompt(token, {
        userInput: `Topic: ${topic}. Keywords: ${keywords}. Audience: ${targetAudience}`, 
        userId, 
        duration: totalRequired,
        style: "professional", 
        language, 
        position: videoPosition, 
        size: videoSize, 
        trainingType: trainingType || "General",
        documentId: documentId // Linked uploaded resource
      })

      if (response.success) {
        // STEP 4: Hand over to Global Context for polling and video rendering
        startNewProject(response.data.jobId, userId, selectedReplica, { 
          projectId: proj.data.projectId,
          keywords: keywords,
          targetAudience: targetAudience
        })
        
        // Final UI Cleanup
        setProjectName(""); setTopic(""); setKeywords(""); setTargetAudience("");
        setFiles([]); setUrls([]);
        setSuccess("Generation started successfully")
      }
    } catch (e: any) { 
        setError(e.message || "An unexpected error occurred during generation") 
    } finally {
        setIsLocalGenerating(false) 
    }
  }

  return {
    // Replica data
    replicas, loadingReplicas, selectedReplica, setSelectedReplica,
    // File/Url management
    files, setFiles, urls, setUrls, newUrl, setNewUrl, primaryFocus, setPrimaryFocus,
    // Content inputs
    topic, setTopic, keywords, setKeywords, targetAudience, setTargetAudience,
    // Output configuration
    videoLength, setVideoLength, language, setLanguage, videoPosition, setVideoPosition, videoSize, setVideoSize,
    // Project metadata
    projectName, projectError, handleProjectNameChange: (v: string) => { setProjectName(v); setProjectError(""); },
    // Strategy
    trainingType, setTrainingType, customTrainingType, setCustomTrainingType, customTrainingOptions, setCustomTrainingOptions,
    // Status and Feedback
    generating: isLocalGenerating || !!currentActiveProject,
    statusMessage: isLocalGenerating ? "Initializing Project..." : null,
    error, success, previewVideo, setPreviewVideo, previewReplicaName,
    // Financials
    availableCredits, hasEnoughCredits, calculateTotalCredits,
    // Logic Actions
    handleGenerate,
    handlePlayVideo: (url: string, name: string) => { setPreviewVideo(url); setPreviewReplicaName(name); },
    canGenerate: !!selectedReplica && projectName.trim().length >= 4,
  }
}