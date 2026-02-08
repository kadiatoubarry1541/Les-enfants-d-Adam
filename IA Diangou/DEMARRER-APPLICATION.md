# 🚀 Guide de démarrage de l'application

## Problème : "ERR_CONNECTION_REFUSED" sur localhost:5173

Cela signifie que le serveur frontend n'est pas démarré.

## Solution : Démarrer les deux serveurs

### 1. Démarrer le serveur BACKEND (port 5003)

**Ouvre un terminal PowerShell :**
```powershell
cd "C:\Users\koolo barry\Desktop\IA Diangou\backend"
npm run start
```

**Tu devrais voir :**
```
✅ PostgreSQL connecté avec succès à la base de données "diangou"
✅ Base de données connectée et prête
🚀 Serveur IA Diangou démarré sur le port 5003
```

**⚠️ IMPORTANT :** Laisse ce terminal ouvert !

### 2. Démarrer le serveur FRONTEND (port 5173)

**Ouvre un NOUVEAU terminal PowerShell :**
```powershell
cd "C:\Users\koolo barry\Desktop\IA Diangou\frontend"
npm run dev
```

**Tu devrais voir :**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**⚠️ IMPORTANT :** Laisse ce terminal ouvert aussi !

### 3. Ouvrir l'application

1. Ouvre ton navigateur
2. Va sur : **http://localhost:5173**
3. Tu devrais voir la page d'accueil !

## Vérification rapide

### Vérifier que le backend fonctionne :
Ouvre : http://localhost:5003/api/health

Tu devrais voir :
```json
{
  "success": true,
  "message": "IA Diangou API is running",
  "database": "diangou"
}
```

### Vérifier que le frontend fonctionne :
Ouvre : http://localhost:5173

Tu devrais voir la page d'accueil avec les boutons "S'inscrire" et "Se connecter".

## Si ça ne fonctionne toujours pas

### Erreur : "Port 5003 already in use"
Le backend est déjà démarré. C'est bon, passe à l'étape 2.

### Erreur : "Port 5173 already in use"
Le frontend est déjà démarré. Ouvre simplement http://localhost:5173 dans ton navigateur.

### Erreur : "Base de données non connectée"
1. Vérifie que PostgreSQL est démarré
2. Vérifie le mot de passe dans `backend/config.env`
3. Exécute : `node scripts/createAdmin.js`

## Commandes rapides

```powershell
# Terminal 1 - Backend
cd backend
npm run start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Résumé

✅ **Backend** : http://localhost:5003 (doit être démarré)
✅ **Frontend** : http://localhost:5173 (doit être démarré)
✅ **Application** : http://localhost:5173 (ouvre dans le navigateur)

