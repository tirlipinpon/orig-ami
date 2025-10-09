# Guide d'Installation - Gestion des Bénéficiaires

## 📋 Ce qui a été créé

### 1. **Table Supabase** (`beneficiaires`)

Structure complète pour stocker :

- Nom, URL, chemin image
- Alt text, title, largeur d'image
- Type (bénéficiaire ou partenaire)
- Ordre d'affichage
- Statut actif/inactif
- Timestamps automatiques

### 2. **Services Angular**

- ✅ `BeneficiaireService` - CRUD complet
- ✅ `Auth` & `Supabase` - Authentification

### 3. **Interface d'administration**

- ✅ Onglets Bénéficiaires / Partenaires
- ✅ Formulaires d'ajout/modification
- ✅ Activation/Désactivation
- ✅ Suppression avec confirmation
- ✅ Design moderne et responsive

## 🚀 Étapes d'Installation

### Étape 1 : Créer la table dans Supabase

1. Allez sur votre dashboard Supabase : https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Cliquez sur **New Query**
5. Copiez-collez le contenu du fichier :
   ```
   admin/supabase-migrations/001_create_beneficiaires_table.sql
   ```
6. Cliquez sur **Run**
7. ✅ Vérifiez que la table est créée dans **Table Editor**

### Étape 2 : Injecter les données existantes

1. Toujours dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez-collez le contenu du fichier :
   ```
   admin/supabase-migrations/002_insert_beneficiaires_data.sql
   ```
4. Cliquez sur **Run**
5. ✅ Vérifiez dans **Table Editor** > **beneficiaires** que vous avez ~53 lignes

### Étape 3 : Tester l'application

```bash
cd admin
ng serve
```

Ouvrez http://localhost:4200 et connectez-vous !

## 🎯 Fonctionnalités disponibles

### Vue d'ensemble

- **2 onglets** : Bénéficiaires (33) et Partenaires (20)
- **Compteurs** en temps réel
- **Recherche visuelle** avec images

### Actions disponibles

#### ✏️ Modifier

- Cliquez sur l'icône crayon
- Modifiez les champs
- Sauvegardez

#### ➕ Ajouter

- Cliquez sur "Ajouter un bénéficiaire" ou "Ajouter un partenaire"
- Remplissez le formulaire
- Sauvegardez

#### 👁️ Activer/Désactiver

- Cliquez sur l'icône œil/cadenas
- L'élément devient grisé si désactivé
- Les éléments désactivés ne seront pas affichés sur le site

#### 🗑️ Supprimer

- Cliquez sur l'icône poubelle
- Confirmez la suppression
- L'élément est supprimé de la base

## 📊 Structure de la table

```sql
beneficiaires
├── id (UUID, PK)
├── nom (VARCHAR)
├── url (VARCHAR)
├── image_url (VARCHAR)
├── alt_text (VARCHAR)
├── title (VARCHAR)
├── image_width (INTEGER)
├── type ('beneficiaire' | 'partenaire')
├── ordre (INTEGER)
├── actif (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🔐 Sécurité (Row Level Security)

Les politiques RLS sont actives :

### ✅ Lecture (SELECT)

- **Tout le monde** peut lire les bénéficiaires
- Permet l'affichage public sur le site

### 🔒 Modification (INSERT, UPDATE, DELETE)

- **Seuls les utilisateurs authentifiés** peuvent modifier
- Vous devez être connecté à l'admin

## 💡 Utilisation avancée

### Changer l'ordre d'affichage

1. Modifiez un élément
2. Changez le champ "Ordre d'affichage"
3. Sauvegardez
4. Les éléments sont triés par ordre croissant

### Ajouter une nouvelle catégorie

Si vous voulez ajouter d'autres types (ex: "donateurs") :

```sql
-- Modifier la contrainte CHECK
ALTER TABLE beneficiaires
DROP CONSTRAINT beneficiaires_type_check;

ALTER TABLE beneficiaires
ADD CONSTRAINT beneficiaires_type_check
CHECK (type IN ('beneficiaire', 'partenaire', 'donateur'));
```

Puis mettez à jour le modèle TypeScript :

```typescript
// admin/src/app/models/beneficiaire.model.ts
type: "beneficiaire" | "partenaire" | "donateur";
```

## 📱 Responsive Design

L'interface s'adapte automatiquement :

- **Desktop** : Grille multi-colonnes
- **Tablet** : 2 colonnes
- **Mobile** : 1 colonne

## 🐛 Dépannage

### Erreur : "relation 'public.beneficiaires' does not exist"

➡️ Vous n'avez pas exécuté la migration SQL

- Retournez à l'Étape 1

### Erreur : "permission denied for table beneficiaires"

➡️ Problème de RLS ou d'authentification

- Vérifiez que vous êtes connecté
- Vérifiez les politiques RLS dans Supabase

### Les images ne s'affichent pas

➡️ Vérifiez les chemins d'images

- Les chemins doivent être relatifs au dossier public
- Exemple : `img/beneficiaire/nom.jpg`

### Erreur : "new row violates check constraint"

➡️ Le type doit être 'beneficiaire' ou 'partenaire'

- Vérifiez le formulaire

## 🎨 Personnalisation des styles

Les styles sont dans :

```
admin/src/app/components/edit/edit.css
```

Variables principales :

- Couleur primaire : `#667eea`
- Couleur secondaire : `#764ba2`
- Fond : `#f5f7fa`

## 📚 Prochaines étapes possibles

### 1. Upload d'images

- Intégrer Supabase Storage
- Permettre l'upload direct d'images

### 2. Drag & Drop pour réordonner

- Implémenter une librairie de drag-and-drop
- Réordonner visuellement les éléments

### 3. Filtres et recherche

- Ajouter une barre de recherche
- Filtrer par nom, URL, etc.

### 4. Export des données

- Export CSV / Excel
- Export JSON pour backup

### 5. Historique des modifications

- Logger les changements
- Voir qui a modifié quoi et quand

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de la console (F12)
2. Vérifiez les logs Supabase (Dashboard > Logs)
3. Vérifiez que vos credentials sont corrects dans `environment.ts`

## ✅ Checklist de vérification

- [ ] Table `beneficiaires` créée dans Supabase
- [ ] Données injectées (53 lignes)
- [ ] Application Angular démarre sans erreur
- [ ] Connexion fonctionnelle
- [ ] Onglets affichent les bénéficiaires et partenaires
- [ ] Formulaire d'ajout fonctionne
- [ ] Modification fonctionne
- [ ] Suppression fonctionne
- [ ] Activation/Désactivation fonctionne

Tout est prêt ! 🎉
