import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase'
import { sanitizeFighterName, sanitizeSport, sanitizeRating, sanitizeStats, sanitizeUrl } from '@/lib/sanitize'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// 🔒 PRIX FIXE DÉFINI CÔTÉ SERVEUR
const FIXED_PRICE = 1500; // 15€ en centimes

interface CartItem {
  id: string
  imageUrl: string
  originalPhoto: string
  customization: {
    templateId: string
    photo: string
    username: string
    name: string
    sport: string
    rating: number
    flagUrl: string
    removeBackground: boolean
    stats: {
      force: number
      rapidite: number
      grappling: number
      endurance: number
      striking: number
      equilibre: number
    }
  }
  price: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customer_email } = body as { items: CartItem[], customer_email: string }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    if (!customer_email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    console.log('Checkout panier pour:', customer_email, '- Nombre de cartes:', items.length)

    const supabase = getServiceSupabase()
    const orderIds: string[] = []

    // Créer une commande dans Supabase pour chaque carte
    for (const item of items) {
      // 🔒 SÉCURITÉ: Sanitiser les données
      const sanitizedCustomization = {
        templateId: item.customization.templateId || '',
        photo: sanitizeUrl(item.customization.photo || ''),
        username: sanitizeFighterName(item.customization.username || ''),
        name: sanitizeFighterName(item.customization.name || 'FIGHTER'),
        sport: sanitizeSport(item.customization.sport || 'MMA'),
        rating: sanitizeRating(item.customization.rating || 85),
        flagUrl: item.customization.flagUrl ? sanitizeUrl(item.customization.flagUrl) : '',
        removeBackground: Boolean(item.customization.removeBackground),
        stats: sanitizeStats(item.customization.stats || {}),
      }

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_email,
          fighter_photo_url: item.originalPhoto,      // Photo originale
          customization: sanitizedCustomization,       // 🔒 Données sanitisées
          template_preview_url: item.imageUrl,         // Aperçu HD généré
          final_image_url: item.imageUrl,              // Image finale HD
          stripe_payment_id: 'pending',
          amount: FIXED_PRICE,                         // 🔒 Prix sécurisé côté serveur
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur Supabase pour carte:', item.customization.name, error)
        // Continue avec les autres même si une échoue
        continue
      }

      orderIds.push(order.id)
      console.log('Commande créée:', order.id, 'pour', sanitizedCustomization.name)
    }

    if (orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Échec de création des commandes' },
        { status: 500 }
      )
    }

    // Créer les line items pour Stripe (une ligne par carte)
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Carte de combat personnalisée',
          description: `Carte pour ${item.customization.name} (${item.customization.sport})`,
          images: [item.imageUrl], // Image de la carte
        },
        unit_amount: FIXED_PRICE,
        tax_behavior: 'exclusive' as const,
      },
      quantity: 1,
    }))

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_ids=${orderIds.join(',')}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      customer_email: customer_email,
      shipping_address_collection: {
        allowed_countries: [
          'FR', 'BE', 'DE', 'ES', 'IT', 'PT', 'NL', 'LU',
          'GB', 'US', 'CA', 'CH', 'AT', 'IE', 'SE', 'NO',
          'DK', 'FI', 'PL', 'CZ', 'GR', 'RO', 'BG', 'HR'
        ],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'eur',
            },
            display_name: 'Livraison standard',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 10,
              },
            },
          },
        },
      ],
      metadata: {
        orderIds: orderIds.join(','),
        customerEmail: customer_email,
        itemCount: items.length.toString(),
      },
      automatic_tax: {
        enabled: false,
      },
    })

    console.log('Session Stripe créée:', session.id, '- Commandes:', orderIds.join(', '))

    return NextResponse.json({
      success: true,
      orderIds: orderIds,
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Erreur checkout panier:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Détails:', errorMessage)
    return NextResponse.json(
      { error: 'Erreur serveur', details: errorMessage },
      { status: 500 }
    )
  }
}
