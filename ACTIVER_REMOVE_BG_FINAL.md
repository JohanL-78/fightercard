# 🚀 Activation du Remove-BG Final (Sans Watermark)

## 📋 État Actuel

**Mode actuel :** Remove-BG en mode **TEST** (gratuit avec watermark Pixian)

✅ Preview fonctionne
✅ 0€ de coût
⚠️ Petit watermark Pixian visible sur les cartes finales

---

## 💰 Quand Activer le Mode Payant ?

### Seuil Recommandé
- **Dès 5-10 commandes** → Coût négligeable (0.04€)
- **Budget nécessaire :** ~5€ de crédits Pixian

### Coûts
| Commandes | Coût Pixian | CA Généré | % du CA |
|-----------|-------------|-----------|---------|
| 10 | 0.04€ | 150€ | 0.03% |
| 100 | 0.37€ | 1,500€ | 0.02% |
| 1,000 | 3.70€ | 15,000€ | 0.02% |

**Le coût est NÉGLIGEABLE comparé au CA !**

---

## 🔧 Comment Activer (3 étapes)

### Étape 1 : Acheter des Crédits Pixian

1. Va sur [https://pixian.ai/pricing](https://pixian.ai/pricing)
2. Achète un pack de crédits (5€ minimum recommandé)
3. Tu as déjà tes clés API dans `.env.local` :
   ```bash
   PIXIAN_API_ID='pxivt8fjm9a2zsf'
   PIXIAN_API_SECRET='nc4dh0d3kt3e1pnkq0v7sshji1c6u7i63c3sa73u74hvhd6klt59'
   ```

### Étape 2 : Activer le Code

Ouvre le fichier : `app/api/webhooks/stripe/route.ts`

**Trouve les lignes 78-142** (le bloc commenté qui commence par `/*`)

**Décommente tout le bloc** :
- Supprime `/*` (ligne 78)
- Supprime `*/` (ligne 142)

### Étape 3 : Redéployer

```bash
# En local
npm run dev

# En production (Vercel/Netlify)
git add .
git commit -m "Activation remove-bg final sans watermark"
git push
```

---

## ✅ Vérification

### Test Local

1. Crée une commande de test sur Stripe
2. Paie avec une carte test : `4242 4242 4242 4242`
3. Vérifie les logs :
   ```
   🎨 Génération carte finale avec remove-bg production...
   ✅ Image finale propre uploadée: https://...
   ```
4. Télécharge la carte → Plus de watermark ! 🎉

### Monitoring

Vérifie ta consommation Pixian sur leur dashboard :
- [https://pixian.ai/account](https://pixian.ai/account)

---

## 🔄 Comparaison Avant/Après

### AVANT (Mode Test - Actuel)
```
User édite → Remove-bg TEST (gratuit, watermark)
User paie → Reçoit carte avec watermark Pixian
```

### APRÈS (Mode Production - Activé)
```
User édite → Remove-bg TEST (gratuit, watermark)
User paie → Webhook → Remove-bg FINAL (payant, propre)
User reçoit → Carte HD sans watermark ✅
```

---

## 🎯 Code Modifié

### Fichier Impacté
- `app/api/webhooks/stripe/route.ts` (lignes 78-142)

### Ce Que Fait le Code

```typescript
// 1. Récupère la photo originale du combattant
const fighterPhoto = existingOrder.customization?.photo

// 2. Appelle Pixian en mode PRODUCTION (sans test=true)
const pixianResponse = await fetch('https://api.pixian.ai/...')

// 3. Upload l'image propre sur Cloudinary
const uploadResult = await cloudinary.uploader.upload(cleanImage)

// 4. Sauvegarde l'URL finale dans la BDD
finalImageUrl = uploadResult.secure_url
```

---

## ⚠️ Important

### Ne PAS Oublier

✅ Acheter des crédits Pixian AVANT d'activer
✅ Tester en local d'abord
✅ Vérifier les logs du webhook
✅ Tester un paiement complet

### En Cas de Problème

**Si erreur "Insufficient credits" :**
→ Achète plus de crédits sur Pixian

**Si l'image a toujours le watermark :**
→ Vérifie que le code est bien décommenté
→ Vérifie les logs du webhook
→ Redéploie l'app

**Si le webhook échoue :**
→ Regarde les logs Stripe : [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
→ Vérifie les variables d'environnement

---

## 📊 Tracking

### Combien Ça Coûte Vraiment ?

Tu peux suivre ta consommation exacte dans les logs :

```typescript
// Le webhook log automatiquement
console.log('✅ Image finale propre uploadée:', uploadResult.secure_url)
```

**Compteur manuel :**
- 1 log = 1 image = ~0.0037€
- Compte les logs sur 1 mois
- Multiplie par 0.0037€

---

## 🎉 Résultat Final

Une fois activé :
- ✅ Preview gratuite illimitée (avec watermark)
- ✅ Carte finale propre sans watermark
- ✅ Coût : 0.02% du CA
- ✅ Expérience utilisateur professionnelle

---

**Prêt à activer ? Lance-toi dès que tu as quelques commandes !** 🚀
