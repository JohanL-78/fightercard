// 🔒 Utilitaire pour uploader vers Cloudinary en mode unsigned sécurisé

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

export type CloudinaryFolder = 'original-photos' | 'templates' | 'final-cards'

/**
 * Upload un fichier vers Cloudinary en mode unsigned
 * Sécurisé via restrictions du preset Cloudinary (taille, types, rate limiting)
 * @param file - Fichier ou Blob à uploader
 * @param folder - Dossier de destination dans Cloudinary
 * @returns URL sécurisée de l'image uploadée
 */
export async function uploadToCloudinary(
  file: File | Blob,
  folder: CloudinaryFolder
): Promise<string> {
  // Validation côté client (backup - vraie validation dans Cloudinary)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Fichier trop volumineux (max 10 MB)')
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'fight-cards-unsigned')
    formData.append('folder', `fight-cards/${folder}`)

    console.log('📤 Upload vers Cloudinary...')
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erreur Cloudinary:', error)
      throw new Error(error.error?.message || 'Erreur upload Cloudinary')
    }

    const data = await response.json()
    console.log('✅ Upload réussi:', data.secure_url)
    return data.secure_url

  } catch (error) {
    console.error('❌ Erreur upload:', error)
    throw error
  }
}

/**
 * Convertit un Blob en base64
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Convertit une image base64 en Blob
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  return new Blob([uInt8Array], { type: contentType })
}

/**
 * Charge une image depuis une URL et retourne un HTMLImageElement
 */
export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
