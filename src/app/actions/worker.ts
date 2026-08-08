"use server"

import { prisma } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock')

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

    // Send email to client
    const clientUser = await prisma.user.findUnique({ where: { id: project.clientId } })
    if (process.env.RESEND_API_KEY && clientUser?.email) {
      resend.emails.send({
        from: 'Crave ITSM <onboarding@resend.dev>',
        to: clientUser.email,
        subject: `Pekerja merespons proyek Anda: ${project.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/crave-banner.png" alt="Crave ITSM Banner" style="max-width: 100%; border-radius: 8px;" />
            </div>
            
            <h2 style="color: #111;">Halo ${clientUser.name},</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">
              Kabar baik! Pekerja <strong>${project.worker?.name}</strong> telah selesai meninjau permintaan proyek Anda yang berjudul <strong>"${project.title}"</strong> dan telah mengirimkan penawaran detail untuk pekerjaan tersebut.
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #0f172a;">Rincian Penawaran</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px;">
                  <span style="color: #64748b; font-size: 14px;">Estimasi Harga:</span>
                  <strong style="display: block; font-size: 18px; color: #0f172a;">Rp ${parseFloat(offeredPrice).toLocaleString('id-ID')}</strong>
                </li>
                <li>
                  <span style="color: #64748b; font-size: 14px;">Estimasi Durasi Pekerjaan:</span>
                  <strong style="display: block; font-size: 18px; color: #0f172a;">${offeredDuration} hari</strong>
                </li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5;">
              Langkah selanjutnya: Silakan masuk ke akun Anda di aplikasi Crave untuk meninjau dan <strong>menyetujui penawaran ini</strong>. Anda juga dapat menggunakan fitur chat (pesan) untuk berdiskusi lebih lanjut dengan kami jika ada penyesuaian yang diperlukan.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/id/client" style="background-color: #f59e0b; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.25);">
                Lihat & Tindak Lanjuti Penawaran
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            
            <p style="font-size: 14px; color: #64748b; text-align: center;">
              Terima kasih telah mempercayakan proyek Anda kepada kami.<br/>
              <strong>Tim Crave ITSM</strong>
            </p>
          </div>
        `
      }).catch((emailErr) => console.error("Email send error:", emailErr))
    }

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
  image?: string | null
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
        ...(data.skills ? { skills: data.skills } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
      }
    })

    revalidatePath("/(worker)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateWorkerTaskStatus(taskId: string, newStatus: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignee: true, project: { include: { worker: true } } }
    })

    if (!task) {
      throw new Error("Task not found")
    }

    // Verify task belongs to current worker
    const isAssignee = task.assignee?.email === user.email
    const isProjectWorker = task.project?.worker?.email === user.email

    if (!isAssignee && !isProjectWorker) {
      throw new Error("Not authorized to update this task")
    }

    const validStatuses = ["TO_DO", "IN_PROGRESS", "REVIEW", "DONE"]
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status")
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus as any,
        completedAt: newStatus === "DONE" ? new Date() : null,
      }
    })

    revalidatePath("/(worker)")
    revalidatePath("/[locale]/(worker)/worker", "layout")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function uploadWorkerDeliverable(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("Unauthorized")
    }

    const projectId = formData.get("projectId") as string
    let fileUrl = formData.get("fileUrl") as string
    let description = (formData.get("description") as string) || ""
    const uploadedFile = formData.get("file") as File | null
    const repoUrl = formData.get("repoUrl") as string | null

    // Direct File Upload to Supabase Storage
    if (uploadedFile && uploadedFile.size > 0 && typeof uploadedFile.name === "string") {
      const fileExt = uploadedFile.name.split(".").pop() || "png"
      const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`

      let usedBucket = "project_briefs"
      let storageRes = await supabase.storage
        .from("project_briefs")
        .upload(fileName, uploadedFile, { upsert: true, contentType: uploadedFile.type })

      if (storageRes.error) {
        usedBucket = "avatars"
        storageRes = await supabase.storage
          .from("avatars")
          .upload(fileName, uploadedFile, { upsert: true, contentType: uploadedFile.type })
      }

      if (!storageRes.error) {
        const publicUrlData = supabase.storage.from(usedBucket).getPublicUrl(fileName)
        fileUrl = publicUrlData.data.publicUrl
      } else {
        console.error("Storage upload error:", storageRes.error)
        throw new Error("Gagal mengunggah berkas ke storage: " + storageRes.error.message)
      }
    }

    // If repoUrl is provided alongside file upload, append it to description
    if (repoUrl && repoUrl.trim().length > 0) {
      if (fileUrl && fileUrl !== repoUrl) {
        description = description
          ? `${description}\n\nLink Repo / External: ${repoUrl}`
          : `Link Repo / External: ${repoUrl}`
      } else {
        fileUrl = repoUrl
      }
    }

    if (!projectId || !fileUrl) {
      throw new Error("Proyek dan Tautan/File Deliverable wajib diisi")
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) throw new Error("User not found")

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) throw new Error("Project not found")
    if (project.workerId !== dbUser.id) {
      throw new Error("Anda tidak berhak mengunggah deliverable untuk proyek ini")
    }

    // Check if a deliverable already exists for this project
    const existingDeliverable = await prisma.deliverable.findFirst({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    })

    let deliverable;
    if (existingDeliverable) {
      deliverable = await prisma.deliverable.update({
        where: { id: existingDeliverable.id },
        data: {
          fileUrl,
          description: description || null,
          status: "PENDING_REVIEW",
          updatedAt: new Date(),
        },
      })
    } else {
      deliverable = await prisma.deliverable.create({
        data: {
          projectId,
          uploadedById: dbUser.id,
          fileUrl,
          description: description || null,
          status: "PENDING_REVIEW",
        },
      })
    }

    // Create Notification for Client
    const { createNotification } = await import("@/app/actions/notification")
    await createNotification({
      userId: project.clientId,
      title: "Deliverable Diperbarui",
      message: `Worker telah mengunggah/memperbarui deliverable untuk proyek: ${project.title}. Menunggu review Anda.`,
      type: "INFO",
      link: "/id/client/deliverables"
    })

    revalidatePath("/(worker)")
    revalidatePath("/(client)")
    revalidatePath("/[locale]/(worker)/worker/deliverables", "page")
    revalidatePath("/[locale]/(client)/client/deliverables", "page")
    return { success: true, deliverableId: deliverable.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getWorkerTaskStats() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return { success: false, error: "Unauthorized" }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true }
    })
    if (!dbUser) return { success: false, error: "User not found" }

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: dbUser.id },
          { project: { workerId: dbUser.id } }
        ]
      },
      select: { id: true, status: true }
    })

    const todo = tasks.filter(t => t.status === "TO_DO").length
    const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length
    const review = tasks.filter(t => t.status === "REVIEW").length
    const done = tasks.filter(t => t.status === "DONE").length
    const total = tasks.length

    return {
      success: true,
      stats: {
        total,
        todo,
        inProgress,
        review,
        done,
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}



