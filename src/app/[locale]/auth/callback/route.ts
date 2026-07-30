import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Jika ada parameter "next", gunakan itu sebagai rute redirect
  const next = searchParams.get('next') ?? '/client-dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Jika gagal, redirect kembali ke login dengan error
  return NextResponse.redirect(`${origin}/login?error=CouldNotAuthenticate`)
}
