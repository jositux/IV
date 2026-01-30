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
          <Label className="text-sm text-[#272830] font-normal mb-2 mt-2 block">
          30s and 1m are 4 credits, each additional minute is 3 credits
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

        <div className="bg-white rounded-[20px] border border-[#0B0F3A] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            Video Position
          </Label>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => onVideoPositionChange("bottom-left")}
              className={`flex-1 h-32 bg-gray-100 rounded-lg relative transition-all cursor-pointer ${
                videoPosition === "bottom-left"
                  ? "ring-2 border-2 border-[#0B0F3A] ring-indigo-500 bg-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="absolute bottom-3 left-3 w-12 h-9 bg-[#0B0F3A] rounded flex items-center justify-center shadow-sm">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter opacity-100 hover:opacity-100 transition-opacity">
                Bottom Left
              </span>
            </button>
            <button
              onClick={() => onVideoPositionChange("bottom-right")}
              className={`flex-1 h-32 bg-gray-100 rounded-lg relative transition-all cursor-pointer ${
                videoPosition === "bottom-right"
                  ? "ring-2 border-2 border-[#0B0F3A] ring-indigo-500 bg-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="absolute bottom-3 right-3 w-12 h-9 bg-[#0B0F3A] rounded flex items-center justify-center shadow-sm">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter opacity-100 hover:opacity-100 transition-opacity">
                Bottom Right
              </span>
            </button>
          </div>

          <Label className="text-1xl text-[#272830] font-normal mb-2 mt-6 block">
            Size of video
          </Label>
          <div className="space-y-2">
          {["compact", "standard", "featured"].map((size) => {
  const dimensions = {
    compact: "(720x1280 px)",
    standard: "(1080x1920 px)",
    featured: "(1440x560 px)",
  };

  const isSelected = videoSize === size;

  return (
    <div key={size} className="flex flex-col gap-1.5 w-full mb-2">
   <Button
  variant="outline"
  onClick={() => onVideoSizeChange(size)}
  className={`w-full h-12 rounded-full capitalize cursor-pointer transition-all duration-200 text-[15px] font-semibold tracking-tight border-2 ${
    isSelected
      ? "bg-[#0B0F3A] text-white border-[#0B0F3A] shadow-md translate-y-[-1px] hover:bg-[#0B0F3A] hover:text-white hover:border-[#1D4ED8]"
      : "bg-white text-[#0B0F3A] border-[#D1D5DB] hover:bg-[#1D4ED8] hover:text-white hover:border-[#1D4ED8] hover:shadow-md"
  }`}
>
  {size} 
  <span className={`ml-2 text-xs font-normal transition-colors duration-200 ${
    isSelected 
      ? "text-blue-100 opacity-90" 
      : "text-gray-400 group-hover:text-blue-100"
  }`}>
    {dimensions[size as keyof typeof dimensions]}
  </span>
</Button>
      
      {/* Subtextos con criterio diferenciado */}
      <div className="px-5">
        {size === "compact" && (
          <p className="text-[11px] text-gray-400 font-medium">
            Best for fast sharing and mobile previews
          </p>
        )}
        
        {size === "standard" && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold ${isSelected ? "text-[#0B0F3A]" : "text-[#0B0F3A]"}`}>
              Recommended
            </span>
            <span className="text-[10px] text-amber-500">⭐</span>
            <span className="text-[10px] text-gray-400 font-normal">(default)</span>
          </div>
        )}

        {size === "featured" && (
          <p className="text-[11px] text-gray-400 font-medium italic">
            High-fidelity output for professional use
          </p>
        )}
      </div>
    </div>
  );
})}
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
