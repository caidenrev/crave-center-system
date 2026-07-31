import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const requestUrl = new URL(request.url)
  const supabase = await createClient()
  
  await supabase.auth.signOut()
  
  // Redirect to localized home page
  return NextResponse.redirect(`${requestUrl.origin}/${locale}`)
}
