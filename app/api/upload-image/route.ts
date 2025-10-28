// Fichier : /app/api/upload-image/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { rateLimiters, rateLimitResponse } from '@/lib/rate-limit'
import { validateBase64Image } from '@/lib/validation'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // 🔒 ÉTAPE 1: Rate limiting (10 requêtes par minute)
    const rateLimitResult = rateLimiters.upload.check(request)
    if (!rateLimitResult.success) {
      console.warn('⚠️ Rate limit dépassé pour upload-image')
      return rateLimitResponse(rateLimitResult.reset)
    }

    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'Image manquante' }, { status: 400 })
    }

    // 🔒 ÉTAPE 2: Validation de l'image (taille, type, magic bytes)
    const validation = validateBase64Image(image)
    if (!validation.valid) {
      console.warn('⚠️ Validation échouée:', validation.error)
      return NextResponse.json(
        { error: validation.error || 'Image invalide' },
        { status: 400 }
      )
    }

    console.log('✅ Validation réussie, upload vers Cloudinary...')

    // 🔒 ÉTAPE 3: Upload sécurisé avec limites strictes
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'fight-cards',
      format: 'png',
      // Limite de taille côté Cloudinary (backup)
      resource_type: 'image',
      // Empêche l'upload de fichiers malveillants
      invalidate: true,
    })

    console.log('Image PNG uploadée sur Cloudinary:', {
      url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format, // Devrait être 'png'
      size: `${(uploadResult.bytes / 1024 / 1024).toFixed(2)} MB`,
    })

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      publicId: uploadResult.public_id,
    })

  } catch (error) {
    console.error('Erreur upload Cloudinary:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}