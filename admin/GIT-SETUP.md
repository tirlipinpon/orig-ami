# Configuration Git pour le dossier Admin

## 🔐 Sécurité des credentials Supabase

Le fichier `.gitignore` a été configuré pour **protéger vos clés Supabase**.

### Fichiers IGNORÉS (ne seront pas committés) :

```
/src/environments/environment.ts
/src/environments/environment.development.ts
/src/environments/environment.prod.ts
/src/environments/environment.staging.ts
```

### Fichier INCLUS (modèle pour les autres développeurs) :

```
/src/environments/environment.example.ts ✅
```

## 📝 Fichiers ajoutés au Git

Le dossier `admin/` a été ajouté au repository git du projet `orig-ami`.

### Structure ajoutée :

```
admin/
├── .gitignore                    ✅ Protège les secrets
├── src/
│   ├── environments/
│   │   └── environment.example.ts ✅ Modèle public
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   └── edit/
│   │   ├── services/
│   │   │   ├── auth.ts
│   │   │   ├── supabase.ts
│   │   │   └── beneficiaire.ts
│   │   ├── guards/
│   │   ├── models/
│   │   └── ...
│   └── ...
├── supabase-migrations/
│   ├── 001_create_beneficiaires_table.sql
│   ├── 002_insert_beneficiaires_data.sql
│   └── 003_rename_partenaire_to_donateur.sql
├── package.json
├── angular.json
├── README-FR.md
├── SUPABASE-SETUP.md
├── GUIDE-INSTALLATION-BENEFICIAIRES.md
├── DRAG-DROP-GUIDE.md
├── DRAG-DROP-FIX.md
└── RESUME-MODIFICATIONS.md
```

## ⚠️ IMPORTANT - Fichiers sensibles

Les fichiers suivants contiennent vos **clés Supabase** et ne sont **PAS committés** :

```
❌ src/environments/environment.ts
❌ src/environments/environment.development.ts
```

### Pourquoi ?

- Ces fichiers contiennent votre **URL Supabase**
- Ils contiennent votre **clé anon** (publique mais sensible)
- Ils sont spécifiques à VOTRE projet

## 🚀 Pour un nouveau développeur

Si quelqu'un clone le projet, il devra :

### 1. Copier le fichier exemple

```bash
cd admin/src/environments
cp environment.example.ts environment.ts
cp environment.example.ts environment.development.ts
```

### 2. Configurer ses credentials

Éditer `environment.ts` et `environment.development.ts` avec ses propres clés Supabase.

### 3. Installer les dépendances

```bash
cd admin
npm install
```

### 4. Lancer l'app

```bash
ng serve
```

## 📋 Commandes Git exécutées

```bash
# Ajout du dossier admin au staging
git add admin

# Les fichiers dans environments/ sont automatiquement ignorés
# sauf environment.example.ts qui est committé
```

## 🔍 Vérifier ce qui est ignoré

Pour voir les fichiers qui seront ignorés :

```bash
cd admin
git status --ignored
```

Pour voir les fichiers qui seront committés :

```bash
git status
```

## ⚙️ Configuration recommandée

### Créer un .env.local (optionnel)

Pour une sécurité encore meilleure, vous pouvez créer un fichier `.env.local` :

```bash
# admin/.env.local
SUPABASE_URL=https://zmgfaiprgbawcernymqa.supabase.co
SUPABASE_ANON_KEY=votre-cle-ici
```

Puis ajoutez dans `.gitignore` :

```
.env.local
.env.*.local
```

## 📦 Fichiers node_modules

Le dossier `node_modules/` est déjà ignoré par le `.gitignore` d'Angular.
Les autres développeurs devront faire `npm install` après le clone.

## 🔐 Meilleures pratiques

### À NE JAMAIS committer :

- ❌ `node_modules/`
- ❌ `dist/` (build de production)
- ❌ `environment*.ts` (sauf .example)
- ❌ `.env` ou fichiers avec secrets
- ❌ Clés API, tokens, passwords

### À toujours committer :

- ✅ Code source (`.ts`, `.html`, `.css`)
- ✅ Fichiers de configuration (`angular.json`, `package.json`)
- ✅ Migrations SQL
- ✅ Documentation (`.md`)
- ✅ Fichiers `.example` (modèles)

## 📝 Prochaine étape

Pour finaliser le commit :

```bash
# Vérifier ce qui sera committé
git status

# Committer les changements
git commit -m "Ajout du dossier admin avec Angular + Supabase Auth"

# Pousser vers le repository distant (si configuré)
git push
```

## ⚠️ Avertissement

**Avant de pousser sur un repository public** :

1. ✅ Vérifiez que `.gitignore` ignore bien les environments
2. ✅ Vérifiez qu'aucune clé Supabase n'est committée
3. ✅ Faites `git log` pour voir le dernier commit
4. ✅ Utilisez `git diff HEAD~1` pour voir ce qui a été ajouté

## 🔄 Pour mettre à jour après un git pull

Si un autre développeur fait des modifications :

```bash
git pull
cd admin
npm install  # Pour installer les nouvelles dépendances
ng serve
```

## 🎯 Workflow recommandé

```bash
# 1. Créer une branche pour vos modifications
git checkout -b feature/nom-de-la-feature

# 2. Faire vos modifications dans admin/

# 3. Ajouter les fichiers
git add admin

# 4. Committer
git commit -m "Description des changements"

# 5. Pousser la branche
git push origin feature/nom-de-la-feature

# 6. Créer une Pull Request sur GitHub/GitLab
```

Votre dossier admin est maintenant prêt à être versionné en toute sécurité ! 🎉
