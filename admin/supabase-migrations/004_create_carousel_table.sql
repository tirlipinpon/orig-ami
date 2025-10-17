-- Création de la table pour le carousel
CREATE TABLE IF NOT EXISTS public.orig_ami_carousel (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    ordre INTEGER NOT NULL DEFAULT 0,
    actif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_carousel_ordre ON public.orig_ami_carousel(ordre DESC);
CREATE INDEX idx_carousel_actif ON public.orig_ami_carousel(actif);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_carousel_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_carousel_updated_at
    BEFORE UPDATE ON public.orig_ami_carousel
    FOR EACH ROW
    EXECUTE FUNCTION update_carousel_updated_at();

-- Activer Row Level Security (RLS)
ALTER TABLE public.orig_ami_carousel ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique (pour le site web)
CREATE POLICY "Enable read access for all users" ON public.orig_ami_carousel
    FOR SELECT
    USING (true);

-- Politique pour l'insertion (authentification requise)
CREATE POLICY "Enable insert for authenticated users only" ON public.orig_ami_carousel
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Politique pour la mise à jour (authentification requise)
CREATE POLICY "Enable update for authenticated users only" ON public.orig_ami_carousel
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Politique pour la suppression (authentification requise)
CREATE POLICY "Enable delete for authenticated users only" ON public.orig_ami_carousel
    FOR DELETE
    USING (auth.role() = 'authenticated');

