'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface CartButtonProps {
  onClick: () => void
}

export default function CartButton({ onClick }: CartButtonProps) {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors font-medium rounded-lg hover:bg-white/5"
    >
      <ShoppingCart size={20} />
      <span className="hidden sm:inline">Panier</span>
      {itemCount > 0 && (
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-black text-white">
          {itemCount}
        </div>
      )}
    </button>
  )
}
