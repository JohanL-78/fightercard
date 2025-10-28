// 🔒 Système de rate limiting pour protéger les endpoints API
// Limite le nombre de requêtes par IP pour éviter les abus

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // Fenêtre de temps en ms (ex: 60000 = 1 minute)
  uniqueTokenPerInterval: number // Nombre de requêtes max dans cette fenêtre
}

// Stockage en mémoire des requêtes par IP
// Note: En production, utilisez Redis ou une base de données
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (request: NextRequest, limit: number = config.uniqueTokenPerInterval): {
      success: boolean
      remaining: number
      reset: number
    } => {
      // Récupérer l'IP du client
      // @ts-expect-error - NextRequest.ip existe en runtime mais pas dans les types
      const ip = (request.ip as string | undefined) ||
                 request.headers.get('x-forwarded-for')?.split(',')[0] ||
                 request.headers.get('x-real-ip') ||
                 'unknown'

      const now = Date.now()
      const requestData = requestCounts.get(ip)

      // Si pas de données ou fenêtre expirée, réinitialiser
      if (!requestData || now > requestData.resetTime) {
        const resetTime = now + config.interval
        requestCounts.set(ip, { count: 1, resetTime })

        // Nettoyer les anciennes entrées pour éviter la fuite de mémoire
        cleanupOldEntries(now)

        return {
          success: true,
          remaining: limit - 1,
          reset: resetTime,
        }
      }

      // Incrémenter le compteur
      requestData.count++

      // Vérifier si la limite est dépassée
      if (requestData.count > limit) {
        return {
          success: false,
          remaining: 0,
          reset: requestData.resetTime,
        }
      }

      return {
        success: true,
        remaining: limit - requestData.count,
        reset: requestData.resetTime,
      }
    },
  }
}

// Nettoyer les entrées expirées pour éviter la fuite de mémoire
function cleanupOldEntries(now: number) {
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip)
    }
  }
}

// Helper pour créer une réponse d'erreur 429 (Too Many Requests)
export function rateLimitResponse(reset: number): NextResponse {
  const resetDate = new Date(reset)
  return NextResponse.json(
    {
      error: 'Trop de requêtes. Veuillez réessayer plus tard.',
      retryAfter: Math.ceil((reset - Date.now()) / 1000),
    },
    {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        'X-RateLimit-Reset': resetDate.toISOString(),
      },
    }
  )
}

// Configurations prédéfinies
export const rateLimiters = {
  // 3 requêtes par minute pour les uploads
  upload: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 3,
  }),

  // 2 requêtes par minute pour le remove-bg (API payante - Pixian)
  removeBg: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 2,
  }),

  // 5 requêtes par minute pour les opérations sensibles
  strict: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 5,
  }),
}
