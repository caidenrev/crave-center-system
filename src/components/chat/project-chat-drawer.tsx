"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Lock, Globe, Loader2, Trash2 } from "lucide-react"
import { getProjectMessages, sendProjectMessage, deleteProjectMessage } from "@/app/actions/chat"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { MessageVisibility } from "@/generated/prisma"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { ChatMessageItem, ChatMessage } from "./chat-message-item"
import { ChatInputBar } from "./chat-input-bar"
import { ChatImageModal } from "./chat-image-modal"

interface ProjectChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
  currentUserId: string
  userRole: "CLIENT" | "ADMIN" | "TEAM_MEMBER"
  isCancelled?: boolean
}

type ChatTab = "CLIENT_ADMIN" | "CLIENT_WORKER" | "INTERNAL"

export function ProjectChatDrawer({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  currentUserId,
  userRole,
  isCancelled = false,
}: ProjectChatDrawerProps) {
  const getDefaultTab = (): ChatTab => {
    if (userRole === "CLIENT") return "CLIENT_ADMIN"
    if (userRole === "TEAM_MEMBER") return "CLIENT_WORKER"
    return "CLIENT_ADMIN"
  }

  const [activeTab, setActiveTab] = useState<ChatTab>(getDefaultTab)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<{ url: string; name?: string } | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeletingMessage, setIsDeletingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Reset tab when userRole or isOpen changes during render
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [prevUserRole, setPrevUserRole] = useState(userRole)

  if (isOpen !== prevIsOpen || userRole !== prevUserRole) {
    setPrevIsOpen(isOpen)
    setPrevUserRole(userRole)
    if (isOpen) {
      setActiveTab(getDefaultTab())
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Load messages on drawer open or tab switch
  useEffect(() => {
    if (!isOpen || !projectId) return

    async function loadMessages() {
      setIsLoading(true)
      const res = await getProjectMessages(projectId)
      if (res.success) {
        setMessages(res.messages as ChatMessage[])
      }
      setIsLoading(false)
      setTimeout(scrollToBottom, 100)
    }

    loadMessages()

    // Supabase Real-time Listener for instant chat updates (INSERT & UPDATE)
    const supabase = createClient()
    const channel = supabase
      .channel(`project-chat-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
          filter: `projectId=eq.${projectId}`,
        },
        async () => {
          const updatedRes = await getProjectMessages(projectId)
          if (updatedRes.success) {
            setMessages(updatedRes.messages as ChatMessage[])
            setTimeout(scrollToBottom, 100)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isOpen, projectId, activeTab])

  const handleSendMessage = async (
    content: string,
    fileUrl?: string,
    fileName?: string,
    fileType?: string
  ) => {
    if (isSending) return
    setIsSending(true)

    try {
      const res = await sendProjectMessage({
        projectId,
        content,
        visibility: activeTab as MessageVisibility,
        fileUrl,
        fileName,
        fileType,
      })

      if (res.success && res.message) {
        setMessages((prev) => [...prev, res.message as ChatMessage])
        setTimeout(scrollToBottom, 100)
      } else {
        toast.error(res.error || "Gagal mengirim pesan")
      }
    } catch {
      toast.error("Error jaringan")
    } finally {
      setIsSending(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetId || isDeletingMessage) return
    setIsDeletingMessage(true)
    try {
      const res = await deleteProjectMessage(deleteTargetId)
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === deleteTargetId
              ? {
                  ...m,
                  isDeleted: true,
                  content: "Pesan ini telah dihapus",
                  fileUrl: null,
                  fileName: null,
                  fileType: null,
                }
              : m
          )
        )
        toast.success("Pesan berhasil dihapus")
      } else {
        toast.error(res.error || "Gagal menghapus pesan")
      }
    } catch {
      toast.error("Gagal menghapus pesan")
    } finally {
      setIsDeletingMessage(false)
      setDeleteTargetId(null)
    }
  }

  const filteredMessages = messages.filter((m) => {
    if (m.visibility === activeTab) return true
    // Fallback for legacy CLIENT visibility messages
    if (m.visibility === "CLIENT" && (activeTab === "CLIENT_ADMIN" || activeTab === "CLIENT_WORKER"))
      return true
    return false
  })

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50"
            />

            {/* Drawer Slide-Over */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-56">
                      {projectTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Channel Diskusi Real-time
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs based on userRole */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50 p-1 gap-1">
                {userRole === "CLIENT" && (
                  <>
                    <button
                      onClick={() => setActiveTab("CLIENT_ADMIN")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "CLIENT_ADMIN"
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> Chat Admin
                    </button>
                    <button
                      onClick={() => setActiveTab("CLIENT_WORKER")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "CLIENT_WORKER"
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> Chat Worker
                    </button>
                  </>
                )}

                {userRole === "ADMIN" && (
                  <>
                    <button
                      onClick={() => setActiveTab("CLIENT_ADMIN")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "CLIENT_ADMIN"
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> Diskusi Client
                    </button>
                    <button
                      onClick={() => setActiveTab("INTERNAL")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "INTERNAL"
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" /> Chat Internal Tim
                    </button>
                  </>
                )}

                {userRole === "TEAM_MEMBER" && (
                  <>
                    <button
                      onClick={() => setActiveTab("CLIENT_WORKER")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "CLIENT_WORKER"
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> Diskusi Client
                    </button>
                    <button
                      onClick={() => setActiveTab("INTERNAL")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "INTERNAL"
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" /> Chat Internal Tim
                    </button>
                  </>
                )}
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/30">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                    <MessageSquare className="w-10 h-10 stroke-1 mb-2 opacity-50" />
                    <p className="text-xs font-medium">Belum ada pesan di channel ini.</p>
                    <p className="text-[11px] opacity-75 mt-0.5">
                      Mulaikan diskusi terkait proyek ini di bawah.
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <ChatMessageItem
                      key={msg.id}
                      msg={msg}
                      currentUserId={currentUserId}
                      userRole={userRole}
                      onDeleteMessage={(id) => setDeleteTargetId(id)}
                      onPreviewImage={(url, name) => setPreviewImageUrl({ url, name })}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar Component or Disabled Notice */}
              {isCancelled ? (
                <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Diskusi proyek ini telah ditutup karena status proyek dibatalkan / ditolak.
                  </p>
                </div>
              ) : (
                <ChatInputBar onSendMessage={handleSendMessage} isSending={isSending} />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <ChatImageModal
        imageUrl={previewImageUrl?.url || null}
        fileName={previewImageUrl?.name}
        onClose={() => setPreviewImageUrl(null)}
      />

      {/* Delete Message Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Pesan"
        description="Apakah Anda yakin ingin menghapus pesan ini? Pesan yang telah dihapus tidak dapat dikembalikan."
        confirmText="Hapus"
        cancelText="Batal"
        variant="destructive"
        icon={<Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />}
      />
    </>
  )
}
