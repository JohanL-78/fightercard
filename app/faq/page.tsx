'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import SmoothReveal from '@/components/SmoothReveal'

export default function FAQ() {
  const [contactEmail, setContactEmail] = useState('fightercard@example.com')

  useEffect(() => {
    // Charger l'email de contact depuis l'API
    fetch('/api/settings/contact-email')
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          setContactEmail(data.email)
        }
      })
      .catch(err => console.error('Erreur chargement email:', err))
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 animate-slide-in hover:opacity-80 transition-opacity">
            <div className="relative">
              <Image
                src="/logoN-2-2.png"
                alt="MyFightCard Logo"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-blue-500">
                Fighter Card
              </h1>
              <p className="text-xs text-gray-400 font-medium">Cartes de Combat Personnalisées</p>
            </div>
          </Link>
          <Link
            href="/"
            className="btn-outline text-sm px-5 py-2.5"
          >
            Retour
          </Link>
        </div>
      </header>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-12 bg-[#0a0a0a] min-h-[calc(100vh-100px)]">
        <div className="max-w-7xl mx-auto">
          <SmoothReveal direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full mb-6">
                <span className="text-sm font-bold text-blue-400 tracking-wide uppercase">Simple et Rapide</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                Comment ça <span className="text-blue-500">Marche ?</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Crée ta carte personnalisée en 3 étapes simples
              </p>
            </div>
          </SmoothReveal>

          <SmoothReveal direction="up" delay={0.2}>
            <div className="grid md:grid-cols-3 gap-8 mb-16 px-4">
              {/* Step 1 */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative premium-card p-4 sm:p-6 md:p-8 text-center overflow-hidden">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-50"></div>
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl sm:text-4xl font-black text-white">1</span>
                    </div>
                  </div>
                  <h2 className="text-lg sm:text-lg md:text-xl font-bold mb-4 break-words px-2">Choisis un Template</h2>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed break-words px-2">
                    Sélectionne parmi nos templates professionnels conçus pour les combattants
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative premium-card p-4 sm:p-6 md:p-8 text-center overflow-hidden">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-50"></div>
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl sm:text-4xl font-black text-white">2</span>
                    </div>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 break-words px-2">Personnalise</h2>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed break-words px-2">
                    Ajoute ta photo, nom, statistiques et crée une carte unique à ton image
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-red-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative premium-card p-4 sm:p-6 md:p-8 text-center overflow-hidden">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-50"></div>
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl sm:text-4xl font-black text-white">3</span>
                    </div>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 break-words px-2">Télécharge en HD</h2>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed break-words px-2">
                    Paie 15€ et télécharge immédiatement une version provisoire HD (2480×3508px, 300 DPI).
                    Notre équipe retouche ensuite ta carte finale et te l&apos;envoie (ainsi qu&apos;une impression).
                  </p>
                </div>
              </div>
            </div>
          </SmoothReveal>

          {/* Features */}
          <SmoothReveal direction="up" delay={0.3}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-blue-600/30 transition-colors">
                <div className="h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Upload Photo</h3>
                  <p className="text-sm text-gray-300">Ajoute ta meilleure photo de combat</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-blue-600/30 transition-colors">
                <div className="h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Stats Personnalisées</h3>
                  <p className="text-sm text-gray-300">Force, rapidité, endurance, etc.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-blue-600/30 transition-colors">
                <div className="h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Design Pro</h3>
                  <p className="text-sm text-gray-300">Templates créés par des designers</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-red-600/30 transition-colors">
                <div className="h-12 w-12 bg-red-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Qualité HD</h3>
                  <p className="text-sm text-gray-300">2480×3508px à 300 DPI pour impression A4</p>
                </div>
              </div>
            </div>
          </SmoothReveal>

          {/* FAQ Questions */}
          <SmoothReveal direction="up" delay={0.4}>
            <div className="max-w-4xl mx-auto space-y-4 mb-16 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                Questions <span className="text-blue-500">Fréquentes</span>
              </h2>

              {/* Question 1 - Photo */}
              <div className="premium-card p-4 sm:p-6 overflow-hidden">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-white flex flex-col sm:flex-row items-start gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="break-words w-full">Quel type de photo dois-je utiliser ?</span>
                </h3>
                <div className="text-gray-300 space-y-3">
                  <p><strong className="text-white">Pour un résultat optimal :</strong></p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span><strong className="text-blue-400">Photo sur fond transparent (PNG)</strong> - C&apos;est l&apos;idéal !</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Haute résolution (minimum 1000x1000 pixels)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Photo de bonne qualité, bien éclairée</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Position de combat ou pose dynamique</span>
                    </li>
                  </ul>
                  <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4 mt-4">
                    <p className="text-sm text-yellow-300">
                      <strong>⚠️ Important :</strong> L&apos;outil de suppression automatique du fond dans l&apos;éditeur est un <strong>aperçu rapide</strong>.
                      Ta carte finale sera traitée <strong>professionnellement</strong> par notre équipe pour un fond parfaitement retiré.
                    </p>
                  </div>
                </div>
              </div>

              {/* Question 2 - Délai */}
              <div className="premium-card p-4 sm:p-6 overflow-hidden">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-white flex flex-col sm:flex-row items-start gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words w-full">Quand vais-je recevoir ma carte ?</span>
                </h3>
                <div className="text-gray-300 space-y-3">
                  <p>
                    <strong className="text-blue-400">Téléchargement numérique :</strong> Votre carte HD (2480×3508px, 300 DPI) est disponible <strong className="text-white">immédiatement après le paiement</strong> sur la page de confirmation.
                  </p>
                  <p>
                    <strong className="text-blue-400">Carte physique imprimée :</strong> Votre carte sera imprimée en haute qualité et expédiée à l&apos;adresse de livraison fournie lors du paiement. Délai : <strong className="text-white">5 à 10 jours ouvrés</strong>.
                  </p>
                </div>
              </div>

              {/* Question 3 - Format */}
              <div className="premium-card p-4 sm:p-6 overflow-hidden">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-white flex flex-col sm:flex-row items-start gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="break-words w-full">Que vais-je recevoir exactement ?</span>
                </h3>
                <div className="text-gray-300 space-y-2">
                  <p>
                    <strong className="text-blue-400">Version numérique :</strong> Un fichier PNG haute définition de 2480×3508 pixels à 300 DPI,
                    parfait pour l&apos;impression ou une utilisation numérique (réseaux sociaux, site web, merchandising, etc.).
                  </p>
                  <p>
                    <strong className="text-blue-400">Carte physique :</strong> Une carte imprimée en haute qualité au format A4, livrée à votre adresse.
                  </p>
                </div>
              </div>

              {/* Question 4 - Modification */}
              <div className="premium-card p-4 sm:p-6 overflow-hidden">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-white flex flex-col sm:flex-row items-start gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="break-words w-full">Puis-je demander des modifications ?</span>
                </h3>
                <p className="text-gray-300">
                  Oui ! Si tu n&apos;est pas satisfait du résultat, contacte-nous par email avec ton numéro de commande.
                  Nous proposons <strong className="text-blue-400">une révision gratuite</strong> pour les ajustements mineurs.
                </p>
              </div>

              {/* Question 5 - Utilisation */}
              <div className="premium-card p-4 sm:p-6 overflow-hidden">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-white flex flex-col sm:flex-row items-start gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="break-words w-full">Puis-je utiliser ma carte commercialement ?</span>
                </h3>
                <p className="text-gray-300">
                  Oui, une fois achetée, la carte est <strong className="text-blue-400">entièrement la vôtre</strong>.
                  Tu peux l&apos;utiliser librement sur tes réseaux sociaux, site web, supports promotionnels, merchandising, etc.
                </p>
              </div>
            </div>
          </SmoothReveal>

          {/* Call to Action */}
          <SmoothReveal direction="up" delay={0.5}>
            <div className="text-center">
              <Link href="/#templates" className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-2">
                Commence maintenant
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </SmoothReveal>

          {/* Contact Section */}
          <SmoothReveal direction="up" delay={0.6}>
            <div className="mt-16 text-center">
              <div className="premium-card p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">
                  Besoin d&apos;aide ?
                </h3>
                <p className="text-gray-300 mb-4">
                  Notre équipe est là pour t&apos;aider. Contacte-nous pour toute question ou demande personnalisée.
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-lg font-semibold"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contactEmail}
                </a>
              </div>
            </div>
          </SmoothReveal>
        </div>
      </section>
    </main>
  )
}
