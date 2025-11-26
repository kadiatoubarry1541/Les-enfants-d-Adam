# Guide Complet - Défi Éducatif

## 🎯 Pour que le Défi Éducatif fonctionne

### 1. Démarrer le Backend

**Ouvrez un terminal dans le dossier `backend`** et exécutez :
```bash
npm run dev
```

**Vous devez voir :**
```
✅ PostgreSQL connecté avec succès
✅ Modèles Game initialisés avec succès
🚀 Serveur démarré sur le port 5002
```

**Si vous voyez des erreurs :**
- Vérifiez que PostgreSQL est démarré
- Vérifiez que la base de données `enfants_adam_eve` existe
- Vérifiez le fichier `backend/config.env` pour les paramètres

### 2. Utiliser le Frontend

1. **Allez sur la page Éducation** dans votre application
2. **L'onglet "Défi éducatif" s'affiche automatiquement** (c'est l'onglet par défaut)
3. **Vous verrez :**
   - Votre nom et numéro H
   - L'URL de l'API : `http://localhost:5002/api`
   - Un bouton "🎮 Créer un jeu maintenant"

4. **Ouvrez la console du navigateur (F12)**

5. **Cliquez sur "Créer un jeu maintenant"**

6. **Dans la console, vous devriez voir :**
   - `🚀 Création du jeu avec:` (votre numéro H et l'URL)
   - `📡 Réponse reçue:` (statut 200 si OK)
   - `✅ Jeu créé avec succès:` (le jeu créé)
   - `✅ Vue changée vers: player`

### 3. Si ça ne fonctionne pas

#### Erreur "Failed to fetch"
**Cause :** Le backend n'est pas démarré ou n'est pas accessible
**Solution :**
1. Vérifiez que le backend est démarré (voir étape 1)
2. Vérifiez que le port 5002 n'est pas utilisé par un autre programme
3. Vérifiez que l'URL `http://localhost:5002/api` est correcte

#### Erreur 401 (Non authentifié)
**Cause :** Problème d'authentification
**Solution :**
1. Vérifiez que vous êtes connecté
2. Vérifiez que votre session contient votre `numeroH`
3. Si vous êtes l'admin principal `G0C0P0R0E0F0 0`, cela devrait fonctionner automatiquement

#### Erreur 500 (Erreur serveur)
**Cause :** Erreur dans le backend
**Solution :**
1. Regardez les logs du backend pour voir l'erreur exacte
2. Vérifiez que les modèles Game sont bien initialisés
3. Vérifiez que la base de données est accessible

#### Le jeu se crée mais ne s'affiche pas
**Cause :** Problème de réponse du serveur ou de parsing
**Solution :**
1. Vérifiez dans la console du navigateur la réponse complète
2. Vérifiez que `data.game` existe dans la réponse
3. Vérifiez que le jeu a bien un `id`

## 📋 Règles du Jeu (Cahier des Charges)

### Dépôt Initial
- ✅ **50 000 FG** créé automatiquement à la création du jeu

### Montants Financiers
- ✅ **Bonne réponse** : +10 000 FG (gain)
- ✅ **Mauvaise réponse** : -5 000 FG (pénalité)
- ✅ **Refus volontaire** : -10 000 FG (pénalité immédiate)
- ✅ **Refus par jury** : -5 000 FG (pénalité)

### Limite de Dettes
- ✅ **Maximum 2 dettes** par joueur
- ✅ Si un joueur a déjà 2 dettes, la 3ème pénalité est **refusée**

### Jury
- ✅ **Un seul jury humain** par jeu
- ✅ **Seul le jury** peut valider les réponses
- ✅ Le jury doit valider avant que l'argent ne bouge

### Cycles de Jeu
- ✅ Le jeu se déroule en **cycles**
- ✅ Après validation complète, **passage automatique au joueur suivant**
- ✅ Le cycle s'incrémente quand on revient au premier joueur

### Types de Questions/Réponses
- ✅ **Texte** : Questions et réponses en texte
- ✅ **Audio** : Questions et réponses en audio
- ✅ **Vidéo** : Questions et réponses en vidéo

## 🔧 Commandes Utiles

### Vérifier que le backend est démarré
```bash
netstat -ano | findstr :5002
```
(Sur Windows PowerShell)

### Voir les logs du backend
Les logs s'affichent dans le terminal où vous avez démarré le backend.

### Redémarrer le backend
1. Arrêtez le backend (Ctrl+C)
2. Relancez : `npm run dev`

## 🐛 Débogage

### Vérifier la connexion
1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet "Network" (Réseau)
3. Cliquez sur "Créer un jeu maintenant"
4. Regardez la requête `POST /api/defi-educatif/games`
5. Vérifiez :
   - Le statut (200 = OK, 401 = Non authentifié, 500 = Erreur serveur)
   - Les headers (X-Admin-Numero-H doit être présent)
   - La réponse (doit contenir `success: true` et `game: {...}`)

### Vérifier l'authentification
1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet "Application" ou "Storage"
3. Regardez "Local Storage" → `session_user`
4. Vérifiez que votre `numeroH` est présent

## ✅ Checklist de Démarrage

- [ ] PostgreSQL est démarré
- [ ] La base de données `enfants_adam_eve` existe
- [ ] Le backend est démarré sur le port 5002
- [ ] Vous voyez "✅ Modèles Game initialisés avec succès" dans les logs
- [ ] Vous êtes connecté dans l'application
- [ ] Vous voyez votre numéro H dans la page "Défi éducatif"
- [ ] L'URL de l'API est correcte : `http://localhost:5002/api`
- [ ] La console du navigateur est ouverte (F12)
- [ ] Vous cliquez sur "Créer un jeu maintenant"
- [ ] Vous voyez les logs dans la console
- [ ] Le jeu est créé et vous voyez la vue "player"

## 📞 Si vous avez encore des problèmes

1. **Vérifiez les logs du backend** - Ils indiquent les erreurs exactes
2. **Vérifiez la console du navigateur** - Elle montre les erreurs frontend
3. **Vérifiez les logs réseau** - Ils montrent les requêtes HTTP
4. **Vérifiez que tous les services sont démarrés** - PostgreSQL, Backend

## 🎮 Une fois le jeu créé

1. **Le jeu est créé avec le statut `waiting`**
2. **Vous êtes automatiquement "Player 1"**
3. **D'autres joueurs peuvent rejoindre** (via "Rejoindre un jeu")
4. **Quand il y a au moins 2 joueurs, vous pouvez démarrer le jeu**
5. **Une fois démarré, le premier joueur peut poser une question**
6. **Les autres joueurs répondent**
7. **Le jury valide les réponses**
8. **Le jeu passe au joueur suivant automatiquement**

---

**N'oubliez pas :** Le backend DOIT être démarré pour que le jeu fonctionne !

