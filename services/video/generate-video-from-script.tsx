

export interface GenerateVideoFromScriptOptions {
  waitForCompletion?: boolean
  callbackUrl?: string
  background?: string
  voice?: string
}

export interface GenerateVideoFromScriptRequest {
  scriptId: string
  userId: string
  replicaId?: string
  userInput?: string
  documentId?: string
  projectId?: string
  duration?: number
  style?: string
  language?: string
  position?: string
  size?: string
  trainingType?: string
  options?: GenerateVideoFromScriptOptions
}

export interface GenerateVideoFromScriptResponse {
  success: boolean
  data: {
    videoId: string
    projectId: string | null
    tavusVideoId: string
    replica_id: string
    status: string
    video_url: string
    prompt: string
    usage: any | null
    cached: any | null
    jobId: string
  }
}

export async function generateVideoFromScript(
  token: string,
  request: GenerateVideoFromScriptRequest
): Promise<GenerateVideoFromScriptResponse> {
  const response = await fetch(`/gateway/videos/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Failed to generate video from script")
  }

  return response.json()
}
