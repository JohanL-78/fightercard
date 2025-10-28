# 🚀 Prochaines étapes pour démarrer votre application

Bravo ! Votre application MyFightCard est maintenant configurée. Voici les étapes à suivre pour la mettre en ligne.

## ✅ Checklist de démarrage

### 1. Installer Node.js (si ce n'est pas déjà fait)

```bash
# Vérifier si Node.js est installé
node --version

# Si la commande ne fonctionne pas, installez Node.js depuis :
# https://nodejs.org/ (version LTS recommandée)
```

### 2. Installer les dépendances du projet

Dans le terminal, à la racine du projet :

```bash
npm install
```

Cette commande va télécharger et installer tous les packages nécessaires (Stripe, Supabase, etc.).

### 3. Configurer vos comptes (dans l'ordre)

#### A. Supabase (Base de données) - 5 minutes
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Exécutez le fichier `supabase-schema.sql` dans SQL Editor
5. Récupérez vos clés API (Settings > API)

#### B. Stripe (Paiements) - 5 minutes
1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte
3. Activez le mode TEST
4. Récupérez vos clés de test (Developers > API keys)

#### C. Cloudinary (Stockage d'images) - 3 minutes
1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit
3. Récupérez Cloud Name, API Key et API Secret

#### D. Remove.bg (Suppression de fond) - 2 minutes
1. Allez sur [remove.bg/api](https://remove.bg/api)
2. Créez un compte
3. Récupérez votre API Key

### 4. Créer votre fichier .env.local

À la racine du projet, créez un fichier `.env.local` et copiez ceci :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-ici
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role-ici

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE
STRIPE_WEBHOOK_SECRET=whsec_... (à ajouter après déploiement)

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# Remove.bg
REMOVE_BG_API_KEY=votre-api-key

# Admin - CHANGEZ IMMÉDIATEMENT !
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeMotDePasseSécurisé2024!

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **IMPORTANT** : Remplacez TOUTES les valeurs par vos vraies clés !

### 5. Tester en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

✅ **Vous devriez voir l'éditeur de cartes !**

### 6. Tester les fonctionnalités

- [ ] Uploadez une photo
- [ ] Personnalisez le nom et le club
- [ ] Testez "Supprimer le fond" (Remove.bg)
- [ ] Cliquez sur "Télécharger" puis "Procéder au paiement"
- [ ] Utilisez la carte de test : `4242 4242 4242 4242`
- [ ] Vérifiez que vous arrivez sur la page de succès
- [ ] Allez sur `/admin` et connectez-vous
- [ ] Vérifiez que la commande apparaît

### 7. Déployer sur Vercel (Production)

#### Option A : Via l'interface Vercel (recommandé)

1. Commitez votre code sur GitHub :
   ```bash
   git add .
   git commit -m "Configuration initiale"
   git push
   ```

2. Allez sur [vercel.com](https://vercel.com)
3. Connectez-vous avec GitHub
4. Importez votre repository `myfightcard`
5. Ajoutez TOUTES les variables d'environnement (copiez-collez depuis `.env.local`)
6. Changez `NEXT_PUBLIC_APP_URL` vers votre URL Vercel (ex: `https://myfightcard.vercel.app`)
7. Cliquez sur "Deploy"

#### Option B : Via la CLI Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### 8. Configurer le webhook Stripe (APRÈS le déploiement)

1. Retournez dans Stripe > Developers > Webhooks
2. Cliquez sur "Add endpoint"
3. URL du webhook : `https://VOTRE-APP.vercel.app/api/webhooks/stripe`
4. Sélectionnez l'événement : `checkout.session.completed`
5. Copiez le **Signing secret** (commence par `whsec_...`)
6. Dans Vercel, ajoutez la variable :
   - Nom : `STRIPE_WEBHOOK_SECRET`
   - Valeur : votre signing secret
7. Redéployez l'app dans Vercel

### 9. Tester en production

1. Allez sur votre site Vercel
2. Créez une carte et effectuez un paiement test
3. Vérifiez que tout fonctionne
4. Vérifiez que la commande apparaît dans `/admin`

---

## 📊 Coûts mensuels estimés

### Phase de test (gratuit)
- ✅ Supabase : 0 €
- ✅ Vercel : 0 €
- ✅ Cloudinary : 0 € (25 crédits/mois)
- ✅ Remove.bg : 0 € (50 images/mois)
- ✅ Stripe : 0 € (mode test)

**Total : 0 € par mois**

### En production (avec ~10 commandes/mois)
- Vercel Pro : ~20 €/mois (recommandé)
- Supabase : 0 € (dans le free tier)
- Cloudinary : 0 € (< 25 crédits)
- Remove.bg : ~0,40 € (10 images)
- Stripe : ~3 € (10 transactions × 1,5% + 0,25€)

**Total : ~23-25 € par mois**

---

## 🎨 Personnalisation

### Ajouter vos propres templates

1. Créez une image de fond (350x500px recommandé)
2. Placez-la dans `public/templates/mon-template.jpg`
3. Dans Supabase, allez dans Table Editor > templates > Insert row
4. Ajoutez votre template avec les positions des éléments

### Changer les couleurs

Modifiez le fichier [app/globals.css](app/globals.css) pour changer les couleurs :

```css
:root {
  --background: #0a0a0a;  /* Fond sombre */
  --foreground: #ededed;  /* Texte clair */
}
```

### Modifier le prix

Dans [app/page.tsx](app/page.tsx), ligne 102 :

```typescript
amount: 1500, // 15€ → Changez la valeur (en centimes)
```

---

## 🛟 Besoin d'aide ?

### Problèmes courants

**"Cannot find module..."**
```bash
npm install
```

**Les images ne s'affichent pas**
- Vérifiez que l'image existe dans `/public`
- Vérifiez les clés Cloudinary

**Le paiement ne fonctionne pas**
- Vérifiez que vous êtes en mode TEST dans Stripe
- Vérifiez les clés API Stripe
- Vérifiez que le webhook est configuré

**Remove.bg ne fonctionne pas**
- Vérifiez votre quota (50 images/mois gratuit)
- Vérifiez la clé API

### Ressources

- 📖 [Guide complet de configuration](SETUP_GUIDE.md)
- 📖 [Documentation Next.js](https://nextjs.org/docs)
- 📖 [Documentation Supabase](https://supabase.com/docs)
- 📖 [Documentation Stripe](https://stripe.com/docs)

---

## 🎉 Prêt pour la production ?

### Avant de lancer :

- [ ] J'ai testé toutes les fonctionnalités en local
- [ ] J'ai déployé sur Vercel
- [ ] J'ai configuré le webhook Stripe
- [ ] J'ai testé un paiement en production (mode test)
- [ ] J'ai changé le mot de passe admin
- [ ] J'ai ajouté au moins 1-2 templates personnalisés
- [ ] J'ai testé l'interface admin

### Pour passer en mode production (vrais paiements) :

1. Dans Stripe, passez en mode LIVE
2. Récupérez les clés LIVE (pk_live_... et sk_live_...)
3. Mettez à jour les variables dans Vercel
4. Configurez un nouveau webhook en mode LIVE
5. Complétez votre profil Stripe (infos légales + compte bancaire)

---

**Bon courage pour votre lancement ! 🚀**

Des questions ? Consultez le [SETUP_GUIDE.md](SETUP_GUIDE.md) ou créez une issue sur GitHub.
