import { NextRequest, NextResponse } from 'next/server'
import { rateLimiters, rateLimitResponse } from '@/lib/rate-limit'
import { validateImageFile, validateFileBuffer } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // 🔒 ÉTAPE 1: Rate limiting (20 requêtes par minute)
    const rateLimitResult = rateLimiters.removeBg.check(request)
    if (!rateLimitResult.success) {
      console.warn('⚠️ Rate limit dépassé pour remove-bg')
      return rateLimitResponse(rateLimitResult.reset)
    }

    const formData = await request.formData()
    const imageFile = formData.get('image_file') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // 🔒 ÉTAPE 2: Validation de base (taille et type MIME)
    const basicValidation = validateImageFile(imageFile)
    if (!basicValidation.valid) {
      console.warn('⚠️ Validation de base échouée:', basicValidation.error)
      return NextResponse.json(
        { error: basicValidation.error || 'Fichier invalide' },
        { status: 400 }
      )
    }

    // 🔒 ÉTAPE 3: Validation avancée (magic bytes)
    const deepValidation = await validateFileBuffer(imageFile)
    if (!deepValidation.valid) {
      console.warn('⚠️ Validation des magic bytes échouée:', deepValidation.error)
      return NextResponse.json(
        { error: deepValidation.error || 'Le fichier n\'est pas une image valide' },
        { status: 400 }
      )
    }

    console.log('✅ Validation réussie, appel à Pixian API...')

    const apiId = process.env.PIXIAN_API_ID
    const apiSecret = process.env.PIXIAN_API_SECRET
    if (!apiId || !apiSecret) {
      return NextResponse.json({ error: 'Pixian API credentials not configured' }, { status: 500 })
    }

    // 🔒 ÉTAPE 4: Préparation de la requête Pixian (fichier déjà validé)
    const pixianFormData = new FormData()
    pixianFormData.append('image', imageFile)
    const mode = formData.get('mode')?.toString()
    if (!mode || mode !== 'final') {
      pixianFormData.append('test', 'true')
    }

    const response = await fetch('https://api.pixian.ai/api/v2/remove-background', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiId}:${apiSecret}`).toString('base64')}`,
      },
      body: pixianFormData,
    })

    if (!response.ok) {
      let message = 'Failed to remove background'
      try {
        const errorJson = await response.json()
        message = errorJson?.error?.message || message
      } catch {
        const fallbackText = await response.text()
        console.error('Pixian error (non-JSON):', fallbackText)
      }
      return NextResponse.json(
        { error: message },
        { status: response.status }
      )
    }

    // Conversion de la réponse en base64
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const imageUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error in remove-bg route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
