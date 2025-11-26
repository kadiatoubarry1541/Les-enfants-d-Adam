import { sequelize } from '../config/database.js';
import { initGameModels } from './initGameModels.js';
import { Game, GamePlayer, GameQuestion, GameAnswer, GameDeposit, GameTransaction } from './index.js';

/**
 * Fonction pour vérifier et initialiser les modèles Game
 * À appeler au démarrage du serveur
 */
export const verifyAndInitGameModels = async () => {
  try {
    console.log('🔍 Vérification des modèles Game...');
    
    // Initialiser les modèles
    initGameModels();
    
    // Vérifier que les modèles sont bien définis
    if (!Game || !GamePlayer || !GameQuestion || !GameAnswer || !GameDeposit || !GameTransaction) {
      throw new Error('Certains modèles Game ne sont pas définis');
    }
    
    // Tester la connexion à la base de données
    await sequelize.authenticate();
    
    // Vérifier que les tables existent
    const tables = [
      'games',
      'game_players',
      'game_questions',
      'game_answers',
      'game_deposits',
      'game_transactions'
    ];
    
    for (const table of tables) {
      const [results] = await sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        );`
      );
      
      const exists = results[0]?.exists;
      if (!exists) {
        console.warn(`⚠️ La table ${table} n'existe pas encore`);
        console.log(`💡 Exécutez le script SQL: backend/src/models/gameModels.sql`);
      } else {
        console.log(`✅ Table ${table} existe`);
      }
    }
    
    console.log('✅ Vérification des modèles Game terminée');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des modèles Game:', error);
    throw error;
  }
};

export default verifyAndInitGameModels;

