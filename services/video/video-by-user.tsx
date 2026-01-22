export interface UserVideo {
  videoId: string
  userId: string
  projectId: string | null
  replicaId: string
  tavusVideoId: string
  status: string
  duration: number | null
  creditsCharged: number | null
  cdnUrl: string | null
  tavusUrl: string
  localFilePath: string | null
  prompt: string
  metaData: {
    jobId?: string
    embed?: string
    directPlay?: string
    bunnyVideoId?: string
    thumbnailURL?: string
    previewAnimationURL?: string
  }
  createdAt: string
  updatedAt: string
  directPlay: string | null
  embed: string | null
  thumbnailURL: string | null
  previewAnimationURL: string | null
  bunnyVideoId: string | null
}

export interface VideosByUserResponse {
  success: boolean
  data: UserVideo[]
  count: number
}

/**
 * Obtiene todos los videos de un usuario específico
 * @param token - JWT token de autenticación
 * @param userId - ID del usuario
 */
export const getVideosByUser = async (token: string, userId: string): Promise<VideosByUserResponse> => {
  const response = await fetch(`/gateway/videos/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron obtener los videos del usuario`)
  }

  return response.json()
}
