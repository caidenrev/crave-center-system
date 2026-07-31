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

    revalidatePath("/(client)")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
