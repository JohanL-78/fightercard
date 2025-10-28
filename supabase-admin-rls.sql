-- Activer RLS sur la table orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut insérer (création de commande)
CREATE POLICY "Allow insert for all" ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique : Seuls les admins peuvent voir toutes les commandes
-- Option 1 : Utiliser une clé API Supabase spéciale pour l'admin
CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT
  TO authenticated
  USING (
    -- Vérifier que l'utilisateur a le rôle admin
    -- (Nécessite que vous créiez des utilisateurs dans Supabase Auth)
    auth.jwt() ->> 'role' = 'admin'
  );

-- Option 2 (plus simple) : Utiliser une clé secrète service_role de Supabase
-- Dans ce cas, utilisez le client Supabase côté serveur avec la clé service_role

-- Politique : Seuls les admins peuvent mettre à jour les commandes
CREATE POLICY "Admin can update orders" ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Alternative : Si vous n'utilisez pas Supabase Auth,
-- désactivez RLS et protégez via API routes Next.js uniquement
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
