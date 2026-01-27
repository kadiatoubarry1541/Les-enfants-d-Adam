# 📋 Configuration Requise - Les Enfants d'Adam et Eve

Ce document liste toutes les configurations nécessaires pour que le projet fonctionne correctement.

## 🔧 1. Configuration de la Base de Données PostgreSQL

### Fichier: `backend/config.env`

Créez ce fichier à partir de `backend/config.env.example` et configurez les variables suivantes :

```env
# Configuration PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=enfants_adam_eve
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# OU utilisez une URL complète (pour Neon, Railway, etc.)
# DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require
```

### Vérifications

1. ✅ PostgreSQL doit être installé et démarré
2. ✅ La base de données `enfants_adam_eve` doit exister
3. ✅ L'utilisateur PostgreSQL doit avoir les permissions nécessaires

### Création de la base de données

```sql
CREATE DATABASE enfants_adam_eve;
```

Ou utilisez le script :
```bash
npm run create-tables
```

---

## 🤖 2. Configuration de l'IA (Service Professeur)

### Clés API requises (au moins une)

L'IA peut fonctionner avec **OpenAI** ou **HuggingFace**. Configurez au moins une clé API.

### Option A : OpenAI (Recommandé)

Ajoutez dans `backend/config.env` ou dans un fichier `.env` dans le dossier `ia/` :

```env
OPENAI_API_KEY=sk-votre_cle_openai_ici
```

**Où obtenir une clé OpenAI :**
- Visitez https://platform.openai.com/api-keys
- Créez un compte ou connectez-vous
- Générez une nouvelle clé API

### Option B : HuggingFace

Ajoutez dans `backend/config.env` ou dans un fichier `.env` dans le dossier `ia/` :

```env
HUGGINGFACE_API_KEY=votre_token_huggingface_ici
```

**Où obtenir un token HuggingFace :**
- Visitez https://huggingface.co/settings/tokens
- Créez un compte ou connectez-vous
- Générez un nouveau token

### Mode Démo

Si aucune clé API n'est configurée, l'IA fonctionnera en mode démo avec des réponses prédéfinies. Les fonctionnalités seront limitées.

---

## 🔐 3. Configuration JWT (Sécurité)

### Fichier: `backend/config.env`

```env
# Configuration JWT
JWT_SECRET=votre_secret_jwt_super_securise_$(date +%s)
JWT_EXPIRE=7d
```

**⚠️ IMPORTANT :** 
- Utilisez un secret fort et unique
- Ne partagez jamais ce secret
- En production, utilisez une variable d'environnement sécurisée

---

## 🌐 4. Configuration CORS

### Fichier: `backend/config.env`

```env
# Configuration CORS
CORS_ORIGIN=http://localhost:5173
```

Pour la production, ajoutez l'URL de votre frontend.

---

## 📁 5. Configuration des Uploads

### Fichier: `backend/config.env`

```env
# Configuration des uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

Le dossier `uploads/` sera créé automatiquement si nécessaire.

---

## 🚀 6. Ports des Services

### Backend
- **Port par défaut:** 5002
- Configurable via `PORT` dans `backend/config.env`

### Frontend
- **Port par défaut:** 5173 (Vite)
- Configurable via `npm run dev -- --port <port>`

### IA Professeur
- **Port par défaut:** 5000
- Configurable dans `ia/app.py`

---

## ✅ Checklist de Configuration

Avant de démarrer le projet, vérifiez :

- [ ] PostgreSQL est installé et démarré
- [ ] Le fichier `backend/config.env` existe et est configuré
- [ ] La base de données `enfants_adam_eve` existe
- [ ] Les variables DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD sont correctes
- [ ] JWT_SECRET est configuré avec une valeur sécurisée
- [ ] (Optionnel) OPENAI_API_KEY ou HUGGINGFACE_API_KEY est configuré pour l'IA
- [ ] Les dossiers `backend/uploads/` et `backend/uploads/family/` existent ou seront créés automatiquement

---

## 🔍 Vérification de la Configuration

### Tester la connexion à la base de données

```bash
cd backend
npm run test-postgresql
```

### Tester le backend

```bash
cd backend
npm start
# Vérifiez http://localhost:5002/api/health
```

### Tester l'IA

```bash
cd ia
python app.py
# Vérifiez http://localhost:5000
```

---

## 🆘 Résolution de Problèmes

### Erreur de connexion PostgreSQL

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les paramètres dans `backend/config.env`
3. Testez la connexion : `psql -h localhost -U postgres -d enfants_adam_eve`

### L'IA ne fonctionne pas

1. Vérifiez que `OPENAI_API_KEY` ou `HUGGINGFACE_API_KEY` est configuré
2. Vérifiez que la clé API est valide
3. Consultez les logs au démarrage de l'IA pour voir les messages d'avertissement

### Erreurs d'authentification

1. Vérifiez que `JWT_SECRET` est configuré
2. Vérifiez que le token est valide dans le localStorage du navigateur

---

## 📝 Notes Importantes

- **Ne commitez jamais** le fichier `backend/config.env` (il est dans `.gitignore`)
- Utilisez `backend/config.env.example` comme modèle
- En production, utilisez des variables d'environnement sécurisées
- Les clés API doivent être gardées secrètes

---

**Dernière mise à jour :** 2024
