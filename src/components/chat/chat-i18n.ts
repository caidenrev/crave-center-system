"use client"

import { usePathname } from "next/navigation"

export type Locale = "id" | "en"

export const chatTranslations = {
  id: {
    // Header & Tabs
    liveChatSupport: "Live Support Chat",
    projectDiscussion: "Diskusi Proyek",
    directChat: "Chat Langsung",
    channelDiscussion: "Channel Diskusi Real-time",
    adminClient: "Admin & Klien",
    workerClient: "Tim Worker & Klien",
    internalTeam: "Internal Tim & Admin",

    // Contact List
    selectContact: "Pilih Kontak Support / Worker",
    contacts: "Kontak",
    noContacts: "Tidak ada kontak tersedia untuk role Anda.",
    adminRoleBadge: "Admin Platform",

    // Project List
    activeProjects: "Daftar Proyek Aktif",
    projects: "Proyek",
    noProjects: "Tidak ada proyek aktif yang ditemukan.",

    // Direct & Thread Chat
    back: "Kembali",
    writeMessage: "Tulis pesan...",
    typeMessage: "Ketik pesan...",
    addMessageOptional: "Tambah pesan (opsional)...",
    noDirectHistory: "Belum ada riwayat pesan langsung dengan",
    startDirectPrompt: "Tulis pesan pertama Anda di bawah ini.",
    noProjectHistory: "Belum Ada Pesan",
    startProjectPrompt: "Mulai percakapan untuk mendiskusikan proyek ini.",

    // Roles
    you: "Anda",
    admin: "Admin",
    team: "Tim",
    client: "Klien",

    // Attachments
    attachFileTooltip: "Lampirkan File / Gambar",
    maxSizeError: "Ukuran file maksimal 10MB",
    uploadError: "Gagal mengunggah file lampiran",
    genericUploadError: "Error mengunggah file",
    clickToDownload: "Klik untuk unduh",
    documentAttachment: "Lampiran Dokumen",
    image: "Gambar",
    file: "File",
    photoAttachment: "[Gambar]",
    fileAttachment: "[Lampiran File]",

    // Message Actions (Edit & Delete)
    edit: "Edit",
    delete: "Delete",
    editedLabel: "(diedit)",
    messageDeleted: "Pesan ini telah dihapus",
    deleteMessageTitle: "Hapus Pesan?",
    deleteMessageConfirm: "Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.",
    cancel: "Batal",
    deleteButton: "Hapus Pesan",
    editMessageTitle: "Edit Pesan",
    saveChanges: "Simpan Perubahan",

    // Lightbox / Image Modal
    imagePreview: "Pratinjau Gambar",
    openOriginal: "Buka Asli",
    download: "Unduh",
    close: "Tutup",

    // Toasts & Errors
    networkError: "Error jaringan",
    sendError: "Gagal mengirim pesan",
    deleteSuccess: "Pesan berhasil dihapus",
    deleteError: "Gagal menghapus pesan",
    editSuccess: "Pesan berhasil diperbarui",
    editError: "Gagal mengedit pesan",
  },
  en: {
    // Header & Tabs
    liveChatSupport: "Live Support Chat",
    projectDiscussion: "Project Discussion",
    directChat: "Direct Chat",
    channelDiscussion: "Real-time Discussion Channel",
    adminClient: "Admin & Client",
    workerClient: "Worker Team & Client",
    internalTeam: "Internal Team & Admin",

    // Contact List
    selectContact: "Select Support / Worker Contact",
    contacts: "Contacts",
    noContacts: "No contacts available for your role.",
    adminRoleBadge: "Platform Admin",

    // Project List
    activeProjects: "Active Projects List",
    projects: "Projects",
    noProjects: "No active projects found.",

    // Direct & Thread Chat
    back: "Back",
    writeMessage: "Type a message...",
    typeMessage: "Type a message...",
    addMessageOptional: "Add a message (optional)...",
    noDirectHistory: "No direct message history with",
    startDirectPrompt: "Write your first message below.",
    noProjectHistory: "No Messages Yet",
    startProjectPrompt: "Start a conversation to discuss this project.",

    // Roles
    you: "You",
    admin: "Admin",
    team: "Team",
    client: "Client",

    // Attachments
    attachFileTooltip: "Attach File / Image",
    maxSizeError: "Maximum file size is 10MB",
    uploadError: "Failed to upload file attachment",
    genericUploadError: "Error uploading file",
    clickToDownload: "Click to download",
    documentAttachment: "Document Attachment",
    image: "Image",
    file: "File",
    photoAttachment: "[Image]",
    fileAttachment: "[File Attachment]",

    // Message Actions (Edit & Delete)
    edit: "Edit",
    delete: "Delete",
    editedLabel: "(edited)",
    messageDeleted: "This message has been deleted",
    deleteMessageTitle: "Delete Message?",
    deleteMessageConfirm: "Are you sure you want to delete this message? This action cannot be undone.",
    cancel: "Cancel",
    deleteButton: "Delete Message",
    editMessageTitle: "Edit Message",
    saveChanges: "Save Changes",

    // Lightbox / Image Modal
    imagePreview: "Image Preview",
    openOriginal: "Open Original",
    download: "Download",
    close: "Close",

    // Toasts & Errors
    networkError: "Network error",
    sendError: "Failed to send message",
    deleteSuccess: "Message deleted successfully",
    deleteError: "Failed to delete message",
    editSuccess: "Message updated successfully",
    editError: "Failed to edit message",
  },
}

export function useChatTranslations() {
  const pathname = usePathname() || "/"
  const isIndonesian = pathname.startsWith("/id")
  const locale: Locale = isIndonesian ? "id" : "en"
  const t = chatTranslations[locale]

  return { t, locale, isIndonesian }
}
