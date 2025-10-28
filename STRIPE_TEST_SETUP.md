# Configuration Stripe en mode Test avec Webhooks

## 📋 Prérequis

- Stripe CLI installée : `brew install stripe/stripe-cli/stripe` (macOS)
- Compte Stripe en mode test
- Variables d'environnement configurées

## 🔧 Étapes de configuration

### 1. Activer la TVA automatique dans Stripe Dashboard

⚠️ **Important** : Avant de lancer les tests, vous devez activer la TVA automatique dans votre compte Stripe :

1. Allez sur [Stripe Dashboard > Settings > Tax](https://dashboard.stripe.com/settings/tax)
2. Cliquez sur "Start collecting tax"
3. Activez "Automatic tax calculation"
4. Configurez vos paramètres de TVA pour l'UE

Sans cette configuration, `automatic_tax: { enabled: true }` provoquera une erreur.

### 2. Nettoyer la base de données

Exécutez les scripts SQL dans l'ordre suivant sur votre base Supabase :

```bash
# 1. Ajouter les nouvelles colonnes pour l'adresse et la TVA
psql [VOTRE_CONNEXION_SUPABASE] < supabase-add-shipping.sql

# 2. Nettoyer les données de test (⚠️ supprime TOUTES les commandes)
psql [VOTRE_CONNEXION_SUPABASE] < supabase-clean-test-data.sql
```

Ou via l'interface Supabase SQL Editor :
- Copiez le contenu de `supabase-add-shipping.sql` et exécutez-le
- Copiez le contenu de `supabase-clean-test-data.sql` et exécutez-le

### 3. Configurer le webhook local avec Stripe CLI

```bash
# Se connecter à Stripe
stripe login

# Lancer le listener de webhook (remplacez 3000 par votre port si différent)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

La CLI vous donnera un **webhook signing secret** qui commence par `whsec_...`

### 4. Mettre à jour les variables d'environnement

Dans votre fichier `.env.local` :

```env
# Stripe (mode test)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Secret fourni par la CLI

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Lancer l'application

```bash
# Terminal 1 : Stripe CLI webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 2 : Application Next.js
npm run dev
```

## 🧪 Tester le flux de paiement

### Cartes de test Stripe

- **Paiement réussi** : `4242 4242 4242 4242`
- **Paiement refusé** : `4000 0000 0000 0002`
- **3D Secure requis** : `4000 0027 6000 3184`
- Date d'expiration : N'importe quelle date future
- CVC : N'importe quel nombre à 3 chiffres
- Code postal : N'importe quel code postal valide

### Scénario de test complet

1. **Créer une carte personnalisée**
   - Ajoutez une photo
   - Remplissez le nom et les stats
   - Sélectionnez un drapeau

2. **Cliquer sur "Passer commande"**
   - Entrez votre email
   - Vérifiez que la page Stripe Checkout s'ouvre

3. **Vérifier la collecte d'informations**
   - ✅ Email pré-rempli
   - ✅ Formulaire d'adresse de livraison affiché
   - ✅ TVA calculée automatiquement selon le pays
   - ✅ Montant total = Prix HT + TVA

4. **Remplir le formulaire de paiement**
   - Carte : `4242 4242 4242 4242`
   - Adresse de test (exemple pour France) :
     - Nom : Test User
     - Adresse : 123 Rue de Test
     - Ville : Paris
     - Code postal : 75001
     - Pays : France

5. **Valider le paiement**
   - Vérifiez les logs du webhook dans le terminal Stripe CLI
   - Vérifiez que vous êtes redirigé vers `/success`

6. **Vérifier dans Supabase**
   ```sql
   SELECT
     id,
     customer_email,
     shipping_name,
     shipping_city,
     shipping_country,
     amount,
     tax_amount,
     total_amount,
     status
   FROM orders
   ORDER BY created_at DESC
   LIMIT 5;
   ```

## 📊 Données enregistrées dans la BDD

Après un paiement réussi, la commande contient :

- **Informations client** : `customer_email`
- **Adresse de livraison** :
  - `shipping_name`
  - `shipping_address_line1`
  - `shipping_address_line2`
  - `shipping_city`
  - `shipping_postal_code`
  - `shipping_country`
- **Montants** :
  - `amount` : Prix HT (en centimes)
  - `tax_amount` : Montant de la TVA (en centimes)
  - `total_amount` : Prix TTC (en centimes)
- **Statut** : `pending` → Visible dans l'admin pour traitement
- **Paiement** : `stripe_payment_id`
- **Image** : `final_image_url` (URL Cloudinary)
- **Personnalisation** : `customization` (JSON)

## 🚨 Résolution de problèmes

### Erreur "Tax calculation failed"
➡️ Vous n'avez pas activé la TVA automatique dans Stripe Dashboard. Voir étape 1.

### Webhook non reçu
➡️ Vérifiez que la Stripe CLI est bien lancée et que le port est correct.

### Erreur "Column does not exist"
➡️ Exécutez le script `supabase-add-shipping.sql` pour ajouter les colonnes manquantes.

### Adresse non enregistrée
➡️ Vérifiez les logs du webhook. L'objet `session.shipping_details` doit être présent.

## 🎯 Prochaines étapes

- [ ] Créer l'interface admin pour voir les commandes avec adresses
- [ ] Ajouter l'envoi d'email de confirmation avec adresse
- [ ] Implémenter l'export des commandes au format CSV
- [ ] Ajouter la possibilité de marquer une commande comme "expédiée"
- [ ] Configurer les webhooks en production

## 📝 Notes importantes

- En mode test, la TVA est calculée mais pas réellement collectée
- Les adresses de test ne sont pas validées par Stripe
- N'oubliez pas de mettre à jour `STRIPE_WEBHOOK_SECRET` en production
- La livraison est actuellement gratuite (configurable dans `shipping_options`)
