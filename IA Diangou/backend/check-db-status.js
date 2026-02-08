// Script pour vérifier l'état de la base de données
import { sequelize } from './config/database.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

async function checkDatabase() {
  console.log('🔄 Vérification de la base de données...\n');
  
  try {
    // Test de connexion
    console.log('1️⃣ Test de connexion...');
    await sequelize.authenticate();
    console.log('   ✅ Connexion réussie\n');

    // Test de requête
    console.log('2️⃣ Test de requête...');
    const userCount = await User.count();
    console.log(`   ✅ Nombre d'utilisateurs: ${userCount}\n`);

    // Test de création (test uniquement, pas de sauvegarde)
    console.log('3️⃣ Test de modèle...');
    const testUser = User.build({
      numeroH: 'TEST001',
      email: 'test@test.com',
      password: 'test',
      prenom: 'Test',
      nomFamille: 'User',
      role: 'apprenant'
    });
    console.log('   ✅ Modèle User fonctionne\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ BASE DE DONNÉES FONCTIONNE PARFAITEMENT !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('   Code:', error.code || 'N/A');
    console.error('   Type:', error.name || 'N/A');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 PostgreSQL n\'est pas démarré');
    } else if (error.code === '28P01') {
      console.error('\n💡 Mot de passe incorrect');
    } else if (error.code === '3D000') {
      console.error('\n💡 Base de données "diangou" n\'existe pas');
    } else {
      console.error('\n💡 Détails:', error);
    }
    
    process.exit(1);
  }
}

checkDatabase();

