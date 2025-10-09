-- Script pour extraire seulement le nom de fichier des URLs d'images
-- Convertir "img/beneficiaire/fichier.webp" en "fichier.webp"

-- Extraire le nom de fichier pour les bénéficiaires
UPDATE public.beneficiaires 
SET image_url = SUBSTRING(image_url FROM '[^/]+$')
WHERE image_url LIKE 'img/beneficiaire/%';

-- Extraire le nom de fichier pour les donateurs
UPDATE public.beneficiaires 
SET image_url = SUBSTRING(image_url FROM '[^/]+$')
WHERE image_url LIKE 'img/sponsors/%';

-- Extraire le nom de fichier pour les URLs complètes avec localhost
UPDATE public.beneficiaires 
SET image_url = SUBSTRING(image_url FROM '[^/]+$')
WHERE image_url LIKE '%localhost%img/%';

-- Extraire le nom de fichier pour les URLs complètes avec orig-ami.eu
UPDATE public.beneficiaires 
SET image_url = SUBSTRING(image_url FROM '[^/]+$')
WHERE image_url LIKE '%orig-ami.eu/img/%';

-- Vérifier le résultat
SELECT id, nom, type, image_url FROM public.beneficiaires ORDER BY type, ordre;
