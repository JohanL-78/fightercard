import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// 🔒 PRIX FIXE DÉFINI CÔTÉ SERVEUR
const FIXED_PRICE = 1500; // 15€ en centimes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { photo_url, customization, customer_email } = body

    if (!photo_url || !customization || !customer_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Création commande pour:', customer_email)

    // Créer commande dans Supabase avec photo originale
    const supabase = getServiceSupabase()

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_email,
        fighter_photo_url: photo_url,      // Photo originale uploadée
        customization,
        template_preview_url: null,         // Sera généré par admin
        final_image_url: null,              // Sera généré par admin
        stripe_payment_id: 'pending',
        amount: FIXED_PRICE,                // 🔒 Prix sécurisé côté serveur
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
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
            unit_amount: FIXED_PRICE,
            tax_behavior: 'exclusive',
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
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
        orderId: order.id,
        customerEmail: customer_email,
        name: customization.name,
      },
      automatic_tax: {
        enabled: false,
      },
    })

    console.log('Session Stripe créée:', session.id)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Create order error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}
