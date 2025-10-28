import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protéger la route /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('admin-auth-token')?.value

    if (!authToken) {
      // Rediriger vers la page de connexion
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Vérifier la validité du token (sera fait côté serveur)
    // Pour l'instant, on vérifie juste sa présence
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
