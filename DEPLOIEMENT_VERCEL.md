# 🚀 Déploiement sur Vercel - MyFightCard

## ✅ Prérequis

- [x] Compte GitHub
- [x] Compte Vercel (gratuit)
- [x] Toutes les clés API configurées (Supabase, Stripe, Cloudinary, Pixian)
- [x] Application testée en local

---

## 📋 Étape 1 : Préparer le Projet

### 1.1 Vérifier que .env.local n'est PAS commité

```bash
# Vérifier
git status

# Si .env.local apparaît, l'ignorer immédiatement
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "Ignore .env.local"
```

✅ **Déjà fait** : `.env*` est dans `.gitignore`

### 1.2 Commit et Push sur GitHub

```bash
# Commit tous les changements
git add .
git commit -m "Prêt pour déploiement Vercel"

# Push sur GitHub
git push origin main
```

---

## 🌐 Étape 2 : Déployer sur Vercel

### 2.1 Créer le Projet

1. Va sur [vercel.com](https://vercel.com)
2. Clique **"Add New Project"**
3. **Import** ton repo GitHub `myfightcard`
4. Configure le projet :
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build` (par défaut)

### 2.2 Configurer les Variables d'Environnement

**IMPORTANT** : Avant de cliquer "Deploy", ajoute TOUTES ces variables :

#### Variables Publiques (NEXT_PUBLIC_)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://vqddxwwlwswcryyjbifk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddsemqh5c
NEXT_PUBLIC_APP_URL=https://ton-app.vercel.app
```

⚠️ **Pour NEXT_PUBLIC_APP_URL** : Vercel te donnera l'URL après le premier déploiement. Tu pourras la modifier après.

#### Variables Privées (Secrets)
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_API_KEY=392367319693689
CLOUDINARY_API_SECRET=YSfAhw...
PIXIAN_API_ID=pxivt8fjm9a2zsf
PIXIAN_API_SECRET=nc4dh0d3kt3e1pnkq0v7sshji1c6u7i63c3sa73u74hvhd6klt59
ADMIN_USERNAME=MFCadmin@1711GL
ADMIN_PASSWORD=NPPbc8812@134@
ADMIN_JWT_SECRET=oIpbUa61R9mlkpmwIIGo2S2Hz7Oma5M6+l3aM/zW+d8=
```

### 2.3 Déployer

Clique **"Deploy"** 🚀

⏱️ Attends 2-3 minutes...

---

## 🔧 Étape 3 : Configuration Post-Déploiement

### 3.1 Récupérer l'URL Vercel

Après déploiement, Vercel te donne une URL type :
```
https://myfightcard.vercel.app
```

### 3.2 Mettre à Jour NEXT_PUBLIC_APP_URL

1. Va dans **Settings** → **Environment Variables**
2. Trouve `NEXT_PUBLIC_APP_URL`
3. Change de `http://localhost:3000` à `https://ton-app.vercel.app`
4. **Redéploie** (Vercel te proposera automatiquement)

### 3.3 Configurer le Webhook Stripe

⚠️ **CRITIQUE** : Sans ça, les paiements ne seront pas traités !

1. Va sur [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Clique **"Add endpoint"**
3. **Endpoint URL** : `https://ton-app.vercel.app/api/webhooks/stripe`
4. **Events to send** :
   - ✅ `checkout.session.completed`
5. Copie le **Signing secret** (commence par `whsec_...`)
6. Retourne sur Vercel → Settings → Environment Variables
7. Mets à jour `STRIPE_WEBHOOK_SECRET` avec la nouvelle valeur
8. **Redéploie**

---

## 🧪 Étape 4 : Tester l'Application

### 4.1 Test Complet du Workflow

1. **Va sur ton app** : `https://ton-app.vercel.app`
2. **Crée une carte** :
   - Upload une photo
   - Clique "Remove Background" (gratuit avec watermark)
   - Remplis les infos
3. **Passe commande** :
   - Clique "Passer commande"
   - Utilise une **carte test Stripe** : `4242 4242 4242 4242`
   - Email : `test@example.com`
   - Date : `12/34`, CVV : `123`
4. **Vérifie la redirection** vers `/success`
5. **Télécharge la carte**

### 4.2 Vérifier les Logs

#### Logs Vercel
1. Va dans **Deployments** → **Functions**
2. Clique sur `/api/webhooks/stripe`
3. Vérifie les logs :
   ```
   ✅ Checkout session completed
   🎨 Génération carte finale...
   ```

#### Logs Stripe
1. Va sur [Stripe Dashboard](https://dashboard.stripe.com/test/events)
2. Vérifie que `checkout.session.completed` a été envoyé
3. Status doit être **"Succeeded"** ✅

### 4.3 Tester le Panel Admin

1. Va sur `https://ton-app.vercel.app/admin/login`
2. Connecte-toi avec tes identifiants
3. Vérifie que la commande test apparaît
4. Change le statut

---

## 📊 Monitoring

### Vercel Dashboard

**Métriques à surveiller :**
- ✅ **Build Time** : < 2 min (normal)
- ✅ **Function Executions** : Suivi des API calls
- ✅ **Errors** : Doit être 0

### Stripe Dashboard

**Vérifier :**
- ✅ **Payments** : Mode test activé
- ✅ **Webhooks** : Events envoyés avec succès
- ✅ **Logs** : Aucune erreur

### Supabase Dashboard

**Vérifier :**
- ✅ **Database** → **orders** : Commandes créées
- ✅ **Auth** : (Non utilisé pour l'instant)
- ✅ **API Logs** : Requêtes d'insertion

---

## ⚠️ Problèmes Courants

### Erreur : "Missing environment variables"

**Solution :**
1. Va dans Settings → Environment Variables
2. Vérifie que TOUTES les variables sont présentes
3. Redéploie

### Webhook Stripe ne fonctionne pas

**Solution :**
1. Vérifie l'URL : `https://ton-app.vercel.app/api/webhooks/stripe`
2. Vérifie que `STRIPE_WEBHOOK_SECRET` est correct
3. Teste avec Stripe CLI :
   ```bash
   stripe trigger checkout.session.completed
   ```

### Images ne s'uploadent pas

**Solution :**
1. Vérifie les clés Cloudinary
2. Vérifie les logs Vercel (Functions tab)
3. Rate limit peut-être dépassé (attends 1 min)

### Admin ne se connecte pas

**Solution :**
1. Vérifie `ADMIN_USERNAME` et `ADMIN_PASSWORD`
2. Vérifie `ADMIN_JWT_SECRET`
3. Efface les cookies du navigateur

---

## 🎯 Checklist Finale

### Avant Production

- [ ] Toutes les variables d'environnement configurées
- [ ] Webhook Stripe configuré et testé
- [ ] Test complet : création → paiement → téléchargement
- [ ] Panel admin accessible et fonctionnel
- [ ] Logs Vercel sans erreurs
- [ ] Mode Stripe TEST activé ✅

### Avant de Passer en Mode LIVE Stripe

- [ ] Activer remove-bg final (voir [ACTIVER_REMOVE_BG_FINAL.md](ACTIVER_REMOVE_BG_FINAL.md))
- [ ] Acheter crédits Pixian (~5€)
- [ ] Changer Stripe en mode LIVE
- [ ] Créer nouveau webhook Stripe en mode LIVE
- [ ] Mettre à jour les clés Stripe (pk_live, sk_live, whsec_live)
- [ ] Test final avec VRAIE carte bancaire
- [ ] Monitoring actif (Sentry recommandé)

---

## 🔄 Redéploiements Futurs

### Déploiement Automatique

Vercel redéploie automatiquement à chaque `git push` sur `main` :

```bash
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main
# → Déploiement automatique ✅
```

### Variables d'Environnement Modifiées

Si tu changes une variable :
1. Modifie dans Vercel Dashboard
2. **Redéploie manuellement** (Deployments → ⋮ → Redeploy)

---

## 📈 Après le Déploiement

### Domaine Personnalisé (Optionnel)

1. Achète un domaine (ex: myfightcard.com)
2. Va dans Vercel → Settings → Domains
3. Ajoute ton domaine
4. Configure les DNS selon instructions Vercel
5. ✅ Ton app sera sur `myfightcard.com`

### Analytics (Optionnel)

Vercel propose des analytics gratuits :
1. Settings → Analytics
2. Active "Web Analytics"
3. Voir visiteurs, pages vues, etc.

---

## 🎉 C'est Parti !

Ton application est maintenant **en ligne** et **testable** !

**Next steps :**
1. Partage l'URL avec quelques testeurs
2. Collecte les feedbacks
3. Corrige les bugs
4. Quand tout est OK → Passe en mode LIVE Stripe
5. Lance la commercialisation ! 🚀

---

**Besoin d'aide ?** Vérifie les logs Vercel ou contacte le support.
