-- Migration: Renommer 'partenaire' en 'donateur' pour cohérence avec le HTML
-- À exécuter dans : Supabase Dashboard > SQL Editor

-- 1. Mettre à jour toutes les données existantes
UPDATE public.beneficiaires 
SET type = 'donateur' 
WHERE type = 'partenaire';

-- 2. Supprimer l'ancienne contrainte
ALTER TABLE public.beneficiaires 
DROP CONSTRAINT IF EXISTS beneficiaires_type_check;

-- 3. Créer la nouvelle contrainte avec 'donateur' au lieu de 'partenaire'
ALTER TABLE public.beneficiaires 
ADD CONSTRAINT beneficiaires_type_check 
CHECK (type IN ('beneficiaire', 'donateur'));

-- Vérification
SELECT type, COUNT(*) as total 
FROM public.beneficiaires 
GROUP BY type;

