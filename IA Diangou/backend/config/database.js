import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger le fichier d'env (IA Diangou/config.env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

// Configuration de la base de données PostgreSQL pour "diangou"
let sequelize;

if (process.env.DATABASE_URL) {
  // Utiliser l'URL de connexion complète (format Neon)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
} else {
  // Configuration classique avec variables individuelles - BASE DE DONNÉES "diangou"
  // S'assurer que le mot de passe est toujours une chaîne de caractères
  const dbPassword = process.env.DB_PASSWORD !== undefined ? String(process.env.DB_PASSWORD) : '';
  
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'diangou', // BASE DE DONNÉES DIANGOU
    username: process.env.DB_USER || 'postgres',
    password: dbPassword,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech') ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
}

// Fonction pour tester la connexion
const connectDB = async () => {
  try {
    console.log('🔄 Tentative de connexion à PostgreSQL...');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 5432}`);
    console.log(`   Database: ${process.env.DB_NAME || 'diangou'}`);
    console.log(`   User: ${process.env.DB_USER || 'postgres'}`);
    
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connecté avec succès à la base de données "diangou"');
    
    // Synchroniser les modèles avec la base de données
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Synchronisation des modèles...');
      await sequelize.sync({ alter: true });
      console.log('✅ Modèles synchronisés avec la base de données "diangou"');
    }
    
    return sequelize;
  } catch (error) {
    console.error('\n❌ Erreur de connexion PostgreSQL:', error.message);
    console.error('   Code:', error.code || 'N/A');
    console.error('   Type:', error.name || 'N/A');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 PostgreSQL n\'est pas démarré ou n\'écoute pas sur le port', process.env.DB_PORT || 5432);
      console.error('   Solution: Démarrez le service PostgreSQL');
    } else if (error.code === '28P01') {
      console.error('\n💡 Mot de passe incorrect pour l\'utilisateur', process.env.DB_USER || 'postgres');
      console.error('   Solution: Vérifiez DB_PASSWORD dans config.env');
    } else if (error.code === '3D000') {
      console.error('\n💡 La base de données "' + (process.env.DB_NAME || 'diangou') + '" n\'existe pas');
      console.error('   Solution: Créez-la avec CREATE DATABASE diangou;');
    } else {
      console.error('\n💡 Pour configurer la base de données:');
      console.error('   1. Créez/modifiez le fichier backend/config.env');
      console.error('   2. Configurez DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
      console.error('   3. Ou utilisez DATABASE_URL pour une connexion complète');
      console.error('   4. Assurez-vous que PostgreSQL est installé et démarré');
    }
    
    console.log('\n🔄 Mode développement: L\'application continue sans base de données');
    return null;
  }
};

// Fonction pour fermer la connexion
const closeDB = async () => {
  try {
    await sequelize.close();
    console.log('✅ Connexion PostgreSQL fermée');
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture:', error.message);
  }
};

export { sequelize, connectDB, closeDB };
export default connectDB;

