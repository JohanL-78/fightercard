# ⚡ Démarrage Rapide - MyFightCard

Guide ultra-rapide pour démarrer en 15 minutes.

## 🎯 Objectif

Lancer votre site de cartes personnalisées pour combattants en local, puis en ligne.

---

## ⏱️ Étape 1 : Installation (2 minutes)

```bash
# Installer les dépendances
npm install
```

---

## 🔑 Étape 2 : Créer vos comptes (10 minutes)

### Supabase (Base de données)
1. [supabase.com](https://supabase.com) → Créer un compte
2. New Project → Nommer "myfightcard"
3. SQL Editor → Coller le contenu de `supabase-schema.sql` → Run
4. Settings → API → Noter URL + anon key + service_role key

### Stripe (Paiements)
1. [stripe.com](https://stripe.com) → Créer un compte
2. Mode TEST activé
3. Developers → API keys → Noter Publishable key + Secret key

### Cloudinary (Images)
1. [cloudinary.com](https://cloudinary.com) → Créer un compte
2. Dashboard → Noter Cloud Name + API Key + API Secret

### Remove.bg (Suppression fond)
1. [remove.bg/api](https://remove.bg/api) → Créer un compte
2. Dashboard → Noter API Key

---

## 📝 Étape 3 : Configuration (2 minutes)

Créez `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

REMOVE_BG_API_KEY=xxx

ADMIN_USERNAME=admin
ADMIN_PASSWORD=VotreMotDePasse123!

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Étape 4 : Lancer (1 minute)

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

### Test rapide :
1. Uploadez une photo
2. Remplissez nom + club
3. Cliquez "Télécharger"
4. Carte de test : `4242 4242 4242 4242`
5. Allez sur `/admin` pour voir la commande

---

## 🌐 Étape 5 : Déployer sur Vercel

```bash
# Commiter sur GitHub
git add .
git commit -m "App configurée"
git push

# Aller sur vercel.com
# Import repository → Ajouter les variables d'env → Deploy
```

**Après le déploiement :**
1. Stripe → Webhooks → Add endpoint
2. URL : `https://votre-app.vercel.app/api/webhooks/stripe`
3. Event : `checkout.session.completed`
4. Copier le Signing secret
5. Vercel → Settings → Env Variables → Ajouter `STRIPE_WEBHOOK_SECRET`
6. Redéployer

---

## ✅ C'est tout !

Votre application est maintenant en ligne 🎉

### Pour aller plus loin :
- 📖 [Guide complet](SETUP_GUIDE.md) - Configuration détaillée
- 📋 [Prochaines étapes](NEXT_STEPS.md) - Personnalisation et production

### Aide rapide :
- Problème de module ? → `npm install`
- Images ne s'affichent pas ? → Vérifier Cloudinary
- Paiement KO ? → Vérifier clés Stripe + webhook
- Remove.bg KO ? → Vérifier quota (50/mois gratuit)

---

**Besoin d'aide ?** Consultez [SETUP_GUIDE.md](SETUP_GUIDE.md) pour plus de détails.
