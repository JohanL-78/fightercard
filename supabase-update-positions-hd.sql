-- ============================================
-- MISE À JOUR DES POSITIONS POUR CANVAS HD
-- ============================================
-- Ce script met à jour les positions des templates
-- pour le nouveau canvas 720×1040px (au lieu de 360×520px)
--
-- IMPORTANT : Exécutez ce script dans votre dashboard Supabase
-- uniquement si vous avez déjà des templates dans la base
-- ============================================

-- Mettre à jour le template par défaut existant
UPDATE templates
SET positions = '{
  "photo": {"x": 100, "y": 160, "width": 520, "height": 560},
  "username": {"x": 360, "y": 70, "fontSize": 32},
  "rating": {"x": 70, "y": 80, "fontSize": 64},
  "sport": {"x": 70, "y": 164, "fontSize": 28},
  "name": {"x": 360, "y": 680, "fontSize": 56},
  "flag": {"x": 560, "y": 90, "width": 70, "height": 50},
  "stats": {"x": 70, "y": 780, "fontSize": 28}
}'::jsonb
WHERE name = 'UFC Style Card';

-- ============================================
-- NOTES
-- ============================================
-- Toutes les valeurs ont été doublées car le canvas
-- est passé de 360×520px à 720×1040px
--
-- Si vous avez d'autres templates personnalisés,
-- vous devrez multiplier toutes leurs positions par 2
--
-- Exemple pour un autre template :
-- UPDATE templates
-- SET positions = '{
--   "photo": {"x": [ancien_x × 2], "y": [ancien_y × 2], ...}
-- }'::jsonb
-- WHERE name = 'Votre Template';
-- ============================================
