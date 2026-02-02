"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGeneration } from "@/context/generation-context";
import { getAuthToken } from "@/lib/get-auth-token";
import { getVideoReplicas, type Replica } from "@/services/video/video-replicas";
import { generatePrompt } from "@/services/video/generate-prompt";
import { getListFolders } from "@/services/get-list-folders";
import { createFolder } from "@/services/create-folder";
import { createProject } from "@/services/create-project";
import { getCreditHistory } from "@/services/get-credits";
import { uploadDocumentFile } from "@/services/documents/document-upload";
import { uploadDocumentFromUrl } from "@/services/documents/document-upload-from-url";
import { setDocumentPrimaryFocus } from "@/services/documents/set-document-as-primary-focus";

export function useVideoCreator() {
  const router = useRouter();
  const { startNewProject } = useGeneration();

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
  const [showSuccessModal, setShowSuccessModal] = useState(false); // NUEVO
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

  useEffect(() => {
    const initData = async () => {
      try {
        const token = await getAuthToken();
        const userId = localStorage.getItem("user") || "user_temp";
        const [creditsRes, replicasRes] = await Promise.all([
          getCreditHistory(token, userId),
          getVideoReplicas(token),
        ]);
        if (creditsRes?.success) setAvailableCredits(creditsRes.data.currentBalance);
        else setAvailableCredits(0);
        if (replicasRes.success && replicasRes.data.length > 0) {
          setReplicas(replicasRes.data);
          setSelectedReplica(replicasRes.data[0].replica_id);
        }
      } catch (e) {
        setAvailableCredits(0);
      } finally {
        setLoadingReplicas(false);
      }
    };
    initData();
  }, []);

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

      // 1. Folder & Project
      const folders = await getListFolders(token);
      let folderId = folders.data?.[0]?.folderId || (await createFolder(token, { folderName: "Main" })).data?.folderId;
      const proj = await createProject(token, { folderId, projectName: projectName.trim() });
      const currentProjectId = proj.data.projectId;

      // 2. Documents
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

      // 3. Generation
      const response = await generatePrompt(token, {
        userInput: `Topic: ${topic}. Keywords: ${keywords}. Audience: ${targetAudience}`,
        userId, duration: totalRequired, style: "professional", language,
        position: videoPosition, size: videoSize, trainingType: trainingType || "General",
        documentId
      });

      if (response.success) {
        const newGen = { jobId: response.data.jobId, topic:topic ,projectId: currentProjectId, title: projectName.trim(), replicaId: selectedReplica , status: "active" };
        const existing = JSON.parse(localStorage.getItem("active_prompt_generations") || "[]");
        localStorage.setItem("active_prompt_generations", JSON.stringify([...existing, newGen]));

        startNewProject(response.data.jobId, userId, selectedReplica, {
          projectId: currentProjectId,
          keywords,
          targetAudience,
        });

        setShowSuccessModal(true); // Abrimos el modal al terminar
        setIsLocalGenerating(false);
      }
    } catch (e: any) {
      setError(e.message || "An error occurred");
      setIsLocalGenerating(false);
    }
  };

  const handleModalAccept = () => {
    setShowSuccessModal(false);
    router.push("/dashboard");
  };

  return {
    replicas, loadingReplicas, selectedReplica, setSelectedReplica,
    files, setFiles, urls, setUrls, newUrl, setNewUrl,
    primaryFocus, setPrimaryFocus, targetAudience, setTargetAudience,
    topic, setTopic, keywords, setKeywords, projectName, projectError,
    videoLength, setVideoLength, language, setLanguage,
    videoPosition, setVideoPosition, videoSize, setVideoSize,
    trainingType, setTrainingType, customTrainingType, setCustomTrainingType,
    customTrainingOptions, setCustomTrainingOptions,
    generating: isLocalGenerating,
    statusMessage: isLocalGenerating ? "Creating Project..." : null,
    error, success, previewVideo, setPreviewVideo, previewReplicaName,
    availableCredits, calculateTotalCredits, handleGenerate,
    showSuccessModal, handleModalAccept, // Props para el modal
    handleProjectNameChange: (v: string) => { setProjectName(v); setProjectError(""); },
    handlePlayVideo: (url: string, name: string) => {
      setPreviewVideo(url);
      setPreviewReplicaName(name);
    },
    canGenerate: !!selectedReplica && projectName.trim().length >= 4 && !isLocalGenerating,
  };
}