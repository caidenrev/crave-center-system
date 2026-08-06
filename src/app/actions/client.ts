"use server"

import { prisma } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveProjectQuote(projectId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    })

    if (!project) throw new Error("Project not found")
    if (project.client.email !== user.email) {
      throw new Error("You are not authorized to approve this project")
    }

    if (project.status !== "WORKER_REVIEW") {
      throw new Error("Project is not in a reviewable state")
    }

    // Ubah status ke PENDING_DP dan generate terms/contract (disini disimulasikan)
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "PENDING_DP"
      }
    })

    // Create Notification for Worker
    const { createNotification } = await import("@/app/actions/notification")
    await createNotification({
      userId: project.workerId!,
      title: "Offer Approved!",
      message: `Client ${project.client.name} has approved your offer for ${project.title}.`,
      type: "SUCCESS",
      link: "/id/worker/projects"
    })

    revalidatePath("/client")
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateClientSettings(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const phone = formData.get("phone") as string

    if (!name) {
      throw new Error("Name is required")
    }

    await prisma.user.update({
      where: { email: user.email },
      data: {
        name,
        phone
      }
    })

    revalidatePath("/client/settings")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateUserAvatar(avatarUrl: string | null) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    await prisma.user.update({
      where: { email: user.email },
      data: {
        image: avatarUrl
      }
    })

    revalidatePath("/(admin)", "layout")
    revalidatePath("/(worker)", "layout")
    revalidatePath("/(client)", "layout")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function approveClientDeliverable(deliverableId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      include: { project: { include: { client: true, payments: true } } }
    })

    if (!deliverable) throw new Error("Deliverable not found")
    if (deliverable.project.client.email !== user.email) {
      throw new Error("Not authorized to approve this deliverable")
    }

    // Update deliverable status to APPROVED
    await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { status: "APPROVED" }
    })

    // Check project payment status
    const totalPayments = deliverable.project.payments.filter(p => p.status === "SUCCESS")
    const isFullPaymentPaid = totalPayments.some(p => p.type === "FULL_PAYMENT" || p.type === "PELUNASAN")

    if (isFullPaymentPaid) {
      // If 100% paid, transition to IN_WARRANTY
      await prisma.project.update({
        where: { id: deliverable.projectId },
        data: { status: "IN_WARRANTY" }
      })
    }

    // Notify Worker
    if (deliverable.project.workerId) {
      const { createNotification } = await import("@/app/actions/notification")
      await createNotification({
        userId: deliverable.project.workerId,
        title: "Deliverable Disetujui!",
        message: `Klien telah menyetujui deliverable proyek: ${deliverable.project.title}.`,
        type: "SUCCESS",
        link: "/id/worker/deliverables"
      })
    }

    revalidatePath("/(client)")
    revalidatePath("/(worker)")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function requestClientDeliverableRevision(deliverableId: string, feedback?: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      include: { project: { include: { client: true } } }
    })

    if (!deliverable) throw new Error("Deliverable not found")
    if (deliverable.project.client.email !== user.email) {
      throw new Error("Not authorized to request revision")
    }

    await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { status: "REVISED" }
    })

    if (deliverable.project.workerId) {
      const { createNotification } = await import("@/app/actions/notification")
      await createNotification({
        userId: deliverable.project.workerId,
        title: "Revisi Deliverable Diminta",
        message: `Klien meminta revisi deliverable proyek: ${deliverable.project.title}.${feedback ? ` Catatan: ${feedback}` : ''}`,
        type: "WARNING",
        link: "/id/worker/deliverables"
      })
    }

    revalidatePath("/(client)")
    revalidatePath("/(worker)")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}


