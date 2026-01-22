export interface VideoDetails {
  videoId: string
  replicaId: string
  status: string
  cdnUrl?: string
  s3Url?: string
  tavusVideoId?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface VideoDetailsResponse {
  success: boolean
  data: VideoDetails
}

/**
 * Obtiene los detalles completos de un video
 * @param token - JWT token de autenticación
 * @param replicaId - ID de la replica del video
 */
export const getVideoDetails = async (token: string, replicaId: string): Promise<VideoDetailsResponse> => {
  const response = await fetch(`/gateway/videos/replica/${replicaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron obtener los detalles del video`)
  }

  return response.json()
}
