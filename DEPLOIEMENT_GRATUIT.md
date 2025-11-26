# 🆓 Déploiement 100% GRATUIT - Guide Complet

## ✅ Toutes les solutions sont GRATUITES

- ✅ **GitHub Pages** : Frontend GRATUIT (illimité)
- ✅ **Supabase** : Base de données PostgreSQL GRATUIT (500 MB, suffisant pour commencer)
- ✅ **Render** : Backend GRATUIT (avec limitations mais fonctionnel)

**AUCUN COÛT, AUCUN PAIEMENT REQUIS !**

---

## 📋 Étape 1 : Base de données PostgreSQL GRATUITE (Supabase)

### Pourquoi Supabase ?
- ✅ **100% GRATUIT** pour commencer
- ✅ 500 MB de stockage (suffisant pour des milliers d'utilisateurs)
- ✅ Pas besoin de carte bancaire
- ✅ Facile à utiliser

### Comment créer :

1. Allez sur : **https://supabase.com**
2. Cliquez sur **"Start your project"** → **"Sign up"**
3. Créez votre compte (avec GitHub c'est plus rapide)
4. Cliquez sur **"New Project"**
5. Remplissez :
   - **Name** : `enfants-adam-eve`
   - **Database Password** : Créez un mot de passe fort (notez-le !)
   - **Region** : `Europe West` (ou le plus proche)
   - Cliquez sur **"Create new project"**

6. **Attendez 2 minutes** que le projet soit créé

7. **Récupérez les informations** :
   - Allez dans **Settings** (⚙️) → **Database**
   - Dans "Connection string", choisissez **"URI"**
   - **Notez ces informations** :
     - **Host** : `db.xxxxx.supabase.co`
     - **Port** : `5432`
     - **Database** : `postgres`
     - **User** : `postgres.xxxxx`
     - **Password** : (celui que vous avez créé)

✅ **Base de données GRATUITE prête !**

---

## 🚀 Étape 2 : Déployer le Backend GRATUIT (Render)

### Pourquoi Render ?
- ✅ **Plan GRATUIT** disponible
- ✅ Pas besoin de carte bancaire pour le plan gratuit
- ✅ 750 heures gratuites par mois (suffisant)
- ✅ Le service se met en veille après 15 min d'inactivité (mais se réveille automatiquement)

### Comment créer :

1. Allez sur : **https://render.com**
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec **GitHub**
4. Cliquez sur **"New +"** → **"Web Service"**
5. Connectez votre dépôt : **Les-enfants-d-Adam**
6. Configuration :
   - **Name** : `enfants-adam-backend`
   - **Region** : `Frankfurt` (ou le plus proche)
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : **Free** (GRATUIT)

7. **Variables d'environnement** :
   ```
   NODE_ENV = production
   DB_HOST = db.xxxxx.supabase.co
   DB_PORT = 5432
   DB_NAME = postgres
   DB_USER = postgres.xxxxx
   DB_PASSWORD = votre_mot_de_passe_supabase
   JWT_SECRET = votre_secret_tres_securise_123456789
   JWT_EXPIRE = 7d
   CORS_ORIGIN = https://kadiatoubarry1541.github.io
   ```

8. Cliquez sur **"Create Web Service"**
9. **Attendez 5-10 minutes**
10. Notez l'URL : `https://enfants-adam-backend.onrender.com`

✅ **Backend GRATUIT déployé !**

**Note** : Le service peut prendre 30 secondes à démarrer après 15 min d'inactivité. C'est normal et gratuit !

---

## 🎨 Étape 3 : Déployer le Frontend GRATUIT (GitHub Pages)

### Pourquoi GitHub Pages ?
- ✅ **100% GRATUIT** (inclus avec GitHub)
- ✅ Pas de limite de bande passante
- ✅ Pas besoin de carte bancaire
- ✅ Déploiement automatique depuis GitHub

### Comment créer :

1. **Préparer le frontend pour GitHub Pages** :

   Créez un fichier `frontend/vite.config.ts` (ou modifiez-le) :

   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/Les-enfants-d-Adam/', // Nom de votre dépôt GitHub
   })
   ```

2. **Créer un workflow GitHub Actions** :

   Créez le fichier `.github/workflows/deploy.yml` :

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main
     workflow_dispatch:

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: |
             cd frontend
             npm install

         - name: Build
           run: |
             cd frontend
             npm run build
           env:
             VITE_API_URL: ${{ secrets.VITE_API_URL }}

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./frontend/dist
   ```

3. **Configurer les secrets GitHub** :

   - Allez sur votre dépôt GitHub : `https://github.com/kadiatoubarry1541/Les-enfants-d-Adam`
   - Cliquez sur **Settings** → **Secrets and variables** → **Actions**
   - Cliquez sur **"New repository secret"**
   - Nom : `VITE_API_URL`
   - Valeur : `https://enfants-adam-backend.onrender.com/api`
   - Cliquez sur **"Add secret"**

4. **Activer GitHub Pages** :

   - Allez dans **Settings** → **Pages**
   - **Source** : Sélectionnez **"GitHub Actions"**
   - Sauvegardez

5. **Déclencher le déploiement** :

   - Allez dans l'onglet **Actions** de votre dépôt
   - Cliquez sur **"Deploy to GitHub Pages"**
   - Cliquez sur **"Run workflow"**

6. **Attendez 2-3 minutes**

7. Votre site sera disponible à : `https://kadiatoubarry1541.github.io/Les-enfants-d-Adam/`

✅ **Frontend GRATUIT déployé sur GitHub Pages !**

---

## 🔧 Étape 4 : Configuration finale

### Mettre à jour le CORS du backend

1. Retournez sur **Render** → votre service backend
2. Allez dans **"Environment"**
3. Modifiez `CORS_ORIGIN` :
   ```
   CORS_ORIGIN = https://kadiatoubarry1541.github.io
   ```
4. Cliquez sur **"Save Changes"**

---

## ✅ Résumé - TOUT EST GRATUIT

| Service | Coût | Limite |
|---------|------|--------|
| **GitHub Pages** | 🆓 GRATUIT | Illimité |
| **Supabase** | 🆓 GRATUIT | 500 MB (suffisant) |
| **Render** | 🆓 GRATUIT | 750h/mois (suffisant) |

**AUCUN PAIEMENT REQUIS !**

---

## 🎉 URLs finales

- **Frontend** : `https://kadiatoubarry1541.github.io/Les-enfants-d-Adam/`
- **Backend** : `https://enfants-adam-backend.onrender.com`
- **GitHub** : `https://github.com/kadiatoubarry1541/Les-enfants-d-Adam`

---

## 🆘 Problèmes courants

### Le backend Render est lent au démarrage
- C'est normal ! Après 15 min d'inactivité, il se met en veille
- Il se réveille automatiquement en 30 secondes
- C'est gratuit, donc c'est normal

### GitHub Pages ne se met pas à jour
- Vérifiez que le workflow GitHub Actions a réussi
- Vérifiez que `VITE_API_URL` est bien configuré dans les secrets
- Attendez 2-3 minutes après le push

---

## 💡 Alternative : Si vous voulez éviter le délai de démarrage de Render

Vous pouvez utiliser **Railway** (aussi gratuit) qui ne se met pas en veille :
- Allez sur : https://railway.app
- Créez un compte (gratuit)
- Connectez GitHub
- Créez un nouveau projet depuis le dépôt
- Configurez les variables d'environnement
- C'est aussi GRATUIT !

---

**Tout est GRATUIT, aucun paiement requis ! 🎉**

