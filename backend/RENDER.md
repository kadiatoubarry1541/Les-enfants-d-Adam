# Déploiement sur Render

## Connexion en ligne qui échoue (« NumeroH ou mot de passe incorrect »)

Si la connexion fonctionne en local mais pas sur https://les-enfants-d-adam.onrender.com, vérifier dans l’ordre :

### 1. Le front appelle bien le backend Render

Le **site statique** (Les-enfants-d-Adam) doit connaître l’URL de l’API. Lors du **build** sur Render, la variable `VITE_API_URL` est intégrée au code.

- Render Dashboard → service **Les-enfants-d-Adam** (Static Site) → **Environment**.
- Ajouter une variable :
  - **Key :** `VITE_API_URL`
  - **Value :** `https://enfants-adam-backend.onrender.com/api`
- Enregistrer puis **redéployer** le site (Déploiement manuel → Déployer le dernier commit ou « Vider le cache et déployer »).

Sans cette variable, le site appelle `http://localhost:5002` et la connexion échoue en production.

### 2. NumeroH : utiliser le chiffre 0, pas la lettre O

Le NumeroH est sensible à l’orthographe. Exemple pour l’admin :

- Correct : `G0C0P0R0E0F0 0` (chiffre **zéro** partout).
- Incorrect : `GOCOPOROEOFO 0` (lettre **O**).

En cas de doute, copier-coller le NumeroH depuis l’email ou l’écran d’inscription.

### 3. Utilisateur présent dans la base en ligne (Neon)

Si le compte a été créé **uniquement en local**, il n’existe pas encore dans la base Neon utilisée par Render. Il faut synchroniser :

```bash
cd backend
npm run db:sync-render
```

Cela copie la base locale vers Neon. Ensuite, refaire une tentative de connexion sur le site en ligne.

### 4. Backend Render : admin et CORS

- **Backend** (enfants-adam-backend) → **Environment** :
  - `ADMIN_PASSWORD` = mot de passe de l’admin (obligatoire pour que le compte admin soit créé).
  - `ADMIN_NUMERO_H` = `G0C0P0R0E0F0 0` (optionnel, c’est le défaut).
  - `CORS_ORIGIN` = `https://les-enfants-d-adam.onrender.com` (URL du site statique).

Après toute modification des variables, redéployer le service concerné.

---

## Connexion admin (obligatoire sur Render)

Pour te connecter en **admin** sur le site déployé (Render), il faut définir ces variables d’environnement dans le **Dashboard Render** → ton service backend → **Environment** :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `ADMIN_PASSWORD` | Mot de passe du compte admin | Le mot de passe que tu choisis pour te connecter |
| `ADMIN_NUMERO_H` | (optionnel) NumeroH de l’admin | Par défaut : `G0C0P0R0E0F0 0` |

- **Identifiant de connexion** : `G0C0P0R0E0F0 0` (ou la valeur de `ADMIN_NUMERO_H` si tu l’as changée).
- **Mot de passe** : exactement la valeur de `ADMIN_PASSWORD`.

Au **premier démarrage** du backend sur Render, le compte admin est créé ou mis à jour automatiquement avec ce mot de passe. Sans `ADMIN_PASSWORD`, le compte admin n’existe pas sur la base Render et tu obtiens « NumeroH ou mot de passe incorrect ».

## Souder la base locale et la base Render (même contenu)

Pour que la base de données **sur Render** contienne les mêmes données que ta base **locale** (utilisateurs, admin, etc.) :

### 1. Prérequis

- PostgreSQL installé en local (avec `pg_dump` et `psql` dans le PATH).
- Sur Windows : après installation de PostgreSQL, ajoute au PATH le dossier `bin`, par ex. `C:\Program Files\PostgreSQL\15\bin`.

### 2. Exporter la base locale

Depuis la racine du projet (ou depuis `backend/`) :

```bash
cd backend
npm run db:export
```

Un fichier est créé dans `backend/dumps/local-backup-YYYY-MM-DD-HHmm.sql`. Ce dossier n’est **pas** poussé sur GitHub (il est dans `.gitignore`).

### 3. Récupérer l’URL de la base Render

- Render Dashboard → ton service **PostgreSQL** (base de données) → **Info** / **Connection**.
- Copie l’**Internal Database URL** (ou **External** si tu exécutes la commande depuis ton PC).

### 4. Importer vers la base Render

Sur ton PC, en une seule ligne (remplace par ta vraie URL) :

**Windows (PowerShell) :**

```powershell
cd backend
$env:RENDER_DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
npm run db:push-render
```

**Windows (cmd) :**

```cmd
cd backend
set RENDER_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
npm run db:push-render
```

**Git Bash / Linux / Mac :**

```bash
cd backend
export RENDER_DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
npm run db:push-render
```

Tu peux aussi mettre `RENDER_DATABASE_URL` dans ton `config.env` (sans le commiter) et lancer seulement `npm run db:push-render`.

Après l’import, la base Render a le même contenu que ta base locale (tables, utilisateurs, admin). Tu peux refaire ces étapes à chaque fois que tu veux “synchroniser” local → Render.

---

## Autres variables utiles

- `DATABASE_URL` ou `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` : connexion PostgreSQL (souvent fournie par Render si tu ajoutes une base PostgreSQL).
- `JWT_SECRET` : secret pour les tokens (à définir en production).
- `FRONTEND_URL` ou `CORS_ORIGIN` : URL de ton front (ex. `https://ton-site.onrender.com`) pour CORS.
