# 🔧 SOLUTION RAPIDE - Rien ne s'affiche

## Problème : Rien ne s'affiche sur http://localhost:5173

### Causes possibles :

1. **Le serveur frontend n'est pas démarré**
2. **Le serveur backend n'est pas démarré**
3. **Erreur dans le code**
4. **Port déjà utilisé**

## Solution étape par étape :

### ÉTAPE 1 : Vérifier que les serveurs sont démarrés

**Ouvre 2 terminaux PowerShell séparés :**

**Terminal 1 - Backend :**
```powershell
cd "C:\Users\koolo barry\Desktop\IA Diangou\backend"
npm run start
```

**Tu dois voir :**
```
✅ PostgreSQL connecté avec succès
🚀 Serveur IA Diangou démarré sur le port 5003
```

**Terminal 2 - Frontend :**
```powershell
cd "C:\Users\koolo barry\Desktop\IA Diangou\frontend"
npm run dev
```

**Tu dois voir :**
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### ÉTAPE 2 : Ouvrir le navigateur

1. Ouvre Chrome/Firefox/Edge
2. Va sur : **http://localhost:5173**
3. Tu devrais voir la page d'accueil

### ÉTAPE 3 : Si ça ne fonctionne toujours pas

**Vérifie la console du navigateur (F12) :**
- Ouvre les DevTools (F12)
- Va dans l'onglet "Console"
- Regarde s'il y a des erreurs en rouge

**Vérifie les terminaux :**
- Y a-t-il des erreurs en rouge dans les terminaux ?
- Les serveurs sont-ils toujours en cours d'exécution ?

## Diagnostic automatique

**Exécute le script de diagnostic :**
```powershell
.\DIAGNOSTIC-COMPLET.bat
```

Ce script va vérifier :
- Si les ports sont utilisés
- Si les fichiers existent
- Si le backend répond

## Commandes de test

**Test du backend :**
```powershell
curl http://localhost:5003/api/health
```

**Test du frontend :**
Ouvre simplement : http://localhost:5173

## Erreurs courantes

### "ERR_CONNECTION_REFUSED"
→ Le serveur frontend n'est pas démarré
→ Solution : `cd frontend && npm run dev`

### "Cannot GET /"
→ Le serveur backend n'est pas démarré
→ Solution : `cd backend && npm run start`

### Page blanche
→ Erreur JavaScript
→ Solution : Ouvre F12 → Console et regarde les erreurs

### "Port already in use"
→ Le serveur est déjà démarré
→ Solution : C'est bon, ouvre juste le navigateur

## Contact

Si rien ne fonctionne, partage :
1. Les erreurs dans les terminaux
2. Les erreurs dans la console du navigateur (F12)
3. Ce que tu vois exactement dans le navigateur

