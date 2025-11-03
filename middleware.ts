import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'

export async function middleware(request: NextRequest) {
  // Protéger la route /admin (SAUF /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Autoriser l'accès à la page de login sans authentification
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // 🔒 Vérifier la validité du JWT
    const authenticated = await isAuthenticated(request)

    if (!authenticated) {
      // Token invalide, expiré ou manquant → redirection vers login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
