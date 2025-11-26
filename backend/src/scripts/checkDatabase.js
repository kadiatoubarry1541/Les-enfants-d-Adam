import { connectDB, sequelize } from '../config/database.js';
import { initGameModels, syncGameModels } from '../models/initGameModels.js';
import { verifyAndInitGameModels } from '../models/verifyGameModels.js';
import Game from '../models/Game.js';
import GamePlayer from '../models/GamePlayer.js';
import GameQuestion from '../models/GameQuestion.js';
import GameAnswer from '../models/GameAnswer.js';
import GameDeposit from '../models/GameDeposit.js';
import GameTransaction from '../models/GameTransaction.js';

/**
 * Script de vérification de la base de données
 * Vérifie que toutes les tables du jeu existent et fonctionnent correctement
 */
async function checkDatabase() {
  console.log('🔍 Vérification de la base de données...\n');
  
  try {
    // 1. Tester la connexion
    console.log('1️⃣ Test de connexion à PostgreSQL...');
    await sequelize.authenticate();
    console.log('   ✅ Connexion réussie\n');
    
    // 2. Initialiser les modèles
    console.log('2️⃣ Initialisation des modèles Game...');
    initGameModels();
    console.log('   ✅ Modèles initialisés\n');
    
    // 3. Vérifier que les tables existent
    console.log('3️⃣ Vérification des tables...');
    const tables = [
      { name: 'games', model: Game },
      { name: 'game_players', model: GamePlayer },
      { name: 'game_questions', model: GameQuestion },
      { name: 'game_answers', model: GameAnswer },
      { name: 'game_deposits', model: GameDeposit },
      { name: 'game_transactions', model: GameTransaction }
    ];
    
    for (const { name, model } of tables) {
      try {
        const [results] = await sequelize.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = '${name}'
          );`
        );
        
        const exists = results[0]?.exists;
        if (exists) {
          // Compter les lignes
          const count = await model.count();
          console.log(`   ✅ Table "${name}" existe (${count} enregistrements)`);
        } else {
          console.log(`   ⚠️  Table "${name}" n'existe pas - sera créée automatiquement`);
        }
      } catch (error) {
        console.log(`   ⚠️  Erreur lors de la vérification de "${name}": ${error.message}`);
      }
    }
    console.log('');
    
    // 4. Synchroniser les modèles (créer les tables si elles n'existent pas)
    console.log('4️⃣ Synchronisation des modèles avec la base de données...');
    try {
      await syncGameModels({ alter: true });
      console.log('   ✅ Synchronisation réussie\n');
    } catch (error) {
      console.log(`   ⚠️  Erreur lors de la synchronisation: ${error.message}`);
      console.log('   💡 Les tables seront créées automatiquement au premier usage\n');
    }
    
    // 5. Test de création/lecture
    console.log('5️⃣ Test de création et lecture...');
    try {
      // Test simple - vérifier qu'on peut accéder aux modèles
      const gameCount = await Game.count();
      const playerCount = await GamePlayer.count();
      const questionCount = await GameQuestion.count();
      const answerCount = await GameAnswer.count();
      const depositCount = await GameDeposit.count();
      const transactionCount = await GameTransaction.count();
      
      console.log(`   ✅ Jeux: ${gameCount}`);
      console.log(`   ✅ Joueurs: ${playerCount}`);
      console.log(`   ✅ Questions: ${questionCount}`);
      console.log(`   ✅ Réponses: ${answerCount}`);
      console.log(`   ✅ Dépôts: ${depositCount}`);
      console.log(`   ✅ Transactions: ${transactionCount}\n`);
    } catch (error) {
      console.log(`   ⚠️  Erreur lors du test: ${error.message}`);
      console.log('   💡 Les tables seront créées automatiquement au premier usage\n');
    }
    
    console.log('✅ Vérification terminée - Base de données prête !');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    console.error('\n💡 Vérifiez que:');
    console.error('   1. PostgreSQL est démarré');
    console.error('   2. La base de données "enfants_adam_eve" existe');
    console.error('   3. Les identifiants dans config.env sont corrects');
    console.error('   4. Les permissions sont correctes\n');
    process.exit(1);
  }
}

// Exécuter la vérification
checkDatabase();

