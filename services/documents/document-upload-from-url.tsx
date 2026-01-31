export interface UrlUploadResponse {
  success: boolean
  data: {
    extractedText: string
    wordCount: number
    fileName: string // Aquí llega la URL
    fileType: "WEB"
    documentId: string
    s3Url: string
  }
}

/**
 * Endpoint: /gateway/documents/upload
 * Maneja URLs usando JSON
 */
export const uploadDocumentFromUrl = async (
  token: string,
  url: string,
  userId: string,
  isPrimaryFocus: boolean = false
): Promise<UrlUploadResponse> => {
  const response = await fetch("/gateway/documents/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      userId,
      saveToS3: true,
      isPrimaryFocus,
    }),
  })

  if (!response.ok) throw new Error("Failed to process URL")
  return response.json()
}