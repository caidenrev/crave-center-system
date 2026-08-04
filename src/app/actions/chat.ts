"use server"

import { prisma } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { MessageVisibility } from "@/generated/prisma"

export async function sendProjectMessage(data: {
  projectId: string
  content: string
  visibility: MessageVisibility
  fileUrl?: string
  fileName?: string
  fileType?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      throw new Error("User not found in database")
    }

    if (!data.content.trim() && !data.fileUrl) {
      throw new Error("Pesan atau lampiran tidak boleh kosong")
    }

    const contentText = data.content.trim() || (data.fileType === 'IMAGE' ? '[Gambar]' : '[Lampiran File]')

    const message = await prisma.message.create({
      data: {
        projectId: data.projectId,
        senderId: dbUser.id,
        content: contentText,
        visibility: data.visibility,
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        fileType: data.fileType || null,
      },
      include: {
        sender: true,
        project: {
          include: { client: true, worker: true }
        }
      }
    })

    // Real-time Chat Notifications
    const { createNotification } = await import("@/app/actions/notification")
    const project = message.project
    if (project) {
      const recipientIds: string[] = []

      if (data.visibility === MessageVisibility.CLIENT_ADMIN) {
        if (dbUser.role === 'CLIENT') {
          const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
          if (adminUser) recipientIds.push(adminUser.id)
        } else {
          if (project.clientId) recipientIds.push(project.clientId)
        }
      } else if (data.visibility === MessageVisibility.CLIENT_WORKER) {
        if (dbUser.role === 'CLIENT') {
          if (project.workerId) recipientIds.push(project.workerId)
        } else {
          if (project.clientId) recipientIds.push(project.clientId)
        }
      } else if (data.visibility === MessageVisibility.INTERNAL) {
        if (dbUser.role === 'TEAM_MEMBER') {
          const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
          if (adminUser) recipientIds.push(adminUser.id)
        } else {
          if (project.workerId) recipientIds.push(project.workerId)
        }
      } else {
        if (dbUser.role === 'CLIENT') {
          if (project.workerId) recipientIds.push(project.workerId)
        } else {
          if (project.clientId) recipientIds.push(project.clientId)
        }
      }

      for (const recipientId of recipientIds) {
        if (recipientId !== dbUser.id) {
          await createNotification({
            userId: recipientId,
            title: `Pesan baru dari ${dbUser.name}`,
            message: `"${contentText.substring(0, 60)}..." pada proyek ${project.title}`,
            type: "INFO",
            link: recipientId === project.clientId ? '/id/client/projects' : (recipientId === project.workerId ? '/id/worker/projects' : '/id/admin/projects')
          }).catch((err) => console.error("Notif error:", err))
        }
      }
    }

    revalidatePath("/(worker)")
    revalidatePath("/(client)")
    revalidatePath("/(admin)")

    return {
      success: true,
      message: {
        id: message.id,
        projectId: message.projectId,
        content: message.content,
        visibility: message.visibility,
        fileUrl: message.fileUrl,
        fileName: message.fileName,
        fileType: message.fileType,
        isDeleted: message.isDeleted,
        createdAt: message.createdAt.toISOString(),
        sender: {
          id: message.sender.id,
          name: message.sender.name,
          email: message.sender.email,
          role: message.sender.role,
        }
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProjectMessage(messageId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      throw new Error("User not found in database")
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId }
    })

    if (!existingMessage) {
      throw new Error("Pesan tidak ditemukan")
    }

    if (existingMessage.senderId !== dbUser.id && dbUser.role !== 'ADMIN') {
      throw new Error("Anda tidak memiliki izin untuk menghapus pesan ini")
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        content: "Pesan ini telah dihapus",
        fileUrl: null,
        fileName: null,
        fileType: null,
      }
    })

    revalidatePath("/(worker)")
    revalidatePath("/(client)")
    revalidatePath("/(admin)")

    return { success: true, messageId: updated.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getProjectMessages(projectId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      throw new Error("User not found in database")
    }

    let allowedVisibilities: MessageVisibility[] = []
    if (dbUser.role === 'CLIENT') {
      allowedVisibilities = [MessageVisibility.CLIENT_ADMIN, MessageVisibility.CLIENT_WORKER, MessageVisibility.CLIENT]
    } else if (dbUser.role === 'TEAM_MEMBER') {
      allowedVisibilities = [MessageVisibility.CLIENT_WORKER, MessageVisibility.INTERNAL]
    } else if (dbUser.role === 'ADMIN') {
      allowedVisibilities = [MessageVisibility.CLIENT_ADMIN, MessageVisibility.INTERNAL, MessageVisibility.CLIENT]
    }

    const messages = await prisma.message.findMany({
      where: {
        projectId,
        visibility: { in: allowedVisibilities },
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return {
      success: true,
      messages: messages.map(m => ({
        id: m.id,
        projectId: m.projectId,
        content: m.content,
        visibility: m.visibility,
        fileUrl: m.fileUrl,
        fileName: m.fileName,
        fileType: m.fileType,
        isDeleted: m.isDeleted,
        createdAt: m.createdAt.toISOString(),
        sender: m.sender,
      }))
    }
  } catch (error: any) {
    return { success: false, error: error.message, messages: [] }
  }
}
