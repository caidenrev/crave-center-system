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

    revalidatePath("/(worker)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
