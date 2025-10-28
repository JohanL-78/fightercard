import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { supabaseAdmin } from '@/lib/supabase-admin'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'
)

// Middleware pour vérifier l'authentification
async function verifyAuth(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-auth-token')?.value

  if (!token) {
    return null
  }

  try {
    await jwtVerify(token, SECRET_KEY)
    return true
  } catch {
    return null
  }
}

// GET /api/admin/orders - Récupérer toutes les commandes
export async function GET(request: NextRequest) {
  // Vérifier l'authentification
  const authenticated = await verifyAuth(request)
  if (!authenticated) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ orders: data || [] })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/orders - Mettre à jour le statut d'une commande
export async function PATCH(request: NextRequest) {
  // Vérifier l'authentification
  const authenticated = await verifyAuth(request)
  if (!authenticated) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }

  try {
    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'orderId et status requis' },
        { status: 400 }
      )
    }

    // Vérifier que le statut est valide
    const validStatuses = ['pending', 'completed', 'delivered']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
