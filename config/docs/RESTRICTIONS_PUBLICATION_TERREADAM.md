# 🔒 Restrictions de Publication - Page Terre Adam

## ✅ Modifications Effectuées

### 1. **Restriction pour les Utilisateurs Non-Admin**

Sur la page **Terre Adam**, dans l'onglet **"Lieux"** → **"Quartier"** :

- ✅ Les utilisateurs **non-admin** ne peuvent publier **QUE dans leur quartier**
- ✅ Les utilisateurs **non-admin** ne voient **QUE les groupes de leur quartier**
- ✅ Les admins peuvent publier partout (pas de restriction)

### 2. **Modifications Backend** (`backend/src/routes/residences.js`)

**Route :** `POST /api/residences/groups/:id/messages`

**Vérifications ajoutées :**
- Vérifie si l'utilisateur est admin
- Si non-admin, vérifie que le groupe correspond au quartier de l'utilisateur
- Compare `group.location` avec le quartier de l'utilisateur (`lieuResidence1` ou `lieu1`)
- Refuse la publication si le quartier ne correspond pas
- Refuse la publication si l'utilisateur n'a pas de quartier défini

**Messages d'erreur :**
- `"Vous ne pouvez publier que dans votre quartier. Contactez un administrateur pour obtenir des droits de publication dans d'autres quartiers."`
- `"Vous devez avoir un quartier défini pour publier. Veuillez compléter votre profil avec votre lieu de résidence (quartier)."`

### 3. **Modifications Frontend** (`frontend/src/pages/TerreAdam.tsx`)

**Filtrage des groupes :**
- Les non-admins voient uniquement les groupes de leur quartier
- Les admins voient tous les groupes

**Sélecteur de groupe :**
- Affiche un message : `"(Votre quartier uniquement)"` pour les non-admins
- Affiche un avertissement : `"• Vous ne pouvez publier que dans votre quartier"`

**Vérification avant envoi :**
- Vérifie que le groupe sélectionné correspond au quartier de l'utilisateur
- Affiche une alerte si l'utilisateur essaie de publier ailleurs

**Fonction `loadGroups()` :**
- Filtre automatiquement les groupes pour les non-admins sur l'onglet quartier

**Fonction `sendMessage()` :**
- Vérifie le quartier avant d'envoyer le message
- Affiche des messages d'erreur clairs

## 📋 Comportement par Type d'Utilisateur

### Utilisateur Normal (Non-Admin)
- ✅ Peut publier **uniquement** dans son quartier (onglet Lieux → Quartier)
- ✅ Voit **uniquement** les groupes de son quartier
- ❌ Ne peut pas publier dans d'autres quartiers
- ❌ Ne peut pas publier dans sous-préfecture, préfecture, région, pays, continent, mondial
- 💡 Message : "Contactez un administrateur pour obtenir des droits de publication dans d'autres quartiers"

### Administrateur
- ✅ Peut publier **partout** (aucune restriction)
- ✅ Voit **tous** les groupes
- ✅ Peut donner des droits de publication aux autres utilisateurs

## 🔐 Autres Pages

Pour les **autres pages** (Activité, Science, etc.) :
- Les restrictions sont gérées par le système de permissions existant
- Seul l'admin peut donner des droits de publication
- Les utilisateurs doivent demander des permissions pour publier

## 🛠️ Comment Donner des Droits de Publication

### Pour l'Admin :
1. Aller dans le panneau d'administration
2. Gérer les permissions des utilisateurs
3. Accorder des droits de publication dans d'autres quartiers si nécessaire

### Pour les Utilisateurs :
1. Contacter un administrateur
2. Demander des droits de publication dans d'autres quartiers
3. L'admin peut accorder ces droits depuis le panneau d'administration

## 📝 Notes Techniques

### Champs Utilisés :
- **Backend** : `user.lieuResidence1` ou `user.lieu1` (quartier de l'utilisateur)
- **Frontend** : `userData.quartierCode` (code du quartier)
- **Groupe** : `group.location` (code du quartier du groupe)

### Vérifications :
1. **Backend** : Vérifie `group.location === userQuartierCode`
2. **Frontend** : Filtre les groupes avec `g.location === userData.quartierCode`
3. **Frontend** : Vérifie avant envoi que le groupe sélectionné correspond au quartier

## ✅ Résultat

- ✅ Les utilisateurs ne peuvent publier que dans leur quartier sur Terre Adam
- ✅ Réduction des données inutiles (pas de publications dans tous les quartiers)
- ✅ Contrôle total pour l'admin (peut publier partout et donner des droits)
- ✅ Messages clairs pour les utilisateurs

---

**Date de création** : $(date)
**Statut** : ✅ Restrictions implémentées
