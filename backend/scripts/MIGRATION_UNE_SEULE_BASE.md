# Une seule base de données : migrer IAscience + diangou → base principale puis supprimer les autres

Ce guide décrit comment **tout mettre dans la base principale** (ex. **enfants_adam_ev** ou **enfants_adam_eve**) et **supprimer les bases IAscience et diangou** pour n’avoir qu’une seule base.

---

## 1. Ce qui a été fait dans le projet

- **Script de migration** : `backend/scripts/migrate-ia-db-to-main.js`  
  - Copie tout le contenu de **IAscience** (sessions, messages, conversations) vers la base principale dans les tables `ia_sc_sessions`, `ia_sc_messages`, `ia_sc_conversations`.  
  - Copie tout le contenu de la base **diangou** vers la base principale dans le **schéma** `diangou` (tables `diangou.users`, `diangou.courses`, etc.).

- **IA SC (Professeur IA)** : utilise maintenant la **base principale** et les tables `ia_sc_*`. Il ne se connecte plus à IAscience.

- **Base diangou** : c’est une **vraie base séparée** dans PostgreSQL. Le script la migre entièrement dans le schéma `diangou` de la base principale.

---

## 2. Étapes à suivre

### Étape 1 : Migrer IAscience + diangou → base principale

1. Arrêtez **IA SC** et toute application qui utilise les bases IAscience ou diangou.
2. Dans `backend/config.env`, vérifiez que la **base principale** est bien celle que vous voulez garder (celle qui s’appelle **enfants_adam_ev** ou **enfants_adam_eve** dans pgAdmin) :
   ```env
   DB_NAME=enfants_adam_ev
   ```
   ou avec une URL complète :
   ```env
   DATABASE_URL=postgresql://postgres:VOTRE_MDP@localhost:5432/enfants_adam_ev
   ```
3. Les bases **IAscience** et **diangou** doivent encore exister (même serveur PostgreSQL). Par défaut le script utilise :
   - `localhost:5432/IAscience`
   - `localhost:5432/diangou`  
   Si vos URLs sont différentes, ajoutez dans `config.env` :
   ```env
   IASCIENCE_DATABASE_URL=postgresql://postgres:password@localhost:5432/IAscience
   DIANGOU_DATABASE_URL=postgresql://postgres:password@localhost:5432/diangou
   ```
4. Depuis le dossier backend :
   ```bash
   cd backend
   npm run migrate-ia-db
   ```
5. Vérifiez dans la base principale (enfants_adam_ev) :
   - les tables `ia_sc_sessions`, `ia_sc_messages`, `ia_sc_conversations` (données IAscience) ;
   - le schéma `diangou` avec toutes les tables (données diangou).

### Étape 2 : Faire pointer l’IA SC vers la base principale

L’IA SC a déjà été modifiée pour utiliser la base principale. Il suffit que le fichier **`.env`** dans le dossier **`IA SC/`** (ou les variables d’environnement) contienne soit :

- **`DATABASE_URL`** = l’URL de votre base principale (la même que pour le backend),  
  **ou**
- **`DB_HOST`**, **`DB_NAME`**, **`DB_USER`**, **`DB_PASSWORD`** (et optionnellement **`DB_PORT`**) pour que l’IA SC construise elle-même l’URL de la base principale.

Après migration, ne mettez **plus** l’URL de IAscience dans `DATABASE_URL`.

### Étape 3 : Supprimer les bases IAscience et diangou (ne garder qu’une seule base)

Une fois que tout fonctionne avec la base principale :

1. Arrêtez l’IA SC et toute app utilisant IAscience ou diangou.
2. Dans **pgAdmin** : connectez-vous au serveur PostgreSQL, puis **clic droit sur une base** (par ex. « postgres ») → **Query Tool**.
3. Exécutez (dans l’ordre) :
   ```sql
   DROP DATABASE IF EXISTS "IAscience";
   DROP DATABASE IF EXISTS diangou;
   ```
4. Il doit vous rester **2 bases** : **postgres** (système, à ne pas supprimer) et **votre base principale** (ex. **enfants_adam_ev**), qui contient maintenant tout (données du projet + IAscience + diangou).

---

## 3. Résumé

| Avant (4 bases dans pgAdmin) | Après |
|------------------------------|--------|
| **enfants_adam_ev** (base principale) | **Une seule base** : tout reste ici (projet + IAscience + diangou) |
| **IAscience** | Contenu copié dans `ia_sc_sessions`, `ia_sc_messages`, `ia_sc_conversations` → puis base supprimée |
| **diangou** | Contenu copié dans le schéma `diangou` (tables `diangou.*`) → puis base supprimée |
| **postgres** (système) | Inchangée, à ne pas supprimer |

À la fin, il ne reste que **postgres** + **votre base principale** (ex. enfants_adam_ev).
