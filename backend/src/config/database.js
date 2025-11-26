import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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
    underscored: false,
    freezeTableName: true
  }
});

// Fonction pour tester la connexion
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connecté avec succès');
    
    // Initialiser et vérifier les modèles Game
    try {
      const { verifyAndInitGameModels } = await import('../models/verifyGameModels.js');
      await verifyAndInitGameModels();
      
    // Synchroniser les modèles avec la base de données
    if (process.env.NODE_ENV === 'development') {
        const { syncGameModels } = await import('../models/initGameModels.js');
      await sequelize.sync({ alter: true });
        await syncGameModels({ alter: true });
      console.log('🔄 Modèles synchronisés avec la base de données');
      }
    } catch (error) {
      console.warn('⚠️ Avertissement lors de l\'initialisation des modèles Game:', error.message);
      console.log('💡 Les tables seront créées automatiquement au premier usage');
      console.log('💡 Pour vérifier manuellement, exécutez: npm run check-db');
      // Continuer même si les modèles Game ne sont pas initialisés
      // Les tables seront créées automatiquement avec alter: true
    }
    
    return sequelize;
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    throw error; // Ne pas passer en mode mémoire locale
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