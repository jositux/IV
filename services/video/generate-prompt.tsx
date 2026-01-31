
export interface GeneratePromptRequest {
  userInput: string;
  userId: string;
  documentId?: string;
  duration: number;
  style: string;
  language: string;
  position: string;
  size: string;
  trainingType: string;
}

export interface GeneratePromptResponse {
  success: boolean;
  data: {
    jobId: string;
    status: string;
    message: string;
  };
}

export interface PromptStatusUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cache_creation_input_tokens: number;
}

export interface PromptStatusData {
  jobId: string;
  status: string;
  progress: number;
  createdAt: string;
  processedAt: string;
  finishedAt: string | null;
  failedReason: string | null;
  scriptId: string | null;
  prompt: string | null;
  extractedScript: string | null;
  usage: PromptStatusUsage | null;
  cached: boolean | null;
}

export interface PromptStatusResponse {
  success: boolean;
  data: PromptStatusData;
}

export async function generatePrompt(
  token: string,
  request: GeneratePromptRequest
): Promise<GeneratePromptResponse> {
  const response = await fetch(`/gateway/videos/generate-prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate prompt: ${response.statusText}`);
  }

  return response.json();
}
