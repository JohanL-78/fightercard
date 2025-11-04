'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les cookies
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Afficher le banner après 1 seconde (meilleure UX)
      setTimeout(() => setShow(true), 1000)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Banner */}
      <div className="relative bg-gray-900 border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Texte */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🍪</span>
                <div>
                  <h3 className="text-white font-bold mb-1">Cookies et confidentialité</h3>
                  <p className="text-sm text-gray-300">
                    Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du site (authentification admin, paiement sécurisé).
                    Aucun cookie de traçage ou publicitaire.{' '}
                    <Link href="/privacy" className="text-blue-400 hover:underline font-semibold">
                      En savoir plus
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton */}
            <button
              onClick={accept}
              className="btn-primary px-8 py-3 whitespace-nowrap shadow-lg hover:shadow-xl transition-all"
            >
              J&apos;accepte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
