import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Vérifier les identifiants (CÔTÉ SERVEUR uniquement)
    const validUsername = process.env.ADMIN_USERNAME
    const validPassword = process.env.ADMIN_PASSWORD

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      )
    }

    // Créer un JWT token sécurisé
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET_KEY)

    // Créer la réponse avec le cookie sécurisé
    const response = NextResponse.json({ success: true })

    const cookieStore = await cookies()
    cookieStore.set('admin-auth-token', token, {
      httpOnly: true, // Empêche l'accès JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
      sameSite: 'strict', // Protection CSRF
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
