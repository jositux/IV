"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Play } from "lucide-react"
import { VIDEO_LENGTHS, LANGUAGES } from "../types"

interface OutputFormatCardProps {
  videoLength: string
  videoPosition: string
  videoSize: string
  language: string
  onVideoLengthChange: (value: string) => void
  onVideoPositionChange: (value: string) => void
  onVideoSizeChange: (value: string) => void
  onLanguageChange: (value: string) => void
}

export function OutputFormatCard({
  videoLength,
  videoPosition,
  videoSize,
  language,
  onVideoLengthChange,
  onVideoPositionChange,
  onVideoSizeChange,
  onLanguageChange,
}: OutputFormatCardProps) {
  return (
    <Card className="border-0 shadow-none mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            Video Length
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {VIDEO_LENGTHS.map((length) => (
              <Button
                key={length}
                variant={videoLength === length ? "default" : "outline"}
                onClick={() => onVideoLengthChange(length)}
                className={`h-8 rounded-full ${
                  videoLength === length
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100"
                }`}
              >
                {length}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            Video Position
          </Label>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => onVideoPositionChange("bottom-left")}
              className={`flex-1 h-32 bg-gray-100 rounded-lg relative transition-all cursor-pointer ${
                videoPosition === "bottom-left"
                  ? "ring-2 border-2 border-[#000000] ring-indigo-500 bg-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="absolute bottom-3 left-3 w-12 h-9 bg-gray-800 rounded flex items-center justify-center shadow-sm">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter opacity-0 hover:opacity-100 transition-opacity">
                Bottom Left
              </span>
            </button>
            <button
              onClick={() => onVideoPositionChange("bottom-right")}
              className={`flex-1 h-32 bg-gray-100 rounded-lg relative transition-all cursor-pointer ${
                videoPosition === "bottom-right"
                  ? "ring-2 border-2 border-[#000000] ring-indigo-500 bg-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="absolute bottom-3 right-3 w-12 h-9 bg-gray-800 rounded flex items-center justify-center shadow-sm">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter opacity-0 hover:opacity-100 transition-opacity">
                Bottom Right
              </span>
            </button>
          </div>

          <Label className="text-1xl text-[#272830] font-normal mb-2 block">
            Size
          </Label>
          <div className="space-y-2">
            {["compact", "standard", "featured"].map((size) => (
              <Button
                key={size}
                variant="outline"
                onClick={() => onVideoSizeChange(size)}
                className={`w-full rounded-full capitalize cursor-pointer transition-colors duration-200 ${
                  videoSize === size
                    ? "bg-gray-800 text-white hover:bg-gray-800 hover:text-white border-gray-800"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200 border-transparent"
                }`}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            Language
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                variant="outline"
                onClick={() => onLanguageChange(lang.code)}
                className={`w-full rounded-full text-xs px-1 capitalize cursor-pointer transition-all ${
                  language === lang.code
                    ? "bg-gray-800 text-white hover:bg-gray-800 hover:text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
