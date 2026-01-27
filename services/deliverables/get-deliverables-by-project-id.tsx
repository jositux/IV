/**
 * Interfaces basadas exactamente en la estructura de Deliverables proporcionada
 */

 export interface ArtifactUsage {
  cached: boolean;
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cache_creation_input_tokens: number;
}

export interface ArtifactMetaData {
  jobId: string;
  usage: ArtifactUsage;
  cached: boolean;
  userId: string;
  scriptId: string;
  deliverableType: 
    | "customerInstructions" 
    | "geoReport" 
    | "completeHtmlCode" 
    | "seoGeoPackage" 
    | "keywordResearch";
}

export interface ProjectArtifact {
  artifactId: string;
  projectId: string;
  videoId: string | null;
  addonReferenceId: string | null;
  artifactType: 
    | "CUSTOMER_INSTRUCTIONS_HTML" 
    | "GEO_OPTIMIZATION_REPORT_HTML" 
    | "COMPLETE_HTML_CODE" 
    | "SEO_GEO_OPTIMIZATION_PACKAGE_HTML" 
    | "KEYWORD_RESEARCH_HTML";
  contentBody: string;
  metaData: ArtifactMetaData;
  s3Url: string | null;
  createdAt: string;
}

export interface DeliverablesResponse {
  success: boolean;
  data: ProjectArtifact[];
  count: number;
}

/**
 * Servicio para obtener los entregables (artifacts) de un proyecto
 * GET {{base_url}}/projects/:projectId/deliverables
 */
export const getProjectDeliverables = async (
  token: string,
  projectId: string
): Promise<DeliverablesResponse> => {
  try {
    const response = await fetch(`/gateway/projects/${projectId}/deliverables`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: Failed to fetch deliverables`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getProjectDeliverables:", error);
    throw error;
  }
};