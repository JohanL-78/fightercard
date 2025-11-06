import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CardCustomization } from './types'

export interface CartItem {
  id: string
  imageUrl: string // Aperçu de la carte
  originalPhoto: string // Photo originale pour le traitement
  customization: CardCustomization
  price: number
  addedAt: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: CartItem = {
          ...item,
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          addedAt: Date.now(),
        }
        set((state) => ({
          items: [...state.items, newItem],
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price, 0)
      },

      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'fight-card-cart', // Nom dans localStorage
    }
  )
)
