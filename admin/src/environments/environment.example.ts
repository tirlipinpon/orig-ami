// Fichier d'exemple pour la configuration Supabase
// Copiez ce fichier vers environment.ts et environment.development.ts
// et remplacez les valeurs par vos propres credentials Supabase

export const environment = {
  production: false,
  supabase: {
    url: 'https://votre-projet.supabase.co',
    anonKey: 'votre-cle-anonyme-supabase-ici'
  }
};

// Pour obtenir vos credentials :
// 1. Allez sur https://app.supabase.com
// 2. Sélectionnez votre projet
// 3. Settings > API
// 4. Copiez "Project URL" et "anon/public key"

