// 🔒 Système de logging sécurisé avec anonymisation PII
// Conforme RGPD - Ne jamais logger de données personnelles en production

/**
 * Données personnelles identifiables (PII) à JAMAIS logger :
 * - Nom complet
 * - Email
 * - Téléphone
 * - Adresse postale
 * - Coordonnées bancaires
 * - IP (dans certaines juridictions)
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const ENABLE_DEBUG_LOGS = process.env.ENABLE_DEBUG_LOGS === 'true'

/**
 * Anonymise une chaîne en ne gardant que les premiers et derniers caractères
 */
function anonymizeString(str: string, keepChars: number = 2): string {
  if (!str || str.length <= keepChars * 2) {
    return '***'
  }
  return `${str.slice(0, keepChars)}***${str.slice(-keepChars)}`
}

/**
 * Anonymise un email
 * exemple@domain.com => ex***@do***.com
 */
function anonymizeEmail(email: string | null | undefined): string {
  if (!email) return '[no-email]'
  const [local, domain] = email.split('@')
  if (!domain) return '***@***'
  const [domainName, tld] = domain.split('.')
  return `${anonymizeString(local, 2)}@${anonymizeString(domainName, 2)}.${tld}`
}

/**
 * Anonymise une adresse
 */
function anonymizeAddress(address: unknown): string {
  if (!address || typeof address !== 'object') return '[no-address]'
  const addr = address as Record<string, unknown>
  const city = addr.city && typeof addr.city === 'string' ? anonymizeString(addr.city, 1) : '***'
  const country = (addr.country as string) || '**'
  const postalCode = addr.postal_code && typeof addr.postal_code === 'string' ? anonymizeString(addr.postal_code, 1) : '***'
  return `${city}, ${postalCode}, ${country}`
}

/**
 * Anonymise un nom
 */
function anonymizeName(name: string | null | undefined): string {
  if (!name) return '[no-name]'
  const parts = name.split(' ')
  if (parts.length === 1) {
    return anonymizeString(parts[0], 1)
  }
  // Première lettre du prénom + première lettre du nom
  return `${parts[0][0]}. ${parts[parts.length - 1][0]}.`
}

/**
 * Logger sécurisé pour les webhooks Stripe
 */
export const stripeLogger = {
  /**
   * Log une session de checkout complétée (SÉCURISÉ)
   */
  logCheckoutSession: (session: {
    id: string
    customer_details?: unknown
    shipping_details?: unknown
    metadata?: Record<string, unknown> | null
    amount_total?: number | null
  }) => {
    if (IS_PRODUCTION && !ENABLE_DEBUG_LOGS) {
      // En production, logs minimalistes
      console.log('✅ Checkout session completed', {
        sessionId: anonymizeString(session.id, 4),
        hasCustomer: !!session.customer_details,
        hasShipping: !!session.shipping_details,
        amountCents: session.amount_total,
      })
    } else {
      // En développement, logs détaillés mais ANONYMISÉS
      const customerDetails = session.customer_details as Record<string, unknown> | undefined
      const shippingDetails = session.shipping_details as Record<string, unknown> | undefined
      console.log('🎯 Checkout session completed (DEV)', {
        sessionId: session.id,
        customerEmail: anonymizeEmail(customerDetails?.email as string | undefined),
        customerName: anonymizeName(customerDetails?.name as string | undefined),
        shippingAddress: anonymizeAddress(shippingDetails?.address),
        orderId: session.metadata?.orderId,
        amount: session.amount_total,
      })
    }
  },

  /**
   * Log une erreur de webhook (SÉCURISÉ)
   */
  logWebhookError: (error: unknown, context?: string) => {
    const err = error as Record<string, unknown> | undefined
    console.error('❌ Webhook error', {
      context,
      errorType: err?.name || 'Unknown',
      // Ne jamais logger le message complet qui peut contenir des PII
      errorCode: err?.code || err?.statusCode,
    })
  },

  /**
   * Log une mise à jour de commande (SÉCURISÉ)
   */
  logOrderUpdate: (orderId: string, status: string) => {
    if (IS_PRODUCTION && !ENABLE_DEBUG_LOGS) {
      console.log('✅ Order updated', {
        orderIdPrefix: orderId.slice(0, 8),
        status,
      })
    } else {
      console.log('✅ Order updated (DEV)', {
        orderId,
        status,
      })
    }
  },
}

/**
 * Logger sécurisé pour les téléchargements
 */
export const downloadLogger = {
  /**
   * Log un téléchargement (SÉCURISÉ)
   */
  logDownload: (orderId: string, success: boolean) => {
    if (IS_PRODUCTION && !ENABLE_DEBUG_LOGS) {
      // Utiliser un hash au lieu de l'ID complet
      const orderHash = hashOrderId(orderId)
      console.log('📥 Download', {
        orderHash,
        success,
      })
    } else {
      console.log('📥 Download (DEV)', {
        orderId,
        success,
      })
    }
  },

  /**
   * Log une erreur de téléchargement (SÉCURISÉ)
   */
  logDownloadError: (orderId: string, errorType: string) => {
    if (IS_PRODUCTION && !ENABLE_DEBUG_LOGS) {
      const orderHash = hashOrderId(orderId)
      console.error('❌ Download failed', {
        orderHash,
        errorType,
      })
    } else {
      console.error('❌ Download failed (DEV)', {
        orderId,
        errorType,
      })
    }
  },
}

/**
 * Logger sécurisé pour l'admin
 */
export const adminLogger = {
  /**
   * Log une action admin (SÉCURISÉ)
   */
  logAdminAction: (action: string, details?: Record<string, unknown>) => {
    console.log('🔐 Admin action', {
      action,
      timestamp: new Date().toISOString(),
      // Ne jamais logger les détails en production
      ...(IS_PRODUCTION ? {} : { details }),
    })
  },
}

/**
 * Logger générique sécurisé
 */
export const secureLog = {
  info: (message: string, metadata?: Record<string, unknown>) => {
    if (IS_PRODUCTION && !ENABLE_DEBUG_LOGS) {
      console.log(message)
    } else {
      console.log(message, sanitizeMetadata(metadata))
    }
  },

  error: (message: string, error?: unknown, metadata?: Record<string, unknown>) => {
    const err = error as Record<string, unknown> | undefined
    console.error(message, {
      errorType: err?.name,
      errorCode: err?.code || err?.statusCode,
      ...(IS_PRODUCTION ? {} : sanitizeMetadata(metadata)),
    })
  },

  warn: (message: string, metadata?: Record<string, unknown>) => {
    console.warn(message, IS_PRODUCTION ? {} : sanitizeMetadata(metadata))
  },
}

/**
 * Hash simple d'un ID de commande pour les logs
 */
function hashOrderId(orderId: string): string {
  // Simple hash pour identifier une commande sans exposer l'ID complet
  let hash = 0
  for (let i = 0; i < orderId.length; i++) {
    const char = orderId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `order_${Math.abs(hash).toString(16)}`
}

/**
 * Sanitise les métadonnées en retirant les champs sensibles
 */
function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> {
  if (!metadata) return {}

  const sensitive = ['email', 'name', 'phone', 'address', 'password', 'token', 'secret', 'key']
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(metadata)) {
    // Vérifier si la clé contient un mot sensible
    const isSensitive = sensitive.some(s => key.toLowerCase().includes(s))

    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Helper pour activer temporairement les logs de debug
 * À utiliser uniquement en développement ou staging
 */
export function enableDebugLogs(enabled: boolean) {
  if (IS_PRODUCTION) {
    console.warn('⚠️ Cannot enable debug logs in production')
    return false
  }
  process.env.ENABLE_DEBUG_LOGS = enabled ? 'true' : 'false'
  return true
}

// Avertissement au démarrage en production
if (IS_PRODUCTION && ENABLE_DEBUG_LOGS) {
  console.warn('⚠️⚠️⚠️ DEBUG LOGS ARE ENABLED IN PRODUCTION - PII MAY BE LOGGED ⚠️⚠️⚠️')
}
