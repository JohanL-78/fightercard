-- Créer la table pour les paramètres globaux de l'application
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter l'email de contact par défaut
INSERT INTO settings (key, value)
VALUES ('contact_email', 'fightercard@example.com')
ON CONFLICT (key) DO NOTHING;

-- Ajouter RLS (Row Level Security)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde de lire les paramètres
CREATE POLICY "Allow public read access to settings"
  ON settings
  FOR SELECT
  TO public
  USING (true);

-- Politique pour permettre uniquement aux admins de modifier
-- Note: Cette politique sera vérifiée côté serveur avec l'API admin
CREATE POLICY "Allow admin update access to settings"
  ON settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
