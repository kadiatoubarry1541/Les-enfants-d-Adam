import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger le même fichier d'env que le serveur (backend/config.env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

// Configuration de la base de données PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'enfants_adam_eve',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
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

// Fonction pour tester la connexion
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connecté avec succès');
    
    // Synchroniser les modèles avec la base de données
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Modèles synchronisés avec la base de données');
    }
    
    return sequelize;
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    console.log('🔄 Mode développement: Utilisation de la mémoire locale');
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