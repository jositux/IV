"use client"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MAX_WORDS } from "../types"

interface InputMethodsCardProps {
  topic: string
  keywordPhrases: string
  audience: string
  onTopicChange: (value: string) => void
  onKeywordPhrasesChange: (value: string) => void
  onAudienceChange: (value: string) => void
}

export function InputMethodsCard({
  topic,
  keywordPhrases,
  audience,
  onTopicChange,
  onKeywordPhrasesChange,
  onAudienceChange,
}: InputMethodsCardProps) {
  const wordsUsed = topic.split(/\s+/).filter((word) => word.length > 0).length
  const wordsRemaining = MAX_WORDS - wordsUsed

  return (
    <Card className="mb-8 p-0 border-0 shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            Enter Topic or Text
          </Label>
          <Textarea
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Enter your topic or text here..."
            className="min-h-[120px] resize-none border border-[#DADADA] shadow-none"
          />
          <span className="right text-[11px]">
            Words used: {wordsUsed.toLocaleString()}
          </span>
        </div>
        
        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            Keywords / Keyword Phrases
          </Label>
          <Textarea
            value={keywordPhrases}
            onChange={(e) => onKeywordPhrasesChange(e.target.value)}
            placeholder="Coffee, Health, Health benefits of coffee"
            className="min-h-[120px] resize-none border border-[#DADADA] shadow-none"
          />
          <span className="right text-[11px]">
            Maximum: {MAX_WORDS.toLocaleString()}
          </span>
        </div>
        
        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            Target Audience (Optional)
          </Label>
          <Textarea
            value={audience}
            onChange={(e) => onAudienceChange(e.target.value)}
            placeholder="Marketing specialists / Business executives"
            className="min-h-[120px] resize-none border border-[#DADADA] shadow-none"
          />
          <span className="right text-[11px]">
            Remaining: {wordsRemaining.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  )
}
