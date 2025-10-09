-- Script pour corriger l'ordre des bénéficiaires
-- Ce script met à jour l'ordre des bénéficiaires pour qu'il soit cohérent avec leur position d'affichage

-- Mettre à jour l'ordre des bénéficiaires actifs
WITH ordered_beneficiaires AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY ordre ASC, created_at ASC) as new_ordre
  FROM beneficiaires 
  WHERE type = 'beneficiaire' AND actif = true
)
UPDATE beneficiaires 
SET ordre = ordered_beneficiaires.new_ordre
FROM ordered_beneficiaires
WHERE beneficiaires.id = ordered_beneficiaires.id;

-- Mettre à jour l'ordre des donateurs actifs
WITH ordered_donateurs AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY ordre ASC, created_at ASC) as new_ordre
  FROM beneficiaires 
  WHERE type = 'donateur' AND actif = true
)
UPDATE beneficiaires 
SET ordre = ordered_donateurs.new_ordre
FROM ordered_donateurs
WHERE beneficiaires.id = ordered_donateurs.id;

-- Vérifier le résultat
SELECT 'Bénéficiaires' as type, nom, ordre FROM beneficiaires WHERE type = 'beneficiaire' AND actif = true ORDER BY ordre ASC
UNION ALL
SELECT 'Donateurs' as type, nom, ordre FROM beneficiaires WHERE type = 'donateur' AND actif = true ORDER BY ordre ASC;
