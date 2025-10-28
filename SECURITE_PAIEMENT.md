# 🔒 Sécurisation des Photos HD - Documentation

## ✅ Problème Résolu

Avant cette implémentation, **n'importe qui pouvait télécharger les photos HD sans payer**.

Maintenant, les photos HD sont **uniquement accessibles après paiement** avec vérification complète.

---

## 🛡️ Ce qui a été implémenté

### 1. **Désactivation du téléchargement direct**
📁 Fichier : `components/CardEditor.tsx`

**Avant** :
```typescript
// L'utilisateur pouvait cliquer et télécharger immédiatement
const link = document.createElement('a')
link.download = `fight-card-${Date.now()}.png`
link.href = imageUrl
link.click()
```

**Après** :
```typescript
// Le bouton force maintenant à passer par le paiement
if (onSave) {
  onSave(imageUrl, customization)
} else {
  alert('Veuillez finaliser votre commande pour obtenir votre carte')
}
```

Le bouton s'appelle maintenant **"Passer commande"** au lieu de "Télécharger".

---

### 2. **API de téléchargement sécurisé**
📁 Nouveau fichier : `app/api/orders/[orderId]/download/route.ts`

Cette API vérifie **3 choses** avant de donner accès à la photo :

1. ✅ **La commande existe** dans la base de données
2. ✅ **Le paiement a été validé** (présence de `stripe_payment_id`)
3. ✅ **Une photo est disponible** (`final_image_url` existe)

**Si tout est OK** → Génère une URL Cloudinary signée (valide 1 heure)
**Si problème** → Retourne une erreur 403 (Accès refusé)

```typescript
// Exemple de réponse
{
  "success": true,
  "downloadUrl": "https://res.cloudinary.com/.../card_xxx.png?signature=...",
  "expiresIn": 3600  // 1 heure
}
```

---

### 3. **Page de succès avec téléchargement**
📁 Fichier modifié : `app/success/page.tsx`

**Nouveau flux** :
1. Après paiement → Redirection vers `/success?order_id=xxx`
2. Affichage du bouton **"Télécharger ma carte HD"**
3. Au clic → Appel API `/api/orders/{orderId}/download`
4. Si paiement validé → Téléchargement automatique
5. Si échec → Message d'erreur clair

**Interface utilisateur** :
- ✅ Paiement validé (badge vert)
- 🔵 Bouton de téléchargement HD
- ⚠️ Gestion d'erreurs claire
- 🔄 Option "Télécharger à nouveau" si besoin

---

### 4. **Politiques de sécurité Supabase (RLS)**
📁 Nouveau fichier : `supabase-rls-update.sql`

**Avant** :
```sql
-- N'importe qui pouvait lire TOUTES les commandes
CREATE POLICY "Orders are viewable by admin only"
  ON orders FOR SELECT
  USING (true);  -- ❌ true = accès à tous !
```

**Après** :
```sql
-- Personne ne peut lire les commandes depuis le client
CREATE POLICY "Orders are not publicly readable"
  ON orders FOR SELECT
  USING (false);  -- ✅ false = accès bloqué !
```

**Important** : Vos APIs backend utilisent `getServiceSupabase()` qui contourne ces restrictions avec la `service_role` key.

---

## 🚀 Comment tester

### Test 1 : Vérifier que le téléchargement direct est bloqué
1. Allez sur `http://localhost:3000`
2. Créez une carte
3. Cliquez sur **"Passer commande"**
4. ✅ Vous êtes redirigé vers le paiement (pas de téléchargement direct)

### Test 2 : Vérifier le téléchargement après paiement
1. Complétez le paiement Stripe (utilisez le mode test)
2. Vous arrivez sur `/success?order_id=xxx`
3. Cliquez sur **"Télécharger ma carte HD"**
4. ✅ Le téléchargement démarre automatiquement

### Test 3 : Vérifier la sécurité API
Ouvrez la console de votre navigateur et tapez :
```javascript
// Essayer d'accéder à une commande non payée
fetch('/api/orders/fake-order-id/download')
  .then(r => r.json())
  .then(console.log)
// ✅ Devrait retourner : { error: "Commande introuvable" }
```

### Test 4 : Vérifier les RLS Supabase
**IMPORTANT** : Exécutez d'abord le script `supabase-rls-update.sql` dans votre dashboard Supabase.

Ensuite dans la console :
```javascript
import { supabase } from '@/lib/supabase'

// Essayer de lire toutes les commandes
const { data } = await supabase.from('orders').select('*')
console.log(data)
// ✅ Devrait être vide ou retourner une erreur
```

---

## 📋 Checklist de déploiement

Avant de mettre en production, vérifiez :

- [ ] Le script `supabase-rls-update.sql` a été exécuté dans Supabase
- [ ] Les variables d'environnement Cloudinary sont configurées :
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- [ ] La variable `NEXT_PUBLIC_APP_URL` pointe vers votre domaine de production
- [ ] Le webhook Stripe est configuré pour pointer vers `https://votre-domaine.com/api/webhooks/stripe`
- [ ] Vous avez testé un paiement complet en mode test Stripe

---

## 🔐 Niveau de sécurité actuel

| Aspect | Avant | Après |
|--------|-------|-------|
| **Téléchargement sans paiement** | ❌ Possible | ✅ Bloqué |
| **URLs Cloudinary** | ❌ Publiques permanentes | ✅ Signées (expire 1h) |
| **Accès base de données** | ❌ Public | ✅ Service role uniquement |
| **Vérification de paiement** | ❌ Aucune | ✅ Stripe payment_id vérifié |
| **Protection API** | ❌ Aucune | ✅ Vérifications multiples |

---

## 🛠️ Améliorations futures possibles

### 1. **Envoyer un email avec le lien de téléchargement**
Utilisez un service comme SendGrid ou Resend :
```typescript
// Dans le webhook Stripe
await sendEmail({
  to: order.customer_email,
  subject: 'Votre carte MyFightCard est prête !',
  body: `Téléchargez votre carte : ${process.env.NEXT_PUBLIC_APP_URL}/success?order_id=${orderId}`
})
```

### 2. **Watermark sur les aperçus**
Ajoutez un watermark "DEMO" sur les cartes avant paiement :
```typescript
// Dans CardEditor.tsx
{!isPaid && (
  <div className="watermark">DEMO</div>
)}
```

### 3. **Limiter le nombre de téléchargements**
Ajoutez un compteur dans la base de données :
```sql
ALTER TABLE orders ADD COLUMN download_count INTEGER DEFAULT 0;
```

### 4. **Expiration des liens de téléchargement**
Au lieu de 1 heure, vous pouvez ajuster :
```typescript
// Dans /api/orders/[orderId]/download/route.ts
expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 heures
```

### 5. **Authentification client complète**
Implémenter Supabase Auth pour que les clients aient un compte :
```typescript
// Les clients peuvent voir seulement leurs commandes
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

---

## ❓ FAQ

### Q : Que se passe-t-il si Cloudinary est down ?
**R** : L'API retournera l'URL originale (base64 ou URL non signée) en fallback.

### Q : Un client peut-il partager son lien de téléchargement ?
**R** : Oui, pendant 1 heure. Après, le lien expire. Pour plus de sécurité, ajoutez une vérification d'email.

### Q : Comment voir les logs des téléchargements ?
**R** : Ajoutez des logs dans l'API :
```typescript
console.log(`Download requested by ${order.customer_email} for order ${orderId}`)
```

### Q : Les anciennes commandes fonctionnent-elles encore ?
**R** : Oui, tant qu'elles ont un `stripe_payment_id`, elles peuvent être téléchargées.

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs Stripe dans le dashboard
3. Vérifiez les logs Supabase dans le dashboard
4. Assurez-vous que toutes les variables d'environnement sont configurées

---

**Implémenté le** : 2025-10-20
**Version** : 1.0
**Statut** : ✅ Production-ready
