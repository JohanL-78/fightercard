'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Legal() {
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
            Mentions <span className="text-blue-500">Légales</span>
          </h1>
          <p className="text-sm text-gray-400 mb-12">
            Informations légales obligatoires
          </p>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="premium-card p-8 bg-blue-600/10 border border-blue-600/30">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Éditeur du site</h2>
              <div className="text-gray-300 space-y-2">
                <p><strong>Raison sociale :</strong> [NOM DE L&apos;ENTREPRISE]</p>
                <p><strong>Forme juridique :</strong> [Auto-entrepreneur / SARL / SAS / etc.]</p>
                <p><strong>SIRET :</strong> [NUMÉRO SIRET]</p>
                <p><strong>Adresse :</strong> [ADRESSE COMPLÈTE]</p>
                <p><strong>Email :</strong> <a href="mailto:CONTACT@EMAIL.COM" className="text-blue-400 hover:underline">CONTACT@EMAIL.COM</a></p>
                <p><strong>Téléphone :</strong> [TÉLÉPHONE] (optionnel)</p>

                <div className="mt-6 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    ⚠️ <strong>À compléter</strong> avec vos informations réelles pendant la session de configuration
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Directeur de publication</h2>
              <p className="text-gray-300">
                <strong>[NOM PRÉNOM du dirigeant]</strong>
              </p>
            </div>

            {/* Section 3 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Hébergement</h2>
              <div className="text-gray-300 space-y-2">
                <p><strong>Hébergeur du site web :</strong></p>
                <p className="ml-4">
                  <strong>Vercel Inc.</strong><br />
                  340 S Lemon Ave #4133<br />
                  Walnut, CA 91789, USA<br />
                  Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">vercel.com</a>
                </p>

                <p className="mt-4"><strong>Hébergeur de la base de données :</strong></p>
                <p className="ml-4">
                  <strong>Supabase Inc.</strong><br />
                  970 Toa Payoh North #07-04<br />
                  Singapore 318992<br />
                  Site : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">supabase.com</a>
                </p>

                <p className="mt-4"><strong>Hébergeur des images :</strong></p>
                <p className="ml-4">
                  <strong>Cloudinary Ltd.</strong><br />
                  111 W Evelyn Ave, Suite 206<br />
                  Sunnyvale, CA 94086, USA<br />
                  Site : <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">cloudinary.com</a>
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Propriété intellectuelle</h2>
              <p className="text-gray-300 mb-4">
                L&apos;ensemble du contenu de ce site (textes, images, design, code source, logo) est protégé par le droit d&apos;auteur et la propriété intellectuelle.
              </p>
              <p className="text-gray-300 mb-4">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
              </p>
              <p className="text-gray-300">
                Toute exploitation non autorisée du site ou de l&apos;un quelconque des éléments qu&apos;il contient sera considérée comme constitutive d&apos;une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
              </p>
            </div>

            {/* Section 5 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Données personnelles</h2>
              <p className="text-gray-300">
                Pour toute information concernant la collecte et le traitement de vos données personnelles, veuillez consulter notre{' '}
                <Link href="/privacy" className="text-blue-400 hover:underline font-semibold">
                  Politique de Confidentialité
                </Link>.
              </p>
            </div>

            {/* Section 6 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Cookies</h2>
              <p className="text-gray-300">
                Ce site utilise uniquement des cookies techniques nécessaires à son bon fonctionnement (authentification admin, paiement sécurisé). Aucun cookie de traçage ou publicitaire n&apos;est utilisé.
              </p>
              <p className="text-gray-300 mt-4">
                Pour plus d&apos;informations, consultez notre{' '}
                <Link href="/privacy" className="text-blue-400 hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
            </div>

            {/* Section 7 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Crédits</h2>
              <div className="text-gray-300 space-y-2">
                <p><strong>Conception et développement :</strong> Application Next.js 15</p>
                <p><strong>Technologies utilisées :</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Next.js 15 (Framework React)</li>
                  <li>• Stripe (Paiements sécurisés)</li>
                  <li>• Supabase (Base de données)</li>
                  <li>• Cloudinary (Stockage images)</li>
                  <li>• Vercel (Hébergement)</li>
                </ul>
              </div>
            </div>

            {/* Section 8 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Limitation de responsabilité</h2>
              <p className="text-gray-300 mb-4">
                Le propriétaire du site ne saurait être tenu responsable des erreurs, d&apos;une absence de disponibilité des informations et/ou de la présence de virus sur son site.
              </p>
              <p className="text-gray-300">
                Les informations fournies le sont à titre indicatif. Le propriétaire du site se réserve le droit de modifier le contenu du site à tout moment sans préavis.
              </p>
            </div>

            {/* Section 9 */}
            <div className="premium-card p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Droit applicable</h2>
              <p className="text-gray-300">
                Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d&apos;accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
              </p>
            </div>

            {/* Contact */}
            <div className="premium-card p-8 bg-blue-600/10 border border-blue-600/30">
              <h2 className="text-3xl font-bold mb-4 text-blue-500">Contact</h2>
              <p className="text-gray-300 mb-4">
                Pour toute question ou demande concernant le site :
              </p>
              <p className="text-white text-lg">
                Email : <a href="mailto:CONTACT@EMAIL.COM" className="text-blue-400 hover:underline">CONTACT@EMAIL.COM</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
