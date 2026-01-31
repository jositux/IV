/**
 * Interfaces basadas en la respuesta del Proyecto
 */

 export interface VideoScript {
  scriptId: string;
  extractedScript: string;
  originalPrompt: string;
  metaData: {
    size?: string;
    jobId?: string;
    style?: string;
    duration?: number;
    language?: string;
    position?: string;
    trainingType?: string;
  };
  createdAt: string;
}

export interface ProjectVideo {
  videoId: string;
  userId: string;
  projectId: string;
  replicaId: string;
  tavusVideoId: string;
  status: "completed" | "processing" | "failed" | "queued" | "pending";
  duration: number;
  creditsCharged: number;
  localFilePath: string;
  cdnUrl: string;
  tavusUrl: string;
  prompt: string;
  metaData: {
    embed: string;
    directPlay: string;
    bunnyVideoId: string;
    thumbnailURL: string;
    previewAnimationURL: string;
    error?: string; // Para capturar errores si el status es failed
  };
  createdAt: string;
  updatedAt: string;
  scriptId: string;
  script: VideoScript;
}

export interface ProjectDetail {
  projectId: string;
  userId: string;
  folderId: string;
  projectName: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  folder: {
    folderId: string;
    folderName: string;
    color: string | null;
  };
  videoConfigs: any[];
  inputResources: any[];
  projectAddons: any[];
  videos: ProjectVideo[];
  generatedArtifacts: any[];
}

export interface ProjectResponse {
  success: boolean;
  data: ProjectDetail;
}

/**
 * Servicio para obtener un proyecto por su ID
 * GET {{base_url}}/projects/:projectId
 */
export const getProjectById = async (
  token: string,
  projectId: string
): Promise<ProjectResponse> => {
  try {
    const response = await fetch(`/gateway/projects/${projectId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: Failed to fetch project`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getProjectById:", error);
    throw error;
  }
};