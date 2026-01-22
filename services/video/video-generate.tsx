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
    status: string
    tavusVideoId: string
    message: string
    cdnUrl?: string
    s3Url?: string
  }
}

/**
 * Genera un video a partir de texto o documento
 * @param token - JWT token de autenticación
 * @param request - Datos para la generación del video
 */
export const generateVideo = async (token: string, request: VideoGenerateRequest): Promise<VideoGenerateResponse> => {
  const response = await fetch("/gateway/videos/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo generar el video`)
  }

  return response.json()
}
