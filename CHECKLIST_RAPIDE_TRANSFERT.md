# ✅ CHECKLIST RAPIDE - Transfert Client (Pour vous)

## 🎯 Session de transfert : 2-3h en visio

---

## 📋 AVANT LA SESSION

- [ ] Client a reçu le code source (zip ou accès GitHub)
- [ ] Client a lu le `GUIDE_TRANSFERT_CLIENT.md`
- [ ] Vous avez préparé un document partagé (Google Doc) pour noter les credentials
- [ ] Session Zoom/Google Meet planifiée

---

## 🔵 ÉTAPE 1 : GitHub (10 min)

**Vous faites (si vous transférez le code) :**
- [ ] Créer un repo GitHub sur le compte du client
- [ ] Push le code nettoyé (sans .env.local)

**OU Client fait :**
- [ ] Créer compte GitHub
- [ ] Créer repo `myfightcard` (private)
- [ ] Vous lui envoyez le code source (zip)

**Vérification :**
- [ ] Code visible dans le repo GitHub
- [ ] README.md présent

---

## 🟢 ÉTAPE 2 : Supabase (20 min)

**Client fait (vous guidez) :**
- [ ] Créer compte sur supabase.com
- [ ] Créer projet `myfightcard`
- [ ] Choisir région Europe West (Paris)
- [ ] Attendre 2-3 min la création

**Récupérer les clés :**
- [ ] Settings → API
- [ ] Copier Project URL
- [ ] Copier anon/public key
- [ ] Copier service_role key
- [ ] **Tout noter dans le doc partagé**

**Exécuter les SQL (IMPORTANT) :**
- [ ] SQL Editor → New query
- [ ] Copier-coller `supabase-schema.sql` → Run
- [ ] New query → `supabase-migration.sql` → Run
- [ ] New query → `supabase-rls-update.sql` → Run
- [ ] New query → `supabase-apply-security-NOW.sql` → Run
- [ ] New query → `supabase-settings.sql` → Run
- [ ] SQL Editor → Execute: `ALTER TABLE settings DISABLE ROW LEVEL SECURITY;`

**Vérification :**
- [ ] Table Editor → `templates`, `orders` et `settings` existent
- [ ] Au moins 1 template visible dans la table
- [ ] Table `settings` contient une ligne avec `contact_email`

---

## 💳 ÉTAPE 3 : Stripe (15 min)

**Client fait :**
- [ ] Créer compte sur dashboard.stripe.com
- [ ] Rester en MODE TEST (badge orange en haut)
- [ ] Developers → API keys

**Récupérer les clés TEST :**
- [ ] Copier Publishable key (pk_test_...)
- [ ] Copier Secret key (sk_test_...)
- [ ] **Tout noter dans le doc partagé**

⏸️ **Webhook = on le fera après Vercel**

---

## ☁️ ÉTAPE 4 : Cloudinary (10 min)

**Client fait :**
- [ ] Créer compte sur cloudinary.com/users/register/free
- [ ] Type : Developer

**Récupérer les clés :**
- [ ] Dashboard → Copier Cloud name
- [ ] Copier API Key
- [ ] Copier API Secret
- [ ] **Tout noter dans le doc partagé**

**Créer preset unsigned :**
- [ ] Settings → Upload → Add upload preset
- [ ] Preset name : `fight-cards-unsigned`
- [ ] Signing Mode : **Unsigned** ⚠️
- [ ] Folder : `fight-cards`
- [ ] Save

**Vérification :**
- [ ] Preset `fight-cards-unsigned` visible dans la liste

---

## 🎨 ÉTAPE 5 : Pixian (OPTIONNEL - 5 min)

**Demandez au client :**
- "Voulez-vous activer l'aperçu de suppression du fond ?"
  - OUI → pixian.ai/api → copier API ID et Secret
  - NON → Laissez vide (l'app fonctionne sans)

- [ ] Décision prise et notée

---

## 🔷 ÉTAPE 6 : Vercel (30 min) ⚠️ ÉTAPE CRITIQUE

**Client fait :**
- [ ] Créer compte sur vercel.com/signup
- [ ] Continue with GitHub
- [ ] Plan Hobby (gratuit)

**Import projet :**
- [ ] Add New → Project
- [ ] Import `myfightcard` repository

**Configurer TOUTES les variables d'environnement :**

```bash
# Supabase (3 variables)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe TEST (3 variables)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_TEMPORAIRE

# Cloudinary (3 variables)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Pixian (2 variables - optionnel)
PIXIAN_API_ID=
PIXIAN_API_SECRET=

# Admin (3 variables) ⚠️ GÉNÉRER DES VALEURS FORTES
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_JWT_SECRET=

# App URL (1 variable - temporaire)
NEXT_PUBLIC_APP_URL=https://TEMPORAIRE.vercel.app
```

**Pour ADMIN_JWT_SECRET :**
```bash
# Mac/Linux terminal
openssl rand -base64 32

# Windows : utiliser https://www.random.org/strings/
```

- [ ] Toutes les variables remplies (scrollez pour vérifier)
- [ ] Cliquez Deploy
- [ ] ⏳ Attendez 5-10 min

**Récupérer l'URL :**
- [ ] Déploiement terminé → Copier l'URL (https://myfightcard-xxx.vercel.app)
- [ ] Visiter le site pour vérifier

**Mettre à jour NEXT_PUBLIC_APP_URL :**
- [ ] Settings → Environment Variables
- [ ] Edit NEXT_PUBLIC_APP_URL
- [ ] Remplacer par la vraie URL
- [ ] Save
- [ ] Deployments → Dernier déploiement → Redeploy

**Vérification :**
- [ ] Site accessible
- [ ] Templates s'affichent
- [ ] Pas d'erreur 500

---

## 🔗 ÉTAPE 7 : Webhook Stripe (10 min)

**Retour sur Stripe :**
- [ ] Developers → Webhooks
- [ ] Add endpoint
- [ ] URL : `https://VRAIE-URL.vercel.app/api/webhooks/stripe`
- [ ] Select events → `checkout.session.completed` uniquement
- [ ] Add endpoint

**Récupérer webhook secret :**
- [ ] Cliquer sur l'endpoint créé
- [ ] Signing secret → Reveal → Copier (whsec_...)

**Mettre à jour Vercel :**
- [ ] Vercel → Settings → Environment Variables
- [ ] Edit STRIPE_WEBHOOK_SECRET
- [ ] Remplacer par la vraie valeur whsec_...
- [ ] Save
- [ ] Redeploy

**Vérification :**
- [ ] Webhook secret mis à jour dans Vercel

---

## 🧪 ÉTAPE 8 : Tests complets (15 min)

**Test 1 : Homepage**
- [ ] Ouvrir https://VOTRE-APP.vercel.app
- [ ] Templates s'affichent
- [ ] Pas d'erreur console (F12)

**Test 2 : Éditeur**
- [ ] Cliquer sur un template
- [ ] Upload une photo
- [ ] Photo s'affiche dans l'aperçu
- [ ] Modifier nom, stats, rating
- [ ] Aperçu se met à jour en temps réel

**Test 3 : Remove-bg (si Pixian activé)**
- [ ] Cliquer "Tester la suppression du fond"
- [ ] Fond retiré avec watermark Pixian (ou message si non configuré)

**Test 4 : Paiement TEST**
- [ ] Cliquer "Passer commande"
- [ ] Email : test@test.com
- [ ] Stripe Checkout s'ouvre
- [ ] Carte : 4242 4242 4242 4242
- [ ] Date : 12/25 | CVC : 123
- [ ] Pay → Redirection page succès

**Test 5 : Admin**
- [ ] Aller sur /admin
- [ ] Login avec ADMIN_USERNAME et ADMIN_PASSWORD
- [ ] Commande test visible
- [ ] Status : pending

**Test 6 : Vérifications backend**
- [ ] Supabase → Table orders → Commande présente
- [ ] Stripe → Payments → Paiement test visible

**Vérification finale :**
- [ ] TOUS les tests passent ✅

---

## 📝 APRÈS LA SESSION

**À envoyer au client :**
- [ ] Document avec tous les credentials (Google Doc → PDF)
- [ ] `GUIDE_TRANSFERT_CLIENT.md`
- [ ] `.env.local.CLIENT_TEMPLATE`
- [ ] `.env.example`
- [ ] Vidéo Loom de la session (enregistrement)

**À faire de votre côté :**
- [ ] Supprimer le Google Doc partagé (après que le client l'ait sauvegardé)
- [ ] Retirer votre accès aux comptes client (si vous aviez été invité)
- [ ] Garder une copie du code pour référence (support futur)

---

## 🚨 POINTS DE BLOCAGE FRÉQUENTS

### Supabase : "Templates not found"
→ SQL pas exécuté dans l'ordre ou incomplet
→ Ré-exécuter tous les fichiers SQL

### Vercel : Erreur de build
→ Variable d'environnement manquante
→ Vérifier que TOUTES les variables sont remplies

### Stripe : Webhook ne fonctionne pas
→ Mauvaise URL ou événement non configuré
→ Vérifier l'URL exacte et que `checkout.session.completed` est coché

### Cloudinary : Upload fail
→ Preset "unsigned" non créé ou mal configuré
→ Vérifier le nom exact : `fight-cards-unsigned`

---

## 💰 PASSAGE EN PRODUCTION (À FAIRE PLUS TARD)

⚠️ **NE PAS FAIRE LE JOUR MÊME** - Attendre que le client teste plusieurs jours

Quand le client est prêt :
- [ ] Stripe : Activer le compte (business info)
- [ ] Stripe : Récupérer clés LIVE (pk_live, sk_live)
- [ ] Stripe : Créer nouveau webhook en mode LIVE
- [ ] Vercel : Mettre à jour les 3 variables Stripe
- [ ] Vercel : Redeploy
- [ ] Test avec vraie carte
- [ ] Vérifier le paiement arrive bien

---

## ✅ SESSION RÉUSSIE

**Critères de succès :**
- ✅ Site déployé et accessible
- ✅ Tous les tests passent
- ✅ Client peut se connecter à l'admin
- ✅ Paiement test fonctionne de bout en bout
- ✅ Client a tous les accès et credentials

**Durée moyenne : 2h-3h**

---

*Checklist pour vous - À utiliser pendant la session de transfert*
