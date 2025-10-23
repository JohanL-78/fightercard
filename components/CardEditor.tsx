'use client'

import { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { domToPng } from 'modern-screenshot'
import { Upload, Download, Trash2 } from 'lucide-react'
import type { CardCustomization, CardTemplate } from '@/lib/types'

interface CardEditorProps {
  template: CardTemplate
  onSave?: (imageUrl: string, customization: CardCustomization) => void
}

export default function CardEditor({ template, onSave }: CardEditorProps) {
  const [customization, setCustomization] = useState<CardCustomization>({
    templateId: template.id,
    photo: '',
    username: 'fighter_name',
    name: 'FIGHTER',
    rating: 85,
    flagUrl: '',
    removeBackground: false,
    stats: {
      force: 90,
      rapidite: 85,
      grappling: 88,
      endurance: 80,
      striking: 82,
      equilibre: 87,
    },
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [backgroundImageBase64, setBackgroundImageBase64] = useState<string>('')
  const cardRef = useRef<HTMLDivElement>(null)

  // Convertir l'image de fond en base64 au chargement
  useEffect(() => {
    const loadBackgroundAsBase64 = async () => {
      try {
        const response = await fetch(template.imageUrl)
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          setBackgroundImageBase64(reader.result as string)
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.error('Erreur chargement background:', error)
        // Fallback sur l'URL originale
        setBackgroundImageBase64(template.imageUrl)
      }
    }
    loadBackgroundAsBase64()
  }, [template.imageUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomization(prev => ({ ...prev, photo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    },
  })

  const handleRemoveBackground = async () => {
    if (!customization.photo) return

    setIsProcessing(true)
    try {
      // Conversion base64 en blob
      const base64Response = await fetch(customization.photo)
      const blob = await base64Response.blob()

      // Appel à l'API Remove.bg
      const formData = new FormData()
      formData.append('image_file', blob)
      formData.append('size', 'auto')

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression du fond')

      const result = await response.json()
      setCustomization(prev => ({ ...prev, photo: result.imageUrl, removeBackground: true }))
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression du fond. Vérifiez votre clé API Remove.bg.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExportCard = async () => {
    if (!cardRef.current) return

    setIsProcessing(true)
    try {
      console.log('Génération de l\'image avec Canvas natif...')

      // Créer un canvas pour dessiner manuellement
      const canvas = document.createElement('canvas')
      const scale = 4.5
      canvas.width = 360 * scale // 1620px
      canvas.height = 520 * scale // 2340px
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('Impossible de créer le contexte canvas')

      // Fond noir
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dessiner l'image de fond du template
      if (backgroundImageBase64) {
        const bgImg = new Image()
        bgImg.src = backgroundImageBase64
        await new Promise((resolve, reject) => {
          bgImg.onload = resolve
          bgImg.onerror = reject
        })
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        console.log('✓ Background dessiné')
      }

      // Dessiner la photo du combattant avec objectFit: 'cover'
      if (customization.photo) {
        const fighterImg = new Image()
        fighterImg.src = customization.photo
        await new Promise((resolve, reject) => {
          fighterImg.onload = resolve
          fighterImg.onerror = reject
        })

        const destX = template.positions.photo.x * scale
        const destY = template.positions.photo.y * scale
        const destW = template.positions.photo.width * scale
        const destH = template.positions.photo.height * scale

        // Calculer les dimensions pour objectFit: 'cover' + objectPosition: 'top center'
        const imgRatio = fighterImg.width / fighterImg.height
        const boxRatio = destW / destH

        let srcX = 0
        let srcY = 0
        let srcW = fighterImg.width
        let srcH = fighterImg.height

        if (imgRatio > boxRatio) {
          // Image plus large que le conteneur - couper les côtés
          srcW = fighterImg.height * boxRatio
          srcX = (fighterImg.width - srcW) / 2 // Centrer horizontalement
        } else {
          // Image plus haute que le conteneur - couper le bas (top center)
          srcH = fighterImg.width / boxRatio
          srcY = 0 // Garder le haut (top center)
        }

        ctx.drawImage(fighterImg, srcX, srcY, srcW, srcH, destX, destY, destW, destH)
        console.log('✓ Photo du combattant dessinée (objectFit: cover)')
      }

      // Pour le texte, on utilise modern-screenshot sur un élément temporaire
      // qui contient SEULEMENT le texte (pas les images)
      const textOverlay = await domToPng(cardRef.current, {
        scale: scale,
        backgroundColor: 'transparent',
        quality: 0.90,
        filter: (node) => {
          // Filtrer les images pour ne garder que le texte
          if (node instanceof HTMLImageElement) return false
          return true
        },
      })

      const textImg = new Image()
      textImg.src = textOverlay
      await new Promise((resolve) => {
        textImg.onload = resolve
        textImg.onerror = resolve // Continue même si erreur
      })
      ctx.drawImage(textImg, 0, 0)
      console.log('✓ Texte et stats dessinés')

      // Convertir le canvas en data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.90)
      console.log('Image générée - Résolution: 1620×2340px (~200 DPI pour A4)')

      // Upload sur Cloudinary AVANT checkout (évite timeout Supabase)
      console.log('Upload vers Cloudinary...')

      try {
        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
        })

        if (!uploadResponse.ok) {
          throw new Error('Erreur upload Cloudinary')
        }

        const uploadData = await uploadResponse.json()
        const cloudinaryUrl = uploadData.url

        console.log('✓ Image uploadée:', cloudinaryUrl)

        // Passer l'URL Cloudinary (légère) au lieu du base64 (lourd)
        const customizationWithUrl = {
          ...customization,
          photo: cloudinaryUrl, // URL Cloudinary
        }

        if (onSave) {
          onSave(cloudinaryUrl, customizationWithUrl)
        } else {
          alert('Veuillez finaliser votre commande')
        }
      } catch (uploadError) {
        console.error('Erreur upload:', uploadError)
        alert('Erreur lors de l\'upload de l\'image. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      alert('Erreur lors de la génération de la carte')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-6 animate-fade-in">
      {/* Panneau de contrôle */}
      <div className="space-y-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-blue-500 tracking-wide">Personnalisation</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">
            Créez Votre <span className="text-blue-500">Carte</span>
          </h2>
          <p className="text-gray-400 mt-2">Remplissez tous les champs ci-dessous pour personnaliser votre carte</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-white mb-1">Comment ça marche :</p>
              <ul className="text-gray-400 space-y-1 list-disc list-inside">
                <li>Ajoutez votre photo de combat</li>
                <li>Entrez votre nom et vos statistiques</li>
                <li>Visualisez en temps réel à droite</li>
                <li>Cliquez sur "Passer commande" quand c'est prêt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload de photo */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Photo du combattant</label>
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-blue-600 bg-blue-600/10 scale-105'
                : 'border-white/10 hover:border-blue-600/50 bg-[#0f0f0f]'
            }`}
          >
            <input {...getInputProps()} />
            <div className={`transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`}>
              <Upload className="mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-white font-medium mb-1">
                {isDragActive ? 'Déposez la photo ici' : 'Glissez une photo ici'}
              </p>
              <p className="text-sm text-gray-500">ou cliquez pour sélectionner</p>
            </div>
          </div>

          {customization.photo && !customization.removeBackground && (
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="btn-secondary w-full disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Traitement...
                </span>
              ) : (
                'Supprimer le fond (Remove.bg)'
              )}
            </button>
          )}
        </div>



        {/* Nom du combattant */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Nom du combattant</label>
          <input
            type="text"
            value={customization.name}
            onChange={(e) => setCustomization(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
            className="input-modern w-full"
            placeholder='Ex: FIGHTER'
          />
          <p className="text-xs text-gray-500">Le nom sera automatiquement en majuscules</p>
        </div>

        {/* Note globale */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Note globale</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={customization.rating}
              onChange={(e) => setCustomization(prev => ({ ...prev, rating: parseInt(e.target.value) || 0 }))}
              className="input-modern w-full pr-16"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold">
              / 100
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${customization.rating}%` }}
              />
            </div>
            <span className="text-sm font-bold text-blue-500">{customization.rating}</span>
          </div>
        </div>

        {/* URL du drapeau */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
            Drapeau (optionnel)
          </label>
          <input
            type="url"
            value={customization.flagUrl || ''}
            onChange={(e) => setCustomization(prev => ({ ...prev, flagUrl: e.target.value }))}
            className="input-modern w-full"
            placeholder="https://flagcdn.com/fr.svg"
          />
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Utilisez flagcdn.com pour les URLs de drapeaux
          </p>
        </div>

        {/* Statistiques */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Statistiques du combattant</label>
          <div className="premium-card p-6 space-y-2">
            {[
              { key: 'force', label: 'Force', icon: '💪' },
              { key: 'rapidite', label: 'Rapidité', icon: '⚡' },
              { key: 'grappling', label: 'Grappling', icon: '🤼' },
              { key: 'endurance', label: 'Endurance', icon: '🏃' },
              { key: 'striking', label: 'Striking', icon: '👊' },
              { key: 'equilibre', label: 'Équilibre', icon: '⚖️' },
            ].map((stat) => (
              <div key={stat.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </label>
                  <span className="text-sm font-bold text-blue-500">
                    {customization.stats[stat.key as keyof typeof customization.stats]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customization.stats[stat.key as keyof typeof customization.stats]}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      stats: { ...prev.stats, [stat.key]: parseInt(e.target.value) || 0 }
                    }))}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customization.stats[stat.key as keyof typeof customization.stats]}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      stats: { ...prev.stats, [stat.key]: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-16 input-modern text-center px-2 py-1 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleExportCard}
            disabled={isProcessing || !customization.photo}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-3">
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Génération en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Download size={20} />
                Passer commande
              </span>
            )}
          </button>

          <button
            onClick={() => setCustomization({
              templateId: template.id,
              photo: '',
              username: '',
              name: '',
              rating: 85,
              flagUrl: '',
              removeBackground: false,
              stats: {
                force: 90,
                rapidite: 85,
                grappling: 88,
                endurance: 80,
                striking: 82,
                equilibre: 87,
              },
            })}
            className="btn-outline w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 size={18} />
              Réinitialiser
            </span>
          </button>
        </div>
      </div>

      {/* Aperçu de la carte */}
      <div className="flex flex-col items-center justify-center">
        {/* Live Preview Label */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full mb-2">
            <div className="relative">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 h-2 w-2 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-bold text-blue-500 tracking-wide uppercase">Aperçu en Temps Réel</span>
          </div>
          <p className="text-xs text-gray-500">Vos modifications apparaissent instantanément</p>
        </div>

        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

          <div
            ref={cardRef}
            className="relative overflow-hidden shadow-2xl"
            style={{
              width: '360px',
              height: '520px',
              backgroundColor: '#1a1a1a',
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Image de fond du template - DOIT être une balise img pour modern-screenshot */}
            {backgroundImageBase64 && (
              <img
                src={backgroundImageBase64}
                alt=""
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '360px',
                  height: '520px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            )}

                {/* Photo du combattant */}
                {customization.photo && (
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      left: `${template.positions.photo.x}px`,
                      top: `${template.positions.photo.y}px`,
                      width: `${template.positions.photo.width}px`,
                      height: `${template.positions.photo.height}px`,
                    }}
                  >
                    <img
                      src={customization.photo}
                      alt="Fighter"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))',
                      }}
                    />
                  </div>
                )}



                {/* Note globale en haut à gauche avec badge sophistiqué */}
                <div
                  className="absolute z-20"
                  style={{
                    left: `${template.positions.rating.x}px`,
                    top: `${template.positions.rating.y}px`,
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-lg border-2"
                    style={{
                      width: '70px',
                      height: '70px',
                      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                      borderColor: 'white',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <div
                      className="font-black text-white"
                      style={{
                        fontSize: `${template.positions.rating.fontSize}px`,
                        textShadow: '0 0 15px rgba(59, 130, 246, 0.8), 0 2px 4px rgba(0,0,0,0.9)',
                        lineHeight: '1',
                      }}
                    >
                      {customization.rating}
                    </div>
                    <div
                      className="font-bold tracking-widest"
                      style={{
                        fontSize: '8px',
                        color: '#3B82F6',
                        textShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                        marginTop: '2px',
                      }}
                    >
                      OVR
                    </div>
                  </div>
                </div>

                {/* Sport (MMA) */}
                <div
                  className="absolute z-20 text-white font-semibold"
                  style={{
                    left: `${template.positions.sport.x}px`,
                    top: `${template.positions.sport.y}px`,
                    fontSize: `${template.positions.sport.fontSize}px`,
                  }}
                >
                  MMA
                </div>

                {/* Drapeau en haut à droite */}
                {customization.flagUrl && (
                  <img
                    src={customization.flagUrl}
                    alt="Flag"
                    className="absolute z-20 rounded shadow-lg"
                    style={{
                      left: `${template.positions.flag.x}px`,
                      top: `${template.positions.flag.y}px`,
                      width: `${template.positions.flag.width}px`,
                      height: `${template.positions.flag.height}px`,
                      objectFit: 'cover',
                    }}
                  />
                )}

                {/* Nom du combattant */}
                <div
                  className="absolute z-20 w-full text-center"
                  style={{
                    top: `${template.positions.name.y}px`,
                  }}
                >
                  <div
                    className="inline-block px-6 py-2 rounded-lg border-1"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 100%)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <div
                      className="font-black text-white tracking-wider"
                      style={{
                        fontSize: `${template.positions.name.fontSize}px`,
                        textShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 2px 4px rgba(0,0,0,0.9)',
                        letterSpacing: '2px',
                      }}
                    >
                      {customization.name || 'FIGHTER'}
                    </div>
                  </div>
                </div>

                {/* Statistiques - VERSION 2 COLONNES */}
                <div
                  className="absolute z-20 w-full px-6"
                  style={{
                    top: `${template.positions.stats.y}px`,
                  }}
                >
                  {/* Fond semi-transparent pour mieux faire ressortir les stats */}
                  <div
                    className="rounded-lg border border-white/20 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 100%)',
                      backdropFilter: 'blur(10px)',
                      padding: '12px',
                    }}
                  >
                    {/* Titre de section */}
                    <div
                      className="text-center font-black tracking-widest mb-2 pb-1.5"
                      style={{
                        fontSize: '10px',
                        color: '#3B82F6',
                        textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                        borderBottom: '2px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      COMBAT STATS
                    </div>

                    {/* GRILLE 2 COLONNES */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                      {/* Force */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-white tracking-wide" style={{ fontSize: '9px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            FORCE
                          </span>
                          <span className="font-black text-blue-400" style={{ fontSize: '11px', textShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }}>
                            {customization.stats.force}
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${customization.stats.force}%`,
                              background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Rapidité */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-white tracking-wide" style={{ fontSize: '9px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            RAPIDITÉ
                          </span>
                          <span className="font-black text-blue-400" style={{ fontSize: '11px', textShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }}>
                            {customization.stats.rapidite}
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${customization.stats.rapidite}%`,
                              background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Grappling */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-white tracking-wide" style={{ fontSize: '9px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            GRAPPLING
                          </span>
                          <span className="font-black text-blue-400" style={{ fontSize: '11px', textShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }}>
                            {customization.stats.grappling}
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${customization.stats.grappling}%`,
                              background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Endurance */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-white tracking-wide" style={{ fontSize: '9px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            ENDURANCE
                          </span>
                          <span className="font-black text-blue-400" style={{ fontSize: '11px', textShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }}>
                            {customization.stats.endurance}
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${customization.stats.endurance}%`,
                              background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Striking */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-white tracking-wide" style={{ fontSize: '9px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            STRIKING
                          </span>
                          <span className="font-black text-blue-400" style={{ fontSize: '11px', textShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }}>
                            {customization.stats.striking}
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${customization.stats.striking}%`,
                              background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Équilibre */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-white tracking-wide" style={{ fontSize: '9px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            ÉQUILIBRE
                          </span>
                          <span className="font-black text-blue-400" style={{ fontSize: '11px', textShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }}>
                            {customization.stats.equilibre}
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${customization.stats.equilibre}%`,
                              background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

          </div>
        </div>
      </div>
    </div>
  )
}
