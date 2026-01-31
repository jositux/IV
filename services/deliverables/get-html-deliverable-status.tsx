export interface HtmlDeliverableStatusRequest {
  token: string
  jobId: string
}

export interface HtmlDeliverableStatusData {
  jobId: string
  status: "queued" | "processing" | "completed" | "failed"
  progress: number
  deliverableType: string
  createdAt: string
  processedAt: string | null
  finishedAt: string | null
  failedReason: string | null
  artifactId: string | null
}

export interface HtmlDeliverableStatusResponse {
  success: boolean
  data: HtmlDeliverableStatusData
}

export async function getHtmlDeliverableStatus({
  token,
  jobId,
}: HtmlDeliverableStatusRequest): Promise<HtmlDeliverableStatusResponse> {
  const response = await fetch(`/gateway/videos/html-deliverable-status/${jobId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get deliverable status: ${response.statusText}`)
  }

  return response.json()
}
