# 🚀 Guide Complet de Déploiement - Plateforme Communautaire Guinéenne

Ce guide vous explique comment déployer votre projet en ligne pour qu'il soit accessible lors du hackathon.

---

## 📋 Table des matières

1. [Base de données PostgreSQL en ligne](#1-base-de-données-postgresql-en-ligne)
2. [Déploiement du Backend](#2-déploiement-du-backend)
3. [Déploiement du Frontend](#3-déploiement-du-frontend)
4. [Configuration finale](#4-configuration-finale)

---

## 1. Base de données PostgreSQL en ligne

### Option 1 : Supabase (⭐ RECOMMANDÉ - Gratuit et facile)

1. **Créer un compte** : https://supabase.com
2. **Créer un nouveau projet** :
   - Cliquez sur "New Project"
   - Nom : `enfants-adam-eve`
   - Mot de passe : Choisissez un mot de passe fort
   - Région : Choisissez la plus proche (Europe West recommandé)
   - Cliquez sur "Create new project"

3. **Récupérer les informations de connexion** :
   - Allez dans **Settings** → **Database**
   - Copiez les informations :
     - **Host** : `db.xxxxx.supabase.co`
     - **Port** : `5432`
     - **Database** : `postgres`
     - **User** : `postgres.xxxxx`
     - **Password** : (celui que vous avez créé)

4. **Tester la connexion** :
   - Utilisez l'éditeur SQL dans Supabase pour créer vos tables
   - Ou laissez Sequelize les créer automatiquement au premier démarrage

### Option 2 : Neon (Gratuit, PostgreSQL serverless)

1. **Créer un compte** : https://neon.tech
2. **Créer un projet** :
   - Cliquez sur "Create Project"
   - Nom : `enfants-adam-eve`
   - Région : Choisissez la plus proche
   - Cliquez sur "Create Project"

3. **Récupérer les informations** :
   - Dans le dashboard, copiez la **Connection String**
   - Format : `postgres://user:password@host:5432/database`

### Option 3 : Railway (Gratuit avec limite)

1. **Créer un compte** : https://railway.app
2. **Créer une base de données PostgreSQL** :
   - Cliquez sur "New Project"
   - Cliquez sur "Provision PostgreSQL"
   - Railway créera automatiquement la base de données

3. **Récupérer les variables** :
   - Cliquez sur votre base de données
   - Allez dans l'onglet "Variables"
   - Copiez : `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

---

## 2. Déploiement du Backend

### Option A : Render (⭐ RECOMMANDÉ - Gratuit)

1. **Créer un compte** : https://render.com
2. **Créer un nouveau Web Service** :
   - Cliquez sur "New" → "Web Service"
   - Connectez votre dépôt GitHub : `Les-enfants-d-Adam`
   - Configuration :
     - **Name** : `enfants-adam-backend`
     - **Root Directory** : `backend`
     - **Environment** : `Node`
     - **Build Command** : `npm install`
     - **Start Command** : `npm start`
     - **Plan** : Free

3. **Configurer les variables d'environnement** :
   - Dans "Environment Variables", ajoutez :
     ```
     NODE_ENV=production
     DB_HOST=votre_host_supabase
     DB_PORT=5432
     DB_NAME=postgres
     DB_USER=votre_user_supabase
     DB_PASSWORD=votre_password_supabase
     JWT_SECRET=votre_secret_jwt_tres_securise
     JWT_EXPIRE=7d
     CORS_ORIGIN=https://votre-frontend.vercel.app
     PORT=5002
     ```

4. **Déployer** :
   - Cliquez sur "Create Web Service"
   - Render va automatiquement déployer votre backend
   - Notez l'URL : `https://enfants-adam-backend.onrender.com`

### Option B : Railway (Gratuit avec limite)

1. **Créer un compte** : https://railway.app
2. **Créer un nouveau projet** :
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez `Les-enfants-d-Adam`
   - Railway détectera automatiquement le backend

3. **Configurer** :
   - Root Directory : `backend`
   - Start Command : `npm start`
   - Ajoutez les variables d'environnement (comme pour Render)

4. **Déployer** :
   - Railway déploiera automatiquement
   - Notez l'URL : `https://votre-projet.railway.app`

---

## 3. Déploiement du Frontend

### Option A : Vercel (⭐ RECOMMANDÉ - Gratuit et rapide)

1. **Créer un compte** : https://vercel.com
2. **Importer votre projet** :
   - Cliquez sur "Add New" → "Project"
   - Importez depuis GitHub : `Les-enfants-d-Adam`
   - Configuration :
     - **Framework Preset** : Vite
     - **Root Directory** : `frontend`
     - **Build Command** : `npm run build`
     - **Output Directory** : `dist`

3. **Configurer les variables d'environnement** :
   - Dans "Environment Variables", ajoutez :
     ```
     VITE_API_URL=https://votre-backend.onrender.com/api
     ```

4. **Déployer** :
   - Cliquez sur "Deploy"
   - Vercel déploiera automatiquement
   - Notez l'URL : `https://votre-projet.vercel.app`

### Option B : Netlify (Gratuit)

1. **Créer un compte** : https://netlify.com
2. **Importer votre projet** :
   - Cliquez sur "Add new site" → "Import an existing project"
   - Connectez GitHub et choisissez `Les-enfants-d-Adam`
   - Configuration :
     - **Base directory** : `frontend`
     - **Build command** : `npm run build`
     - **Publish directory** : `frontend/dist`

3. **Configurer les variables** :
   - Dans "Site settings" → "Environment variables"
   - Ajoutez : `VITE_API_URL=https://votre-backend.onrender.com/api`

4. **Déployer** :
   - Netlify déploiera automatiquement
   - Notez l'URL : `https://votre-projet.netlify.app`

---

## 4. Configuration finale

### Étape 1 : Mettre à jour le CORS du backend

Une fois votre frontend déployé, mettez à jour la variable `CORS_ORIGIN` dans Render/Railway avec l'URL de votre frontend.

### Étape 2 : Mettre à jour l'URL de l'API dans le frontend

Mettez à jour `VITE_API_URL` dans Vercel/Netlify avec l'URL de votre backend.

### Étape 3 : Tester

1. Visitez votre frontend déployé
2. Testez l'inscription/connexion
3. Vérifiez que les données se sauvegardent dans la base de données

---

## 🔧 Scripts utiles

### Créer un fichier de santé pour vérifier le backend

Créez `backend/src/routes/health.js` :

```javascript
import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

export default router;
```

Puis ajoutez dans `backend/src/server.js` :
```javascript
import healthRouter from './routes/health.js';
app.use('/api', healthRouter);
```

---

## 📝 Checklist de déploiement

- [ ] Base de données PostgreSQL créée (Supabase/Neon/Railway)
- [ ] Variables d'environnement configurées dans la base de données
- [ ] Backend déployé (Render/Railway)
- [ ] Variables d'environnement configurées dans le backend
- [ ] Frontend déployé (Vercel/Netlify)
- [ ] Variables d'environnement configurées dans le frontend
- [ ] CORS configuré correctement
- [ ] Test d'inscription/connexion réussi
- [ ] Test de création de données réussi

---

## 🆘 Résolution de problèmes

### Le backend ne démarre pas
- Vérifiez les logs dans Render/Railway
- Vérifiez que toutes les variables d'environnement sont configurées
- Vérifiez la connexion à la base de données

### Le frontend ne peut pas se connecter au backend
- Vérifiez que `VITE_API_URL` est correct
- Vérifiez que le CORS est configuré dans le backend
- Vérifiez que le backend est bien démarré

### Erreur de connexion à la base de données
- Vérifiez que les variables `DB_*` sont correctes
- Vérifiez que la base de données est accessible depuis l'extérieur
- Testez la connexion avec un client PostgreSQL

---

## 🎉 Félicitations !

Votre projet est maintenant en ligne et accessible pour le hackathon ! 🚀

**URLs à partager :**
- Frontend : `https://votre-projet.vercel.app`
- Backend : `https://votre-backend.onrender.com`
- GitHub : `https://github.com/kadiatoubarry1541/Les-enfants-d-Adam`

---

## 📞 Support

Si vous avez des problèmes, consultez :
- Documentation Supabase : https://supabase.com/docs
- Documentation Render : https://render.com/docs
- Documentation Vercel : https://vercel.com/docs

