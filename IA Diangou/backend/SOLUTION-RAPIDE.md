# ✅ SOLUTION RAPIDE : Base de données non connectée

## Vous voyez "diangou" dans pgAdmin mais l'app dit "non connectée" ?

### Cause la plus fréquente : **MOT DE PASSE**

Quand vous vous connectez à pgAdmin, vous utilisez un mot de passe.
Ce même mot de passe doit être dans `backend/config.env`.

### Étapes :

1. **Ouvrez `backend/config.env`**

2. **Trouvez la ligne `DB_PASSWORD=`**

3. **Mettez votre mot de passe PostgreSQL** (celui que vous utilisez dans pgAdmin) :
   ```env
   DB_PASSWORD=votre_mot_de_passe_ici
   ```
   
   ⚠️ **IMPORTANT** : Si vous n'avez PAS de mot de passe (rare), laissez :
   ```env
   DB_PASSWORD=
   ```

4. **Sauvegardez le fichier**

5. **Redémarrez le serveur backend** :
   ```bash
   cd backend
   npm run start
   ```

6. **Regardez les logs** - vous devriez voir :
   ```
   ✅ PostgreSQL connecté avec succès à la base de données "diangou"
   ✅ Base de données connectée et prête
   ```

### Si ça ne fonctionne toujours pas :

1. **Vérifiez que PostgreSQL est démarré** :
   - Si pgAdmin fonctionne, PostgreSQL est démarré ✅

2. **Vérifiez la configuration dans `config.env`** :
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=diangou
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe
   ```

3. **Testez la connexion** :
   - Ouvrez pgAdmin
   - Connectez-vous avec les mêmes identifiants que dans `config.env`
   - Si ça fonctionne dans pgAdmin mais pas dans l'app, c'est un problème de mot de passe

### Solution alternative : Utiliser DATABASE_URL

Si vous avez une URL de connexion complète (ex: Neon, Supabase) :

1. Dans `config.env`, commentez les lignes DB_HOST, etc.
2. Ajoutez :
   ```env
   DATABASE_URL=postgresql://user:password@host:port/diangou
   ```

