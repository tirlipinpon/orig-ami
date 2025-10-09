# 📦 Migration des Images vers Supabase Storage

## ✅ Ce Qui a Été Fait

### 1️⃣ **Upload avec Nom de l'Item**

- ✅ Les nouvelles images incluent le nom du bénéficiaire/donateur
- ✅ Format: `{nom-sanitize}-{random}.{ext}`
- ✅ Exemple: `dune-asbl-a8f3c2.png`

### 2️⃣ **Suppression Automatique lors de l'Édition**

- ✅ Quand vous changez l'image d'un item, l'ancienne est supprimée
- ✅ Pas d'accumulation d'images orphelines

### 3️⃣ **Script de Migration**

- ✅ Migre les images existantes de `img/` vers Supabase
- ✅ Met à jour automatiquement les `image_url` dans la DB

## 🚀 Étapes à Suivre

### Étape 1 : Uploadez la Nouvelle Version

```
Source: C:\wamp64\www\orig-ami\admin\dist\admin\browser\
Destination: /customers/0/2/7/orig-ami.eu/httpd.www/admin/

Fichier principal: main-A6BXEUGB.js (NOUVEAU)

Actions:
1. Supprimez tous les anciens main-*.js
2. Uploadez tout le contenu de browser\
```

### Étape 2 : Testez l'Upload d'une Nouvelle Image

1. Allez sur https://www.orig-ami.eu/admin/
2. Créez un nouveau bénéficiaire avec une image
3. Vérifiez dans Supabase Storage que l'image a le bon format de nom

### Étape 3 : Migration des Images Existantes

**Sur votre PC** :

```bash
cd C:\wamp64\www\orig-ami\admin
node migrate-images-to-supabase.js
```

**Ce que le script fait** :

1. Lit toutes les images dans `C:\wamp64\www\orig-ami\img\beneficiaire\`
2. Lit toutes les images dans `C:\wamp64\www\orig-ami\img\sponsors\`
3. Pour chaque image, trouve l'item correspondant dans la DB
4. Upload vers Supabase avec le nouveau format de nom
5. Met à jour l'`image_url` dans la DB

## 📋 Prérequis pour la Migration

Le script suppose que :

- Les images locales sont dans `C:\wamp64\www\orig-ami\img\beneficiaire\`
- Les images locales sont dans `C:\wamp64\www\orig-ami\img\sponsors\`
- Les noms de fichiers actuels correspondent aux `image_url` dans la DB

## 🎯 Format des Nouveaux Noms

**Avant** :

```
logo.png
dune.jpg
croix-rouge.png
```

**Après** :

```
dune-asbl-a8f3c2.png
croix-rouge-belgique-k9m5n1.jpg
restos-du-coeur-p2x7w4.png
```

## ⚠️ Notes Importantes

- ✅ Les anciennes images dans `img/` ne sont PAS supprimées (sauvegarde)
- ✅ Le script crée de nouveaux fichiers dans Supabase
- ✅ La DB est mise à jour avec les nouveaux noms
- ✅ Si erreur, la migration s'arrête et log l'erreur

## 🔍 Vérification Post-Migration

1. **Supabase Dashboard** :

   - Storage > orig-ami-image > beneficiaire
   - Vérifiez que les images ont le bon format de nom

2. **Application Admin** :

   - Rechargez https://www.orig-ami.eu/admin/
   - Vérifiez que toutes les images s'affichent

3. **Base de Données** :
   - Table `beneficiaires`
   - Vérifiez que les `image_url` ont été mis à jour

## 🐛 En Cas de Problème

Si une image ne migre pas :

- Vérifiez que l'item existe dans la DB
- Vérifiez que l'`image_url` correspond au nom du fichier
- Relancez le script (il ignore les images déjà migrées)
