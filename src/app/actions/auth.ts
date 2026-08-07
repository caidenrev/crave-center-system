"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

export async function loginWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get("origin")
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    return { url: data.url }
  }
}

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }
  
  // Return success to let client handle redirect (because we need locale)
  return { success: true }
}

export async function registerWithEmail(formData: FormData) {
  const email = (formData.get("email") as string || "").trim()
  const password = formData.get("password") as string
  const name = (formData.get("name") as string || "").trim()
  const phone = (formData.get("phone") as string || "").trim()
  
  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: name,
        phone: phone,
      }
    }
  })

  if (error) {
    return { error: String(error.message || error) }
  }

  // If user already exists, Supabase returns user object with empty identities array
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "Email sudah terdaftar. Silakan login atau gunakan email lain." }
  }

  // Auto sign in user immediately so they don't need manual email verification step
  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return { error: String(signInError.message || signInError) }
    }
  }

  return { success: true }
}
