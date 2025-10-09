# Guide - Drag & Drop et Nouvel Élément en Premier

## ✨ Fonctionnalités ajoutées

### 1. **Drag & Drop** 🖱️

Vous pouvez maintenant réorganiser les éléments par glisser-déposer !

#### Comment utiliser :

1. **Survolez** un élément → Vous verrez une poignée `⋮⋮` en haut à gauche
2. **Cliquez et maintenez** sur la poignée
3. **Glissez** l'élément vers sa nouvelle position
4. **Relâchez** pour déposer

#### Ce qui se passe :

- ✅ L'élément se déplace visuellement
- ✅ L'ordre est **automatiquement sauvegardé** dans Supabase
- ✅ Message de confirmation : "Ordre mis à jour avec succès !"
- ✅ Animation fluide pendant le déplacement

### 2. **Nouvel élément toujours en premier** 🆕

Quand vous créez un nouvel élément :

- ✅ Il apparaît **automatiquement en première position**
- ✅ Tous les autres éléments sont **décalés d'un cran**
- ✅ L'ordre est mis à jour pour tous
- ✅ Message : "Élément créé avec succès en première position !"

## 🎨 Interface visuelle

### Poignée de drag

```
┌─────────────────────────┐
│ ⋮⋮  ← Poignée de drag   │
│                         │
│    [Image du logo]      │
│                         │
│    Nom de l'élément     │
│    🔗 URL               │
│                         │
│  [✏️] [👁️] [🗑️]        │
└─────────────────────────┘
```

### États visuels

#### Normal

- Poignée : Fond gris clair
- Curseur : `grab` (main ouverte)

#### Au survol de la poignée

- Poignée : Fond violet (#667eea)
- Icône : Blanche
- Curseur : `grab`

#### Pendant le drag

- Carte : Opacité 0.8, rotation de 2°
- Ombre : Plus prononcée
- Curseur : `grabbing` (main fermée)
- Placeholder : Zone en pointillés violets

#### Après le drop

- Animation de retour fluide (250ms)
- Message de succès

## 🔧 Implémentation technique

### Angular CDK installé

```bash
npm install @angular/cdk
```

### Modules importés

```typescript
import { CdkDragDrop, moveItemInArray, DragDropModule } from "@angular/cdk/drag-drop";
```

### Directives utilisées

- `cdkDropList` : Conteneur des éléments draggables
- `cdkDrag` : Élément draggable
- `cdkDragHandle` : Poignée pour saisir l'élément
- `(cdkDropListDropped)` : Événement déclenché au drop

## 📊 Ordre d'affichage

### Ancien système

Les éléments étaient ajoutés **en dernier** :

```
Élément 1 (ordre: 1)
Élément 2 (ordre: 2)
Élément 3 (ordre: 3)
Nouvel élément (ordre: 4) ← Apparaît en bas
```

### Nouveau système

Les nouveaux éléments apparaissent **en premier** :

```
Nouvel élément (ordre: 0) ← Apparaît en haut
Élément 1 (ordre: 1)
Élément 2 (ordre: 2)
Élément 3 (ordre: 3)
```

Tous les ordres sont automatiquement recalculés.

## 🎯 Cas d'usage

### Scénario 1 : Ajouter un nouveau partenaire important

1. Cliquez sur "➕ Ajouter un donateur"
2. Remplissez le formulaire
3. Sauvegardez
4. ✅ Le nouveau partenaire apparaît **en premier** dans la liste

### Scénario 2 : Réorganiser les bénéficiaires par importance

1. Trouvez l'élément à déplacer
2. Cliquez sur la poignée `⋮⋮`
3. Glissez vers le haut ou le bas
4. Relâchez à la position souhaitée
5. ✅ L'ordre est sauvegardé automatiquement

### Scénario 3 : Mettre un partenaire en vedette

1. Trouvez le partenaire dans la liste
2. Glissez-le tout en haut
3. ✅ Il apparaîtra en premier sur le site web

## 🔄 Flux de sauvegarde

### Lors de la création

```
1. Utilisateur crée un élément
   ↓
2. Ordre = 0 (premier)
   ↓
3. Élément inséré dans la BDD
   ↓
4. Tous les autres éléments +1
   ↓
5. Rechargement des données
   ↓
6. Nouvel élément apparaît en premier
```

### Lors du drag & drop

```
1. Utilisateur déplace un élément
   ↓
2. Réorganisation visuelle (local)
   ↓
3. Calcul des nouveaux ordres
   ↓
4. Mise à jour en parallèle dans Supabase
   ↓
5. Message de succès
```

## 💡 Optimisations

### Performance

- ✅ Mise à jour en parallèle avec `Promise.all()`
- ✅ Pas de rechargement complet après drag & drop
- ✅ Animation CSS hardware-accelerated

### UX

- ✅ Feedback visuel immédiat
- ✅ Placeholder pendant le drag
- ✅ Animation de retour fluide
- ✅ Messages de confirmation

## 🐛 Dépannage

### Le drag ne fonctionne pas

➡️ Vérifiez que Angular CDK est installé :

```bash
npm list @angular/cdk
```

### Les ordres ne se sauvegardent pas

➡️ Vérifiez les politiques RLS dans Supabase :

- Les utilisateurs authentifiés doivent avoir les droits UPDATE

### La poignée n'apparaît pas

➡️ Vérifiez les styles CSS :

- Le `.drag-handle` doit être visible
- Z-index : 10

### L'élément ne reste pas à sa nouvelle position

➡️ Vérifiez que la méthode `updateOrdres()` est appelée :

- Regardez les logs de la console
- Vérifiez les erreurs Supabase

## 🎨 Personnalisation

### Changer l'icône de la poignée

```css
.drag-icon {
  font-size: 18px;
  /* Remplacez ⋮⋮ par votre icône */
}
```

### Changer la couleur de la poignée

```css
.drag-handle:hover {
  background: #your-color; /* Au lieu de #667eea */
}
```

### Changer l'animation du drag

```css
.item-card.cdk-drag-preview {
  transform: rotate(5deg); /* Au lieu de 2deg */
  opacity: 0.9; /* Au lieu de 0.8 */
}
```

## 📱 Responsive

Le drag & drop fonctionne aussi sur mobile :

- Touch events pris en charge
- Feedback visuel adapté
- Même comportement qu'au desktop

## 🔐 Sécurité

Les mises à jour d'ordre nécessitent :

- ✅ Authentification Supabase
- ✅ Token JWT valide
- ✅ Politiques RLS actives

## ✅ Checklist de fonctionnement

- [ ] Angular CDK installé
- [ ] DragDropModule importé dans le composant
- [ ] Directives CDK dans le HTML
- [ ] Méthodes drop() implémentées
- [ ] Styles CSS ajoutés
- [ ] Politiques RLS configurées
- [ ] Tests de drag & drop effectués
- [ ] Nouveaux éléments apparaissent en premier

Tout fonctionne ! 🎉
