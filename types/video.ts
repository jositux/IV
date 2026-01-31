export interface VideoGenerateRequest {
  userId: string
  replicaId: string
  userInput?: string
  documentId?: string
  options?: {
    waitForCompletion?: boolean
    callbackUrl?: string
    background?: string
    voice?: string
  }
}

export interface VideoGenerateResponse {
  success: boolean
  data: {
    videoId: string
    replicaId: string
    status: "pending" | "processing" | "completed" | "failed"
    tavusVideoId: string
    message: string
    cdnUrl?: string
    s3Url?: string
  }
}

export interface Replica {
  replica_id: string
  name: string
  status: "active" | "inactive"
}

export interface VideoStatus {
  videoId: string
  status: "pending" | "processing" | "completed" | "failed"
  cdnUrl?: string
  s3Url?: string
  createdAt?: string
  updatedAt?: string
}

export interface PromptGenerateRequest {
  userId: string
  userInput?: string
  documentId?: string
}

export interface PromptGenerateResponse {
  success: boolean
  data: {
    prompt: string
    usage: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
    cached: boolean
  }
}

export interface TavusCallback {
  video_id: string
  status: "completed" | "failed"
  download_url?: string
  error?: string
}
