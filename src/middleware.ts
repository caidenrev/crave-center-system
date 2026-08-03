import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/request'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale
});

export async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware to handle locale routing
  const response = intlMiddleware(request)

  // 2. Run Supabase auth on top of the i18n response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Strip locale from pathname for auth checking
  const pathname = request.nextUrl.pathname
  const pathWithoutLocale = pathname.replace(/^\/(en|id)/, '') || '/'
  
  const publicRoutes = ["/", "/products", "/solutions", "/services", "/pricing", "/about", "/resources", "/contact", "/api/enable-realtime"]
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale) || 
                        pathWithoutLocale.startsWith("/resources/") || 
                        pathWithoutLocale.startsWith("/login") || 
                        pathWithoutLocale.startsWith("/register") || 
                        pathWithoutLocale.startsWith("/auth")

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    const locale = pathname.match(/^\/(en|id)/)?.[1] || defaultLocale
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  // If user is already authenticated and trying to access auth pages, redirect to dashboard
  const isAuthRoute = pathWithoutLocale.startsWith("/login") || pathWithoutLocale.startsWith("/register")
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    const locale = pathname.match(/^\/(en|id)/)?.[1] || defaultLocale
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    // Skip next internals, static files, and api routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
