interface GenerateSeoGeoRequest {
  projectId: string
  scriptId: string
}

interface GenerateSeoGeoResponse {
  success: boolean
  data: {
    jobId: string
    projectId: string
    status: string
    message: string
  }
}

export async function generateSeoGeo(token: string, request: GenerateSeoGeoRequest): Promise<GenerateSeoGeoResponse> {
  const { projectId, scriptId } = request

  const response = await fetch(`/gateway/projects/${projectId}/generate-seo-geo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scriptId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate SEO/GEO: ${response.statusText}`)
  }

  const data: GenerateSeoGeoResponse = await response.json()
  return data
}
