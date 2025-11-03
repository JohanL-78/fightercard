// 🔒 Route API pour générer une signature Cloudinary
// Permet l'upload direct vers Cloudinary de manière sécurisée

import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { folder } = await request.json()

    // Timestamp actuel (en secondes)
    const timestamp = Math.round(Date.now() / 1000)

    // Paramètres de l'upload (triés alphabétiquement - requis par Cloudinary)
    // On n'utilise PAS de preset, juste la signature directe
    const params: Record<string, string | number> = {
      folder: `fight-cards/${folder}`,
      timestamp: timestamp,
    }

    console.log('🔑 Génération signature avec params:', params)

    // Générer la signature avec Cloudinary SDK
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    )

    console.log('✅ Signature générée:', signature.substring(0, 10) + '...')

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: params.folder,
    })
  } catch (error) {
    console.error('❌ Erreur génération signature:', error)
    return NextResponse.json(
      { error: 'Erreur génération signature' },
      { status: 500 }
    )
  }
}
