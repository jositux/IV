"use client"

import React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Plus, X, FileText, Globe, Trash2 } from "lucide-react"

interface FileUploadCardProps {
  files: File[]
  urls: string[]
  newUrl: string
  primaryFocus: "files" | "urls"
  onFilesChange: (files: File[]) => void
  onUrlsChange: (urls: string[]) => void
  onNewUrlChange: (url: string) => void
  onPrimaryFocusChange: (focus: "files" | "urls") => void
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
}: FileUploadCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles: File[] = []
      for (let i = 0; i < selectedFiles.length; i++) {
        newFiles.push(selectedFiles[i])
      }
      onFilesChange([...files, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      const newFiles: File[] = []
      for (let i = 0; i < droppedFiles.length; i++) {
        newFiles.push(droppedFiles[i])
      }
      onFilesChange([...files, ...newFiles])
    }
  }

  const triggerFileInput = () => {
    document.getElementById("file-upload-v2")?.click()
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const addUrl = () => {
    if (newUrl.trim()) {
      onUrlsChange([...urls, newUrl])
      onNewUrlChange("")
    }
  }

  const removeUrl = (index: number) => {
    onUrlsChange(urls.filter((_, i) => i !== index))
  }

  return (
    <Card className="p-0 shadow-none border-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            PDF, PowerPoint, JPEG, XLSX, Word
          </Label>
          <div
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 cursor-pointer"
          >
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              Drag & drop or click to browse
            </p>
            <input
              id="file-upload-v2"
              type="file"
              multiple
              accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2 mt-4">
              {files.map((file, index) => (
                <div
                  key={`file-${index}`}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2 mt-4">
            <input
              type="radio"
              id="files-primary-v2"
              name="primary-focus-v2"
              checked={primaryFocus === "files"}
              onChange={() => onPrimaryFocusChange("files")}
              className="mt-1"
            />
            <label htmlFor="files-primary-v2" className="text-sm">
              Set as Primary Focus
            </label>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#DADADA] px-4 py-4">
          <Label className="text-2xl text-[#272830] font-normal mb-2 block">
            Web URLs
          </Label>
          <div className="flex gap-2 mb-4">
            <Input
              value={newUrl}
              onChange={(e) => onNewUrlChange(e.target.value)}
              placeholder="www.anyurl.com"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addUrl())
              }
            />
            <Button onClick={addUrl} type="button">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {urls.length > 0 && (
            <div className="space-y-2 mb-4">
              {urls.map((url, index) => (
                <div
                  key={`url-${index}`}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{url}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUrl(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2">
            <input
              type="radio"
              id="urls-primary-v2"
              name="primary-focus-v2"
              checked={primaryFocus === "urls"}
              onChange={() => onPrimaryFocusChange("urls")}
              className="mt-1"
            />
            <label htmlFor="urls-primary-v2" className="text-sm">
              Set as Primary Focus
            </label>
          </div>
        </div>
      </div>
    </Card>
  )
}
