"use server"

import { prisma } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"
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

    // Verify worker exists
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

    // Send Real-time Email to Worker
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Crave ITSM <onboarding@resend.dev>', // Use a verified domain in production
          to: worker.email,
          subject: `New Job Request: ${title}`,
          html: `
            <h2>Hello ${worker.name},</h2>
            <p>You have received a new job request from <strong>${dbUser.name}</strong>.</p>
            <h3>Project: ${title}</h3>
            <p>${description}</p>
            <p><strong>Target Deadline:</strong> ${targetDeliveryDate ? targetDeliveryDate.toDateString() : 'Not specified'}</p>
            ${briefFileUrl ? `<p><a href="${briefFileUrl}">Download Brief PDF</a></p>` : ''}
            <br/>
            <p>Please login to your Crave Worker Dashboard to review and submit your price & duration estimation.</p>
          `
        });
      } catch (emailError) {
        console.error("Failed to send email to worker:", emailError)
        // We don't fail the project creation if email fails
      }
    } else {
      console.log(`[Mock Email] Would have sent email to ${worker.email} for project ${title}`)
    }

    return { success: true, project }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
