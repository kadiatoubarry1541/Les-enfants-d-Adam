# Modèles Game - Défi éducatif

## Description
Ce dossier contient tous les modèles de base de données pour le système "Défi éducatif".

## Modèles

### 1. Game (games)
Le jeu principal
- `id`: Identifiant unique
- `status`: État du jeu (waiting, active, paused, finished)
- `currentPlayerTurn`: NumeroH du joueur qui doit poser la question
- `currentCycle`: Numéro du cycle actuel
- `depositAmount`: Montant du dépôt (50 000 FG par défaut)
- `juryNumeroH`: NumeroH du jury unique
- `createdBy`: NumeroH du créateur

### 2. GamePlayer (game_players)
Les joueurs du jeu
- `id`: Identifiant unique
- `gameId`: Référence au jeu
- `numeroH`: NumeroH du joueur
- `role`: Rôle (player1, player2, guest)
- `balance`: Solde du joueur (peut être négatif)
- `debtCount`: Nombre de dettes (max 2)
- `isActive`: Actif ou non

### 3. GameQuestion (game_questions)
Les questions posées
- `id`: Identifiant unique
- `gameId`: Référence au jeu
- `askedBy`: NumeroH du joueur qui a posé la question
- `questionType`: Type (text, audio, video)
- `questionContent`: Contenu de la question
- `questionMediaUrl`: URL du média (si audio/vidéo)
- `cycleNumber`: Numéro du cycle
- `status`: État (pending, answered, validated, closed)

### 4. GameAnswer (game_answers)
Les réponses des joueurs
- `id`: Identifiant unique
- `gameId`: Référence au jeu
- `questionId`: Référence à la question
- `playerId`: Référence au joueur
- `numeroH`: NumeroH du joueur qui a répondu
- `answerContent`: Contenu de la réponse
- `isVoluntaryRefusal`: True si refus volontaire
- `status`: État après validation (pending, validated_correct, validated_wrong, refused)
- `pointsEarned`: Points gagnés/perdus (+10000, -5000, -10000)
- `validatedBy`: NumeroH du jury qui a validé

### 5. GameDeposit (game_deposits)
Le dépôt du jeu
- `id`: Identifiant unique
- `gameId`: Référence au jeu (unique)
- `initialAmount`: Montant initial (50 000 FG)
- `currentAmount`: Montant actuel
- `totalGainsPaid`: Total des gains payés
- `totalPenaltiesReceived`: Total des pénalités reçues
- `lastRechargeBy`: NumeroH de la personne qui a rechargé
- `lastRechargeDate`: Date de la dernière recharge
- `lastRechargeAmount`: Montant de la dernière recharge

### 6. GameTransaction (game_transactions)
Historique de toutes les transactions
- `id`: Identifiant unique
- `gameId`: Référence au jeu
- `playerId`: Référence au joueur (null pour les transactions de dépôt)
- `answerId`: Référence à la réponse
- `transactionType`: Type (gain, penalty, deposit_recharge, deposit_payment, voluntary_refusal)
- `amount`: Montant
- `playerBalanceBefore`: Solde avant
- `playerBalanceAfter`: Solde après
- `depositAmountBefore`: Dépôt avant
- `depositAmountAfter`: Dépôt après
- `description`: Description
- `validatedBy`: NumeroH du jury

## Installation

### Automatique (Recommandé)
Les modèles sont automatiquement initialisés au démarrage du serveur via `backend/src/config/database.js`.

### Manuelle
Si les tables ne sont pas créées automatiquement, exécutez le script SQL :
```bash
psql -U postgres -d enfants_adam_eve -f backend/src/models/gameModels.sql
```

## Vérification

Pour vérifier que tout fonctionne :
```javascript
import { verifyAndInitGameModels } from './models/verifyGameModels.js';
await verifyAndInitGameModels();
```

## Associations

- Game → GamePlayer (hasMany)
- Game → GameQuestion (hasMany)
- Game → GameDeposit (hasOne)
- Game → User (belongsTo, jury)
- GamePlayer → Game (belongsTo)
- GamePlayer → User (belongsTo)
- GamePlayer → GameAnswer (hasMany)
- GameQuestion → Game (belongsTo)
- GameQuestion → User (belongsTo, asker)
- GameQuestion → GameAnswer (hasMany)
- GameAnswer → Game (belongsTo)
- GameAnswer → GameQuestion (belongsTo)
- GameAnswer → GamePlayer (belongsTo)
- GameAnswer → User (belongsTo, answerer)
- GameDeposit → Game (belongsTo)
- GameDeposit → User (belongsTo, recharger)
- GameTransaction → Game (belongsTo)
- GameTransaction → GamePlayer (belongsTo)
- GameTransaction → GameAnswer (belongsTo)

## Notes importantes

1. **Dépôt** : Le dépôt ne peut jamais dépasser la somme initiale + flux réels
2. **Dettes** : Un joueur peut être endetté maximum 2 fois
3. **Transactions atomiques** : Toutes les transactions sont atomiques (pas de perte d'argent)
4. **Validation** : Seul le jury peut valider les réponses

