// 🔒 Utilitaires de validation pour sécuriser les uploads

// Tailles maximales
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
export const MAX_BASE64_SIZE = 15 * 1024 * 1024 // 15 MB pour base64 (overhead ~33%)

// Types MIME autorisés
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

// Magic bytes pour vérifier le vrai type de fichier
const MAGIC_BYTES = {
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  gif: [0x47, 0x49, 0x46, 0x38],
  webp: [0x52, 0x49, 0x46, 0x46], // "RIFF"
}

/**
 * Valide qu'une string base64 est une image valide
 */
export function validateBase64Image(base64String: string): {
  valid: boolean
  error?: string
} {
  // Vérifier que c'est bien une string
  if (typeof base64String !== 'string') {
    return { valid: false, error: 'Format invalide: doit être une chaîne de caractères' }
  }

  // Extraire le data URL header si présent
  let base64Data = base64String
  let mimeType: string | null = null

  if (base64String.startsWith('data:')) {
    // ⚡ Optimisation : extraction manuelle sans regex (évite stack overflow sur grandes images)
    const commaIndex = base64String.indexOf(',')
    if (commaIndex === -1) {
      return { valid: false, error: 'Format data URL invalide' }
    }

    const header = base64String.substring(0, commaIndex) // "data:image/png;base64"
    base64Data = base64String.substring(commaIndex + 1) // La partie base64

    // Extraire le type MIME du header
    const semiColonIndex = header.indexOf(';')
    if (semiColonIndex === -1) {
      return { valid: false, error: 'Format data URL invalide' }
    }

    mimeType = header.substring(5, semiColonIndex) // Retire "data:" au début

    // Vérifier le type MIME
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé: ${mimeType}. Types acceptés: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      }
    }
  }

  // Vérifier la taille
  const sizeInBytes = (base64Data.length * 3) / 4
  if (sizeInBytes > MAX_BASE64_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB. Maximum: ${MAX_BASE64_SIZE / 1024 / 1024}MB`,
    }
  }

  // Vérifier les magic bytes si on peut décoder
  try {
    const buffer = Buffer.from(base64Data, 'base64')

    // Vérifier que le buffer n'est pas vide
    if (buffer.length === 0) {
      return { valid: false, error: 'Image vide' }
    }

    // Vérifier les magic bytes
    const isValidImage =
      checkMagicBytes(buffer, MAGIC_BYTES.jpeg) ||
      checkMagicBytes(buffer, MAGIC_BYTES.png) ||
      checkMagicBytes(buffer, MAGIC_BYTES.gif) ||
      checkMagicBytes(buffer, MAGIC_BYTES.webp)

    if (!isValidImage) {
      return { valid: false, error: 'Le fichier n\'est pas une image valide' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Impossible de décoder l\'image base64' }
  }
}

/**
 * Valide un objet File (multipart/form-data)
 */
export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  // Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  // Vérifier le type MIME
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé: ${file.type}. Types acceptés: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    }
  }

  return { valid: true }
}

/**
 * Valide un fichier en vérifiant ses magic bytes
 */
export async function validateFileBuffer(file: File): Promise<{
  valid: boolean
  error?: string
}> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    const isValidImage =
      checkMagicBytes(buffer, MAGIC_BYTES.jpeg) ||
      checkMagicBytes(buffer, MAGIC_BYTES.png) ||
      checkMagicBytes(buffer, MAGIC_BYTES.gif) ||
      checkMagicBytes(buffer, MAGIC_BYTES.webp)

    if (!isValidImage) {
      return { valid: false, error: 'Le fichier n\'est pas une image valide (magic bytes)' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Impossible de lire le fichier' }
  }
}

/**
 * Vérifie si les premiers octets d'un buffer correspondent aux magic bytes
 */
function checkMagicBytes(buffer: Buffer, magicBytes: number[]): boolean {
  if (buffer.length < magicBytes.length) {
    return false
  }

  for (let i = 0; i < magicBytes.length; i++) {
    if (buffer[i] !== magicBytes[i]) {
      return false
    }
  }

  return true
}
