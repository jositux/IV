export interface VideoMetaData {
  embed: string
  directPlay: string
  bunnyVideoId: string
  thumbnailURL: string
  previewAnimationURL: string
}

export interface VideoByReplicaId {
  videoId: string
  replicaId: string
  tavusVideoId: string
  status: string
  duration: number
  creditsCharged: number
  cdnUrl: string
  tavusUrl: string
  localFilePath: string
  prompt: string
  metaData: VideoMetaData
  createdAt: string
  updatedAt: string
  directPlay: string
  embed: string
  thumbnailURL: string
  previewAnimationURL: string
  bunnyVideoId: string
}

export interface VideoByReplicaIdResponse {
  success: boolean
  data: VideoByReplicaId
}

/**
 * Obtiene los detalles completos de un video por replica ID
 * @param token - JWT token de autenticación
 * @param replicaId - ID de la replica del video
 */
export const getVideoByReplicaId = async (token: string, replicaId: string): Promise<VideoByReplicaIdResponse> => {
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
