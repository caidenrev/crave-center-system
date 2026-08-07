"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  Globe,
  Lock,
  Trash2,
} from "lucide-react";
import {
  getProjectMessages,
  sendProjectMessage,
  deleteProjectMessage,
  editChatMessage,
} from "@/app/actions/chat";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { MessageVisibility } from "@/generated/prisma";
import {
  ChatMessageItem,
  ChatMessage,
} from "../project-chat/chat-message-item";
import { ChatInputBar } from "../project-chat/chat-input-bar";
import { ChatImageModal } from "../project-chat/chat-image-modal";
import { useChatTranslations } from "../chat-i18n";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export interface ProjectChatItem {
  id: string;
  title: string;
  status: string;
  clientName: string;
  workerName: string;
}

interface FloatingProjectChatProps {
  projects: ProjectChatItem[];
  isLoadingProjects: boolean;
  selectedProject: ProjectChatItem | null;
  onSelectProject: (project: ProjectChatItem | null) => void;
  currentUserId: string;
  userRole: "CLIENT" | "ADMIN" | "TEAM_MEMBER";
}

export function FloatingProjectChat({
  projects,
  isLoadingProjects,
  selectedProject,
  onSelectProject,
  currentUserId,
  userRole,
}: FloatingProjectChatProps) {
  const { t } = useChatTranslations();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [projectTab, setProjectTab] = useState<"CLIENT_ADMIN" | "INTERNAL">(
    "CLIENT_ADMIN",
  );
  const [isSending, setIsSending] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<{
    url: string;
    name?: string;
  } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load project messages when selected
  useEffect(() => {
    if (!selectedProject) return;

    async function loadChat() {
      setIsLoadingMessages(true);
      const res = await getProjectMessages(selectedProject!.id);
      if (res.success && res.messages) {
        setMessages(res.messages as ChatMessage[]);
      }
      setIsLoadingMessages(false);
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }

    loadChat();

    // Real-time Supabase listener
    const supabase = createClient();
    const channel = supabase
      .channel(`floating-proj-chat-${selectedProject.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
          filter: `projectId=eq.${selectedProject.id}`,
        },
        async () => {
          const updatedRes = await getProjectMessages(selectedProject.id);
          if (updatedRes.success && updatedRes.messages) {
            setMessages(updatedRes.messages as ChatMessage[]);
            setTimeout(
              () =>
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
              100,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedProject, projectTab]);

  const handleSendMessage = async (
    content: string,
    fileUrl?: string,
    fileName?: string,
    fileType?: string,
  ) => {
    if (!selectedProject || isSending) return;
    setIsSending(true);

    try {
      const res = await sendProjectMessage({
        projectId: selectedProject.id,
        content,
        visibility: projectTab as MessageVisibility,
        fileUrl,
        fileName,
        fileType,
      });

      if (res.success && res.message) {
        setMessages((prev) => [...prev, res.message as ChatMessage]);
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      } else {
        toast.error(res.error || t.sendError);
      }
    } catch {
      toast.error(t.sendError);
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const res = await editChatMessage(messageId, newContent);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, content: newContent, isEdited: true }
              : m,
          ),
        );
        toast.success(t.editSuccess);
      } else {
        toast.error(res.error || t.editError);
      }
    } catch {
      toast.error(t.editError);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await deleteProjectMessage(deleteTargetId);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === deleteTargetId
              ? {
                  ...m,
                  isDeleted: true,
                  content: t.messageDeleted,
                  fileUrl: null,
                  fileName: null,
                  fileType: null,
                }
              : m,
          ),
        );
        toast.success(t.deleteSuccess);
      } else {
        toast.error(res.error || t.deleteError);
      }
    } catch {
      toast.error(t.deleteError);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (m.visibility === projectTab) return true;
    if (m.visibility === "CLIENT" && projectTab === "CLIENT_ADMIN") return true;
    return false;
  });

  // Render Projects List
  if (!selectedProject) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950 min-h-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t.activeProjects}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">
            {projects.length} {t.projects}
          </span>
        </div>

        {isLoadingProjects ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
            {t.noProjects}
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-xs"
            >
              <div className="truncate pr-2">
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors truncate">
                  {proj.title}
                </h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Worker: {proj.workerName} • Client: {proj.clientName}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase shrink-0">
                {proj.status.replace(/_/g, " ")}
              </span>
            </div>
          ))
        )}
      </div>
    );
  }

  // Render Project Conversation Canvas
  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-950 overflow-hidden min-h-0">
      {/* Project Channel Header */}
      <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
        <button
          type="button"
          onClick={() => onSelectProject(null)}
          className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <div className="flex items-center gap-1.5 truncate max-w-48">
          <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
            {selectedProject.title}
          </span>
        </div>
      </div>

      {/* Channel Switcher Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-1 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setProjectTab("CLIENT_ADMIN")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            projectTab === "CLIENT_ADMIN"
              ? "bg-primary text-white shadow-md"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          }`}
        >
          <Globe className="w-3 h-3" /> {t.adminClient}
        </button>
        <button
          type="button"
          onClick={() => setProjectTab("INTERNAL")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            projectTab === "INTERNAL"
              ? "bg-primary text-white shadow-md"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          }`}
        >
          <Lock className="w-3 h-3" /> {t.internalTeam}
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-400 space-y-1">
            <MessageSquare className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-1" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t.noProjectHistory}</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              msg={msg}
              currentUserId={currentUserId}
              userRole={userRole}
              onDeleteMessage={(id) => setDeleteTargetId(id)}
              onEditMessage={handleEditMessage}
              onPreviewImage={(url, name) => setPreviewImageUrl({ url, name })}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reusable Chat Input Bar (Attachment & File support) */}
      <ChatInputBar onSendMessage={handleSendMessage} isSending={isSending} />

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
        title={t.deleteMessageTitle}
        description={t.deleteMessageConfirm}
        confirmText={t.deleteButton}
        cancelText={t.cancel}
        variant="destructive"
        icon={<Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />}
      />
    </div>
  );
}
