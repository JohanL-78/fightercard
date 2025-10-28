-- ============================================
-- 🚨 CORRECTIF DE SÉCURITÉ - À APPLIQUER IMMÉDIATEMENT
-- ============================================
-- Ce script verrouille l'accès public à la table orders
-- et force l'utilisation de la clé service_role côté serveur
--
-- IMPORTANT : Exécutez ce script dans votre dashboard Supabase
-- en tant qu'admin (il utilisera automatiquement les privilèges admin)
-- ============================================

BEGIN;

-- 1. NETTOYER toutes les anciennes policies (potentiellement dangereuses)
DROP POLICY IF EXISTS "Orders are viewable by admin only" ON orders;
DROP POLICY IF EXISTS "Only admin can update orders" ON orders;
DROP POLICY IF EXISTS "Orders are viewable by everyone" ON orders;
DROP POLICY IF EXISTS "Orders are not publicly readable" ON orders;
DROP POLICY IF EXISTS "Orders are not publicly updatable" ON orders;
DROP POLICY IF EXISTS "Block public read access to orders" ON orders;
DROP POLICY IF EXISTS "Block public update access to orders" ON orders;
DROP POLICY IF EXISTS "Block public delete access to orders" ON orders;

-- 2. VÉRIFIER que RLS est activé
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3. CRÉER les policies de sécurité strictes

-- INSERT : Autorisé pour tout le monde (nécessaire pour créer des commandes après paiement Stripe)
-- Cette policy existe peut-être déjà, on la recrée pour être sûr
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);  -- OK: les utilisateurs doivent pouvoir créer des commandes

-- SELECT : BLOQUÉ pour le public
CREATE POLICY "Block public read access to orders"
  ON orders FOR SELECT
  USING (false);  -- Personne ne peut lire via anon_key

-- UPDATE : BLOQUÉ pour le public
CREATE POLICY "Block public update access to orders"
  ON orders FOR UPDATE
  USING (false)      -- Personne ne peut sélectionner pour modifier
  WITH CHECK (false); -- Personne ne peut appliquer les modifications

-- DELETE : BLOQUÉ pour le public
CREATE POLICY "Block public delete access to orders"
  ON orders FOR DELETE
  USING (false);  -- Personne ne peut supprimer

COMMIT;

-- 4. VÉRIFICATION IMMÉDIATE
SELECT
  '✅ Script appliqué avec succès!' AS status,
  NOW() AS applied_at;

SELECT
  '📊 État des policies après application:' AS info;

SELECT
  policyname,
  cmd AS operation,
  CASE
    WHEN qual = 'true' THEN '🔴 PUBLIC (DANGEREUX)'
    WHEN qual = 'false' THEN '✅ BLOQUÉ (SÉCURISÉ)'
    ELSE '⚠️ ' || COALESCE(qual, 'NULL')
  END AS using_clause,
  CASE
    WHEN with_check = 'true' THEN '✅ AUTORISÉ'
    WHEN with_check = 'false' THEN '🔒 BLOQUÉ'
    ELSE COALESCE(with_check, 'N/A')
  END AS with_check_clause
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY cmd;

-- RÉSULTAT ATTENDU :
-- ┌────────────────────────────────────┬───────────┬─────────────────────┬────────────────────┐
-- │ policyname                         │ operation │ using_clause        │ with_check_clause  │
-- ├────────────────────────────────────┼───────────┼─────────────────────┼────────────────────┤
-- │ Block public delete access...      │ DELETE    │ ✅ BLOQUÉ           │ N/A                │
-- │ Anyone can create orders           │ INSERT    │ N/A                 │ ✅ AUTORISÉ        │
-- │ Block public read access...        │ SELECT    │ ✅ BLOQUÉ           │ N/A                │
-- │ Block public update access...      │ UPDATE    │ ✅ BLOQUÉ           │ 🔒 BLOQUÉ          │
-- └────────────────────────────────────┴───────────┴─────────────────────┴────────────────────┘

-- Si vous voyez des 🔴 → Le script a échoué, contactez le support
-- Si vous voyez uniquement des ✅ et 🔒 → ✅ Sécurité OK !

-- 5. TEST DE SÉCURITÉ (optionnel)
-- Cette requête devrait échouer si vous l'exécutez avec anon_key :
-- SELECT * FROM orders LIMIT 1;
-- (Dans le SQL Editor du dashboard, ça fonctionnera car vous êtes admin)

-- ============================================
-- APRÈS L'APPLICATION
-- ============================================
-- 1. Vérifiez que votre application admin fonctionne toujours
-- 2. Testez depuis la console navigateur que l'accès est bloqué
-- 3. Vérifiez que les commandes peuvent toujours être créées (checkout)
-- ============================================
