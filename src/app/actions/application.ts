'use server'

import { prisma } from '@/lib/db'
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from 'next/cache'
import { ApplicationStatus, Role } from '@/generated/prisma'

export async function submitApplication(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return { success: false, error: "Authentication required" }
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser) {
      return { success: false, error: "User not found in database" }
    }

    if (dbUser.role === Role.TEAM_MEMBER || dbUser.role === Role.ADMIN) {
      return { success: false, error: "You are already a worker or admin" }
    }

    // Check if there is already a pending application
    const existing = await prisma.workerApplication.findFirst({
      where: { userId: dbUser.id, status: ApplicationStatus.PENDING }
    })

    if (existing) {
      return { success: false, error: "You already have a pending application." }
    }

    const category = formData.get("category") as string
    const skillsString = formData.get("skills") as string
    const githubUrl = formData.get("githubUrl") as string | null
    const portfolioUrl = formData.get("portfolioUrl") as string | null
    const linkedinUrl = formData.get("linkedinUrl") as string | null
    const instagramUrl = formData.get("instagramUrl") as string | null
    const tiktokUrl = formData.get("tiktokUrl") as string | null
    const reason = formData.get("reason") as string
    const whatsapp = formData.get("whatsapp") as string
    const email = formData.get("email") as string

    const skills = skillsString ? skillsString.split(",").map(s => s.trim()).filter(Boolean) : []

    await prisma.workerApplication.create({
      data: {
        userId: dbUser.id,
        category,
        skills,
        githubUrl,
        portfolioUrl,
        linkedinUrl,
        instagramUrl,
        tiktokUrl,
        reason,
        whatsapp,
        email,
        status: ApplicationStatus.PENDING
      }
    })

    // Find all admins and notify them
    const admins = await prisma.user.findMany({ where: { role: Role.ADMIN } })
    const { createNotification } = await import("@/app/actions/notification")
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        title: "New Worker Application",
        message: `${dbUser.name} has submitted an application for the ${category} category.`,
        type: "INFO",
        link: "/id/admin/applications"
      })
    }

    revalidatePath("/apply")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function reviewApplication(applicationId: string, action: 'APPROVE' | 'REJECT') {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return { success: false, error: "Authentication required" }
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser || dbUser.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized. Admin only." }
    }

    const application = await prisma.workerApplication.findUnique({ where: { id: applicationId } })
    if (!application) {
      return { success: false, error: "Application not found" }
    }

    if (action === 'APPROVE') {
      // Update application
      await prisma.workerApplication.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.APPROVED }
      })

      // Upgrade user role and copy skills
      await prisma.user.update({
        where: { id: application.userId },
        data: {
          role: Role.TEAM_MEMBER,
          category: application.category,
          skills: application.skills
        }
      })
      
      const { createNotification } = await import("@/app/actions/notification")
      await createNotification({
        userId: application.userId,
        title: "Application Approved!",
        message: "Congratulations! Your worker application has been approved. You are now a team member.",
        type: "SUCCESS",
        link: "/id/worker"
      })
    } else {
      await prisma.workerApplication.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.REJECTED }
      })

      const { createNotification } = await import("@/app/actions/notification")
      await createNotification({
        userId: application.userId,
        title: "Application Status Update",
        message: "Your worker application has been reviewed but unfortunately it was not approved at this time.",
        type: "ERROR",
        link: "/id/apply"
      })
    }

    revalidatePath("/admin/applications")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
