# Gestion du Carousel - Documentation

## 📋 Vue d'ensemble

Ce système permet de gérer dynamiquement les images du carousel sur la page d'accueil du site ORIG-AMI via l'interface d'administration Angular.

## 🚀 Installation et Configuration

### 1. Appliquer la migration SQL

Connectez-vous à votre base de données Supabase et exécutez la migration :

```bash
# Via Supabase CLI
supabase migration up
```

Ou exécutez manuellement le fichier SQL :

```
admin/supabase-migrations/004_create_carousel_table.sql
```

### 2. Créer le bucket de stockage (si nécessaire)

Dans votre projet Supabase, vérifiez que le dossier `caroussel` existe dans le bucket `orig-ami-image` :

1. Allez dans **Storage** > **orig-ami-image**
2. Créez le dossier `caroussel` s'il n'existe pas
3. Assurez-vous que les politiques de lecture publique sont activées

## 📸 Spécifications des Images

Pour un rendu optimal du carousel, respectez les contraintes suivantes :

- **Format** : WebP (recommandé pour la performance)
- **Hauteur** : 600px (obligatoire pour l'uniformité)
- **Largeur** : Proportionnelle (calculée automatiquement)
- **Poids** : Maximum 500KB
- **Formats acceptés** : JPG, PNG, WebP, GIF

> 💡 **Note** : Le système optimise automatiquement les images qui ne respectent pas ces contraintes en les convertissant au format WebP et en les redimensionnant à la hauteur cible de 600px.

## 🎯 Utilisation

### Accéder au gestionnaire de carousel

1. Connectez-vous à l'interface d'administration Angular
2. Cliquez sur le bouton **🎠 Carousel** dans l'en-tête
3. Ou accédez directement à `/carousel`

### Ajouter un slide

1. Cliquez sur **➕ Ajouter un slide**
2. Remplissez les champs :
   - **Titre** : Nom du slide (pour référence interne)
   - **Texte alternatif** : Description pour l'accessibilité
   - **Image** : Sélectionnez votre fichier
3. L'image sera automatiquement optimisée si nécessaire
4. Cliquez sur **Ajouter**

### Modifier un slide

1. Cliquez sur **✏️ Modifier** sur le slide souhaité
2. Modifiez les informations
3. Pour changer l'image, sélectionnez un nouveau fichier
4. Cliquez sur **Modifier** pour sauvegarder

### Réorganiser les slides

1. Les slides sont affichés dans un ordre modifiable
2. **Glissez-déposez** les cartes pour changer l'ordre
3. L'ordre est sauvegardé automatiquement

### Activer/Désactiver un slide

1. Cliquez sur **👁️ Désactiver** pour masquer un slide du site
2. Les slides désactivés ne s'affichent plus sur le carousel public
3. Cliquez sur **👁️‍🗨️ Activer** pour réactiver un slide

### Supprimer un slide

1. Cliquez sur **🗑️ Supprimer**
2. Confirmez la suppression
3. Le slide est définitivement supprimé de la base de données

## 🔧 Architecture Technique

### Fichiers créés/modifiés

#### Backend (PHP)

- `get-data-supabase.php` : Fonction `getCarousel()` pour récupérer les slides
- `index.php` : Affichage dynamique du carousel

#### Frontend (Angular)

- `admin/src/app/models/carousel.model.ts` : Modèle de données
- `admin/src/app/services/carousel.service.ts` : Service CRUD
- `admin/src/app/components/carousel-manager/` : Composant principal
- `admin/src/app/components/carousel-card/` : Carte d'affichage d'un slide
- `admin/src/app/components/carousel-form/` : Formulaire d'édition
- `admin/src/app/constants/image-constraints.const.ts` : Ajout du dossier carousel
- `admin/src/app/app.routes.ts` : Route `/carousel`

#### Base de données

- Table : `orig_ami_carousel`
- Colonnes : `id`, `titre`, `image_url`, `alt_text`, `ordre`, `actif`, `created_at`, `updated_at`

### Sécurité

- Les politiques RLS (Row Level Security) sont activées
- Lecture publique autorisée (pour le site web)
- Modifications réservées aux utilisateurs authentifiés

## 🐛 Dépannage

### Les images ne s'affichent pas

1. Vérifiez que le bucket `orig-ami-image` existe
2. Vérifiez que le dossier `caroussel` existe dans le bucket
3. Vérifiez les politiques de lecture publique dans Supabase Storage

### Le carousel affiche les anciennes images

1. Vérifiez que des slides actifs existent dans la table `orig_ami_carousel`
2. Si la table est vide, le carousel affiche les images par défaut
3. Videz le cache du navigateur

### Erreur lors de l'upload d'images

1. Vérifiez la taille du fichier (max 500KB)
2. Vérifiez le format (JPG, PNG, WebP, GIF)
3. Vérifiez les permissions du bucket Supabase

## 📝 Notes importantes

- Les images par défaut du dossier `img/slide/` sont conservées comme fallback
- Si aucun slide n'est actif en base de données, le carousel affiche les images par défaut
- L'ordre des slides est géré par le champ `ordre` (du plus grand au plus petit)
- Les images sont stockées dans Supabase Storage : `orig-ami-image/caroussel/`

## 🔄 Migration des images existantes

Si vous souhaitez migrer les images existantes du dossier `img/slide/` vers la base de données :

1. Accédez au gestionnaire de carousel
2. Ajoutez manuellement chaque image en la ré-uploadant
3. Une fois toutes les images migrées, vous pouvez supprimer les anciennes images du dossier local

## 📞 Support

Pour toute question ou problème, consultez :

- La documentation Supabase : https://supabase.com/docs
- La documentation Angular : https://angular.dev
