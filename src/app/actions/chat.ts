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

export async function editChatMessage(messageId: string, newContent: string) {
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
      throw new Error("User not found")
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId }
    })

    if (!existingMessage) {
      throw new Error("Pesan tidak ditemukan")
    }

    if (existingMessage.senderId !== dbUser.id) {
      throw new Error("Anda hanya dapat mengedit pesan milik Anda sendiri")
    }

    if (existingMessage.isDeleted) {
      throw new Error("Pesan yang telah dihapus tidak dapat diedit")
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: newContent.trim(),
        isEdited: true,
      }
    })

    revalidatePath("/(worker)")
    revalidatePath("/(client)")
    revalidatePath("/(admin)")

    return { success: true, message: updated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function markDirectMessagesAsRead(senderId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return { success: false }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) return { success: false }

    await prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: dbUser.id,
        isRead: false,
      },
      data: {
        isRead: true,
      }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function sendDirectMessageToWorker({
  workerId,
  message,
  fileUrl,
  fileName,
  fileType,
}: {
  workerId: string
  message: string
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

    const senderUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!senderUser) {
      throw new Error("Pengirim tidak ditemukan")
    }

    const receiverUser = await prisma.user.findUnique({
      where: { id: workerId }
    })

    if (!receiverUser) {
      throw new Error("Penerima tidak ditemukan")
    }

    // 1. Create persistent Direct Message record in Message table
    const newMsg = await prisma.message.create({
      data: {
        senderId: senderUser.id,
        receiverId: receiverUser.id,
        content: message.trim(),
        projectId: undefined,
        fileUrl,
        fileName,
        fileType,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true, image: true } }
      }
    })

    // 2. Create real Notification for the receiver
    const { createNotification } = await import("@/app/actions/notification")
    await createNotification({
      userId: receiverUser.id,
      title: `Pesan Langsung dari ${senderUser.name}`,
      message: message || (fileType === 'IMAGE' ? '[Gambar]' : '[Lampiran File]'),
      type: "INFO",
      link: receiverUser.role === 'TEAM_MEMBER' ? '/id/worker' : (receiverUser.role === 'CLIENT' ? '/id/client' : '/id/admin')
    })

    revalidatePath("/(worker)")
    revalidatePath("/(admin)")
    revalidatePath("/(client)")

    return {
      success: true,
      message: {
        id: newMsg.id,
        content: newMsg.content,
        senderId: newMsg.senderId,
        receiverId: newMsg.receiverId,
        fileUrl: newMsg.fileUrl,
        fileName: newMsg.fileName,
        fileType: newMsg.fileType,
        isDeleted: newMsg.isDeleted,
        isEdited: newMsg.isEdited,
        isRead: newMsg.isRead,
        createdAt: newMsg.createdAt.toISOString(),
        sender: newMsg.sender
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getDirectMessages(otherUserId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return { success: false, messages: [] }
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      return { success: false, messages: [] }
    }

    // Mark messages from otherUserId to dbUser as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: dbUser.id,
        isRead: false,
      },
      data: {
        isRead: true,
      }
    })

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: dbUser.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: dbUser.id },
        ]
      },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true, image: true } }
      },
      orderBy: { createdAt: 'asc' }
    })

    return {
      success: true,
      currentUserId: dbUser.id,
      messages: messages.map(m => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        receiverId: m.receiverId,
        fileUrl: m.fileUrl,
        fileName: m.fileName,
        fileType: m.fileType,
        isDeleted: m.isDeleted,
        isEdited: m.isEdited,
        isRead: m.isRead,
        createdAt: m.createdAt.toISOString(),
        sender: m.sender
      }))
    }
  } catch (error: any) {
    return { success: false, messages: [] }
  }
}

export async function getFloatingChatContacts() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return { success: false, contacts: [], currentUserId: null, userRole: null }
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      return { success: false, contacts: [], currentUserId: null, userRole: null }
    }

    // Auto-sync avatar from Supabase Auth user metadata if dbUser.image is missing
    const authAvatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
    if (authAvatarUrl && dbUser.image !== authAvatarUrl) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { image: authAvatarUrl }
      })
      dbUser.image = authAvatarUrl
    }

    let contacts: any[] = []

    if (dbUser.role === 'ADMIN') {
      // Admin sees all workers and all clients
      contacts = await prisma.user.findMany({
        where: { id: { not: dbUser.id } },
        select: { id: true, name: true, email: true, role: true, category: true, image: true },
        orderBy: { name: 'asc' },
        take: 25,
      })
    } else if (dbUser.role === 'TEAM_MEMBER') {
      // Worker sees Admin + clients/co-workers on assigned projects
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true, email: true, role: true, category: true, image: true },
      })

      const myProjects = await prisma.project.findMany({
        where: { workerId: dbUser.id },
        select: { client: { select: { id: true, name: true, email: true, role: true, image: true } } }
      })

      const clientContacts = myProjects.map(p => p.client).filter((c): c is NonNullable<typeof c> => c !== null)
      const combined = [...adminUsers, ...clientContacts]
      const uniqueMap = new Map()
      combined.forEach(c => uniqueMap.set(c.id, c))
      contacts = Array.from(uniqueMap.values())
    } else if (dbUser.role === 'CLIENT') {
      // Client sees Admin + workers assigned to client's projects
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true, email: true, role: true, category: true, image: true },
      })

      const myProjects = await prisma.project.findMany({
        where: { clientId: dbUser.id, workerId: { not: null } },
        select: { worker: { select: { id: true, name: true, email: true, role: true, category: true, image: true } } }
      })

      const workerContacts = myProjects.map(p => p.worker).filter((w): w is NonNullable<typeof w> => w !== null)
      const combined = [...adminUsers, ...workerContacts]
      const uniqueMap = new Map()
      combined.forEach(c => uniqueMap.set(c.id, c))
      contacts = Array.from(uniqueMap.values())
    }

    // Enhance contacts with last message, unread count, and sorting
    const contactIds = contacts.map(c => c.id)

    // Batch query last messages for all contacts
    const allDirectMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: dbUser.id, receiverId: { in: contactIds } },
          { senderId: { in: contactIds }, receiverId: dbUser.id },
        ]
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        fileUrl: true,
        fileName: true,
        fileType: true,
        isDeleted: true,
        isEdited: true,
        isRead: true,
        createdAt: true,
      }
    })

    let totalUnreadCount = 0

    const contactsWithMetadata = contacts.map(c => {
      const contactMsgs = allDirectMessages.filter(
        m => m.senderId === c.id || m.receiverId === c.id
      )
      const lastMsg = contactMsgs[0] || null
      const unreadCount = contactMsgs.filter(
        m => m.senderId === c.id && m.receiverId === dbUser.id && !m.isRead
      ).length

      totalUnreadCount += unreadCount

      return {
        id: c.id,
        name: c.name || 'User',
        email: c.email,
        role: c.role === 'ADMIN' ? 'Admin Platform' : (c.category || c.role),
        image: c.image,
        lastMessage: lastMsg ? {
          content: lastMsg.isDeleted ? "Pesan ini telah dihapus" : lastMsg.content,
          fileUrl: lastMsg.fileUrl,
          fileName: lastMsg.fileName,
          fileType: lastMsg.fileType,
          isDeleted: lastMsg.isDeleted,
          isEdited: lastMsg.isEdited,
          createdAt: lastMsg.createdAt.toISOString(),
          senderId: lastMsg.senderId,
        } : null,
        unreadCount,
        lastMessageAt: lastMsg ? lastMsg.createdAt.getTime() : 0,
      }
    })

    // Sort contacts by lastMessageAt descending (newest messages on top)
    contactsWithMetadata.sort((a, b) => b.lastMessageAt - a.lastMessageAt)

    return {
      success: true,
      currentUserId: dbUser.id,
      userRole: dbUser.role,
      contacts: contactsWithMetadata,
      totalUnreadCount,
    }
  } catch (error: any) {
    return { success: false, contacts: [], totalUnreadCount: 0, currentUserId: null, userRole: null }
  }
}

export async function getUserActiveProjectsForChat() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return { success: false, projects: [], currentUserId: null, userRole: null }
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      return { success: false, projects: [], currentUserId: null, userRole: null }
    }

    let whereClause: any = {}
    if (dbUser.role === 'CLIENT') {
      whereClause = { clientId: dbUser.id }
    } else if (dbUser.role === 'TEAM_MEMBER') {
      whereClause = { workerId: dbUser.id }
    } else if (dbUser.role === 'ADMIN') {
      whereClause = {} // Admin sees all active projects
    }

    const projects = await prisma.project.findMany({
      where: {
        ...whereClause,
        status: { in: ["REQUESTED", "WORKER_REVIEW", "PENDING_DP", "IN_PROGRESS", "ON_HOLD", "IN_WARRANTY"] }
      },
      select: {
        id: true,
        title: true,
        status: true,
        client: { select: { name: true } },
        worker: { select: { name: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 15
    })

    return {
      success: true,
      currentUserId: dbUser.id,
      userRole: dbUser.role,
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        clientName: p.client?.name || 'Client',
        workerName: p.worker?.name || 'Belum ditugaskan'
      }))
    }
  } catch (error: any) {
    return { success: false, projects: [], currentUserId: null, userRole: null }
  }
}
