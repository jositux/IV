"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface StickyFooterProps {
  totalCredits: number
  generating: boolean
  prompting: boolean
  canGenerate: boolean
  canPrompt: boolean
  onGeneratePrompt: () => void
  onGenerate: () => void
}

export function StickyFooter({
  totalCredits,
  generating,
  prompting,
  canGenerate,
  canPrompt,
  onGeneratePrompt,
  onGenerate,
}: StickyFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-600">Total Credits Required</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalCredits} credits
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            onClick={onGeneratePrompt}
            disabled={prompting || !canPrompt}
            size="lg"
            variant="outline"
            className="flex-1 sm:flex-none border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-6 text-lg font-semibold bg-transparent"
          >
            {prompting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Prompting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Prompting
              </>
            )}
          </Button>
          <Button
            onClick={onGenerate}
            disabled={generating || !canGenerate}
            size="lg"
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Video"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
