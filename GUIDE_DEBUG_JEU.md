# Guide de Débogage - Création de Jeu

## Problème : "Erreur réseau: Failed to fetch"

### Solutions à vérifier :

1. **Backend démarré ?**
   - Ouvrir un terminal dans le dossier `backend`
   - Exécuter : `npm run dev`
   - Vérifier que le serveur écoute sur le port 5002
   - Message attendu : "Server running on port 5002"

2. **URL de l'API correcte ?**
   - Frontend utilise : `http://localhost:5002/api/defi-educatif/games`
   - Vérifier dans la console du navigateur (F12) l'URL exacte appelée

3. **Authentification ?**
   - Vérifier que vous êtes connecté (session_user dans localStorage)
   - Vérifier que votre `numeroH` est envoyé dans le header `X-Admin-Numero-H`
   - Vérifier dans la console du backend les logs d'authentification

4. **CORS ?**
   - Le backend autorise les requêtes depuis `http://localhost:5173`
   - Vérifier que le frontend tourne sur le port 5173

### Logs à vérifier :

**Console du navigateur (F12) :**
- `📋 Session récupérée: Oui/Non`
- `👤 Utilisateur détecté: { numeroH, role, hasToken }`
- `🚀 Envoi de la requête de création de jeu...`
- `🌐 URL de la requête: ...`
- `📥 Réponse du serveur: { status, statusText, ok }`

**Console du backend :**
- `🔐 Authentification middleware: { hasAuthHeader, adminHeader, path }`
- `🔍 Recherche admin via header spécial: ...`
- `✅ Utilisateur trouvé: { numeroH, role, isActive }`
- `✅ Authentification réussie via header spécial`
- `🎮 Création d'un jeu: { juryNumeroH, createdBy, userRole }`

### Modification apportée :

Le middleware d'authentification a été modifié pour permettre à **tous les utilisateurs actifs** de créer un jeu via le header `X-Admin-Numero-H`, pas seulement les admins.

### Test rapide :

1. Ouvrir la console du navigateur (F12)
2. Vérifier `localStorage.getItem('session_user')`
3. Essayer de créer un jeu
4. Vérifier les logs dans la console du navigateur ET du backend
5. Si "Failed to fetch", vérifier que le backend est démarré

