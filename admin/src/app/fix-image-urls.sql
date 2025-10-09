-- Script pour vérifier les URLs d'images existantes
-- Les données contiennent des chemins relatifs comme "img/beneficiaire/fichier.webp"

-- Vérifier la structure actuelle
SELECT id, nom, type, image_url FROM public.beneficiaires ORDER BY type, ordre;

-- Si vous voulez convertir les chemins relatifs en URLs complètes (optionnel)
-- UPDATE public.beneficiaires 
-- SET image_url = 'https://www.orig-ami.eu/' || image_url
-- WHERE image_url LIKE 'img/%' AND image_url NOT LIKE 'https://%';
