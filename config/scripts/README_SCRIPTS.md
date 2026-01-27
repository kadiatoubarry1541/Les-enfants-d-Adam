# 📜 Guide des Scripts de Démarrage

## 🚀 Scripts Disponibles

### 1. `DEMARRER_IA_AUTO.bat` ⭐ **RECOMMANDÉ**

**Utilisation :** Lancez d'abord Backend et Frontend manuellement, puis exécutez ce script.

```bash
# Étape 1 : Lancer le Backend (dans un terminal)
cd backend
npm start

# Étape 2 : Lancer le Frontend (dans un autre terminal)
cd frontend
npm run dev

# Étape 3 : Lancer l'IA automatiquement (dans un troisième terminal)
config\scripts\DEMARRER_IA_AUTO.bat
```

**Ce que fait le script :**
- ✅ Vérifie que Python est installé
- ✅ Attend que le Backend soit actif (port 5002)
- ✅ Attend que le Frontend soit actif (port 5173)
- ✅ Lance automatiquement l'IA (port 5000)

**Avantages :**
- Vous gardez le contrôle sur le démarrage de Backend et Frontend
- L'IA se lance automatiquement une fois que tout est prêt
- Vérifications automatiques des ports

---

### 2. `DEMARRER_TOUT_AVEC_IA.bat`

**Utilisation :** Lance automatiquement les 3 services (Backend + Frontend + IA)

```bash
config\scripts\DEMARRER_TOUT_AVEC_IA.bat
```

**Ce que fait le script :**
- Lance Backend, Frontend et IA automatiquement
- Vérifie les dépendances
- Vérifie les ports

---

### 3. `DEMARRER_TOUT.bat`

**Utilisation :** Lance seulement Backend + Frontend (sans IA)

```bash
config\scripts\DEMARRER_TOUT.bat
```

---

### 4. `DEMARRER_BACKEND.bat`

**Utilisation :** Lance uniquement le Backend

```bash
config\scripts\DEMARRER_BACKEND.bat
```

---

### 5. `DEMARRER_FRONTEND.bat`

**Utilisation :** Lance uniquement le Frontend

```bash
config\scripts\DEMARRER_FRONTEND.bat
```

---

## 📋 Workflow Recommandé

### Option A : Démarrage manuel avec IA automatique

1. **Terminal 1 - Backend :**
   ```bash
   cd backend
   npm start
   ```

2. **Terminal 2 - Frontend :**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Terminal 3 - IA (automatique) :**
   ```bash
   config\scripts\DEMARRER_IA_AUTO.bat
   ```

### Option B : Tout automatique

```bash
config\scripts\DEMARRER_TOUT_AVEC_IA.bat
```

---

## 🔍 Vérification des Ports

Les scripts vérifient automatiquement que les ports sont disponibles :
- **Backend** : Port 5002
- **Frontend** : Port 5173
- **IA** : Port 5000

Si un port est déjà utilisé, le script essaie de libérer le port automatiquement.

---

## ⚠️ Notes Importantes

- Le script `DEMARRER_IA_AUTO.bat` attend jusqu'à 60 secondes pour que Backend et Frontend soient actifs
- Si Backend ou Frontend ne sont pas détectés, le script s'arrête avec un message d'erreur
- Assurez-vous que PostgreSQL est démarré avant de lancer le Backend

---

**Utilisez `DEMARRER_IA_AUTO.bat` si vous préférez lancer Backend et Frontend manuellement !** 🎯
