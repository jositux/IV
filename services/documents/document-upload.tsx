export interface FileUploadResponse {
  success: boolean
  data: {
    extractedText: string
    wordCount: number
    fileName: string
    fileType: string
    documentId: string
    s3Key: string
    s3Url: string
  }
}

/**
 * Endpoint: /gateway/documents/upload
 * Maneja archivos físicos usando FormData
 */
export const uploadDocumentFile = async (
  token: string,
  file: File,
  userId: string,
  isPrimaryFocus: boolean = false
): Promise<FileUploadResponse> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("userId", userId)
  formData.append("saveToS3", "true")
  formData.append("isPrimaryFocus", String(isPrimaryFocus))

  const response = await fetch("/gateway/documents/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) throw new Error("Failed to upload file")
  return response.json()
}