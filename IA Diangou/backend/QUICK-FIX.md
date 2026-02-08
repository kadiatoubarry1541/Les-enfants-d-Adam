# 🔧 Solution rapide : Base de données non connectée

## Si vous voyez "diangou" dans pgAdmin mais que l'app dit "non connectée"

### Problème probable : Mot de passe ou configuration

1. **Vérifiez le mot de passe PostgreSQL**
   - Ouvrez `backend/config.env`
   - Si vous avez défini un mot de passe lors de l'installation de PostgreSQL, mettez-le dans `DB_PASSWORD`
   - Si vous n'avez PAS de mot de passe, laissez `DB_PASSWORD=` vide

2. **Testez la connexion manuellement**
   ```bash
   cd backend
   node test-connection-direct.js
   ```
   Cela vous dira exactement quel est le problème.

3. **Vérifiez que PostgreSQL est démarré**
   - Ouvrez pgAdmin
   - Si vous pouvez vous connecter dans pgAdmin, PostgreSQL fonctionne
   - Notez le mot de passe que vous utilisez dans pgAdmin

4. **Mettez le même mot de passe dans config.env**
   - Le mot de passe dans `config.env` doit être EXACTEMENT le même que celui de pgAdmin

5. **Redémarrez le serveur backend**
   ```bash
   cd backend
   npm run start
   ```

### Si ça ne fonctionne toujours pas

Exécutez ce script pour voir l'erreur exacte :
```bash
cd backend
node test-connection-direct.js
```

Copiez-collez le message d'erreur complet ici.

