export interface CreateFolderRequest {
  folderName: string
}

export interface CreateFolderResponse {
  userInput: string
  userId: string
  duration: number
  style: string
  language: string
  position: string
  size: string
  trainingType: string
}

/**
 * Crea una nueva carpeta para organizar proyectos
 * @param token - JWT token de autenticación
 * @param request - Datos de la carpeta a crear
 */
export const createFolder = async (token: string, request: CreateFolderRequest): Promise<CreateFolderResponse> => {
  const response = await fetch("/gateway/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo crear la carpeta`)
  }

  return response.json()
}
