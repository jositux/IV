"use client"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileText } from "lucide-react"

interface GeneratedScriptCardProps {
  generatedScript: string
  scriptId: string
}

export function GeneratedScriptCard({
  generatedScript,
  scriptId,
}: GeneratedScriptCardProps) {
  // Si no hay guion generado todavía, no mostramos nada o mostramos un estado vacío
  if (!generatedScript && !scriptId) return null;

  return (
    <Card className="bg-white rounded-[20px] mb-8 border border-[#DADADA] shadow-none p-6 mt-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl text-[#080936] font-medium">Generated Script</h2>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
              ID: {scriptId || "Pending..."}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 flex gap-1 px-3 py-1">
          <Sparkles className="w-3 h-3" />
          AI Generated
        </Badge>
      </div>

      <div className="relative group">
        <Textarea
          readOnly
          value={generatedScript}
          placeholder="The AI is drafting your script..."
          className="min-h-[200px] bg-[#F9FAFB] border-[#E5E7EB] text-[#3E4462] leading-relaxed resize-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl p-4"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F9FAFB] to-transparent rounded-b-xl pointer-events-none" />
      </div>

      <p className="mt-4 text-sm text-[#6B7280] italic">
        * This script was automatically generated based on your inputs and training type. 
        It is currently being processed to create your video.
      </p>
    </Card>
  )
}