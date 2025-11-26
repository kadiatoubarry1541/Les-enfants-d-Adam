# Comment démarrer le backend pour le Défi Éducatif

## Étapes pour démarrer le backend

1. **Ouvrir un terminal** dans le dossier du projet

2. **Aller dans le dossier backend** :
   ```bash
   cd backend
   ```

3. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

4. **Vérifier que le serveur démarre** :
   Vous devriez voir :
   ```
   ✅ PostgreSQL connecté avec succès
   ✅ Modèles Game initialisés avec succès
   🚀 Serveur démarré sur le port 5002
   ```

## Si le serveur ne démarre pas

- Vérifiez que PostgreSQL est démarré
- Vérifiez que la base de données `enfants_adam_eve` existe
- Vérifiez le fichier `backend/config.env` pour les paramètres de connexion

## Une fois le backend démarré

1. Allez sur la page **Éducation** dans votre application
2. L'onglet **"Défi éducatif"** devrait s'afficher automatiquement
3. Cliquez sur **"Créer un jeu maintenant"**
4. Ouvrez la **console du navigateur (F12)** pour voir les logs

## Logs dans la console

Vous devriez voir :
- `🚀 Création du jeu avec:` (votre numéro H et l'URL)
- `📡 Réponse reçue:` (statut 200 si OK)
- `✅ Jeu créé avec succès:` (le jeu créé)

Si vous voyez des erreurs, vérifiez :
- Que le backend est bien démarré sur le port 5002
- Que l'URL de l'API est correcte : `http://localhost:5002/api`
- Que vous êtes connecté avec un compte valide

