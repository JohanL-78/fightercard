-- Script de migration pour corriger les policies RLS dangereuses
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Supprimer les policies dangereuses existantes
DROP POLICY IF EXISTS "Orders are viewable by admin only" ON orders;
DROP POLICY IF EXISTS "Only admin can update orders" ON orders;

-- 2. La policy INSERT reste (tout le monde peut créer une commande après paiement)
-- Elle existe déjà, pas besoin de la recréer

-- 3. Ne PAS créer de policies SELECT/UPDATE publiques
-- L'accès se fera via la clé service_role côté serveur uniquement

-- Vérifier que RLS est bien activé
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Vérifier les policies restantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'orders';

-- Résultat attendu : seulement la policy "Anyone can create orders" pour INSERT
