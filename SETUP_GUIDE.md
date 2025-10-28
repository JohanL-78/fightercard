# Guide de Configuration - MyFightCard

Ce guide vous accompagne pas à pas dans la configuration de votre application de cartes personnalisées pour sports de combat.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration Supabase](#configuration-supabase)
4. [Configuration Stripe](#configuration-stripe)
5. [Configuration Cloudinary](#configuration-cloudinary)
6. [Configuration Remove.bg](#configuration-removebg)
7. [Variables d'environnement](#variables-denvironnement)
8. [Déploiement sur Vercel](#déploiement-sur-vercel)
9. [Tests et mise en production](#tests-et-mise-en-production)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- Node.js 18+ installé ([télécharger](https://nodejs.org/))
- Un compte GitHub
- Un terminal (Terminal sur Mac, CMD/PowerShell sur Windows)

---

## Installation

### 1. Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

Cette commande installera toutes les dépendances listées dans `package.json`.

---

## Configuration Supabase

Supabase est votre base de données gratuite pour stocker les commandes et templates.

### 1. Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Créez un compte (gratuit)

### 2. Créer un nouveau projet

1. Cliquez sur "New Project"
2. Donnez un nom à votre projet (ex: "myfightcard")
3. Créez un mot de passe pour la base de données (notez-le bien !)
4. Choisissez une région proche de vous (ex: Europe West pour la France)
5. Cliquez sur "Create new project"
6. Attendez 2-3 minutes que le projet soit créé

### 3. Récupérer les clés API

1. Dans votre projet Supabase, allez dans "Settings" (icône engrenage) > "API"
2. Notez ces informations :
   - **URL** : `Project URL` (commence par https://...)
   - **anon key** : `anon` / `public` key (clé publique)
   - **service_role key** : `service_role` key (clé secrète - gardez-la confidentielle !)

### 4. Créer les tables

1. Dans Supabase, allez dans "SQL Editor" (icône ⚡)
2. Cliquez sur "New Query"
3. Copiez tout le contenu du fichier `supabase-schema.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur "Run" en bas à droite
6. Vérifiez qu'il n'y a pas d'erreurs

✅ Votre base de données est prête !

---

## Configuration Stripe

Stripe gère les paiements sécurisés.

### 1. Créer un compte Stripe

1. Allez sur [https://stripe.com](https://stripe.com)
2. Cliquez sur "Start now" et créez un compte
3. Remplissez les informations de votre entreprise

### 2. Récupérer les clés API (mode test)

1. Dans le dashboard Stripe, activez le mode **Test** (interrupteur en haut à droite)
2. Allez dans "Developers" > "API keys"
3. Notez :
   - **Publishable key** : commence par `pk_test_...`
   - **Secret key** : cliquez sur "Reveal test key" puis notez la clé (commence par `sk_test_...`)

### 3. Configurer les webhooks

Les webhooks permettent à Stripe de notifier votre application après un paiement.

1. Dans Stripe, allez dans "Developers" > "Webhooks"
2. Cliquez sur "Add endpoint"
3. Pour l'instant, laissez vide (on configurera après le déploiement)

**Note** : Après le déploiement sur Vercel, vous reviendrez ajouter l'URL :
```
https://votre-app.vercel.app/api/webhooks/stripe
```

---

## Configuration Cloudinary

Cloudinary stocke les images finales des cartes.

### 1. Créer un compte

1. Allez sur [https://cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit (pas besoin de carte bancaire)

### 2. Récupérer les identifiants

1. Sur le dashboard, vous verrez :
   - **Cloud Name** : votre nom de cloud (ex: `dmxyz123`)
   - **API Key** : une série de chiffres
   - **API Secret** : cliquez sur "Reveal" pour voir le secret

✅ Notez ces 3 informations !

---

## Configuration Remove.bg

Remove.bg supprime automatiquement le fond des photos.

### 1. Créer un compte

1. Allez sur [https://remove.bg/api](https://remove.bg/api)
2. Cliquez sur "Get API Key"
3. Créez un compte gratuit

### 2. Récupérer la clé API

1. Une fois connecté, allez dans votre dashboard
2. Copiez votre **API Key**

**Note** : Le plan gratuit permet 50 images/mois. Au-delà, il faudra souscrire à un plan payant.

---

## Variables d'environnement

Maintenant, configurons toutes les clés dans votre application.

### 1. Créer le fichier .env.local

1. À la racine du projet, créez un fichier nommé `.env.local`
2. Copiez le contenu de `.env.example` et remplacez les valeurs :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (à configurer après le déploiement)

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# Remove.bg
REMOVE_BG_API_KEY=votre-api-key-removebg

# Admin (CHANGEZ CES VALEURS !)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=un-mot-de-passe-securise

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Important** :
- Ne partagez JAMAIS ce fichier
- Changez le mot de passe admin par défaut
- Le fichier `.env.local` est déjà dans `.gitignore` pour ne pas être publié sur GitHub

### 2. Tester en local

Lancez l'application en local :

```bash
npm run dev
```

Ouvrez votre navigateur sur [http://localhost:3000](http://localhost:3000)

✅ Vous devriez voir l'éditeur de cartes !

---

## Déploiement sur Vercel

Vercel héberge votre application gratuitement.

### 1. Préparer le projet

Assurez-vous que votre code est sur GitHub :

```bash
git add .
git commit -m "Configuration initiale"
git push origin main
```

### 2. Créer un compte Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub

### 3. Importer le projet

1. Cliquez sur "Add New" > "Project"
2. Sélectionnez votre repository GitHub `myfightcard`
3. Cliquez sur "Import"

### 4. Configurer les variables d'environnement

Dans les paramètres du projet Vercel :

1. Allez dans "Settings" > "Environment Variables"
2. Ajoutez TOUTES les variables de votre `.env.local` :
   - Nom : `NEXT_PUBLIC_SUPABASE_URL`
   - Valeur : `https://votre-projet.supabase.co`
   - Cliquez sur "Add"
3. Répétez pour chaque variable
4. ⚠️ Pour `NEXT_PUBLIC_APP_URL`, mettez votre URL Vercel (ex: `https://myfightcard.vercel.app`)

### 5. Déployer

1. Cliquez sur "Deploy"
2. Attendez 2-3 minutes
3. Votre site est en ligne ! 🎉

---

## Tests et mise en production

### 1. Tester le paiement

1. Allez sur votre site déployé
2. Créez une carte personnalisée
3. Cliquez sur "Télécharger" puis "Procéder au paiement"
4. Utilisez une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

5. Vérifiez que :
   - Le paiement passe
   - Vous êtes redirigé vers la page de succès
   - La commande apparaît dans `/admin`

### 2. Configurer le webhook Stripe

Maintenant que votre site est en ligne :

1. Retournez dans Stripe > "Developers" > "Webhooks"
2. Cliquez sur "Add endpoint"
3. URL : `https://votre-app.vercel.app/api/webhooks/stripe`
4. Événements à écouter : sélectionnez `checkout.session.completed`
5. Cliquez sur "Add endpoint"
6. Copiez le **Signing secret** (commence par `whsec_...`)
7. Ajoutez-le dans Vercel :
   - Settings > Environment Variables
   - Nom : `STRIPE_WEBHOOK_SECRET`
   - Valeur : `whsec_...`
8. Redéployez l'application

### 3. Tester Remove.bg

1. Uploadez une photo avec un fond
2. Cliquez sur "Supprimer le fond"
3. Vérifiez que le fond est bien supprimé

### 4. Tester l'interface admin

1. Allez sur `/admin`
2. Connectez-vous avec vos identifiants (définis dans `.env.local`)
3. Vérifiez que les commandes s'affichent
4. Testez le téléchargement d'une carte
5. Testez le changement de statut

---

## 🎨 Ajouter vos propres templates

Pour ajouter des templates de cartes :

### Option 1 : Via l'interface (à venir)
Vous pouvez créer une interface d'admin pour uploader des templates.

### Option 2 : Directement dans Supabase

1. Préparez votre image de fond (format recommandé : 350x500px)
2. Uploadez-la dans `/public/templates/` de votre projet
3. Dans Supabase, allez dans "Table Editor" > "templates"
4. Cliquez sur "Insert" > "Insert row"
5. Remplissez :
   ```json
   name: "Mon Template MMA"
   image_url: "/templates/mon-template.jpg"
   category: "mma"
   positions: {
     "photo": {"x": 85, "y": 80, "width": 180, "height": 180},
     "name": {"x": 175, "y": 300, "fontSize": 24},
     "club": {"x": 175, "y": 330, "fontSize": 16},
     "flag": {"x": 30, "y": 30, "width": 40, "height": 30}
   }
   ```
6. Ajustez les positions selon votre design

---

## 🚀 Passer en production (mode réel)

Quand vous êtes prêt à accepter de vrais paiements :

### 1. Activer Stripe en production

1. Dans Stripe, désactivez le mode Test
2. Allez dans "Developers" > "API keys"
3. Récupérez vos clés **Live** (commencent par `pk_live_...` et `sk_live_...`)
4. Mettez à jour ces variables dans Vercel :
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
5. Mettez à jour le webhook avec la clé de production

### 2. Compléter votre profil Stripe

1. Allez dans "Settings" > "Account"
2. Remplissez toutes les informations légales
3. Ajoutez un compte bancaire pour recevoir les paiements

### 3. Configurer la TVA (optionnel)

Si vous voulez automatiser la gestion de la TVA :

1. Dans Stripe, activez "Stripe Tax" (0,5% par transaction)
2. Dans `app/api/create-checkout/route.ts`, changez :
   ```typescript
   automatic_tax: {
     enabled: true, // ← Activez ici
   }
   ```

---

## 📊 Tarification et coûts

### Plan gratuit (développement/test)

- ✅ Supabase : 500 Mo de stockage, 2 Go de bande passante
- ✅ Vercel : Bande passante illimitée, 100 Go déploiements
- ✅ Cloudinary : 25 crédits/mois (≈ 25 transformations)
- ✅ Remove.bg : 50 images/mois

### Plan production (recommandé)

- 💰 Vercel Pro : ~20 $/mois
- 💰 Supabase : Gratuit jusqu'à 500 Mo, puis ~25 $/mois
- 💰 Cloudinary : Gratuit jusqu'à 25 crédits, puis à partir de 89 $/mois
- 💰 Remove.bg : 40 € / 1000 images
- 💰 Stripe : 1,5% + 0,25 € par transaction réussie

---

## ❓ Dépannage

### Erreur "Cannot find module '@supabase/supabase-js'"

```bash
npm install
```

### Les templates ne s'affichent pas

Vérifiez que :
1. Le fichier SQL a bien été exécuté dans Supabase
2. Les variables d'environnement Supabase sont correctes
3. L'image `/public/spacepexels.jpg` existe

### Le paiement ne fonctionne pas

1. Vérifiez les clés Stripe (test vs production)
2. Vérifiez que le webhook est configuré
3. Regardez les logs dans Vercel : Settings > Functions > Logs

### Remove.bg ne fonctionne pas

1. Vérifiez votre clé API
2. Vérifiez votre quota (50 images/mois en gratuit)
3. Regardez la console du navigateur (F12) pour les erreurs

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans Vercel
2. Vérifiez la console du navigateur (F12)
3. Vérifiez les variables d'environnement
4. Consultez la documentation officielle :
   - [Next.js](https://nextjs.org/docs)
   - [Supabase](https://supabase.com/docs)
   - [Stripe](https://stripe.com/docs)

---

## ✅ Checklist finale

Avant de lancer en production :

- [ ] Toutes les dépendances sont installées
- [ ] La base de données Supabase est créée et peuplée
- [ ] Les variables d'environnement sont configurées
- [ ] Le webhook Stripe est configuré
- [ ] Le mot de passe admin a été changé
- [ ] Un test de paiement complet a été effectué
- [ ] Les templates personnalisés sont ajoutés
- [ ] Les clés Stripe sont en mode production
- [ ] Le profil Stripe est complet avec coordonnées bancaires

---

## 🎉 Félicitations !

Votre application de cartes personnalisées est maintenant configurée et prête à l'emploi.

Prochaines étapes possibles :
- Ajouter un système d'envoi d'emails automatiques
- Créer plus de templates personnalisés
- Ajouter des options de personnalisation (couleurs, polices)
- Implémenter un système de codes promo
- Ajouter l'export en haute résolution (pour impression)
