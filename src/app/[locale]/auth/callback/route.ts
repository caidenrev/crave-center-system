import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams, origin, pathname } = new URL(request.url)
  const code = searchParams.get('code')

  // Extract locale from the URL (e.g. /en/auth/callback -> en)
  const localeMatch = pathname.match(/^\/(en|id)/)
  const locale = localeMatch ? localeMatch[1] : 'en'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      try {
        // Fetch user role from Prisma
        const dbUser = await prisma.user.findUnique({
          where: { id: data.user.id }
        })

        const role = dbUser?.role || 'CLIENT'

        let nextPath = `/${locale}/client`
        if (role === 'ADMIN') nextPath = `/${locale}/admin`
        if (role === 'TEAM_MEMBER') nextPath = `/${locale}/worker`

        return NextResponse.redirect(`${origin}${nextPath}`)
      } catch (dbError) {
        console.error("Error fetching user role:", dbError)
        // Default to client dashboard on DB error
        return NextResponse.redirect(`${origin}/${locale}/client`)
      }
    }
  }

  // If auth fails, redirect back to login
  return NextResponse.redirect(`${origin}/${locale}/login?error=CouldNotAuthenticate`)
}
