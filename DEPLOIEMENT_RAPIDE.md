# ⚡ Déploiement Rapide - Guide Express (15 minutes)

## 🎯 Objectif
Déployer votre projet en ligne rapidement pour le hackathon.

---

## 📝 Étape 1 : Base de données PostgreSQL (5 minutes)

### Créer un compte Supabase (GRATUIT)

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
   - Vous verrez quelque chose comme :
     ```
     postgresql://postgres.xxxxx:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
     ```
   - **Notez ces informations** :
     - **Host** : `db.xxxxx.supabase.co`
     - **Port** : `5432`
     - **Database** : `postgres`
     - **User** : `postgres.xxxxx`
     - **Password** : (celui que vous avez créé)

✅ **Base de données prête !**

---

## 🚀 Étape 2 : Déployer le Backend sur Render (5 minutes)

### Créer un compte Render

1. Allez sur : **https://render.com**
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec **GitHub** (plus rapide)
4. Autorisez Render à accéder à vos dépôts

### Créer le Web Service

1. Cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt : **Les-enfants-d-Adam**
3. Configuration :
   - **Name** : `enfants-adam-backend`
   - **Region** : `Frankfurt` (ou le plus proche)
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : **Free**

4. **Variables d'environnement** (cliquez sur "Advanced") :
   Cliquez sur "Add Environment Variable" et ajoutez :

   ```
   NODE_ENV = production
   ```
   
   ```
   DB_HOST = db.xxxxx.supabase.co
   ```
   (remplacez par votre host Supabase)
   
   ```
   DB_PORT = 5432
   ```
   
   ```
   DB_NAME = postgres
   ```
   
   ```
   DB_USER = postgres.xxxxx
   ```
   (remplacez par votre user Supabase)
   
   ```
   DB_PASSWORD = votre_mot_de_passe_supabase
   ```
   (remplacez par votre password Supabase)
   
   ```
   JWT_SECRET = votre_secret_tres_securise_123456789
   ```
   (créez un secret aléatoire)
   
   ```
   JWT_EXPIRE = 7d
   ```
   
   ```
   CORS_ORIGIN = https://votre-frontend.vercel.app
   ```
   (on mettra à jour après le déploiement du frontend)

5. Cliquez sur **"Create Web Service"**
6. **Attendez 5-10 minutes** que le déploiement se termine
7. Notez l'URL : `https://enfants-adam-backend.onrender.com`

✅ **Backend déployé !**

---

## 🎨 Étape 3 : Déployer le Frontend sur Vercel (5 minutes)

### Créer un compte Vercel

1. Allez sur : **https://vercel.com**
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec **GitHub**

### Importer le projet

1. Cliquez sur **"Add New..."** → **"Project"**
2. Importez : **Les-enfants-d-Adam**
3. Configuration :
   - **Framework Preset** : `Vite`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

4. **Variables d'environnement** :
   Cliquez sur "Environment Variables" et ajoutez :

   ```
   VITE_API_URL = https://enfants-adam-backend.onrender.com/api
   ```
   (remplacez par l'URL de votre backend Render)

5. Cliquez sur **"Deploy"**
6. **Attendez 2-3 minutes**
7. Notez l'URL : `https://votre-projet.vercel.app`

✅ **Frontend déployé !**

---

## 🔧 Étape 4 : Configuration finale (2 minutes)

### Mettre à jour le CORS du backend

1. Retournez sur **Render** → votre service backend
2. Allez dans **"Environment"**
3. Modifiez `CORS_ORIGIN` :
   ```
   CORS_ORIGIN = https://votre-projet.vercel.app
   ```
   (remplacez par l'URL de votre frontend Vercel)

4. Cliquez sur **"Save Changes"**
5. Render redéploiera automatiquement

### Mettre à jour l'URL de l'API dans le frontend (si nécessaire)

1. Retournez sur **Vercel** → votre projet
2. Allez dans **"Settings"** → **"Environment Variables"**
3. Vérifiez que `VITE_API_URL` est correct
4. Si vous l'avez modifié, allez dans **"Deployments"** et cliquez sur **"Redeploy"**

---

## ✅ Test final

1. Visitez votre frontend : `https://votre-projet.vercel.app`
2. Testez l'inscription d'un utilisateur
3. Testez la connexion
4. Vérifiez que les données se sauvegardent

---

## 🎉 Félicitations !

Votre projet est maintenant en ligne et accessible pour le hackathon ! 🚀

### URLs à partager :

- **Frontend** : `https://votre-projet.vercel.app`
- **Backend** : `https://enfants-adam-backend.onrender.com`
- **GitHub** : `https://github.com/kadiatoubarry1541/Les-enfants-d-Adam`

---

## 🆘 Problèmes courants

### Le backend ne démarre pas
- Vérifiez les **logs** dans Render
- Vérifiez que toutes les variables `DB_*` sont correctes
- Vérifiez que la base de données Supabase est bien créée

### Le frontend ne peut pas se connecter au backend
- Vérifiez que `VITE_API_URL` est correct dans Vercel
- Vérifiez que `CORS_ORIGIN` est correct dans Render
- Vérifiez que le backend est bien démarré (logs Render)

### Erreur de connexion à la base de données
- Vérifiez que les variables `DB_*` sont exactement comme dans Supabase
- Vérifiez que le mot de passe est correct
- Testez la connexion dans Supabase (SQL Editor)

---

## 📞 Besoin d'aide ?

Consultez le guide complet : `DEPLOIEMENT_COMPLET.md`

