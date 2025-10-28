# 💳 Stripe pour un Particulier / Auto-entrepreneur

## 🎯 Les 3 cas de figure

### Cas 1 : Simple démo / Portfolio ⭐ (RECOMMANDÉ pour commencer)
**Vous voulez juste montrer que ça marche**

✅ **Rester en mode TEST**
- Aucune validation requise
- Fonctionne immédiatement
- Cartes de test : `4242 4242 4242 4242`
- Parfait pour une démo client
- Gratuit à 100%

❌ **Limitations**
- Pas de vrais paiements
- Le client ne peut pas payer pour de vrai

---

### Cas 2 : Auto-entrepreneur / Micro-entreprise
**Le client a un SIRET et veut recevoir de l'argent**

#### Documents requis :
1. **Pièce d'identité** (CNI recto-verso ou passeport)
2. **RIB** (compte bancaire personnel ou pro)
3. **SIRET** (numéro d'auto-entrepreneur)
4. **Justificatif d'adresse** (facture électricité/internet de moins de 3 mois)

#### Processus :
1. Aller sur https://dashboard.stripe.com/account/onboarding
2. Choisir **"Individual"** (Particulier)
3. Remplir le formulaire
4. Upload des documents
5. Validation en **24-48h** généralement

#### Frais Stripe :
- **1,5% + 0,25€** par transaction en Europe
- Exemple : Pour 15€, Stripe prend 0,48€, vous recevez 14,52€

---

### Cas 3 : Simple particulier (sans SIRET)
**Le client n'a pas de statut légal**

❌ **Impossible avec Stripe directement**

Stripe exige obligatoirement :
- Soit une entreprise (SIRET, SIREN)
- Soit un auto-entrepreneur

#### Alternatives :
1. **Créer une auto-entreprise** (gratuit et rapide)
   - https://www.autoentrepreneur.urssaf.fr
   - En ligne en 15 minutes
   - Gratuit
   - SIRET reçu en 1-2 semaines

2. **Utiliser PayPal** (accepte les particuliers)
   - Plus simple pour les particuliers
   - Frais plus élevés (2,9% + 0,35€)
   - Moins professionnel

3. **Vendre via une marketplace**
   - Etsy, Shopify, etc.
   - Ils gèrent les paiements
   - Commission plus élevée

---

## 🚀 Recommandation selon le cas

### Scénario A : "C'est juste pour montrer au client"
➡️ **Restez en mode TEST Stripe**
- Déployez sur Vercel
- Gardez les clés test
- Montrez la démo avec `4242 4242 4242 4242`
- Aucune validation nécessaire

### Scénario B : "Le client veut vendre ses cartes"
➡️ **Le client doit créer une auto-entreprise**
1. Inscription auto-entrepreneur (gratuit)
2. Réception SIRET (1-2 semaines)
3. Activation compte Stripe (24-48h après documents)
4. Passage en mode Live

### Scénario C : "C'est juste moi qui teste"
➡️ **Mode TEST indéfiniment**
- Parfait pour le développement
- Aucun frais
- Toutes les fonctionnalités disponibles

---

## 💰 Frais et revenus

### Exemple avec 100 ventes à 15€ :

**Mode TEST :**
- Revenus : 0€ (paiements fictifs)
- Frais : 0€
- Total : 0€

**Mode LIVE (avec auto-entreprise) :**
- Prix de vente : 15€ × 100 = 1500€
- Frais Stripe : (1,5% + 0,25€) × 100 = 47,50€
- Frais auto-entrepreneur (22% de charges) : 330€
- Revenus nets : ~1122€

---

## 📋 Checklist : Passer un particulier en production

### Étape 1 : Statut légal (si pas déjà fait)
- [ ] S'inscrire en auto-entrepreneur sur https://www.autoentrepreneur.urssaf.fr
- [ ] Choisir "Vente de biens / Commerce électronique"
- [ ] Attendre le SIRET (1-2 semaines)

### Étape 2 : Compte bancaire
- [ ] Avoir un compte bancaire (personnel ou pro)
- [ ] Récupérer un RIB

### Étape 3 : Documents d'identité
- [ ] Préparer CNI ou passeport (scan recto-verso)
- [ ] Préparer justificatif de domicile récent

### Étape 4 : Activation Stripe
- [ ] Aller sur https://dashboard.stripe.com/account/onboarding
- [ ] Sélectionner "Individual"
- [ ] Remplir les informations
- [ ] Upload des documents
- [ ] Attendre validation (24-48h)

### Étape 5 : Configuration production
- [ ] Récupérer les clés `pk_live_...` et `sk_live_...`
- [ ] Configurer le webhook production
- [ ] Déployer sur Vercel avec les clés live

---

## ⚠️ Points importants

### Obligations légales auto-entrepreneur :
1. **Déclarer son chiffre d'affaires** tous les mois/trimestres
2. **Payer les charges sociales** (≈22% du CA)
3. **Facturation** : Stripe génère des reçus, mais vous devez tenir une compta
4. **Plafonds** :
   - Vente de biens : 188 700€/an
   - Prestations de services : 77 700€/an

### Stripe auto-prélève :
- Les frais Stripe sont déduits automatiquement
- Vous recevez le montant net sur votre compte
- Paiements tous les 2-7 jours (configurable)

---

## 🎯 Mon conseil

**Si c'est une démo / prototype :**
➡️ Restez en mode TEST, c'est largement suffisant

**Si le client veut vraiment vendre :**
➡️ Il doit créer une auto-entreprise d'abord (c'est obligatoire légalement de toute façon pour vendre en ligne)

**Vous pouvez faire toute la configuration technique AVANT** que le client ait son SIRET, en restant en mode test. Quand il aura son SIRET et son compte Stripe activé, il suffira de changer 3 variables d'environnement ! 🚀
