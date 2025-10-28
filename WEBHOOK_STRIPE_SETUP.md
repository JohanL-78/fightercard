# 🔧 Configuration du Webhook Stripe (Mode Test)

## 🚨 Pourquoi ce guide ?

Actuellement, votre webhook Stripe n'est **pas configuré**, ce qui signifie que :
- ❌ Le `stripe_payment_id` n'est jamais enregistré dans la base de données
- ❌ L'image n'est pas uploadée sur Cloudinary après paiement
- ⚠️ En mode développement, le téléchargement fonctionne quand même (solution temporaire)

**Pour que tout fonctionne en production, vous devez configurer le webhook.**

---

## 🛠️ Solution 1 : Webhook Local (Pour tester maintenant)

### Étape 1 : Installer Stripe CLI

**macOS** (avec Homebrew) :
```bash
brew install stripe/stripe-cli/stripe
```

**Autres OS** : https://stripe.com/docs/stripe-cli#install

### Étape 2 : Se connecter à Stripe

```bash
stripe login
```

Cela va ouvrir votre navigateur pour autoriser l'accès.

### Étape 3 : Lancer le webhook local

Dans un nouveau terminal, lancez :

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Vous verrez quelque chose comme :
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

### Étape 4 : Copier le webhook secret

Copiez le secret qui commence par `whsec_` et ajoutez-le dans votre `.env.local` :

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Étape 5 : Redémarrer votre serveur Next.js

```bash
npm run dev
```

### Étape 6 : Tester un paiement

1. Créez une carte sur http://localhost:3000
2. Cliquez sur "Passer commande"
3. Utilisez la carte de test : `4242 4242 4242 4242`
4. Complétez le paiement

Dans le terminal avec `stripe listen`, vous verrez :
```
checkout.session.completed [evt_xxx]
```

Et dans les logs de votre serveur Next.js :
```
Order updated successfully: xxx-xxx-xxx
```

✅ **Maintenant le téléchargement devrait fonctionner !**

---

## 🌐 Solution 2 : Webhook en Production (Déploiement)

### Étape 1 : Déployer votre application

Déployez sur Vercel, Netlify, ou autre plateforme.

Notez votre URL de production : `https://votre-app.vercel.app`

### Étape 2 : Créer le webhook dans Stripe Dashboard

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **"Add endpoint"**
3. Entrez l'URL : `https://votre-app.vercel.app/api/webhooks/stripe`
4. Sélectionnez les événements :
   - ✅ `checkout.session.completed`
5. Cliquez sur **"Add endpoint"**

### Étape 3 : Copier le webhook secret

1. Cliquez sur l'endpoint que vous venez de créer
2. Cliquez sur **"Reveal"** dans la section "Signing secret"
3. Copiez le secret `whsec_xxxxxxxxxxxxx`

### Étape 4 : Ajouter le secret dans vos variables d'environnement

**Sur Vercel** :
1. Allez dans Settings → Environment Variables
2. Ajoutez : `STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx`
3. Redéployez votre application

**Sur Netlify** :
1. Site settings → Environment variables
2. Ajoutez : `STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx`
3. Redéployez

---

## 🧪 Vérifier que le webhook fonctionne

### Test en local avec Stripe CLI

```bash
stripe trigger checkout.session.completed
```

Vous devriez voir dans vos logs :
```
Order updated successfully: xxx-xxx-xxx
```

### Test en production

1. Faites un vrai paiement test
2. Vérifiez dans Stripe Dashboard → Webhooks → votre endpoint
3. Vous devriez voir l'événement `checkout.session.completed` avec un ✅

---

## 🐛 Débogage

### Problème : "No orderId in session metadata"

**Cause** : La commande n'a pas été créée avant le paiement

**Solution** : Vérifiez que `/api/create-checkout` fonctionne correctement

### Problème : "Order not found"

**Cause** : L'orderId dans les métadonnées ne correspond à aucune commande

**Solution** : Vérifiez vos logs Supabase et assurez-vous que la commande est bien créée

### Problème : "Cloudinary upload error"

**Cause** : Les variables d'environnement Cloudinary ne sont pas configurées

**Solution** : Vérifiez que vous avez :
```env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 📊 Vérifier l'état du webhook

### En local

```bash
stripe listen --print-json
```

Puis faites un paiement test. Vous verrez tout le JSON de l'événement.

### En production

1. Dashboard Stripe → Webhooks
2. Cliquez sur votre endpoint
3. Onglet **"Events"** → vous voyez tous les événements reçus

---

## ✅ Checklist

- [ ] Stripe CLI installé (pour local)
- [ ] `stripe listen` lancé dans un terminal
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté dans `.env.local`
- [ ] Serveur Next.js redémarré
- [ ] Paiement test effectué
- [ ] Logs indiquent "Order updated successfully"
- [ ] Téléchargement fonctionne sur `/success`

---

## 🔒 Sécurité en Production

**Important** : N'utilisez JAMAIS le secret du webhook local (`whsec_`) en production !

- **Local** : `whsec_` (généré par `stripe listen`)
- **Production** : `whsec_` (différent, créé dans le dashboard Stripe)

Assurez-vous d'avoir deux secrets différents :
- `.env.local` → secret local
- Variables Vercel/Netlify → secret production

---

## ❓ FAQ

### Q : Puis-je tester sans webhook ?

**R** : Oui, en mode développement, le téléchargement fonctionne maintenant sans `stripe_payment_id`. Mais en production, le webhook est **obligatoire**.

### Q : Combien de temps le webhook met-il à se déclencher ?

**R** : Généralement moins de 1 seconde. Si ça prend plus de 5 secondes, il y a un problème.

### Q : Puis-je avoir plusieurs webhooks ?

**R** : Oui ! Vous pouvez avoir un webhook pour local et un pour production.

### Q : Que se passe-t-il si le webhook échoue ?

**R** : Stripe réessaiera automatiquement pendant 3 jours. Vous pouvez aussi réessayer manuellement depuis le dashboard.

---

**Bon test !** 🚀
