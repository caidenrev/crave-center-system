"use server"

import { prisma } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock')

export async function createJobRequest(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      throw new Error("User not found in database")
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const workerId = formData.get("workerId") as string
    const briefFileUrl = formData.get("briefFileUrl") as string | null
    const budgetRange = formData.get("budgetRange") as string | null
    const targetDeliveryDateRaw = formData.get("targetDeliveryDate") as string

    if (!title || !description || !workerId || !category) {
      throw new Error("Missing required fields")
    }

    let targetDeliveryDate: Date | null = null
    if (targetDeliveryDateRaw) {
      targetDeliveryDate = new Date(targetDeliveryDateRaw)
    }

    const worker = await prisma.user.findUnique({
      where: { id: workerId }
    })
    
    if (!worker) {
      throw new Error("Selected worker not found")
    }

    const project = await prisma.project.create({
      data: {
        clientId: dbUser.id,
        workerId,
        title,
        description,
        category,
        budgetRange,
        briefFileUrl,
        targetDeliveryDate,
        status: "REQUESTED",
      }
    })

    const { createNotification } = await import("@/app/actions/notification")
    
    // Notify Admin team about new incoming request
    const adminUsers = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } })
    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        title: "New Job Request",
        message: `${dbUser.name} submitted a new project request: ${title}`,
        type: "INFO",
        link: "/id/admin/requests"
      })
    }

    revalidatePath("/(admin)")
    revalidatePath("/(worker)")
    revalidatePath("/(client)")
    return { success: true, project }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Admin assigns a worker to a job request (persists to DB).
 * Changes status from REQUESTED -> WORKER_REVIEW if worker is newly assigned.
 */
export async function assignWorkerToRequest(projectId: string, workerId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Verify admin role
    const adminUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Admin access required")

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    })
    if (!project) throw new Error("Project not found")

    const worker = await prisma.user.findUnique({ where: { id: workerId } })
    if (!worker) throw new Error("Worker not found")

    await prisma.project.update({
      where: { id: projectId },
      data: {
        workerId,
        status: "WORKER_REVIEW",
      }
    })

    // Notify worker
    const { createNotification } = await import("@/app/actions/notification")
    await createNotification({
      userId: workerId,
      title: "New Project Assignment",
      message: `Admin has assigned you to project: ${project.title}`,
      type: "INFO",
      link: "/id/worker/projects"
    })

    // Notify client
    await createNotification({
      userId: project.clientId,
      title: "Worker Assigned",
      message: `${worker.name} has been assigned to your project: ${project.title}. An offer will be prepared shortly.`,
      type: "INFO",
      link: "/id/client"
    })

    revalidatePath("/(admin)")
    revalidatePath("/(worker)")
    revalidatePath("/(client)")
    return { success: true, workerName: worker.name }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Admin rejects a job request (sets status to CANCELLED).
 */
export async function rejectJobRequest(projectId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const adminUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Admin access required")

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    })
    if (!project) throw new Error("Project not found")

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "CANCELLED" }
    })

    const { createNotification } = await import("@/app/actions/notification")
    await createNotification({
      userId: project.clientId,
      title: "Request Rejected",
      message: `Your project request "${project.title}" has been reviewed and declined.`,
      type: "WARNING",
      link: "/id/client"
    })

    revalidatePath("/(admin)")
    revalidatePath("/(client)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Admin creates and sends official Terms & Contract to Client.
 * Updates project.status = "PENDING_DP" and notifies client via in-app dashboard & email.
 */
export async function createAdminTermsAndContract(data: {
  projectId: string
  priceFinal: number
  scope: string
  milestones?: any
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const adminUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Admin access required")

    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: { client: true }
    })
    if (!project) throw new Error("Project not found")

    // Upsert Terms
    const terms = await prisma.terms.upsert({
      where: { projectId: data.projectId },
      create: {
        projectId: data.projectId,
        scope: data.scope,
        priceFinal: data.priceFinal,
        milestones: data.milestones || [],
        status: "APPROVED",
        approvedByClient: false,
      },
      update: {
        scope: data.scope,
        priceFinal: data.priceFinal,
        milestones: data.milestones || [],
      }
    })

    // Create Contract
    const pdfUrl = `/api/pdf/terms/${data.projectId}`
    const contract = await prisma.contract.create({
      data: {
        projectId: data.projectId,
        termsId: terms.id,
        contractDocumentUrl: pdfUrl,
      }
    })

    // Create DP Payment Record (50% of priceFinal)
    const dpAmount = data.priceFinal * 0.5
    const existingPayment = await prisma.payment.findFirst({
      where: { projectId: data.projectId, type: "DP" }
    })

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          projectId: data.projectId,
          amount: dpAmount,
          type: "DP",
          status: "PENDING",
        }
      })
    } else {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: { amount: dpAmount }
      })
    }

    // Update project status to PENDING_DP
    await prisma.project.update({
      where: { id: data.projectId },
      data: { status: "PENDING_DP" }
    })

    // Notify Client in Dashboard
    const { createNotification } = await import("@/app/actions/notification")
    await createNotification({
      userId: project.clientId,
      title: "Contract & Terms Issued",
      message: `Admin has generated the official Terms & Contract for project "${project.title}". Please review and sign digitally in your Contracts menu.`,
      type: "INFO",
      link: "/id/client/contracts"
    })

    // Non-blocking Email to Client
    if (process.env.RESEND_API_KEY && project.client?.email) {
      resend.emails.send({
        from: 'Crave ITSM <onboarding@resend.dev>',
        to: project.client.email,
        subject: `Official Contract Ready: ${project.title}`,
        html: `
          <h2>Hello ${project.client.name},</h2>
          <p>Your project <strong>${project.title}</strong> official Terms & Contract document has been created by Crave Admin.</p>
          <p><strong>Agreed Price:</strong> Rp ${data.priceFinal.toLocaleString('id-ID')}</p>
          <br/>
          <p><a href="${pdfUrl}" target="_blank">Download Contract PDF</a></p>
          <p>Please log in to your Crave Client Dashboard to approve and sign the contract digitally.</p>
        `
      }).catch((emailErr) => console.error("Email send error:", emailErr))
    }

    revalidatePath("/(admin)")
    revalidatePath("/(client)")
    revalidatePath("/(worker)")
    return { success: true, contractId: contract.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function acceptTermsByClient(projectId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const clientUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!clientUser) throw new Error("User not found")

    const terms = await prisma.terms.findUnique({ where: { projectId } })
    if (!terms) throw new Error("Terms document not found")

    await prisma.terms.update({
      where: { projectId },
      data: {
        approvedByClient: true,
        status: "APPROVED",
      }
    })

    await prisma.contract.updateMany({
      where: { projectId },
      data: { signedAt: new Date() }
    })

    revalidatePath("/(client)")
    revalidatePath("/(admin)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function payDPByClient(paymentId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { project: true }
    })
    if (!payment) throw new Error("Payment record not found")

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "SUCCESS",
        paidAt: new Date(),
        paymentMethod: "Manual Bank Transfer / QRIS",
      }
    })

    // Move project to IN_PROGRESS
    await prisma.project.update({
      where: { id: payment.projectId },
      data: { status: "IN_PROGRESS" }
    })

    const { createNotification } = await import("@/app/actions/notification")
    if (payment.project.workerId) {
      await createNotification({
        userId: payment.project.workerId,
        title: "DP Received & Project Started!",
        message: `Client has paid DP for "${payment.project.title}". You can start working now.`,
        type: "SUCCESS",
        link: "/id/worker/projects"
      })
    }

    revalidatePath("/(client)")
    revalidatePath("/(admin)")
    revalidatePath("/(worker)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}


