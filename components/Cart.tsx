'use client'

import { useState } from 'react'
import { ShoppingCart, X, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart-store'

interface CartProps {
  showFloatingButton?: boolean // Pour garder l'ancien bouton flottant si besoin
  isOpen?: boolean
  onClose?: () => void
}

export default function Cart({ showFloatingButton = false, isOpen: externalIsOpen, onClose }: CartProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = onClose ? (value: boolean) => !value && onClose() : setInternalIsOpen
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const { items, removeItem, clearCart, getTotalPrice, getItemCount } = useCartStore()

  const itemCount = getItemCount()
  const totalPrice = getTotalPrice()

  const handleCheckout = async () => {
    if (!customerEmail) {
      setShowEmailForm(true)
      return
    }

    setIsProcessing(true)

    try {
      console.log('Envoi du panier au checkout...')
      const response = await fetch('/api/checkout-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items,
          customer_email: customerEmail,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.success && data.url) {
        // Vider le panier avant de rediriger
        clearCart()

        // Redirection vers Stripe Checkout
        console.log('Redirection vers Stripe...')
        window.location.href = data.url
      } else {
        throw new Error('Échec création session Stripe')
      }
    } catch (error) {
      console.error('Erreur checkout:', error)
      alert('Erreur lors du paiement: ' + (error as Error).message)
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Bouton flottant du panier - Optionnel */}
      {showFloatingButton && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          style={{ boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)' }}
        >
          <ShoppingCart size={24} />
          {itemCount > 0 && (
            <>
              <span className="text-lg">{itemCount}</span>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-black">
                {itemCount}
              </div>
            </>
          )}
        </button>
      )}

      {/* Panneau latéral du panier */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panneau */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a1a1a] border-l border-white/10 z-50 shadow-2xl overflow-hidden flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-red-600/20">
              <div className="flex items-center gap-3">
                <ShoppingCart size={28} className="text-blue-400" />
                <div>
                  <h2 className="text-2xl font-black text-white">Mon Panier</h2>
                  <p className="text-sm text-gray-400">
                    {itemCount} {itemCount > 1 ? 'cartes' : 'carte'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-300" />
              </button>
            </div>

            {/* Liste des items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg font-medium">Votre panier est vide</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Créez votre première carte !
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="premium-card p-4 flex gap-4 group"
                  >
                    {/* Miniature de la carte */}
                    <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.customization.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-white text-lg truncate">
                        {item.customization.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-1">
                        {item.customization.sport} • Rating {item.customization.rating}
                      </p>
                      <p className="text-blue-400 font-bold text-xl">
                        {item.price.toFixed(2)} €
                      </p>
                    </div>

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Retirer du panier"
                    >
                      <Trash2 size={20} className="text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer avec total et bouton paiement */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 bg-[#0f0f0f] space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-xl">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-black text-3xl text-blue-400">
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>

                {/* Formulaire email si nécessaire */}
                {showEmailForm && (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-300">
                      Votre Email
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="input-modern w-full"
                      required
                    />
                    <p className="text-xs text-gray-400">
                      Pour recevoir vos cartes HD
                    </p>
                  </div>
                )}

                {/* Bouton passer commande */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Redirection vers le paiement...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart size={20} />
                      Commander ({itemCount} {itemCount > 1 ? 'cartes' : 'carte'})
                    </span>
                  )}
                </button>

                <p className="text-xs text-center text-gray-400">
                  Paiement sécurisé via Stripe
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
