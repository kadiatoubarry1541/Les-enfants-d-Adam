import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './config/database.js';
import User from './src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

async function testConnection() {
  try {
    console.log('🔄 Test de connexion à la base de données...');
    console.log('📍 Configuration:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'diangou',
      user: process.env.DB_USER || 'postgres',
      hasPassword: !!process.env.DB_PASSWORD,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    });

    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés');

    // Tester la recherche d'un utilisateur
    const testUser = await User.findOne({ limit: 1 });
    console.log('✅ Test de lecture de la base de données réussi');
    
    if (testUser) {
      console.log('📋 Utilisateur trouvé:', {
        numeroH: testUser.numeroH,
        email: testUser.email,
        role: testUser.role
      });
    } else {
      console.log('ℹ️ Aucun utilisateur trouvé dans la base de données');
    }

    await sequelize.close();
    console.log('✅ Test terminé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.stack) {
      console.error('📍 Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

testConnection();

