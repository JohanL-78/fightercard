# 🔐 Conformité RGPD - Guide Client

⚠️ **IMPORTANT** : Votre application collecte des données personnelles (emails, adresses, photos).
Vous devez être conforme au RGPD (Règlement Général sur la Protection des Données).

---

## ✅ Ce qui est DÉJÀ fait (dans le code)

1. ✅ Page "Politique de Confidentialité" accessible sur `/privacy`
2. ✅ Page "Mentions Légales" accessible sur `/legal`
3. ✅ Banner de consentement cookies (apparaît automatiquement)
4. ✅ Liens dans le footer de chaque page
5. ✅ Données chiffrées (SSL/TLS automatique avec Vercel)
6. ✅ Hébergement sécurisé (Vercel, Supabase EU)
7. ✅ Pas de cookies de tracking ou publicitaires

**Vous êtes déjà 80% conforme !** Il ne reste que quelques informations à compléter.

---

## 📝 CE QUE VOUS DEVEZ FAIRE (30 minutes)

### 1. Compléter les pages légales avec VOS informations

**Pendant notre session de configuration**, je vous guiderai pour ouvrir et modifier ces fichiers :

#### Fichier `/app/privacy/page.tsx`

Remplacez les sections marquées en jaune :

```
[NOM DE L'ENTREPRISE DU CLIENT]  → Ex: "John Doe EURL"
[ADRESSE COMPLÈTE]               → Ex: "15 Rue de la République, 75001 Paris, France"
CONTACT@EMAIL.COM                → Ex: "contact@myfightcard.fr"
```

#### Fichier `/app/legal/page.tsx`

Remplacez :

```
[NOM DE L'ENTREPRISE]            → Ex: "John Doe EURL"
[Auto-entrepreneur / SARL / SAS] → Votre forme juridique
[NUMÉRO SIRET]                   → Votre SIRET (14 chiffres)
[ADRESSE COMPLÈTE]               → Votre adresse professionnelle
CONTACT@EMAIL.COM                → Votre email professionnel
[TÉLÉPHONE]                      → Optionnel
[NOM PRÉNOM du dirigeant]        → Votre nom complet
```

**💡 Astuce** : Pendant la session, vous copierez-collerez simplement vos informations. C'est très simple !

---

### 2. Respecter les obligations RGPD au quotidien

#### Quand un client vous contacte pour exercer ses droits :

**🔍 Droit d'accès** - "Je veux savoir quelles données vous avez sur moi"
1. Connectez-vous à Supabase (votre base de données)
2. Table `orders` → Cherchez par email
3. Exportez les données (bouton Export en CSV)
4. Envoyez par email sous 1 mois maximum

**🗑️ Droit à l'effacement** - "Je veux supprimer mes données"
1. Supabase → Table `orders` → Supprimez la commande
2. Cloudinary → Dashboard → Supprimez les images associées
3. Confirmez par email sous 1 mois maximum
4. ⚠️ Exception : Si obligations comptables (3 ans), expliquez-le au client

**✏️ Droit de rectification** - "Mon email/adresse est incorrect"
1. Supabase → Table `orders` → Cliquez sur la ligne
2. Modifiez les informations
3. Confirmez par email

**📊 Droit à la portabilité** - "Je veux récupérer mes données"
1. Supabase → Table `orders` → Export CSV
2. Envoyez le fichier par email

**⏸️ Droit d'opposition** - "Je ne veux pas que vous utilisiez mes données"
1. Si la commande est terminée : Proposez la suppression
2. Si obligations légales : Expliquez que vous devez conserver 3 ans

**Délai légal maximum : 1 mois pour répondre**

---

### 3. Tenir un registre des traitements (Recommandé)

**Pourquoi ?** La CNIL peut vous demander ce document en cas de contrôle.

**Créez un simple document Word/Google Doc avec :**

```
REGISTRE DES TRAITEMENTS DE DONNÉES PERSONNELLES
================================================

1. FINALITÉ : Gestion des commandes de cartes personnalisées

2. DONNÉES COLLECTÉES :
   - Email client
   - Nom et prénom
   - Adresse de livraison
   - Photo uploadée
   - Statistiques de la carte (non personnelles)

3. BASE LÉGALE :
   - Exécution du contrat (commande)
   - Consentement (utilisation de la photo)

4. DESTINATAIRES :
   - Moi-même (admin)
   - Stripe (paiements)
   - Supabase (hébergement)
   - Cloudinary (stockage images)
   - Service postal (livraison)

5. DURÉE DE CONSERVATION :
   - Données de commande : 3 ans (obligations comptables)
   - Photos : Supprimées après livraison (sauf demande client)

6. MESURES DE SÉCURITÉ :
   - Chiffrement SSL/TLS
   - Accès admin protégé par mot de passe
   - Hébergeurs certifiés (Vercel, Supabase)
   - Sauvegardes automatiques

7. DROITS DES PERSONNES :
   Accès, rectification, effacement, portabilité, opposition
   Contact : VOTRE_EMAIL

Date de création : [DATE]
Responsable : [VOTRE NOM]
```

**Conservez ce document** (pas besoin de le publier, juste de l'avoir en cas de contrôle).

---

## ⚠️ Risques si non-conforme

### Amendes CNIL

**Théoriques :**
- Jusqu'à 20M€ ou 4% du chiffre d'affaires mondial

**En pratique pour petites entreprises :**
- 1ère fois : Avertissement + mise en demeure (gratuit)
- Si non-respect : 5,000€ - 50,000€
- Cas grave : 50,000€ - 300,000€

### Autres risques
- Plaintes clients → Mauvaise réputation
- Site bloqué temporairement
- Obligation de notifier tous les clients si fuite de données

**💡 Bonne nouvelle** : Si vous suivez ce guide, vous êtes conforme et les risques sont quasi nuls.

---

## 📊 Auto-évaluation : Êtes-vous conforme ?

Cochez mentalement :

- [ ] ✅ J'ai complété mes informations dans `/privacy` et `/legal`
- [ ] ✅ Les liens footer fonctionnent sur toutes les pages
- [ ] ✅ Le banner cookies s'affiche à la première visite
- [ ] ✅ Je sais comment répondre aux demandes RGPD
- [ ] ✅ J'ai créé mon registre des traitements
- [ ] ✅ Mon email de contact fonctionne

**6/6 = Vous êtes conforme ! 🎉**

---

## 💰 Besoin d'aide juridique ?

### Option 1 : Faire vous-même (Gratuit)
✅ Remplissez les templates fournis
✅ Suivez ce guide
✅ Consultez : https://www.cnil.fr/fr/rgpd-passer-a-laction

### Option 2 : Générateurs en ligne (50-100€)
- https://www.legalplace.fr (Politique de confidentialité sur mesure)
- https://www.rocket-lawyer.com/fr
- https://www.gdprform.io

### Option 3 : Avocat spécialisé RGPD (200-500€)
- Rédaction 100% personnalisée
- Audit complet de votre site
- Sécurité juridique maximale
- Recommandé si vous traitez beaucoup de données

---

## 🚨 Cas particuliers

### Si vous êtes auto-entrepreneur sans TVA

Dans `/privacy/page.tsx`, ajoutez :
```
TVA non applicable, article 293 B du CGI
```

### Si vous sous-traitez la création des cartes

Ajoutez dans la section "Destinataires" :
```
- Graphiste externe (création des cartes finales)
```

Et assurez-vous d'avoir un contrat de sous-traitance avec clause RGPD.

### Si vous faites de la publicité Facebook/Google

⚠️ **Vous devrez ajouter** :
1. Banner de consentement plus complet (cookies publicitaires)
2. Politique de cookies détaillée
3. Intégration d'un outil de gestion des cookies (ex: Axeptio, Cookiebot)

**Coût** : 0-50€/mois selon l'outil

---

## 📞 Questions fréquentes

**Q : Dois-je déclarer mon site à la CNIL ?**
R : Non, la déclaration préalable n'existe plus depuis 2018. Vous devez juste être conforme au RGPD.

**Q : Combien de temps dois-je conserver les commandes ?**
R : Minimum 3 ans (obligations comptables et fiscales françaises). Vous pouvez anonymiser après.

**Q : Puis-je utiliser les emails clients pour du marketing ?**
R : Seulement si le client a coché une case "J'accepte de recevoir des offres". Sinon, c'est interdit.

**Q : Que faire en cas de piratage/fuite de données ?**
R :
1. Sécuriser immédiatement le site
2. Notifier la CNIL sous 72h (https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles)
3. Informer les clients concernés par email
4. Documenter l'incident

**Q : Mon hébergeur (Vercel, Supabase) est américain, c'est légal ?**
R : Oui, tant qu'ils sont certifiés Privacy Shield ou ont des clauses contractuelles types (c'est le cas). Supabase stocke les données en EU.

**Q : Dois-je avoir un DPO (Délégué à la Protection des Données) ?**
R : Non, sauf si vous êtes une autorité publique ou traitez des données sensibles à grande échelle.

---

## ✅ Checklist finale avant lancement

**Conformité technique** :
- [ ] Pages `/privacy` et `/legal` complétées avec MES informations
- [ ] Footer avec liens présent sur TOUTES les pages
- [ ] Banner cookies activé et fonctionnel
- [ ] Email de contact fonctionnel et surveillé

**Conformité organisationnelle** :
- [ ] Registre des traitements créé et à jour
- [ ] Je sais comment répondre aux demandes RGPD (procédure notée)
- [ ] Mot de passe admin fort et sécurisé
- [ ] Sauvegardes activées (automatique avec Supabase)

**Conformité juridique** :
- [ ] SIRET et forme juridique valides
- [ ] Adresse professionnelle correcte
- [ ] Conditions Générales de Vente (optionnel mais recommandé)

---

## 📚 Ressources utiles

**Sites officiels :**
- CNIL : https://www.cnil.fr/fr/rgpd-passer-a-laction
- Guide RGPD TPE/PME : https://www.cnil.fr/fr/rgpd-guide-du-developpeur
- Outil PIA (analyse d'impact) : https://www.cnil.fr/fr/outil-pia-telechargez-et-installez-le-logiciel-de-la-cnil

**Formations gratuites :**
- MOOC CNIL : https://atelier-rgpd.cnil.fr/
- YouTube CNIL : https://www.youtube.com/user/CNILFrance

**Contact :**
- Questions RGPD : Fiverr messages
- Assistance CNIL : https://www.cnil.fr/fr/plaintes
- Téléphone CNIL : 01 53 73 22 22

---

## 🎯 Pendant notre session de configuration

**Je vous guiderai pour :**

1. ✅ Ouvrir les fichiers `/privacy` et `/legal`
2. ✅ Copier-coller vos informations aux bons endroits
3. ✅ Tester que les liens fonctionnent
4. ✅ Vérifier que le banner cookies s'affiche
5. ✅ Comprendre vos obligations RGPD

**Durée : 10-15 minutes max**

Vous serez 100% conforme et serein ! 🛡️

---

**Questions ? Contactez-moi sur Fiverr ou consultez la CNIL : www.cnil.fr**

*Document créé pour vous aider à être conforme au RGPD.
Non-contractuel, à titre informatif uniquement.*
