"use client"

import React, { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Plus, X, FileText, Globe, Trash2, Circle, FileJson } from "lucide-react"

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
      className={`mt-auto p-4 rounded-xl border transition-all cursor-pointer flex gap-4 items-start ${
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
  const [isDragging, setIsDragging] = useState(false)

  // --- Lógica de Archivos (Ahora acepta PDF, DOC, DOCX) ---
  const processFiles = useCallback((selectedFiles: File[]) => {
    const validExtensionFiles = selectedFiles.filter(file => {
      const name = file.name.toLowerCase();
      return name.endsWith('.doc') || name.endsWith('.docx') || name.endsWith('.pdf');
    })

    const newFiles = validExtensionFiles.filter(newFile => {
      const isDuplicate = files.some((existingFile: File) => 
        existingFile.name === newFile.name && 
        existingFile.size === newFile.size
      )
      return !isDuplicate
    })

    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles])
    }
  }, [files, onFilesChange])

  // --- Handlers de Drag & Drop ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(true);
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }

  const validateAndAddUrl = useCallback(() => {
    let rawUrl = newUrl.trim()
    if (!rawUrl) return
    let urlToValidate = rawUrl.toLowerCase()
    if (!/^https?:\/\//i.test(urlToValidate)) urlToValidate = `https://${urlToValidate}`
    
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?.*)?$/
    if (urlPattern.test(urlToValidate)) {
      const isDuplicate = urls.some((u: string) => u.toLowerCase() === urlToValidate.toLowerCase())
      if (!isDuplicate) {
        onUrlsChange([...urls, urlToValidate])
        onNewUrlChange("")
        setUrlError(false)
      } else {
        onNewUrlChange("")
      }
    } else {
      setUrlError(true)
    }
  }, [newUrl, urls, onUrlsChange, onNewUrlChange])

  return (
    <Card className="p-0 shadow-none border-0 bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
        
        {/* SECCIÓN DOCUMENTOS */}
        <div className="bg-white rounded-[24px] border border-[#DADADA] p-6 shadow-sm flex flex-col min-h-[400px]">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">Documents (Optional)</Label>
          
          <div
            onClick={() => document.getElementById("file-upload-v2")?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-4 relative ${
              isDragging 
                ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]" 
                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/10"
            }`}
          >
            <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors ${isDragging ? "text-indigo-500" : "text-gray-400"}`} />
            <p className="text-xs text-gray-500 font-medium pointer-events-none">
              {isDragging ? "Drop files now" : "Drag & drop or click to browse"}
            </p>
            <p className="text-[10px] text-[#6D58BB] mt-1 font-semibold uppercase tracking-wider pointer-events-none">
              Only .doc, .docx, .pdf
            </p>
            
            <input 
              id="file-upload-v2" 
              type="file" 
              multiple 
              className="hidden" 
              accept=".doc,.docx,.pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                if (e.target.files) {
                  processFiles(Array.from(e.target.files))
                  e.target.value = ""
                }
              }} 
            />
          </div>

          {/* LISTA DINÁMICA */}
          <div className="space-y-2 mb-6">
            {files.map((file: any, i: number) => (
              <div 
                key={`${file.name}-${file.size}-${i}`} 
                className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 animate-in fade-in zoom-in duration-200"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {/* Cambia el icono si es PDF */}
                  {file.name.toLowerCase().endsWith('.pdf') ? (
                    <FileJson className="w-4 h-4 text-red-500 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                  )}
                  <span className="text-xs text-gray-600 truncate font-medium">{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onFilesChange(files.filter((_:any, idx:any) => idx !== i))} 
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <PrimaryFocusOption 
            selected={primaryFocus === "files"}
            onClick={() => onPrimaryFocusChange("files")}
            title="Set these files as Primary Focus"
            description="The AI will prioritize the content of your uploaded Word and PDF documents."
          />
        </div>

        {/* SECCIÓN URLS */}
        <div className="bg-white rounded-[24px] border border-[#DADADA] p-6 shadow-sm flex flex-col min-h-[400px]">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">Web URLs (Optional)</Label>
          <div className="flex gap-2 mb-4">
            <Input
              value={newUrl}
              onChange={(e) => onNewUrlChange(e.target.value)}
              onBlur={validateAndAddUrl}
              placeholder="www.anyurl.com"
              className={`rounded-xl h-11 ${urlError ? "border-red-500 ring-red-500" : "border-gray-200"}`}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), validateAndAddUrl())}
            />
            <Button onClick={validateAndAddUrl} className="bg-[#6D58BB] hover:bg-[#5a48a3] h-11 px-5 rounded-xl cursor-pointer">
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>

          <div className="space-y-2 mb-6">
            {urls.map((url: string, i: number) => (
              <div key={`${url}-${i}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs text-gray-600 truncate font-medium">{url}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onUrlsChange(urls.filter((_:any, idx:any) => idx !== i))} className="h-7 w-7 p-0 text-gray-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <PrimaryFocusOption 
            selected={primaryFocus === "urls"}
            onClick={() => onPrimaryFocusChange("urls")}
            title="Set these URLs as Primary Focus"
            description="Use this if the website content is the main source of information."
          />
        </div>
      </div>
    </Card>
  )
}