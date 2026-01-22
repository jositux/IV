export interface VideoStatus {
  videoId: string
  status: "pending" | "processing" | "completed" | "failed"
  cdnUrl?: string
  s3Url?: string
}

export interface VideoStatusResponse {
  success: boolean
  data: VideoStatus
}

/**
 * Consulta el estado de un video
 * @param token - JWT token de autenticación
 * @param replicaId - ID de la replica del video
 */
export const getVideoStatus = async (token: string, replicaId: string): Promise<VideoStatusResponse> => {
  const response = await fetch(`/gateway/videos/status/${replicaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo obtener el estado del video`)
  }

  return response.json()
}
