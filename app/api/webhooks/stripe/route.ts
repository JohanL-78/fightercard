import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase'
import { v2 as cloudinary } from 'cloudinary'
import { stripeLogger } from '@/lib/secure-logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Gestion de l'événement payment_intent.succeeded
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // 🔒 Log sécurisé sans PII (conforme RGPD)
      stripeLogger.logCheckoutSession(session)

      const orderId = session.metadata?.orderId

      if (!orderId) {
        console.error('No orderId in session metadata')
        return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
      }

      const supabase = getServiceSupabase()

      // Récupérer la commande existante
      const { data: existingOrder, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (fetchError || !existingOrder) {
        stripeLogger.logWebhookError(fetchError, 'Order not found in database')
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // 🎨 GÉNÉRATION DE LA CARTE FINALE
      // L'image preview (avec watermark Pixian) est déjà uploadée
      const finalImageUrl = existingOrder.final_image_url

      // ============================================
      // 🚀 REMOVE-BG FINAL (MODE PRODUCTION PAYANT)
      // ============================================
      // 📝 Instructions d'activation :
      // 1. Acheter des crédits Pixian (https://pixian.ai/pricing)
      // 2. Décommenter le code ci-dessous et changer 'const' en 'let' ligne 66
      // 3. Redéployer l'application
      // Coût : ~0.0037€ par commande (négligeable)
      // ============================================

      /*
      const fighterPhoto = existingOrder.customization?.photo

      if (fighterPhoto) {
        try {
          console.log('🎨 Génération carte finale avec remove-bg production...')

          // Convertir base64 en Buffer pour Pixian
          const base64Data = fighterPhoto.includes(',')
            ? fighterPhoto.split(',')[1]
            : fighterPhoto
          const imageBuffer = Buffer.from(base64Data, 'base64')

          // Créer un Blob pour l'API Pixian
          const blob = new Blob([imageBuffer], { type: 'image/png' })

          // Préparer FormData pour Pixian
          const pixianFormData = new FormData()
          pixianFormData.append('image', blob, 'fighter.png')
          // ⚠️ PAS de test=true → Mode production PAYANT (sans watermark)

          // Appel Pixian API en mode FINAL
          const pixianResponse = await fetch('https://api.pixian.ai/api/v2/remove-background', {
            method: 'POST',
            headers: {
              Authorization: `Basic ${Buffer.from(`${process.env.PIXIAN_API_ID}:${process.env.PIXIAN_API_SECRET}`).toString('base64')}`,
            },
            body: pixianFormData,
          })

          if (pixianResponse.ok) {
            // Image propre SANS watermark
            const cleanImageBuffer = await pixianResponse.arrayBuffer()
            const cleanImageBase64 = Buffer.from(cleanImageBuffer).toString('base64')
            const cleanImageDataUrl = `data:image/png;base64,${cleanImageBase64}`

            // Upload de l'image propre sur Cloudinary
            const uploadResult = await cloudinary.uploader.upload(cleanImageDataUrl, {
              folder: 'fight-cards-final',
              format: 'png',
              resource_type: 'image',
              invalidate: true,
            })

            console.log('✅ Image finale propre uploadée:', uploadResult.secure_url)
            finalImageUrl = uploadResult.secure_url

            // TODO: Optionnel - Régénérer toute la carte avec l'image propre
            // Pour l'instant on upload juste la photo sans fond
            // Si tu veux régénérer toute la carte, il faut :
            // 1. Recréer le canvas avec tous les éléments
            // 2. Utiliser cleanImageDataUrl comme photo du combattant
            // 3. Upload la carte complète sur Cloudinary

          } else {
            const errorText = await pixianResponse.text()
            console.warn('⚠️ Remove-bg final échoué:', errorText)
            // Continue avec l'image preview (avec watermark)
          }
        } catch (removeBgError) {
          console.error('❌ Erreur génération finale:', removeBgError)
          // Continue avec l'image preview en cas d'erreur
        }
      }
      */

      // Extraire l'adresse de livraison depuis la session Stripe
      // L'adresse peut être dans shipping_details OU customer_details.address
      const shippingDetails = session.shipping_details
      const customerDetails = session.customer_details
      const address = shippingDetails?.address || customerDetails?.address
      const name = shippingDetails?.name || customerDetails?.name || ''

      const taxAmount = session.total_details?.amount_tax || 0
      const totalAmount = session.amount_total || existingOrder.amount

      // 🔒 Pas de log des données personnelles (nom, adresse)

      // Mettre à jour la commande avec les infos de paiement et l'adresse
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          final_image_url: finalImageUrl,
          stripe_payment_id: session.payment_intent as string,
          status: 'pending', // En attente de traitement admin
          // Adresse de livraison
          shipping_name: name,
          shipping_address_line1: address?.line1 || '',
          shipping_address_line2: address?.line2 || '',
          shipping_city: address?.city || '',
          shipping_postal_code: address?.postal_code || '',
          shipping_country: address?.country || '',
          // Montants
          tax_amount: taxAmount,
          total_amount: totalAmount,
        })
        .eq('id', orderId)

      if (updateError) {
        stripeLogger.logWebhookError(updateError, 'Failed to update order in database')
        throw updateError
      }

      // 🔒 Log sécurisé sans exposer l'ID complet
      stripeLogger.logOrderUpdate(orderId, 'pending')

      // TODO: Envoyer un email au client avec le lien de téléchargement
      // TODO: Notifier l'admin de la nouvelle commande

    } catch (error) {
      stripeLogger.logWebhookError(error, 'Payment processing failed')
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
