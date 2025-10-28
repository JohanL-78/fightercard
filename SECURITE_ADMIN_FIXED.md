# Correction des failles de sécurité admin - TERMINÉ

## Problèmes critiques identifiés et corrigés

### Vulnérabilités initiales

#### 1. Authentification côté client (CRITIQUE)
- **Identifiants exposés côté client** via `NEXT_PUBLIC_ADMIN_USERNAME` et `NEXT_PUBLIC_ADMIN_PASSWORD`
- **Authentification localStorage** facilement contournable
- **Aucune protection serveur** des routes et des données

#### 2. Policies RLS dangereuses (CRITIQUE)
- `USING (true)` sur les policies SELECT et UPDATE permettait à **n'importe qui** de lire et modifier toutes les commandes
- Même avec l'authentification JWT, les données étaient accessibles directement via Supabase client

### Solution mise en place

## 1. Architecture sécurisée

```
Client → Middleware → API Routes (serveur) → Supabase
         ↓
    Vérification JWT
```

## 2. Fichiers créés/modifiés

### Nouveaux fichiers

**Authentification:**
- [middleware.ts](middleware.ts) - Protection des routes /admin
- [app/api/admin/login/route.ts](app/api/admin/login/route.ts) - Authentification serveur
- [app/api/admin/logout/route.ts](app/api/admin/logout/route.ts) - Déconnexion
- [app/api/admin/verify/route.ts](app/api/admin/verify/route.ts) - Vérification du token
- [app/admin/login/page.tsx](app/admin/login/page.tsx) - Page de connexion séparée

**Accès sécurisé aux données:**
- [lib/supabase-admin.ts](lib/supabase-admin.ts) - Client Supabase avec service_role (serveur uniquement)
- [app/api/admin/orders/route.ts](app/api/admin/orders/route.ts) - API routes pour gérer les commandes

**Base de données:**
- [supabase-admin-rls.sql](supabase-admin-rls.sql) - Documentation RLS Supabase
- [supabase-fix-rls-policies.sql](supabase-fix-rls-policies.sql) - Script de migration pour corriger les policies dangereuses

### Fichiers modifiés
- [app/admin/page.tsx](app/admin/page.tsx) - Utilise l'auth serveur + API routes au lieu d'accès direct Supabase
- [supabase-schema.sql](supabase-schema.sql) - Policies RLS corrigées (plus de `USING (true)`)
- [package.json](package.json) - Ajout de `jose` pour JWT
- [.env.example](.env.example) - Nouvelles variables sécurisées

## 3. Étapes d'installation

### A. Installer les dépendances

```bash
npm install jose
# ou si vous utilisez pnpm/yarn
```

### B. Configurer les variables d'environnement

Créez/mettez à jour `.env.local` :

```bash
# Supprimer ces lignes si elles existent
# NEXT_PUBLIC_ADMIN_USERNAME=...
# NEXT_PUBLIC_ADMIN_PASSWORD=...

# Ajouter ces nouvelles variables (SANS NEXT_PUBLIC_)
ADMIN_USERNAME=votre_username_fort
ADMIN_PASSWORD=votre_mot_de_passe_ultra_securise

# Générer un secret JWT fort
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
```

### C. Corriger les policies RLS Supabase (CRITIQUE - OBLIGATOIRE)

1. Connectez-vous à votre dashboard Supabase
2. Allez dans "SQL Editor"
3. **Exécutez IMMÉDIATEMENT** le contenu de [supabase-fix-rls-policies.sql](supabase-fix-rls-policies.sql)

```sql
-- Ce script supprime les policies dangereuses USING (true)
DROP POLICY IF EXISTS "Orders are viewable by admin only" ON orders;
DROP POLICY IF EXISTS "Only admin can update orders" ON orders;
```

**IMPORTANT** : Sans cette étape, n'importe qui peut toujours lire/modifier vos commandes directement via Supabase !

**Note** : L'accès se fait maintenant UNIQUEMENT via les API routes Next.js qui utilisent la clé `service_role`.

### D. Nettoyer les anciennes variables

Vérifiez que ces variables n'existent **NULLE PART** :
- `NEXT_PUBLIC_ADMIN_USERNAME`
- `NEXT_PUBLIC_ADMIN_PASSWORD`

Cherchez dans tous vos fichiers :
```bash
grep -r "NEXT_PUBLIC_ADMIN" .
```

## 4. Comment ça fonctionne maintenant

### Flux d'authentification

1. **Connexion** : L'utilisateur va sur `/admin/login`
2. **Vérification serveur** : Les identifiants sont vérifiés UNIQUEMENT côté serveur
3. **Token JWT** : Un token sécurisé est créé et stocké dans un cookie httpOnly
4. **Protection middleware** : Toute tentative d'accès à `/admin` vérifie le cookie
5. **Vérification continue** : Le composant vérifie l'auth via `/api/admin/verify`

### Flux d'accès aux données

```
Client              API Routes (serveur)        Supabase
  |                       |                         |
  |-- GET /api/admin/orders -->                    |
  |                       |-- Vérifie JWT           |
  |                       |-- supabaseAdmin         |
  |                       |-- (service_role) ------>|
  |                       |                         |
  |                       |<----- Données ----------|
  |<---- Données ---------|                         |
```

**Clé** : Le client ne communique JAMAIS directement avec Supabase pour les opérations admin.

### Sécurité renforcée

**Authentification:**
- **Cookies httpOnly** : JavaScript ne peut pas accéder au token
- **SameSite strict** : Protection CSRF
- **HTTPS only** (en production) : Pas d'interception
- **Expiration** : Token expire après 24h
- **Variables serveur** : Identifiants jamais exposés au client

**Accès aux données:**
- **RLS activé** : Row Level Security empêche l'accès direct
- **Pas de policies publiques** : Les policies `USING (true)` ont été supprimées
- **Client service_role** : Utilisé UNIQUEMENT côté serveur dans les API routes
- **Vérification JWT** : Chaque API route vérifie l'authentification

## 5. Tests de sécurité

### Test 1 : Vérifier que les secrets ne sont pas exposés

```bash
# Construire l'application
npm run build

# Chercher les secrets dans le build (ne devrait rien trouver)
grep -r "ADMIN_USERNAME\|ADMIN_PASSWORD" .next/
```

### Test 2 : Tenter l'accès direct

1. Ouvrez votre navigateur en mode privé
2. Allez sur `http://localhost:3000/admin`
3. Vous devriez être redirigé vers `/admin/login`

### Test 3 : Inspecter le JavaScript client

1. Ouvrez DevTools → Sources
2. Cherchez dans les bundles : les variables `ADMIN_USERNAME` et `ADMIN_PASSWORD` ne doivent PAS apparaître

## 6. Bonnes pratiques de production

### A. Mots de passe forts

```bash
# Générer un mot de passe fort
openssl rand -base64 24
```

### B. Variables d'environnement

Sur Vercel/Netlify :
1. Ajoutez les variables dans le dashboard (Environment Variables)
2. Ne committez JAMAIS le `.env.local` dans git

### C. Monitoring

Activez les logs d'authentification pour détecter les tentatives suspectes :

```typescript
// Dans app/api/admin/login/route.ts
console.log(`Login attempt from ${request.headers.get('x-forwarded-for')}`)
```

## 7. Prochaines améliorations possibles

- **Rate limiting** : Limiter les tentatives de connexion (10/minute)
- **2FA** : Authentification à deux facteurs
- **Sessions multiples** : Gérer plusieurs admins
- **Audit logs** : Tracer toutes les actions admin
- **IP whitelist** : Restreindre par IP (pour extra sécurité)

## 8. Checklist finale

### Installation locale
- [ ] `npm install jose` exécuté
- [ ] Variables `.env.local` configurées (ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_JWT_SECRET)
- [ ] Variables `NEXT_PUBLIC_ADMIN_*` supprimées partout
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` ajoutée dans `.env.local`

### Base de données Supabase (CRITIQUE)
- [ ] **Script [supabase-fix-rls-policies.sql](supabase-fix-rls-policies.sql) exécuté** (supprime les policies dangereuses)
- [ ] Vérifié qu'il ne reste QUE la policy "Anyone can create orders" pour INSERT
- [ ] RLS activé sur la table `orders` (normalement déjà fait)

### Tests de sécurité
- [ ] Application testée en local (`npm run dev`)
- [ ] Tenté d'accéder directement à Supabase depuis la console du navigateur → doit échouer
- [ ] Build produit testé (`npm run build && npm start`)
- [ ] Secrets vérifiés non-exposés dans `.next/`
- [ ] Test d'accès non authentifié à `/admin` → redirige vers login

### Déploiement production
- [ ] Variables d'environnement ajoutées sur la plateforme (Vercel/Netlify)
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` configurée en production
- [ ] Mot de passe fort généré pour `ADMIN_PASSWORD`
- [ ] Secret JWT généré avec `openssl rand -base64 32`

## Contact

Si vous avez des questions sur la sécurité, consultez :
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser)
