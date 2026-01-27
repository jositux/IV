export interface GenerateCustomerInstructionsRequest {
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

export interface GenerateCustomerInstructionsResponse {
  success: boolean
  data: {
    jobId: string
    status: string
    deliverableType: string
  }
}

export async function generateCustomerInstructions(
  token: string,
  data: GenerateCustomerInstructionsRequest,
): Promise<GenerateCustomerInstructionsResponse> {
  const response = await fetch("/gateway/videos/generate-customer-instructions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to generate customer instructions")
  }

  return response.json()
}
