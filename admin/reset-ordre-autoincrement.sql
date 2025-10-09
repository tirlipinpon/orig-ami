-- Migration : Réinitialiser les ordres avec auto-incrémentation
-- Logique : Plus récent = ordre plus élevé = affiché en premier

-- 1. Réinitialiser les ordres des bénéficiaires (par date de création DESC)
WITH ordered_beneficiaires AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_ordre
  FROM beneficiaires
  WHERE type = 'beneficiaire'
)
UPDATE beneficiaires b
SET ordre = ob.new_ordre
FROM ordered_beneficiaires ob
WHERE b.id = ob.id;

-- 2. Réinitialiser les ordres des donateurs (par date de création DESC)
WITH ordered_donateurs AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_ordre
  FROM beneficiaires
  WHERE type = 'donateur'
)
UPDATE beneficiaires b
SET ordre = od.new_ordre
FROM ordered_donateurs od
WHERE b.id = od.id;

-- 3. Vérifier les résultats
SELECT type, nom, ordre, created_at 
FROM beneficiaires 
WHERE type = 'beneficiaire' 
ORDER BY ordre DESC
LIMIT 10;

SELECT type, nom, ordre, created_at 
FROM beneficiaires 
WHERE type = 'donateur' 
ORDER BY ordre DESC
LIMIT 10;

-- Résultat attendu :
-- Plus ancien = ordre 1, 2, 3...
-- Plus récent = ordre le plus élevé
-- Affichage : ORDER BY ordre DESC → Plus récent en premier

