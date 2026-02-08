"use client"

import { useState } from "react"
import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  value?: string
  onChange: (url?: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative h-48 w-48">
            <Image
              src={preview}
              alt="Upload preview"
              fill
              className="rounded-md object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Button
              onClick={() => {
                setPreview(undefined)
                onChange(undefined)
              }}
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-[300px]">
            <UploadDropzone
              endpoint="imageUploader"
              onUploadBegin={() => {
                setIsLoading(true)
              }}
              onClientUploadComplete={res => {
                setIsLoading(false)
                if (res && res[0]) {
                  setPreview(res[0].url)
                  onChange(res[0].url)
                  toast({
                    title: "Upload complete",
                    description: "Your image has been uploaded successfully.",
                  })
                }
              }}
              onUploadError={(error: Error) => {
                setIsLoading(false)
                toast({
                  variant: "destructive",
                  title: "Upload failed",
                  description:
                    error.message || "Something went wrong. Please try again.",
                })
              }}
              appearance={{
                container:
                  "border-dashed border-2 rounded-lg p-4 ut-uploading:border-primary",
                allowedContent: "text-sm text-muted-foreground",
                button: "ut-ready:bg-primary ut-uploading:bg-primary/50",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
