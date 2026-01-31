export interface CreateProjectRequest {
  folderId: string
  projectName: string
}

export interface CreateProjectResponse {
  success: boolean
  data: {
    projectId: string
    folderId: string
    projectName: string
    status: string
    createdAt: string
  }
}

/**
 * Crea un nuevo proyecto dentro de una carpeta
 * @param token - JWT token de autenticación
 * @param request - Datos del proyecto a crear
 */
export const createProject = async (token: string, request: CreateProjectRequest): Promise<CreateProjectResponse> => {
  const response = await fetch("/gateway/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo crear el proyecto`)
  }

  return response.json()
}
