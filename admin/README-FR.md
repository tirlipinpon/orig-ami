# Application Admin Angular avec Supabase Auth

## Description

Cette application Angular comprend un système d'authentification complet avec **Supabase** :

- ✅ Authentification avec **Supabase Auth**
- ✅ Page de connexion avec email et mot de passe
- ✅ Guard d'authentification sur les routes protégées
- ✅ Page d'édition accessible uniquement après authentification
- ✅ Gestion de session avec Supabase (tokens JWT)
- ✅ Système de déconnexion sécurisé
- ✅ Écoute en temps réel des changements d'état d'authentification

## Structure du Projet

```
admin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/          # Composant de connexion
│   │   │   │   ├── login.ts
│   │   │   │   ├── login.html
│   │   │   │   └── login.css
│   │   │   └── edit/           # Composant d'édition (protégé)
│   │   │       ├── edit.ts
│   │   │       ├── edit.html
│   │   │       └── edit.css
│   │   ├── services/
│   │   │   ├── auth.ts         # Service d'authentification
│   │   │   └── supabase.ts     # Service Supabase
│   │   ├── guards/
│   │   │   └── auth-guard.ts   # Guard de protection des routes
│   │   ├── app.routes.ts       # Configuration des routes
│   │   └── app.ts              # Composant racine
│   ├── environments/
│   │   ├── environment.ts      # Configuration Supabase
│   │   └── environment.development.ts
│   └── ...
├── SUPABASE-SETUP.md           # Guide de configuration Supabase
└── ...
```

## ⚙️ Configuration Supabase (IMPORTANT)

**Avant de démarrer l'application**, vous devez configurer Supabase :

### 1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet

### 2. Récupérer vos clés API

1. Dans votre projet Supabase : **Settings** > **API**
2. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key**

### 3. Configurer l'application

Ouvrez `src/environments/environment.ts` et remplacez :

```typescript
export const environment = {
  production: false,
  supabase: {
    url: "VOTRE_SUPABASE_URL", // ⬅️ Remplacez ici
    anonKey: "VOTRE_SUPABASE_ANON_KEY", // ⬅️ Remplacez ici
  },
};
```

Faites de même pour `src/environments/environment.development.ts`.

### 4. Créer un utilisateur de test

Dans Supabase :

1. **Authentication** > **Users** > **Add user**
2. Créez un utilisateur avec email et mot de passe

📖 **Guide détaillé** : Consultez [SUPABASE-SETUP.md](./SUPABASE-SETUP.md) pour plus d'informations.

## Installation et Démarrage

### 1. Installation des dépendances

```bash
cd admin
npm install
```

### 2. Lancer le serveur de développement

```bash
ng serve
```

### 3. Accéder à l'application

Ouvrez votre navigateur et accédez à : `http://localhost:4200`

## Utilisation

### Connexion

1. Vous serez automatiquement redirigé vers la page de connexion (`/login`)
2. Entrez l'email et le mot de passe d'un utilisateur créé dans Supabase
3. Cliquez sur "Se connecter"
4. ✅ L'authentification se fait via **Supabase Auth**

### Page d'édition

- Après connexion, vous serez redirigé vers la page d'édition (`/edit`)
- Cette page est protégée par une guard : si vous n'êtes pas connecté, vous serez redirigé vers `/login`
- Vous pouvez voir votre email de connexion en haut de la page
- Cliquez sur "Déconnexion" pour vous déconnecter

### Sécurité

La guard d'authentification protège automatiquement la route `/edit` :

- Si vous essayez d'accéder à `/edit` sans être connecté, vous serez redirigé vers `/login`
- Les tokens JWT sont gérés automatiquement par Supabase
- La session est stockée de manière sécurisée
- L'état d'authentification est synchronisé en temps réel

## Routes

| Route    | Description                              | Protégée            |
| -------- | ---------------------------------------- | ------------------- |
| `/`      | Redirection vers `/login`                | Non                 |
| `/login` | Page de connexion                        | Non                 |
| `/edit`  | Page d'édition                           | **Oui** (authGuard) |
| `/**`    | Toute autre route redirige vers `/login` | Non                 |

## Fonctionnalités Techniques

### Service Supabase (`Supabase`)

Service wrapper pour Supabase Client :

- `signIn(email, password)` : Connexion avec Supabase Auth
- `signUp(email, password)` : Inscription d'un nouvel utilisateur
- `signOut()` : Déconnexion
- `getCurrentUser()` : Récupère l'utilisateur actuel
- `getSession()` : Récupère la session active
- `onAuthStateChange(callback)` : Écoute les changements d'état

### Service d'authentification (`Auth`)

Couche d'abstraction au-dessus de Supabase :

- `login(email, password)` : Authentifie l'utilisateur avec Supabase
- `logout()` : Déconnecte l'utilisateur
- `isLoggedIn()` : Vérifie si l'utilisateur est connecté (async)
- `isLoggedInSync()` : Vérification synchrone de l'état
- `getUserEmail()` : Récupère l'email de l'utilisateur connecté
- `getCurrentUser()` : Récupère l'objet User de Supabase
- `isAuthenticated$` : Observable pour suivre l'état de connexion
- `currentUser$` : Observable de l'utilisateur actuel

### Guard d'authentification (`authGuard`)

- Vérifie si l'utilisateur est connecté avant d'accéder à une route
- Vérifie la session Supabase de manière asynchrone
- Redirige vers `/login` si non authentifié
- Implémenté comme functional guard (Angular moderne)

## Technologies Utilisées

- **Angular** (dernière version standalone components)
- **TypeScript** avec typage strict
- **Supabase** pour l'authentification et le backend
- **@supabase/supabase-js** - Client JavaScript Supabase
- **RxJS** pour la gestion d'état réactive
- **Router Angular** avec functional guards
- **FormsModule** pour les formulaires réactifs
- **JWT tokens** gérés automatiquement par Supabase

## Notes pour la Production

✅ **Cette application utilise Supabase Auth** - une solution d'authentification prête pour la production.

### Checklist avant la mise en production :

**Sécurité :**

1. ✅ Tokens JWT gérés automatiquement par Supabase
2. ✅ Refresh tokens gérés par Supabase
3. ⚠️ Configurez HTTPS pour votre domaine
4. ⚠️ Configurez les URLs autorisées dans Supabase
5. ⚠️ Activez Row Level Security (RLS) sur vos tables
6. ⚠️ Ne jamais exposer la clé `service_role` côté client

**Configuration environnement :**

1. Créez un fichier `environment.prod.ts` avec vos credentials de production
2. Utilisez des variables d'environnement pour les secrets
3. Ajoutez `environment*.ts` au `.gitignore`

**Supabase en production :**

1. Passez à un plan payant si nécessaire
2. Configurez les politiques RLS pour vos tables
3. Configurez les templates d'emails personnalisés
4. Activez la confirmation d'email pour plus de sécurité
5. Configurez les redirections post-authentification
6. Surveillez les logs dans le dashboard Supabase

**Performance :**

1. Activez le SSR (Server-Side Rendering) si nécessaire
2. Optimisez les images avec `NgOptimizedImage`
3. Implémentez le lazy loading pour les modules
4. Configurez le cache approprié

## Commandes Utiles

```bash
# Démarrer le serveur de développement
ng serve

# Build de production
ng build --configuration production

# Exécuter les tests
ng test

# Générer un nouveau composant
ng generate component components/nom-du-composant

# Générer un nouveau service
ng generate service services/nom-du-service
```

## Support

Pour toute question ou problème, veuillez consulter la documentation officielle d'Angular :
https://angular.io/docs
