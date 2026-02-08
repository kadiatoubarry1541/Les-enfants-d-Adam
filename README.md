# 🌍 "1" - Plateforme Communautaire Guinéenne

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

> **Une plateforme web complète qui reconnecte la diaspora guinéenne et centralise tous les services communautaires en un seul endroit.**

## 🎯 Vue d'ensemble

**"1"** est une plateforme communautaire innovante qui résout deux problèmes majeurs de la communauté guinéenne :

1. **Dispersion de la diaspora et perte des liens familiaux** → Solution : Arbre généalogique interactif et système de gestion familiale
2. **Manque de plateforme centralisée pour les services communautaires** → Solution : Plateforme tout-en-un pour échanges commerciaux, santé, éducation, foi, et activités sociales

## ✨ Fonctionnalités principales

### 👨‍👩‍👧‍👦 Gestion Familiale & Généalogie
- Arbre généalogique visuel interactif
- Système d'invitation pour connecter tous les membres
- Gestion des membres vivants et défunts
- Système NumeroH unique pour identifier chaque membre

### 💼 Échanges Commerciaux
- Marché en ligne pour produits primaires, secondaires et tertiaires
- Paiement mobile intégré
- Comparaison de prix
- Gestion des ventes et achats

### 🏥 Santé Communautaire
- Gestion de la santé communautaire
- Suivi médical
- Échange de médicaments
- Recherche de professionnels de santé

### 📚 Éducation
- Formations en ligne
- Défis éducatifs interactifs
- Cours et ressources pédagogiques
- Recherche de professeurs

### 🕌 Foi & Solidarité
- Gestion transparente de la zakat
- Système de dons sécurisé
- Organisation d'activités religieuses

### 🎉 Activités Sociales
- Organisation d'événements sportifs, artistiques, entrepreneuriaux
- Groupes par résidence, région, organisation
- Coordination communautaire

### 📄 Workflow État-Citoyen
- Système bidirectionnel de gestion de documents administratifs
- Validation et signalement d'erreurs en temps réel
- Traçabilité complète des actions

## 🚀 Technologies utilisées

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (base de données)
- **JWT** (authentification)
- **Multer** (gestion des fichiers)

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **React Router** (routing)
- **i18next** (internationalisation - 5 langues)

### Autres
- **Python** (scripts et outils IA)
- **Flask** (application IA)

## 🌐 Langues supportées

- 🇫🇷 Français
- 🇬🇧 Anglais
- 🇸🇦 Arabe
- 🇬🇳 Maninka
- 🇬🇳 Pular

## 📦 Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL 12+
- Python 3.8+ (pour les scripts IA)
- npm ou yarn

### Backend

```bash
cd backend
npm install
cp config.env.example config.env  # Configurez vos variables d'environnement
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Application IA

```bash
cd "IA SC"
pip install -r requirements.txt
python app.py
```

## 🗂️ Structure du projet

```
.
├── backend/          # API Node.js/Express
│   ├── src/
│   │   ├── models/   # Modèles de données
│   │   ├── routes/   # Routes API
│   │   ├── middleware/ # Middlewares
│   │   └── utils/    # Utilitaires
│   └── config/       # Configuration
├── frontend/         # Application React/TypeScript
│   ├── src/
│   │   ├── components/ # Composants React
│   │   ├── pages/     # Pages de l'application
│   │   ├── services/  # Services API
│   │   └── utils/     # Utilitaires
├── "IA SC"/          # Application IA Python/Flask
└── docs/             # Documentation
```

## 🎯 Innovation principale

### Système NumeroH
Un système d'identification unique pour chaque membre de la communauté guinéenne, permettant une traçabilité et une connexion facilitée.

### Interface Multilingue
Support de 5 langues pour inclure toute la diaspora guinéenne, quelle que soit sa localisation.

### Plateforme Tout-en-Un
Tous les services communautaires (commerce, santé, éducation, foi, activités) centralisés en une seule application accessible sur téléphone mobile.

## 📊 Impact attendu

- ✅ Reconnexion de la diaspora guinéenne dispersée
- ✅ Préservation de l'héritage culturel et généalogique
- ✅ Facilitation des échanges économiques locaux
- ✅ Amélioration de l'accès aux services essentiels
- ✅ Renforcement de la cohésion communautaire
- ✅ Modernisation de l'interaction État-Citoyen

## 🏆 Hackathon

Ce projet a été développé pour participer à des hackathons en ligne et locaux, avec un focus sur :
- **Innovation technique** : Système NumeroH, workflow bidirectionnel
- **Impact social réel** : Résout des problèmes concrets de la communauté
- **Fonctionnalité** : Backend et frontend opérationnels
- **Scalabilité** : Architecture modulaire extensible
- **Accessibilité** : Fonctionne sur téléphone Android basique

## 📝 Documentation

- [🚀 Guide de Déploiement (15 min)](./README_DEPLOIEMENT.md) - **Déployez votre projet en ligne pour le hackathon**
- [Candidature Hackathon](./CANDIDATURE_HACKATHON.md)
- [Présentation Hackathon](./PRESENTATION_HACKATHON.md)
- [Pitch Attractif](./PITCH_ATTRACTIF_PROJET.md)
- [Guide Démarrage Backend](./DEMARRER_BACKEND.md)

## 👤 Auteur

**kadiatoubarry1541**

- GitHub: [@kadiatoubarry1541](https://github.com/kadiatoubarry1541)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Fait avec ❤️ pour la communauté guinéenne**

