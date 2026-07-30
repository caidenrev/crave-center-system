"use server"

import { prisma } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"

export async function createJobRequest(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Gunakan email karena id supabase mungkin berbeda dengan id prisma jika tidak disinkronisasi persis
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      throw new Error("User not found in database")
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const budgetRange = formData.get("budgetRange") as string

    if (!title || !description) {
      throw new Error("Title and description are required")
    }

    const project = await prisma.project.create({
      data: {
        clientId: dbUser.id,
        title,
        description,
        budgetRange: budgetRange || null,
        status: "REQUESTED",
      }
    })

    return { success: true, project }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
