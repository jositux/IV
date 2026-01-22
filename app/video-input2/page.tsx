"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Plus,
  X,
  FileText,
  Globe,
  Trash2,
  Loader2,
  Play,
  Check,
  Send,
  Sparkles,
} from "lucide-react";
import {
  getVideoReplicas,
  type Replica,
} from "@/services/video/video-replicas";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { generateVideo } from "@/services/video/video-generate";
import { generateVideoFromScript } from "@/services/video/generate-video-from-script";
import { uploadDocument } from "@/services/documents/document-upload";
import { generateVideoPrompt } from "@/services/video/generate-video-prompt";
import { getAuthToken } from "@/lib/get-auth-token";
import { getListFolders } from "@/services/get-list-folders";
import { getListProjects } from "@/services/get-list-projects";
import { createFolder } from "@/services/create-folder";
import { createProject } from "@/services/create-project";
import { getOrCreateMainFolder } from "@/services/get-or-create-main-folder"; // Import getOrCreateMainFolder

const videoLengths = [
  "30s",
  "1m",
  "2m",
  "3m",
  "4m",
  "5m",
  "6m",
  "7m",
  "8m",
  "9m",
  "10m",
];

const languages = [
  { code: "english", label: "US English" },
  { code: "spanish", label: "Es Spanish" },
  { code: "french", label: "Fr French" },
  { code: "chinese", label: "Ch Chinese" },
  { code: "german", label: "De German" },
];

const additionalProducts = [
  {
    title: "Long-Form Article",
    credits: 15,
    description:
      "Transform your video content into comprehensive written articles.",
    features: ["GEO Optimized", "Auto-Generated Images", "SEO & Schema Markup"],
  },
  {
    title: "Video Landing Page",
    credits: 8,
    description: "Professional landing page with GEO optimization.",
    features: ["GEO Optimized", "341% Higher Conversion", "Mobile Optimized"],
  },
  {
    title: "Omni-Channel Suite",
    credits: 10,
    description: "Complete communication package across all channels.",
    features: ["PowerPoint", "LinkedIn & X Posts", "Email Templates"],
  },
];

export default function VideoCreatorPage() {
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [loadingReplicas, setLoadingReplicas] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [selectedReplica, setSelectedReplica] = useState<string>("");
  const [videoLength, setVideoLength] = useState("30s");
  const [language, setLanguage] = useState("en");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [videoPosition, setVideoPosition] = useState("bottom-left");
  const [videoSize, setVideoSize] = useState("standard");
  const [primaryFocus, setPrimaryFocus] = useState<"files" | "urls">("files");
  const [topic, setTopic] = useState("");
  const [keywordPhrases, setKeywordPhrases] = useState("");
  const [audience, setAudience] = useState("");
  const [generating, setGenerating] = useState(false);
  const [prompting, setPrompting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [previewReplicaName, setPreviewReplicaName] = useState<string>("");
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [scriptId, setScriptId] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [projectError, setProjectError] = useState<string>("");
  const [checkingProject, setCheckingProject] = useState(false);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [customAudience, setCustomAudience] = useState("");
  const [customAudienceOptions, setCustomAudienceOptions] = useState<string[]>([]);
  const maxWords = 20000;
  const wordsUsed = topic.split(/\s+/).filter((word) => word.length > 0).length;
  const wordsRemaining = maxWords - wordsUsed;

  useEffect(() => {
    const loadReplicas = async () => {
      try {
        const token = await getAuthToken();
        const response = await getVideoReplicas(token);
        if (response.success && response.data.length > 0) {
          setReplicas(response.data);
          setSelectedReplica(response.data[0].replica_id);
        }
      } catch (err) {
        setError("Failed to load avatars. Please refresh the page.");
      } finally {
        setLoadingReplicas(false);
      }
    };

    loadReplicas();
  }, []);

  const addUrl = () => {
    if (newUrl.trim()) {
      setUrls([...urls, newUrl]);
      setNewUrl("");
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles: File[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        newFiles.push(selectedFiles[i]);
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("file-upload")?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const newFiles: File[] = [];
      for (let i = 0; i < droppedFiles.length; i++) {
        newFiles.push(droppedFiles[i]);
      }
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const toggleProduct = (title: string) => {
    if (selectedProducts.includes(title)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== title));
    } else {
      setSelectedProducts([...selectedProducts, title]);
    }
  };

  const audienceOptions = [
    "Compliance & Safety",
    "Sales Enablement",
    "Employee Orientation",
    "Marketing & Product",
    "Learning & Development",
    "Internal Communications",
    "Customer Service",
  ];

  const toggleAudience = (audience: string) => {
    setTargetAudience((prev) =>
      prev.includes(audience)
        ? prev.filter((a) => a !== audience)
        : [...prev, audience]
    );
  };

  const addCustomAudience = () => {
    const trimmed = customAudience.trim();
    if (trimmed && !audienceOptions.includes(trimmed) && !customAudienceOptions.includes(trimmed)) {
      setCustomAudienceOptions((prev) => [...prev, trimmed]);
      setTargetAudience((prev) => [...prev, trimmed]);
      setCustomAudience("");
    }
  };

  const getOrCreateFolder = async (token: string): Promise<string> => {
    const foldersResponse = await getListFolders(token);
    if (foldersResponse.success && foldersResponse.data.length > 0) {
      return foldersResponse.data[0].folderId;
    }

    const newFolder = await createFolder(token, { folderName: "Main" });
    if (newFolder && (newFolder as any).folderId) {
      return (newFolder as any).folderId;
    }

    const updatedFolders = await getListFolders(token);
    if (updatedFolders.success && updatedFolders.data.length > 0) {
      return updatedFolders.data[0].folderId;
    }

    throw new Error("Could not create or find a folder");
  };

  const calculateTotalCredits = () => {
    let total = 4;
    for (const title of selectedProducts) {
      const product = additionalProducts.find((p) => p.title === title);
      if (product) total += product.credits;
    }
    return total;
  };

  const getDurationInSeconds = () => {
    const match = videoLength.match(/(\d+)(s|m)/);
    if (!match) return 30;
    const value = parseInt(match[1]);
    const unit = match[2];
    return unit === "m" ? value * 60 : value;
  };

  const validateAndCreateProject = async (): Promise<string | null> => {
    if (!projectName.trim()) {
      setProjectError("Please enter a project name");
      return null;
    }

    if (projectName.trim().length < 4) {
      setProjectError("Project name must be at least 4 characters");
      return null;
    }

    setCheckingProject(true);
    setProjectError("");

    try {
      const token = await getAuthToken();

      const projectsResponse = await getListProjects(token);
      if (projectsResponse.success) {
        const existingProject = projectsResponse.data.find(
          (project) =>
            project.projectName.toLowerCase() ===
            projectName.trim().toLowerCase()
        );
        if (existingProject) {
          setProjectError("A project with this name already exists");
          setCheckingProject(false);
          return null;
        }
      }

      const folderId = await getOrCreateFolder(token);

      const projectResponse = await createProject(token, {
        folderId,
        projectName: projectName.trim(),
      });

      if (projectResponse.success) {
        setProjectId(projectResponse.data.projectId);
        setProjectError("");
        return projectResponse.data.projectId;
      }

      throw new Error("Failed to create project");
    } catch (err) {
      setProjectError(
        err instanceof Error ? err.message : "Failed to validate project"
      );
      return null;
    } finally {
      setCheckingProject(false);
    }
  };

  const handleGeneratePrompt = async () => {
    setError("");
    setSuccess("");
    setPrompting(true);

    try {
      const token = await getAuthToken();
      const userStr = localStorage.getItem("user");
      const userId = userStr;

      if (!userId) {
        setError("Please login to generate prompts");
        setPrompting(false);
        return;
      }

      if (!topic) {
        setError("Please provide a topic to generate a prompt");
        setPrompting(false);
        return;
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
      });

      if (response.success) {
        setGeneratedScript(response.data.extractedScript);
        setScriptId(response.data.scriptId);
        setSuccess("Prompt generated successfully!");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate prompt"
      );
    } finally {
      setPrompting(false);
    }
  };

  const handleGenerate = async () => {
    setError("");
    setSuccess("");
    setProjectError("");
    setGenerating(true);

    try {
      const token = await getAuthToken();
      const userStr = localStorage.getItem("user");
      const userId = userStr;

      if (!userId) {
        setError("Please login to generate videos");
        setGenerating(false);
        return;
      }

      if (!projectName.trim() || projectName.trim().length < 4) {
        setProjectError("Project name must be at least 4 characters");
        setGenerating(false);
        return;
      }

      if (!selectedReplica) {
        setError("Please select an avatar");
        setGenerating(false);
        return;
      }

      if (!topic && files.length === 0) {
        setError("Please provide a topic or upload a file");
        setGenerating(false);
        return;
      }

      // Step 1: Check if project name already exists
      const projectsResponse = await getListProjects(token);
      if (projectsResponse.success) {
        const existingProject = projectsResponse.data.find(
          (project) =>
            project.projectName.toLowerCase() === projectName.trim().toLowerCase()
        );
        if (existingProject) {
          setProjectError("A project with this name already exists");
          setGenerating(false);
          return;
        }
      }

      // Step 2: Get or create folder and create project
      const folderId = await getOrCreateFolder(token);
      const projectResponse = await createProject(token, {
        folderId,
        projectName: projectName.trim(),
      });

      if (!projectResponse.success) {
        setError("Failed to create project");
        setGenerating(false);
        return;
      }

      const currentProjectId = projectResponse.data.projectId;
      setProjectId(currentProjectId);

      let documentId: string | undefined;

      if (files.length > 0) {
        const uploadResponse = await uploadDocument(token, files[0], {
          userId,
          saveToS3: true,
          isPrimaryFocus: false,
        });
        if (uploadResponse.success) {
          documentId = uploadResponse.data.id;
        }
      }

      // Step 3: Generate prompt if we have a topic
      let currentScriptId = scriptId;
      console.log("[v0] Step 3 - topic:", topic, "currentScriptId:", currentScriptId, "scriptId state:", scriptId);
      
      if (topic) {
        console.log("[v0] Generating prompt with topic:", topic);
        const promptResponse = await generateVideoPrompt(token, {
          userInput: topic,
          userId,
          duration: getDurationInSeconds(),
          style: "professional",
          language,
          position: videoPosition,
          size: videoSize,
          trainingType: "Product and Sales",
        });

        console.log("[v0] Prompt response:", promptResponse);

        if (promptResponse.success) {
          currentScriptId = promptResponse.data.scriptId;
          setScriptId(currentScriptId);
          setGeneratedScript(promptResponse.data.extractedScript);
          console.log("[v0] Generated scriptId:", currentScriptId);
        } else {
          console.log("[v0] Prompt generation failed:", promptResponse);
        }
      } else {
        console.log("[v0] No topic provided, skipping prompt generation");
      }

      // Step 4: Generate video
      let response;

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
        });
      } else {
        response = await generateVideo(token, {
          userId,
          replicaId: selectedReplica,
          userInput: topic || keywordPhrases,
          documentId,
          options: {
            waitForCompletion: false,
          },
        });
      }

      if (response.success) {
        setSuccess(
          `Video generation started! Video ID: ${response.data.videoId}`
        );
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video");
    } finally {
      setGenerating(false);
    }
  };

  const handlePlayVideo = (
    videoUrl: string,
    replicaName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setPreviewVideo(videoUrl);
    setPreviewReplicaName(replicaName);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <div className="min-h-screen p-4">
        <AppHeader />
        <div className="py-8">
          <div className="text-center mb-12">
            <h1 className="mb-4 text-5xl font-medium text-[#080936]">
              Simple Inputs, Extraordinary Results
            </h1>
            <p className="text-base sm:text-lg text-[#3E4462] font-regular max-w-2xl mx-auto tracking-tight leading-6">
              Our AGI-powered platform needs minimal input to generate results
              that are more human than human
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <Card className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <Label className="text-lg font-semibold mb-2 block">
                  Project Name
                </Label>
                <Input
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    setProjectError("");
                    setProjectId("");
                  }}
                  placeholder="Enter your project name (min 4 characters)..."
                  className={`max-w-md ${projectError ? "border-red-500" : ""}`}
                />
                {projectError && (
                  <p className="text-sm text-red-600 mt-1">{projectError}</p>
                )}
              </div>
            </div>
          </Card>

          <div className="flex items-start gap-6 mb-8 max-w-[900px] mx-auto">
            {/* Círculo con el número a la izquierda */}
            <div className="text-[#761D78] text-4xl flex items-center justify-center font-regular flex-shrink-0 mt-1">
              1.
            </div>

            {/* Texto a la derecha */}
            <div>
              <h2 className="text-3xl font-regular text-[#080936] leading-snug">
                Choose any one input method below or combine multiple to better
                align with your specific vision. ✨
              </h2>
            </div>
          </div>

          <Card className="mb-8 p-0 border-0 shadow-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-[20px] border-1 border-[#DADADA] px-4 py-4">
                <Label className="text-2xl text-[#272830] font-normal mb-2 block">
                  Enter Topic or Text
                </Label>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter your topic or text here..."
                  className="min-h-[120px] resize-none border-1 border-[#DADADA] shadow-none"
                />
                <span className="right text-[11px]">
                  Words used: {wordsUsed.toLocaleString()}
                </span>
              </div>
              <div className="bg-white rounded-[20px] border-1 border-[#DADADA] px-4 py-4">
                <Label className="text-2xl text-[#272830] font-normal mb-2 block">
                  Keywords / Keyword Phrases
                </Label>
                <Textarea
                  value={keywordPhrases}
                  onChange={(e) => setKeywordPhrases(e.target.value)}
                  placeholder="Coffee, Health, Health benefits of coffee"
                  className="min-h-[120px] resize-none border-1 border-[#DADADA] shadow-none"
                />
                <span className="right text-[11px]">
                  Maximum: {maxWords.toLocaleString()}
                </span>
              </div>
              <div className="bg-white rounded-[20px] border-1 border-[#DADADA] px-4 py-4">
                <Label className="text-2xl text-[#272830] font-normal mb-2 block">
                  Target Audience (Optional)
                </Label>
                <Textarea
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Marketing specialists / Business executives"
                  className="min-h-[120px] resize-none border-1 border-[#DADADA] shadow-none"
                />
                <span className="right text-[11px]">
                  Remaining: {wordsRemaining.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {generatedScript && (
            <Card className="p-4 sm:p-8 mb-8 bg-indigo-50 border-indigo-200">
              <div className="flex items-start gap-4 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Generated Script
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Script ID: {scriptId}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {generatedScript}
                </pre>
              </div>
            </Card>
          )}

          <div className="flex items-start gap-6 mt-16 mb-8 max-w-[900px] mx-auto">
            {/* Círculo con el número a la izquierda */}
            <div className="text-[#761D78] text-4xl flex items-center justify-center font-regular flex-shrink-0 mt-1">
              2.
            </div>

            {/* Texto a la derecha */}
            <div>
              <h2 className="text-3xl font-regular text-[#080936] leading-snug">
                Upload Documents and Web Urls Up to 20,000 words
              </h2>
            </div>
          </div>
          <Card className="p-0 shadow-none border-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-[20px] border-1 border-[#DADADA] px-4 py-4">
                <Label className="text-2xl text-[#272830] font-normal mb-2 block">
                  PDF, PowerPoint, JPEG, XLSX, Word
                </Label>
                <div
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Drag & drop or click to browse
                  </p>
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
                  <div className="space-y-2 mt-4">
                    {files.map((file, index) => (
                      <div
                        key={`file-${index}`}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 mt-4">
                  <input
                    type="radio"
                    id="files-primary"
                    name="primary-focus"
                    checked={primaryFocus === "files"}
                    onChange={() => setPrimaryFocus("files")}
                    className="mt-1"
                  />
                  <label htmlFor="files-primary" className="text-sm">
                    Set as Primary Focus
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-[20px] border-1 border-[#DADADA] px-4 py-4">
                <Label className="text-2xl text-[#272830] font-normal mb-2 block">
                  Web URLs
                </Label>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="www.anyurl.com"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addUrl())
                    }
                  />
                  <Button onClick={addUrl} type="button">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {urls.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {urls.map((url, index) => (
                      <div
                        key={`url-${index}`}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{url}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUrl(index)}
                          className="h-8 w-8 p-0"
                        >
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
                    className="mt-1"
                  />
                  <label htmlFor="urls-primary" className="text-sm">
                    Set as Primary Focus
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-start gap-6 mb-8 mt-16 max-w-[900px] mx-auto">
            {/* Círculo con el número a la izquierda */}
            <div className="text-[#761D78] text-4xl flex items-center justify-center font-regular flex-shrink-0 mt-1">
              3.
            </div>

            {/* Texto a la derecha */}
            <div>
              <h2 className="text-3xl font-regular text-[#080936] leading-snug">
                Choose Your Studio-Grade Avatar
              </h2>
              <p className="text-gray-600 mb-4">
                Pick the digital avatar who will deliver your content. Each has
                different voice, tone, and language.
              </p>
            </div>
          </div>
          <Card className="p-0 border-0 shadow-none mb-8">
            {loadingReplicas ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading avatars...</span>
              </div>
            ) : replicas.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No avatars available
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {replicas.slice(0, 8).map((replica) => (
                   <div key={replica.replica_id} className="text-center">
                   <div
                     className={`relative rounded-xl border border-[#DADADA] overflow-hidden transition-all duration-300 ${
                       selectedReplica === replica.replica_id
                         ? "bg-[#0B0F3A] shadow-xl scale-[1.02]" // Fondo si está seleccionado
                         : "bg-white hover:shadow-lg hover:bg-white"         // Fondo blanco por defecto
                     }`}
                   >
                     <div
                       onClick={() => setSelectedReplica(replica.replica_id)}
                       className="relative aspect-square flex items-center justify-center cursor-pointer"
                     >
                       {/* Contenedor de la imagen: Fondo blanco por defecto, rojo si se selecciona */}
                       <div
                         className={`absolute inset-0 p-3 transition-colors ${
                           selectedReplica === replica.replica_id ? "bg-[#0B0F3A]" : "bg-white"
                         }`}
                       >
                         <img
                           src={`/assets/avatars/${replica.replica_id}.jpg`}
                           alt={replica.replica_name}
                           className="w-full h-full object-cover rounded-[8px]"
                         />
                       </div>
                 
                       {/* Placeholder con inicial (solo se ve si no carga la imagen) */}
                       <div className="absolute inset-0 flex items-center justify-center -z-10">
                         <span className="text-4xl font-bold text-gray-200">
                           {replica.replica_name[0]}
                         </span>
                       </div>
                 
                       {/* Botón de Play */}
                       {replica.thumbnail_video_url && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity">
                           <button
                             onClick={(e) => {
                               e.stopPropagation(); // Evita seleccionar la réplica al querer solo ver el video
                               handlePlayVideo(
                                 replica.thumbnail_video_url,
                                 replica.replica_name,
                                 e
                               );
                             }}
                             className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                           >
                             <Play className="w-6 h-6 text-[#0B0F3A] fill-[#0B0F3A] ml-1" />
                           </button>
                         </div>
                       )}
                     </div>
                 
                     {/* Footer de la Card */}
                     <div
                       onClick={() => setSelectedReplica(replica.replica_id)}
                       className={`py-3 px-4 flex items-center justify-between cursor-pointer transition-colors ${
                         selectedReplica === replica.replica_id
                           ? "bg-[#0B0F3A] text-white" // Un rojo más oscuro para el texto inferior
                           : "bg-white text-gray-900 border-t border-gray-100"
                       }`}
                     >
                       <p className="text-lg font-semibold truncate">
                         {replica.replica_name}
                       </p>
                       
                       {/* Checkmark circular */}
                       <div
                         className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                           selectedReplica === replica.replica_id
                             ? "bg-white text-[#0B0F3A]" 
                             : "bg-gray-100 text-transparent"
                         }`}
                       >
                         <Check strokeWidth={4} className="w-3 h-3" />
                       </div>
                     </div>
                   </div>
                 </div>
                  ))}
                </div>

                <div className="flex items-start gap-6 mb-8 max-w-[900px] mx-auto">
                  <p className="text-[16px] sm:text-[16px] text-gray-700">
                    <strong>Authentic Digital Human Technology.</strong> While
                    typical AI avatars only animate the lower face, our advanced
                    3D rendering captures every subtle movement that creates
                    genuine human presence with pixel-perfect lip
                    synchronization and consistent identity preservation that
                    crosses the threshold from AI-generated to indistinguishable
                    from human video.
                  </p>
                </div>
              </>
            )}
          </Card>

          <div className="flex items-start gap-6 mb-8 mt-16 max-w-[900px] mx-auto">
            {/* Círculo con el número a la izquierda */}
            <div className="text-[#761D78] text-4xl flex items-center justify-center font-regular flex-shrink-0 mt-1">
              4.
            </div>

            {/* Texto a la derecha */}
            <div>
              <h2 className="text-3xl font-regular text-[#080936] leading-snug">
                Output Format
              </h2>
            </div>
          </div>
          <Card className="border-0 shadow-none mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-[20px] border-1 border-[#DADADA] px-4 py-4">
                <Label className="text-2xl text-[#272830] font-normal mb-2 block">
                  Video Length
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {videoLengths.map((length) => (
                    <Button
                      key={length}
                      variant={videoLength === length ? "default" : "outline"}
                      onClick={() => setVideoLength(length)}
                      className={`h-8 rounded-full ${
                        videoLength === length
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {length}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[20px] border-1 border-[#DADADA] px-4 py-4">
                <Label className="text-2xl text-[#272830] font-normal mb-2 block">
                  Video Position
                </Label>
                <div className="flex gap-3 mb-4">
                <button
                    onClick={() => setVideoPosition("bottom-left")}
                    className={`flex-1 h-32 bg-gray-100 rounded-lg relative transition-all cursor-pointer ${
                      videoPosition === "bottom-left"
                        ? "ring-2 border-2 border-[#000000] ring-indigo-500 bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {/* El "Video" en la esquina inferior derecha */}
                    <div className="absolute bottom-3 left-3 w-12 h-9 bg-gray-800 rounded flex items-center justify-center shadow-sm">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>

                    {/* Texto opcional para indicar la posición */}
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter opacity-0 hover:opacity-100 transition-opacity">
                      Bottom Left
                    </span>
                  </button>
                  <button
                    onClick={() => setVideoPosition("bottom-right")}
                    className={`flex-1 h-32 bg-gray-100 rounded-lg relative transition-all cursor-pointer ${
                      videoPosition === "bottom-right"
                      ? "ring-2 border-2 border-[#000000] ring-indigo-500 bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {/* El "Video" en la esquina inferior derecha */}
                    <div className="absolute bottom-3 right-3 w-12 h-9 bg-gray-800 rounded flex items-center justify-center shadow-sm">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>

                    {/* Texto opcional para indicar la posición */}
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter opacity-0 hover:opacity-100 transition-opacity">
                      Bottom Right
                    </span>
                  </button>
                </div>

                <Label className="text-1xl text-[#272830] font-normal mb-2 block">
                  Size
                </Label>
                <div className="space-y-2">
                  {["compact", "standard", "featured"].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      onClick={() => setVideoSize(size)}
                      className={`w-full rounded-full capitalize cursor-pointer transition-colors duration-200 ${
                        videoSize === size
                          ? "bg-gray-800 text-white hover:bg-gray-800 hover:text-white border-gray-800"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 border-transparent"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[20px] border-1 border-[#DADADA] px-4 py-4">
                <Label className="text-2xl text-[#272830] font-normal mb-2 block">
                  Language
                </Label>

                {/* Cambio de space-y-2 a grid de 3 columnas */}
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant="outline"
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full rounded-full text-xs px-1 capitalize cursor-pointer transition-all ${
                        language === lang.code
                          ? "bg-gray-800 text-white hover:bg-gray-800 hover:text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {lang.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-[#F8F9FB] border-0 shadow-none p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Select Additional Products to Maximize Your Content Creation
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Extend your video's reach with these complementary content packages. Each product uses your video content to create additional marketing assets—all generated from the same inputs you've already provided.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {audienceOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleAudience(option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    targetAudience.includes(option)
                      ? "bg-[#E8F4FD] text-[#1E88E5] border border-[#1E88E5]"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
              {customAudienceOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleAudience(option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    targetAudience.includes(option)
                      ? "bg-[#E8F4FD] text-[#1E88E5] border border-[#1E88E5]"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Input
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  placeholder="Other: Please specify other training type"
                  className="pr-10 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomAudience();
                    }
                  }}
                />
                <button
                  onClick={addCustomAudience}
                  disabled={!customAudience.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {targetAudience.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Selected: </span>
                {targetAudience.join(", ")}
              </div>
            )}
          </Card>

          <Card className="p-4 sm:p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Additional Products (Optional)
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {additionalProducts.map((product) => (
                <Card
                  key={product.title}
                  onClick={() => toggleProduct(product.title)}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedProducts.includes(product.title)
                      ? "ring-2 ring-indigo-500 bg-indigo-50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{product.title}</h3>
                    <span className="text-sm font-bold text-blue-600">
                      {product.credits} credits
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.description}
                  </p>
                  <ul className="space-y-1">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-700 flex items-center gap-1"
                      >
                        <span className="text-green-500">&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {previewVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setPreviewVideo(null)}
            />
            <div className="relative z-10 bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {previewReplicaName} - Preview
                </h3>
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={previewVideo}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  loop
                />
              </div>
            </div>
          </div>
        )}
        <AppFooter />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-600">Total Credits Required</p>
            <p className="text-2xl font-bold text-gray-900">
              {calculateTotalCredits()} credits
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={handleGeneratePrompt}
              disabled={prompting || !topic}
              size="lg"
              variant="outline"
              className="flex-1 sm:flex-none border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-6 text-lg font-semibold bg-transparent"
            >
              {prompting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Prompting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Prompting
                </>
              )}
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={
                generating ||
                !selectedReplica ||
                projectName.trim().length < 4 ||
                (!topic && files.length === 0)
              }
              size="lg"
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold"
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
    </div>
  );
}
