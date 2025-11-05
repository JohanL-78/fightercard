// 🔒 Utilitaires de sanitisation pour sécuriser les entrées utilisateur

/**
 * Sanitise un texte en supprimant les caractères dangereux
 * et en limitant sa longueur
 */
export function sanitizeText(text: string, maxLength: number = 50): string {
  if (typeof text !== 'string') {
    return ''
  }

  // Supprimer les caractères dangereux qui pourraient causer des XSS
  // ou casser le rendu Canvas
  const cleaned = text
    .replace(/[<>\"'`]/g, '') // Supprimer < > " ' `
    .replace(/\n/g, ' ')      // Remplacer retours à la ligne par espaces
    .replace(/\r/g, '')       // Supprimer retours chariot
    .replace(/\t/g, ' ')      // Remplacer tabulations par espaces
    .replace(/\\/g, '')       // Supprimer backslashes
    .replace(/\//g, '')       // Supprimer slashes
    .replace(/javascript:/gi, '') // Supprimer javascript:
    .replace(/on\w+=/gi, '')  // Supprimer les event handlers (onclick=, onerror=, etc.)
    .trim()                   // Supprimer espaces début/fin

  // Limiter la longueur pour éviter les attaques DoS
  return cleaned.substring(0, maxLength)
}

/**
 * Sanitise une URL en validant qu'elle est sûre
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return ''
  }

  // Nettoyer l'URL
  const cleaned = url.trim()

  // Vérifier que l'URL commence par un protocole sûr ou est relative
  const safeProtocols = ['http://', 'https://', 'data:image/', '/']
  const isSafe = safeProtocols.some(protocol => cleaned.startsWith(protocol))

  if (!isSafe && cleaned !== '') {
    return ''
  }

  // Supprimer les caractères dangereux
  return cleaned
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<script/gi, '')
    .replace(/<\/script/gi, '')
}

/**
 * Sanitise du HTML en échappant les caractères spéciaux
 * Alternative légère à DOMPurify pour Next.js
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return ''
  }

  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitise un nom de combattant (converti en majuscules)
 */
export function sanitizeFighterName(name: string): string {
  if (typeof name !== 'string') {
    return ''
  }

  const cleaned = name
    .replace(/[<>\"'`]/g, '')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/\\/g, '')
    .replace(/\//g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')

  // Supprimer les espaces en début tout en conservant les espaces internes/finaux
  const withoutLeadingSpaces = cleaned.replace(/^\s+/, '')
  const normalizedSpaces = withoutLeadingSpaces.replace(/\s+/g, ' ')
  const limited = normalizedSpaces.substring(0, 30)

  return limited.toUpperCase()
}

/**
 * Sanitise un sport/discipline (converti en majuscules)
 */
export function sanitizeSport(sport: string): string {
  const cleaned = sanitizeText(sport, 20) // Max 20 caractères
  return cleaned.toUpperCase()
}

/**
 * Valide un code pays (doit être exactement 2 lettres minuscules)
 */
export function validateCountryCode(code: string): boolean {
  if (typeof code !== 'string') {
    return false
  }

  // Doit être exactement 2 caractères alphabétiques minuscules
  return /^[a-z]{2}$/.test(code)
}

/**
 * Liste des codes pays valides (ISO 3166-1 alpha-2)
 */
export const VALID_COUNTRY_CODES = [
  '', 'fr', 'us', 'gb', 'de', 'es', 'it', 'pt', 'br', 'ru', 'jp', 'cn',
  'kr', 'mx', 'ca', 'au', 'nz', 'nl', 'be', 'ch', 'se', 'no', 'dk', 'fi',
  'pl', 'cz', 'at', 'gr', 'tr', 'ie', 'ar', 'cl', 'co', 'pe', 'za', 'ng',
  'eg', 'ma', 'dz', 'tn', 'in', 'pk', 'th', 'vn', 'id', 'ph', 'my', 'sg',
  'il', 'sa', 'ae', 'ua', 'ro', 'bg', 'hr', 'rs'
] as const

/**
 * Valide et retourne un code pays sécurisé
 */
export function sanitizeCountryCode(code: string): string {
  if (!code || code === '') {
    return ''
  }

  const cleaned = code.toLowerCase().trim()

  if (!validateCountryCode(cleaned)) {
    return ''
  }

  const validCodes: readonly string[] = VALID_COUNTRY_CODES
  if (!validCodes.includes(cleaned)) {
    return ''
  }

  return cleaned
}

/**
 * Valide un rating (doit être entre 0 et 100)
 */
export function sanitizeRating(rating: number): number {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return 85 // Valeur par défaut
  }

  // Limiter entre 0 et 100
  return Math.max(0, Math.min(100, Math.floor(rating)))
}

/**
 * Valide un objet stats complet
 */
export function sanitizeStats(stats: Record<string, unknown>): {
  force: number
  rapidite: number
  grappling: number
  endurance: number
  striking: number
  equilibre: number
} {
  const getStatValue = (value: unknown, defaultValue: number): number => {
    if (typeof value === 'number') {
      return value
    }
    return defaultValue
  }

  return {
    force: sanitizeRating(getStatValue(stats?.force, 90)),
    rapidite: sanitizeRating(getStatValue(stats?.rapidite, 85)),
    grappling: sanitizeRating(getStatValue(stats?.grappling, 88)),
    endurance: sanitizeRating(getStatValue(stats?.endurance, 80)),
    striking: sanitizeRating(getStatValue(stats?.striking, 82)),
    equilibre: sanitizeRating(getStatValue(stats?.equilibre, 87)),
  }
}
