/**
 * Reprocesa un video fallido
 * Endpoint: /videos/replica/{{tavus_video_id}}/reprocess
 */
 export const reprocessVideo = async (
  token: string,
  videoId: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await fetch(`/gateway/videos/replica/${videoId}/reprocess`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: Failed to reprocess video`);
  }

  return response.json();
};