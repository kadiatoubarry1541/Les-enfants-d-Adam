# Améliorations du Système de Jeu - Cahier des Charges

## ✅ Améliorations Apportées

### 1. **Gestion du Dépôt Central (50 000 FG)**

#### Problème identifié :
- Le dépôt pouvait théoriquement dépasser 50 000 sans contrôle strict
- La logique de plafond n'était pas clairement implémentée

#### Solution implémentée :
- ✅ **Limite stricte du dépôt** : Le dépôt ne peut jamais dépasser `initialAmount` (50 000) lors des pénalités
- ✅ **Calcul correct** : `currentAmount = min(initialAmount, depositBefore + pénalités)`
- ✅ **Gestion de la recharge** : Si recharge explicite, l'`initialAmount` est mis à jour pour permettre la recharge au-delà de 50 000 (fonctionnalité admin)

**Fichier modifié** : `backend/src/routes/defiEducatif.js`
- Fonction `applyFinancialTransaction()` : ligne 666-667
- Fonction `applyVoluntaryRefusalPenalty()` : ligne 593-594
- Fonction de recharge : ligne 854-856

---

### 2. **Gestion Complète des Cycles de Jeu**

#### Problème identifié :
- Pas de passage automatique au joueur suivant après validation complète
- Le cycle n'était pas incrémenté correctement

#### Solution implémentée :
- ✅ **Fonction `moveToNextPlayer()`** : Passe automatiquement au joueur suivant après validation complète
- ✅ **Incrémentation du cycle** : Le cycle s'incrémente quand on revient au premier joueur
- ✅ **Ordre des joueurs** : Basé sur `joinedAt` (ordre d'arrivée)

**Fichier modifié** : `backend/src/routes/defiEducatif.js`
- Nouvelle fonction `moveToNextPlayer()` : ligne 623-652
- Intégration dans la validation : ligne 555

---

### 3. **Logique de Dette (Max 2 fois)**

#### Problème identifié :
- La logique de comptage des dettes n'était pas précise
- Pas de vérification stricte avant la 3ème dette

#### Solution implémentée :
- ✅ **Vérification stricte** : Vérifie `debtCount >= 2` AVANT d'appliquer une pénalité qui créerait une dette
- ✅ **Comptage correct** : Incrémente `debtCount` uniquement quand on passe de positif à négatif
- ✅ **Refus de pénalité** : Si 3ème dette, la pénalité est refusée avec message d'erreur clair

**Fichier modifié** : `backend/src/routes/defiEducatif.js`
- Fonction `applyFinancialTransaction()` : ligne 626-643
- Fonction `applyVoluntaryRefusalPenalty()` : ligne 565-578

---

### 4. **Validation Complète Avant Passage au Tour Suivant**

#### Problème identifié :
- Pas de vérification que TOUS les joueurs ont répondu avant validation
- Le passage au tour suivant pouvait se faire avant validation complète

#### Solution implémentée :
- ✅ **Vérification des joueurs** : Vérifie que tous les joueurs actifs (sauf celui qui pose la question) ont répondu
- ✅ **Validation complète** : Passe au joueur suivant uniquement si toutes les réponses sont validées
- ✅ **Statut de question** : Marque la question comme "validated" seulement quand toutes les réponses sont validées

**Fichier modifié** : `backend/src/routes/defiEducatif.js`
- Route de validation : ligne 534-564
- Vérification des joueurs : ligne 538-545
- Vérification des réponses : ligne 555-564

---

### 5. **Nouvelle Route pour le Jury**

#### Ajout :
- ✅ **Route `/games/:id/pending-answers`** : Permet au jury de récupérer toutes les réponses en attente de validation
- ✅ **Sécurité** : Vérification que l'utilisateur est bien le jury
- ✅ **Données complètes** : Retourne les questions avec les réponses en attente et les infos des joueurs

**Fichier modifié** : `backend/src/routes/defiEducatif.js`
- Nouvelle route : ligne 873-936

---

## 📋 Règles Financières Implémentées

### Dépôt Initial
- ✅ Toujours ≥ 50 000 au démarrage
- ✅ Sert à payer les gains des joueurs

### Gains et Pertes
- ✅ **Bonne réponse** : +10 000 (prélevé sur le dépôt)
- ✅ **Mauvaise réponse** : -5 000 (crédité au dépôt)
- ✅ **Refus volontaire** : -10 000 (crédité au dépôt, appliqué immédiatement)

### Gestion des Dettes
- ✅ **Max 2 dettes** : Un joueur peut être endetté maximum 2 fois
- ✅ **3ème dette refusée** : Si un joueur a déjà 2 dettes, la 3ème pénalité est refusée
- ✅ **Comptage correct** : Une dette est comptée uniquement quand on passe de positif à négatif

### Limite du Dépôt
- ✅ **Jamais plus de 50 000** : Le dépôt ne peut pas dépasser l'initialAmount lors des pénalités
- ✅ **Recharge possible** : L'admin peut recharger, ce qui met à jour l'initialAmount

---

## 🎮 Règles de Jeu Implémentées

### Tours et Cycles
- ✅ **Cycles** : Le jeu se déroule en cycles
- ✅ **Passage automatique** : Après validation complète, passage au joueur suivant
- ✅ **Ordre des joueurs** : Basé sur l'ordre d'arrivée (`joinedAt`)

### Questions
- ✅ **Types supportés** : texte, audio, vidéo
- ✅ **Question en attente** : Une seule question en attente à la fois
- ✅ **Statut** : pending → answered → validated

### Réponses
- ✅ **Réponse individuelle** : Chaque joueur répond individuellement
- ✅ **Validation obligatoire** : Le jury doit valider avant que l'argent ne bouge
- ✅ **Refus volontaire** : Pénalité appliquée immédiatement (-10 000)

### Validation par le Jury
- ✅ **Validation unique** : Un seul jury humain peut se connecter
- ✅ **Choix possibles** : correct, wrong, refuse
- ✅ **Déclenchement financier** : Les décisions du jury déclenchent les transactions

---

## 🔒 Sécurité et Transactions Atomiques

### Transactions Atomiques
- ✅ **Toutes les opérations financières** sont dans des transactions
- ✅ **Rollback automatique** en cas d'erreur
- ✅ **Pas de perte d'argent** : Les transactions sont atomiques

### Protection du Dépôt
- ✅ **Pas de manipulation** : Les joueurs ne peuvent pas manipuler le dépôt
- ✅ **Vérifications strictes** : Vérification des permissions pour chaque action

---

## 📝 Points d'Attention

### Dépôt et Recharge
- Le cahier des charges dit "jamais plus de 50 000" mais permet aussi la recharge
- **Solution** : Le dépôt ne dépasse jamais l'`initialAmount` lors des pénalités, mais peut être rechargé par l'admin (ce qui met à jour l'`initialAmount`)

### Dettes
- La 3ème dette est **refusée** (pas annulée), ce qui signifie que le joueur ne peut pas subir une pénalité s'il n'a pas assez d'argent après 2 dettes

### Validation Complète
- Le passage au joueur suivant se fait uniquement quand **toutes** les réponses sont validées
- Si un joueur n'a pas encore répondu, la validation attend

---

## 🚀 Prochaines Étapes Recommandées

1. **WebSocket pour temps réel** : Ajouter un système WebSocket pour les mises à jour en temps réel
2. **Interface jury améliorée** : Créer une interface dédiée pour le jury avec toutes les réponses en attente
3. **Animations et notifications** : Ajouter des animations pour les gains/pertes dans le frontend
4. **Tests unitaires** : Ajouter des tests pour valider toutes les règles financières

---

## 📄 Fichiers Modifiés

- `backend/src/routes/defiEducatif.js` : Toutes les améliorations principales

---

*Document créé le : $(date)*







