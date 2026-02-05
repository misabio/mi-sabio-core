import { useState, useRef } from 'react'
import { Button } from '@misabio/core-ui'
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react'

export function UploadZone() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('idle')
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      setUploadStatus('success')
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsUploading(false)
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Upload className="h-4 w-4" /> Ingest Data
      </h3>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
            />
            <label
                htmlFor="file-upload"
                className={`
                    flex flex-col items-center justify-center w-full h-32
                    border-2 border-dashed rounded-lg cursor-pointer
                    hover:bg-muted/50 transition-colors
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, TXT, MD</p>
                </div>
            </label>
        </div>

        {isUploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading & Processing...
            </div>
        )}

        {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                <Check className="h-4 w-4" /> Ingested successfully
            </div>
        )}

        {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle className="h-4 w-4" /> {errorMessage || 'Upload failed'}
            </div>
        )}
      </div>
    </div>
  )
}
