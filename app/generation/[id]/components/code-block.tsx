"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string
  filename?: string
  language?: string
  title?: string
}

export function CodeBlock({ code, filename, language = "html", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-end px-4 py-2 border-b bg-zinc-50">
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      {/* Code Content */}
      <div className={`relative bg-white overflow-hidden ${expanded ? "" : "max-h-96"}`}>
        <div className="overflow-x-auto">
          <pre className="p-4">
            <code className="text-sm font-mono leading-relaxed block whitespace-pre">
              {code.split("\n").map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-right select-none text-zinc-400 w-12">{i + 1}</span>
                  <span className="table-cell text-zinc-800">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* Expand Overlay when collapsed */}
        {!expanded && code.split("\n").length > 15 && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/95 to-transparent flex items-end justify-center pb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(true)}
              className="text-zinc-600 hover:text-zinc-900 font-medium"
            >
              Expand
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
