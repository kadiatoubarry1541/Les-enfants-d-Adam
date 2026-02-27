import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger le même fichier d'env que le serveur (backend/config.env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

// Configuration de la base de données PostgreSQL
// Support pour Neon (URL de connexion complète) ou configuration classique
let sequelize;

if (process.env.DATABASE_URL) {
  // Utiliser l'URL de connexion complète (format Neon)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Nécessaire pour Neon
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
  // Configuration classique avec variables individuelles
  sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'enfants_adam_eve',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
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

const MAX_DB_RETRIES = 5;
const DB_RETRY_DELAY_MS = 2000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Fonction pour tester la connexion (avec retries pour éviter les échecs temporaires)
const connectDB = async () => {
  let lastError;
  for (let attempt = 1; attempt <= MAX_DB_RETRIES; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('✅ PostgreSQL connecté avec succès');
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('🔄 Modèles synchronisés avec la base de données');
      }
      return sequelize;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_DB_RETRIES) {
        console.warn(`⚠️ Connexion PostgreSQL (tentative ${attempt}/${MAX_DB_RETRIES}), nouvel essai dans ${DB_RETRY_DELAY_MS / 1000}s…`);
        await sleep(DB_RETRY_DELAY_MS);
      }
    }
  }
  console.error('❌ Connexion PostgreSQL impossible après', MAX_DB_RETRIES, 'tentatives.');
  console.error('   Dernière erreur:', lastError?.message || lastError);
  console.error('💡 Vérifiez que PostgreSQL tourne et que backend/config.env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) est correct.');
  console.error(‘💡 Si l\’erreur parle d\’une colonne manquante : cd backend puis npm run fix-page-admins puis npm run fix-users-table’)
  console.error(‘💡 Si l\’erreur parle d\’une valeur ENUM manquante (ex: ngo) : cd backend puis npm run fix-pro-enum’);
  throw lastError;
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