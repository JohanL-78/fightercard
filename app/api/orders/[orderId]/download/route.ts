import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { v2 as cloudinary } from 'cloudinary'
import { downloadLogger } from '@/lib/secure-logger'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  let orderId: string = ''

  try {
    const resolvedParams = await params
    orderId = resolvedParams.orderId

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande manquant' },
        { status: 400 }
      )
    }

    // 1. Récupérer la commande depuis Supabase (avec service role pour contourner RLS)
    const supabase = getServiceSupabase()
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      downloadLogger.logDownloadError(orderId, 'not-found')
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      )
    }

    // 2. Vérifier que la commande a été payée
    // En mode développement (sans webhook), on accepte les commandes
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isPending = order.stripe_payment_id === 'pending'

    if (!isDevelopment && (!order.stripe_payment_id || isPending)) {
      downloadLogger.logDownloadError(orderId, 'unpaid')
      return NextResponse.json(
        { error: 'Cette commande n\'a pas été payée. Veuillez finaliser le paiement.' },
        { status: 403 }
      )
    }

    // 🔒 Pas de log des détails de la commande (seulement en dev, anonymisé)
    // Les logs détaillés sont gérés par downloadLogger qui anonymise en production

    // 3. Vérifier qu'il y a une image
    if (!order.final_image_url) {
      downloadLogger.logDownloadError(orderId, 'no-image')
      return NextResponse.json(
        { error: 'Aucune image disponible pour cette commande' },
        { status: 404 }
      )
    }

    // 4. Télécharger l'image depuis Cloudinary et la servir directement
    const imageResponse = await fetch(order.final_image_url)

    if (!imageResponse.ok) {
      downloadLogger.logDownloadError(orderId, 'fetch-failed')
      return NextResponse.json(
        { error: 'Impossible de récupérer l\'image' },
        { status: 500 }
      )
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    // 🔒 Log sécurisé du téléchargement réussi
    downloadLogger.logDownload(orderId, true)

    // 5. Retourner l'image avec les bons headers pour le téléchargement
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="fight-card-${orderId}.jpg"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Download link error:', error)
    downloadLogger.logDownloadError(orderId, 'server-error')
    return NextResponse.json(
      { error: 'Erreur serveur lors de la génération du lien' },
      { status: 500 }
    )
  }
}
