"use client"

import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface GeneratedScriptCardProps {
  generatedScript: string
  scriptId: string
}

export function GeneratedScriptCard({
  generatedScript,
  scriptId,
}: GeneratedScriptCardProps) {
  if (!generatedScript) return null

  return (
    <Card className="p-4 sm:p-8 mb-8 bg-indigo-50 border-indigo-200">
      <div className="flex items-start gap-4 mb-4">
        <Sparkles className="w-6 h-6 text-indigo-600 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Generated Script
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Script ID: {scriptId}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
          {generatedScript}
        </pre>
      </div>
    </Card>
  )
}
