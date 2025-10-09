/**
 * Script de migration des images vers Supabase Storage
 * 
 * Ce script:
 * 1. Lit les images locales de img/beneficiaire et img/sponsors
 * 2. Upload chaque image vers Supabase avec un nom basé sur le nom du bénéficiaire/donateur
 * 3. Met à jour les image_url dans la base de données
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase
const SUPABASE_URL = 'https://zmgfaiprgbawcernymqa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2ZhaXByZ2Jhd2Nlcm55bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2NTc0MjEsImV4cCI6MjA0MDIzMzQyMX0.sBq7sR7JhRZCg36xvt13yt_f398oWbHUfdUwa9yoox0';
const BUCKET_NAME = 'orig-ami-image';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Chemins des dossiers locaux
const BASE_PATH = path.join(__dirname, '..');
const BENEFICIAIRE_PATH = path.join(BASE_PATH, 'img', 'beneficiaire');
const SPONSORS_PATH = path.join(BASE_PATH, 'img', 'sponsors');

/**
 * Nettoie un nom pour l'utiliser dans un nom de fichier
 */
function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30);
}

/**
 * Récupère les items de la base de données
 */
async function getItems(type) {
  const { data, error } = await supabase
    .from('beneficiaires')
    .select('*')
    .eq('type', type);
  
  if (error) {
    console.error(`❌ Erreur lecture ${type}:`, error);
    return [];
  }
  
  return data || [];
}

/**
 * Upload une image vers Supabase
 */
async function uploadImage(filePath, folder, itemName) {
  try {
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedName = sanitizeFileName(itemName);
    const newFileName = `${sanitizedName}-${randomString}${ext}`;
    const storagePath = `${folder}/${newFileName}`;
    
    console.log(`📤 Upload: ${fileName} → ${newFileName}`);
    
    const fileBuffer = fs.readFileSync(filePath);
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: `image/${ext.substring(1)}`,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error(`  ❌ Erreur upload: ${error.message}`);
      return null;
    }
    
    console.log(`  ✅ Uploadé: ${newFileName}`);
    return newFileName;
    
  } catch (error) {
    console.error(`  ❌ Exception: ${error.message}`);
    return null;
  }
}

/**
 * Met à jour l'image_url dans la base de données
 */
async function updateImageUrl(itemId, newFileName) {
  const { error } = await supabase
    .from('beneficiaires')
    .update({ image_url: newFileName })
    .eq('id', itemId);
  
  if (error) {
    console.error(`  ❌ Erreur mise à jour DB:`, error);
    return false;
  }
  
  console.log(`  💾 DB mise à jour`);
  return true;
}

/**
 * Migre les images d'un dossier
 */
async function migrateFolder(localPath, folder, type) {
  console.log(`\n📁 Migration ${folder}...`);
  console.log(`═══════════════════════════════════════\n`);
  
  // Vérifier que le dossier existe
  if (!fs.existsSync(localPath)) {
    console.log(`⚠️ Dossier ${localPath} inexistant, ignoré\n`);
    return;
  }
  
  // Récupérer les items de la DB
  const items = await getItems(type);
  console.log(`📊 ${items.length} items trouvés dans la DB\n`);
  
  // Lister les fichiers images
  const files = fs.readdirSync(localPath).filter(f => 
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f)
  );
  
  console.log(`📸 ${files.length} images trouvées dans ${localPath}\n`);
  
  let migrated = 0;
  let failed = 0;
  
  for (const file of files) {
    const filePath = path.join(localPath, file);
    const baseName = path.basename(file, path.extname(file));
    
    // Trouver l'item correspondant dans la DB
    const item = items.find(i => 
      i.image_url === file || 
      i.image_url === baseName ||
      i.image_url.includes(baseName)
    );
    
    if (!item) {
      console.log(`⚠️ ${file}: Aucun item correspondant trouvé, ignoré`);
      failed++;
      continue;
    }
    
    console.log(`\n🔄 ${item.nom}:`);
    console.log(`   Ancien: ${file}`);
    
    // Upload vers Supabase
    const newFileName = await uploadImage(filePath, folder, item.nom);
    
    if (newFileName) {
      console.log(`   Nouveau: ${newFileName}`);
      
      // Mettre à jour la DB
      const updated = await updateImageUrl(item.id, newFileName);
      
      if (updated) {
        migrated++;
        console.log(`   ✅ Migration réussie`);
      } else {
        failed++;
        console.log(`   ❌ Échec mise à jour DB`);
      }
    } else {
      failed++;
      console.log(`   ❌ Échec upload`);
    }
  }
  
  console.log(`\n═══════════════════════════════════════`);
  console.log(`📊 Résumé ${folder}:`);
  console.log(`   ✅ Migrés: ${migrated}`);
  console.log(`   ❌ Échecs: ${failed}`);
  console.log(`   📁 Total: ${files.length}`);
}

/**
 * Migration principale
 */
async function main() {
  console.log('\n🚀 MIGRATION DES IMAGES VERS SUPABASE STORAGE');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`📦 Bucket: ${BUCKET_NAME}`);
  console.log(`🔗 URL: ${SUPABASE_URL}\n`);
  
  // Migrer les bénéficiaires
  await migrateFolder(BENEFICIAIRE_PATH, 'beneficiaire', 'beneficiaire');
  
  // Migrer les sponsors
  await migrateFolder(SPONSORS_PATH, 'sponsors', 'donateur');
  
  console.log('\n\n✅ MIGRATION TERMINÉE!');
  console.log('═══════════════════════════════════════════════════\n');
}

// Lancer la migration
main().catch(error => {
  console.error('\n❌ ERREUR FATALE:', error);
  process.exit(1);
});

