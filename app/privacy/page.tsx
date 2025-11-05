'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 animate-slide-in hover:opacity-80 transition-opacity">
            <div className="relative">
              <Image
                src="/logoN.avif"
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
          <Link href="/" className="btn-outline text-sm px-5 py-2.5">
            Retour
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="py-20 px-6 md:px-12 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Politique de <span className="text-blue-500">Confidentialité</span>
          </h1>
          <p className="text-sm text-gray-400 mb-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="premium-card p-8 bg-blue-600/10 border border-blue-600/30">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">1. Qui sommes-nous ?</h2>
              <div className="text-gray-300 space-y-2">
                <p><strong>[NOM DE VOTRE ENTREPRISE]</strong></p>
                <p>[VOTRE ADRESSE]</p>
                <p>Email : <a href="mailto:CONTACT@EMAIL.COM" className="text-blue-400 hover:underline font-semibold">CONTACT@EMAIL.COM</a></p>

                <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    ⚠️ <strong>À compléter</strong> avec vos informations pendant la session de configuration
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">2. Quelles données collectons-nous ?</h2>
              <p className="text-gray-300 mb-4">Lors de votre commande, nous collectons uniquement :</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Votre email</strong> - Pour vous envoyer votre carte et communiquer sur votre commande</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Votre nom et prénom</strong> - Pour personnaliser votre carte</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Votre adresse de livraison</strong> - Pour vous envoyer la carte physique</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Votre photo</strong> - Pour créer votre carte personnalisée</span>
                </li>
              </ul>
              <p className="text-gray-300 mt-4 text-sm">
                💳 <strong>Paiement :</strong> Vos informations bancaires sont traitées directement et en toute sécurité par Stripe.
                Nous ne voyons jamais et ne stockons jamais vos données de carte bancaire.
              </p>
            </div>

            {/* Section 3 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">3. Pourquoi collectons-nous ces données ?</h2>
              <p className="text-gray-300 mb-4">Vos données sont utilisées uniquement pour :</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Traiter votre commande</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Créer votre carte personnalisée</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Vous envoyer votre carte par email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Livrer la carte physique à votre adresse</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Assurer le service après-vente si besoin</span>
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                <strong>Aucune utilisation commerciale.</strong> Nous ne vendons pas vos données et ne vous envoyons pas de publicité.
              </p>
            </div>

            {/* Section 4 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">4. Combien de temps conservons-nous vos données ?</h2>
              <div className="text-gray-300 space-y-3">
                <p>
                  <strong>Données de commande</strong> (email, nom, adresse) : <span className="text-blue-400 font-semibold">3 ans</span>
                  <br />
                  <span className="text-sm text-gray-400">Obligatoire pour la comptabilité et la TVA</span>
                </p>
                <p>
                  <strong>Votre photo</strong> : <span className="text-blue-400 font-semibold">Supprimée après livraison</span>
                  <br />
                  <span className="text-sm text-gray-400">(Sauf si vous nous demandez de la conserver pour une future commande)</span>
                </p>
              </div>
            </div>

            {/* Section 5 - VOS DROITS */}
            <div className="premium-card p-8 bg-blue-600/10 border border-blue-600/30">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">5. Vos droits (RGPD)</h2>
              <p className="text-gray-300 mb-4">
                Conformément au Règlement Général sur la Protection des Données, vous avez le droit de :
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">📋</span>
                  <div>
                    <strong>Accéder à vos données</strong>
                    <br />
                    <span className="text-sm text-gray-400">Demander une copie de toutes vos informations</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">✏️</span>
                  <div>
                    <strong>Rectifier vos données</strong>
                    <br />
                    <span className="text-sm text-gray-400">Corriger une information incorrecte</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">🗑️</span>
                  <div>
                    <strong>Supprimer vos données</strong>
                    <br />
                    <span className="text-sm text-gray-400">Effacer vos informations (sauf obligations légales de 3 ans)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">📦</span>
                  <div>
                    <strong>Récupérer vos données</strong>
                    <br />
                    <span className="text-sm text-gray-400">Recevoir vos informations dans un format utilisable</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">🚫</span>
                  <div>
                    <strong>Vous opposer au traitement</strong>
                    <br />
                    <span className="text-sm text-gray-400">Refuser l&apos;utilisation de vos données</span>
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-6 bg-blue-600/20 rounded-xl">
                <p className="text-white font-bold text-lg mb-2">📧 Comment exercer vos droits ?</p>
                <p className="text-gray-300">
                  Envoyez-nous simplement un email à :{' '}
                  <a href="mailto:CONTACT@EMAIL.COM" className="text-blue-400 hover:underline font-semibold text-lg">
                    CONTACT@EMAIL.COM
                  </a>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Nous répondrons sous 1 mois maximum (obligation légale)
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">6. Sécurité de vos données</h2>
              <p className="text-gray-300 mb-4">Nous protégeons vos données avec :</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span><strong>Chiffrement HTTPS</strong> - Toutes les communications sont cryptées</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span><strong>Hébergement sécurisé</strong> - Serveurs professionnels certifiés</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span><strong>Accès restreint</strong> - Seul l&apos;administrateur peut voir vos données</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500">✓</span>
                  <span><strong>Paiement sécurisé</strong> - Stripe (certifié PCI-DSS, le plus haut standard de sécurité)</span>
                </li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">7. Cookies</h2>
              <p className="text-gray-300 mb-4">
                Ce site utilise uniquement des <strong>cookies techniques</strong> nécessaires au bon fonctionnement :
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Cookie d&apos;authentification admin (si vous êtes administrateur)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Cookie de session Stripe (pour sécuriser le paiement)</span>
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                <strong>Aucun cookie de traçage, publicité ou statistiques.</strong> Nous ne suivons pas votre navigation.
              </p>
            </div>

            {/* Section 8 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">8. Réclamation</h2>
              <p className="text-gray-300 mb-4">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la CNIL (autorité française de protection des données) :
              </p>
              <div className="flex items-center gap-3 text-blue-400">
                <span className="text-2xl">🇫🇷</span>
                <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">
                  www.cnil.fr/fr/plaintes
                </a>
              </div>
            </div>

            {/* Contact final */}
            <div className="premium-card p-8 bg-blue-600/10 border border-blue-600/30">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">9. Nous contacter</h2>
              <p className="text-gray-300 mb-4">
                Une question sur vos données personnelles ?
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <a href="mailto:CONTACT@EMAIL.COM" className="text-blue-400 hover:underline font-semibold text-xl">
                  CONTACT@EMAIL.COM
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Nous répondons sous 48h maximum
              </p>
            </div>
          </div>

          {/* Note juridique */}
          <div className="mt-12 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              Cette politique de confidentialité est conforme au RGPD (Règlement UE 2016/679).
              <br />
              Pour plus d&apos;informations légales, consultez nos{' '}
              <Link href="/legal" className="text-blue-400 hover:underline">
                Mentions Légales
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
