export interface GeneratePromptRequest {
  userId: string
  userInput?: string
  documentId?: string
}

export interface GeneratePromptResponse {
  success: boolean
  data: {
    prompt: string
    usage: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
    cached: boolean
  }
}

/**
 * Genera un prompt optimizado para video
 * @param token - JWT token de autenticación
 * @param request - Datos para generar el prompt
 */
export const generateVideoPrompt = async (
  token: string,
  request: GeneratePromptRequest,
): Promise<GeneratePromptResponse> => {
  const response = await fetch("/gateway/videos/generate-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo generar el prompt`)
  }

  return response.json()
}
