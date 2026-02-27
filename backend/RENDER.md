# Déploiement sur Render

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
