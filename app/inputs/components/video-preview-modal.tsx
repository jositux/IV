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
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {previewReplicaName} - Preview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
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
