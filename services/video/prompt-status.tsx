
export interface PromptStatusData {
  scriptId: string;
  jobId: string;
  status: string;
  prompt: string;
  extractedScript: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  processingTime: number;
  error: string | null;
  createdAt: string;
  completedAt: string;
}

export interface PromptStatusResponse {
  success: boolean;
  data: PromptStatusData;
}

export async function getPromptStatus(
  token: string,
  jobId: string
): Promise<PromptStatusResponse> {
  const response = await fetch(`gateway/videos/prompt-status/${jobId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get prompt status: ${response.statusText}`);
  }

  return response.json();
}
