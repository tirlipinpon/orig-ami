# 🛡️ Validation des formulaires - Bénéficiaires et Donateurs

## 📋 **Vue d'ensemble**

Ce document explique comment fonctionne la validation des formulaires pour la création et la modification des bénéficiaires et donateurs.

## ✅ **Validation implémentée**

### **1. Nom**
- ✅ **Obligatoire** : Ne peut pas être vide
- ✅ **Longueur minimale** : 2 caractères
- ✅ **Longueur maximale** : 100 caractères
- ✅ **Espaces supprimés** : Les espaces avant/après sont automatiquement retirés

**Exemples valides :**
```
✅ "CPAS Ganshoren"
✅ "Le Relais Social"
✅ "AB"
```

**Exemples invalides :**
```
❌ ""                    → Le nom est obligatoire
❌ "A"                   → Le nom doit contenir au moins 2 caractères
❌ "   "                 → Le nom est obligatoire (espaces retirés)
❌ "Un nom très très..." → Le nom ne peut pas dépasser 100 caractères
```

### **2. URL**
- ✅ **Obligatoire** : Ne peut pas être vide
- ✅ **Format valide** : Doit être une URL complète
- ✅ **Protocole** : Doit commencer par `http://` ou `https://`
- ✅ **Espaces supprimés** : Les espaces avant/après sont automatiquement retirés

**Exemples valides :**
```
✅ "https://exemple.com"
✅ "http://www.exemple.be"
✅ "https://sous-domaine.exemple.org/page"
```

**Exemples invalides :**
```
❌ ""                           → L'URL est obligatoire
❌ "exemple.com"                → L'URL doit commencer par http:// ou https://
❌ "ftp://exemple.com"          → L'URL doit commencer par http:// ou https://
❌ "pas une url"                → L'URL n'est pas valide
❌ "https://"                   → L'URL n'est pas valide
```

### **3. Chemin de l'image**
- ✅ **Obligatoire** : Ne peut pas être vide
- ✅ **Extension** : Doit se terminer par `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, ou `.webp`
- ✅ **Espaces supprimés** : Les espaces avant/après sont automatiquement retirés

**Exemples valides :**
```
✅ "img/beneficiaire/logo.jpg"
✅ "img/beneficiaire/logo.png"
✅ "/assets/images/logo.svg"
✅ "https://cdn.example.com/logo.webp"
```

**Exemples invalides :**
```
❌ ""                           → Le chemin de l'image est obligatoire
❌ "img/logo"                   → Le chemin doit se terminer par une extension valide
❌ "img/logo.pdf"               → Extension non supportée
❌ "img/logo.bmp"               → Extension non supportée
```

### **4. Texte alternatif (alt_text)**
- ✅ **Obligatoire** : Ne peut pas être vide (important pour l'accessibilité)
- ✅ **Longueur minimale** : 3 caractères
- ✅ **Espaces supprimés** : Les espaces avant/après sont automatiquement retirés

**Exemples valides :**
```
✅ "Logo du CPAS de Ganshoren"
✅ "Partenaire Le Relais Social"
✅ "ABC"
```

**Exemples invalides :**
```
❌ ""                           → Le texte alternatif est obligatoire
❌ "AB"                         → Le texte alternatif doit contenir au moins 3 caractères
❌ "   "                        → Le texte alternatif est obligatoire
```

### **5. Titre (title)**
- ✅ **Obligatoire** : Ne peut pas être vide
- ✅ **Longueur minimale** : 3 caractères
- ✅ **Espaces supprimés** : Les espaces avant/après sont automatiquement retirés

**Exemples valides :**
```
✅ "Site officiel du CPAS de Ganshoren"
✅ "En savoir plus sur Le Relais Social"
✅ "ABC"
```

**Exemples invalides :**
```
❌ ""                           → Le titre est obligatoire
❌ "AB"                         → Le titre doit contenir au moins 3 caractères
❌ "   "                        → Le titre est obligatoire
```

### **6. Largeur de l'image**
- ✅ **Obligatoire** : Ne peut pas être vide
- ✅ **Minimum** : 50 pixels
- ✅ **Maximum** : 500 pixels
- ✅ **Type** : Doit être un nombre entier

**Exemples valides :**
```
✅ 50
✅ 200
✅ 500
```

**Exemples invalides :**
```
❌ ""                           → La largeur est obligatoire
❌ 49                           → La largeur doit être entre 50 et 500 pixels
❌ 501                          → La largeur doit être entre 50 et 500 pixels
❌ "abc"                        → La largeur doit être un nombre
```

### **7. Ordre d'affichage**
- ✅ **Obligatoire** : Ne peut pas être vide
- ✅ **Minimum** : 1
- ✅ **Type** : Doit être un nombre entier
- ✅ **Calculé automatiquement** : Pour les nouveaux éléments

**Exemples valides :**
```
✅ 1
✅ 2
✅ 100
```

**Exemples invalides :**
```
❌ ""                           → L'ordre d'affichage est obligatoire
❌ 0                            → L'ordre doit être supérieur ou égal à 1
❌ -1                           → L'ordre doit être supérieur ou égal à 1
❌ "abc"                        → L'ordre doit être un nombre
```

### **8. Type**
- ✅ **Obligatoire** : Ne peut pas être vide
- ✅ **Valeurs possibles** : `"beneficiaire"` ou `"donateur"`
- ✅ **Défini automatiquement** : Selon le formulaire ouvert

**Exemples valides :**
```
✅ "beneficiaire"
✅ "donateur"
```

**Exemples invalides :**
```
❌ ""                           → Le type est obligatoire
❌ "autre"                      → Le type doit être "beneficiaire" ou "donateur"
```

## 🎨 **Feedback visuel**

### **Validation en temps réel**

Les champs sont validés visuellement pendant la saisie :

1. **Champ vide** : Bordure grise (neutre)
2. **Champ invalide** : Bordure rouge + fond rose clair
3. **Champ valide** : Bordure verte
4. **Focus** : Bordure bleue + ombre bleue

### **Messages d'erreur**

Quand vous cliquez sur "Créer" ou "Mettre à jour", si la validation échoue :

```
⚠️ [Message d'erreur détaillé]
```

Les messages d'erreur sont affichés en rouge dans une alerte en haut du formulaire.

**Exemples de messages :**
- ⚠️ Le nom est obligatoire
- ⚠️ L'URL n'est pas valide (format attendu: https://exemple.com)
- ⚠️ Le chemin de l'image doit se terminer par une extension valide (.jpg, .png, .gif, .svg, .webp)
- ⚠️ Le texte alternatif est obligatoire (important pour l'accessibilité)
- ⚠️ La largeur de l'image doit être entre 50 et 500 pixels

## 🔧 **Fonctionnement technique**

### **Validation côté client (HTML)**

Les champs ont des attributs de validation HTML5 :

```html
<input 
  type="text" 
  required 
  placeholder="Nom du bénéficiaire"
  [(ngModel)]="formData.nom">

<input 
  type="url" 
  required 
  placeholder="https://exemple.com"
  [(ngModel)]="formData.url">

<input 
  type="number" 
  required 
  min="50" 
  max="500"
  [(ngModel)]="formData.image_width">
```

### **Validation côté TypeScript**

La méthode `validateFormData()` effectue des validations plus strictes :

```typescript
private validateFormData(): string | null {
  // Validation du nom
  if (!this.formData.nom || this.formData.nom.trim() === '') {
    return 'Le nom est obligatoire';
  }
  
  // Validation de l'URL
  try {
    const url = new URL(this.formData.url.trim());
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'L\'URL doit commencer par http:// ou https://';
    }
  } catch {
    return 'L\'URL n\'est pas valide';
  }
  
  // ... autres validations
  
  return null; // Pas d'erreur
}
```

### **Nettoyage des données**

Avant la sauvegarde, les espaces sont automatiquement supprimés :

```typescript
this.formData.nom = this.formData.nom.trim();
this.formData.url = this.formData.url.trim();
this.formData.image_url = this.formData.image_url.trim();
this.formData.alt_text = this.formData.alt_text.trim();
this.formData.title = this.formData.title.trim();
```

## 📊 **Exemples de scénarios**

### **Scénario 1 : Formulaire vide**

**Action :** Cliquer sur "Créer" sans remplir les champs

**Résultat :**
```
⚠️ Le nom est obligatoire
```

**Solution :** Remplir le champ "Nom"

### **Scénario 2 : URL invalide**

**Action :** Entrer `exemple.com` dans le champ URL

**Résultat :**
```
⚠️ L'URL n'est pas valide (format attendu: https://exemple.com)
```

**Solution :** Entrer `https://exemple.com`

### **Scénario 3 : Image sans extension**

**Action :** Entrer `img/logo` dans le champ "Chemin de l'image"

**Résultat :**
```
⚠️ Le chemin de l'image doit se terminer par une extension valide (.jpg, .png, .gif, .svg, .webp)
```

**Solution :** Entrer `img/logo.jpg`

### **Scénario 4 : Largeur hors limites**

**Action :** Entrer `600` dans le champ "Largeur de l'image"

**Résultat :**
```
⚠️ La largeur de l'image doit être entre 50 et 500 pixels
```

**Solution :** Entrer une valeur entre 50 et 500

### **Scénario 5 : Tous les champs valides**

**Action :** Remplir tous les champs correctement

**Résultat :**
```
✅ Élément créé avec succès !
```

Le formulaire se ferme automatiquement après 1,5 secondes.

## 🛡️ **Sécurité**

### **Protection contre les injections**

- ✅ **HTML** : Les données sont automatiquement échappées par Angular
- ✅ **SQL** : Supabase utilise des requêtes préparées
- ✅ **XSS** : Les données sont sanitisées par Angular

### **Protection contre les données malveillantes**

- ✅ **Longueur maximale** : Limite à 100 caractères pour le nom
- ✅ **Format URL** : Validation stricte du format
- ✅ **Extension image** : Liste blanche d'extensions autorisées
- ✅ **Plage de valeurs** : Limites min/max pour la largeur et l'ordre

## 🎯 **Résumé des règles**

| Champ             | Obligatoire | Min | Max | Format                                           |
| ----------------- | ----------- | --- | --- | ------------------------------------------------ |
| Nom               | ✅          | 2   | 100 | Texte                                            |
| URL               | ✅          | -   | -   | http:// ou https://                              |
| Chemin image      | ✅          | -   | -   | .jpg, .jpeg, .png, .gif, .svg, .webp             |
| Texte alternatif  | ✅          | 3   | -   | Texte                                            |
| Titre             | ✅          | 3   | -   | Texte                                            |
| Largeur image     | ✅          | 50  | 500 | Nombre entier                                    |
| Ordre affichage   | ✅          | 1   | -   | Nombre entier (calculé auto pour nouveaux items) |
| Type              | ✅          | -   | -   | "beneficiaire" ou "donateur"                     |

---

**Date de création** : 9 octobre 2025
**Dernière mise à jour** : 9 octobre 2025

