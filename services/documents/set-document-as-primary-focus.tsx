export interface SetDocumentPrimaryFocusResponse {
  success: boolean
  message: string
}

export async function setDocumentPrimaryFocus(
  token: string,
  documentId: string,
  userId: string
): Promise<SetDocumentPrimaryFocusResponse> {
  const response = await fetch(
    `/gateway/documents/${documentId}/set-primary-focus?userId=${userId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to set document as primary focus: ${response.statusText}`)
  }

  return response.json()
}
