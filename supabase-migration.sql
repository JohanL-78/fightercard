-- Migration pour ajouter fighter_photo_url et autres colonnes nécessaires

-- Ajouter la colonne fighter_photo_url pour la photo originale
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS fighter_photo_url TEXT;

-- Ajouter la colonne template_preview_url (optionnel)
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS template_preview_url TEXT;

-- Rendre final_image_url nullable (sera généré par l'admin)
ALTER TABLE orders
ALTER COLUMN final_image_url DROP NOT NULL;

-- Ajouter le statut 'processing'
-- (Si vous avez une contrainte sur les valeurs de status, il faut la modifier)
-- Exemple:
-- ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
-- ALTER TABLE orders ADD CONSTRAINT orders_status_check
--   CHECK (status IN ('pending', 'processing', 'completed', 'delivered'));
