# 🚀 GUIDE DE TRANSFERT - MYFIGHTCARD

## 📋 Vue d'ensemble

Ce guide vous accompagne **étape par étape** pour déployer votre application MyFightCard en production. Temps estimé : **2-3 heures**.

---

## 🎯 Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✅ Une adresse email valide
- ✅ Une carte bancaire (pour Stripe, même en mode test)
- ✅ Un ordinateur avec accès Internet
- ✅ Ce guide sous les yeux

**Note :** Tous les services proposent des plans gratuits pour démarrer.

---

## 📦 ÉTAPE 0 : Préparation (5 minutes)

### Créez un dossier de travail

```bash
# Sur votre ordinateur, créez un dossier pour noter vos identifiants
# Par exemple : Documents/MyfightCard-Setup/
```

**Créez un fichier texte "MES_IDENTIFIANTS.txt" pour noter :**
- Les URLs de vos comptes
- Vos usernames/emails
- Les clés API (vous les copierez au fur et à mesure)

⚠️ **IMPORTANT** : Ce fichier contient des informations sensibles. Ne le partagez jamais !

---

## 🔵 ÉTAPE 1 : Créer un compte GitHub (10 minutes)

**Pourquoi ?** GitHub héberge le code source de votre application.

### 1.1 Inscription

1. Allez sur https://github.com/signup
2. Créez un compte avec votre email professionnel
3. Validez votre email
4. Choisissez le plan **Free** (gratuit)

### 1.2 Créer un repository (dépôt de code)

1. Cliquez sur le bouton **"New"** (en vert en haut à droite)
2. Remplissez :
   - **Repository name** : `myfightcard`
   - **Description** : `Application de cartes personnalisées pour combattants`
   - **Visibility** : **Private** (privé)
   - **Ne cochez RIEN** (pas de README, pas de .gitignore, pas de licence)
3. Cliquez sur **"Create repository"**

### 1.3 Notez vos informations

Dans votre fichier `MES_IDENTIFIANTS.txt` :
```
=== GITHUB ===
URL : https://github.com/VOTRE_USERNAME/myfightcard
Username : votre_username
Email : votre@email.com
```

✅ **Checkpoint** : Vous avez un repository GitHub vide et privé.

---

## 🟢 ÉTAPE 2 : Créer un compte Supabase (20 minutes)

**Pourquoi ?** Supabase est votre base de données (clients, commandes, templates).

### 2.1 Inscription

1. Allez sur https://supabase.com
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec **GitHub** (bouton "Continue with GitHub")
4. Autorisez Supabase à accéder à votre compte GitHub

### 2.2 Créer un projet

1. Cliquez sur **"New Project"**
2. Remplissez :
   - **Name** : `myfightcard`
   - **Database Password** : Générez un mot de passe fort (cliquez sur "Generate a password")
   - **Region** : `Europe West (Paris)` (si vous êtes en Europe)
   - **Pricing Plan** : **Free** (gratuit)
3. Cliquez sur **"Create new project"**

⏳ **Attendez 2-3 minutes** que le projet soit créé (barre de progression).

### 2.3 Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** (⚙️ en bas à gauche)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez plusieurs informations importantes :

**Copiez ces 3 valeurs dans `MES_IDENTIFIANTS.txt` :**

```
=== SUPABASE ===
Project URL : https://xxxxxxxxxx.supabase.co
anon/public key : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
service_role key : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

### 2.4 Exécuter les scripts SQL (IMPORTANT !)

1. Dans Supabase, cliquez sur **SQL Editor** (icône </> dans le menu de gauche)
2. Cliquez sur **"New query"**

**Exécutez les fichiers SQL dans cet ordre précis :**

#### Fichier 1 : `supabase-schema.sql`
1. Ouvrez le fichier `supabase-schema.sql` (fourni dans le zip)
2. Copiez TOUT le contenu
3. Collez dans l'éditeur SQL de Supabase
4. Cliquez sur **"Run"** (▶️ en bas à droite)
5. ✅ Vérifiez qu'il n'y a pas d'erreur (texte vert = succès)

#### Fichier 2 : `supabase-migration.sql`
1. Cliquez sur **"New query"** (nouvelle requête)
2. Ouvrez `supabase-migration.sql`
3. Copiez-collez le contenu
4. Cliquez sur **"Run"**
5. ✅ Vérifiez le succès

#### Fichier 3 : `supabase-rls-update.sql`
1. Nouvelle requête
2. Ouvrez `supabase-rls-update.sql`
3. Copiez-collez
4. **"Run"**
5. ✅ Vérifiez

#### Fichier 4 : `supabase-apply-security-NOW.sql`
1. Nouvelle requête
2. Ouvrez `supabase-apply-security-NOW.sql`
3. Copiez-collez
4. **"Run"**
5. ✅ Vérifiez

### 2.5 Vérifier que tout fonctionne

1. Allez dans **Table Editor** (icône tableau dans le menu)
2. Vous devez voir 2 tables : `orders` et `templates`
3. Cliquez sur `templates` → vous devez voir au moins 1 template

✅ **Checkpoint** : Base de données créée et configurée avec succès.

---

## 💳 ÉTAPE 3 : Créer un compte Stripe (15 minutes)

**Pourquoi ?** Stripe gère les paiements de vos clients.

### 3.1 Inscription

1. Allez sur https://dashboard.stripe.com/register
2. Créez un compte avec votre email **professionnel**
3. Choisissez votre pays
4. **IMPORTANT** : Restez en **mode TEST** (ne passez pas en mode Live pour l'instant)

### 3.2 Récupérer les clés API (mode TEST)

1. Dans le dashboard Stripe, regardez en haut à droite : vous devez voir **"Mode test"** (un badge orange/jaune)
2. Allez dans **Developers** → **API keys**

**Copiez ces valeurs dans `MES_IDENTIFIANTS.txt` :**

```
=== STRIPE (MODE TEST) ===
Publishable key : pk_test_51...
Secret key : sk_test_51...
```

⚠️ **NE COPIEZ PAS les clés "live" pour l'instant !**

### 3.3 Configuration du webhook (ON LE FERA APRÈS VERCEL)

⏸️ **À faire plus tard (étape 7)** - Pour l'instant, notez juste l'URL :
```
Webhook URL à configurer : https://VOTRE-APP.vercel.app/api/webhooks/stripe
```

✅ **Checkpoint** : Compte Stripe créé en mode test avec les clés API récupérées.

---

## ☁️ ÉTAPE 4 : Créer un compte Cloudinary (10 minutes)

**Pourquoi ?** Cloudinary stocke les images uploadées par vos clients.

### 4.1 Inscription

1. Allez sur https://cloudinary.com/users/register/free
2. Créez un compte avec votre email
3. Choisissez **"Developer"** comme type de compte
4. Validez votre email

### 4.2 Récupérer les clés API

1. Connectez-vous au dashboard Cloudinary
2. Vous arrivez sur la page **"Dashboard"** (accueil)
3. Vous verrez une section **"Product Environment Credentials"**

**Copiez ces valeurs dans `MES_IDENTIFIANTS.txt` :**

```
=== CLOUDINARY ===
Cloud name : dxxxxxxxx
API Key : 123456789012345
API Secret : VotreCléSecrète
```

### 4.3 Créer un upload preset (IMPORTANT !)

1. Allez dans **Settings** (⚙️ en haut à droite)
2. Cliquez sur **"Upload"** dans le menu de gauche
3. Scrollez jusqu'à **"Upload presets"**
4. Cliquez sur **"Add upload preset"**
5. Remplissez :
   - **Preset name** : `fight-cards-unsigned`
   - **Signing Mode** : **Unsigned** (important !)
   - **Folder** : `fight-cards`
6. Cliquez sur **"Save"**

✅ **Checkpoint** : Cloudinary configuré avec le preset "unsigned".

---

## 🎨 ÉTAPE 5 : Créer un compte Pixian (OPTIONNEL - 5 minutes)

**Pourquoi ?** Pixian AI retire automatiquement le fond des photos.

⚠️ **CETTE ÉTAPE EST OPTIONNELLE** - Votre app fonctionne sans Pixian.

### Option A : Activer Pixian (recommandé pour tester)

1. Allez sur https://pixian.ai/api
2. Créez un compte gratuit
3. Allez dans **API Credentials**
4. Copiez :

```
=== PIXIAN (OPTIONNEL) ===
API ID : pxivt...
API Secret : nc4dh...
```

**Mode gratuit :** Aperçu avec watermark Pixian (suffisant pour tester)

### Option B : Ne pas activer (c'est OK)

Si vous ne configurez pas Pixian :
- Le bouton "Tester la suppression du fond" affichera un message informatif
- Les clients pourront utiliser des photos PNG transparentes
- **L'app fonctionne normalement**

✅ **Checkpoint** : Pixian activé OU décision de ne pas l'utiliser.

---

## 🔷 ÉTAPE 6 : Déployer sur Vercel (20 minutes)

**Pourquoi ?** Vercel héberge votre site web et le rend accessible sur Internet.

### 6.1 Inscription et connexion GitHub

1. Allez sur https://vercel.com/signup
2. Cliquez sur **"Continue with GitHub"**
3. Autorisez Vercel à accéder à votre compte GitHub
4. Choisissez le plan **"Hobby"** (gratuit)

### 6.2 Importer le projet

1. Cliquez sur **"Add New..."** → **"Project"**
2. Trouvez votre repository `myfightcard` dans la liste
3. Cliquez sur **"Import"**

### 6.3 Configurer les variables d'environnement

⚠️ **ÉTAPE CRITIQUE** - Copiez exactement chaque variable.

1. Avant de déployer, cliquez sur **"Environment Variables"** pour les déplier
2. Ajoutez **TOUTES** ces variables (une par une) :

#### Variables Supabase (copiez depuis MES_IDENTIFIANTS.txt)
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxxxxxxx.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

#### Variables Stripe (mode TEST)
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51...

Name: STRIPE_SECRET_KEY
Value: sk_test_51...

Name: STRIPE_WEBHOOK_SECRET
Value: whsec_TEMPORAIRE_ON_VA_CHANGER_CA_PLUS_TARD
```

#### Variables Cloudinary
```
Name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
Value: dxxxxxxxx

Name: CLOUDINARY_API_KEY
Value: 123456789012345

Name: CLOUDINARY_API_SECRET
Value: VotreCléSecrète
```

#### Variables Pixian (si vous l'avez activé, sinon laissez vide)
```
Name: PIXIAN_API_ID
Value: pxivt... (ou laissez vide)

Name: PIXIAN_API_SECRET
Value: nc4dh... (ou laissez vide)
```

#### Variables Admin (GÉNÉREZ DES VALEURS FORTES !)

⚠️ **NE PAS UTILISER CES EXEMPLES** - Créez vos propres valeurs :

```
Name: ADMIN_USERNAME
Value: VotreUsernameUnique123

Name: ADMIN_PASSWORD
Value: VotreMotDePasseUltraSecurise456!

Name: ADMIN_JWT_SECRET
Value: [Générez avec : openssl rand -base64 32 dans un terminal]
       (Exemple : oIpbUa61R9mlkpmwIIGo2S2Hz7Oma5M6+l3aM/zW+d8=)
```

**Pour générer ADMIN_JWT_SECRET :**
- **Mac/Linux** : Ouvrez Terminal et tapez `openssl rand -base64 32`
- **Windows** : Allez sur https://www.random.org/strings/ et générez une chaîne de 32 caractères

#### Variable App URL (ON VA LA METTRE APRÈS)
```
Name: NEXT_PUBLIC_APP_URL
Value: https://TEMPORAIRE.vercel.app
```

### 6.4 Lancer le déploiement

1. Vérifiez que toutes les variables sont bien remplies (scrollez pour tout voir)
2. Cliquez sur **"Deploy"** (gros bouton bleu)
3. ⏳ **Attendez 5-10 minutes** que le déploiement se termine

### 6.5 Récupérer l'URL de production

1. Une fois le déploiement terminé, vous verrez **"Congratulations! 🎉"**
2. Cliquez sur **"Visit"** ou copiez l'URL affichée
3. **Notez cette URL** (quelque chose comme `https://myfightcard-xxx.vercel.app`)

### 6.6 Mettre à jour NEXT_PUBLIC_APP_URL

1. Dans Vercel, allez dans **Settings** de votre projet
2. Cliquez sur **"Environment Variables"** dans le menu de gauche
3. Trouvez `NEXT_PUBLIC_APP_URL`
4. Cliquez sur les trois points **"..."** → **"Edit"**
5. Remplacez par votre vraie URL : `https://myfightcard-xxx.vercel.app`
6. Cliquez sur **"Save"**
7. **Redéployez** : Allez dans **"Deployments"** → Cliquez sur le dernier déploiement → **"Redeploy"**

✅ **Checkpoint** : Site déployé et accessible sur Internet !

---

## 🔗 ÉTAPE 7 : Configurer le webhook Stripe (10 minutes)

**Pourquoi ?** Pour que Stripe notifie votre app quand un paiement est validé.

### 7.1 Créer le webhook

1. Retournez sur https://dashboard.stripe.com
2. Vérifiez que vous êtes bien en **mode test** (badge orange en haut à droite)
3. Allez dans **Developers** → **Webhooks**
4. Cliquez sur **"Add endpoint"** (ou "+ Add endpoint")

### 7.2 Configurer l'endpoint

1. **Endpoint URL** : `https://VOTRE-APP.vercel.app/api/webhooks/stripe`
   (Remplacez par votre vraie URL Vercel)
2. Cliquez sur **"Select events"**
3. Cherchez et cochez **UNIQUEMENT** : `checkout.session.completed`
4. Cliquez sur **"Add endpoint"**

### 7.3 Récupérer le webhook secret

1. Cliquez sur l'endpoint que vous venez de créer
2. Trouvez **"Signing secret"** (en bas)
3. Cliquez sur **"Reveal"** puis copiez la valeur (commence par `whsec_`)

### 7.4 Mettre à jour dans Vercel

1. Retournez sur Vercel → **Settings** → **Environment Variables**
2. Trouvez `STRIPE_WEBHOOK_SECRET`
3. Cliquez sur **"..."** → **"Edit"**
4. Remplacez `whsec_TEMPORAIRE...` par votre vraie valeur `whsec_...`
5. Cliquez sur **"Save"**
6. **Redéployez** (Deployments → dernier déploiement → Redeploy)

✅ **Checkpoint** : Webhook Stripe configuré et fonctionnel.

---

## 🧪 ÉTAPE 8 : Tester l'application (15 minutes)

**C'est le moment de vérifier que tout fonctionne !**

### 8.1 Tester la page d'accueil

1. Ouvrez votre app : `https://VOTRE-APP.vercel.app`
2. ✅ Vérifiez que la page charge correctement
3. ✅ Vérifiez que les templates s'affichent (ils viennent de Supabase)
4. ✅ Cliquez sur un template → l'éditeur doit s'ouvrir

### 8.2 Tester l'éditeur de carte

1. **Upload une photo** (glissez une image)
2. ✅ La photo doit s'afficher dans l'aperçu en temps réel
3. **Modifiez les champs** :
   - Nom du combattant
   - Rating (curseur)
   - Statistiques
   - Drapeau
4. ✅ L'aperçu doit se mettre à jour en temps réel

### 8.3 Tester le remove-bg (si Pixian activé)

1. Cliquez sur **"Tester la suppression du fond"**
2. ✅ Après quelques secondes, le fond doit être retiré (avec watermark Pixian)
3. Si Pixian non configuré : message informatif doit s'afficher

### 8.4 Tester le paiement (MODE TEST)

1. Cliquez sur **"Passer commande"**
2. Entrez votre email : `test@test.com`
3. Cliquez sur **"Procéder au paiement"**
4. Vous êtes redirigé vers Stripe Checkout

**Utilisez ces informations de test Stripe :**
- **Carte** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future (ex: 12/25)
- **CVC** : N'importe quel 3 chiffres (ex: 123)
- **Nom** : Test User
- **Email** : test@test.com
- **Adresse** : N'importe quelle adresse

5. Cliquez sur **"Pay"**
6. ✅ Vous devez être redirigé vers la page de succès

### 8.5 Vérifier dans l'admin

1. Allez sur `https://VOTRE-APP.vercel.app/admin`
2. Connectez-vous avec vos credentials (ADMIN_USERNAME et ADMIN_PASSWORD)
3. ✅ Vous devez voir la commande test dans le tableau de bord

### 8.6 Vérifier dans Supabase

1. Retournez sur Supabase → **Table Editor** → `orders`
2. ✅ Vous devez voir votre commande test avec :
   - Customer email : test@test.com
   - Status : pending
   - Stripe payment ID

### 8.7 Vérifier dans Stripe

1. Retournez sur Stripe Dashboard → **Payments**
2. ✅ Vous devez voir le paiement test de 15€

✅ **Checkpoint** : TOUTE l'application fonctionne parfaitement !

---

## 🎉 ÉTAPE 9 : Passage en production (PLUS TARD)

⚠️ **NE FAITES PAS CETTE ÉTAPE MAINTENANT** - Testez d'abord plusieurs jours en mode TEST.

Quand vous serez prêt à accepter de vrais paiements :

### 9.1 Activer le compte Stripe Live

1. Dans Stripe Dashboard, cliquez sur **"Activate your account"**
2. Remplissez toutes les informations légales (business, taxes, etc.)
3. Stripe va vérifier votre compte (peut prendre 1-2 jours)

### 9.2 Récupérer les clés LIVE

1. Dans Stripe, basculez en **mode Live** (toggle en haut à droite)
2. Allez dans **Developers** → **API keys**
3. Copiez les nouvelles clés (pk_live_... et sk_live_...)

### 9.3 Créer un nouveau webhook LIVE

1. **Developers** → **Webhooks** (en mode Live)
2. Créez un nouvel endpoint avec la même URL
3. Récupérez le nouveau `whsec_live_...`

### 9.4 Mettre à jour Vercel

1. Éditez les 3 variables Stripe dans Vercel
2. Redéployez

✅ Votre app accepte maintenant de vrais paiements !

---

## 📝 ÉTAPE 10 : Configuration d'un nom de domaine personnalisé (OPTIONNEL)

Si vous voulez un domaine comme `www.myfightcard.com` au lieu de `myfightcard.vercel.app` :

### 10.1 Acheter un nom de domaine

Achetez sur :
- **Namecheap** : https://www.namecheap.com (~10€/an)
- **OVH** : https://www.ovh.com/fr/ (~10€/an)
- **Google Domains** : https://domains.google (~12€/an)

### 10.2 Configurer dans Vercel

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Cliquez sur **"Add"**
3. Entrez votre domaine : `myfightcard.com`
4. Suivez les instructions pour configurer les DNS

✅ Votre app sera accessible sur votre propre domaine !

---

## 🆘 DÉPANNAGE - Problèmes courants

### ❌ "Templates are viewable by everyone" error

**Solution :**
- Vérifiez que vous avez bien exécuté **tous** les fichiers SQL dans l'ordre
- Retournez dans Supabase SQL Editor et ré-exécutez `supabase-apply-security-NOW.sql`

### ❌ Erreur 500 lors du paiement

**Solution :**
- Vérifiez que le webhook Stripe est bien configuré avec la bonne URL
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est bien rempli dans Vercel
- Redéployez après avoir changé la variable

### ❌ Les images ne s'uploadent pas

**Solution :**
- Vérifiez que le preset Cloudinary "fight-cards-unsigned" existe
- Vérifiez que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` est correct
- Mode "Unsigned" doit être activé dans le preset

### ❌ Page blanche / erreur de build

**Solution :**
- Vérifiez que **toutes** les variables d'environnement sont remplies dans Vercel
- Regardez les logs dans Vercel → Deployments → Dernier déploiement → "View Function Logs"

### ❌ "Pixian API credentials not configured"

**C'est normal !** Pixian est optionnel. Soit :
- Configurez Pixian (ajoutez les variables dans Vercel et redéployez)
- Ou utilisez des photos PNG transparentes (l'app fonctionne sans Pixian)

---

## 📊 RÉCAPITULATIF FINAL

### Comptes créés ✅
- ✅ GitHub : Code source
- ✅ Supabase : Base de données
- ✅ Stripe : Paiements (mode test)
- ✅ Cloudinary : Stockage images
- ✅ Vercel : Hébergement web
- 🔵 Pixian : Remove-bg (optionnel)

### URLs importantes 📌

Notez ces URLs dans un endroit sûr :

```
Site web : https://VOTRE-APP.vercel.app
Admin : https://VOTRE-APP.vercel.app/admin
FAQ : https://VOTRE-APP.vercel.app/faq

Dashboard Vercel : https://vercel.com/dashboard
Dashboard Supabase : https://supabase.com/dashboard
Dashboard Stripe : https://dashboard.stripe.com
Dashboard Cloudinary : https://cloudinary.com/console
```

### Identifiants admin 🔐

```
Username : [VOTRE_ADMIN_USERNAME]
Password : [VOTRE_ADMIN_PASSWORD]
```

⚠️ **Conservez ces identifiants en sécurité !**

---

## 🎓 PROCHAINES ÉTAPES

### Maintenance quotidienne

1. **Vérifiez les commandes** : Connectez-vous à `/admin` une fois par jour
2. **Traitez les commandes** :
   - Téléchargez l'image finale
   - Vérifiez la qualité
   - Si nécessaire, retirez le fond manuellement avec Photoshop/GIMP
   - Envoyez par email au client
   - Marquez la commande comme "livrée"

### Améliorations futures

- 📧 **Emails automatiques** : Ajouter un service d'emailing (SendGrid, Resend)
- 🎨 **Nouveaux templates** : Ajouter plus de designs dans Supabase
- 💳 **Stripe Live** : Basculer en mode production quand vous êtes prêt
- 🌐 **Domaine custom** : Acheter votre propre nom de domaine

---

## 📞 SUPPORT

Si vous rencontrez un problème :

1. **Consultez la section Dépannage** ci-dessus
2. **Vérifiez les logs** :
   - Vercel : Deployments → View Function Logs
   - Supabase : SQL Editor → Historique des requêtes
   - Stripe : Developers → Logs
3. **Contactez-moi** via Fiverr avec :
   - Description du problème
   - Captures d'écran
   - Messages d'erreur (copier-coller le texte exact)

---

## ✅ FÉLICITATIONS !

🎉 Votre application MyFightCard est maintenant **LIVE** et opérationnelle !

Vous pouvez :
- ✅ Accepter des commandes de cartes personnalisées
- ✅ Gérer vos clients via le panel admin
- ✅ Recevoir des paiements sécurisés via Stripe
- ✅ Scaler votre business sans limite technique

**Bonne chance avec votre nouveau business de cartes personnalisées !** 🥊🎨

---

*Guide créé avec ❤️ pour MyFightCard*
*Version 1.0 - Janvier 2025*
