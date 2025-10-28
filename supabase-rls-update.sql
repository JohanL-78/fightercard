-- ============================================
-- MISE À JOUR DES POLITIQUES DE SÉCURITÉ (RLS)
-- ============================================
-- Ce script améliore la sécurité de votre application
-- en empêchant l'accès non autorisé aux commandes
--
-- IMPORTANT : Exécutez ce script dans votre dashboard Supabase
-- ============================================

-- 1. SUPPRIMER les anciennes policies non sécurisées
DROP POLICY IF EXISTS "Orders are viewable by admin only" ON orders;
DROP POLICY IF EXISTS "Only admin can update orders" ON orders;

-- 2. CRÉER une nouvelle policy pour SELECT (lecture)
-- Maintenant, PERSONNE ne peut lire les commandes via l'API publique
-- Seules les requêtes avec le service_role key (backend) peuvent y accéder
CREATE POLICY "Orders are not publicly readable"
  ON orders FOR SELECT
  USING (false);  -- Bloque tout accès public en lecture

-- 3. CRÉER une nouvelle policy pour UPDATE (mise à jour)
-- Seul le backend (service_role) peut mettre à jour les commandes
CREATE POLICY "Orders are not publicly updatable"
  ON orders FOR UPDATE
  USING (false);  -- Bloque toute mise à jour publique

-- 4. La policy INSERT reste inchangée
-- Les utilisateurs peuvent toujours créer des commandes (nécessaire pour le checkout)
-- "Anyone can create orders" existe déjà et est correcte

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Pour vérifier que les policies sont bien appliquées :
-- SELECT * FROM orders;
-- ↑ Cette requête devrait échouer depuis le client
--
-- Les APIs backend utilisant getServiceSupabase() pourront toujours
-- lire et modifier les commandes car elles utilisent la service_role key
-- ============================================

-- NOTES IMPORTANTES :
-- 1. Vos APIs backend doivent utiliser getServiceSupabase() pour contourner RLS
-- 2. Le client (navigateur) ne pourra plus accéder directement aux commandes
-- 3. Toute lecture/téléchargement doit passer par votre API /api/orders/[orderId]/download
-- 4. Cela empêche les utilisateurs de voir les commandes des autres
