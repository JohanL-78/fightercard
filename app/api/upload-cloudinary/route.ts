// 🔒 Route API sécurisée pour uploader vers Cloudinary
// Remplace l'upload unsigned côté client par un upload serveur avec credentials

import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { rateLimiters, rateLimitResponse } from '@/lib/rate-limit'
import { validateBase64Image } from '@/lib/validation'
import type { CloudinaryFolder } from '@/lib/cloudinary-upload'

// Configuration Cloudinary avec credentials serveur
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Nouvelle requête upload-cloudinary reçue')

    // 🔒 ÉTAPE 1: Rate limiting (3 uploads par minute)
    const rateLimitResult = rateLimiters.upload.check(request)
    if (!rateLimitResult.success) {
      console.warn('⚠️ Rate limit dépassé pour upload-cloudinary')
      return rateLimitResponse(rateLimitResult.reset)
    }

    console.log('✅ Rate limit OK')

    const body = await request.json()
    console.log('📦 Body parsé, folder:', body.folder, 'file length:', body.file?.length)

    const { file, folder } = body as { file: string; folder: CloudinaryFolder }

    // 🔒 ÉTAPE 2: Validation des paramètres
    if (!file || !folder) {
      return NextResponse.json(
        { error: 'Paramètres manquants (file, folder)' },
        { status: 400 }
      )
    }

    // Vérifier que le dossier est autorisé
    const allowedFolders: CloudinaryFolder[] = ['original-photos', 'templates', 'final-cards']
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { error: `Dossier non autorisé: ${folder}` },
        { status: 400 }
      )
    }

    // 🔒 ÉTAPE 3: Validation de l'image (taille, type, magic bytes)
    const validation = validateBase64Image(file)
    if (!validation.valid) {
      console.warn('⚠️ Validation échouée:', validation.error)
      return NextResponse.json(
        { error: validation.error || 'Image invalide' },
        { status: 400 }
      )
    }

    console.log('✅ Validation réussie, upload sécurisé vers Cloudinary...')

    // 🔒 ÉTAPE 4: Upload sécurisé avec credentials serveur
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: `fight-cards/${folder}`,
      resource_type: 'image',
      // Limites de sécurité
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      max_file_size: 10485760, // 10 MB
      // Invalidate CDN cache si remplacement
      invalidate: true,
    })

    console.log('✅ Image uploadée sur Cloudinary:', {
      url: uploadResult.secure_url,
      folder: folder,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      size: `${(uploadResult.bytes / 1024 / 1024).toFixed(2)} MB`,
    })

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    })

  } catch (error) {
    console.error('❌ Erreur upload Cloudinary:', error)

    // Log détaillé pour debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload', details: errorMessage },
      { status: 500 }
    )
  }
}
