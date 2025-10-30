# 🔄 Nouveau Workflow - Upload Photo Originale + Admin Processing

## 📋 Vue d'ensemble

Le nouveau système sépare clairement:
1. **Frontend User**: Upload photo brute + preview canvas + paiement
2. **Admin Dashboard**: Récupération photo brute + traitement + génération carte finale

---

## 🎯 Problème Résolu

**Ancien système** (MAUVAIS ❌):
- User uploade photo → génère canvas → le canvas est uploadé sur Cloudinary
- Admin récupère le CANVAS (template+photo) au lieu de la photo brute
- Impossible de récupérer la photo originale pour la traiter

**Nouveau système** (BON ✅):
- User uploade photo BRUTE → sauvegardée séparément → preview canvas (juste pour aperçu)
- Photo BRUTE uploadée sur Cloudinary dans `/original-photos`
- Admin récupère la VRAIE photo originale
- Admin traite la photo (remove bg avec Canva/Remove.bg)
- Admin utilise le MÊME CardEditor pour générer la carte finale

---

## 🔧 Modifications Techniques

### 1. **CardEditor.tsx**

#### Ajout state pour photo originale:
```typescript
const [originalUserPhoto, setOriginalUserPhoto] = useState<string>('')
```

#### Sauvegarde lors de l'upload:
```typescript
onDrop: async (acceptedFiles) => {
  const file = acceptedFiles[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const photoData = e.target?.result as string;
    setOriginalUserPhoto(photoData); // ✅ Sauvegarder AVANT toute transformation
    setCustomization(prev => ({ ...prev, photo: photoData, removeBackground: false }));
  };
  reader.readAsDataURL(file);
}
```

#### Callback modifiée:
```typescript
interface CardEditorProps {
  template: CardTemplate
  onSave?: (imageUrl: string, customization: CardCustomization, originalPhoto: string) => void
}

// Dans handleExportCard:
if (onSave) onSave(cloudinaryUrl, { ...customization, photo: cloudinaryUrl }, originalUserPhoto)
```

---

### 2. **page.tsx (Frontend)**

#### State pour photo originale:
```typescript
const [originalUserPhoto, setOriginalUserPhoto] = useState<string>('')
```

#### Callback qui reçoit la photo:
```typescript
const handleSaveCard = (imageUrl: string, customization: CardCustomization, originalPhoto: string) => {
  setSavedImageUrl(imageUrl)
  setCurrentCustomization(customization)
  setOriginalUserPhoto(originalPhoto) // ✅ Sauvegarder la photo brute
  setIsCheckingOut(true)
}
```

#### Upload de la photo BRUTE (pas le canvas):
```typescript
const handleCheckout = async () => {
  // Upload photo ORIGINALE (pas le canvas généré)
  const photoBlob = await fetch(originalUserPhoto).then(res => res.blob())
  const photoUrl = await uploadToCloudinary(photoBlob, 'original-photos')

  // Créer commande avec photo originale
  const response = await fetch('/api/create-order', {
    method: 'POST',
    body: JSON.stringify({
      photo_url: photoUrl,      // ✅ Photo BRUTE
      customization: currentCustomization,
      customer_email: customerEmail,
    }),
  })

  // Redirection Stripe
  if (data.success && data.url) {
    window.location.href = data.url
  }
}
```

---

### 3. **lib/cloudinary-upload.ts**

Utilitaire pour upload vers Cloudinary:

```typescript
export async function uploadToCloudinary(
  file: File | Blob,
  folder: CloudinaryFolder  // 'original-photos' | 'templates' | 'final-cards'
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'fight-cards-unsigned')
  formData.append('folder', `fight-cards/${folder}`)

  const response = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData })
  const data = await response.json()
  return data.secure_url
}
```

---

### 4. **/api/create-order/route.ts**

Nouvelle API qui:
1. Crée la commande avec `fighter_photo_url` (photo originale)
2. Crée la session Stripe
3. Retourne l'URL de redirection

```typescript
const { data: order } = await supabase
  .from('orders')
  .insert({
    customer_email,
    fighter_photo_url: photo_url,      // ✅ Photo originale
    customization,
    template_preview_url: null,         // Optionnel
    final_image_url: null,              // Sera généré par admin
    stripe_payment_id: 'pending',
    amount: FIXED_PRICE,
    status: 'pending'
  })
```

---

### 5. **Admin Order Details Page**

`/app/admin/orders/[id]/page.tsx`

#### Structure:
1. **Section Photo Originale**
   - Affiche `order.fighter_photo_url`
   - Bouton télécharger
   - Instructions pour l'admin

2. **Section CardEditor**
   - Même composant que le frontend
   - Pré-rempli avec les données du user
   - Admin upload photo traitée
   - Génère carte finale HD

3. **Section Carte Finale**
   - Affiche `order.final_image_url` si générée
   - Bouton télécharger

#### Code clé:
```typescript
<CardEditor
  template={template}
  onSave={handleSaveCard}
/>

const handleSaveCard = async (imageUrl: string, customization: CardCustomization) => {
  await fetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      final_image_url: imageUrl,
      customization,
      status: 'processing'
    })
  })
}
```

---

### 6. **Database Schema**

Migration SQL (`supabase-migration.sql`):

```sql
-- Ajouter colonne photo originale
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS fighter_photo_url TEXT;

-- Ajouter colonne template preview (optionnel)
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS template_preview_url TEXT;

-- Rendre final_image_url nullable
ALTER TABLE orders
ALTER COLUMN final_image_url DROP NOT NULL;

-- Ajouter statut 'processing'
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'processing', 'completed', 'delivered'));
```

---

## 🎬 Workflow Complet

### **User (Frontend)**

1. Upload photo (drag & drop)
2. *(Optionnel)* Clique "Retirer le fond" → modifie `customization.photo` MAIS `originalUserPhoto` reste intact
3. Remplit formulaire (nom, rating, stats)
4. Voit **preview canvas** (même qualité qu'avant)
5. Clique "Passer commande"
   - Upload photo **BRUTE** vers Cloudinary `/original-photos`
   - Création commande dans Supabase
   - Création session Stripe
   - Redirection vers Stripe

### **Admin (Dashboard)**

1. Accède `/admin` → Liste des commandes
2. Clique "👁️ Voir Détails" sur une commande
3. Voit `/admin/orders/[id]`:
   - **Photo originale** (celle uploadée par le user, sans modifications)
   - **Données du user** (nom, rating, stats)
   - **CardEditor** (même qu'en front)
4. Télécharge photo originale
5. Traite photo (Canva/Remove.bg pour retirer fond)
6. Upload photo traitée dans CardEditor
7. Ajuste paramètres si nécessaire
8. Clique "Télécharger Carte" dans CardEditor
   - Génère carte HD (même code que frontend)
   - Upload vers Cloudinary `/final-cards`
   - Sauvegarde dans `final_image_url`
   - Statut → `processing`

---

## 📁 Structure Cloudinary

```
fight-cards/
├── original-photos/     # Photos BRUTES uploadées par users
├── templates/           # (optionnel) Templates avec textes
└── final-cards/         # Cartes finales HD générées par admin
```

---

## ✅ Avantages

1. ✅ **Photo brute préservée** - Admin récupère la VRAIE photo
2. ✅ **Même éditeur** - Cohérence front/admin (même CardEditor.tsx)
3. ✅ **Flexibilité admin** - Peut ajuster tous les paramètres
4. ✅ **Pas de duplication code** - Réutilisation du même composant
5. ✅ **Workflow clair** - Séparation user/admin bien définie

---

## 🚀 Déploiement

### 1. Exécuter migration SQL
```bash
# Dans Supabase SQL Editor
-- Copier/coller supabase-migration.sql
```

### 2. Configurer Cloudinary
- Créer upload preset `fight-cards-unsigned`
- Mode: unsigned
- Folder: `fight-cards/`

### 3. Variables d'environnement
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_APP_URL=https://your-app.com
```

### 4. Tester
1. Frontend: Créer commande → Vérifier photo en Cloudinary `/original-photos`
2. Admin: Voir détails → Vérifier photo originale affichée
3. Admin: Générer carte → Vérifier carte en `/final-cards`

---

## 🐛 Troubleshooting

### Photo vide/noire dans admin
→ Vérifier que `fighter_photo_url` est bien sauvegardé dans la BDD

### CardEditor ne se pré-remplit pas
→ Vérifier que `customization` est passé correctement au composant

### Upload Cloudinary échoue
→ Vérifier upload preset `fight-cards-unsigned` existe et est unsigned

### Template non trouvé
→ Vérifier que le template existe dans Supabase avec le bon ID

---

## 📝 TODO

- [ ] Exécuter migration Supabase
- [ ] Configurer upload preset Cloudinary
- [ ] Tester création commande
- [ ] Tester admin workflow complet
- [ ] (Optionnel) Ajouter preview template sans photo

---

**Date**: 2025
**Version**: 2.0 - Photo Originale + Admin Processing
