# 📚 IA Professeur - Version React + TypeScript

## 🚀 Installation et Lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Python 3.10+
- Flask backend en cours d'exécution sur le port 5000

### Installation du Frontend React

1. **Installer les dépendances :**
```bash
cd frontend
npm install
```

2. **Lancer le serveur de développement :**
```bash
npm start
```

Le frontend React sera accessible sur `http://localhost:3000`

### Lancer le Backend Flask

Dans un autre terminal :
```bash
# Depuis la racine du projet
py app.py
```

Le backend sera accessible sur `http://localhost:5000`

## 📁 Structure du Projet

```
IA SC/
├── app.py                    # Backend Flask (API)
├── frontend/                 # Application React + TypeScript
│   ├── src/
│   │   ├── App.tsx          # Composant principal
│   │   ├── components/      # Composants React
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── index.tsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tsconfig.json
└── ...
```

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **CSS Modules** - Styles modulaires

### Backend
- **Flask** - Framework Python
- **PostgreSQL** - Base de données
- **OpenAI API** - Intelligence artificielle

## 🎯 Fonctionnalités

- ✅ Interface React moderne avec TypeScript
- ✅ Communication avec l'API Flask
- ✅ Gestion de l'historique des conversations
- ✅ Interface responsive
- ✅ Animations et transitions fluides

## 📝 Scripts Disponibles

```bash
npm start      # Lancer en mode développement
npm build      # Construire pour la production
npm test       # Lancer les tests
```

## 🔧 Configuration

Le proxy est configuré dans `package.json` pour rediriger les requêtes API vers `http://localhost:5000`

