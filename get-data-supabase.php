<?php
/**
 * Récupère les bénéficiaires et donateurs depuis Supabase
 * Retourne un JSON pour être utilisé dans index.php
 */

// URL de votre API Supabase
$supabaseUrl = 'https://qrtghqiafchnzbmwvlgi.supabase.co';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydGdocWlhZmNobnpibXd2bGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTE1MDcsImV4cCI6MjA3OTQ4NzUwN30.qVaFHgJ22ghZdV-xLDQWmjGLsfe0T981YhvR81ur0no';
$bucketName = 'orig-ami-image';

/**
 * Construit l'URL Supabase Storage pour une image
 */
function buildImageUrl($fileName, $folder) {
    global $supabaseUrl, $bucketName;
    return "{$supabaseUrl}/storage/v1/object/public/{$bucketName}/{$folder}/{$fileName}";
}

/**
 * Récupère les items depuis Supabase
 */
function getItems($type) {
    global $supabaseUrl, $supabaseKey;
    
    $url = "{$supabaseUrl}/rest/v1/orig_ami_beneficiaires?type=eq.{$type}&actif=eq.true&order=ordre.desc";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: {$supabaseKey}",
        "Authorization: Bearer {$supabaseKey}"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return [];
    }
    
    $data = json_decode($response, true);
    
    // Construire les URLs complètes des images
    foreach ($data as &$item) {
        if (!empty($item['image_url'])) {
            $folder = $type === 'beneficiaire' ? 'beneficiaire' : 'sponsors';
            $item['image_url_full'] = buildImageUrl($item['image_url'], $folder);
        } else {
            $item['image_url_full'] = '';
        }
    }
    
    return $data;
}

/**
 * Récupère les médias depuis Supabase
 */
function getMedias($categorie) {
    global $supabaseUrl, $supabaseKey;
    
    $url = "{$supabaseUrl}/rest/v1/orig_ami_medias?categorie=eq.{$categorie}&actif=eq.true&order=ordre.desc";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: {$supabaseKey}",
        "Authorization: Bearer {$supabaseKey}"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return [];
    }
    
    return json_decode($response, true);
}

/**
 * Récupère tous les médias belges ET néerlandais (pour la version EN)
 */
function getAllBelgianAndDutchMedias() {
    global $supabaseUrl, $supabaseKey;
    
    // Utiliser filter "or" pour récupérer belgique ET neerlandais
    $url = "{$supabaseUrl}/rest/v1/orig_ami_medias?or=(categorie.eq.belgique,categorie.eq.neerlandais)&actif=eq.true&order=ordre.desc";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: {$supabaseKey}",
        "Authorization: Bearer {$supabaseKey}"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return [];
    }
    
    return json_decode($response, true);
}

// Récupérer les bénéficiaires et donateurs
$beneficiaires = getItems('beneficiaire');
$donateurs = getItems('donateur');

// Récupérer les médias
$mediasBelgique = getMedias('belgique');
$mediasNeerlandais = getMedias('neerlandais');
$mediasInternational = getMedias('international');

// Récupérer tous les médias belges + néerlandais ensemble (pour version EN)
$mediasBelgiqueEtNeerlandais = getAllBelgianAndDutchMedias();

/**
 * Récupère les slides du carousel
 */
function getCarousel() {
    global $supabaseUrl, $supabaseKey;
    
    $url = "{$supabaseUrl}/rest/v1/orig_ami_carousel?actif=eq.true&order=ordre.desc";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: {$supabaseKey}",
        "Authorization: Bearer {$supabaseKey}"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return [];
    }
    
    $data = json_decode($response, true);
    
    // Construire les URLs complètes des images
    foreach ($data as &$slide) {
        if (!empty($slide['image_url'])) {
            $slide['image_url_full'] = buildImageUrl($slide['image_url'], 'caroussel');
        } else {
            $slide['image_url_full'] = '';
        }
    }
    
    return $data;
}

// Récupérer les slides du carousel
$carouselSlides = getCarousel();

/**
 * Nettoie le HTML généré par Quill.js pour l'affichage sur les pages PHP
 */
function cleanQuillHtml($html) {
    if (empty($html)) {
        return $html;
    }
    
    // Supprimer les spans avec classe ql-ui (éléments de contrôle Quill)
    $html = preg_replace('/<span class="ql-ui"[^>]*><\/span>/', '', $html);
    
    // Nettoyer les attributs data-list et autres attributs Quill
    $html = preg_replace('/\s*data-list="[^"]*"/', '', $html);
    $html = preg_replace('/\s*data-index="[^"]*"/', '', $html);
    $html = preg_replace('/\s*data-embed="[^"]*"/', '', $html);
    
    // Nettoyer les éléments vides ou inutiles
    $html = preg_replace('/<p><br><\/p>/', '', $html);
    $html = preg_replace('/<p>\s*<\/p>/', '', $html);
    
    // S'assurer que les listes sont correctement formatées
    $html = preg_replace('/<li[^>]*>/', '<li>', $html);
    
    // Nettoyer les espaces en trop
    $html = preg_replace('/\s+/', ' ', $html);
    $html = trim($html);
    
    return $html;
}

/**
 * Récupère les blocs de contenu pour une langue donnée
 */
function getContentBlocks($language = 'fr') {
    global $supabaseUrl, $supabaseKey;
    
    $url = "{$supabaseUrl}/rest/v1/orig_ami_content_blocks?language=eq.{$language}&order=ordre.asc";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: {$supabaseKey}",
        "Authorization: Bearer {$supabaseKey}"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return [];
    }
    
    $data = json_decode($response, true);
    
    // Indexer par block_key pour faciliter l'accès et nettoyer le HTML
    $indexed = [];
    foreach ($data as $block) {
        // Nettoyer le contenu HTML
        $block['content'] = cleanQuillHtml($block['content']);
        $indexed[$block['block_key']] = $block;
    }
    
    return $indexed;
}

// Récupérer les blocs de contenu selon la langue
// Par défaut FR, sera remplacé dans les autres fichiers
$contentBlocks = getContentBlocks('fr');
?>

