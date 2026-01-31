import type { VideoGenerateRequest, PromptGenerateRequest } from "@/types/video"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export async function getReplicas(token: string) {
  const response = await fetch(`${API_BASE_URL}/videos/replicas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch replicas")
  }

  return response.json()
}

export async function generateVideo(data: VideoGenerateRequest, token: string) {
  const response = await fetch(`${API_BASE_URL}/videos/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to generate video")
  }

  return response.json()
}

export async function generatePrompt(data: PromptGenerateRequest, token: string) {
  const response = await fetch(`${API_BASE_URL}/videos/generate-prompt`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to generate prompt")
  }

  return response.json()
}

export async function getVideoStatus(replicaId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/videos/status/${replicaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch video status")
  }

  return response.json()
}

export async function getVideoDetails(replicaId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/videos/replica/${replicaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch video details")
  }

  return response.json()
}

export async function uploadDocument(file: File, token: string) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to upload document")
  }

  return response.json()
}
