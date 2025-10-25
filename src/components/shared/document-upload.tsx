"use client"

import { useState } from "react"
import { Upload, X, FileIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"

/**
 * Document Upload Component
 * Task 3.5.4, REQ-2.1.14, REQ-2.1.15, REQ-2.1.16
 *
 * Features:
 * - Uploads to Supabase Storage with RLS
 * - Preview for images
 * - File size validation (max 5MB)
 * - File type validation
 * - Progress indicator
 * - Remove/replace functionality
 *
 * Path structure: {bucket}/{asociacion_id}/{user_id}/{filename}
 */

interface DocumentUploadProps {
  label: string
  description?: string
  accept?: string
  maxSizeMB?: number
  currentUrl?: string | null
  onUploadComplete: (url: string) => void
  onRemove?: () => void
  bucket?: string
  folder?: string // asociacion_id/user_id
  required?: boolean
  disabled?: boolean
}

export function DocumentUpload({
  label,
  description,
  accept = "image/*,.pdf",
  maxSizeMB = 5,
  currentUrl,
  onUploadComplete,
  onRemove,
  bucket = "documents",
  folder,
  required = false,
  disabled = false,
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "Error",
        description: `El archivo es demasiado grande. Máximo ${maxSizeMB}MB permitido.`,
        variant: "destructive",
      })
      return
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const fileExt = file.name.split(".").pop()
    const fileName = `${timestamp}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      const publicUrl = urlData.publicUrl

      // Set preview for images
      if (file.type.startsWith("image/")) {
        setPreview(publicUrl)
      } else {
        setPreview(null)
      }

      onUploadComplete(publicUrl)

      toast({
        title: "Éxito",
        description: "Documento subido correctamente",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "No se pudo subir el documento. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ""
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {preview ? (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            {preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={preview}
                alt={label}
                className="h-24 w-24 object-cover rounded border"
              />
            ) : (
              <div className="h-24 w-24 flex items-center justify-center border rounded bg-muted">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">Documento subido</p>
              <p className="text-xs text-muted-foreground mt-1">
                {preview.split("/").pop()?.split("?")[0] || "archivo"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(preview, "_blank")}
                disabled={disabled}
              >
                Ver
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-3 rounded-full bg-muted">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {uploading ? "Subiendo..." : "Selecciona un archivo"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Máximo {maxSizeMB}MB
              </p>
            </div>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading || disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
        </div>
      )}
    </div>
  )
}
