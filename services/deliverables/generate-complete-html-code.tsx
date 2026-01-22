export interface GenerateCompleteHtmlCodeRequest {
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

export interface GenerateCompleteHtmlCodeResponse {
  success: boolean
  data: {
    jobId: string
    status: string
    deliverableType: string
  }
}

export async function generateCompleteHtmlCode(
  token: string,
  data: GenerateCompleteHtmlCodeRequest,
): Promise<GenerateCompleteHtmlCodeResponse> {
  const response = await fetch("/gateway/videos/generate-complete-html-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to generate complete HTML code")
  }

  return response.json()
}
