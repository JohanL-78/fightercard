-- Création de la table des templates de cartes
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mma', 'boxing', 'kickboxing', 'other')),
  positions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_email TEXT NOT NULL,
  customization JSONB NOT NULL,
  final_image_url TEXT,
  stripe_payment_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'delivered')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour rechercher les commandes par email
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);

-- Index pour rechercher les commandes par statut
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index pour rechercher les commandes par date
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insertion de quelques templates par défaut
INSERT INTO templates (name, image_url, category, positions) VALUES
  (
    'UFC Style Card',
    '/fitghtbg.jpg',
    'mma',
    '{
      "photo": {"x": 50, "y": 80, "width": 260, "height": 280},
      "username": {"x": 180, "y": 35, "fontSize": 16},
      "rating": {"x": 35, "y": 40, "fontSize": 32},
      "sport": {"x": 35, "y": 82, "fontSize": 14},
      "name": {"x": 180, "y": 340, "fontSize": 28},
      "flag": {"x": 280, "y": 45, "width": 35, "height": 25},
      "stats": {"x": 35, "y": 390, "fontSize": 14}
    }'::jsonb
  );

-- Activer Row Level Security (RLS)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy pour les templates : tout le monde peut lire
CREATE POLICY "Templates are viewable by everyone"
  ON templates FOR SELECT
  USING (true);

-- Policy pour insérer des commandes : tout le monde peut créer une commande (après paiement)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- IMPORTANT: Les policies SELECT et UPDATE sont désactivées par défaut.
-- L'accès aux commandes se fait UNIQUEMENT via les API routes Next.js protégées
-- qui utilisent la clé service_role de Supabase côté serveur.
--
-- Si vous utilisez Supabase Auth pour l'admin, décommentez les policies ci-dessous :
--
-- CREATE POLICY "Only admin can view orders"
--   ON orders FOR SELECT
--   USING (auth.jwt() ->> 'role' = 'admin');
--
-- CREATE POLICY "Only admin can update orders"
--   ON orders FOR UPDATE
--   USING (auth.jwt() ->> 'role' = 'admin')
--   WITH CHECK (auth.jwt() ->> 'role' = 'admin');
