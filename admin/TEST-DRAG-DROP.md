# Test du Drag & Drop - Guide de vérification

## 🔍 Problème identifié

Dans l'image fournie, on observait une incohérence :

- **"Le Relais Social"** affiché en première position mais avec l'ordre **2**
- **"CPAS Molenbeek"** affiché en position 8 mais avec l'ordre **1**

## ✅ Corrections apportées

### 1. Rechargement automatique après drag & drop

- Ajout de `await this.loadData()` après la mise à jour des ordres
- Garantit que l'interface reflète les changements de la base de données

### 2. Vérification automatique de cohérence

- Nouvelle fonction `verifierEtCorrigerOrdre()` qui s'exécute au chargement
- Détecte et corrige automatiquement les incohérences d'ordre

### 3. Logs de débogage

- Ajout de logs détaillés pour tracer les opérations de drag & drop
- Permet de diagnostiquer les problèmes en temps réel

## 🧪 Tests à effectuer

### Test 1 : Vérification de l'ordre initial

1. Ouvrir l'interface d'administration
2. Aller sur l'onglet "Bénéficiaires"
3. Vérifier que l'ordre affiché correspond à l'ordre de la base de données :
   - Position 1 : "Le Relais Social" (ordre 1)
   - Position 8 : "CPAS Molenbeek" (ordre 8)

### Test 2 : Drag & Drop simple

1. Glisser "CPAS Molenbeek" vers la première position
2. Vérifier que :
   - L'élément se place correctement en première position
   - L'ordre affiché se met à jour (ordre 1)
   - Les autres éléments se décalent automatiquement
   - L'ordre est sauvegardé en base de données

### Test 3 : Persistance après rechargement

1. Effectuer un drag & drop
2. Recharger la page (F5)
3. Vérifier que l'ordre est conservé

### Test 4 : Vérification des logs

1. Ouvrir la console du navigateur (F12)
2. Effectuer un drag & drop
3. Vérifier les logs :

   ```
   Drop bénéficiaire: {
     previousIndex: X,
     currentIndex: Y,
     previousItem: "Nom de l'élément",
     currentItem: "Nom de l'élément"
   }

   Mise à jour des ordres: [
     { nom: "...", ancienOrdre: X, nouveauOrdre: Y }
   ]
   ```

## 🐛 Dépannage

### Si l'ordre ne se met pas à jour

1. Vérifier la console pour des erreurs
2. Vérifier que les logs de drag & drop apparaissent
3. Vérifier la connexion à la base de données

### Si l'ordre n'est pas persistant

1. Vérifier que `loadData()` est appelé après `updateOrdres()`
2. Vérifier les logs de mise à jour des ordres
3. Vérifier la base de données directement

### Si le drag & drop ne fonctionne pas

1. Vérifier que `cdkDropListOrientation="horizontal"` est présent
2. Vérifier que les éléments ont bien `cdkDrag`
3. Vérifier que la poignée a bien `cdkDragHandle`

## 📊 Données de référence

Ordre actuel dans la base de données :

1. Le Relais Social
2. MBX
3. Opération Thermos (2)
4. Sentinelles de la Nuit
5. Source ASBL
6. CPAS de Verviers
7. Coeur SDF
8. CPAS Molenbeek
9. Un Toit Pour Toi
10. CPAS Ganshoren

## 🎯 Résultat attendu

Après les corrections :

- ✅ L'ordre affiché correspond à l'ordre de la base de données
- ✅ Le drag & drop fonctionne correctement
- ✅ Les changements sont persistants
- ✅ Les logs permettent de diagnostiquer les problèmes
- ✅ La correction automatique des incohérences fonctionne
