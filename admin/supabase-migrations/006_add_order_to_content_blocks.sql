-- Migration pour ajouter un champ ordre aux blocs de contenu
ALTER TABLE orig_ami_content_blocks 
ADD COLUMN ordre INTEGER DEFAULT 0;

-- Mettre à jour l'ordre des blocs existants selon l'ordre des pages PHP
UPDATE orig_ami_content_blocks 
SET ordre = CASE 
  WHEN block_key = 'what_is_it' THEN 1
  WHEN block_key = 'solidarity_gesture' THEN 2
  WHEN block_key = 'why_origami' THEN 3
  WHEN block_key = 'partners' THEN 4
  WHEN block_key = 'emergency_action' THEN 5
  ELSE 0
END;

-- Créer un index pour améliorer les performances sur l'ordre
CREATE INDEX IF NOT EXISTS idx_content_blocks_order ON orig_ami_content_blocks(ordre);

-- Ajouter une contrainte pour s'assurer que l'ordre est unique par langue
-- (optionnel, mais recommandé pour éviter les doublons)
-- ALTER TABLE orig_ami_content_blocks 
-- ADD CONSTRAINT unique_order_per_language UNIQUE (ordre, language);
