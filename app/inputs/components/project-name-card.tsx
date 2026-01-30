"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"

interface ProjectNameCardProps {
  projectName: string
  projectError: string
  onProjectNameChange: (value: string) => void
}

export function ProjectNameCard({
  projectName,
  projectError,
  onProjectNameChange,
}: ProjectNameCardProps) {
  return (
    
    <Card className="mb-12 p-0 border-0 shadow-none max-w-[900px] mx-auto bg-transparent">
    <div className="flex flex-col items-center w-full">
  <div className="w-full">
    <Input
      value={projectName}
      onChange={(e) => onProjectNameChange(e.target.value)}
      placeholder="Project name * (Min 4 characters)"
      className={`
        w-full h-[70px] px-6 
        !text-[22px] font-medium text-[#080936]
        bg-white border-[1px] rounded-[20px]
        placeholder:font-light
        focus-visible:ring-2 focus-visible:ring-blue-600/20
        transition-all duration-300 shadow-none
        ${projectError ? "border-red-500 bg-red-50/50 text-red-600 focus-visible:ring-red-200" : "border-[#DADADA]"}
      `}
    />

    {/* Error Label with Suggestion */}
    {projectError && (
      <div className="mt-2 ml-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
        <span className="text-red-500 text-sm font-medium">
          The name is used. Please choose a unique name for your project.
        </span>
      </div>
    )}
  </div>
</div>
  </Card>
    
  )
}
