"use client"

import React, { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Plus, X, FileText, Globe, Trash2, Circle } from "lucide-react"

// Componente interno para el diseño de la imagen
function PrimaryFocusOption({ 
  selected, 
  title, 
  description, 
  onClick 
}: { 
  selected: boolean, 
  title: string, 
  description: string, 
  onClick: () => void 
}) {
  return (
    <div 
      onClick={onClick}
      className={`mt-4 p-4 rounded-xl border transition-all cursor-pointer flex gap-4 items-start ${
        selected ? "bg-indigo-50/30 border-indigo-100" : "bg-gray-50/50 border-transparent hover:border-gray-200"
      }`}
    >
      <div className="mt-1">
        {selected ? (
          <div className="w-5 h-5 rounded-full border-[6px] border-[#1A367F] bg-white" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[#272830] font-bold text-sm leading-tight">
          {title}
        </span>
        <span className="text-[#5E6272] text-xs leading-relaxed">
          {description}
        </span>
      </div>
    </div>
  )
}

export function FileUploadCard({
  files,
  urls,
  newUrl,
  primaryFocus,
  onFilesChange,
  onUrlsChange,
  onNewUrlChange,
  onPrimaryFocusChange,
}: any) {
  const [urlError, setUrlError] = useState(false)

  const validateAndAddUrl = useCallback(() => {
    let rawUrl = newUrl.trim()
    if (!rawUrl) return
    let urlToValidate = rawUrl.toLowerCase()
    if (!/^https?:\/\//i.test(urlToValidate)) urlToValidate = `https://${urlToValidate}`
    
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?.*)?$/
    if (urlPattern.test(urlToValidate)) {
      if (!urls.includes(urlToValidate)) onUrlsChange([...urls, urlToValidate])
      onNewUrlChange("")
      setUrlError(false)
    } else {
      setUrlError(true)
    }
  }, [newUrl, urls, onUrlsChange, onNewUrlChange])

  return (
    <Card className="p-0 shadow-none border-0 bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* SECCIÓN DOCUMENTOS */}
        <div className="bg-white rounded-[24px] border border-[#DADADA] p-6 shadow-sm flex flex-col h-full">
          <Label className="text-xl text-[#272830] font-semibold mb-4 block">Documents</Label>
          
          <div
            onClick={() => document.getElementById("file-upload-v2")?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-indigo-300 hover:bg-indigo-50/10 cursor-pointer transition-all mb-4"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-medium">Drag & drop or click to browse</p>
            <input id="file-upload-v2" type="file" multiple className="hidden" onChange={(e) => e.target.files && onFilesChange([...files, ...Array.from(e.target.files)])} />
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-[120px] mb-2 pr-1">
            {files.map((file: any, i: number) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs text-gray-600 truncate font-medium">{file.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onFilesChange(files.filter((_:any, idx:any) => idx !== i))} className="h-7 w-7 p-0 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <PrimaryFocusOption 
            selected={primaryFocus === "files"}
            onClick={() => onPrimaryFocusChange("files")}
            title="Set these files as Primary Focus"
            description="Example: If the PDF(s) you enter is about training, you may want to select 'Primary Focus' to ensure the training closely follows the PDF(s)"
          />
        </div>

        {/* SECCIÓN URLS */}
        <div className="bg-white rounded-[24px] border border-[#DADADA] p-6 shadow-sm flex flex-col h-full">
          <Label className="text-xl text-[#272830] font-semibold mb-4 block">Web URLs</Label>
          
          <div className="flex gap-2 mb-4">
            <Input
              value={newUrl}
              onChange={(e) => onNewUrlChange(e.target.value)}
              onBlur={validateAndAddUrl}
              placeholder="www.anyurl.com"
              className={`rounded-xl h-11 ${urlError ? "border-red-500 ring-red-500" : "border-gray-200"}`}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), validateAndAddUrl())}
            />
            <Button onClick={validateAndAddUrl} className="bg-[#6D58BB] hover:bg-[#5a48a3] h-11 px-5 rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-[120px] mb-2 pr-1">
            {urls.map((url: string, i: number) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs text-gray-600 truncate font-medium">{url}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onUrlsChange(urls.filter((_:any, idx:any) => idx !== i))} className="h-7 w-7 p-0 text-gray-400">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <PrimaryFocusOption 
            selected={primaryFocus === "urls"}
            onClick={() => onPrimaryFocusChange("urls")}
            title="Set these URLs as Primary Focus"
            description="Example: Use this if the website content is the main source of information, ensuring the AI prioritizes the URL data over other inputs."
          />
        </div>

      </div>
    </Card>
  )
}