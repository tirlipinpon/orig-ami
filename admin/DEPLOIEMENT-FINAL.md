# 🚀 Déploiement Final - ORIG-AMI Admin

## ✅ Configuration Complète

### 📦 **Supabase Storage**

- **Bucket** : `orig-ami-image` (public)
- **Dossiers** : `beneficiaire/` et `sponsors/`
- **Format noms** : `{nom-sanitize}-{random}.{ext}`
- **Exemple** : `dune-asbl-a8f3c2.png`

### 🌐 **Hébergement**

- **Provider** : one.com
- **URL Admin** : https://www.orig-ami.eu/admin/
- **Chemin serveur** : `/customers/0/2/7/orig-ami.eu/httpd.www/admin/`

---

## 📤 Fichiers à Uploader

### **Application Angular**

```
Source: C:\wamp64\www\orig-ami\admin\dist\admin\browser\
Destination: /customers/0/2/7/orig-ami.eu/httpd.www/admin/

Fichiers:
✓ index.html
✓ .htaccess
✓ main-4AQVPZIO.js
✓ polyfills-5CFQRCPP.js
✓ chunk-6AOLKZEJ.js
✓ chunk-5SUDMNYJ.js
✓ styles-5INURTSO.css
✓ favicon.ico
```

**Action** : Supprimez tous les anciens main-\*.js avant d'uploader le nouveau.

---

## ✨ Fonctionnalités

### **Upload d'Images**

1. ✅ Validation automatique (type, taille, dimensions)
2. ✅ Optimisation automatique si nécessaire
3. ✅ Conversion WebP automatique
4. ✅ Noms de fichiers avec nom du bénéficiaire/donateur
5. ✅ Upload vers Supabase Storage au clic sur Créer/Éditer

### **Édition d'Images**

1. ✅ Suppression automatique de l'ancienne image
2. ✅ Upload de la nouvelle
3. ✅ Pas d'images orphelines

### **Affichage**

1. ✅ Images servies depuis Supabase CDN
2. ✅ URLs publiques automatiques
3. ✅ Cache optimisé

### **UX**

1. ✅ Workflow: Nom → URL → Image → Créer
2. ✅ Upload d'image visible seulement après remplissage nom/URL
3. ✅ Message d'info si champs non remplis
4. ✅ Drag & drop pour réorganiser les items
5. ✅ Optimisation automatique des images non conformes

---

## 🔒 Sécurité

### **Permissions Supabase**

- ✅ Bucket public pour les lectures
- ✅ Policy INSERT activée pour les uploads
- ✅ Authentification Supabase pour l'admin

### **Fichiers Protégés**

- ✅ `.gitignore` configuré pour les environments
- ✅ Clés Supabase dans fichiers d'environnement

---

## 🧪 Tests Post-Déploiement

1. **Accès admin** : https://www.orig-ami.eu/admin/
2. **Login** : Authentification Supabase
3. **Création item** : Nom → URL → Image → Créer
4. **Édition item** : Changement d'image → Suppression auto ancienne
5. **Affichage** : Images depuis Supabase
6. **Drag & drop** : Réorganisation des items

---

## 📊 Statistiques

- **52 images** migrées vers Supabase
- **33 bénéficiaires** avec images
- **19 sponsors** avec images
- **Format uniforme** : `{nom}-{random}.{ext}`

---

## 🔄 Mises à Jour Futures

Pour déployer une mise à jour :

```bash
cd C:\wamp64\www\orig-ami\admin
npm run build
```

Puis uploadez le contenu de `dist/admin/browser/` vers `/httpd.www/admin/`

**⚠️ Important** : Supprimez toujours les anciens main-\*.js avant d'uploader le nouveau !

---

## 📝 URLs Importantes

- **Admin** : https://www.orig-ami.eu/admin/
- **Site public** : https://www.orig-ami.eu/
- **Supabase Dashboard** : https://supabase.com/dashboard/project/zmgfaiprgbawcernymqa
- **Storage** : https://supabase.com/dashboard/project/zmgfaiprgbawcernymqa/storage/buckets/orig-ami-image

---

✅ **Votre admin est prêt pour la production !** 🎉
