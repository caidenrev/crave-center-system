"use client"

import { useState } from "react"
import { Trash2, Edit2, FileText, Download, Shield, Briefcase, UserCheck, Ban, Check, X, MoreVertical } from "lucide-react"
import { isImageFile, renderTextWithLinks } from "./chat-utils"
import { useChatTranslations } from "../chat-i18n"

export interface ChatMessage {
  id: string
  projectId?: string | null
  content: string
  visibility?: string
  fileUrl?: string | null
  fileName?: string | null
  fileType?: string | null
  isDeleted?: boolean
  isEdited?: boolean
  createdAt: string
  sender: {
    id: string
    name: string
    email?: string
    role?: "CLIENT" | "ADMIN" | "TEAM_MEMBER"
    image?: string | null
  }
}

interface ChatMessageItemProps {
  msg: ChatMessage
  currentUserId: string
  userRole?: "CLIENT" | "ADMIN" | "TEAM_MEMBER"
  onDeleteMessage?: (messageId: string) => void
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>
  onPreviewImage?: (imageUrl: string, fileName?: string) => void
}

export function ChatMessageItem({
  msg,
  currentUserId,
  userRole = "CLIENT",
  onDeleteMessage,
  onEditMessage,
  onPreviewImage,
}: ChatMessageItemProps) {
  const { t } = useChatTranslations()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(msg.content)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isMe = msg.sender.id === currentUserId
  const canDelete = !msg.isDeleted && (isMe || userRole === "ADMIN")
  const canEdit = !msg.isDeleted && isMe

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Shield className="w-2.5 h-2.5" /> {t.admin}
          </span>
        )
      case "TEAM_MEMBER":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Briefcase className="w-2.5 h-2.5" /> {t.team}
          </span>
        )
      case "CLIENT":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <UserCheck className="w-2.5 h-2.5" /> {t.client}
          </span>
        )
      default:
        return null
    }
  }

  const handleDelete = () => {
    setShowMenu(false)
    if (!onDeleteMessage) return
    onDeleteMessage(msg.id)
  }

  const handleSaveEdit = async () => {
    if (!onEditMessage || !editText.trim()) return
    setIsSavingEdit(true)
    await onEditMessage(msg.id, editText.trim())
    setIsSavingEdit(false)
    setIsEditing(false)
    setShowMenu(false)
  }

  const hasAttachment = Boolean(msg.fileUrl)
  const isImage = hasAttachment && isImageFile(msg.fileName, msg.fileType)

  return (
    <div className={`group relative flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      {/* Sender Header */}
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          {isMe ? t.you : msg.sender.name}
        </span>
        {getRoleBadge(msg.sender.role)}
      </div>

      <div className="relative max-w-[85%] flex items-center gap-1.5">
        {/* Action Buttons / Menu on Hover or Touch (Left side for own messages) */}
        {isMe && (canEdit || canDelete) && !isEditing && (
          <div className="relative shrink-0">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 bg-slate-800/80 backdrop-blur-md rounded-xl p-0.5 border border-slate-700/60 shadow-lg">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setEditText(msg.content)
                    setIsEditing(true)
                  }}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title={t.edit}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors"
                  title={t.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Message Bubble Container */}
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
              <Ban className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{t.messageDeleted}</span>
            </div>
          ) : isEditing ? (
            /* Inline Edit Form */
            <div className="flex flex-col gap-2 min-w-[220px]">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 bg-slate-900/90 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400 resize-none min-h-[60px]"
                autoFocus
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSavingEdit}
                  className="px-2 py-1 text-[11px] rounded-lg text-slate-300 hover:bg-slate-700/60 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit || !editText.trim()}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> {t.saveChanges}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Text Content */}
              {msg.content && msg.content !== t.photoAttachment && msg.content !== t.fileAttachment && (
                <div className="whitespace-pre-wrap break-words">
                  {renderTextWithLinks(msg.content)}
                  {msg.isEdited && (
                    <span className="ml-1.5 text-[10px] opacity-70 italic font-normal">
                      {t.editedLabel}
                    </span>
                  )}
                </div>
              )}

              {/* Image Attachment */}
              {hasAttachment && isImage && (
                <div className="mt-1 overflow-hidden rounded-xl border border-white/20 dark:border-slate-700 max-w-sm">
                  <img
                    src={msg.fileUrl!}
                    alt={msg.fileName || t.image}
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
                      {msg.fileName || t.documentAttachment}
                    </span>
                    <span className="text-[10px] opacity-75">{t.clickToDownload}</span>
                  </div>
                  <Download className="w-3.5 h-3.5 shrink-0 opacity-75" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons for Received Messages (Admin override delete) */}
        {!isMe && canDelete && !isEditing && (
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.delete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-slate-400 mt-1 px-1">
        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  )
}
