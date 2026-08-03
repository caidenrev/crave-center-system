'use server'

import { prisma } from '@/lib/db'
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Unauthorized", data: [] }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return { success: false, error: "User not found", data: [] }

    const notifications = await prisma.notification.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return { success: true, data: notifications }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Unauthorized" }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return { success: false, error: "User not found" }

    await prisma.notification.updateMany({
      where: { id: notificationId, userId: dbUser.id },
      data: { isRead: true }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function markAllAsRead() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Unauthorized" }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return { success: false, error: "User not found" }

    await prisma.notification.updateMany({
      where: { userId: dbUser.id, isRead: false },
      data: { isRead: true }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

import { NotificationType } from '@/generated/prisma'

export async function createNotification({
  userId,
  title,
  message,
  type = "INFO",
  link = null
}: {
  userId: string
  title: string
  message: string
  type?: string
  link?: string | null
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type as NotificationType,
        link,
        isRead: false
      }
    })
    return { success: true }
  } catch (error: any) {
    console.error("Failed to create notification:", error)
    return { success: false, error: error.message }
  }
}

