"use client"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MAX_WORDS } from "../types" // Podrías renombrar esto a MAX_CHARS si lo prefieres

interface InputMethodsCardProps {
  topic: string
  keywords: string
  targetAudience: string
  onTopicChange: (value: string) => void
  onKeywordsChange: (value: string) => void
  onTargetAudienceChange: (value: string) => void
}
export function InputMethodsCard({
  topic,
  keywords,
  targetAudience,
  onTopicChange,
  onKeywordsChange,
  onTargetAudienceChange,
}: InputMethodsCardProps) {
  // Cambiamos la lógica de palabras por caracteres
  const charsUsed = topic.length
  const charsRemaining = Math.max(0, MAX_WORDS - charsUsed)

  return (
    <Card className="mb-8 p-0 border-0 shadow-none bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Topic Input */}
        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4 flex flex-col justify-between">
          <div>
            <Label className="text-2xl text-[#272830] font-normal mb-2 block">Enter Topic *</Label>
            <Textarea 
              value={topic} 
              onChange={(e) => onTopicChange(e.target.value)} 
              placeholder="Create a video about the importance of..." 
              className="min-h-[120px] resize-none border-[#DADADA] rounded-[12px]" 
            />
          </div>
          <span className="text-[11px] text-right mt-2 text-gray-500">
            Characters used: {charsUsed}
          </span>
        </div>
        
        {/* Keywords Input */}
        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4 flex flex-col justify-between">
          <div>
            <Label className="text-2xl text-[#272830] font-normal mb-2 block">Keywords (Optional)</Label>
            <Textarea 
              value={keywords} 
              onChange={(e) => onKeywordsChange(e.target.value)} 
              placeholder="Coffee, Health, Health benefits of coffee" 
              className="min-h-[120px] resize-none border-[#DADADA] rounded-[12px]" 
            />
          </div>
          <span className="text-[11px] text-right mt-2 text-gray-500">
            Limit: {MAX_WORDS}
          </span>
        </div>
        
        {/* Target Audience Input */}
        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4 flex flex-col justify-between">
          <div>
            <Label className="text-2xl text-[#272830] font-normal mb-2 block">Target Audience (Optional)</Label>
            <Textarea 
              value={targetAudience} 
              onChange={(e) => onTargetAudienceChange(e.target.value)} 
              placeholder="Marketing specialists / Business executives" 
              className="min-h-[120px] resize-none border-[#DADADA] rounded-[12px]" 
            />
          </div>
          <span className="text-[11px] text-right mt-2 text-gray-500">
            Remaining: {charsRemaining}
          </span>
        </div>
      </div>
    </Card>
  )
}