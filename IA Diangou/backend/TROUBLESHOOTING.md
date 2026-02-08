# Guide de dépannage - Erreur serveur lors de la connexion

## Problème : "Erreur serveur lors de la connexion"

### Solutions possibles :

### 1. Base de données non connectée

**Symptôme :** Erreur "Service temporairement indisponible" ou "Erreur de connexion à la base de données"

**Solution :**
1. Vérifiez que PostgreSQL est installé et démarré
2. Vérifiez le fichier `backend/config.env` :
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=diangou
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe
   ```
3. Créez la base de données si elle n'existe pas :
   ```sql
   CREATE DATABASE diangou;
   ```

### 2. Créer l'admin manuellement

Exécutez le script :
```bash
cd backend
node quick-fix-admin.js
```

Ou utilisez l'API :
```bash
curl -X POST http://localhost:5003/api/education/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"kadiatou1541.kb@gmail.com","password":"Neneyaya1","nomComplet":"Admin Diangou"}'
```

### 3. Vérifier que le serveur backend est démarré

```bash
cd backend
npm run start
```

Le serveur doit afficher :
```
🚀 Serveur IA Diangou démarré sur le port 5003
```

### 4. Vérifier les logs

Regardez les logs du serveur backend pour voir l'erreur exacte.

