# 🔧 Guide de résolution : Base de données non connectée

## Problème
```
Service temporairement indisponible. La base de données n'est pas connectée.
```

## Solution rapide

### Étape 1 : Vérifier que PostgreSQL est démarré

**Sur Windows :**
1. Appuyez sur `Windows + R`
2. Tapez `services.msc` et appuyez sur Entrée
3. Cherchez le service **PostgreSQL** (peut s'appeler `postgresql-x64-XX`)
4. Si le statut n'est pas "En cours d'exécution", faites un clic droit → **Démarrer**

**Ou via PowerShell :**
```powershell
Get-Service -Name "postgresql*"
Start-Service -Name "postgresql-x64-16"  # Remplacez par votre version
```

### Étape 2 : Créer la base de données "diangou"

**Option A : Via pgAdmin (Interface graphique)**
1. Ouvrez pgAdmin
2. Connectez-vous au serveur PostgreSQL
3. Clic droit sur "Databases" → Create → Database
4. Nom : `diangou`
5. Cliquez sur "Save"

**Option B : Via psql (Ligne de commande)**
1. Ouvrez PowerShell ou CMD
2. Naviguez vers le dossier PostgreSQL (exemple : `cd "C:\Program Files\PostgreSQL\16\bin"`)
3. Exécutez :
```bash
psql -U postgres
```
4. Entrez votre mot de passe PostgreSQL
5. Dans psql, tapez :
```sql
CREATE DATABASE diangou;
\q
```

**Option C : Via une commande directe**
```bash
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE diangou;"
```
(Remplacez `16` par votre version de PostgreSQL)

### Étape 3 : Vérifier la configuration

Ouvrez `backend/config.env` et vérifiez :
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diangou
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_ici
```

**⚠️ Important :** Si vous n'avez pas de mot de passe, laissez `DB_PASSWORD=` vide.

### Étape 4 : Tester la connexion

```bash
cd backend
node test-db-connection.js
```

Si vous voyez `✅ TOUS LES TESTS SONT RÉUSSIS !`, la base de données est prête.

### Étape 5 : Créer l'utilisateur admin

```bash
cd backend
node scripts/createAdmin.js
```

### Étape 6 : Redémarrer le serveur backend

```bash
cd backend
npm run start
```

Vous devriez voir :
```
✅ PostgreSQL connecté avec succès à la base de données "diangou"
✅ Base de données connectée
🚀 Serveur IA Diangou démarré sur le port 5003
```

## Si PostgreSQL n'est pas installé

1. Téléchargez PostgreSQL : https://www.postgresql.org/download/windows/
2. Installez-le avec les paramètres par défaut
3. Notez le mot de passe que vous définissez pour l'utilisateur `postgres`
4. Mettez à jour `DB_PASSWORD` dans `backend/config.env`
5. Suivez les étapes ci-dessus

## Alternative : Base de données en ligne (gratuite)

Si vous ne voulez pas installer PostgreSQL localement :

1. Créez un compte gratuit sur **Neon** (https://neon.tech) ou **Supabase** (https://supabase.com)
2. Créez une nouvelle base de données
3. Copiez l'URL de connexion (DATABASE_URL)
4. Dans `backend/config.env`, ajoutez :
```env
DATABASE_URL=postgresql://user:password@host.neon.tech/diangou?sslmode=require
```
5. Redémarrez le serveur

## Vérification finale

Essayez de vous connecter avec :
- Email : `kadiatou1541.kb@gmail.com`
- Mot de passe : `Neneyaya1`

Si ça fonctionne, c'est bon ! ✅

