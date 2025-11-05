import { NextRequest, NextResponse } from 'next/server'
import { VALID_COUNTRY_CODES, sanitizeCountryCode } from '@/lib/sanitize'

/**
 * 🔒 API pour valider et obtenir l'URL d'un drapeau de manière sécurisée
 * Évite les injections d'URL malveillantes côté client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || code === '') {
      return NextResponse.json({
        success: true,
        flagUrl: '',
        countryCode: ''
      })
    }

    // 🔒 ÉTAPE 1: Sanitisation du code pays
    const sanitizedCode = sanitizeCountryCode(code)

    if (!sanitizedCode) {
      return NextResponse.json(
        { error: 'Code pays invalide' },
        { status: 400 }
      )
    }

    // 🔒 ÉTAPE 2: Vérifier que le code est dans la whitelist
    const validCodes: readonly string[] = VALID_COUNTRY_CODES
    if (!validCodes.includes(sanitizedCode)) {
      return NextResponse.json(
        { error: `Code pays non autorisé: ${sanitizedCode}` },
        { status: 400 }
      )
    }

    // 🔒 ÉTAPE 3: Construire l'URL de manière sécurisée
    const flagUrl = `https://flagcdn.com/w320/${sanitizedCode}.png`

    return NextResponse.json({
      success: true,
      flagUrl,
      countryCode: sanitizedCode
    })
  } catch (error) {
    console.error('Error in validate-flag route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
