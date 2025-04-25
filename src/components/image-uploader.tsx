"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ImageUploaderProps {
  onImageSelected: (file: File) => void
  previewUrl: string | null
  label: string
  disabled?: boolean
}

export default function ImageUploader({ onImageSelected, previewUrl, label, disabled = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        onImageSelected(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0])
    }
  }

  const handleClearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageSelected(new File([], ""))
  }

  return (
    <Card className={`p-6 ${isDragging ? "border-primary" : ""}`}>
      <div className="text-lg font-medium mb-4 text-center">{label}</div>

      {previewUrl ? (
        <div className="relative">
          <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-contain rounded-md" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClearImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} h-64 flex flex-col items-center justify-center`}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={!disabled ? handleDragOver : undefined}
          onDragLeave={!disabled ? handleDragLeave : undefined}
          onDrop={!disabled ? handleDrop : undefined}
        >
          <Upload className="h-10 w-10 mb-4 text-gray-400" />
          <p className="text-sm text-gray-500 mb-2">Drag and drop an image here, or click to select</p>
          <p className="text-xs text-gray-400">Supports: JPG, PNG, GIF</p>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </Card>
  )
}

