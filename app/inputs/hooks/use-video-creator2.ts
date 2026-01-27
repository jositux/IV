"use client"

import { useState, useEffect, useMemo } from "react"
import { useGeneration } from "@/context/generation-context"
import { getAuthToken } from "@/lib/get-auth-token"
import { getVideoReplicas, type Replica } from "@/services/video/video-replicas"
import { generatePrompt } from "@/services/video/generate-prompt"
import { getListFolders } from "@/services/get-list-folders"
import { createFolder } from "@/services/create-folder"
import { createProject } from "@/services/create-project"

import { uploadDocumentFile } from "@/services/documents/document-upload"
import { uploadDocumentFromUrl } from "@/services/documents/document-upload-from-url"
import { setDocumentPrimaryFocus } from "@/services/documents/set-document-as-primary-focus"

export function useVideoCreator() {
  const { startNewProject, projects } = useGeneration()

  // --- ESTADOS DE FORMULARIO ---
  const [replicas, setReplicas] = useState<Replica[]>([])
  const [loadingReplicas, setLoadingReplicas] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [selectedReplica, setSelectedReplica] = useState("")
  const [videoLength, setVideoLength] = useState("30s")
  const [language, setLanguage] = useState("english")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [videoPosition, setVideoPosition] = useState("bottom-left")
  const [videoSize, setVideoSize] = useState("standard")
  const [primaryFocus, setPrimaryFocus] = useState<"files" | "urls">("files")
  const [topic, setTopic] = useState("")
  const [keywordPhrases, setKeywordPhrases] = useState("")
  const [audience, setAudience] = useState("")
  const [projectName, setProjectName] = useState("")

  // --- ESTADOS DE UI ---
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [projectError, setProjectError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [previewReplicaName, setPreviewReplicaName] = useState("")
  const [generatedScript, setGeneratedScript] = useState("")
  const [scriptId, setScriptId] = useState("")
  const [targetAudience, setTargetAudience] = useState<string[]>([])
  const [customAudience, setCustomAudience] = useState("")
  const [customAudienceOptions, setCustomAudienceOptions] = useState<string[]>([])

  useEffect(() => {
    const loadReplicas = async () => {
      try {
        const token = await getAuthToken();
        const res = await getVideoReplicas(token);
        if (res.success && res.data.length > 0) {
          setReplicas(res.data);
          setSelectedReplica(res.data[0].replica_id);
        }
      } catch (e) { setError("Failed to load avatars"); }
      finally { setLoadingReplicas(false); }
    };
    loadReplicas();
  }, []);

  const getDurationInSeconds = () => {
    const match = videoLength.match(/(\d+)/);
    const val = match ? parseInt(match[0]) : 30;
    return videoLength.includes("m") ? val * 60 : val;
  };

  const { isAnyProjectActive, lastProjectError, currentStep } = useMemo(() => {
    const list = Object.values(projects);
    if (list.length === 0) return { isAnyProjectActive: false, lastProjectError: null, currentStep: null };
    return {
      isAnyProjectActive: list.some(p => p.activeStep !== "COMPLETED"),
      lastProjectError: list.find(p => p.error !== null)?.error || null,
      currentStep: list[list.length - 1].activeStep
    };
  }, [projects]);

  const handleGenerate = async () => {
    if (projectName.trim().length < 4) { setProjectError("Name too short"); return; }
    if (!selectedReplica) { setError("Select avatar"); return; }
    
    setGenerating(true); 
    setError(""); 
    setSuccess("");

    try {
      const token = await getAuthToken();
      const userId = localStorage.getItem("user") || "user_temp";
      
      const folders = await getListFolders(token);
      let folderId = folders.success && folders.data?.[0]?.folderId || (await createFolder(token, { folderName: "Main" }) as any).folderId;
      const proj = await createProject(token, { folderId, projectName: projectName.trim() });
      
      let documentId: string | undefined;
      const fileToUpload = primaryFocus === "files" ? files[0] : (files.length > 0 ? files[0] : null);
      
      if (fileToUpload) {
        const up = await uploadDocumentFile(token, fileToUpload, userId, true);
        if (up.success) { 
          documentId = up.data.documentId; 
          await setDocumentPrimaryFocus(token, documentId, userId); 
        }
      } else if (primaryFocus === "urls" && urls.length > 0) {
        const up = await uploadDocumentFromUrl(token, urls[0], userId, true);
        if (up.success) { 
          documentId = up.data.documentId; 
          await setDocumentPrimaryFocus(token, documentId, userId); 
        }
      }
      
      const response = await generatePrompt(token, {
        userInput: topic || keywordPhrases || "Marketing video", 
        userId, 
        duration: getDurationInSeconds(),
        style: "professional", 
        language, 
        position: videoPosition, 
        size: videoSize, 
        trainingType: "Product and Sales",
      });

      if (response.success) {
        startNewProject((response.data as any).jobId, userId, selectedReplica, { projectId: proj.data.projectId, documentId });
        setSuccess("Creation process started successfully!");
        // Limpiar formulario
        setProjectName(""); setTopic(""); setFiles([]); setUrls([]);
      }
    } catch (e: any) { 
      setError(e.message || "An unexpected error occurred"); 
    } finally { 
      setGenerating(false); 
    }
  };

  const handlePlayVideo = (url: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); setPreviewVideo(url); setPreviewReplicaName(name);
  };

  const toggleProduct = (title: string) => {
    setSelectedProducts(prev => prev.includes(title) ? prev.filter(p => p !== title) : [...prev, title]);
  };

  return {
    replicas, loadingReplicas, files, urls, newUrl, selectedReplica, videoLength, language, selectedProducts, videoPosition, videoSize, primaryFocus, topic, keywordPhrases, audience, projectName, projectError,
    generating: generating || isAnyProjectActive,
    activeStep: currentStep,
    error: error || lastProjectError,
    success, previewVideo, previewReplicaName, generatedScript, scriptId, targetAudience, customAudience, customAudienceOptions,
    setFiles, setUrls, setNewUrl, setSelectedReplica, setVideoLength, setLanguage, setVideoPosition, setVideoSize, setPrimaryFocus, setTopic, setKeywordPhrases, setAudience, setPreviewVideo, setTargetAudience, setCustomAudience, setCustomAudienceOptions,
    handleGenerate,
    handlePlayVideo,
    toggleProduct,
    handleProjectNameChange: (v: string) => { setProjectName(v); setProjectError(""); },
    calculateTotalCredits: () => 4,
    canGenerate: !!selectedReplica && projectName.trim().length >= 4 && (!!topic || files.length > 0 || urls.length > 0),
  };
}