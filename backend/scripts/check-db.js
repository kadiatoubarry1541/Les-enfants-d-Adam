import { sequelize, connectDB } from '../src/config/database.js';
import { initGameModels, syncGameModels } from '../src/models/initGameModels.js';

async function checkDatabase() {
  try {
    console.log('🔍 Vérification de la base de données...\n');
    
    // Tester la connexion
    console.log('1️⃣ Test de connexion...');
    await connectDB();
    console.log('✅ Connexion réussie\n');
    
    // Initialiser les modèles
    console.log('2️⃣ Initialisation des modèles Game...');
    initGameModels();
    console.log('✅ Modèles initialisés\n');
    
    // Vérifier les tables
    console.log('3️⃣ Vérification des tables...');
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📊 Tables trouvées:', tables.length);
    tables.forEach(table => console.log(`   - ${table}`));
    console.log('');
    
    // Vérifier les tables Game spécifiques
    const gameTables = ['games', 'game_players', 'game_questions', 'game_answers', 'game_deposits', 'game_transactions'];
    console.log('4️⃣ Vérification des tables Game...');
    for (const table of gameTables) {
      const exists = tables.includes(table);
      if (exists) {
        console.log(`   ✅ ${table} existe`);
      } else {
        console.log(`   ❌ ${table} n'existe pas`);
      }
    }
    console.log('');
    
    // Synchroniser les modèles si nécessaire
    console.log('5️⃣ Synchronisation des modèles...');
    await syncGameModels({ alter: true });
    console.log('✅ Synchronisation terminée\n');
    
    // Test de requête simple
    console.log('6️⃣ Test de requête...');
    const { Game } = await import('../src/models/index.js');
    const gameCount = await Game.count();
    console.log(`✅ Nombre de jeux dans la base: ${gameCount}\n`);
    
    console.log('✅ Tous les tests sont passés ! La base de données fonctionne correctement.');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkDatabase();


