# Configuration Supabase pour l'application Admin

## Étape 1 : Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit (si vous n'en avez pas)
3. Créez un nouveau projet

## Étape 2 : Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Vous trouverez deux informations importantes :
   - **Project URL** : L'URL de votre projet (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** : Votre clé API publique

## Étape 3 : Configurer l'application Angular

### Option 1 : Configuration manuelle

Ouvrez le fichier `src/environments/environment.ts` et remplacez les valeurs :

```typescript
export const environment = {
  production: false,
  supabase: {
    url: "https://votre-projet.supabase.co",
    anonKey: "votre-clé-anonyme-ici",
  },
};
```

Faites de même pour `src/environments/environment.development.ts`.

### Option 2 : Utilisation de l'outil MCP (si disponible)

Si vous utilisez Cursor avec le MCP Supabase configuré, les clés seront automatiquement récupérées.

## Étape 4 : Configurer l'authentification dans Supabase

1. Dans votre projet Supabase, allez dans **Authentication** > **Providers**
2. Activez **Email** comme provider
3. Configurez les options selon vos besoins :
   - **Enable email confirmations** : Si vous voulez que les utilisateurs confirment leur email
   - **Secure email change** : Pour sécuriser les changements d'email

## Étape 5 : Créer un utilisateur de test

Vous avez deux options :

### Option A : Via l'interface Supabase

1. Allez dans **Authentication** > **Users**
2. Cliquez sur **Add user** > **Create new user**
3. Entrez un email et un mot de passe
4. Cliquez sur **Create user**

### Option B : Via l'application (inscription)

Pour activer l'inscription dans l'application, vous pouvez ajouter un composant de sign-up. Le service est déjà prêt avec la méthode `signUp()` dans `supabase.service.ts`.

## Étape 6 : Tester l'application

1. Lancez l'application : `ng serve`
2. Allez sur `http://localhost:4200`
3. Connectez-vous avec l'email et le mot de passe de l'utilisateur créé

## Structure de l'authentification

L'application utilise :

- **Supabase Auth** pour l'authentification
- **JWT tokens** automatiquement gérés par Supabase
- **Session persistence** dans le localStorage
- **Auth state listener** pour suivre les changements d'état

## Configuration avancée (optionnel)

### Personnaliser les emails

Dans Supabase Dashboard :

1. **Authentication** > **Email Templates**
2. Personnalisez les templates d'emails (confirmation, reset password, etc.)

### Politiques de sécurité

Dans **Authentication** > **Policies** :

- Configurez Row Level Security (RLS) pour vos tables
- Définissez qui peut accéder à quelles données

### Redirections

Dans **Authentication** > **URL Configuration** :

- Configurez les URLs de redirection après authentification
- Ajoutez votre domaine de production

## Dépannage

### Erreur : "Invalid API key"

- Vérifiez que vous avez bien copié la clé `anon/public` et non la `service_role`
- La clé `service_role` ne doit JAMAIS être exposée côté client

### Erreur : "Email not confirmed"

- Si vous avez activé la confirmation d'email, vérifiez l'email de l'utilisateur
- Désactivez temporairement cette option dans **Authentication** > **Providers** > **Email**

### Erreur de CORS

- Ajoutez votre URL locale (`http://localhost:4200`) dans les URLs autorisées
- **Authentication** > **URL Configuration** > **Redirect URLs**

## Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signup)
- [Angular + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-angular)

## Sécurité

⚠️ **Important** :

- Ne commitez JAMAIS vos clés dans Git
- Ajoutez `src/environments/environment*.ts` au `.gitignore` (sauf `.example`)
- En production, utilisez des variables d'environnement
- La clé `anon` est sûre côté client, mais protégez vos données avec RLS
