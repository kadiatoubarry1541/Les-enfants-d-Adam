import { sequelize } from '../config/database.js';
import Game from './Game.js';
import GamePlayer from './GamePlayer.js';
import GameQuestion from './GameQuestion.js';
import GameAnswer from './GameAnswer.js';
import GameDeposit from './GameDeposit.js';
import GameTransaction from './GameTransaction.js';
import { User } from './index.js';

// Initialiser tous les modèles Game
export const initGameModels = () => {
  // Initialiser les modèles
  Game.init(sequelize);
  GamePlayer.init(sequelize);
  GameQuestion.init(sequelize);
  GameAnswer.init(sequelize);
  GameDeposit.init(sequelize);
  GameTransaction.init(sequelize);

  // Définir les associations
  const models = {
    Game,
    GamePlayer,
    GameQuestion,
    GameAnswer,
    GameDeposit,
    GameTransaction,
    User
  };

  // Appeler associate pour chaque modèle
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  console.log('✅ Modèles Game initialisés avec succès');
  
  return models;
};

// Fonction pour synchroniser les modèles Game avec la base de données
export const syncGameModels = async (options = {}) => {
  try {
    const syncOptions = {
      alter: true,
      ...options
    };

    // Synchroniser dans l'ordre des dépendances
    await Game.sync(syncOptions);
    await GamePlayer.sync(syncOptions);
    await GameQuestion.sync(syncOptions);
    await GameAnswer.sync(syncOptions);
    await GameDeposit.sync(syncOptions);
    await GameTransaction.sync(syncOptions);

    console.log('✅ Modèles Game synchronisés avec la base de données');
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation des modèles Game:', error);
    throw error;
  }
};

export default initGameModels;

