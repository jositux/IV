
export interface VideoStatusData {
  replica_id: string;
  status: string;
  video_url: string;
  cdnUrl: string;
  directPlay: string;
  embed: string;
  thumbnailURL: string;
  previewAnimationURL: string;
}

export interface VideoStatusResponse {
  success: boolean;
  data: VideoStatusData;
}

export async function getVideoStatus(
  token: string,
  tavusVideoId: string
): Promise<VideoStatusResponse> {
  const response = await fetch(`gateway/videos/status/${tavusVideoId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get video status: ${response.statusText}`);
  }

  return response.json();
}
