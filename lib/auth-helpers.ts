// 🔒 Utilitaires d'authentification pour protéger les routes admin

import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'
)

/**
 * Vérifie si une requête contient un JWT valide
 * @param request - La requête Next.js
 * @returns true si authentifié, false sinon
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get('admin-auth-token')?.value

    if (!token) {
      return false
    }

    // Vérifier le JWT
    await jwtVerify(token, SECRET_KEY)
    return true
  } catch (error) {
    // Token invalide ou expiré
    return false
  }
}

/**
 * Vérifie l'authentification et throw une erreur si non authentifié
 * Utiliser dans les API routes
 */
export async function requireAuth(request: NextRequest): Promise<void> {
  const authenticated = await isAuthenticated(request)

  if (!authenticated) {
    throw new Error('Unauthorized')
  }
}
