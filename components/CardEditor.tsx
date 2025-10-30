'use client'

import { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Trash2, Dumbbell, Zap, Users, Heart, Crosshair, Scale } from 'lucide-react'
import type { CardCustomization, CardTemplate } from '@/lib/types'

// Les types et constantes ne changent pas
interface CardEditorProps {
  template: CardTemplate
  onSave?: (imageUrl: string, customization: CardCustomization, originalPhoto: string) => void
}

// Liste des pays avec codes ISO pour FlagCDN
const COUNTRIES = [
  { code: '', name: 'Aucun drapeau', flag: '' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'us', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'gb', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'de', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'es', name: 'Espagne', flag: '🇪🇸' },
  { code: 'it', name: 'Italie', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugal', flag: '🇵🇹' },
  { code: 'br', name: 'Brésil', flag: '🇧🇷' },
  { code: 'ru', name: 'Russie', flag: '🇷🇺' },
  { code: 'jp', name: 'Japon', flag: '🇯🇵' },
  { code: 'cn', name: 'Chine', flag: '🇨🇳' },
  { code: 'kr', name: 'Corée du Sud', flag: '🇰🇷' },
  { code: 'mx', name: 'Mexique', flag: '🇲🇽' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australie', flag: '🇦🇺' },
  { code: 'nz', name: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: 'nl', name: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'be', name: 'Belgique', flag: '🇧🇪' },
  { code: 'ch', name: 'Suisse', flag: '🇨🇭' },
  { code: 'se', name: 'Suède', flag: '🇸🇪' },
  { code: 'no', name: 'Norvège', flag: '🇳🇴' },
  { code: 'dk', name: 'Danemark', flag: '🇩🇰' },
  { code: 'fi', name: 'Finlande', flag: '🇫🇮' },
  { code: 'pl', name: 'Pologne', flag: '🇵🇱' },
  { code: 'cz', name: 'Tchéquie', flag: '🇨🇿' },
  { code: 'at', name: 'Autriche', flag: '🇦🇹' },
  { code: 'gr', name: 'Grèce', flag: '🇬🇷' },
  { code: 'tr', name: 'Turquie', flag: '🇹🇷' },
  { code: 'ie', name: 'Irlande', flag: '🇮🇪' },
  { code: 'ar', name: 'Argentine', flag: '🇦🇷' },
  { code: 'cl', name: 'Chili', flag: '🇨🇱' },
  { code: 'co', name: 'Colombie', flag: '🇨🇴' },
  { code: 'pe', name: 'Pérou', flag: '🇵🇪' },
  { code: 'za', name: 'Afrique du Sud', flag: '🇿🇦' },
  { code: 'ng', name: 'Nigéria', flag: '🇳🇬' },
  { code: 'eg', name: 'Égypte', flag: '🇪🇬' },
  { code: 'ma', name: 'Maroc', flag: '🇲🇦' },
  { code: 'dz', name: 'Algérie', flag: '🇩🇿' },
  { code: 'tn', name: 'Tunisie', flag: '🇹🇳' },
  { code: 'in', name: 'Inde', flag: '🇮🇳' },
  { code: 'pk', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'th', name: 'Thaïlande', flag: '🇹🇭' },
  { code: 'vn', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'id', name: 'Indonésie', flag: '🇮🇩' },
  { code: 'ph', name: 'Philippines', flag: '🇵🇭' },
  { code: 'my', name: 'Malaisie', flag: '🇲🇾' },
  { code: 'sg', name: 'Singapour', flag: '🇸🇬' },
  { code: 'il', name: 'Israël', flag: '🇮🇱' },
  { code: 'sa', name: 'Arabie Saoudite', flag: '🇸🇦' },
  { code: 'ae', name: 'Émirats Arabes Unis', flag: '🇦🇪' },
  { code: 'ua', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'ro', name: 'Roumanie', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarie', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatie', flag: '🇭🇷' },
  { code: 'rs', name: 'Serbie', flag: '🇷🇸' },
].sort((a, b) => a.name.localeCompare(b.name))
const POLYGON_CLIP_PATH = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'
const BACKGROUND_VERTICAL_SHIFT_RATIO = 0.05 // proportion de la hauteur à remonter (0.05 = 5 %)

const drawBackgroundWithFocus = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  destWidth: number,
  destHeight: number
) => {
  const scale = Math.max(destWidth / img.width, destHeight / img.height)
  const scaledWidth = img.width * scale
  const scaledHeight = img.height * scale

  const dx = (destWidth - scaledWidth) / 2
  const minDy = destHeight - scaledHeight
  const desiredDy = -destHeight * BACKGROUND_VERTICAL_SHIFT_RATIO
  const dy = Math.min(0, Math.max(minDy, desiredDy))

  ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight)
}
const drawPolygonOnCanvas = (ctx: CanvasRenderingContext2D, polygonString: string, width: number, height: number) => {
  const points = polygonString.replace('polygon(', '').replace(')', '').split(',').map(point => {
    const [xStr, yStr] = point.trim().split(' '); const x = parseFloat(xStr) * (xStr.includes('%') ? width / 100 : 1); const y = parseFloat(yStr) * (yStr.includes('%') ? height / 100 : 1); return { x, y }
  }); if (points.length < 3) return; ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); for (let i = 1; i < points.length; i++) { ctx.lineTo(points[i].x, points[i].y) } ctx.closePath();
}

// Fonction pour convertir hex en rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function CardEditor({ template, onSave }: CardEditorProps) {
  const templateColor = template.color || '#3B82F6' // Couleur par défaut: bleu
  const [customization, setCustomization] = useState<CardCustomization>({
    templateId: template.id, photo: '', username: 'fighter_name', name: 'FIGHTER', rating: 85, flagUrl: '', removeBackground: false,
    stats: { force: 90, rapidite: 85, grappling: 88, endurance: 80, striking: 82, equilibre: 87 },
  })
  const [originalUserPhoto, setOriginalUserPhoto] = useState<string>('') // Photo BRUTE uploadée par l'user
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [backgroundImageBase64, setBackgroundImageBase64] = useState<string>('')
  const [backgroundPreviewBase64, setBackgroundPreviewBase64] = useState<string>('')
  const [flagImageBase64, setFlagImageBase64] = useState<string>('')
  const [debugCanvasUrl, setDebugCanvasUrl] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    const loadAssetsAsBase64 = async () => {
      try {
        setBackgroundImageBase64('')
        setBackgroundPreviewBase64('')
        const response = await fetch(template.imageUrl)
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = async () => {
          if (!isMounted) return
          const base64 = reader.result as string
          setBackgroundImageBase64(base64)
          try {
            const img = new Image()
            img.src = base64
            await img.decode()
            const previewCanvas = document.createElement('canvas')
            previewCanvas.width = 360
            previewCanvas.height = 520
            const previewCtx = previewCanvas.getContext('2d')
            if (!previewCtx) return
            drawBackgroundWithFocus(previewCtx, img, previewCanvas.width, previewCanvas.height)
            if (isMounted) setBackgroundPreviewBase64(previewCanvas.toDataURL('image/png'))
          } catch (previewError) {
            console.error('Erreur génération background preview:', previewError)
          }
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.error('Erreur chargement background:', error)
      }
    }
    loadAssetsAsBase64()
    return () => { isMounted = false }
  }, [template.imageUrl])

  useEffect(() => {
    if (!customization.flagUrl) { setFlagImageBase64(''); return; }
    const loadFlagAsBase64 = async () => {
      if (!customization.flagUrl) return;
      try {
        const response = await fetch(customization.flagUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setFlagImageBase64(reader.result as string);
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Erreur chargement drapeau:', error);
        setFlagImageBase64('');
      }
    }
    loadFlagAsBase64()
  }, [customization.flagUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] }, maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        setOriginalUserPhoto(photoData); // Sauvegarder la photo BRUTE
        setCustomization(prev => ({ ...prev, photo: photoData, removeBackground: false }));
      };
      reader.readAsDataURL(file);
    },
  })

  const handleRemoveBackground = async () => {
    if (!customization.photo) return

    setIsProcessing(true)
    try {
      // Conversion base64 en blob
      const base64Response = await fetch(customization.photo)
      const blob = await base64Response.blob()

      // Appel à l'API Pixian
      const formData = new FormData()
      formData.append('image_file', blob)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression du fond')
      }

      const data = await response.json()
      setCustomization(prev => ({
        ...prev,
        photo: data.imageUrl,
        removeBackground: true
      }))
    } catch (error) {
      console.error('Erreur:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression du fond')
    } finally {
      setIsProcessing(false)
    }
  }

  // Une nouvelle fonction juste pour le débogage
  const handleDebugRender = async () => {
    const imageUrl = await handleExportCard(true)
    if (imageUrl) {
      setDebugCanvasUrl(imageUrl)
    }
  }

  // --- VERSION FINALE ET CORRIGÉE DE L'EXPORT ---
  const handleExportCard = async (debugMode = false) => {
    setIsProcessing(true)
    try {
      const scale = 4.5
      const canvas = document.createElement('canvas')
      canvas.width = 360 * scale
      canvas.height = 520 * scale
      const ctx = canvas.getContext('2d', { alpha: false }) // On désactive la transparence pour un fond uni
      if (!ctx) throw new Error('Impossible de créer le contexte canvas')

      // --- SÉQUENCE DE DESSIN CORRIGÉE ---

      // 1. SAUVEGARDE ET CLIP
      ctx.save() // Sauvegarde l'état initial (sans clip)
      drawPolygonOnCanvas(ctx, POLYGON_CLIP_PATH, canvas.width, canvas.height)
      ctx.clip() // Applique le clip. Tout ce qui suit sera DANS le polygone.

      // 2. DESSIN DE TOUT LE CONTENU CLIPPÉ
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height); // Fond de couleur
      
      // Image de fond
      if (backgroundImageBase64) {
        const img = new Image()
        img.src = backgroundImageBase64
        await img.decode()
        drawBackgroundWithFocus(ctx, img, canvas.width, canvas.height)
      }
      
      // Photo du combattant
      if (customization.photo) {
        const img = new Image(); img.src = customization.photo; await img.decode();
        const { x, y, width, height } = template.positions.photo
        const destX = x * scale, destY = y * scale, destW = width * scale, destH = height * scale
        const imgRatio = img.width / img.height, boxRatio = destW / destH
        let sx = 0, sy = 0, sw = img.width, sh = img.height
        if (imgRatio > boxRatio) { sw = img.height * boxRatio; sx = (img.width - sw) / 2; } 
        else { sh = img.width / boxRatio; sy = 0; }
        ctx.drawImage(img, sx, sy, sw, sh, destX, destY, destW, destH)
      }
      
      // Badge OVR SANS ENCADREMENT - Juste le texte avec ombres
      const { x: rX, y: rY, fontSize: rFS } = template.positions.rating
      const ratingX = rX * scale, ratingY = rY * scale

      // Texte OVR rating avec ombre forte
      ctx.fillStyle = 'white'
      ctx.font = `900 ${rFS * scale}px "Inter Tight", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.shadowColor = hexToRgba(templateColor, 0.9)
      ctx.shadowBlur = 25 * scale
      ctx.shadowOffsetY = 4 * scale
      ctx.fillText(customization.rating.toString(), ratingX + 35 * scale, ratingY)

      

      // MMA label avec ombre
      const { x: sX, y: sY, fontSize: sFS } = template.positions.sport
      ctx.fillStyle = 'white'
      ctx.font = `700 ${sFS * scale}px "Inter Tight", sans-serif`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 12 * scale
      ctx.fillText('MMA', sX * scale, sY * scale)
      ctx.shadowBlur = 0

      // Drapeau
      if (flagImageBase64) {
        const img = new Image()
        img.src = flagImageBase64
        await img.decode()
        const { x, y, width, height } = template.positions.flag
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
        ctx.shadowBlur = 10 * scale
        ctx.shadowOffsetY = 4 * scale
        ctx.drawImage(img, x * scale, y * scale, width * scale, height * scale)
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
      }

      // FOND DÉGRADÉ pour le bas de la carte
      const gradientStartY = (template.positions.name.y - 30) * scale
      const footerGradient = ctx.createLinearGradient(0, gradientStartY, 0, canvas.height)
      footerGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      footerGradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)')
      ctx.fillStyle = footerGradient
      ctx.fillRect(0, gradientStartY, canvas.width, canvas.height - gradientStartY)

      // NOM DU COMBATTANT - Utilise template.positions.name
      const nameText = customization.name || 'FIGHTER'
      const { x: nameX, y: nameY, fontSize: nameFontSize } = template.positions.name

      ctx.font = `900 ${nameFontSize * scale}px "Inter Tight", sans-serif`
      ctx.letterSpacing = `${3 * scale}px`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Triple ombre pour effet 3D profond
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
      ctx.shadowBlur = 30 * scale
      ctx.shadowOffsetY = 8 * scale
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.fillText(nameText, nameX * scale, (nameY * scale) + (2 * scale))

      ctx.shadowColor = hexToRgba(templateColor, 0.8)
      ctx.shadowBlur = 40 * scale
      ctx.shadowOffsetY = 0
      ctx.fillStyle = 'white'
      ctx.fillText(nameText, nameX * scale, nameY * scale)

      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0
      ctx.letterSpacing = '0px'

      // Ligne de séparation sous le nom (textBaseline middle donc nameY est au centre)
      const underlineWidth = canvas.width * 0
      const underlineX = (canvas.width - underlineWidth) / 2
      const underlineY = (nameY * scale) + (nameFontSize * scale / 2) + 8 * scale
      ctx.fillStyle = hexToRgba(templateColor, 0.25)
      ctx.fillRect(underlineX, underlineY, underlineWidth, 2 * scale)

      // Stats - Utilise template.positions.stats
      const statsList = [
        { key: 'force', label: 'FORCE' },
        { key: 'rapidite', label: 'RAPIDITÉ' },
        { key: 'grappling', label: 'GRAPPLING' },
        { key: 'endurance', label: 'ENDURANCE' },
        { key: 'striking', label: 'STRIKING' },
        { key: 'equilibre', label: 'ÉQUILIBRE' }
      ]

      const statsConfig = template.positions.stats
      const startY = statsConfig.y * scale
      const columnGap = 8 * scale  // Espace entre les colonnes
      const col1X = (statsConfig.x - statsConfig.columnWidth - columnGap / 2) * scale
      const col2X = (statsConfig.x + columnGap / 2) * scale
      const columnWidth = statsConfig.columnWidth * scale
      const rowsCount = Math.ceil(statsList.length / 2)
      const separatorHeight = (rowsCount - 1) * statsConfig.rowSpacing * scale
      const separatorX = statsConfig.x * scale
      const separatorY = startY - 10 * scale
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
      ctx.fillRect(separatorX - (0.5 * scale), separatorY, 1 * scale, separatorHeight + 25 * scale)

      statsList.forEach((stat, i) => {
        const isCol1 = i % 2 === 0
        const x = isCol1 ? col1X : col2X
        const y = startY + Math.floor(i / 2) * statsConfig.rowSpacing * scale
        const value = customization.stats[stat.key as keyof typeof customization.stats]

        ctx.textBaseline = 'middle'

        if (isCol1) {
          // Colonne gauche : libellé vers l'extérieur, valeur tirée vers le centre
          ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
          ctx.font = `700 ${statsConfig.labelFontSize * scale}px "Inter Tight", sans-serif`
          ctx.textAlign = 'left'
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
          ctx.shadowBlur = 3 * scale
          ctx.fillText(stat.label, x, y)

          ctx.fillStyle = 'white'
          ctx.font = `900 ${statsConfig.fontSize * scale}px "Inter Tight", sans-serif`
          ctx.textAlign = 'right'
          ctx.shadowColor = hexToRgba(templateColor, 0.5)
          ctx.shadowBlur = 6 * scale
          ctx.fillText(value.toString(), x + columnWidth, y)
        } else {
          // Colonne droite : valeur vers le centre, libellé aligné vers l'extérieur
          ctx.fillStyle = 'white'
          ctx.font = `900 ${statsConfig.fontSize * scale}px "Inter Tight", sans-serif`
          ctx.textAlign = 'left'
          ctx.shadowColor = hexToRgba(templateColor, 0.5)
          ctx.shadowBlur = 6 * scale
          ctx.fillText(value.toString(), x, y)

          ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
          ctx.font = `700 ${statsConfig.labelFontSize * scale}px "Inter Tight", sans-serif`
          ctx.textAlign = 'right'
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
          ctx.shadowBlur = 3 * scale
          ctx.fillText(stat.label, x + columnWidth, y)
        }
        ctx.shadowBlur = 0
      })

      // 3. RESTAURATION ET DESSIN DE LA BORDURE SIMPLE
      ctx.restore() // Restaure l'état, supprime le clip.

      // Bordure unique épaisse blanche
      drawPolygonOnCanvas(ctx, POLYGON_CLIP_PATH, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.lineWidth = 4 * scale
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.stroke()

      // 4. FINALISATION ET UPLOAD
      const dataUrl = canvas.toDataURL('image/png', 0.95) // Qualité augmentée pour HD

      // Si on est en mode débogage, on retourne juste l'image et on arrête
      if (debugMode) {
        setIsProcessing(false)
        return dataUrl
      }

      // Sinon, on continue le processus normal d'upload DIRECT vers Cloudinary
      // Conversion du data URL en Blob pour l'upload
      const blob = await fetch(dataUrl).then(res => res.blob())

      const formData = new FormData()
      formData.append('file', blob)
      formData.append('upload_preset', 'fight-cards-unsigned')

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        console.error('Erreur upload Cloudinary:', errorData)
        throw new Error('Erreur upload Cloudinary')
      }

      const uploadData = await uploadResponse.json()
      const cloudinaryUrl = uploadData.secure_url

      console.log('Image HD uploadée sur Cloudinary:', {
        url: cloudinaryUrl,
        width: uploadData.width,
        height: uploadData.height,
        format: uploadData.format,
        size: `${(uploadData.bytes / 1024 / 1024).toFixed(2)} MB`,
      })

      if (onSave) onSave(cloudinaryUrl, { ...customization, photo: cloudinaryUrl }, originalUserPhoto)
      else alert('Veuillez finaliser votre commande')

    } catch (error) { console.error('Erreur lors de la génération de la carte:', error); alert('Une erreur est survenue.') }
    finally { setIsProcessing(false) }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-6 animate-fade-in">
      {/* Panneau de contrôle */}
      <div className="space-y-6 lg:order-1">
        <div className="mb-8"><div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4"><svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg><span className="text-xs font-bold text-blue-500 tracking-wide">Personnalisation</span></div><h2 className="text-3xl font-black tracking-tight">Créez Votre <span className="text-blue-500">Carte</span></h2><p className="text-gray-400 mt-2">Remplissez tous les champs ci-dessous pour personnaliser votre carte</p></div>
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 mb-6"><div className="flex items-start gap-3"><svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg><div className="text-sm"><p className="font-medium text-white mb-1">Comment ça marche :</p><ul className="text-gray-400 space-y-1 list-disc list-inside"><li>Ajoutez votre photo de combat</li><li>Entrez votre nom et vos statistiques</li><li>Visualisez en temps réel à droite</li><li>Cliquez sur &quot;Passer commande&quot; quand c&apos;est prêt</li></ul></div></div></div>
        <div className="space-y-3"><label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Photo du combattant</label><div {...getRootProps()} className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-blue-600 bg-blue-600/10 scale-105' : 'border-white/10 hover:border-blue-600/50 bg-[#0f0f0f]'}`}><input {...getInputProps()} /><div className={`transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`}><Upload className="mx-auto mb-4 text-blue-500" size={48} /><p className="text-white font-medium mb-1">{isDragActive ? 'Déposez la photo ici' : 'Glissez une photo ici'}</p><p className="text-sm text-gray-300">ou cliquez pour sélectionner</p></div></div>{customization.photo && !customization.removeBackground && (<button onClick={handleRemoveBackground} disabled={isProcessing} className="btn-secondary w-full disabled:opacity-50">{isProcessing ? (<span className="flex items-center justify-center gap-2"><div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>Traitement...</span>) : ('Supprimer le fond')}</button>)}</div>
        <div className="space-y-3"><label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Nom du combattant</label><input type="text" value={customization.name} onChange={(e) => setCustomization(prev => ({ ...prev, name: e.target.value.toUpperCase() }))} className="input-modern w-full" placeholder='Ex: FIGHTER'/><p className="text-xs text-gray-300">Le nom sera automatiquement en majuscules</p></div>
        <div className="space-y-3"><label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Note globale</label><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-400">OVERALL RATING</span><span className="text-sm font-bold text-blue-500">{customization.rating}</span></div><div className="relative pt-1"><input type="range" min="0" max="100" value={customization.rating} onChange={(e) => setCustomization(prev => ({ ...prev, rating: parseInt(e.target.value) || 0 }))} style={{ background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${customization.rating}%, rgba(255, 255, 255, 0.1) ${customization.rating}%, rgba(255, 255, 255, 0.1) 100%)` }} className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50 [&::-webkit-slider-thumb]:hover:bg-blue-400 [&::-webkit-slider-thumb]:transition-colors [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:bg-blue-400 [&::-moz-range-thumb]:transition-colors [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent"/></div></div>
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Drapeau (optionnel)</label>
          <select
            value={selectedCountryCode}
            onChange={(e) => {
              const code = e.target.value;
              setSelectedCountryCode(code);
              const flagUrl = code ? `https://flagcdn.com/w320/${code}.png` : '';
              setCustomization(prev => ({ ...prev, flagUrl }));
            }}
            className="input-modern w-full"
          >
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-300">Sélectionnez le pays du combattant</p>
        </div>
        <div className="space-y-3"><label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Statistiques du combattant</label><div className="premium-card p-6 space-y-1.5">{[
          { key: 'force', label: 'Force', Icon: Dumbbell },
          { key: 'rapidite', label: 'Rapidité', Icon: Zap },
          { key: 'grappling', label: 'Grappling', Icon: Users },
          { key: 'endurance', label: 'Endurance', Icon: Heart },
          { key: 'striking', label: 'Striking', Icon: Crosshair },
          { key: 'equilibre', label: 'Équilibre', Icon: Scale }
        ].map((stat) => {
          const StatIcon = stat.Icon;
          return (
            <div key={stat.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <StatIcon className="w-3.5 h-3.5" />
                  {stat.label}
                </label>
                <span className="text-sm font-bold text-blue-500">
                  {customization.stats[stat.key as keyof typeof customization.stats]}
                </span>
              </div>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customization.stats[stat.key as keyof typeof customization.stats]}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    stats: { ...prev.stats, [stat.key]: parseInt(e.target.value) || 0 }
                  }))}
                  style={{
                    background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${customization.stats[stat.key as keyof typeof customization.stats]}%, rgba(255, 255, 255, 0.1) ${customization.stats[stat.key as keyof typeof customization.stats]}%, rgba(255, 255, 255, 0.1) 100%)`
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50 [&::-webkit-slider-thumb]:hover:bg-blue-400 [&::-webkit-slider-thumb]:transition-colors [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:bg-blue-400 [&::-moz-range-thumb]:transition-colors [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent"
                />
              </div>
            </div>
          )
        })}</div></div>

        {/* --- NOUVELLE SECTION DE DÉBOGAGE --- */}
        <div className="space-y-3 pt-4 border-t-2 border-dashed border-red-500/50 mt-6">
          <h3 className="text-lg font-bold text-red-500 uppercase">Outils de Développeur</h3>
          <p className="text-xs text-gray-400">
            Utilisez ce bouton pour générer un aperçu HD sans uploader l&apos;image.
            L&apos;image apparaîtra sous l&apos;aperçu en temps réel.
          </p>
          <button
            onClick={handleDebugRender}
            disabled={isProcessing || !customization.photo}
            className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}
          >
            Générer l&apos;Aperçu Canvas HD
          </button>
        </div>
        {/* --- FIN DE LA SECTION --- */}

        <div className="space-y-3 pt-4"><button onClick={() => handleExportCard()} disabled={isProcessing || !customization.photo} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">{isProcessing ? (<span className="flex items-center justify-center gap-3"><div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>Génération en cours...</span>) : ( <span className="flex items-center justify-center gap-2"><Download size={20} />Passer commande</span> )}</button><button onClick={() => { setCustomization({ templateId: template.id, photo: '', username: '', name: '', rating: 85, flagUrl: '', removeBackground: false, stats: { force: 90, rapidite: 85, grappling: 88, endurance: 80, striking: 82, equilibre: 87 } }); setSelectedCountryCode(''); }} className="btn-outline w-full"><span className="flex items-center justify-center gap-2"><Trash2 size={18} />Réinitialiser</span></button></div>
      </div>
      {/* Aperçu de la carte - sticky à partir de l'étape 2 */}
      <div className="flex flex-col items-center justify-start lg:sticky lg:top-6 lg:self-start lg:order-2">
        <div className="mb-6 text-center"><div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full mb-2"><div className="relative"><div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div><div className="absolute inset-0 h-2 w-2 bg-blue-500 rounded-full animate-ping"></div></div><span className="text-sm font-bold text-blue-500 tracking-wide uppercase">Aperçu en Temps Réel</span></div><p className="text-xs text-gray-300">Vos modifications apparaissent instantanément</p></div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          {/* Bordure simple épaisse blanche */}
          <div className="relative" style={{ width: '360px', height: '520px' }}>
            {/* Ombre portée douce */}
            <div className="absolute inset-0" style={{
              clipPath: POLYGON_CLIP_PATH,
              background: 'rgba(0, 0, 0, 0.4)',
              filter: 'blur(12px)',
              transform: 'translateY(4px)'
            }}></div>
            {/* Bordure blanche épaisse */}
            <div className="absolute inset-0" style={{
              clipPath: POLYGON_CLIP_PATH,
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '4px'
            }}>
              {/* Contenu de la carte */}
              <div ref={cardRef} className="relative w-full h-full overflow-hidden" style={{ backgroundColor: '#1a1a1a', clipPath: POLYGON_CLIP_PATH }}>
              {(backgroundPreviewBase64 || backgroundImageBase64) && (<img
                src={backgroundPreviewBase64 || backgroundImageBase64}
                alt=""
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '360px',
                  height: '520px',
                  objectFit: 'cover',
                  objectPosition: 'top center'
                }}
              />)}
              {customization.photo && (<div style={{ position: 'absolute', zIndex: 10, left: `${template.positions.photo.x}px`, top: `${template.positions.photo.y}px`, width: `${template.positions.photo.width}px`, height: `${template.positions.photo.height}px` }}><img src={customization.photo} alt="Fighter" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}/></div>)}
              <div className="absolute z-20 text-center" style={{ left: `${template.positions.rating.x}px`, top: `${template.positions.rating.y}px`, width: '70px' }}><div className="font-black text-white" style={{ fontSize: `${template.positions.rating.fontSize}px`, fontFamily: 'var(--font-inter-tight), sans-serif', textShadow: `0 0 25px ${hexToRgba(templateColor, 0.9)}, 0 4px 12px rgba(0,0,0,0.9)`, lineHeight: '1' }}>{customization.rating}</div></div>
              <div className="absolute z-20 text-white font-bold" style={{ left: `${template.positions.sport.x}px`, top: `${template.positions.sport.y}px`, fontSize: `${template.positions.sport.fontSize}px`, fontFamily: 'var(--font-inter-tight), sans-serif', textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>MMA</div>
              {customization.flagUrl && (<img src={customization.flagUrl} alt="Flag" className="absolute z-20 rounded shadow-lg" style={{ left: `${template.positions.flag.x}px`, top: `${template.positions.flag.y}px`, width: `${template.positions.flag.width}px`, height: `${template.positions.flag.height}px`, objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }}/>)}

              {/* FOND DÉGRADÉ POUR LE BAS DE LA CARTE */}
              <div className="absolute z-10 w-full" style={{ top: `${template.positions.name.y - 30}px`, bottom: '0px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)', backdropFilter: 'blur(15px)' }}></div>

              {/* NOM DU COMBATTANT - Utilise template.positions.name */}
              <div className="absolute z-20 text-center" style={{ left: `${template.positions.name.x}px`, top: `${template.positions.name.y}px`, transform: 'translate(-50%, -50%)' }}>
                <div className="font-black text-white tracking-widest" style={{ whiteSpace: 'nowrap', fontSize: `${template.positions.name.fontSize}px`, fontFamily: 'var(--font-inter-tight), sans-serif', textShadow: `0 8px 30px rgba(0,0,0,0.9), 0 0 40px ${hexToRgba(templateColor, 0.8)}`, letterSpacing: '3px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))', lineHeight: '1' }}>{customization.name || 'FIGHTER'}</div>
                <div className="h-[0.1px] w-40 mx-auto rounded-full mt-2" style={{ background: `linear-gradient(90deg, transparent 0%, ${hexToRgba(templateColor, 0.45)} 50%, transparent 100%)`, boxShadow: `0 0 12px ${hexToRgba(templateColor, 0.5)}` }}></div>
              </div>

              {/* STATS - Positionnées exactement comme le Canvas */}
              <div className="absolute z-20 w-full" style={{ top: '0px', left: '0px', right: '0px' }}>
                {/* Séparateur vertical central */}
                <div className="absolute left-1/2" style={{
                  top: `${template.positions.stats.y - 10}px`,
                  height: `${(3 - 1) * template.positions.stats.rowSpacing + 20}px`,
                  width: '2px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateX(-50%)'
                }}></div>

                {[
                  { key: 'force', label: 'FORCE' },
                  { key: 'rapidite', label: 'RAPIDITÉ' },
                  { key: 'grappling', label: 'GRAPPLING' },
                  { key: 'endurance', label: 'ENDURANCE' },
                  { key: 'striking', label: 'STRIKING' },
                  { key: 'equilibre', label: 'ÉQUILIBRE' }
                ].map((stat, i) => {
                  const isCol1 = i % 2 === 0
                  const columnGap = 46  // Espace entre les colonnes
                  const col1X = template.positions.stats.x - template.positions.stats.columnWidth - columnGap / 2
                  const col2X = template.positions.stats.x + columnGap / 2
                  const x = isCol1 ? col1X : col2X
                  const y = template.positions.stats.y + Math.floor(i / 2) * template.positions.stats.rowSpacing
                  const value = customization.stats[stat.key as keyof typeof customization.stats]

                  return (
                    <div
                      key={stat.key}
                      className="absolute flex items-center"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        width: `${template.positions.stats.columnWidth}px`,
                        transform: 'translateY(-50%)',
                        justifyContent: isCol1 ? 'space-between' : 'space-between',
                        gap: '10px'
                      }}
                    >
                      {isCol1 ? (
                        <>
                          <span
                            className="font-semibold text-white uppercase"
                            style={{
                              fontSize: `${template.positions.stats.labelFontSize}px`,
                              fontFamily: 'var(--font-inter-tight), sans-serif',
                              letterSpacing: '1.2px',
                              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                              lineHeight: '1'
                            }}
                          >
                            {stat.label}
                          </span>
                          <span
                            className="font-black text-white"
                            style={{
                              fontSize: `${template.positions.stats.fontSize}px`,
                              fontFamily: 'var(--font-inter-tight), sans-serif',
                              textShadow: `0 0 10px ${hexToRgba(templateColor, 0.45)}`,
                              lineHeight: '1'
                            }}
                          >
                            {value}
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className="font-black text-white"
                            style={{
                              fontSize: `${template.positions.stats.fontSize}px`,
                              fontFamily: 'var(--font-inter-tight), sans-serif',
                              textShadow: `0 0 10px ${hexToRgba(templateColor, 0.45)}`,
                              lineHeight: '1'
                            }}
                          >
                            {value}
                          </span>
                          <span
                            className="font-semibold text-white uppercase"
                            style={{
                              fontSize: `${template.positions.stats.labelFontSize}px`,
                              fontFamily: 'var(--font-inter-tight), sans-serif',
                              letterSpacing: '1.2px',
                              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                              lineHeight: '1'
                            }}
                          >
                            {stat.label}
                          </span>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- NOUVEL APERÇU CANVAS (si généré) --- */}
        {debugCanvasUrl && (
          <div className="mt-8 border-t-2 border-dashed border-red-500/50 pt-8 text-center">
            <h3 className="text-lg font-bold text-red-500 uppercase mb-4">Aperçu Rendu Canvas HD</h3>
            <img
              src={debugCanvasUrl}
              alt="Aperçu Canvas"
              className="rounded-xl shadow-2xl"
              style={{ width: '360px', height: '520px' }}
            />
            <button
              onClick={() => setDebugCanvasUrl(null)}
              className="btn-outline mt-4"
            >
              Cacher l&apos;aperçu Canvas
            </button>
          </div>
        )}
        {/* --- FIN DE L'APERÇU CANVAS --- */}
      </div>
    </div>
  )
}
