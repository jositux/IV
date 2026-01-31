export interface GenerateKeywordResearchRequest {
  scriptId?: string
  videoScript?: string
  projectId?: string
  videoId?: string
  videoTopic?: string
  industry?: string
  targetAudience?: string
  brandName?: string
  productName?: string
  videoSize?: string
  directPlayUrl?: string
  embedUrl?: string
  websiteUrl?: string
  videoDuration?: number
  averageSaleValue?: number
  keywords?: string[]
  topic?: string
}

export interface GenerateKeywordResearchResponse {
  success: boolean
  data: {
    jobId: string
    status: string
    deliverableType: string
  }
}

export async function generateKeywordResearch(
  token: string,
  data: GenerateKeywordResearchRequest,
): Promise<GenerateKeywordResearchResponse> {
  const response = await fetch("/gateway/videos/generate-keyword-research", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to generate keyword research")
  }

  return response.json()
}
