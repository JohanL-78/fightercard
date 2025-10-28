-- Ajouter les colonnes pour l'adresse de livraison et la TVA
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_name TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT,
ADD COLUMN IF NOT EXISTS tax_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_amount INTEGER;

-- Créer un index pour rechercher par pays
CREATE INDEX IF NOT EXISTS idx_orders_country ON orders(shipping_country);

-- Mettre à jour les commandes existantes pour avoir un total_amount
UPDATE orders
SET total_amount = amount + COALESCE(tax_amount, 0)
WHERE total_amount IS NULL;
