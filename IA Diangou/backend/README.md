# IA Diangou - Backend

Backend pour le système d'éducation IA Diangou avec base de données PostgreSQL "diangou".

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer le fichier `config.env` à partir de `config.env.example` :
```bash
cp config.env.example config.env
```

3. Configurer la base de données dans `config.env` :
```env
DB_NAME=diangou
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
PORT=5003
```

4. Créer la base de données PostgreSQL :
```sql
CREATE DATABASE diangou;
```

5. Démarrer le serveur :
```bash
npm start
# ou en mode développement
npm run dev
```

## 📡 Endpoints d'inscription

### POST /api/education/register/professeur
Inscription d'un professeur

**Body:**
```json
{
  "nomComplet": "Amadou Diallo",
  "email": "amadou@example.com",
  "password": "motdepasse123",
  "matiere": "Mathématiques",
  "niveau": "lycee",
  "telephone": "+224 612 345 678"
}
```

### POST /api/education/register/parent
Inscription d'un parent

**Body:**
```json
{
  "nomComplet": "Fatoumata Diallo",
  "email": "fatoumata@example.com",
  "password": "motdepasse123",
  "nomEnfant": "Mamadou Diallo",
  "ageEnfant": "12",
  "telephone": "+224 612 345 678"
}
```

### POST /api/education/register/apprenant
Inscription d'un apprenant

**Body:**
```json
{
  "nomComplet": "Mamadou Diallo",
  "email": "mamadou@example.com",
  "password": "motdepasse123",
  "age": "15",
  "niveauScolaire": "college",
  "matierePreferee": "Mathématiques",
  "nomParent": "Amadou et Fatoumata Diallo",
  "telephone": "+224 612 345 678"
}
```

## 🔐 Réponse

Tous les endpoints retournent :
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "numeroH": "PROF123456789",
    "prenom": "Amadou",
    "nomFamille": "Diallo",
    "email": "amadou@example.com",
    "role": "professeur"
  },
  "token": "jwt_token_here"
}
```

## 📊 Structure de la base de données

- **users** : Table des utilisateurs (professeurs, parents, apprenants)
- **professors** : Table des professeurs
- **formations** : Table des formations
- **courses** : Table des cours
- **formation_registrations** : Inscriptions aux formations
- **professor_requests** : Demandes de cours avec professeurs
- **course_permissions** : Permissions pour créer des cours

## 🔧 Technologies

- Node.js + Express
- PostgreSQL + Sequelize
- JWT pour l'authentification
- bcryptjs pour le hachage des mots de passe

