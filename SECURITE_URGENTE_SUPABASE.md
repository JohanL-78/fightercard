# 🚨 ACTION IMMÉDIATE REQUISE - SÉCURITÉ SUPABASE

## Problème CRITIQUE

**Les policies RLS dangereuses avec `USING (true)` permettent à n'importe qui de lire et modifier TOUTES vos commandes en production !**

## Action à faire MAINTENANT (5 minutes max)

### Étape 1 : Vérifier l'état actuel (30 secondes)

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Exécutez cette requête :

```sql
-- Vérifier les policies actuelles sur la table orders
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'orders';
```

**🔴 Si vous voyez des policies avec `qual = 'true'` ou `with_check = 'true'` → DANGER IMMÉDIAT**

### Étape 2 : Appliquer le correctif (1 minute)

Dans le même SQL Editor, **exécutez immédiatement** ce script :

```sql
-- ============================================
-- VERROUILLAGE DE SÉCURITÉ - EXÉCUTION IMMÉDIATE
-- ============================================

-- 1. Supprimer TOUTES les policies dangereuses
DROP POLICY IF EXISTS "Orders are viewable by admin only" ON orders;
DROP POLICY IF EXISTS "Only admin can update orders" ON orders;
DROP POLICY IF EXISTS "Orders are viewable by everyone" ON orders;
DROP POLICY IF EXISTS "Orders are not publicly readable" ON orders;
DROP POLICY IF EXISTS "Orders are not publicly updatable" ON orders;

-- 2. Créer des policies qui BLOQUENT tout accès public
CREATE POLICY "Block public read access to orders"
  ON orders FOR SELECT
  USING (false);  -- Personne ne peut lire via le client

CREATE POLICY "Block public update access to orders"
  ON orders FOR UPDATE
  USING (false);  -- Personne ne peut modifier via le client

CREATE POLICY "Block public delete access to orders"
  ON orders FOR DELETE
  USING (false);  -- Personne ne peut supprimer via le client

-- 3. La policy INSERT reste (nécessaire pour créer des commandes après paiement)
-- Elle existe déjà normalement

-- 4. Vérifier RLS est activé
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 5. Vérification finale
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY cmd;
```

### Étape 3 : Vérifier le correctif (30 secondes)

Le résultat devrait ressembler à :

```
policyname                              | cmd    | qual  | with_check
----------------------------------------|--------|-------|------------
Anyone can create orders                | INSERT | NULL  | true
Block public read access to orders      | SELECT | false | NULL
Block public update access to orders    | UPDATE | false | false
Block public delete access to orders    | DELETE | false | NULL
```

**✅ Si vous voyez uniquement `false` pour SELECT/UPDATE/DELETE → Sécurisé !**

## Pourquoi c'est urgent ?

### Avant le correctif (DANGEREUX)
```javascript
// N'IMPORTE QUI peut faire ça depuis la console du navigateur :
const { data } = await supabase.from('orders').select('*')
// → Récupère TOUTES les commandes avec emails, adresses, etc.

await supabase.from('orders').update({ status: 'delivered' }).eq('id', '...')
// → Peut modifier n'importe quelle commande
```

### Après le correctif (SÉCURISÉ)
```javascript
// Depuis le navigateur :
const { data, error } = await supabase.from('orders').select('*')
// → error: "row-level security policy violation"

// Depuis les API routes Next.js (avec service_role) :
const { data } = await supabaseAdmin.from('orders').select('*')
// → ✅ Fonctionne uniquement côté serveur
```

## Que faire après le correctif ?

### 1. Tester immédiatement

Ouvrez la console de votre navigateur sur votre site :

```javascript
// Ceci DOIT échouer maintenant :
const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient('YOUR_URL', 'YOUR_ANON_KEY')
const { data, error } = await supabase.from('orders').select('*')
console.log(error) // Doit afficher une erreur RLS
```

### 2. Vérifier que l'admin fonctionne

1. Allez sur `votre-site.com/admin/login`
2. Connectez-vous
3. Vérifiez que vous voyez bien les commandes
4. Essayez de changer un statut

**Si ça marche → Tout est bon !**
**Si ça ne marche pas → Vérifiez que vous avez bien appliqué les corrections d'authentification admin**

## Fichiers de référence

- [supabase-rls-update.sql](supabase-rls-update.sql) - Version originale (équivalente)
- [supabase-fix-rls-policies.sql](supabase-fix-rls-policies.sql) - Version alternative
- [SECURITE_ADMIN_FIXED.md](SECURITE_ADMIN_FIXED.md) - Guide complet de sécurité

## Checklist post-correctif

- [ ] Script exécuté dans Supabase SQL Editor
- [ ] Vérification de la requête de contrôle : uniquement `false` pour SELECT/UPDATE/DELETE
- [ ] Test depuis la console navigateur : accès bloqué ✅
- [ ] Test du panneau admin : fonctionne ✅
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` configurée dans `.env.local` et en production
- [ ] Redémarrage de l'application (`npm run dev` ou redéploiement)

## En cas de problème

### L'admin ne fonctionne plus
→ Vérifiez que vous utilisez `supabaseAdmin` (avec service_role) dans les API routes, pas `supabase` (client)
→ Voir [app/api/admin/orders/route.ts](app/api/admin/orders/route.ts)

### Les commandes ne se créent plus
→ Vérifiez qu'il existe bien une policy `INSERT` avec `WITH CHECK (true)`
→ Cette policy doit être présente

### Besoin d'aide
→ Les policies `USING (false)` bloquent TOUT accès depuis le client
→ Seul le `service_role` côté serveur peut bypasser RLS
→ C'est exactement ce qu'on veut !

---

**⏰ Temps estimé pour sécuriser : 5 minutes**
**💰 Impact si non fait : Exposition de toutes les données clients**
