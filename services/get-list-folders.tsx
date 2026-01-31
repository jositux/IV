export interface Folder {
  folderId: string
  userId: string
  folderName: string
  color: string
  createdAt: string
  updatedAt: string
  _count: {
    projects: number
  }
}

export interface GetListFoldersResponse {
  success: boolean
  data: Folder[]
}

export async function getListFolders(token: string): Promise<GetListFoldersResponse> {
  const response = await fetch(`/gateway/folders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get folders: ${response.statusText}`)
  }

  return response.json()
}
