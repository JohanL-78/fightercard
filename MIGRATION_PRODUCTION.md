# 🚀 Migration vers la Production

## ✅ Ce qui fonctionne actuellement en TEST

- ✅ Création de cartes personnalisées
- ✅ Upload d'images sur Cloudinary
- ✅ Paiement Stripe avec collecte d'adresse
- ✅ Webhooks Stripe fonctionnels
- ✅ Enregistrement des commandes avec adresse complète
- ✅ Interface admin avec toutes les infos
- ✅ Sélection de drapeaux via FlagCDN

---

## 📋 Checklist de migration en Production

### 1. 🔐 Stripe - Passer en mode Live

#### A. Activer le compte Stripe

**🏢 Pour une entreprise :**
- [ ] Aller sur https://dashboard.stripe.com/account/onboarding
- [ ] Compléter les informations de l'entreprise
- [ ] Fournir les documents requis (KBIS, RIB, etc.)
- [ ] Attendre la validation (peut prendre 1-2 jours)

**👤 Pour un particulier (auto-entrepreneur, micro-entreprise, etc.) :**
- [ ] Aller sur https://dashboard.stripe.com/account/onboarding
- [ ] Sélectionner "Individual" (Particulier)
- [ ] Fournir :
  - Pièce d'identité (CNI ou passeport)
  - RIB personnel
  - SIRET (si auto-entrepreneur)
  - Numéro de TVA intracommunautaire (si applicable)
- [ ] Validation plus rapide (quelques heures à 1 jour)

**💡 Option simple : Rester en mode test**
Si c'est juste pour tester ou pour un petit volume :
- Vous pouvez garder le mode test indéfiniment
- Les cartes de test fonctionnent
- Aucun argent réel n'est échangé
- Parfait pour une démo ou un prototype

#### B. Récupérer les clés de Production
Une fois le compte activé :
- [ ] Aller sur https://dashboard.stripe.com/apikeys
- [ ] Basculer sur "Live mode" (toggle en haut à droite)
- [ ] Copier la `Publishable key` (commence par `pk_live_...`)
- [ ] Copier la `Secret key` (commence par `sk_live_...`)

#### C. Configurer le webhook en production
- [ ] Aller sur https://dashboard.stripe.com/webhooks
- [ ] Cliquer "Add endpoint"
- [ ] URL du webhook : `https://VOTRE_DOMAINE.com/api/webhooks/stripe`
- [ ] Sélectionner l'événement : `checkout.session.completed`
- [ ] Copier le "Signing secret" (commence par `whsec_...`)

#### D. Activer la TVA automatique (optionnel)
- [ ] Aller sur https://dashboard.stripe.com/settings/tax
- [ ] Activer "Automatic tax calculation"
- [ ] Dans le code, changer `automatic_tax: { enabled: false }` → `true`

---

### 2. 🌐 Déploiement sur Vercel

#### A. Préparer le projet
```bash
# S'assurer que tout est commité
git add .
git commit -m "Production ready"
git push origin main
```

#### B. Déployer sur Vercel
- [ ] Aller sur https://vercel.com
- [ ] Importer le repository GitHub
- [ ] Configurer les variables d'environnement (voir section suivante)
- [ ] Déployer

#### C. Variables d'environnement Production
Dans Vercel > Settings > Environment Variables :

```env
# Stripe LIVE (mode production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Celui du webhook production

# Supabase (même qu'en dev ou créer un nouveau projet)
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Cloudinary (même qu'en dev)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Pixian (suppression de fond)
PIXIAN_API_ID=...
PIXIAN_API_SECRET=...

# Admin (⚠️ CHANGER LES IDENTIFIANTS !)
NEXT_PUBLIC_ADMIN_USERNAME=admin_prod
NEXT_PUBLIC_ADMIN_PASSWORD=MotDePasseSecurisé123!

# App URL (votre domaine de production)
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

---

### 3. 🗄️ Base de données Supabase

**Option A : Utiliser la même DB (dev + prod)**
- [ ] Nettoyer les commandes de test : exécuter `supabase-clean-test-data.sql`
- [ ] C'est tout !

**Option B : Créer une nouvelle DB de production** (recommandé)
- [ ] Créer un nouveau projet Supabase
- [ ] Exécuter les scripts SQL dans l'ordre :
  1. `supabase-schema.sql` (structure de base)
  2. `supabase-add-shipping.sql` (colonnes adresse)
- [ ] Mettre à jour les variables d'environnement Vercel

---

### 4. 📧 Email de confirmation (TODO)

Actuellement, aucun email n'est envoyé après paiement. À ajouter :

#### Options possibles :
1. **Resend** (recommandé - gratuit jusqu'à 3000 emails/mois)
2. **SendGrid** (gratuit jusqu'à 100 emails/jour)
3. **Mailgun** (gratuit jusqu'à 1000 emails/mois)

#### Code à ajouter dans le webhook :
```typescript
// Après la mise à jour de la commande
await sendOrderConfirmationEmail({
  to: order.customer_email,
  customerName: order.shipping_name,
  orderId: order.id,
  downloadUrl: order.final_image_url,
  shippingAddress: {
    line1: order.shipping_address_line1,
    city: order.shipping_city,
    country: order.shipping_country,
  }
})
```

---

### 5. 🎨 Personnalisation pour le client

#### Branding à modifier :
- [ ] Logo : remplacer `/fclogo.png` et `/logofc.png`
- [ ] Nom de l'app : "Fighter Card" → Nouveau nom
- [ ] Couleurs principales dans `globals.css` :
  ```css
  --primary-blue: #3B82F6;  /* Changer */
  --primary-red: #EF4444;   /* Changer */
  ```
- [ ] Prix : Actuellement 15€ dans `app/page.tsx` ligne 220

#### Templates personnalisés :
- [ ] Créer de nouveaux templates dans Supabase
- [ ] Ou modifier les templates par défaut dans `app/page.tsx`

---

### 6. 🔒 Sécurité

#### À faire absolument :
- [ ] Changer les identifiants admin dans `.env`
- [ ] Activer HTTPS (automatique avec Vercel)
- [ ] Configurer les CORS si nécessaire
- [ ] Vérifier les policies RLS dans Supabase

#### Supabase RLS (Row Level Security) :
```sql
-- Vérifier que ces policies existent
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- Si besoin, restreindre l'accès admin
-- (nécessite un vrai système d'auth)
```

---

### 7. 📊 Monitoring et Logs

#### À configurer :
- [ ] Stripe Dashboard : Surveiller les paiements
- [ ] Vercel Analytics : Suivre le trafic
- [ ] Sentry (optionnel) : Suivi des erreurs
- [ ] Logs Supabase : Vérifier les requêtes

---

### 8. 🧪 Tests en Production

#### Checklist de test :
- [ ] Créer une carte complète
- [ ] Effectuer un paiement réel (1€ puis rembourser)
- [ ] Vérifier que l'adresse est enregistrée
- [ ] Vérifier que la commande apparaît dans l'admin
- [ ] Tester le téléchargement de l'image
- [ ] Tester sur mobile et desktop

---

## 🎯 Ordre d'exécution recommandé

1. **Jour 1** : Activer le compte Stripe
2. **Jour 2-3** : Attendre validation Stripe
3. **Jour 4** : Déployer sur Vercel avec les clés live
4. **Jour 5** : Nettoyer la DB et tester
5. **Jour 6** : Personnalisation client (logo, couleurs, etc.)
6. **Jour 7** : Tests finaux et mise en ligne

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs Vercel : https://vercel.com/dashboard
2. Vérifier les webhooks Stripe : https://dashboard.stripe.com/webhooks
3. Vérifier les logs Supabase : https://supabase.com/dashboard

---

## 🎉 Une fois en production

- Les clients paient avec de vraies cartes
- Les webhooks sont automatiques (pas besoin de Stripe CLI)
- L'adresse est collectée automatiquement
- Tout est enregistré dans l'admin

**Félicitations ! Vous avez un système complet et fonctionnel ! 🚀**
