-- ============================================
-- SCRIPT DE VÉRIFICATION DE SÉCURITÉ SUPABASE
-- ============================================
-- Exécutez ce script pour vérifier l'état de vos policies RLS
-- ============================================

-- 1. Vérifier que RLS est activé sur orders
SELECT
  tablename,
  rowsecurity AS "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'orders';

-- Résultat attendu : RLS Enabled = true

-- 2. Lister TOUTES les policies sur orders
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd AS "Operation",
  CASE
    WHEN qual = 'true' THEN '🔴 DANGER: true (accès public)'
    WHEN qual = 'false' THEN '✅ SÉCURISÉ: false (bloqué)'
    ELSE COALESCE(qual, 'NULL')
  END AS "USING clause",
  CASE
    WHEN with_check = 'true' THEN '🔴 DANGER: true (accès public)'
    WHEN with_check = 'false' THEN '✅ SÉCURISÉ: false (bloqué)'
    ELSE COALESCE(with_check, 'NULL')
  END AS "WITH CHECK clause"
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY cmd;

-- Résultat attendu :
-- - INSERT : WITH CHECK = true (nécessaire pour créer des commandes)
-- - SELECT : USING = false (lecture bloquée pour le public)
-- - UPDATE : USING = false ET WITH CHECK = false (modification bloquée)
-- - DELETE : USING = false (suppression bloquée)

-- 3. Test de sécurité : Essayer de lire les commandes
-- Cette requête devrait ÉCHOUER si RLS est bien configuré
-- (quand exécutée avec anon key)
SELECT COUNT(*) FROM orders;

-- 4. Vérifier qu'il n'y a PAS de policies dangereuses
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'orders'
  AND (qual = 'true' OR with_check = 'true')
  AND cmd IN ('SELECT', 'UPDATE', 'DELETE');

-- Résultat attendu : 0 rows (aucune policy dangereuse)
-- Si vous voyez des résultats, APPLIQUEZ IMMÉDIATEMENT le correctif !

-- 5. Résumé de sécurité
SELECT
  'orders' AS table_name,
  COUNT(*) FILTER (WHERE cmd = 'INSERT') AS "INSERT policies",
  COUNT(*) FILTER (WHERE cmd = 'SELECT' AND qual = 'false') AS "✅ SELECT blocked",
  COUNT(*) FILTER (WHERE cmd = 'SELECT' AND qual = 'true') AS "🔴 SELECT public",
  COUNT(*) FILTER (WHERE cmd = 'UPDATE' AND qual = 'false') AS "✅ UPDATE blocked",
  COUNT(*) FILTER (WHERE cmd = 'UPDATE' AND qual = 'true') AS "🔴 UPDATE public",
  COUNT(*) FILTER (WHERE cmd = 'DELETE' AND qual = 'false') AS "✅ DELETE blocked",
  COUNT(*) FILTER (WHERE cmd = 'DELETE' AND qual = 'true') AS "🔴 DELETE public"
FROM pg_policies
WHERE tablename = 'orders';

-- Résultat attendu (SÉCURISÉ) :
-- INSERT policies: 1
-- ✅ SELECT blocked: 1
-- 🔴 SELECT public: 0
-- ✅ UPDATE blocked: 1
-- 🔴 UPDATE public: 0
-- ✅ DELETE blocked: 1
-- 🔴 DELETE public: 0

-- ============================================
-- INTERPRÉTATION
-- ============================================
-- Si vous voyez des 🔴 > 0 → DANGER, appliquez le correctif immédiatement
-- Si tous les ✅ = 1 et 🔴 = 0 → Sécurité OK
-- ============================================
