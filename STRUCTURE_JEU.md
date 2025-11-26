# Structure du Jeu "Défi éducatif"

## ✅ Structure actuelle (conforme au cahier des charges)

### 1. **Création du jeu** (Menu)
- ✅ Un joueur crée un jeu
- ✅ Optionnel : désigner un jury (numeroH)
- ✅ Dépôt initial : 50 000 FG créé automatiquement
- ✅ Le créateur devient automatiquement "Player 1"
- ✅ Statut initial : `waiting` (en attente)

### 2. **Rejoindre un jeu** (Menu)
- ✅ D'autres joueurs peuvent rejoindre
- ✅ Le 2ème joueur devient "Player 2"
- ✅ Les suivants sont "guest" (invités)

### 3. **Démarrer le jeu** (Menu)
- ✅ Nécessite au moins 2 joueurs
- ✅ Le créateur ou le jury peut démarrer
- ✅ Statut passe à `active`
- ✅ Le premier joueur (Player 1) commence à poser une question

### 4. **Pendant le jeu** (Vue Player)

#### Cycle de jeu :
1. **Joueur actif pose une question** (texte, audio ou vidéo)
   - La question est en statut `pending`
   - Cycle actuel : `currentCycle`

2. **Les autres joueurs répondent** (ou refusent volontairement)
   - Réponse : texte, audio ou vidéo
   - Refus volontaire : pénalité immédiate de -10 000 FG
   - Statut réponse : `pending` (en attente de validation)

3. **Le jury valide les réponses**
   - ✅ Correct : +10 000 FG (gain)
   - ❌ Faux : -5 000 FG (pénalité)
   - ❌ Refusé : -5 000 FG (pénalité)

4. **Fin du cycle**
   - Quand toutes les réponses sont validées
   - Passage au joueur suivant
   - Incrémentation du cycle si retour au Player 1

### 5. **Règles financières**
- ✅ Dépôt initial : 50 000 FG
- ✅ Gains (bonne réponse) : +10 000 FG
- ✅ Pénalités (mauvaise réponse) : -5 000 FG
- ✅ Refus volontaire : -10 000 FG
- ✅ Limite de dettes : maximum 2 fois
- ✅ Recharge : une seule personne peut recharger le dépôt

### 6. **Vue Jury** (si vous êtes le jury)
- ✅ Voir toutes les questions en attente
- ✅ Voir toutes les réponses en attente de validation
- ✅ Valider chaque réponse (correct/wrong/refuse)
- ✅ Voir l'historique des transactions

## 📊 Structure des données

### Tables principales :
1. **games** : Jeu principal
   - status, currentPlayerTurn, currentCycle, depositAmount, juryNumeroH

2. **game_players** : Joueurs
   - numeroH, role (player1/player2/guest), balance, debtCount

3. **game_questions** : Questions
   - askedBy, questionType, questionContent, cycleNumber, status

4. **game_answers** : Réponses
   - answerContent, isVoluntaryRefusal, status, pointsEarned

5. **game_deposits** : Dépôt
   - initialAmount, currentAmount, totalGainsPaid, totalPenaltiesReceived

6. **game_transactions** : Historique
   - transactionType, amount, playerBalanceBefore/After, depositAmountBefore/After

## 🎯 Flux normal du jeu

```
1. Menu → Créer un jeu
   ↓
2. Menu → (Optionnel) Désigner un jury
   ↓
3. Menu → D'autres joueurs rejoignent
   ↓
4. Menu → Démarrer le jeu (créateur ou jury)
   ↓
5. Vue Player → Joueur actif pose une question
   ↓
6. Vue Player → Autres joueurs répondent
   ↓
7. Vue Jury → Jury valide les réponses
   ↓
8. Vue Player → Passage au joueur suivant
   ↓
9. Retour à l'étape 5 (nouveau cycle)
```

## ✅ Points conformes au cahier des charges

- ✅ Jury humain unique
- ✅ Dépôt central de 50 000 FG
- ✅ Système de gains/pertes
- ✅ Limite de dettes (max 2)
- ✅ Cycles de jeu
- ✅ Tour par tour
- ✅ Questions/réponses multimédia
- ✅ Validation par jury
- ✅ Historique des transactions
- ✅ Recharge du dépôt

## 🔍 Points à vérifier

1. **Est-ce normal de créer directement depuis le menu ?**
   - ✅ OUI : C'est la structure normale
   - Le menu permet de créer, rejoindre ou démarrer un jeu

2. **Le jeu est-il créé immédiatement ?**
   - ✅ OUI : Le jeu est créé avec le statut `waiting`
   - Il faut ensuite le démarrer pour qu'il passe à `active`

3. **Le dépôt est-il créé automatiquement ?**
   - ✅ OUI : Le dépôt de 50 000 FG est créé automatiquement lors de la création du jeu

4. **Le créateur devient-il Player 1 automatiquement ?**
   - ✅ OUI : Le créateur est automatiquement ajouté comme Player 1

## 📝 Conclusion

**OUI, c'est normal que le jeu se structure comme ça dès le départ !**

La structure actuelle est conforme au cahier des charges :
- Création simple depuis le menu
- Gestion automatique du dépôt et des joueurs
- Système de cycles et de tours
- Validation par jury
- Règles financières correctes

Le jeu est prêt à être utilisé dès sa création, il faut juste :
1. Créer le jeu
2. (Optionnel) Désigner un jury
3. Attendre que d'autres joueurs rejoignent
4. Démarrer le jeu
5. Commencer à jouer !

