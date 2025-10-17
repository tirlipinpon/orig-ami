-- Migration pour créer la table des blocs de contenu multilingue
CREATE TABLE IF NOT EXISTS orig_ami_content_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    block_key VARCHAR(100) NOT NULL, -- Identifiant unique du bloc (ex: 'what_is_it', 'solidarity_gesture')
    language VARCHAR(5) NOT NULL, -- 'fr', 'en', 'nl'
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Contenu HTML généré par l'éditeur
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte unique sur la combinaison block_key + language
    UNIQUE(block_key, language)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_content_blocks_key_lang ON orig_ami_content_blocks(block_key, language);

-- RLS (Row Level Security)
ALTER TABLE orig_ami_content_blocks ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read access" ON orig_ami_content_blocks
    FOR SELECT USING (true);

-- Politique pour permettre l'écriture aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to manage content" ON orig_ami_content_blocks
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_content_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_blocks_updated_at
    BEFORE UPDATE ON orig_ami_content_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_content_blocks_updated_at();

-- Insérer les blocs par défaut pour les 3 langues
INSERT INTO orig_ami_content_blocks (block_key, language, title, content) VALUES
-- Bloc "De quoi s'agit-il ?" / "What is it about ?" / "Waarover gaat het ?"
('what_is_it', 'fr', 'De quoi s''agit-il ?', '<p>L''<strong>ORIG-AMI</strong> est un abri en carton. Il est isolant, protecteur par sa structure, pliable en accordéon, transportable comme un sac à dos et recyclable. L''abri pour sans-abri a été conçu sur le principe de l''origami, technique japonaise de pliage du papier.</p>'),
('what_is_it', 'en', 'What is it about ?', '<p>The <strong>ORIG-AMI</strong> is a cardboard shelter. It is insulating, protective due to its structure, folding like an accordion, transportable as a backpack and recyclable. The shelter for the homeless was conceived on the principal of origami, a Japanese technique of folding paper.</p>'),
('what_is_it', 'nl', 'Waarover gaat het ?', '<p>De <strong>ORIG-AMI</strong> is een kartonnen schuilplaats. Hij is isolerend, beschermend door zijn structuur, vouwbaar als een accordeon, mee te nemen als een rugzak en recyclebaar. Deze schuilplaats voor daklozen is ontworpen volgens het principe van de origami, de Japanse vouwtechniek van papier.</p>'),

-- Bloc "Un geste de solidarité" / "A gesture of solidarity" / "Een gebaar van solidariteit"
('solidarity_gesture', 'fr', 'Un geste de solidarité', '<p>Un geste de solidarité pour aider les sans-abri...</p>'),
('solidarity_gesture', 'en', 'A gesture of solidarity', '<p>A gesture of solidarity to help the homeless...</p>'),
('solidarity_gesture', 'nl', 'Een gebaar van solidariteit', '<p>Een gebaar van solidariteit om daklozen te helpen...</p>'),

-- Bloc "Pourquoi des ORIG-AMI ?" / "Why ORIG-AMI ?" / "Waarom ORIG-AMI ?"
('why_origami', 'fr', 'Pourquoi des ORIG-AMI ?', '<p>Les raisons pour lesquelles nous avons créé l''ORIG-AMI...</p>'),
('why_origami', 'en', 'Why ORIG-AMI ?', '<p>The reasons why we created ORIG-AMI...</p>'),
('why_origami', 'nl', 'Waarom ORIG-AMI ?', '<p>De redenen waarom we ORIG-AMI hebben gemaakt...</p>'),

-- Bloc "Partenaires" / "Partners" / "Partners"
('partners', 'fr', 'Partenaires', '<p>Nos partenaires qui nous soutiennent...</p>'),
('partners', 'en', 'Partners', '<p>Our partners who support us...</p>'),
('partners', 'nl', 'Partners', '<p>Onze partners die ons steunen...</p>'),

-- Bloc "ORIG-AMI une action d'urgence" / "ORIG-AMI an emergency action" / "ORIG-AMI een noodactie"
('emergency_action', 'fr', 'ORIG-AMI une action d''urgence en faveur des sans-abris', '<p>Une action d''urgence pour venir en aide aux sans-abri...</p>'),
('emergency_action', 'en', 'ORIG-AMI an emergency action for the homeless', '<p>An emergency action to help the homeless...</p>'),
('emergency_action', 'nl', 'ORIG-AMI een noodactie voor daklozen', '<p>Een noodactie om daklozen te helpen...</p>')

ON CONFLICT (block_key, language) DO NOTHING;
