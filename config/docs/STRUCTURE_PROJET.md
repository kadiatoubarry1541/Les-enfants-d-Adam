# 📁 Structure du Projet - Les Enfants d'Adam et Eve

## 🎯 Organisation

Le projet est maintenant **parfaitement organisé** avec une structure claire et logique :

```
Les-enfants-d-Adam-main/
│
├── 📂 backend/              # Service Backend (Node.js/Express)
│   ├── src/                 # Code source
│   ├── config.env.example   # Exemple de configuration
│   └── package.json         # Dépendances backend
│
├── 📂 frontend/             # Service Frontend (React/TypeScript)
│   ├── src/                 # Code source
│   ├── public/              # Fichiers publics
│   └── package.json         # Dépendances frontend
│
├── 📂 IA SC/                # Service IA Professeur (Python/Flask)
│   ├── app.py               # Application Flask
│   ├── requirements.txt     # Dépendances Python
│   └── frontend/            # Frontend de l'IA
│
├── 📂 scripts/              # Scripts de démarrage
│   ├── DEMARRER_BACKEND.bat
│   ├── DEMARRER_FRONTEND.bat
│   └── DEMARRER_TOUT.bat
│
├── 📂 docs/                 # Documentation
│   ├── README.md
│   ├── SETUP.md
│   └── ...
│
├── 📂 assets/               # Images et ressources
│   ├── *.png
│   └── *.svg
│
├── 📂 tools/                # Scripts utilitaires
│   ├── *.py
│   └── *.js
│
├── package.json             # Configuration racine
├── railway.json             # Config Railway
├── render.yaml              # Config Render
└── README.md                # Documentation principale
```

## ✅ Avantages de cette organisation

1. **Séparation claire** : Backend, Frontend et IA sont dans leurs propres dossiers
2. **Scripts centralisés** : Tous les scripts .bat sont dans `scripts/`
3. **Documentation organisée** : Tous les fichiers .md sont dans `docs/`
4. **Ressources centralisées** : Images et assets dans `assets/`
5. **Outils séparés** : Scripts utilitaires dans `tools/`
6. **Racine propre** : Seulement les fichiers de configuration essentiels

## 🚀 Utilisation

### Démarrage depuis la racine

```bash
# Démarrage complet (backend + frontend)
scripts\DEMARRER_TOUT.bat

# Démarrage backend uniquement
scripts\DEMARRER_BACKEND.bat

# Démarrage frontend uniquement
scripts\DEMARRER_FRONTEND.bat
```

### Structure des services

- **Backend** : `backend/` - API Node.js complète
- **Frontend** : `frontend/` - Application React complète
- **IA** : `IA SC/` - Service Python/Flask complet

Chaque service est **indépendant** et peut être développé/déployé séparément.

## 📝 Notes

- Les scripts dans `scripts/` utilisent des chemins relatifs pour fonctionner depuis n'importe où
- La documentation complète est dans `docs/`
- Les images du projet sont dans `assets/`
- Les outils et scripts utilitaires sont dans `tools/`

---

**Votre projet est maintenant parfaitement organisé !** 🎉
