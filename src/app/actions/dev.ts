'use server'

import { prisma } from '@/lib/db'
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/prisma'

export async function changeUserRole(role: Role) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error("You must be logged in to change your role.")
    }

    await prisma.user.update({
      where: { email: user.email },
      data: { role }
    })

    revalidatePath("/")
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
