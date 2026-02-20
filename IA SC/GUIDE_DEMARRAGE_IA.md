# 🎓 Guide de démarrage - Professeur IA

Ce guide vous aide à faire fonctionner le Professeur IA pour qu'il réponde aux questions en français.

---

## ✅ Étape 1 : Démarrer le serveur IA

**Option A - Double-clic :**
- Double-cliquez sur `DEMARRER_IA.bat` dans le dossier `IA SC`

**Option B - Ligne de commande :**
```bash
cd "IA SC"
pip install -r requirements.txt
python app.py
```

Vous devriez voir : `🚀 Serveur IA sur http://127.0.0.1:5000 - Prêt à recevoir des questions !`

---

## ✅ Étape 2 : Démarrer l'application principale

Dans un autre terminal :
```bash
cd frontend
npm install
npm run dev
```

Puis allez sur : **Éducation** → **Professeur IA** (ou `/ia-sc`)

---

## 📚 Modes de fonctionnement

| Mode | Quand ? | Qualité des réponses |
|------|---------|---------------------|
| **OpenAI** | Vous avez une clé API OpenAI dans .env | ⭐⭐⭐ Excellente - Répond à tout |
| **HuggingFace** | Vous avez un token HuggingFace | ⭐⭐ Bonne |
| **Démonstration** | Aucune clé API | ⭐ Réponses pour : bonjour, alphabet, conjugaison, grammaire française... |

**Sans clé API**, l'IA répond déjà à des centaines de questions (grammaire, conjugaison, salutations, etc.) grâce aux réponses intégrées.

---

## 🔑 Pour des réponses à TOUTES les questions (recommandé)

1. Créez un fichier `.env` dans le dossier `IA SC` (copiez `.env.example`)
2. Obtenez une clé sur https://platform.openai.com/api-keys
3. Ajoutez dans `.env` :
   ```
   OPENAI_API_KEY=sk-votre_vraie_cle_ici
   ```
4. Redémarrez le serveur IA (`python app.py`)

---

## 🗄️ Base de données (optionnelle)

Pour sauvegarder l'historique des conversations :

1. Créez la base dans PostgreSQL :
   - Ouvrez `database.sql` dans pgAdmin
   - Ou exécutez `creer_base_donnees.bat`

2. Si la base n'existe pas : **l'IA fonctionne quand même** (sans sauvegarder l'historique)

---

## 🐛 Problèmes courants

**"Problème de connexion avec le serveur IA"**
- Vérifiez que le serveur IA tourne sur le port 5000 (`python app.py` dans IA SC)

**L'IA ne répond pas correctement**
- En mode démonstration : reformulez votre question (ex: "C'est quoi un verbe ?", "Comment conjuguer être ?")
- Pour des réponses complètes : ajoutez une clé OpenAI dans .env

**Erreur base de données**
- L'IA fonctionne sans base. Pour l'historique, créez la base IAscience avec `database.sql`
