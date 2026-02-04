"use client";

import { memo, useEffect } from "react";
import { Play, Clock, CreditCard, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { type UserVideo } from "@/services/video/video-by-user";
import { getProjectById, type ProjectVideo } from "@/services/get-project-by-id";

// Normaliza ProjectVideo a UserVideo para compatibilidad
function normalizeToUserVideo(pv: ProjectVideo): UserVideo {
  return {
    videoId: pv.videoId,
    userId: pv.userId,
    projectId: pv.projectId,
    replicaId: pv.replicaId,
    tavusVideoId: pv.tavusVideoId,
    status: pv.status,
    duration: pv.duration,
    creditsCharged: pv.creditsCharged,
    localFilePath: pv.localFilePath,
    cdnUrl: pv.cdnUrl,
    tavusUrl: pv.tavusUrl,
    prompt: pv.prompt,
    metaData: pv.metaData,
    createdAt: pv.createdAt,
    updatedAt: pv.updatedAt,
    // Campos que en UserVideo están en root, en ProjectVideo están en metaData
    embed: pv.metaData?.embed ?? null,
    directPlay: pv.metaData?.directPlay ?? null,
    thumbnailURL: pv.metaData?.thumbnailURL ?? null,
    previewAnimationURL: pv.metaData?.previewAnimationURL ?? null,
    bunnyVideoId: pv.metaData?.bunnyVideoId ?? null,
  };
}

const formatVideoDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const dayMonthYear = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date: dayMonthYear, time };
};

const projectFetcher = async ([_, token, projectId]: [string, string, string]) => {
  const res = await getProjectById(token, projectId);
  return res.data;
};

interface VideoCardProps {
  video: UserVideo;
  token: string | null;
  projectName: string;
  onOpenVideo: (video: UserVideo) => void;
  getStatusBadge: (status: string) => { color: string };
  onFinalized: () => void;
}

export const VideoCard = memo(function VideoCard({
  video: initialVideo,
  token,
  projectName,
  onOpenVideo,
  getStatusBadge,
  onFinalized,
}: VideoCardProps) {
  const isTransient = ["processing", "queued", "pending"].includes(
    initialVideo.status?.toLowerCase()
  );

  const { data: updatedData } = useSWR(
    isTransient && token && initialVideo.projectId
      ? ["project-status", token, initialVideo.projectId]
      : null,
    projectFetcher,
    { refreshInterval: 8000, revalidateOnFocus: false }
  );

  const video: UserVideo = updatedData?.videos?.[0] 
    ? normalizeToUserVideo(updatedData.videos[0]) 
    : initialVideo;
  const status = video.status.toLowerCase();
  const isProcessing = status === "processing" || status === "queued";
  const dateTime = formatVideoDate(video.createdAt);

  useEffect(() => {
    if (initialVideo.status.toLowerCase() !== "completed" && status === "completed") {
      onFinalized();
    }
  }, [status, initialVideo.status, onFinalized]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 group h-full transition-shadow hover:shadow-md rounded-[24px] overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <img
              src={`/assets/avatars/${video.replicaId || "default"}.jpg`}
              className="w-full h-full object-cover object-top"
              alt=""
            />
            {status === "completed" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  className="rounded-full bg-white text-gray-900 w-16 h-16 shadow-lg cursor-pointer"
                  onClick={() => onOpenVideo(video)}
                >
                  <Play className="w-8 h-8 ml-1" fill="#6D58BB" color="#6D58BB" />
                </Button>
              </div>
            )}
            <Badge
              className={`rounded-[20px] font-normal absolute top-2 right-2 ${getStatusBadge(status).color}`}
            >
              {status}
            </Badge>
          </div>
          <div className="p-5 space-y-2">
            <Link href={`/generation/${video.projectId}/`} className="cursor-pointer">
              <h2 className="text-2xl text-[#272830] font-medium truncate hover:text-[#6D58BB] cursor-pointer">
                {projectName || "Untitled Project"}
              </h2>
            </Link>
            <p className="text-sm text-[#272830] line-clamp-1 italic min-h-[40px]">
              "{video.prompt?.replace(/<[^>]*>?/gm, "")}"
            </p>
            <div className="flex items-center justify-between pt-3">
              <div className="flex gap-2 text-[12px]">
                {typeof video.duration === "number" && video.duration > 0 && (
                  <span className="bg-[#E2F2FE] text-[#2056E0] font-light px-2 py-1 rounded-[20px]">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {video.duration} sec
                  </span>
                )}
                {typeof video.creditsCharged === "number" && video.creditsCharged > 0 && (
                  <span className="bg-[#FFF4CA] text-[#8F3F01] font-light px-2 py-1 rounded-[20px]">
                    <CreditCard className="w-3 h-3 inline mr-1" />
                    {video.creditsCharged} credits
                  </span>
                )}
              </div>
              {dateTime && (
                <div className="text-[11px] text-[#272830] font-light text-right">
                  <div>{dateTime.date}</div>
                  <div className="opacity-80">{dateTime.time}</div>
                </div>
              )}
            </div>
            <div className="pt-3">
              {isProcessing ? (
                <Button
                  disabled
                  className="w-full h-10 bg-[#E2F2FE] text-[#2056E0] rounded-[20px] gap-2 border-none"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                </Button>
              ) : status === "completed" ? (
                <Link href={`/generation/${video.projectId}/`} className="w-full cursor-pointer">
                  <Button
                    variant="ghost"
                    className="w-full h-10 bg-[#E2F2FE] text-[#080936] rounded-[20px] hover:bg-[#6D58BB] hover:text-white transition-all cursor-pointer"
                  >
                    View Project <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  className="w-full h-10 bg-red-50 text-red-600 rounded-[20px] border-none italic"
                >
                  Failed
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
