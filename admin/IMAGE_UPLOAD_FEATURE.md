# 📸 Fonctionnalité de Validation d'Images

## Résumé

Cette fonctionnalité permet de valider les images sélectionnées dans l'interface d'administration lors de la création ou modification d'un bénéficiaire ou donateur.

**Note** : Pour le moment, seule la validation est effectuée (pas d'upload vers Supabase Storage).

## ✨ Fonctionnalités Ajoutées

### 1. Sélection et Validation d'Images

- ✅ Bouton "📁 Choisir une image" dans le formulaire
- ✅ Prévisualisation instantanée de l'image sélectionnée
- ✅ **Affichage des informations de l'image** (type, taille, dimensions)
- ✅ **Code couleur** : vert pour valide, **rouge pour non conforme**
- ✅ Validation automatique du type et de la taille du fichier
- ✅ Validation automatique des dimensions (500x500px max)
- ✅ Messages de succès/erreur en temps réel
- ✅ Bouton de suppression pour retirer une image

### 2. Service de Validation

**Fichier** : `src/app/services/image-upload.service.ts`

**Fonctionnalités** :

- Validation des formats (JPG, PNG, WebP, SVG, GIF)
- Validation de la taille (500KB max)
- Validation des dimensions (500x500px max, sauf SVG)
- Gestion des URLs de prévisualisation locale
- Retour du nom de fichier pour enregistrement

### 3. Interface Utilisateur

**Fichiers modifiés** :

- `src/app/components/item-form/item-form.html` - Nouveau layout avec upload
- `src/app/components/item-form/item-form.ts` - Logique d'upload
- `src/app/components/item-form/item-form.css` - Styles pour l'upload

**Nouvelles fonctionnalités UI** :

- Zone de prévisualisation avec l'image
- **Tableau d'informations de l'image** avec code couleur
- Indicateur de chargement pendant la validation
- Messages de validation
- Responsive design

**Feedback visuel** :

L'interface affiche les informations de l'image avec un code couleur :

- 🟢 **Vert** : Valeur conforme aux contraintes
- 🔴 **Rouge** : Valeur NON conforme (avec indication de la limite)

### 4. Compatibilité Ascendante

**Fichier modifié** : `src/app/services/beneficiaire.ts`

Le service gère automatiquement :

- ✅ Images Supabase Storage (nouvelles)
- ✅ Images hébergées sur `https://www.orig-ami.eu/img/` (anciennes)
- ✅ Détection automatique du format d'URL

## 🚀 Utilisation

### Pour l'Administrateur

1. Ouvrir l'interface d'administration
2. Cliquer sur "Ajouter un bénéficiaire" ou "Ajouter un donateur"
3. Remplir le formulaire
4. Cliquer sur **"📁 Choisir une image"**
5. Sélectionner un fichier image (max 500KB, 500x500px)
6. L'image est validée automatiquement
7. Une prévisualisation s'affiche si validation réussie
8. Enregistrer le formulaire (le nom du fichier est enregistré)

### Pour l'Édition

1. Cliquer sur "Modifier" sur un item existant
2. L'image actuelle s'affiche en prévisualisation
3. Cliquer sur **"📁 Choisir une image"** pour changer l'image
4. Ou cliquer sur **"✕ Supprimer"** pour retirer l'image
5. Enregistrer les modifications

## 📋 Configuration

**Aucune configuration supplémentaire n'est requise.** La validation fonctionne directement côté client.

**Note** : Le fichier image lui-même n'est pas encore uploadé vers un serveur. Seul le nom du fichier est enregistré dans la base de données pour référence future.

## 🎨 Formats Supportés et Contraintes

| Format | Extension       | Utilisation                                    |
| ------ | --------------- | ---------------------------------------------- |
| JPEG   | `.jpg`, `.jpeg` | Photos, images compressées                     |
| PNG    | `.png`          | Images avec transparence                       |
| WebP   | `.webp`         | Format moderne optimisé (recommandé)           |
| SVG    | `.svg`          | Logos vectoriels (pas de limite de dimensions) |
| GIF    | `.gif`          | Animations                                     |

### Limites Strictes

- **Taille maximale** : 500 KB par fichier
- **Dimensions maximales** : 500 x 500 pixels (largeur et hauteur)
- **Exception SVG** : Les fichiers SVG ne sont pas limités en dimensions

### Recommandations

Pour respecter ces contraintes :

- Redimensionnez vos images à 500x500px maximum avant l'upload
- Utilisez des outils de compression : [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/)
- Privilégiez le format WebP pour un meilleur ratio qualité/taille
- Pour les logos, préférez le format SVG (vectoriel, sans perte)

## 🔒 Sécurité

- ✅ Validation côté client (type, taille et dimensions)
- ✅ Blocage des formats non autorisés
- ✅ Limite stricte de taille (500KB)
- ✅ Limite stricte de dimensions (500x500px)

## 📂 Structure des Fichiers

```
admin/
├── src/app/
│   ├── services/
│   │   ├── image-upload.service.ts      [NOUVEAU] Service d'upload
│   │   └── beneficiaire.ts              [MODIFIÉ] Support Supabase URLs
│   └── components/item-form/
│       ├── item-form.ts                 [MODIFIÉ] Logique d'upload
│       ├── item-form.html               [MODIFIÉ] UI d'upload
│       └── item-form.css                [MODIFIÉ] Styles d'upload
├── IMAGE_UPLOAD_FEATURE.md             [NOUVEAU] Ce fichier
└── IMAGE_VALIDATION_RULES.md           [NOUVEAU] Règles détaillées
```

## 🔧 Détails Techniques

### Processus de Validation

1. **Sélection du fichier** : L'utilisateur clique et choisit une image
2. **Extraction des informations** : Lecture du type, taille et dimensions
3. **Affichage des informations** : Tableau avec code couleur (vert/rouge)
4. **Validation du type** : Vérification du MIME type
5. **Validation de la taille** : Vérification que le fichier ≤ 500KB
6. **Chargement en mémoire** : Création d'un objet Image
7. **Validation des dimensions** : Vérification largeur et hauteur ≤ 500px (sauf SVG)
8. **Prévisualisation** : Affichage local de l'image
9. **Mise à jour du formulaire** : Enregistrement du nom du fichier

### Affichage des Informations

Une fois l'image sélectionnée, un tableau affiche :

```
Type :        JPEG
Taille :      245.3 KB          ✅ (vert)
Dimensions :  400px × 350px     ✅ (vert)
```

Si l'image n'est pas conforme :

```
Type :        PNG
Taille :      782.5 KB (max: 500 KB)     ❌ (rouge)
Dimensions :  1200px × 800px (max: 500×500 px)     ❌ (rouge)
```

Le code couleur permet de voir immédiatement quelles contraintes ne sont pas respectées.

### Stockage

**Pour le moment** : Seul le **nom du fichier** est enregistré dans la base de données Supabase.

**À venir** : L'upload réel des images vers un serveur de stockage (Supabase Storage ou autre).

## 🐛 Résolution de Problèmes

### La validation échoue

1. ✅ Vérifiez que le fichier fait moins de 500KB
2. ✅ Vérifiez que les dimensions sont ≤ 500x500px
3. ✅ Vérifiez le format du fichier (JPG, PNG, WebP, SVG, GIF)
4. ✅ Consultez la console pour voir le message d'erreur exact

### La prévisualisation ne s'affiche pas

1. ✅ Vérifiez que l'image est valide
2. ✅ Rechargez la page et réessayez
3. ✅ Consultez la console pour les erreurs JavaScript

### Messages d'erreur courants

| Erreur                           | Solution                              |
| -------------------------------- | ------------------------------------- |
| "Type de fichier non supporté"   | Utilisez JPG, PNG, WebP, SVG ou GIF   |
| "Le fichier est trop volumineux" | Max 500KB - compressez l'image        |
| "L'image est trop large"         | Redimensionnez à max 500px de largeur |
| "L'image est trop haute"         | Redimensionnez à max 500px de hauteur |

## 📊 Améliorations Futures

### À court terme

- [ ] **Upload vers Supabase Storage** (priorité haute)
- [ ] Compression automatique des images côté client
- [ ] Support du drag & drop

### À moyen terme

- [ ] Upload multiple d'images
- [ ] Recadrage d'images avant upload
- [ ] Galerie d'images existantes
- [ ] Migration automatique des anciennes images vers Supabase Storage

## 📝 Notes

- ⚠️ **Important** : Les images ne sont pas encore uploadées vers un serveur. Seul le nom du fichier est enregistré.
- Les anciennes images sur `https://www.orig-ami.eu/img/` continuent de fonctionner
- Le système détecte automatiquement le type d'URL
- La validation côté client garantit que seules les images conformes sont acceptées

## 🎉 Résultat

L'interface d'administration permet maintenant une sélection et validation d'images simple, intuitive et sécurisée, avec :

- ✅ Prévisualisation instantanée de l'image
- ✅ **Affichage détaillé des informations** (type, taille, dimensions)
- ✅ **Code couleur intelligent** : 🟢 vert pour valide, 🔴 rouge pour non conforme
- ✅ **Indication des limites** directement sur les valeurs non conformes
- ✅ Validation robuste des contraintes (taille, dimensions, format)
- ✅ Feedback visuel clair et immédiat
- ✅ Messages d'erreur explicites
- ✅ Compatibilité avec l'existant
- ⏳ Upload vers serveur (à venir)

### Avantages du Feedback Visuel

- L'utilisateur voit **immédiatement** si son image respecte les contraintes
- Plus besoin d'attendre un message d'erreur pour savoir ce qui ne va pas
- Les limites sont **affichées directement** à côté des valeurs non conformes
- L'interface guide l'utilisateur vers des images conformes
