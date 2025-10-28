# MyFightCard - Cartes Personnalisées pour Sports de Combat

Application Next.js permettant de créer et vendre des cartes personnalisées pour combattants (MMA, Boxe, Kickboxing, etc.).

![MyFightCard Preview](public/spacepexels.jpg)

## Fonctionnalités

- ✅ Éditeur de carte en temps réel
- ✅ Upload de photo avec suppression automatique du fond (Remove.bg)
- ✅ Personnalisation complète (nom, club, drapeau)
- ✅ Templates multiples
- ✅ Paiement sécurisé via Stripe
- ✅ Interface d'administration pour gérer les commandes
- ✅ Stockage d'images sur Cloudinary
- ✅ Base de données Supabase

## Technologies utilisées

- **Frontend** : Next.js 15, React 19, TailwindCSS
- **Backend** : Next.js API Routes
- **Base de données** : Supabase (PostgreSQL)
- **Paiement** : Stripe
- **Stockage d'images** : Cloudinary
- **Suppression de fond** : Remove.bg API
- **Hébergement** : Vercel

## Installation rapide

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/myfightcard.git
cd myfightcard
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Remove.bg
REMOVE_BG_API_KEY=your-api-key

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurer la base de données Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Exécutez le script SQL fourni dans `supabase-schema.sql`

### 5. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Guide de configuration complet

📖 Pour un guide détaillé de configuration étape par étape, consultez [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## Structure du projet

```
myfightcard/
├── app/
│   ├── page.tsx              # Page principale avec l'éditeur
│   ├── admin/
│   │   └── page.tsx          # Interface d'administration
│   ├── success/
│   │   └── page.tsx          # Page de confirmation après paiement
│   └── api/
│       ├── create-checkout/  # Création de session Stripe
│       ├── remove-bg/        # API Remove.bg
│       └── webhooks/
│           └── stripe/       # Webhooks Stripe
├── components/
│   └── CardEditor.tsx        # Composant éditeur de carte
├── lib/
│   ├── supabase.ts          # Client Supabase
│   └── types.ts             # Types TypeScript
├── public/
│   └── templates/           # Images des templates
└── supabase-schema.sql      # Schéma de la base de données
```

## Déploiement sur Vercel

1. Connectez votre repository GitHub à Vercel
2. Ajoutez toutes les variables d'environnement
3. Déployez !

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Interface d'administration

Accédez à `/admin` pour :
- Visualiser toutes les commandes
- Télécharger les images finales
- Changer le statut des commandes (en attente, traitée, livrée)
- Filtrer par statut

Identifiants par défaut (à changer dans `.env.local`) :
- Username : `admin`
- Password : `change-this-password`

## Tester les paiements

En mode test, utilisez ces cartes Stripe :

- **Succès** : `4242 4242 4242 4242`
- **Décliné** : `4000 0000 0000 0002`
- Date d'expiration : n'importe quelle date future
- CVC : n'importe quel 3 chiffres

## Tarification

### Gratuit (pour tester)
- Supabase : 500 Mo
- Vercel : Déploiements illimités
- Remove.bg : 50 images/mois
- Cloudinary : 25 crédits/mois

### Production (recommandé)
- Vercel Pro : ~20 $/mois
- Supabase : Gratuit jusqu'à 500 Mo
- Remove.bg : 40 € / 1000 images
- Cloudinary : Gratuit jusqu'à 25 crédits
- Stripe : 1,5% + 0,25 € par transaction

## Améliorations futures

- [ ] Envoi automatique d'emails avec la carte
- [ ] Plus de templates
- [ ] Système de codes promo
- [ ] Export haute résolution
- [ ] Aperçu 3D de la carte
- [ ] Support multi-langues
- [ ] Gestion avancée des templates (interface admin)

## Support

Pour toute question ou problème :
1. Consultez le [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Vérifiez les issues GitHub
3. Créez une nouvelle issue

## Licence

MIT License - Voir [LICENSE](./LICENSE) pour plus de détails

## Auteur

Développé avec ❤️ pour la communauté des sports de combat

---

⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub !
