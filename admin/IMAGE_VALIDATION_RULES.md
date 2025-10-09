# 🔍 Règles de Validation des Images

Ce document détaille toutes les validations appliquées lors de l'upload d'images dans l'interface d'administration.

## 📏 Contraintes Techniques

### 1. Taille du Fichier

**Limite** : 500 KB (512 000 octets) maximum

**Pourquoi ?**
- Améliore les performances de chargement du site
- Réduit la bande passante consommée
- Optimise l'expérience utilisateur mobile

**Message d'erreur** : 
```
Le fichier est trop volumineux. Taille maximale: 500KB
```

**Solution** :
- Compressez l'image avec [TinyPNG](https://tinypng.com/)
- Utilisez [Squoosh](https://squoosh.app/) pour une compression avancée
- Préférez le format WebP (meilleur ratio qualité/taille)

### 2. Dimensions de l'Image

**Limites** :
- **Largeur maximale** : 500 pixels
- **Hauteur maximale** : 500 pixels

**Exception** : Les fichiers SVG ne sont pas soumis à cette contrainte

**Pourquoi ?**
- Évite les images excessivement grandes
- Garantit une taille cohérente sur le site
- Améliore les performances d'affichage
- Réduit la consommation de mémoire

**Messages d'erreur** :

```
L'image est trop large. Largeur maximale: 500px (votre image: 1200px)
```

```
L'image est trop haute. Hauteur maximale: 500px (votre image: 800px)
```

**Solution** :
- Redimensionnez l'image avec un éditeur (Photoshop, GIMP, Paint.NET)
- Utilisez un outil en ligne : [Squoosh](https://squoosh.app/), [ResizeImage.net](https://resizeimage.net/)
- Pour les logos, privilégiez le format SVG (vectoriel, sans limite)

### 3. Formats de Fichiers Acceptés

**Formats autorisés** :
- ✅ **JPEG** (`.jpg`, `.jpeg`) - Recommandé pour photos
- ✅ **PNG** (`.png`) - Pour images avec transparence
- ✅ **WebP** (`.webp`) - Format moderne optimisé (recommandé)
- ✅ **SVG** (`.svg`) - Logos vectoriels (pas de limite de dimensions)
- ✅ **GIF** (`.gif`) - Animations

**Formats refusés** :
- ❌ BMP
- ❌ TIFF
- ❌ ICO
- ❌ Autres formats

**Message d'erreur** :
```
Type de fichier non supporté. Formats acceptés: JPG, PNG, WebP, SVG, GIF
```

**Solution** :
- Convertissez l'image dans un format supporté
- Utilisez [CloudConvert](https://cloudconvert.com/image-converter) pour convertir

## 🔄 Processus de Validation

Lorsque vous sélectionnez une image, voici les étapes de validation :

```
1. ✅ Vérification du type MIME
   └─ Si invalide → Erreur immédiate

2. ✅ Vérification de la taille du fichier
   └─ Si > 500KB → Erreur immédiate

3. ✅ Chargement de l'image en mémoire
   └─ Si erreur → Erreur de lecture

4. ✅ Extraction des dimensions (sauf SVG)
   └─ Si > 500x500px → Erreur avec dimensions exactes

5. ✅ Upload vers Supabase Storage
   └─ Si erreur → Message d'erreur spécifique

6. ✅ Mise à jour du formulaire
   └─ Prévisualisation + nom de fichier
```

## 📊 Exemples de Validation

### ✅ Image Valide

```
Fichier: logo.webp
Type: image/webp
Taille: 45 KB
Dimensions: 400x300px
Résultat: ✓ Upload réussi
```

### ❌ Image Trop Volumineuse

```
Fichier: photo-haute-qualite.jpg
Type: image/jpeg
Taille: 2.5 MB
Dimensions: 4000x3000px
Résultat: ✗ Le fichier est trop volumineux. Taille maximale: 500KB
```

### ❌ Image Trop Grande

```
Fichier: banner.png
Type: image/png
Taille: 200 KB
Dimensions: 1920x600px
Résultat: ✗ L'image est trop large. Largeur maximale: 500px (votre image: 1920px)
```

### ✅ SVG Sans Limite

```
Fichier: logo.svg
Type: image/svg+xml
Taille: 15 KB
Dimensions: N/A (vectoriel)
Résultat: ✓ Upload réussi (pas de vérification de dimensions pour SVG)
```

## 🛠️ Outils Recommandés

### Compression d'Images

1. **[TinyPNG](https://tinypng.com/)** - Gratuit, excellent pour JPG et PNG
2. **[Squoosh](https://squoosh.app/)** - Google, tous formats, contrôle précis
3. **[ImageOptim](https://imageoptim.com/)** - macOS, compression sans perte
4. **[RIOT](https://riot-optimizer.com/)** - Windows, gratuit

### Redimensionnement

1. **[Squoosh](https://squoosh.app/)** - Redimensionnement + compression
2. **[ResizeImage.net](https://resizeimage.net/)** - Simple et rapide
3. **[Bulk Resize Photos](https://bulkresizephotos.com/)** - Redimensionnement par lot
4. **GIMP** - Logiciel open source complet

### Conversion de Formats

1. **[CloudConvert](https://cloudconvert.com/)** - Tous formats
2. **[Convertio](https://convertio.co/fr/image-converter/)** - En ligne, rapide
3. **XnConvert** - Logiciel gratuit, conversion par lot

## 💡 Bonnes Pratiques

### Pour les Logos

```
✓ Format: SVG (vectoriel, pas de limite)
✓ Alternative: PNG avec fond transparent
✓ Dimensions: ~200x200px à ~400x400px
✓ Taille: < 50KB idéalement
```

### Pour les Photos

```
✓ Format: WebP (meilleur compromis)
✓ Alternative: JPEG (qualité 80-85%)
✓ Dimensions: 500x500px maximum
✓ Taille: 100-300KB idéalement
```

### Pour les Icônes

```
✓ Format: SVG de préférence
✓ Alternative: PNG 32 bits avec transparence
✓ Dimensions: 100x100px à 300x300px
✓ Taille: < 20KB idéalement
```

## 🔐 Validations Côté Serveur

En plus des validations côté client, Supabase Storage applique également :

- Vérification des politiques RLS (authentification requise)
- Limite de taille du bucket
- Quotas de stockage du projet
- Validation du nom de fichier

## 📝 Notes Importantes

1. **SVG exempté** : Les fichiers SVG ne sont pas soumis aux limites de dimensions car ils sont vectoriels
2. **Validation immédiate** : Toutes les vérifications se font avant l'upload
3. **Messages clairs** : Les erreurs indiquent précisément le problème et la solution
4. **Prévisualisation locale** : Affichée immédiatement, même avant l'upload
5. **Upload automatique** : Dès que l'image est valide, elle est uploadée automatiquement

## 🎯 Résumé Rapide

| Critère | Limite | Exception |
|---------|--------|-----------|
| **Taille fichier** | 500 KB max | Aucune |
| **Largeur** | 500 px max | SVG |
| **Hauteur** | 500 px max | SVG |
| **Formats** | JPG, PNG, WebP, SVG, GIF | Aucune |

---

**Astuce** : Pour obtenir les meilleurs résultats, utilisez des images de 500x500px maximum, au format WebP, compressées à ~200KB.

