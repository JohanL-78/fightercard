import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    // Vérifier le token
    await jwtVerify(token, SECRET_KEY)

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Admin verify error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}
