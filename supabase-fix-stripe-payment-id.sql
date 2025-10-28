-- ============================================
-- FIX: Rendre stripe_payment_id NULLABLE
-- ============================================
-- Le champ stripe_payment_id doit être nullable car il est
-- rempli APRÈS la création de la commande (par le webhook)
--
-- IMPORTANT : Exécutez ce script dans votre dashboard Supabase
-- ============================================

-- Rendre le champ nullable
ALTER TABLE orders
ALTER COLUMN stripe_payment_id DROP NOT NULL;

-- Vérification
-- SELECT column_name, is_nullable, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'orders' AND column_name = 'stripe_payment_id';
--
-- Devrait retourner: is_nullable = 'YES'

-- ============================================
-- NOTE
-- ============================================
-- Maintenant, lors de la création d'une commande,
-- stripe_payment_id peut être NULL et sera rempli
-- plus tard par le webhook Stripe après paiement
-- ============================================
