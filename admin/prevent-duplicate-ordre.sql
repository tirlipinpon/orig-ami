-- Migration : Prévenir les doublons d'ordre d'affichage
-- Cette contrainte empêche d'avoir deux éléments du même type avec le même ordre

-- Ajouter une contrainte unique sur (type, ordre)
ALTER TABLE beneficiaires 
DROP CONSTRAINT IF EXISTS unique_type_ordre;

ALTER TABLE beneficiaires 
ADD CONSTRAINT unique_type_ordre UNIQUE (type, ordre);

-- Note: Si vous avez des doublons existants, vous devez d'abord les corriger
-- avec la requête suivante (à décommenter si nécessaire):

-- WITH ordered_beneficiaires AS (
--   SELECT 
--     id,
--     type,
--     ROW_NUMBER() OVER (PARTITION BY type ORDER BY ordre, created_at) as new_ordre
--   FROM beneficiaires
-- )
-- UPDATE beneficiaires b
-- SET ordre = ob.new_ordre
-- FROM ordered_beneficiaires ob
-- WHERE b.id = ob.id;

