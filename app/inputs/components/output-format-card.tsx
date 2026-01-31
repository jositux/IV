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
              variant="outline"
              onClick={() => onVideoLengthChange(length)}
              className={`h-8 rounded-full cursor-pointer transition-all ${
                videoLength === length
                  ? "border border-[#0B0F3A] text-[#272830] bg-[#E2F2FE] hover:bg-[#E2F2FE] hover:border-[#0B0F3A] hover:text-[#272830]"
                  : "bg-gray-100 hover:border hover:border-[#0B0F3A] hover:text-[#272830] hover:bg-[#E2F2FE]"
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
  className={`flex-1 h-32 rounded-lg relative transition-all cursor-pointer ${
    videoPosition === "bottom-left"
      ? "ring-2 border-2 border-[#0B0F3A] ring-indigo-500 bg-[#E2F2FE]"
      : "bg-gray-100 hover:bg-[#E2F2FE]"
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
  className={`flex-1 h-32 rounded-lg relative transition-all cursor-pointer ${
    videoPosition === "bottom-right"
      ? "ring-2 border-2 border-[#0B0F3A] ring-indigo-500 bg-[#E2F2FE]"
      : "bg-gray-100 hover:bg-[#E2F2FE]"
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
  className={`w-full h-12 rounded-full capitalize cursor-pointer transition-all duration-200 text-[15px] font-semibold tracking-tight border-1 ${
    isSelected
      ? "bg-[#E2F2FE] text-[#272830] border-[#0B0F3A] hover:bg-[#E2F2FE] hover:text-[#272830]"
      : "bg-gray-100 text-[#272830] border-[#D1D5DB] hover:bg-[#E2F2FE] hover:text-[#272830] hover:border-[#0B0F3A]"
  }`}
>
  {size}

  <span
    className={`ml-2 text-xs font-normal transition-colors duration-200 ${
      isSelected
        ? "text-[#272830]/80"
        : "text-gray-400 group-hover:text-[#272830]"
    }`}
  >
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
              className={`w-full rounded-full text-xs px-1 capitalize cursor-pointer transition-all h-8 ${
                language === lang.code
                  ? "border-[#0B0F3A] border-1 text-[#272830] bg-[#E2F2FE] hover:bg-[#E2F2FE]"
                  : "bg-gray-100 hover:bg-[#E2F2FE] hover:text-[#272830] hover:border-[#0B0F3A]"
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
