"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

// --- HELPERS ---
const getCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const parseToSeconds = (value: string | number): number => {
  const str = String(value).toLowerCase();
  const num = parseInt(str.match(/(\d+)/)?.[0] || "0");
  if (str.includes("m")) return num * 60;
  return num;
};

export function useVideoCreator() {
  const router = useRouter();
  const { startNewProject } = useGeneration();
  const userId = getCookie("user_id");

  // --- VALORES INICIALES ---
  const initialFormState = {
    videoLength: 30,
    language: "english",
    videoPosition: "bottom-left",
    videoSize: "standard",
    primaryFocus: "files" as "files" | "urls",
    trainingType: "general",
  };

  // --- STATES ---
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [loadingReplicas, setLoadingReplicas] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [selectedReplica, setSelectedReplica] = useState("");
  const [videoLength, setVideoLength] = useState<number>(initialFormState.videoLength);
  const [language, setLanguage] = useState(initialFormState.language);
  const [videoPosition, setVideoPosition] = useState(initialFormState.videoPosition);
  const [videoSize, setVideoSize] = useState(initialFormState.videoSize);
  const [primaryFocus, setPrimaryFocus] = useState<"files" | "urls">(initialFormState.primaryFocus);
  const [targetAudience, setTargetAudience] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectError, setProjectError] = useState("");
  const [trainingType, setTrainingType] = useState<string>(initialFormState.trainingType);
  const [customTrainingType, setCustomTrainingType] = useState("");
  const [customTrainingOptions, setCustomTrainingOptions] = useState<string[]>([]);
  const [isLocalGenerating, setIsLocalGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [previewReplicaName, setPreviewReplicaName] = useState("");
  const [availableCredits, setAvailableCredits] = useState<number | null>(null);

  // --- CALCULATIONS ---
  const calculateTotalCredits = useCallback(() => {
    // Usamos el estado interno de videoLength (que ya es número)
    if (videoLength <= 0) return 0;
    const minutes = videoLength / 60;
    if (videoLength <= 60) return 4;
    return 4 + (Math.ceil(minutes) - 1) * 3;
  }, [videoLength]);

  const totalRequired = useMemo(() => calculateTotalCredits(), [calculateTotalCredits]);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!userId) return;
    const initData = async () => {
      try {
        const token = await getAuthToken();
        const savedReplica = localStorage.getItem("last_selected_replica");
        const [creditsRes, replicasRes] = await Promise.all([
          getCreditHistory(token, userId),
          getVideoReplicas(token),
        ]);
        if (creditsRes?.success) setAvailableCredits(creditsRes.data.currentBalance);
        if (replicasRes.success && replicasRes.data.length > 0) {
          setReplicas(replicasRes.data);
          const exists = replicasRes.data.some((r: Replica) => r.replica_id === savedReplica);
          setSelectedReplica(exists ? (savedReplica as string) : replicasRes.data[0].replica_id);
        }
      } catch (e) {
        setAvailableCredits(0);
      } finally {
        setLoadingReplicas(false);
      }
    };
    initData();
  }, [userId]);

  // --- LOGIC ---
  const handleReplicaChange = (id: string) => {
    setSelectedReplica(id);
    localStorage.setItem("last_selected_replica", id);
  };

  const resetForm = useCallback(() => {
    setFiles([]);
    setUrls([]);
    setNewUrl("");
    setProjectName("");
    setTopic("");
    setKeywords("");
    setTargetAudience("");
    setProjectError("");
    setError("");
    setSuccess("");
  }, []);

  const handleGenerate = async (currentProjectedBalance?: number) => {
    const balanceToCheck = currentProjectedBalance ?? availableCredits;
    
    if (!userId) { setError("Session not found"); return; }
    if (balanceToCheck !== null && balanceToCheck < totalRequired) {
      setError("Insufficient credits");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (projectName.trim().length < 4) { setProjectError("Name too short"); return; }

    setIsLocalGenerating(true);
    setError("");

    try {
      const token = await getAuthToken();
      
      const folders = await getListFolders(token);
      let folderId = folders.data?.[0]?.folderId || (await createFolder(token, { folderName: "Main" })).data?.folderId;
      const proj = await createProject(token, { folderId, projectName: projectName.trim() });
      const currentProjectId = proj.data.projectId;

      let documentId: string | undefined;
      const source = primaryFocus === "files" ? files[0] : urls[0];
      if (source) {
        const up = primaryFocus === "files" 
          ? await uploadDocumentFile(token, files[0], userId, true)
          : await uploadDocumentFromUrl(token, urls[0], userId, true);
        
        if (up.success) {
          documentId = up.data.documentId;
          await setDocumentPrimaryFocus(token, documentId!, userId);
        }
      }

      // Fase PROMPT antes de Video
      const response = await generatePrompt(token, {
        userInput: `Topic: ${topic}. Keywords: ${keywords}. Audience: ${targetAudience}`,
        userId, duration: videoLength, style: "professional", language,
        position: videoPosition, size: videoSize, 
        trainingType: trainingType === "custom" ? customTrainingType : trainingType,
        documentId
      });

      if (response.success) {
        // --- RESTAURADO: PERSISTENCIA LOCAL ---
        const newGen = { 
          jobId: response.data.jobId, 
          topic, 
          projectId: currentProjectId, 
          title: projectName.trim(), 
          replicaId: selectedReplica,
          durationSeconds: videoLength, 
          status: "active",
          createdAt: Date.now()
        };
        
        const existing = JSON.parse(localStorage.getItem("active_prompt_generations") || "[]");
        localStorage.setItem("active_prompt_generations", JSON.stringify([...existing, newGen]));
        
        startNewProject(response.data.jobId, userId, selectedReplica, {
          projectId: currentProjectId,
          duration: videoLength,
          credits: totalRequired,
          keywords,
          targetAudience,
        });

        resetForm();
        setShowSuccessModal(true);
      }
    } catch (e: any) {
      setError(e.message || "An error occurred");
    } finally {
      setIsLocalGenerating(false);
    }
  };

  // --- RETURN ---
  return {
    replicas, loadingReplicas, selectedReplica, setSelectedReplica: handleReplicaChange,
    files, setFiles, urls, setUrls, newUrl, setNewUrl,
    primaryFocus, setPrimaryFocus, targetAudience, setTargetAudience,
    topic, setTopic, keywords, setKeywords, projectName, projectError,
    videoLength, setVideoLength: (val: string | number) => setVideoLength(parseToSeconds(val)), 
    language, setLanguage,
    videoPosition, setVideoPosition, videoSize, setVideoSize,
    trainingType, setTrainingType, customTrainingType, setCustomTrainingType,
    customTrainingOptions, setCustomTrainingOptions,
    generating: isLocalGenerating,
    statusMessage: isLocalGenerating ? "Creating Project..." : null,
    error, success, previewVideo, setPreviewVideo, previewReplicaName,
    availableCredits, calculateTotalCredits, handleGenerate,
    showSuccessModal, 
    handleModalAccept: () => { setShowSuccessModal(false); router.push("/dashboard"); },
    handleModalCancel: () => { setShowSuccessModal(false); window.scrollTo({ top: 0, behavior: "smooth" }); },
    handleProjectNameChange: (v: string) => { setProjectName(v); setProjectError(""); },
    handlePlayVideo: (url: string, name: string) => { setPreviewVideo(url); setPreviewReplicaName(name); },
    canGenerate: !!selectedReplica && projectName.trim().length >= 4 && !isLocalGenerating,
  };
}