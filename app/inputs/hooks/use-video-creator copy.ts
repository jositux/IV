"use client";
import { useState, useEffect, useMemo } from "react";
import { useGeneration } from "@/context/generation-context";
import { getAuthToken } from "@/lib/get-auth-token";
import {
  getVideoReplicas,
  type Replica,
} from "@/services/video/video-replicas";
import { generatePrompt } from "@/services/video/generate-prompt";
import { getListFolders } from "@/services/get-list-folders";
import { createFolder } from "@/services/create-folder";
import { createProject } from "@/services/create-project";
import { getCreditHistory } from "@/services/get-credits";
import { uploadDocumentFile } from "@/services/documents/document-upload";
import { uploadDocumentFromUrl } from "@/services/documents/document-upload-from-url";
import { setDocumentPrimaryFocus } from "@/services/documents/set-document-as-primary-focus";

export function useVideoCreator() {
  const { startNewProject, projects } = useGeneration();

  // --- ASSET & CONFIGURATION STATES ---
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [loadingReplicas, setLoadingReplicas] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [selectedReplica, setSelectedReplica] = useState("");
  const [videoLength, setVideoLength] = useState("30s");
  const [language, setLanguage] = useState("english");
  const [videoPosition, setVideoPosition] = useState("bottom-left");
  const [videoSize, setVideoSize] = useState("standard");

  // --- USER INPUT STATES ---
  const [primaryFocus, setPrimaryFocus] = useState<"files" | "urls">("files");
  const [targetAudience, setTargetAudience] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [projectName, setProjectName] = useState("");

  // --- STRATEGY/TRAINING STATES ---
  const [trainingType, setTrainingType] = useState<string>("");
  const [customTrainingType, setCustomTrainingType] = useState("");
  const [customTrainingOptions, setCustomTrainingOptions] = useState<string[]>([]);

  // --- UI FEEDBACK & BILLING ---
  const [isLocalGenerating, setIsLocalGenerating] = useState(false);
  const [error, setError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [previewReplicaName, setPreviewReplicaName] = useState("");
  const [availableCredits, setAvailableCredits] = useState<number | null>(null);

  const calculateTotalCredits = () => {
    const value = parseInt(videoLength.match(/(\d+)/)?.[0] || "0");
    return videoLength.toLowerCase().includes("m") ? value * 60 : value;
  };

  const totalRequired = calculateTotalCredits();
  const hasEnoughCredits = availableCredits === null ? true : availableCredits >= totalRequired;

  const currentActiveProject = useMemo(
    () => Object.values(projects).find((p) => p.activeStep !== "COMPLETED"),
    [projects]
  );

  useEffect(() => {
    const initData = async () => {
      try {
        const token = await getAuthToken();
        const userId = localStorage.getItem("user") || "user_temp";
        const [creditsRes, replicasRes] = await Promise.all([
          getCreditHistory(token, userId),
          getVideoReplicas(token),
        ]);
        
        if (creditsRes?.success) {
          setAvailableCredits(creditsRes.data.currentBalance);
        } else {
          setAvailableCredits(0);
        }

        if (replicasRes.success && replicasRes.data.length > 0) {
          setReplicas(replicasRes.data);
          setSelectedReplica(replicasRes.data[0].replica_id);
        }
      } catch (e) {
        setError("Error loading initial data");
        setAvailableCredits(0);
      } finally {
        setLoadingReplicas(false);
      }
    };
    initData();
  }, [isLocalGenerating]);

  /**
   * Main Execution Handler
   */
  const handleGenerate = async () => {
    if (availableCredits !== null && availableCredits < totalRequired) {
      setError("Insufficient credits for this duration");
      return;
    }
    
    if (projectName.trim().length < 4) {
      setProjectError("Project name is too short");
      return;
    }

    setIsLocalGenerating(true);
    setError("");

    try {
      const token = await getAuthToken();
      const userId = localStorage.getItem("user") || "user_temp";

      // 1. Manejo de Carpeta y Proyecto
      const folders = await getListFolders(token);
      let folderId =
        folders.data?.[0]?.folderId ||
        (await createFolder(token, { folderName: "Main" })).data?.folderId;
      
      const proj = await createProject(token, {
        folderId,
        projectName: projectName.trim(),
      });

      const currentProjectId = proj.data.projectId;
      const currentTitle = projectName.trim();

      // 2. Manejo de Documentos
      let documentId: string | undefined = undefined;
      if (primaryFocus === "files" && files.length > 0) {
        const up = await uploadDocumentFile(token, files[0], userId, true);
        if (up.success) {
          documentId = up.data.documentId;
          await setDocumentPrimaryFocus(token, documentId!, userId);
        }
      } else if (primaryFocus === "urls" && urls.length > 0) {
        const up = await uploadDocumentFromUrl(token, urls[0], userId, true);
        if (up.success) {
          documentId = up.data.documentId;
          await setDocumentPrimaryFocus(token, documentId!, userId);
        }
      }

      // 3. Generación
      const response = await generatePrompt(token, {
        userInput: `Topic: ${topic}. Keywords: ${keywords}. Audience: ${targetAudience}`,
        userId,
        duration: totalRequired,
        style: "professional",
        language,
        position: videoPosition,
        size: videoSize,
        trainingType: trainingType || "General",
        documentId: documentId,
      });

      if (response.success) {
        // --- MANEJO DE MÚLTIPLES PROYECTOS ACTIVOS ---
        const newActiveGeneration = {
          jobId: response.data.jobId,
          projectId: currentProjectId,
          title: currentTitle,
          status: "active",
          createdAt: new Date().toISOString()
        };

        // Obtenemos lista previa del localStorage, agregamos el nuevo y guardamos
        const existingGenerations = JSON.parse(localStorage.getItem("active_prompts") || "[]");
        const updatedGenerations = [...existingGenerations, newActiveGeneration];
        localStorage.setItem("active_prompt_generations", JSON.stringify(updatedGenerations));

        // 4. Iniciar en Contexto Global
        startNewProject(response.data.jobId, userId, selectedReplica, {
          projectId: currentProjectId,
          keywords: keywords,
          targetAudience: targetAudience,
        });

        // Limpieza de Formulario
        setProjectName("");
        setTopic("");
        setKeywords("");
        setTargetAudience("");
        setFiles([]);
        setUrls([]);
        setSuccess("Generation started successfully");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during generation");
    } finally {
      setIsLocalGenerating(false);
    }
  };

  return {
    replicas,
    loadingReplicas,
    selectedReplica,
    setSelectedReplica,
    files,
    setFiles,
    urls,
    setUrls,
    newUrl,
    setNewUrl,
    primaryFocus,
    setPrimaryFocus,
    topic,
    setTopic,
    keywords,
    setKeywords,
    targetAudience,
    setTargetAudience,
    videoLength,
    setVideoLength,
    language,
    setLanguage,
    videoPosition,
    setVideoPosition,
    videoSize,
    setVideoSize,
    projectName,
    projectError,
    handleProjectNameChange: (v: string) => {
      setProjectName(v);
      setProjectError("");
    },
    trainingType,
    setTrainingType,
    customTrainingType,
    setCustomTrainingType,
    customTrainingOptions,
    setCustomTrainingOptions,
    generating: isLocalGenerating || !!currentActiveProject,
    statusMessage: isLocalGenerating ? "Initializing Project..." : null,
    error,
    success,
    previewVideo,
    setPreviewVideo,
    previewReplicaName,
    availableCredits,
    hasEnoughCredits,
    calculateTotalCredits,
    handleGenerate,
    handlePlayVideo: (url: string, name: string) => {
      setPreviewVideo(url);
      setPreviewReplicaName(name);
    },
    canGenerate: !!selectedReplica && projectName.trim().length >= 4,
  };
}