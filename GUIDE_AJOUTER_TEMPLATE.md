# 📝 Guide: Comment ajouter un nouveau template

Ce guide vous explique comment ajouter facilement de nouveaux templates à votre application Fight Card.

## 🎯 Méthode simple (Recommandée)

### Étape 1: Choisir votre background

Vous avez **2 options**:

#### Option A: Background CSS (0 KB - Recommandé ✅)
- Ouvrez `gradient-tester-advanced.html` dans votre navigateur
- Choisissez un background CSS qui vous plaît
- Copiez le code CSS affiché sous la preview

#### Option B: Image optimisée (~100-200 KB)
- Téléchargez une image depuis Unsplash en taille "Small" (w=400-500px)
- Placez l'image dans `/public/` (ex: `/public/mon-nouveau-bg.jpg`)

---

### Étape 2: Ajouter le template dans le code

Ouvrez `/app/page.tsx` et trouvez la section `defaultTemplates` (ligne ~58).

**Ajoutez votre nouveau template** après les 3 existants:

```typescript
const defaultTemplates: CardTemplate[] = [
  // Template 1 : UFC Style
  { ... },

  // Template 2 : Boxing Ring
  { ... },

  // Template 3 : Space Fighter
  { ... },

  // 🆕 VOTRE NOUVEAU TEMPLATE ICI
  {
    id: 'mon-template',              // ⚠️ Unique! (pas de caractères spéciaux)
    name: 'Mon Super Template',      // Nom affiché à l'utilisateur
    imageUrl: '/mon-nouveau-bg.jpg', // Chemin vers l'image dans /public/
    category: 'mma',                 // 'mma', 'boxing', ou 'other'
    positions: {
      // Position de la photo du combattant
      photo: { x: 50, y: 80, width: 260, height: 280 },

      // Position du nom d'utilisateur (optionnel, pas utilisé actuellement)
      username: { x: 180, y: 35, fontSize: 16 },

      // Position de la note globale (ex: 85)
      rating: { x: 35, y: 40, fontSize: 32 },

      // Position du sport (ex: "MMA")
      sport: { x: 35, y: 82, fontSize: 14 },

      // Position du nom du combattant (ex: "FIGHTER")
      name: { x: 180, y: 340, fontSize: 28 },

      // Position et taille du drapeau
      flag: { x: 280, y: 45, width: 35, height: 25 },

      // Position des statistiques (le bloc en bas)
      stats: { x: 35, y: 390, fontSize: 14 },
    },
  },
]
```

---

### Étape 3: Utiliser un background CSS (Option A)

Si vous voulez utiliser un **gradient CSS au lieu d'une image**, modifiez `/components/CardEditor.tsx`:

Trouvez la fonction `useEffect` qui charge le background (ligne ~39):

```typescript
// Convertir l'image de fond en base64 au chargement
useEffect(() => {
  const loadBackgroundAsBase64 = async () => {
    try {
      // 🆕 AJOUTEZ VOTRE CONDITION ICI
      if (template.imageUrl === 'css:mon-gradient') {
        // Ne rien faire - on utilisera du CSS pur
        setBackgroundImageBase64('css')
        return
      }

      const response = await fetch(template.imageUrl)
      const blob = await response.blob()
      const reader = new FileReader()
      reader.onloadend = () => {
        setBackgroundImageBase64(reader.result as string)
      }
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('Erreur chargement background:', error)
      setBackgroundImageBase64(template.imageUrl)
    }
  }
  loadBackgroundAsBase64()
}, [template.imageUrl])
```

Puis dans le JSX (ligne ~423), modifiez le rendu du background:

```typescript
{/* Image de fond du template */}
{backgroundImageBase64 === 'css' ? (
  // 🆕 BACKGROUND CSS
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '360px',
    height: '520px',
    // Collez votre code CSS ici (du testeur)
    background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 0, 0, 0.4) 0%, transparent 60%), linear-gradient(135deg, #1a0000 0%, #000000 50%, #1a0000 100%)',
  }} />
) : backgroundImageBase64 && (
  // Image normale
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
```

Et mettez à jour votre template dans `page.tsx`:

```typescript
{
  id: 'mon-template',
  name: 'Mon Super Template',
  imageUrl: 'css:mon-gradient', // ⚠️ Utiliser 'css:' comme préfixe
  category: 'mma',
  positions: { ... }
}
```

---

## 🎨 Ajuster les positions

Les positions sont basées sur un canvas de **360px × 520px**.

Pour ajuster les positions:

1. Ouvrez votre app en développement (`npm run dev`)
2. Sélectionnez votre nouveau template
3. Uploadez une photo de test
4. Utilisez l'inspecteur du navigateur (F12) pour voir les positions actuelles
5. Ajustez les valeurs `x`, `y`, `width`, `height`, `fontSize` dans `page.tsx`
6. Rafraîchissez la page pour voir les changements

**Astuces:**
- `x: 0, y: 0` = coin supérieur gauche
- `x: 180` = centre horizontal (360/2)
- `y: 260` = centre vertical (520/2)
- Pour centrer du texte: utilisez `text-align: center` et `x` au centre

---

## 📋 Checklist complète

- [ ] Background choisi (CSS ou image optimisée)
- [ ] Image placée dans `/public/` (si image)
- [ ] Template ajouté dans `defaultTemplates` dans `/app/page.tsx`
- [ ] `id` unique défini
- [ ] Positions configurées (photo, rating, name, flag, stats)
- [ ] Testé en développement (`npm run dev`)
- [ ] Positions ajustées si nécessaire
- [ ] Carte générée testée (qualité HD, background visible)

---

## 🚀 Exemple complet: Ajouter un template "Fire Fighter"

### 1. Choisir le background CSS "Fire Arena" du testeur

```css
background:
  radial-gradient(ellipse at 50% 100%, rgba(255, 69, 0, 0.4) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 50%, rgba(139, 0, 0, 0.3) 0%, transparent 40%),
  linear-gradient(180deg, #1a0000 0%, #000000 100%);
```

### 2. Ajouter dans `/app/page.tsx`

```typescript
{
  id: 'fire',
  name: 'Fire Fighter',
  imageUrl: 'css:fire-arena',
  category: 'mma',
  positions: {
    photo: { x: 50, y: 80, width: 260, height: 280 },
    username: { x: 180, y: 35, fontSize: 16 },
    rating: { x: 35, y: 40, fontSize: 32 },
    sport: { x: 35, y: 82, fontSize: 14 },
    name: { x: 180, y: 340, fontSize: 28 },
    flag: { x: 280, y: 45, width: 35, height: 25 },
    stats: { x: 35, y: 390, fontSize: 14 },
  },
}
```

### 3. Modifier `/components/CardEditor.tsx`

Dans le `useEffect`:
```typescript
if (template.imageUrl === 'css:fire-arena') {
  setBackgroundImageBase64('css:fire-arena')
  return
}
```

Dans le JSX:
```typescript
{backgroundImageBase64 === 'css:fire-arena' ? (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '360px',
    height: '520px',
    background: `
      radial-gradient(ellipse at 50% 100%, rgba(255, 69, 0, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 50%, rgba(139, 0, 0, 0.3) 0%, transparent 40%),
      linear-gradient(180deg, #1a0000 0%, #000000 100%)
    `,
  }} />
) : backgroundImageBase64 && (
  <img ... />
)}
```

### 4. Mettre à jour le Canvas dans `handleExportCard`

Dans `/components/CardEditor.tsx`, trouvez la fonction `handleExportCard` (ligne ~105) et ajoutez:

```typescript
// Dessiner l'image de fond du template
if (template.imageUrl === 'css:fire-arena') {
  // Dessiner le gradient manuellement sur le canvas
  const gradient1 = ctx.createRadialGradient(
    canvas.width / 2, canvas.height, 0,
    canvas.width / 2, canvas.height, canvas.height * 0.6
  )
  gradient1.addColorStop(0, 'rgba(255, 69, 0, 0.4)')
  gradient1.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient1
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Gradient de base
  const gradient2 = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient2.addColorStop(0, '#1a0000')
  gradient2.addColorStop(1, '#000000')
  ctx.fillStyle = gradient2
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  console.log('✓ Background CSS Fire dessiné')
} else if (backgroundImageBase64 && !backgroundImageBase64.startsWith('css:')) {
  // Image normale
  const bgImg = new Image()
  bgImg.src = backgroundImageBase64
  await new Promise((resolve, reject) => {
    bgImg.onload = resolve
    bgImg.onerror = reject
  })
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
  console.log('✓ Background dessiné')
}
```

---

## 💡 Conseils Pro

1. **Utilisez des backgrounds CSS** pour économiser Cloudinary (0 KB vs 100-200 KB)
2. **Gardez les mêmes positions** pour tous les templates au début (copier-coller), ajustez ensuite
3. **Testez toujours la génération HD** avant de valider
4. **Utilisez des IDs courts** et descriptifs: 'fire', 'neon', 'matrix'
5. **Catégories**: 'mma', 'boxing', 'other' (pour filtrage futur)

---

## 🆘 Problèmes courants

### Le background ne s'affiche pas
- Vérifiez que l'image est bien dans `/public/`
- Vérifiez que le chemin commence par `/` (ex: `/mon-bg.jpg`)
- Pour CSS: vérifiez que vous avez ajouté la condition dans `useEffect` et le JSX

### Les positions sont décalées
- Les valeurs sont pour un canvas de 360×520px
- Ajustez par petits incréments (±10px)
- Utilisez l'inspecteur pour voir les valeurs actuelles

### L'image générée n'a pas le background CSS
- Vérifiez que vous avez modifié `handleExportCard` pour dessiner le gradient sur le canvas
- Les gradients CSS ne sont pas automatiquement capturés, il faut les dessiner manuellement

---

## ✅ Vous êtes prêt!

Maintenant vous pouvez ajouter autant de templates que vous voulez en quelques minutes! 🚀

**Besoin d'aide?** Relisez ce guide ou demandez de l'aide.
