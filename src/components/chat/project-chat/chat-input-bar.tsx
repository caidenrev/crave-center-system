"use client"

import { useState, useRef } from "react"
import { Send, Paperclip, X, Image as ImageIcon, FileText, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { isImageFile } from "./chat-utils"
import { useChatTranslations } from "../chat-i18n"

interface ChatInputBarProps {
  onSendMessage: (content: string, fileUrl?: string, fileName?: string, fileType?: string) => Promise<void>
  isSending: boolean
}

export function ChatInputBar({ onSendMessage, isSending }: ChatInputBarProps) {
  const { t } = useChatTranslations()
  const [inputText, setInputText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Max file size 10MB limit check
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t.maxSizeError)
        return
      }
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!inputText.trim() && !selectedFile) || isSending || isUploading) return

    let fileUrl: string | undefined = undefined
    let fileName: string | undefined = undefined
    let fileType: string | undefined = undefined

    if (selectedFile) {
      setIsUploading(true)
      try {
        const supabase = createClient()
        const fileExt = selectedFile.name.split(".").pop()
        const cleanName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const storagePath = `chat/${cleanName}`

        // Upload to project_briefs storage bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("project_briefs")
          .upload(storagePath, selectedFile)

        if (uploadError) {
          console.error("Storage upload error:", uploadError)
          toast.error(t.uploadError)
          setIsUploading(false)
          return
        }

        const { data: publicUrlData } = supabase.storage
          .from("project_briefs")
          .getPublicUrl(uploadData.path)

        fileUrl = publicUrlData.publicUrl
        fileName = selectedFile.name
        fileType = isImageFile(selectedFile.name) ? "IMAGE" : "FILE"
      } catch (err: any) {
        console.error("Upload error:", err)
        toast.error(t.genericUploadError)
        setIsUploading(false)
        return
      } finally {
        setIsUploading(false)
      }
    }

    const contentToSend = inputText.trim()
    setInputText("")
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""

    await onSendMessage(contentToSend, fileUrl, fileName, fileType)
  }

  const isSendingOrUploading = isSending || isUploading
  const isImageSelected = selectedFile && isImageFile(selectedFile.name)

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col gap-2">
      {/* File Attachment Preview Bar */}
      {selectedFile && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2 truncate">
            {isImageSelected ? (
              <ImageIcon className="w-4 h-4 text-primary shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-primary shrink-0" />
            )}
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
              {selectedFile.name}
            </span>
            <span className="text-[10px] text-slate-500">
              ({(selectedFile.size / 1024).toFixed(0)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.zip,.rar,.txt,.xlsx,.pptx"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSendingOrUploading}
          className="p-2.5 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          title={t.attachFileTooltip}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={selectedFile ? t.addMessageOptional : t.writeMessage}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/50"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={(!inputText.trim() && !selectedFile) || isSendingOrUploading}
          className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white disabled:opacity-50 transition-all shadow-md shadow-primary/20 shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSendingOrUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  )
}
