import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { supabase } from '@/lib/supabase'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'
)

// GET - Récupérer l'email de contact (public)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'contact_email')
      .single()

    if (error) {
      console.error('Erreur récupération email:', error)
      // Retourner l'email par défaut si erreur
      return NextResponse.json({ email: 'fightercard@example.com' })
    }

    return NextResponse.json({ email: data.value })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ email: 'fightercard@example.com' })
  }
}

// PATCH - Modifier l'email de contact (admin uniquement)
export async function PATCH(request: Request) {
  try {
    // Vérifier l'authentification admin via JWT
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Vérifier le token
    await jwtVerify(token, SECRET_KEY)

    const { email } = await request.json()

    // Validation basique de l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Mettre à jour l'email dans la base de données
    const { data, error } = await supabase
      .from('settings')
      .update({ value: email, updated_at: new Date().toISOString() })
      .eq('key', 'contact_email')
      .select()
      .single()

    if (error) {
      console.error('Erreur mise à jour email:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, email: data.value })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
