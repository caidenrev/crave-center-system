"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Image as ImageIcon,
  FileText,
  Trash2,
} from "lucide-react";
import {
  sendDirectMessageToWorker,
  getDirectMessages,
  deleteProjectMessage,
  editChatMessage,
  markDirectMessagesAsRead,
} from "@/app/actions/chat";
import { getDefaultAvatar } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  ChatMessageItem,
  ChatMessage,
} from "../project-chat/chat-message-item";
import { ChatInputBar } from "../project-chat/chat-input-bar";
import { ChatImageModal } from "../project-chat/chat-image-modal";
import { useChatTranslations } from "../chat-i18n";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export interface ContactItem {
  id: string;
  name: string;
  email?: string;
  role: string;
  image?: string | null;
  lastMessage?: {
    content: string;
    fileUrl?: string | null;
    fileName?: string | null;
    fileType?: string | null;
    isDeleted?: boolean;
    isEdited?: boolean;
    createdAt: string;
    senderId?: string;
  } | null;
  unreadCount?: number;
}

interface FloatingDirectChatProps {
  contacts: ContactItem[];
  isLoadingContacts: boolean;
  selectedContact: ContactItem | null;
  onSelectContact: (contact: ContactItem | null) => void;
  currentUserId: string;
  onRefreshContacts?: () => void;
}

export function FloatingDirectChat({
  contacts,
  isLoadingContacts,
  selectedContact,
  onSelectContact,
  currentUserId,
  onRefreshContacts,
}: FloatingDirectChatProps) {
  const { t } = useChatTranslations();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<{
    url: string;
    name?: string;
  } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mark direct messages as read when selecting contact
  const handleSelectContact = async (contact: ContactItem | null) => {
    onSelectContact(contact);
    if (contact) {
      await markDirectMessagesAsRead(contact.id);
      if (onRefreshContacts) onRefreshContacts();
    }
  };

  // Fetch direct conversation thread when contact is selected
  useEffect(() => {
    if (!selectedContact) return;

    async function loadThread() {
      setIsLoadingMessages(true);
      const res = await getDirectMessages(selectedContact!.id);
      if (res.success && res.messages) {
        setMessages(res.messages as any[]);
      }
      setIsLoadingMessages(false);
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }

    loadThread();

    // Real-time listener for Direct Messages in Supabase
    const supabase = createClient();
    const channel = supabase
      .channel(`direct-chat-${selectedContact.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
        },
        async () => {
          const updatedRes = await getDirectMessages(selectedContact.id);
          if (updatedRes.success && updatedRes.messages) {
            setMessages(updatedRes.messages as any[]);
            setTimeout(
              () =>
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
              100,
            );
          }
          if (onRefreshContacts) onRefreshContacts();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedContact, onRefreshContacts]);

  const handleSendMessage = async (
    content: string,
    fileUrl?: string,
    fileName?: string,
    fileType?: string,
  ) => {
    if (!selectedContact || isSending) return;
    setIsSending(true);

    try {
      const res = await sendDirectMessageToWorker({
        workerId: selectedContact.id,
        message: content,
        fileUrl,
        fileName,
        fileType,
      });

      if (res.success && res.message) {
        setMessages((prev) => [...prev, res.message as any]);
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
        if (onRefreshContacts) onRefreshContacts();
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
        if (onRefreshContacts) onRefreshContacts();
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
        if (onRefreshContacts) onRefreshContacts();
      } else {
        toast.error(res.error || t.deleteError);
      }
    } catch {
      toast.error(t.deleteError);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const renderLastMessagePreview = (contact: ContactItem) => {
    if (!contact.lastMessage) return null;
    const { content, fileType, fileName, isDeleted } = contact.lastMessage;
    if (isDeleted) return <span className="italic">{t.messageDeleted}</span>;
    if (fileType === "IMAGE") {
      return (
        <span className="flex items-center gap-1">
          <ImageIcon className="w-3 h-3 text-indigo-400" />
          <span>
            {t.image} {content ? `• ${content}` : ""}
          </span>
        </span>
      );
    }
    if (fileType === "FILE") {
      return (
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3 text-indigo-400" />
          <span>
            {fileName || t.file} {content ? `• ${content}` : ""}
          </span>
        </span>
      );
    }
    return <span className="truncate">{content}</span>;
  };

  // Render Contacts List
  if (!selectedContact) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950 min-h-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t.selectContact}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">
            {contacts.length} {t.contacts}
          </span>
        </div>

        {isLoadingContacts ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
            {t.noContacts}
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-3 truncate min-w-0 flex-1">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={contact.image || getDefaultAvatar(contact.name)}
                      alt={contact.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Unread Counter Badge on Avatar */}
                  {Boolean(contact.unreadCount && contact.unreadCount > 0) && (
                    <span className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md animate-pulse">
                      {contact.unreadCount! > 99 ? "99+" : contact.unreadCount}
                    </span>
                  )}
                </div>

                <div className="truncate flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-white transition-colors truncate flex items-center gap-1.5">
                      {contact.name}
                      {contact.role === "Admin Platform" && (
                        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </h5>
                    {contact.lastMessage?.createdAt && (
                      <span
                        className={`text-[9px] font-medium shrink-0 ${Boolean(contact.unreadCount && contact.unreadCount > 0) ? "text-red-500 dark:text-red-400 font-bold" : "text-slate-400"}`}
                      >
                        {new Date(
                          contact.lastMessage.createdAt,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 gap-2">
                    <p
                      className={`truncate pr-1 ${Boolean(contact.unreadCount && contact.unreadCount > 0) ? "text-slate-900 dark:text-slate-200 font-semibold" : ""}`}
                    >
                      {renderLastMessagePreview(contact) || (
                        <span className="uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {contact.role}
                        </span>
                      )}
                    </p>
                    {Boolean(
                      contact.unreadCount && contact.unreadCount > 0,
                    ) && (
                      <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-lg border border-red-400/40 animate-pulse">
                        {contact.unreadCount! > 99
                          ? "99+"
                          : contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          ))
        )}
      </div>
    );
  }

  // Render Conversation Thread
  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-950 overflow-hidden min-h-0">
      {/* Contact Header Bar */}
      <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
        <button
          type="button"
          onClick={() => handleSelectContact(null)}
          className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <div className="flex items-center gap-2 truncate">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
            <img
              src={
                selectedContact.image || getDefaultAvatar(selectedContact.name)
              }
              alt={selectedContact.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-40">
            {selectedContact.name}
          </span>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 opacity-40 text-primary" />
            <p className="text-xs font-medium text-slate-300">
              {t.noDirectHistory}{" "}
              <strong className="text-white">{selectedContact.name}</strong>.
            </p>
            <p className="text-[10px] text-slate-500">{t.startDirectPrompt}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              msg={msg}
              currentUserId={currentUserId}
              onDeleteMessage={(id) => setDeleteTargetId(id)}
              onEditMessage={handleEditMessage}
              onPreviewImage={(url, name) => setPreviewImageUrl({ url, name })}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reusable Input Bar (Attachments, Files & Links) */}
      <ChatInputBar onSendMessage={handleSendMessage} isSending={isSending} />

      {/* Image Lightbox Modal */}
      <ChatImageModal
        imageUrl={previewImageUrl?.url || null}
        fileName={previewImageUrl?.name}
        onClose={() => setPreviewImageUrl(null)}
      />

      {/* Delete Confirmation Modal */}
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
