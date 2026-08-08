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
        status: "WORKER_REVIEW",
      }
    })

    const { createNotification } = await import("@/app/actions/notification")
    
    // Notify Admin team about new incoming request
    const adminUsers = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } })
    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        title: "New Job Request",
        message: `${dbUser.name} submitted a new project request assigned to a worker: ${title}`,
        type: "INFO",
        link: "/id/admin/projects"
      })
    }

    // Notify the requested Worker
    await createNotification({
      userId: worker.id,
      title: "Klien Memilih Anda!",
      message: `${dbUser.name} telah meminta Anda untuk mengerjakan proyek: ${title}. Silakan tinjau dan berikan penawaran.`,
      type: "INFO",
      link: "/id/worker/projects"
    })

    // Send email to the requested Worker
    if (process.env.RESEND_API_KEY && worker.email) {
      resend.emails.send({
        from: 'Crave ITSM <onboarding@resend.dev>',
        to: worker.email,
        subject: `Pekerjaan Baru Di-Request: ${title}`,
        html: `
          <h2>Halo ${worker.name},</h2>
          <p>Klien <strong>${dbUser.name}</strong> secara khusus memilih Anda untuk mengerjakan proyek baru mereka.</p>
          <h3>Detail Proyek:</h3>
          <ul>
            <li><strong>Judul:</strong> ${title}</li>
            <li><strong>Kategori:</strong> ${category}</li>
            <li><strong>Anggaran Klien:</strong> ${budgetRange || "Tidak disebutkan"}</li>
          </ul>
          <h3>Deskripsi / Permintaan Klien:</h3>
          <p>${description}</p>
          <br/>
          <p>Klien telah memilih Anda secara langsung. Silakan masuk ke Dashboard Pekerja Crave untuk meninjau detailnya secara lengkap dan menyusun penawaran (harga & estimasi waktu) untuk dikirim kembali ke klien.</p>
        `
      }).catch((err) => console.error("Email send error to worker (Request):", err))
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

    // Send email to worker
    if (process.env.RESEND_API_KEY && worker.email) {
      resend.emails.send({
        from: 'Crave ITSM <onboarding@resend.dev>',
        to: worker.email,
        subject: `Pekerjaan Baru Ditugaskan: ${project.title}`,
        html: `
          <h2>Halo ${worker.name},</h2>
          <p>Admin telah menugaskan Anda untuk mengerjakan proyek baru dari klien <strong>${project.client.name}</strong>.</p>
          <h3>Detail Proyek:</h3>
          <ul>
            <li><strong>Judul:</strong> ${project.title}</li>
            <li><strong>Kategori:</strong> ${project.category}</li>
            <li><strong>Anggaran Klien:</strong> ${project.budgetRange || "Tidak disebutkan"}</li>
          </ul>
          <h3>Deskripsi Permintaan Klien:</h3>
          <p>${project.description}</p>
          <br/>
          <p>Silakan masuk ke Dashboard Pekerja Crave untuk meninjau detailnya secara lengkap dan menyusun penawaran (harga & estimasi waktu) untuk dikirim kembali ke klien.</p>
        `
      }).catch(err => console.error("Failed to send email to worker:", err))
    }

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
  warrantyDays?: number
  warrantyTerms?: string
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

    let fullScope = data.scope.trim()
    if (data.warrantyDays && data.warrantyDays > 0 && !fullScope.toLowerCase().includes("garansi")) {
      fullScope += `\n\n--- KETENTUAN GARANSI RESMI CRAVE CENTER ---\n• Masa Garansi: ${data.warrantyDays} Hari Kalender (terhitung sejak serah terima proyek).\n• Cakupan Garansi: ${data.warrantyTerms || "Perbaikan bug/kendala teknis, penyesuaian minor, dan bantuan konsultasi sesuai lingkup pengerjaan."}`
    }

    // Upsert Terms
    const terms = await prisma.terms.upsert({
      where: { projectId: data.projectId },
      create: {
        projectId: data.projectId,
        scope: fullScope,
        priceFinal: data.priceFinal,
        milestones: data.milestones || [],
        status: "APPROVED",
        approvedByClient: false,
      },
      update: {
        scope: fullScope,
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

export async function createMidtransTransaction(paymentId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { project: { include: { client: true } } }
    })
    if (!payment) throw new Error("Payment record not found")
    if (payment.status === "SUCCESS") {
      throw new Error("Payment already completed")
    }

    const midtransClient = require('midtrans-client');
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    const parameter = {
      transaction_details: {
        order_id: payment.id,
        gross_amount: payment.amount
      },
      customer_details: {
        first_name: payment.project.client.name,
        email: payment.project.client.email,
      },
      item_details: [
        {
          id: payment.id,
          price: payment.amount,
          quantity: 1,
          name: `${payment.type} Payment: ${payment.project.title}`
        }
      ]
    };

    const transaction = await snap.createTransaction(parameter);
    
    return { success: true, token: transaction.token, redirect_url: transaction.redirect_url }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProjectPermanently(projectId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser || dbUser.role !== "ADMIN") {
      throw new Error("Hanya Admin yang memiliki akses untuk menghapus proyek secara permanen")
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      throw new Error("Proyek tidak ditemukan")
    }

    if (project.status !== "CANCELLED") {
      throw new Error("Hanya proyek dengan status Dibatalkan (CANCELLED) yang dapat dihapus secara permanen")
    }

    // Perform hard delete in transaction to safely remove all related records
    await prisma.$transaction([
      prisma.contract.deleteMany({ where: { projectId } }),
      prisma.terms.deleteMany({ where: { projectId } }),
      prisma.payment.deleteMany({ where: { projectId } }),
      prisma.task.deleteMany({ where: { projectId } }),
      prisma.deliverable.deleteMany({ where: { projectId } }),
      prisma.message.deleteMany({ where: { projectId } }),
      prisma.project.delete({ where: { id: projectId } }),
    ])

    revalidatePath("/(admin)", "layout")
    revalidatePath("/(worker)", "layout")
    revalidatePath("/(client)", "layout")

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Automatically delete projects with status CANCELLED that were cancelled/updated > 28 days ago.
 */
export async function autoDeleteCancelledProjects() {
  try {
    const cutoffDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)

    const expiredProjects = await prisma.project.findMany({
      where: {
        status: "CANCELLED",
        updatedAt: {
          lte: cutoffDate
        }
      },
      select: { id: true }
    })

    if (expiredProjects.length === 0) {
      return { success: true, count: 0 }
    }

    const expiredIds = expiredProjects.map(p => p.id)

    await prisma.$transaction([
      prisma.contract.deleteMany({ where: { projectId: { in: expiredIds } } }),
      prisma.terms.deleteMany({ where: { projectId: { in: expiredIds } } }),
      prisma.payment.deleteMany({ where: { projectId: { in: expiredIds } } }),
      prisma.task.deleteMany({ where: { projectId: { in: expiredIds } } }),
      prisma.deliverable.deleteMany({ where: { projectId: { in: expiredIds } } }),
      prisma.message.deleteMany({ where: { projectId: { in: expiredIds } } }),
      prisma.project.deleteMany({ where: { id: { in: expiredIds } } }),
    ])

    revalidatePath("/(admin)", "layout")
    revalidatePath("/(worker)", "layout")
    revalidatePath("/(client)", "layout")

    return { success: true, count: expiredIds.length }
  } catch (err: any) {
    console.error("Auto-delete cancelled projects error:", err)
    return { success: false, error: err.message, count: 0 }
  }
}



