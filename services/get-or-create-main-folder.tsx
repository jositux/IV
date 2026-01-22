import { getListFolders } from "./get-list-folders"
import { createFolder } from "./create-folder"

export async function getOrCreateMainFolder(token: string): Promise<string> {
  const foldersResponse = await getListFolders(token)
  if (foldersResponse.success && foldersResponse.data.length > 0) {
    // Return the first folder in the list
    return foldersResponse.data[0].folderId
  }

  // No folders exist, create "Main"
  const newFolder = await createFolder(token, { name: "Main" })
  if (newFolder && (newFolder as any).folderId) {
    return (newFolder as any).folderId
  }

  // Re-fetch to get the newly created folder
  const updatedFolders = await getListFolders(token)
  if (updatedFolders.success && updatedFolders.data.length > 0) {
    return updatedFolders.data[0].folderId
  }

  throw new Error("Could not create or find a folder")
}
