'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import CardEditor from '@/components/CardEditor'
import SmoothReveal from '@/components/SmoothReveal'
import CookieBanner from '@/components/CookieBanner'
import ImageParallaxZoom from '@/components/ImageParallaxZoom'
import Cart from '@/components/Cart'
import CartButton from '@/components/CartButton'
import type { CardTemplate } from '@/lib/types'

export default function Home() {
  const [templates, setTemplates] = useState<CardTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [bgColor, setBgColor] = useState<string>('#1a1a1a') // Couleur de fond dynamique

  useEffect(() => {
    loadTemplates()
  }, [])

  // Synchroniser la couleur de fond avec le template sélectionné
  useEffect(() => {
    if (selectedTemplate?.color) {
      // Convertir la couleur du template en version semi-transparente pour le fond
      setBgColor(selectedTemplate.color)
    } else {
      setBgColor('#1a1a1a')
    }
  }, [selectedTemplate])

  const loadTemplates = async () => {
    // OPTION : Utiliser les templates du code (actuel) ou Supabase
    const USE_CODE_TEMPLATES = true  // Changez en false pour utiliser Supabase

    try {
      if (!USE_CODE_TEMPLATES) {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        // Si templates trouvés dans Supabase
        if (data && data.length > 0) {
          interface TemplateRow {
            id: string
            name: string
            image_url: string
            category: 'mma' | 'boxing' | 'kickboxing' | 'other'
            positions: CardTemplate['positions']
          }
          const mappedTemplates: CardTemplate[] = data.map((t: TemplateRow) => ({
            id: t.id,
            name: t.name,
            imageUrl: t.image_url,
            category: t.category,
            positions: t.positions,
          }))
          console.log('Templates depuis Supabase:', mappedTemplates.length, mappedTemplates)
          setTemplates(mappedTemplates)
          setSelectedTemplate(mappedTemplates[0])
          setLoading(false)
          return
        }
      }

      // Utiliser les templates par défaut du code
      const defaultTemplates: CardTemplate[] = [
        // Template 1 : Boxing Ring
        {
          id: 'boxing',
          name: 'Boxing Ring',
          imageUrl: '/octotun.png',
          category: 'boxing',
          color: '#EF4444', // Rouge
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
        // Template 2 : Space Fighter
        {
          id: 'space',
          name: 'Space Fighter',
          imageUrl: '/3dback.png',
          category: 'other',
          color: '#7adeff', // Bleu néon
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
        // Template 3 : UFC Style
        {
          id: 'ufc',
          name: 'UFC Style',
          imageUrl: '/dark.png',
          category: 'mma',
          color: '#10B981', // Vert émeraude
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
        // Template 4 : Laser Fighter
        {
          id: 'laser',
          name: 'Laser Fighter',
          imageUrl: '/3dwhite.png',
          category: 'other',
          color: '#FFFFFF', // Blanc
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
        // Template 5 : Aztek
        {
          id: 'aztek',
          name: 'Aztek',
          imageUrl: '/aztek1.jpg',
          category: 'other',
          color: '#F59E0B', // Orange/Ambre
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
        // Template 6 : Paint
        {
          id: 'paint',
          name: 'Paint',
          imageUrl: '/leonardo1.jpg',
          category: 'other',
          color: '#8B5CF6', // Violet
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
        // Template 7 : Octogone
        {
          id: 'octogone',
          name: 'Octogone',
          imageUrl: '/leonardo2.jpg',
          category: 'mma',
          color: '#EC4899', // Rose/Pink
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
        // Template 8 : Shaolin
        {
          id: 'shaolin',
          name: 'Shaolin',
          imageUrl: '/darktemple.png',
          category: 'other',
          color: '#DC2626', // Rouge foncé
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
      console.log('Templates du code chargés:', defaultTemplates.length)
      setTemplates(defaultTemplates)
      setSelectedTemplate(defaultTemplates[0])

    } catch {
      console.log('Utilisation des templates par défaut (Supabase non configuré)')
      // Fallback aux templates par défaut
      const defaultTemplates: CardTemplate[] = [
        // Template 1 : Boxing Ring
        {
          id: 'boxing',
          name: 'Boxing Ring',
          imageUrl: '/octotun.png',
          category: 'boxing',
          color: '#EF4444', // Rouge
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
        // Template 2 : Space Fighter
        {
          id: 'space',
          name: 'Space Fighter',
          imageUrl: '/spacepexels.jpg',
          category: 'other',
          color: '#7adeff', // Bleu néon
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
        // Template 3 : UFC Style
        {
          id: 'ufc',
          name: 'UFC Style',
          imageUrl: '/dark.png',
          category: 'mma',
          color: '#10B981', // Vert émeraude
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
        // Template 4 : Laser Fighter
        {
          id: 'laser',
          name: 'Laser Fighter',
          imageUrl: '/3dwhite.png',
          category: 'other',
          color: '#FFFFFF', // Blanc
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
        // Template 5 : Aztek
        {
          id: 'aztek',
          name: 'Aztek',
          imageUrl: '/aztek1.jpg',
          category: 'other',
          color: '#F59E0B', // Orange/Ambre
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
        // Template 6 : Paint
        {
          id: 'paint',
          name: 'Paint',
          imageUrl: '/leonardo1.jpg',
          category: 'other',
          color: '#8B5CF6', // Violet
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
        // Template 7 : Octogone
        {
          id: 'octogone',
          name: 'Octogone',
          imageUrl: '/leonardo2.jpg',
          category: 'mma',
          color: '#EC4899', // Rose/Pink
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
        // Template 8 : Shaolin
        {
          id: 'shaolin',
          name: 'Shaolin',
          imageUrl: '/darktempe.png',
          category: 'other',
          color: '#DC2626', // Rouge foncé
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
      console.log('Templates chargés (fallback):', defaultTemplates.length, defaultTemplates)
      setTemplates(defaultTemplates)
      setSelectedTemplate(defaultTemplates[0])
    } finally {
      setLoading(false)
    }
  }

  // Plus besoin de ces fonctions - tout passe par le panier maintenant

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="spinner mx-auto"></div>
          <p className="text-white text-xl font-medium">Chargement des templates...</p>
        </div>
      </div>
    )
  }

  return (
    <main
      className="min-h-screen text-white transition-colors duration-700"
      style={{
        background: selectedTemplate?.color
          ? `linear-gradient(to bottom, #1a1a1a 0%, ${bgColor}08 50%, #1a1a1a 100%)`
          : '#1a1a1a'
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="w-full px-2 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-4 animate-slide-in">
            <div className="relative flex-shrink-0">
              <Image
                src="/logoN-2-2.png"
                alt="MyFightCard Logo"
                width={80}
                height={80}
                className="h-10 w-10 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-[9px] sm:text-base lg:text-lg font-black tracking-tight text-blue-400 whitespace-nowrap">
                Fighter Card
              </h1>
              <p className="hidden sm:block text-xs lg:text-sm text-gray-300 font-semibold">Cartes de Combat Personnalisées</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
            <a
              href="/faq"
              className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              FAQ
            </a>
            <CartButton onClick={() => setIsCartOpen(true)} />
          </div>
        </div>
      </header>

      {/* Hero Section - Image pleine largeur avec texte par-dessus */}
      <section className="relative mb-20 min-h-[100vh] flex items-center">
        {/* Image de fond pleine largeur */}
        <div className="absolute inset-0">
          <ImageParallaxZoom
            src="/ring.png"
            alt="Hero Fight"
            height="100%"
            className="absolute inset-0"
            imageClassName="brightness-90"
            objectPosition="center"
          />
          {/* Overlay avec dégradé progressif très smooth vers le bas */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-30% to-[#1a1a1a]/60" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
        </div>

        {/* Contenu texte par-dessus */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-20">
          <div className="max-w-6xl mx-auto text-center -mt-40">
            <SmoothReveal direction="up" delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/80 backdrop-blur-sm border border-blue-400/50 rounded-full mb-8">
                <div className="h-2 w-2 bg-blue-300 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-white tracking-wide uppercase">Créateur de Cartes HD</span>
              </div>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.3}>
              <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.95] tracking-tighter mb-8 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                Crée Ta Carte de
                <br />
                <span className="text-[#ff0000] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                  Combat Unique
                </span>
              </h1>
            </SmoothReveal>


         

            <SmoothReveal direction="up" delay={0.6}>
              <div className="flex gap-4 md:gap-6 items-center justify-center flex-wrap">
                <div className="bg-black/80 px-4 py-3 rounded-xl border border-white/20">
                  <div className="text-lg md:text-xl font-black text-white mb-0.5 drop-shadow-lg">
                    QUALITÉ HD
                  </div>
                  <div className="text-xs text-gray-300 font-medium">Impression Pro</div>
                </div>
                <div className="bg-black/80 px-4 py-3 rounded-xl border border-white/20">
                  <div className="text-lg md:text-xl font-black text-[#ff0000] mb-0.5 drop-shadow-lg">
                    15€
                  </div>
                  <div className="text-xs text-gray-300 font-medium">Prix Unique</div>
                </div>
                <div className="bg-black/80 px-4 py-3 rounded-xl border border-white/20">
                  <div className="text-lg md:text-xl font-black text-white mb-0.5 drop-shadow-lg">
                    {templates.length}+
                  </div>
                  <div className="text-xs text-gray-300 font-medium">Templates</div>
                </div>
              </div>
            </SmoothReveal>
          </div>
        </div>
      </section>

      <div className="pb-12 max-w-7xl mx-auto px-6" id="templates">

        {/* Éditeur de carte ET Templates dans le même conteneur pour le sticky */}
        {selectedTemplate && (
          <>
            {/* Step Indicator */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600/10 border-2 border-blue-600/30 rounded-full mb-6">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg font-black text-white">1</span>
                </div>
                <span className="text-2xl font-black text-blue-400 tracking-tight">PERSONNALISE TA CARTE</span>
              </div>
              <p className="text-gray-300 text-lg font-medium">
                Ajoute ta photo, ton nom et tes stats pour une carte 100% unique
              </p>
            </div>
            <CardEditor template={selectedTemplate} />
          </>
        )}

        {/* Sélection du template - APRÈS L'APERÇU */}
        {templates.length > 0 && (
          <div className="mb-12">
            {/* Step Indicator */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600/10 border-2 border-blue-600/30 rounded-full mb-6">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg font-black text-white">2</span>
                </div>
                <span className="text-2xl font-black text-blue-400 tracking-tight">CHANGE DE STYLE</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-3 text-impact text-white">
                  Templates <span className="text-blue-400">Exclusifs</span>
                </h2>
                <p className="text-gray-300 flex items-center gap-2 text-lg font-medium">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {templates.length} designs pro • Clique pour changer de template
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`template-card group ${
                    selectedTemplate?.id === template.id ? 'selected' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <div className="relative h-48">
                      <Image
                        src={template.imageUrl}
                        alt={template.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60"></div>

                    {selectedTemplate?.id === template.id && (
                      <div className="absolute top-3 right-3 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="relative p-4 bg-[#252525] border-t border-white/10">
                    <p className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">
                      {template.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] border-t border-white/10 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Fighter Card. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link href="/legal" className="text-sm text-gray-400 hover:text-blue-400 transition">
                Mentions Légales
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-blue-400 transition">
                Politique de Confidentialité
              </Link>
              <Link href="/faq" className="text-sm text-gray-400 hover:text-blue-400 transition">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Panier */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  )
}
