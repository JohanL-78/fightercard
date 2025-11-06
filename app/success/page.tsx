'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Download, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  // Gérer à la fois order_id (singulier) et order_ids (pluriel pour compatibilité)
  const orderIdsParam = searchParams.get('order_ids')
  const orderIdParam = searchParams.get('order_id')
  // Prendre le premier ID si c'est une liste, sinon prendre l'ID unique
  const orderId = orderIdsParam ? orderIdsParam.split(',')[0] : orderIdParam

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState(false)

  console.log('🔍 Page success - orderIdsParam:', orderIdsParam, 'orderId extrait:', orderId)

  const handleDownload = async () => {
    if (!orderId) {
      setError('ID de commande manquant')
      return
    }

    console.log('🔍 Début du téléchargement pour order:', orderId)
    setLoading(true)
    setError(null)

    try {
      const url = `/api/orders/${orderId}/download`
      console.log('📡 Fetch URL:', url)

      const response = await fetch(url)
      console.log('📥 Response status:', response.status)
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        // Si c'est une erreur JSON, la parser
        const contentType = response.headers.get('content-type')
        console.log('❌ Erreur - Content-Type:', contentType)

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          console.log('❌ Erreur JSON:', data)
          throw new Error(data.error || 'Erreur lors de la récupération du lien')
        }
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`)
      }

      // L'API retourne directement le fichier image
      const blob = await response.blob()
      console.log('📦 Blob reçu - taille:', blob.size, 'type:', blob.type)

      // Vérifier que le blob est valide
      if (blob.size === 0) {
        throw new Error('Fichier vide reçu')
      }

      const blobUrl = window.URL.createObjectURL(blob)
      console.log('🔗 Blob URL créée:', blobUrl)

      // Démarrer le téléchargement automatiquement
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `fight-card-${orderId}.png`
      link.style.display = 'none'
      document.body.appendChild(link)

      console.log('👆 Clic sur le lien de téléchargement')
      link.click()

      // Nettoyer après un délai
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
        console.log('🧹 Nettoyage effectué')
      }, 1000)

      setDownloaded(true)
      console.log('✅ Téléchargement réussi')

    } catch (err) {
      console.error('❌ Erreur téléchargement:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="text-green-500" size={80} />
        </div>

        <h1 className="text-3xl font-bold text-white">Paiement réussi !</h1>

        <p className="text-gray-300">
          Votre carte personnalisée a été commandée avec succès.
        </p>

        <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
          <p className="text-green-300 font-semibold">
            ✓ Paiement validé
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Téléchargez dès maintenant la version provisoire de votre carte (haute définition).
            La version finale retouchée vous sera envoyée ensuite.
          </p>
        </div>

        {/* Bouton de téléchargement */}
        <div className="space-y-3">
          {!downloaded ? (
            <button
              onClick={handleDownload}
              disabled={loading || !orderId}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Génération du lien...
                </>
              ) : (
                <>
                  <Download size={24} />
                  Télécharger la version provisoire
                </>
              )}
            </button>
          ) : (
            <div className="bg-gray-700 rounded-lg p-4 space-y-2">
              <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                Téléchargement lancé !
              </p>
              <p className="text-xs text-gray-400">
                Si le téléchargement n&apos;a pas démarré, cliquez ci-dessous
              </p>
            <button
              onClick={handleDownload}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
                Télécharger à nouveau la version provisoire
            </button>
          </div>
          )}

          <p className="text-xs text-gray-500">
            Cette version est générée automatiquement. Notre équipe ajustera votre design final
            avant envoi de la version premium.
          </p>

          {error && (
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle size={20} />
                <span className="font-semibold">Erreur</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">{error}</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-700 space-y-3">
          <Link
            href="/"
            className="block w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors text-center"
          >
            Créer une nouvelle carte
          </Link>
        </div>

        {orderId && (
          <p className="text-xs text-gray-300">
            ID de commande : {orderId.slice(0, 8)}...
          </p>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="text-blue-500 animate-spin" size={80} />
          </div>
          <h1 className="text-3xl font-bold text-white">Chargement...</h1>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}
