# 🔢 Gestion de l'ordre d'affichage des bénéficiaires et donateurs

## 📋 **Vue d'ensemble**

Ce document explique comment fonctionne la gestion de l'ordre d'affichage des éléments (bénéficiaires et donateurs) dans l'interface admin.

## 🎯 **Comportement actuel**

### **Avant les modifications (PROBLÈME) :**
- ❌ Nouvel élément créé avec `ordre = 0`
- ❌ Risque de doublons d'ordre
- ❌ Affichage imprévisible en cas de conflit
- ❌ Tous les éléments décalés à chaque ajout

### **Après les modifications (SOLUTION) :**
- ✅ Nouvel élément ajouté **à la fin** automatiquement
- ✅ Calcul automatique du prochain ordre disponible
- ✅ Pas de doublons possibles
- ✅ Ordre prévisible et stable
- ✅ Pas de décalage inutile des éléments existants

## 🔧 **Fonctionnement technique**

### **1. Création d'un nouvel élément**

Quand vous cliquez sur "Ajouter un bénéficiaire/donateur" :

```typescript
// Calcul automatique du prochain ordre
const items = type === 'beneficiaire' ? this.beneficiaires : this.donateurs;
const maxOrdre = items.length > 0 ? Math.max(...items.map(item => item.ordre)) : 0;

// Nouvel élément avec ordre = max + 1
this.formData = {
  // ...
  ordre: maxOrdre + 1, // Ajouter à la fin
  // ...
};
```

**Exemple :**
```
Éléments existants :
- Élément A : ordre = 1
- Élément B : ordre = 2
- Élément C : ordre = 3

Nouvel élément créé : ordre = 4 (automatique)
```

### **2. Réorganisation par drag-and-drop**

Quand vous déplacez un élément avec la poignée `⋮⋮` :

1. **Déplacement visuel** : L'élément suit votre curseur
2. **Calcul des nouveaux ordres** : Les ordres sont recalculés automatiquement
3. **Sauvegarde en base** : Tous les ordres sont mis à jour
4. **Pas de rechargement** : L'interface reste fluide

```typescript
// Suppression de l'élément de sa position
const movedItem = items.splice(oldIndex, 1)[0];

// Insertion à la nouvelle position
items.splice(newIndex, 0, movedItem);

// Mise à jour des ordres
items.forEach((item, index) => {
  item.ordre = index + 1;
});
```

### **3. Modification d'un élément existant**

Quand vous modifiez un élément (bouton ✏️) :
- ✅ **L'ordre est conservé** : Pas de changement d'ordre
- ✅ **Seules les infos modifiées** : Nom, URL, image, etc.

### **4. Suppression d'un élément**

Quand vous supprimez un élément (bouton 🗑️) :
- ❌ **ATTENTION** : Les ordres ne sont **PAS** automatiquement réorganisés
- 💡 **Solution** : Utilisez le drag-and-drop pour réorganiser après suppression

## 🛡️ **Protection contre les doublons**

### **Migration SQL à appliquer**

Pour éviter complètement les doublons d'ordre en base de données :

```sql
-- Ajouter une contrainte unique sur (type, ordre)
ALTER TABLE beneficiaires 
ADD CONSTRAINT unique_type_ordre UNIQUE (type, ordre);
```

Cette contrainte empêche **physiquement** d'avoir deux éléments du même type avec le même ordre.

### **Si vous avez déjà des doublons**

Avant d'appliquer la contrainte, corrigez les doublons existants :

```sql
WITH ordered_beneficiaires AS (
  SELECT 
    id,
    type,
    ROW_NUMBER() OVER (PARTITION BY type ORDER BY ordre, created_at) as new_ordre
  FROM beneficiaires
)
UPDATE beneficiaires b
SET ordre = ob.new_ordre
FROM ordered_beneficiaires ob
WHERE b.id = ob.id;
```

## 📊 **Exemples d'utilisation**

### **Scénario 1 : Ajouter un nouvel élément**

**État initial :**
```
1. CPAS Ganshoren
2. Le Relais Social
3. CPAS Molenbeek
```

**Action :** Cliquer sur "➕ Ajouter un bénéficiaire"

**Résultat :**
```
1. CPAS Ganshoren
2. Le Relais Social
3. CPAS Molenbeek
4. Nouveau bénéficiaire ← Ajouté automatiquement en position 4
```

### **Scénario 2 : Réorganiser avec drag-and-drop**

**État initial :**
```
1. CPAS Ganshoren
2. Le Relais Social
3. CPAS Molenbeek
4. Nouveau bénéficiaire
```

**Action :** Glisser "Nouveau bénéficiaire" en position 2

**Résultat :**
```
1. CPAS Ganshoren
2. Nouveau bénéficiaire ← Déplacé ici
3. Le Relais Social     ← Décalé
4. CPAS Molenbeek       ← Décalé
```

### **Scénario 3 : Supprimer un élément**

**État initial :**
```
1. CPAS Ganshoren
2. Nouveau bénéficiaire
3. Le Relais Social
4. CPAS Molenbeek
```

**Action :** Supprimer "Nouveau bénéficiaire"

**Résultat :**
```
1. CPAS Ganshoren
3. Le Relais Social     ← Trou dans la numérotation !
4. CPAS Molenbeek
```

**💡 Solution :** Pas de problème ! L'affichage reste correct. Si vous voulez des numéros consécutifs, utilisez le drag-and-drop pour réorganiser.

## 🚨 **Ce qui pourrait mal se passer**

### **Problème 1 : Ordres dupliqués (AVANT la migration SQL)**

**Symptôme :** Deux éléments avec le même ordre
```
1. Élément A (ordre: 1)
2. Élément B (ordre: 1) ← Doublon !
3. Élément C (ordre: 2)
```

**Conséquence :** Affichage imprévisible de A et B

**Solution :**
1. Appliquer la migration SQL `prevent-duplicate-ordre.sql`
2. Réorganiser manuellement avec le drag-and-drop

### **Problème 2 : Ordre négatif ou nul**

**Symptôme :** Un élément avec `ordre = 0` ou négatif

**Conséquence :** L'élément apparaît en premier (ordre croissant)

**Solution :** Réorganiser avec le drag-and-drop

## 🎨 **Interface utilisateur**

### **Indicateurs visuels**

- **Poignée `⋮⋮`** : Permet de déplacer l'élément
- **"Ordre: X"** : Affiche l'ordre actuel de l'élément
- **Placeholder "Déposer ici"** : Indique où l'élément va être placé

### **Messages de confirmation**

- ✅ **"Élément créé avec succès !"** : Nouvel élément ajouté
- ✅ **"Ordre mis à jour avec succès !"** : Drag-and-drop réussi
- ✅ **"Élément supprimé avec succès !"** : Suppression réussie

## 📚 **Références**

- **Fichier principal** : `admin/src/app/components/edit/edit.ts`
- **Service** : `admin/src/app/services/beneficiaire.ts`
- **Migration SQL** : `admin/prevent-duplicate-ordre.sql`
- **Correction des ordres** : `admin/fix-order.sql`

## 🎯 **Résumé**

| Situation                    | Ordre attribué           | Action utilisateur     |
| ---------------------------- | ------------------------ | ---------------------- |
| Nouvel élément               | Max + 1 (automatique)    | Aucune                 |
| Modification d'un élément    | Conservé                 | Aucune                 |
| Drag-and-drop                | Recalculé automatiquement| Glisser-déposer        |
| Suppression                  | Les autres conservés     | Réorganiser si besoin  |
| Protection contre doublons   | Contrainte SQL           | Appliquer la migration |

---

**Date de création** : 9 octobre 2025
**Dernière mise à jour** : 9 octobre 2025

