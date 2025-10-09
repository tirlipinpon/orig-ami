# Résumé des Modifications - Distinction Bénéficiaires/Donateurs

## ✅ Modification effectuée

Le champ `type` a été mis à jour pour mieux correspondre à la structure HTML du site :

### Avant :

- `'beneficiaire'` = Ceux qui ont reçu les tentes
- `'partenaire'` = Sponsors/Donateurs

### Après :

- `'beneficiaire'` = Ceux qui ont reçu les tentes (section `id="beneficiaires"`)
- `'donateur'` = Sponsors/Partenaires (section `id="donateurs"`)

## 🔄 Correspondance HTML

| Type dans la BDD | Section HTML               | Description                                   |
| ---------------- | -------------------------- | --------------------------------------------- |
| `beneficiaire`   | `<div id="beneficiaires">` | "Ils ont reçu nos tentes"                     |
| `donateur`       | `<div id="donateurs">`     | "Partenaires" (ceux qui ont donné/sponsorisé) |

## 📝 Fichiers modifiés

### 1. Base de données SQL

- ✅ `001_create_beneficiaires_table.sql` - Contrainte CHECK mise à jour
- ✅ `002_insert_beneficiaires_data.sql` - Données insérées avec 'donateur'
- ✅ `003_rename_partenaire_to_donateur.sql` - Migration pour renommer les données existantes

### 2. Code Angular

- ✅ `beneficiaire.model.ts` - Type mis à jour : `'beneficiaire' | 'donateur'`
- ✅ `beneficiaire.ts` (service) - Méthode `getByType()` mise à jour
- ✅ `edit.ts` (composant) - Variables renommées : `donateurs` au lieu de `partenaires`
- ✅ `edit.html` (template) - Onglet "Donateurs / Partenaires" au lieu de "Partenaires"

## 🚀 Instructions d'installation

### Si vous partez de zéro :

Exécutez simplement les migrations dans l'ordre :

1. `001_create_beneficiaires_table.sql` (table avec 'donateur')
2. `002_insert_beneficiaires_data.sql` (données avec 'donateur')

### Si vous avez déjà exécuté les anciennes migrations :

Exécutez la migration de conversion :

```sql
-- 003_rename_partenaire_to_donateur.sql
UPDATE public.beneficiaires SET type = 'donateur' WHERE type = 'partenaire';
ALTER TABLE public.beneficiaires DROP CONSTRAINT IF EXISTS beneficiaires_type_check;
ALTER TABLE public.beneficiaires ADD CONSTRAINT beneficiaires_type_check
CHECK (type IN ('beneficiaire', 'donateur'));
```

## 📊 Résultat dans l'interface admin

### Onglet 1 : Bénéficiaires (33)

Liste de ceux qui ont **reçu** les tentes

### Onglet 2 : Donateurs / Partenaires (20)

Liste de ceux qui ont **donné** ou sponsorisé

## 🎯 Avantages de cette modification

1. **Cohérence** : Le code correspond exactement aux IDs HTML du site
2. **Clarté** : La distinction entre "qui reçoit" et "qui donne" est plus claire
3. **Évolutivité** : Plus facile d'ajouter d'autres types à l'avenir
4. **Logique métier** : Reflète mieux la réalité du projet

## 🔍 Vérification

Pour vérifier que tout fonctionne :

```sql
-- Compter par type
SELECT type, COUNT(*) as total
FROM public.beneficiaires
GROUP BY type;

-- Devrait afficher :
-- beneficiaire | 33
-- donateur     | 20
```

Dans l'interface admin :

- Onglet "Bénéficiaires" doit afficher "(33)"
- Onglet "Donateurs / Partenaires" doit afficher "(20)"

Tout est maintenant cohérent ! 🎉
