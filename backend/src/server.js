import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from '../config/database.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import badgeRoutes from './routes/badges.js';
import logoRoutes from './routes/logos.js';
import pageAdminRoutes from './routes/pageAdmins.js';
import governmentRoutes from './routes/governments.js';
import activityRoutes from './routes/activities.js';
import residenceRoutes from './routes/residences.js';
import educationRoutes from './routes/education.js';
import regionRoutes from './routes/regions.js';
import organizationRoutes from './routes/organizations.js';
import faithRoutes from './routes/faith.js';
import friendsRoutes from './routes/friends.js';
import additionalRoutes from './routes/additional.js';
import exchangeRoutes from './routes/exchange.js';
import documentRoutes from './routes/documents.js';
import defiEducatifRoutes from './routes/defiEducatif.js';
import familyRoutes from './routes/family.js';
import familyTreeRoutes from './routes/familyTree.js';
import parentChildRoutes from './routes/parentChild.js';
import coupleRoutes from './routes/couple.js';
import scienceRoutes from './routes/science.js';
import realityRoutes from './routes/reality.js';
import stateMessagesRoutes from './routes/stateMessages.js';
import stateProductsRoutes from './routes/stateProducts.js';
import userStoriesRoutes from './routes/userStories.js';
import { handleUploadError } from './middleware/upload.js';
import { config } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration dotenv
dotenv.config({ path: path.join(path.dirname(__dirname), 'config.env') });

const app = express();
const PORT = process.env.PORT || config.PORT || 5002;

// Connexion à la base de données (async)
connectDB().catch(error => {
  console.error('❌ Erreur lors de la connexion à la base de données:', error);
  console.error('⚠️ Le serveur démarre quand même, mais certaines fonctionnalités peuvent ne pas fonctionner');
  // Le serveur démarre quand même pour permettre les tests
});

// Middleware de sécurité
app.use(helmet());

// Configuration CORS (autorise plusieurs origines localhost + production)
const allowedOrigins = [
  config.FRONTEND_URL,
  process.env.CORS_ORIGIN, // URL de production depuis les variables d'environnement
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  'http://127.0.0.1:5177',
  'http://127.0.0.1:5178',
  'http://127.0.0.1:5179'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // En production, autoriser toutes les origines si CORS_ORIGIN n'est pas défini
    if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
      return callback(null, true);
    }
    if (!origin) return callback(null, true); // requêtes same-origin ou outils
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // En développement, être plus strict
    if (process.env.NODE_ENV === 'development') {
    return callback(new Error('Not allowed by CORS'));
    }
    // En production, autoriser si l'origine correspond au pattern
    return callback(null, true);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par IP toutes les 15 minutes
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});
app.use(limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware pour gérer les erreurs d'upload
app.use(handleUploadError);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/logos', logoRoutes);
app.use('/api/page-admins', pageAdminRoutes);
app.use('/api/governments', governmentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/residences', residenceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/faith', faithRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/defi-educatif', defiEducatifRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/family-tree', familyTreeRoutes);
app.use('/api/parent-child', parentChildRoutes);
app.use('/api/couple', coupleRoutes);
app.use('/api/science', scienceRoutes);
app.use('/api/reality', realityRoutes);
app.use('/api/state-messages', stateMessagesRoutes);
app.use('/api/state-products', stateProductsRoutes);
app.use('/api/user-stories', userStoriesRoutes);
app.use('/api', additionalRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serveur fonctionnel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route pour servir les fichiers uploadés
app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }
  });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📁 Dossier uploads: ${path.join(__dirname, '../uploads')}`);
});

export default app;
