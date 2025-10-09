-- Migration: Création de la table beneficiaires
-- À exécuter dans : Supabase Dashboard > SQL Editor

-- Créer la table beneficiaires
CREATE TABLE IF NOT EXISTS public.beneficiaires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  image_width INTEGER DEFAULT 200,
  type VARCHAR(50) DEFAULT 'beneficiaire' CHECK (type IN ('beneficiaire', 'donateur')),
  ordre INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_beneficiaires_type ON public.beneficiaires(type);
CREATE INDEX IF NOT EXISTS idx_beneficiaires_ordre ON public.beneficiaires(ordre);
CREATE INDEX IF NOT EXISTS idx_beneficiaires_actif ON public.beneficiaires(actif);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_beneficiaires_updated_at BEFORE UPDATE ON public.beneficiaires
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security
ALTER TABLE public.beneficiaires ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire
CREATE POLICY "Les bénéficiaires sont visibles par tous"
  ON public.beneficiaires FOR SELECT
  USING (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent modifier
CREATE POLICY "Les utilisateurs authentifiés peuvent tout faire"
  ON public.beneficiaires FOR ALL
  USING (auth.role() = 'authenticated');

