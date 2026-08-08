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
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock')

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

    // Fetch user to get their email and name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    })

    if (user && user.email && process.env.RESEND_API_KEY) {
      const actionLink = link 
        ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${link}` 
        : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`;
        
      resend.emails.send({
        from: 'Crave ITSM <onboarding@resend.dev>',
        to: user.email,
        subject: `Notifikasi Crave: ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="\${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/crave-banner.png" alt="Crave ITSM Banner" style="max-width: 100%; border-radius: 8px;" />
            </div>
            
            <h2 style="color: #111;">Halo \${user.name || 'Pengguna Crave'},</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">
              Anda memiliki pemberitahuan baru:
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #0f172a;">\${title}</h3>
              <p style="font-size: 16px; color: #475569; margin: 0; line-height: 1.5;">\${message}</p>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="\${actionLink}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
                Lihat Detail di Aplikasi
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            
            <p style="font-size: 14px; color: #64748b; text-align: center;">
              Terima kasih telah menggunakan Crave ITSM.<br/>
              <strong>Tim Crave ITSM</strong>
            </p>
          </div>
        `
      }).catch((emailErr) => console.error("Email send error in notification:", emailErr))
    }

    return { success: true }
  } catch (error: any) {
    console.error("Failed to create notification:", error)
    return { success: false, error: error.message }
  }
}

