"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoPopup({ isOpen, onClose }: VideoPopupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          <video
            className="w-full h-full"
            controls
            autoPlay
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Optional: Video Info */}
        <div className="p-6 bg-gradient-to-br from-purple-900 to-purple-800 text-white">
          <h3 className="text-xl font-bold mb-2">See How It Works</h3>
          <p className="text-purple-200 text-sm">
            Watch how IntelligentVideos transforms your content into professional videos in minutes using advanced AGI
            technology.
          </p>
        </div>
      </div>
    </div>
  )
}
