<?php
/**
 * Récupère les bénéficiaires et donateurs depuis Supabase
 * Retourne un JSON pour être utilisé dans index.php
 */

// URL de votre API Supabase
$supabaseUrl = 'https://zmgfaiprgbawcernymqa.supabase.co';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2ZhaXByZ2Jhd2Nlcm55bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2NTc0MjEsImV4cCI6MjA0MDIzMzQyMX0.sBq7sR7JhRZCg36xvt13yt_f398oWbHUfdUwa9yoox0';
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
    
    $url = "{$supabaseUrl}/rest/v1/beneficiaires?type=eq.{$type}&actif=eq.true&order=ordre.desc";
    
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

// Récupérer les bénéficiaires et donateurs
$beneficiaires = getItems('beneficiaire');
$donateurs = getItems('donateur');
?>

