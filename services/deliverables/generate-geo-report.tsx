export interface GenerateGeoReportRequest {
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

export interface GenerateGeoReportResponse {
  success: boolean
  data: {
    jobId: string
    status: string
    deliverableType: string
  }
}

export async function generateGeoReport(
  token: string,
  data: GenerateGeoReportRequest,
): Promise<GenerateGeoReportResponse> {
  const response = await fetch("/gateway/videos/generate-geo-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to generate GEO report")
  }

  return response.json()
}
