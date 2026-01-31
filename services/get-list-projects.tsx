export interface ProjectFolder {
  folderId: string
  folderName: string
  color: string
}

export interface Project {
  projectId: string
  userId: string
  folderId: string
  projectName: string
  status: string
  createdAt: string
  completedAt: string | null
  folder: ProjectFolder
  videoConfigs: any[]
  inputResources: any[]
  projectAddons: any[]
  _count: {
    videos: number
    generatedArtifacts: number
  }
}

export interface GetListProjectsResponse {
  success: boolean
  data: Project[]
}

export async function getListProjects(token: string): Promise<GetListProjectsResponse> {
  const response = await fetch(`/gateway/projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get projects: ${response.statusText}`)
  }

  return response.json()
}
