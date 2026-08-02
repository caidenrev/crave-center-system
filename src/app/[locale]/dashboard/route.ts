import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { origin, pathname } = new URL(request.url)
  
  // Extract locale from the URL (e.g. /en/dashboard -> en)
  const localeMatch = pathname.match(/^\/(en|id)/)
  const locale = localeMatch ? localeMatch[1] : 'en'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
      })

      const role = dbUser?.role || 'CLIENT'

      let nextPath = `/${locale}/client`
      if (role === 'ADMIN') nextPath = `/${locale}/admin/applications`
      if (role === 'TEAM_MEMBER') nextPath = `/${locale}/worker`

      return NextResponse.redirect(`${origin}${nextPath}`)
    } catch (dbError) {
      console.error("Error fetching user role:", dbError)
      // Default to client dashboard on DB error
      return NextResponse.redirect(`${origin}/${locale}/client`)
    }
  }

  // If not authenticated, redirect to login
  return NextResponse.redirect(`${origin}/${locale}/login`)
}
