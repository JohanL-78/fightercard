'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Download, CheckCircle, Clock, Package } from 'lucide-react'
import type { Order, CardCustomization } from '@/lib/types'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'delivered'>('all')
  const [contactEmail, setContactEmail] = useState('')
  const [newContactEmail, setNewContactEmail] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [showEmailSettings, setShowEmailSettings] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'authentification côté serveur
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify')
        if (response.ok) {
          setIsAuthenticated(true)
          loadOrders()
          loadContactEmail()
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadContactEmail = async () => {
    try {
      const response = await fetch('/api/settings/contact-email')
      const data = await response.json()
      setContactEmail(data.email)
      setNewContactEmail(data.email)
    } catch (error) {
      console.error('Erreur chargement email:', error)
    }
  }

  const saveContactEmail = async () => {
    if (!newContactEmail || !newContactEmail.includes('@')) {
      alert('Email invalide')
      return
    }

    setSavingEmail(true)
    try {
      const response = await fetch('/api/settings/contact-email', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newContactEmail }),
      })

      if (response.ok) {
        setContactEmail(newContactEmail)
        alert('Email mis à jour avec succès !')
        setShowEmailSettings(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setSavingEmail(false)
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      // Utiliser l'API route sécurisée au lieu d'appeler Supabase directement
      const response = await fetch(`/api/admin/orders?filter=${filter}`)

      if (!response.ok) {
        throw new Error('Erreur lors du chargement')
      }

      const { orders: data } = await response.json()

      // Mapper les colonnes snake_case de la BDD vers camelCase
      interface OrderRow {
        id: string
        created_at: string
        customer_email: string
        customization: unknown
        final_image_url: string
        stripe_payment_id: string
        amount: number
        status: 'pending' | 'completed' | 'delivered'
        shipping_name: string
        shipping_address_line1: string
        shipping_address_line2: string | null
        shipping_city: string
        shipping_postal_code: string
        shipping_country: string
        tax_amount: number | null
        total_amount: number | null
      }
      const mappedOrders = (data || []).map((order: OrderRow) => ({
        id: order.id,
        createdAt: order.created_at,
        customerEmail: order.customer_email,
        customization: order.customization as CardCustomization,
        finalImageUrl: order.final_image_url,
        stripePaymentId: order.stripe_payment_id,
        amount: order.amount,
        status: order.status,
        // Adresse de livraison
        shippingName: order.shipping_name,
        shippingAddressLine1: order.shipping_address_line1,
        shippingAddressLine2: order.shipping_address_line2 ?? undefined,
        shippingCity: order.shipping_city,
        shippingPostalCode: order.shipping_postal_code,
        shippingCountry: order.shipping_country,
        // Montants
        taxAmount: order.tax_amount ?? undefined,
        totalAmount: order.total_amount ?? undefined,
      }))

      setOrders(mappedOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
      alert('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      // Utiliser l'API route sécurisée
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      // Recharger les commandes
      loadOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center text-gray-400">
          {loading ? 'Vérification de l\'authentification...' : 'Redirection...'}
        </div>
      </div>
    )
  }

  const statusConfig = {
    pending: { label: 'En attente', icon: Clock, color: 'text-yellow-500' },
    processing: { label: 'En traitement', icon: Package, color: 'text-orange-500' },
    completed: { label: 'Traitée', icon: CheckCircle, color: 'text-green-500' },
    delivered: { label: 'Livrée', icon: Package, color: 'text-blue-500' },
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Gestion des commandes</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEmailSettings(!showEmailSettings)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ⚙️ Paramètres
            </button>
            <button
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' })
                router.push('/admin/login')
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Section paramètres email */}
        {showEmailSettings && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Email de contact</h2>
            <p className="text-gray-400 text-sm">
              Cet email sera affiché en bas de la page FAQ pour que les clients puissent vous contacter.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="email@example.com"
              />
              <button
                onClick={saveContactEmail}
                disabled={savingEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {savingEmail ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Email actuel: <span className="text-blue-400">{contactEmail}</span>
            </p>
          </div>
        )}

        {/* Filtres */}
        <div className="flex gap-3">
          {(['all', 'pending', 'processing', 'completed', 'delivered'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'Toutes' : statusConfig[status].label}
            </button>
          ))}
        </div>

        {/* Liste des commandes */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Chargement...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-400 py-12">Aucune commande</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon
              return (
                <div key={order.id} className="bg-gray-800 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {order.customization.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                      <p className="text-gray-300 text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 ${statusConfig[order.status].color}`}>
                      <StatusIcon size={20} />
                      <span className="text-sm font-medium">{statusConfig[order.status].label}</span>
                    </div>
                  </div>

                  {/* Aperçu de la carte */}
                  {order.finalImageUrl && (
                    <div className="relative w-full h-48 bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={order.finalImageUrl}
                        alt="Aperçu"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Détails */}
                  <div className="bg-gray-700 rounded-lg p-3 space-y-1 text-sm">
                    <p className="text-gray-300">
                      <span className="font-medium">Montant HT:</span> {(order.amount / 100).toFixed(2)} €
                    </p>
                    {order.taxAmount && order.taxAmount > 0 && (
                      <>
                        <p className="text-gray-300">
                          <span className="font-medium">TVA:</span> {(order.taxAmount / 100).toFixed(2)} €
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Total TTC:</span> {((order.totalAmount || order.amount) / 100).toFixed(2)} €
                        </p>
                      </>
                    )}
                  </div>

                  {/* Adresse de livraison */}
                  {order.shippingName && (
                    <div className="bg-gray-700 rounded-lg p-3 space-y-1 text-sm">
                      <p className="font-medium text-white mb-2">📦 Adresse de livraison</p>
                      <p className="text-gray-300">{order.shippingName}</p>
                      <p className="text-gray-300">{order.shippingAddressLine1}</p>
                      {order.shippingAddressLine2 && (
                        <p className="text-gray-300">{order.shippingAddressLine2}</p>
                      )}
                      <p className="text-gray-300">
                        {order.shippingPostalCode} {order.shippingCity}
                      </p>
                      <p className="text-gray-300 font-medium">{order.shippingCountry}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      👁️ Voir Détails
                    </button>
                    {order.finalImageUrl && (
                      <a
                        href={order.finalImageUrl}
                        download
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Télécharger
                      </a>
                    )}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ✅ Marquer traitée
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ✅ Marquer traitée
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        📧 Marquer livrée
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
