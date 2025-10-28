import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// 🔒 PRIX FIXE DÉFINI CÔTÉ SERVEUR - Ne JAMAIS faire confiance au client pour le prix
const FIXED_PRICE = 1500; // 15€ en centimes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customization, customerEmail } = body // ⚠️ On ignore volontairement 'amount' du client

    console.log('Création session Stripe pour:', customerEmail)

    // Sauvegarder la commande dans Supabase avec l'image directement dans final_image_url
    // L'image sera uploadée sur Cloudinary par le webhook après paiement
    const supabaseAdmin = getServiceSupabase() // 🔒 Utiliser service_role pour bypasser RLS
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_email: customerEmail,
        customization: customization,
        final_image_url: customization.photo, // Image base64 temporaire
        stripe_payment_id: 'pending',
        amount: FIXED_PRICE, // 🔒 Prix sécurisé côté serveur
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order in Supabase:', orderError)
      throw new Error('Failed to save order: ' + orderError.message)
    }

    console.log('Commande créée dans Supabase:', order.id)

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Carte de combat personnalisée',
              description: `Carte personnalisée pour ${customization.name}`,
            },
            unit_amount: FIXED_PRICE, // 🔒 Prix sécurisé côté serveur
            tax_behavior: 'exclusive', // Le prix n'inclut pas la TVA
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      customer_email: customerEmail,
      // Collecte de l'adresse de livraison
      shipping_address_collection: {
        allowed_countries: [
          'FR', 'BE', 'DE', 'ES', 'IT', 'PT', 'NL', 'LU',
          'GB', 'US', 'CA', 'CH', 'AT', 'IE', 'SE', 'NO',
          'DK', 'FI', 'PL', 'CZ', 'GR', 'RO', 'BG', 'HR'
        ],
      },
      // Options de livraison (optionnel)
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Livraison gratuite pour le moment
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
        orderId: order.id,
        customerEmail: customerEmail,
        name: customization.name,
      },
      // TVA automatique désactivée pour les tests
      // Pour activer : vous devez compléter la configuration dans Stripe Dashboard
      // https://dashboard.stripe.com/settings/tax
      automatic_tax: {
        enabled: false,
      },
    })

    console.log('Session créée:', session.id)
    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    // Afficher l'erreur complète pour déboguer
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    )
  }
}
