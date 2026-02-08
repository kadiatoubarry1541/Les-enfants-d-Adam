# IA Grand-Mère - Chatbot Sympathique en Français

Une intelligence artificielle qui répond à toutes vos questions avec la chaleur et la sagesse d'une grand-mère française.

## 📋 Étapes pour créer et utiliser cette IA

### Étape 1 : Installation des dépendances

```bash
pip install -r requirements.txt
```

### Étape 2 : Configuration de l'API

1. **Option A - OpenAI (recommandé pour débutants)** :
   - Créez un compte sur [OpenAI](https://platform.openai.com/)
   - Obtenez votre clé API
   - Créez un fichier `.env` et ajoutez :
   ```
   OPENAI_API_KEY=votre_cle_api
   ```

2. **Option B - Hugging Face (gratuit, open-source)** :
   - Créez un compte sur [Hugging Face](https://huggingface.co/)
   - Obtenez votre token API
   - Ajoutez dans `.env` :
   ```
   HUGGINGFACE_API_KEY=votre_token
   ```

### Étape 3 : Lancement de l'application

```bash
python app.py
```

L'application sera accessible sur `http://localhost:5000`

### Étape 4 : Utilisation

1. Ouvrez votre navigateur
2. Allez sur `http://localhost:5000`
3. Posez vos questions à Grand-Mère !
4. Elle répondra avec chaleur et sagesse en français

## 🎯 Fonctionnalités

- ✅ Réponses chaleureuses et bienveillantes
- ✅ Support du français naturel
- ✅ Interface simple et intuitive
- ✅ Mémoire de conversation
- ✅ Style "grand-mère" authentique

## 📁 Structure du projet

```
IA SC/
├── app.py              # Backend Flask
├── templates/
│   └── index.html      # Interface web
├── static/
│   └── style.css       # Styles CSS
├── requirements.txt    # Dépendances Python
├── .env               # Variables d'environnement (à créer)
└── README.md          # Ce fichier
```

## 🔧 Configuration avancée

Vous pouvez personnaliser le comportement de Grand-Mère en modifiant le prompt système dans `app.py`.

## 💡 Astuces

- Plus vous donnez de contexte, meilleures sont les réponses
- N'hésitez pas à poser des questions sur la cuisine, les conseils, les histoires
- Grand-Mère aime partager ses souvenirs !

