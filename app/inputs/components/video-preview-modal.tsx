"use client"

import { X } from "lucide-react"

interface VideoPreviewModalProps {
  previewVideo: string | null
  previewReplicaName: string
  onClose: () => void
}

export function VideoPreviewModal({
  previewVideo,
  previewReplicaName,
  onClose,
}: VideoPreviewModalProps) {
  if (!previewVideo) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Overlay */}
  <div
    className="absolute inset-0 bg-black/70"
    onClick={onClose}
  />

  {/* Modal */}
  <div className="relative z-10 max-w-4xl w-full mx-4">

    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition"
    >
      <X className="w-5 h-5 text-white" />
    </button>

    {/* Video Container */}
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
      <video
        src={previewVideo}
        className="w-full h-full object-contain"
        controls
        autoPlay
        loop
      />
    </div>
  </div>
</div>

  )
}
