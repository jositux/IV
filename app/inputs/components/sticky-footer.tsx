"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface StickyFooterProps {
  totalCredits: number
  generating: boolean
  canGenerate: boolean
  onGenerate: () => void
}

export function StickyFooter({
  totalCredits,
  generating,
  canGenerate,
  onGenerate,
}: StickyFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-600">Total Credits Required</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalCredits} credits
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            onClick={onGenerate}
            disabled={generating || !canGenerate}
            size="lg"
            className="flex-1 sm:w-64 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold transition-all"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
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