"use server"

import { prisma } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitWorkerOffer(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const projectId = formData.get("projectId") as string
    const offeredPrice = formData.get("offeredPrice") as string
    const offeredDuration = formData.get("offeredDuration") as string

    if (!projectId || !offeredPrice || !offeredDuration) {
      throw new Error("Missing required fields")
    }

    // Pastikan project itu memang di assign ke worker ini
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { worker: true }
    })

    if (!project) throw new Error("Project not found")
    if (project.worker?.email !== user.email) {
      throw new Error("You are not authorized to respond to this project")
    }

    // Update project
    await prisma.project.update({
      where: { id: projectId },
      data: {
        offeredPrice: parseFloat(offeredPrice),
        offeredDuration: parseInt(offeredDuration, 10),
        status: "WORKER_REVIEW" // Ubah status agar Klien tahu Worker sudah merespons
      }
    })

    // Create Notification for Client
    const { createNotification } = await import("@/app/actions/notification")
    await createNotification({
      userId: project.clientId,
      title: "Worker Offer Submitted",
      message: `${project.worker?.name} has submitted an offer for your project: ${project.title}.`,
      type: "INFO",
      link: "/id/client"
    })

    revalidatePath("/(worker)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createWorkerTask(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const projectId = formData.get("projectId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const estimatedTime = formData.get("estimatedTime") as string
    const deadline = formData.get("deadline") as string

    if (!projectId || !title) {
      throw new Error("Missing required fields")
    }

    // Verify worker owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { worker: true }
    })

    if (!project) throw new Error("Project not found")
    if (project.worker?.email !== user.email) {
      throw new Error("Not authorized to add tasks to this project")
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        assigneeId: project.workerId,
        title,
        description: description || null,
        estimatedTime: estimatedTime ? parseInt(estimatedTime, 10) : null,
        deadline: deadline ? new Date(deadline) : null,
        status: "TO_DO",
      }
    })

    // Create Notification for Worker
    const { createNotification } = await import("@/app/actions/notification")
    await createNotification({
      userId: project.workerId!,
      title: "New Task Created",
      message: `You created a new task: ${title} for project: ${project.title}.`,
      type: "SUCCESS",
      link: "/id/worker/tasks"
    })

    revalidatePath("/(worker)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateWorkerProfile(data: {
  name: string
  phone?: string
  category?: string
  skills?: string[]
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
      throw new Error("User not found")
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        name: data.name,
        phone: data.phone || null,
        category: data.category || null,
        skills: data.skills || [],
      }
    })

    revalidatePath("/(worker)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

