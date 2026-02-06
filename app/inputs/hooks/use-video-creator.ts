"use client";
import { useState, useEffect, useCallback } from "react";
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

// Helper para leer la cookie de identidad
const getCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

export function useVideoCreator() {
  const router = useRouter();
  const { startNewProject } = useGeneration();
  
  // Obtenemos el userId de la cookie de forma instantánea
  const userId = getCookie("user_id");

  // --- VALORES INICIALES ---
  const initialFormState = {
    files: [], urls: [], newUrl: "", videoLength: "30s",
    language: "english", videoPosition: "bottom-left", videoSize: "standard",
    primaryFocus: "files" as const, targetAudience: "", topic: "",
    keywords: "", projectName: "", trainingType: "",
    customTrainingType: "", customTrainingOptions: []
  };

  // --- STATES ---
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [loadingReplicas, setLoadingReplicas] = useState(true);
  const [files, setFiles] = useState<File[]>(initialFormState.files);
  const [urls, setUrls] = useState<string[]>(initialFormState.urls);
  const [newUrl, setNewUrl] = useState(initialFormState.newUrl);
  const [selectedReplica, setSelectedReplica] = useState("");
  const [videoLength, setVideoLength] = useState(initialFormState.videoLength);
  const [language, setLanguage] = useState(initialFormState.language);
  const [videoPosition, setVideoPosition] = useState(initialFormState.videoPosition);
  const [videoSize, setVideoSize] = useState(initialFormState.videoSize);
  const [primaryFocus, setPrimaryFocus] = useState<"files" | "urls">(initialFormState.primaryFocus);
  const [targetAudience, setTargetAudience] = useState(initialFormState.targetAudience);
  const [topic, setTopic] = useState(initialFormState.topic);
  const [keywords, setKeywords] = useState(initialFormState.keywords);
  const [projectName, setProjectName] = useState(initialFormState.projectName);
  const [trainingType, setTrainingType] = useState<string>(initialFormState.trainingType);
  const [customTrainingType, setCustomTrainingType] = useState(initialFormState.customTrainingType);
  const [customTrainingOptions, setCustomTrainingOptions] = useState<string[]>(initialFormState.customTrainingOptions);
  const [isLocalGenerating, setIsLocalGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [previewReplicaName, setPreviewReplicaName] = useState("");
  const [availableCredits, setAvailableCredits] = useState<number | null>(null);

  // --- HELPERS ---
  const calculateTotalCredits = () => {
    // Extraemos el número
    const value = parseInt(videoLength.match(/(\d+)/)?.[0] || "0");
    const isMinutes = videoLength.toLowerCase().includes("m");
    
    // Si es 0 o no hay valor, 0 créditos
    if (value === 0) return 0;
  
    // Convertimos todo a una unidad base de minutos para el cálculo
    // Si dice "30s", el valor de minutos sería 0.5
    const durationInMinutes = isMinutes ? value : value / 60;
  
    if (durationInMinutes <= 1) {
      return 4; // 30s o 1m valen 4 créditos
    } else {
      // Para más de 1m: 4 iniciales + 3 por cada minuto extra
      // Usamos Math.ceil por si quieres cobrar minutos parciales (ej: 1.5m) como completos
      return 4 + (Math.ceil(durationInMinutes) - 1) * 3;
    }
  };
  
  const totalRequired = calculateTotalCredits();

  const resetForm = () => {
    setFiles(initialFormState.files);
    setUrls(initialFormState.urls);
    setNewUrl(initialFormState.newUrl);
    setVideoLength(initialFormState.videoLength);
    setLanguage(initialFormState.language);
    setProjectError("");
    setError("");
  };

  useEffect(() => {
    const initData = async () => {
      // Si no hay userId en la cookie aún, esperamos al siguiente ciclo
      if (!userId) return;

      try {
        const token = await getAuthToken();
        const savedReplica = localStorage.getItem("last_selected_replica");
        
        const [creditsRes, replicasRes] = await Promise.all([
          getCreditHistory(token, userId),
          getVideoReplicas(token),
        ]);

        if (creditsRes?.success) setAvailableCredits(creditsRes.data.currentBalance);
        else setAvailableCredits(0);

        if (replicasRes.success && replicasRes.data.length > 0) {
          setReplicas(replicasRes.data);
          setSelectedReplica(savedReplica || replicasRes.data[0].replica_id);
        }
      } catch (e) {
        setAvailableCredits(0);
      } finally {
        setLoadingReplicas(false);
      }
    };
    initData();
  }, [userId]); // Re-ejecutar si la cookie cambia (login/logout)

  const handleReplicaChange = (id: string) => {
    setSelectedReplica(id);
    localStorage.setItem("last_selected_replica", id);
  };

  const handleGenerate = async (currentProjectedBalance?: number) => {
    if (!userId) {
      setError("User session not found. Please log in again.");
      return;
    }

    const balanceToCheck = currentProjectedBalance !== undefined ? currentProjectedBalance : availableCredits;

    if (balanceToCheck !== null && balanceToCheck < totalRequired) {
      setError("Insufficient credits for this duration");
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      // Lógica de Folders y Projects
      const folders = await getListFolders(token);
      let folderId = folders.data?.[0]?.folderId || (await createFolder(token, { folderName: "Main" })).data?.folderId;
      const proj = await createProject(token, { folderId, projectName: projectName.trim() });
      const currentProjectId = proj.data.projectId;

      let documentId: string | undefined = undefined;
      
      // Subida de archivos/URLs
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

      // Llamada al Backend para generar el prompt
      const response = await generatePrompt(token, {
        userInput: `Topic: ${topic}. Keywords: ${keywords}. Audience: ${targetAudience}`,
        userId, duration: totalRequired, style: "professional", language,
        position: videoPosition, size: videoSize, trainingType: trainingType || "General",
        documentId
      });

      if (response.success) {
        // Guardamos en localStorage los datos volátiles del proyecto activo
        const newGen = { 
          jobId: response.data.jobId, 
          topic: topic, 
          projectId: currentProjectId, 
          title: projectName.trim(), 
          replicaId: selectedReplica,
          duration: totalRequired, 
          status: "active",
          createdAt: Date.now()
        };
        
        const existing = JSON.parse(localStorage.getItem("active_prompt_generations") || "[]");
        localStorage.setItem("active_prompt_generations", JSON.stringify([...existing, newGen]));

        // Disparamos el proceso en el Contexto Global
        startNewProject(response.data.jobId, userId, selectedReplica, {
          projectId: currentProjectId,
          duration: totalRequired,
          keywords,
          targetAudience,
        });

        resetForm(); 
        setShowSuccessModal(true);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e: any) {
      setError(e.message || "An error occurred");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLocalGenerating(false);
    }
  };

  // ... resto de manejadores de modal intactos ...

  return {
    replicas, loadingReplicas, selectedReplica, setSelectedReplica: handleReplicaChange,
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
    showSuccessModal, handleModalAccept: () => { setShowSuccessModal(false); router.push("/dashboard"); },
    handleModalCancel: () => { setShowSuccessModal(false); window.scrollTo({ top: 0, behavior: "smooth" }); },
    handleProjectNameChange: (v: string) => { setProjectName(v); setProjectError(""); },
    handlePlayVideo: (url: string, name: string) => { setPreviewVideo(url); setPreviewReplicaName(name); },
    canGenerate: !!selectedReplica && projectName.trim().length >= 4 && !isLocalGenerating,
  };
}