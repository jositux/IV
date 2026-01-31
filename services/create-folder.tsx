export interface CreateFolderRequest {
  folderName: string
  color?: string // Added since your body includes it
}

export interface CreateFolderResponse {
  success: boolean
  data: {
    folderId: string
    folderName: string
    color: string
    createdAt: string
  }
}

/**
 * Creates a new folder to organize projects
 * @param token - Authentication JWT token
 * @param request - Folder creation data
 */
export const createFolder = async (
  token: string, 
  request: CreateFolderRequest
): Promise<CreateFolderResponse> => {
  const response = await fetch("/gateway/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: Could not create folder`);
  }

  return response.json()
}