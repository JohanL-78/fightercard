'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import CardEditor from '@/components/CardEditor'
import ImageParallaxZoom from '@/components/ImageParallaxZoom'
import SmoothReveal from '@/components/SmoothReveal'
import type { CardTemplate, CardCustomization } from '@/lib/types'

export default function Home() {
  const [templates, setTemplates] = useState<CardTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [customerEmail, setCustomerEmail] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [currentCustomization, setCurrentCustomization] = useState<CardCustomization | null>(null)
  const [savedImageUrl, setSavedImageUrl] = useState<string>('')

  useEffect(() => {
    loadTemplates()
  }, [])

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
          // Template 1 : UFC Style
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
          // Template 2 : Boxing Ring
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
          // Template 3 : Space Theme
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
           // Template 4 : laser
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
      ]
      console.log('Templates du code chargés:', defaultTemplates.length)
      setTemplates(defaultTemplates)
      setSelectedTemplate(defaultTemplates[0])

    } catch {
      console.log('Utilisation des templates par défaut (Supabase non configuré)')
      // Fallback aux templates par défaut
      const defaultTemplates: CardTemplate[] = [
        // Template 1 : UFC Style
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
        // Template 2 : Boxing Ring
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
        // Template 3 : Space Theme
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
      ]
      console.log('Templates chargés (fallback):', defaultTemplates.length, defaultTemplates)
      setTemplates(defaultTemplates)
      setSelectedTemplate(defaultTemplates[0])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCard = (imageUrl: string, customization: CardCustomization) => {
    console.log('Carte sauvegardée, passage au checkout')
    setSavedImageUrl(imageUrl)
    setCurrentCustomization(customization)
    // Ne pas mettre isCheckingOut à true ici - on attend que l'utilisateur clique
    setTimeout(() => {
      setIsCheckingOut(true)
    }, 100)
  }

  const handleCheckout = async () => {
    if (!customerEmail || !currentCustomization || !savedImageUrl) {
      alert('Veuillez remplir tous les champs')
      return
    }

    setIsProcessingPayment(true)

    try {
      console.log('Création de la session de paiement...')
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customization: { ...currentCustomization, photo: savedImageUrl },
          customerEmail,
          // Le prix est défini côté serveur pour des raisons de sécurité
        }),
      })

      console.log('Réponse reçue:', response.status)
      const data = await response.json()
      console.log('Data:', data)

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.url) {
        console.log('Redirection vers Stripe:', data.url)
        window.location.href = data.url
      } else {
        throw new Error('Aucune URL de redirection reçue')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Erreur lors de la création du paiement: ' + (error as Error).message)
      setIsProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="spinner mx-auto"></div>
          <p className="text-white text-xl font-medium">Chargement des templates...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4 animate-slide-in">
            <div className="relative">
              <img src="/logoN.avif" alt="MyFightCard Logo" className="h-20 w-20 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-blue-500">
                Fighter Card
              </h1>
              <p className="text-xs text-gray-400 font-medium">Cartes de Combat Personnalisées</p>
            </div>
          </div>
          <a
            href="/admin"
            className="btn-outline text-sm px-5 py-2.5"
          >
            Admin
          </a>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <section className="relative h-[100vh] min-h-[600px] overflow-hidden mb-20">
        <ImageParallaxZoom
          src="/octo.jpg"
          alt="Hero Fight"
          height="100%"
          zoomIntensity={1.3}
        />

        {/* Dark overlay gradient - stronger for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[#0a0a0a]" />

        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <SmoothReveal direction="up" delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-600/40 rounded-full mb-8 backdrop-blur-sm">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-blue-400 tracking-wide uppercase">Créateur de Cartes HD</span>
              </div>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.3}>
              <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.95] tracking-tighter mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Créez Votre Carte de
                <br />
                <span className="text-red-600">
                  Combat Unique
                </span>
              </h1>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.4}>
              <p className="text-[clamp(1.1rem,2vw,1.5rem)] text-white max-w-3xl mx-auto leading-relaxed tracking-tight mb-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Choisissez un template, personnalisez votre carte et recevez-la en haute définition.
                Design professionnel, qualité premium.
              </p>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.5}>
              <div className="flex gap-6 items-center justify-center flex-wrap">
                <a href="#templates" className="btn-primary px-10 py-4 text-lg">
                  <span className="flex items-center gap-2">
                    Commencer maintenant
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
                <a href="#templates" className="btn-outline px-10 py-4 text-lg">
                  Voir les templates
                </a>
              </div>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.6}>
              <div className="mt-16 flex gap-12 items-center justify-center flex-wrap">
                <div className="text-center">
                  <div className="text-4xl font-black text-blue-500 mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    720×1040px
                  </div>
                  <div className="text-sm text-gray-300 tracking-wide">Résolution HD</div>
                </div>
                <div className="h-12 w-[1px] bg-white/20 hidden md:block" />
                <div className="text-center">
                  <div className="text-4xl font-black text-red-600 mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    15€
                  </div>
                  <div className="text-sm text-gray-300 tracking-wide">Prix unique</div>
                </div>
                <div className="h-12 w-[1px] bg-white/20 hidden md:block" />
                <div className="text-center">
                  <div className="text-4xl font-black text-blue-500 mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {templates.length}+
                  </div>
                  <div className="text-sm text-gray-300 tracking-wide">Templates</div>
                </div>
              </div>
            </SmoothReveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
          <span className="text-xs text-gray-400 tracking-widest uppercase">Découvrir</span>
          <div className="h-12 w-[2px] bg-gradient-to-b from-blue-500 to-transparent" />
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 px-6 md:px-12 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full mb-6">
              <span className="text-sm font-bold text-blue-500 tracking-wide uppercase">Simple et Rapide</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              Comment ça <span className="text-blue-500">Marche ?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Créez votre carte personnalisée en 3 étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative premium-card p-8 text-center">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-50"></div>
                  <div className="relative h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl font-black text-white">1</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Choisissez un Template</h3>
                <p className="text-gray-400 leading-relaxed">
                  Sélectionnez parmi nos {templates.length}+ templates professionnels conçus pour les combattants
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative premium-card p-8 text-center">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-50"></div>
                  <div className="relative h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl font-black text-white">2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Personnalisez</h3>
                <p className="text-gray-400 leading-relaxed">
                  Ajoutez votre photo, nom, statistiques et créez une carte unique à votre image
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-red-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative premium-card p-8 text-center">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-50"></div>
                  <div className="relative h-20 w-20 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl font-black text-white">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Recevez en HD</h3>
                <p className="text-gray-400 leading-relaxed">
                  Payez 15€ et recevez votre carte en haute définition (720×1040px) par email
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-blue-600/30 transition-colors">
              <div className="h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold mb-1">Upload Photo</h4>
                <p className="text-sm text-gray-500">Ajoutez votre meilleure photo de combat</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-blue-600/30 transition-colors">
              <div className="h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold mb-1">Stats Personnalisées</h4>
                <p className="text-sm text-gray-500">Force, rapidité, endurance, etc.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-blue-600/30 transition-colors">
              <div className="h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold mb-1">Design Pro</h4>
                <p className="text-sm text-gray-500">Templates créés par des designers</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-red-600/30 transition-colors">
              <div className="h-12 w-12 bg-red-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold mb-1">Qualité HD</h4>
                <p className="text-sm text-gray-500">720×1040px pour un rendu parfait</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-12" id="templates">

        {/* Sélection du template */}
        {templates.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-12">
            {/* Step Indicator */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/10 border border-blue-600/30 rounded-full mb-6">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-black text-white">1</span>
                </div>
                <span className="text-lg font-bold text-blue-500 tracking-wide">ÉTAPE 1 : Sélectionnez un Template</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-2">
                  Templates de <span className="text-blue-500">Combat</span>
                </h3>
                <p className="text-gray-400 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {templates.length} design{templates.length > 1 ? 's' : ''} professionnel{templates.length > 1 ? 's' : ''} • Cliquez pour sélectionner
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
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60"></div>

                    {selectedTemplate?.id === template.id && (
                      <div className="absolute top-3 right-3 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="relative p-4 bg-[#0f0f0f]">
                    <p className="text-base font-bold text-white group-hover:text-blue-500 transition-colors">
                      {template.name}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                      {template.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Éditeur de carte */}
        {selectedTemplate && !isCheckingOut && (
          <div className="max-w-7xl mx-auto px-6 mb-12">
            {/* Step Indicator */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/10 border border-blue-600/30 rounded-full mb-6">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-black text-white">2</span>
                </div>
                <span className="text-lg font-bold text-blue-500 tracking-wide">ÉTAPE 2 : Personnalisez Votre Carte</span>
              </div>
              <p className="text-gray-400">
                Ajoutez votre photo, nom et statistiques pour créer votre carte unique
              </p>
            </div>
            <CardEditor template={selectedTemplate} onSave={handleSaveCard} />
          </div>
        )}

        {/* Formulaire de paiement */}
        {isCheckingOut && (
          <div className="max-w-4xl mx-auto px-6 animate-fade-in">
            <div className="premium-card p-8 space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold text-blue-500 tracking-wide">Étape finale</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-2">
                  Finaliser Votre <span className="text-blue-500">Commande</span>
                </h2>
                <p className="text-gray-400">Votre carte personnalisée est prête</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Aperçu de la carte */}
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative bg-[#0a0a0a] rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Aperçu HD (720x1040px)</p>
                      </div>
                      <div className="flex justify-center">
                        <img
                          src={savedImageUrl}
                          alt="Aperçu"
                          className="rounded-xl shadow-2xl"
                          style={{ width: '360px', height: '520px', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulaire */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
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
                    <p className="text-xs text-gray-500">Nous vous enverrons la carte HD à cette adresse</p>
                  </div>

                  <div className="gradient-border p-6">
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-medium">Carte HD personnalisée</span>
                        <span className="text-white font-bold">15,00 €</span>
                      </div>
                      <div className="border-t border-white/10"></div>
                      <div className="flex items-center justify-between text-lg">
                        <span className="font-bold text-white">Total TTC</span>
                        <span className="text-2xl font-black text-red-600">
                          15,00 €
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessingPayment}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessingPayment ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Redirection vers le paiement...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Procéder au paiement
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setIsCheckingOut(false)}
                      className="btn-outline w-full"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour à l&apos;éditeur
                      </span>
                    </button>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-600/5 border border-blue-600/20 rounded-xl">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-white mb-1">Paiement sécurisé via Stripe</p>
                      <p className="text-xs text-gray-400">Vos informations sont protégées et cryptées</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
