export async function getAuthToken(): Promise<string> {
  if (typeof window === "undefined") return ""

  try {
    const response = await fetch("/api/token")
    const data = await response.json()
    return data.token || ""
  } catch (error) {
    console.error("Failed to get auth token:", error)
    return ""
  }
}
