export interface Replica {
  replica_id: string
  replica_name: string
  status: string
  thumbnail_video_url: string
  training_progress: string
  model_name: string
  created_at: string
  updated_at: string
}

export interface ReplicasResponse {
  success: boolean
  data: Replica[]
}

/**
 * Obtiene la lista de replicas disponibles
 * @param token - JWT token de autenticación
 */
export const getVideoReplicas = async (token: string): Promise<ReplicasResponse> => {
  const response = await fetch("/gateway/videos/replicas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron obtener las replicas`)
  }

  return response.json()
}
