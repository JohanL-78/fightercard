export interface CardTemplate {
  id: string
  name: string
  imageUrl: string
  category: 'mma' | 'boxing' | 'kickboxing' | 'other'
  color?: string  // Couleur principale du template (hex)
  positions: {
    photo: { x: number; y: number; width: number; height: number }
    username: { x: number; y: number; fontSize: number }
    rating: { x: number; y: number; fontSize: number }
    sport: { x: number; y: number; fontSize: number }
    name: { x: number; y: number; fontSize: number }
    flag: { x: number; y: number; width: number; height: number }
    stats: {
      x: number              // Position X du conteneur des stats (centré)
      y: number              // Position Y de la première ligne de stats
      fontSize: number       // Taille de police des valeurs (ex: 18)
      labelFontSize: number  // Taille de police des labels (ex: 13)
      rowSpacing: number     // Espacement vertical entre les lignes (ex: 40)
      columnWidth: number    // Largeur de chaque colonne (ex: 152)
    }
  }
}

export interface CardCustomization {
  templateId: string
  photo: string
  username: string
  name: string
  sport: string
  rating: number
  flagUrl?: string
  removeBackground: boolean
  stats: {
    force: number
    rapidite: number
    grappling: number
    endurance: number
    striking: number
    equilibre: number
  }
}

export interface Order {
  id: string
  createdAt: string
  customerEmail: string
  customization: CardCustomization
  fighterPhotoUrl: string          // Photo ORIGINALE uploadée par user
  templatePreviewUrl?: string       // Template avec textes (optionnel)
  finalImageUrl?: string            // Carte finale HD (nullable, généré par admin)
  stripePaymentId: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'delivered'
  // Adresse de livraison
  shippingName?: string
  shippingAddressLine1?: string
  shippingAddressLine2?: string
  shippingCity?: string
  shippingPostalCode?: string
  shippingCountry?: string
  // Montants avec TVA
  taxAmount?: number
  totalAmount?: number
}

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'createdAt'>
        Update: Partial<Omit<Order, 'id' | 'createdAt'>>
      }
      templates: {
        Row: CardTemplate
        Insert: Omit<CardTemplate, 'id'>
        Update: Partial<Omit<CardTemplate, 'id'>>
      }
    }
  }
}
