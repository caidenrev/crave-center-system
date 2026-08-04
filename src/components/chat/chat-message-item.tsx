"use client"

import { useState } from "react"
import { Trash2, FileText, Download, Shield, Briefcase, UserCheck, Ban } from "lucide-react"
import { isImageFile, renderTextWithLinks } from "./chat-utils"

export interface ChatMessage {
  id: string
  projectId: string
  content: string
  visibility: string
  fileUrl?: string | null
  fileName?: string | null
  fileType?: string | null
  isDeleted?: boolean
  createdAt: string
  sender: {
    id: string
    name: string
    email: string
    role: "CLIENT" | "ADMIN" | "TEAM_MEMBER"
  }
}

interface ChatMessageItemProps {
  msg: ChatMessage
  currentUserId: string
  userRole: "CLIENT" | "ADMIN" | "TEAM_MEMBER"
  onDeleteMessage?: (messageId: string) => void
  onPreviewImage?: (imageUrl: string, fileName?: string) => void
}

export function ChatMessageItem({
  msg,
  currentUserId,
  userRole,
  onDeleteMessage,
  onPreviewImage,
}: ChatMessageItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const isMe = msg.sender.id === currentUserId
  const canDelete = !msg.isDeleted && (isMe || userRole === "ADMIN")

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Shield className="w-2.5 h-2.5" /> Admin
          </span>
        )
      case "TEAM_MEMBER":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Briefcase className="w-2.5 h-2.5" /> Tim
          </span>
        )
      case "CLIENT":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <UserCheck className="w-2.5 h-2.5" /> Klien
          </span>
        )
      default:
        return null
    }
  }

  const handleDelete = () => {
    if (!onDeleteMessage) return
    onDeleteMessage(msg.id)
  }

  const hasAttachment = Boolean(msg.fileUrl)
  const isImage = hasAttachment && isImageFile(msg.fileName, msg.fileType)

  return (
    <div className={`group relative flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      {/* Sender Header */}
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          {isMe ? "Anda" : msg.sender.name}
        </span>
        {getRoleBadge(msg.sender.role)}
      </div>

      <div className="relative max-w-[85%] flex items-center gap-2">
        {/* Delete Action Button (Appears on Hover for Owner / Admin) */}
        {canDelete && isMe && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            title="Hapus pesan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Message Bubble */}
        <div
          className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all ${
            msg.isDeleted
              ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 italic border border-slate-200/60 dark:border-slate-800"
              : isMe
              ? "bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-xs shadow-md shadow-indigo-600/25"
              : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-tl-xs shadow-xs"
          }`}
        >
          {msg.isDeleted ? (
            <div className="flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-slate-400" />
              <span>Pesan ini telah dihapus</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Text Content */}
              {msg.content && msg.content !== "[Gambar]" && msg.content !== "[Lampiran File]" && (
                <div className="whitespace-pre-wrap break-words">
                  {renderTextWithLinks(msg.content)}
                </div>
              )}

              {/* Image Attachment */}
              {hasAttachment && isImage && (
                <div className="mt-1 overflow-hidden rounded-xl border border-white/20 dark:border-slate-700 max-w-sm">
                  <img
                    src={msg.fileUrl!}
                    alt={msg.fileName || "Gambar"}
                    onClick={() => onPreviewImage && onPreviewImage(msg.fileUrl!, msg.fileName || undefined)}
                    className="max-h-60 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </div>
              )}

              {/* Document File Attachment */}
              {hasAttachment && !isImage && (
                <a
                  href={msg.fileUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={msg.fileName || "file"}
                  className={`mt-1 flex items-center gap-2.5 p-2.5 rounded-xl border text-xs transition-colors ${
                    isMe
                      ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold truncate max-w-[180px]">
                      {msg.fileName || "Lampiran Dokumen"}
                    </span>
                    <span className="text-[10px] opacity-75">Klik untuk unduh</span>
                  </div>
                  <Download className="w-3.5 h-3.5 shrink-0 opacity-75" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Delete Action Button for Received Messages (Admin override) */}
        {canDelete && !isMe && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            title="Hapus pesan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-slate-400 mt-1 px-1">
        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  )
}
