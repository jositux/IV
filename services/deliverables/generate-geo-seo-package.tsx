export interface GenerateSeoGeoPackageRequest {
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

export interface GenerateSeoGeoPackageResponse {
  success: boolean
  data: {
    jobId: string
    status: string
    deliverableType: string
  }
}

export async function generateSeoGeoPackage(
  token: string,
  data: GenerateSeoGeoPackageRequest,
): Promise<GenerateSeoGeoPackageResponse> {
  const response = await fetch("/gateway/videos/generate-seo-geo-package", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to generate SEO/GEO package")
  }

  return response.json()
}
