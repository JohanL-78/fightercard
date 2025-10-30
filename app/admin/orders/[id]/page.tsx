'use client'

import React, { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CardEditor from '@/components/CardEditor'
import type { CardCustomization, CardTemplate } from '@/lib/types'

// Templates hardcodés (même que dans page.tsx)
const DEFAULT_TEMPLATES: CardTemplate[] = [
  {
    id: 'ufc',
    name: 'UFC Style',
    imageUrl: '/dark.png',
    category: 'mma',
    color: '#10B981',
    positions: {
      photo: { x: 45, y: 36, width: 280, height: 305 },
      username: { x: 180, y: 35, fontSize: 16 },
      rating: { x: 15, y: 75, fontSize: 32 },
      sport: { x: 33, y: 105, fontSize: 14 },
      name: { x: 180, y: 350, fontSize: 28 },
      flag: { x: 33, y: 135, width: 40, height: 30 },
      stats: { x: 180, y: 390, fontSize: 18, labelFontSize: 13, rowSpacing: 28, columnWidth: 120 },
    },
  },
  {
    id: 'boxing',
    name: 'Boxing Ring',
    imageUrl: '/octotun.png',
    category: 'boxing',
    color: '#EF4444',
    positions: {
      photo: { x: 45, y: 36, width: 280, height: 300 },
      username: { x: 180, y: 35, fontSize: 16 },
      rating: { x: 15, y: 75, fontSize: 32 },
      sport: { x: 33, y: 105, fontSize: 14 },
      name: { x: 180, y: 350, fontSize: 28 },
      flag: { x: 33, y: 135, width: 40, height: 30 },
      stats: { x: 180, y: 390, fontSize: 18, labelFontSize: 13, rowSpacing: 28, columnWidth: 120 },
    },
  },
  {
    id: 'space',
    name: 'Space Fighter',
    imageUrl: '/3dback.png',
    category: 'other',
    color: '#7adeff',
    positions: {
      photo: { x: 45, y: 36, width: 280, height: 300 },
      username: { x: 180, y: 35, fontSize: 16 },
      rating: { x: 15, y: 75, fontSize: 32 },
      sport: { x: 33, y: 105, fontSize: 14 },
      name: { x: 180, y: 350, fontSize: 28 },
      flag: { x: 33, y: 135, width: 40, height: 30 },
      stats: { x: 180, y: 390, fontSize: 18, labelFontSize: 13, rowSpacing: 28, columnWidth: 120 },
    },
  },
  {
    id: 'laser',
    name: 'Laser',
    imageUrl: '/laser.png',
    category: 'other',
    color: '#8B5CF6',
    positions: {
      photo: { x: 45, y: 36, width: 280, height: 300 },
      username: { x: 180, y: 35, fontSize: 16 },
      rating: { x: 15, y: 75, fontSize: 32 },
      sport: { x: 33, y: 105, fontSize: 14 },
      name: { x: 180, y: 350, fontSize: 28 },
      flag: { x: 33, y: 135, width: 40, height: 30 },
      stats: { x: 180, y: 390, fontSize: 18, labelFontSize: 13, rowSpacing: 28, columnWidth: 120 },
    },
  },
]

interface OrderData {
  id: string
  customer_email: string
  fighter_photo_url: string
  final_image_url?: string
  customization: CardCustomization
  status: string
}

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params) // Unwrap params promise pour Next.js 15

  const [order, setOrder] = useState<OrderData | null>(null)
  const [template, setTemplate] = useState<CardTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [customization, setCustomization] = useState<CardCustomization | null>(null)

  const loadOrder = useCallback(async () => {
    setLoading(true)
    try {
      // Charger les détails de la commande
      const response = await fetch(`/api/admin/orders/${id}`)

      if (!response.ok) {
        throw new Error('Failed to load order')
      }

      const { order: data } = await response.json()
      setOrder(data)

      // Trouver le template dans les templates hardcodés
      const foundTemplate = DEFAULT_TEMPLATES.find(t => t.id === data.customization.templateId)
      if (foundTemplate) {
        setTemplate(foundTemplate)
      } else {
        console.warn('Template not found:', data.customization.templateId)
        // Utiliser le premier template par défaut
        setTemplate(DEFAULT_TEMPLATES[0])
      }

      setCustomization(data.customization)

    } catch (error) {
      console.error('Load error:', error)
      alert('Erreur chargement commande')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    loadOrder()
  }, [loadOrder])

  const handleSaveCard = async (imageUrl: string, customization: CardCustomization) => {
    try {
      // Sauvegarder la carte finale générée par l'admin
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          final_image_url: imageUrl,
          customization,
          status: 'processing'
        })
      })

      if (!response.ok) {
        throw new Error('Erreur sauvegarde')
      }

      alert('Carte finale sauvegardée! ✅')
      loadOrder() // Recharger pour voir les modifications

    } catch (error) {
      console.error('Save error:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  if (!order || !template || !customization) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Commande introuvable</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-400 hover:text-white mb-2"
            >
              ← Retour
            </button>
            <h1 className="text-3xl font-bold text-white">
              Commande #{order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-400">{order.customer_email}</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">Statut</div>
            <div className="text-lg font-semibold text-white">
              {order.status}
            </div>
          </div>
        </div>

        {/* Section Photo Originale */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">📸 Photo Originale du User</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={order.fighter_photo_url}
                alt="Photo originale"
                className="w-full rounded-lg border-2 border-gray-700"
              />
            </div>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Instructions</h3>
                <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                  <li>Télécharger la photo originale ci-contre</li>
                  <li>Traiter la photo (retirer le fond avec Canva/Remove.bg)</li>
                  <li>Uploader la photo traitée dans l&apos;éditeur ci-dessous</li>
                  <li>Ajuster les paramètres si nécessaire</li>
                  <li>Générer la carte finale HD</li>
                </ol>
              </div>

              <a
                href={order.fighter_photo_url}
                download={`fighter-${order.id}.jpg`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-center transition font-medium"
              >
                ⬇️ Télécharger Photo Originale
              </a>
            </div>
          </div>
        </div>

        {/* Section CardEditor */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            🎨 Éditeur de Carte (Générer la Carte Finale)
          </h2>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              💡 <strong>Astuce:</strong> Uploadez la photo traitée (sans fond) dans l&apos;éditeur ci-dessous.
              Tous les paramètres du user sont déjà pré-remplis. Vous pouvez les ajuster avant de générer la carte finale.
            </p>
          </div>

          <CardEditor
            template={template}
            onSave={handleSaveCard}
          />
        </div>

        {/* Carte finale si générée */}
        {order.final_image_url && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-300 mb-4">
              ✅ Carte Finale Générée
            </h2>
            <img
              src={order.final_image_url}
              alt="Carte finale"
              className="max-w-md mx-auto rounded-lg"
            />
            <div className="text-center mt-4">
              <a
                href={order.final_image_url}
                download={`card-${order.id}.png`}
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
              >
                ⬇️ Télécharger Carte Finale
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
