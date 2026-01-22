export interface GeneratePromptRequest {
  userInput: string
  userId: string
  duration: number
  style: string
  language: string
  position: string
  size: string
  trainingType: string
}

export interface PromptUsage {
  input_tokens: number
  cache_creation_input_tokens: number
  cache_read_input_tokens: number
  output_tokens: number
}

export interface GeneratePromptResponse {
  success: boolean
  data: {
    scriptId: string
    prompt: string
    extractedScript: string
    usage: PromptUsage
    cached: boolean
  }
}

export async function generateVideoPrompt(token: string, data: GeneratePromptRequest): Promise<GeneratePromptResponse> {
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  
  const response = await fetch(`${BASE_URL}/api/videos/generate-prompt`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate video prompt: ${response.statusText}`)
  }

  return response.json()
}
