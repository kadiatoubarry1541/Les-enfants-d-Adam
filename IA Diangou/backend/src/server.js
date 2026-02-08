import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from '../config/database.js';
import authRoutes from './routes/auth.js';
import educationRoutes from './routes/education.js';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration dotenv
dotenv.config({ path: path.join(path.dirname(__dirname), 'config.env') });

const app = express();
const PORT = process.env.PORT || config.PORT || 5003;

// Connexion à la base de données
connectDB().then((db) => {
  if (db) {
    console.log('✅ Base de données connectée et prête');
  } else {
    console.log('⚠️ Base de données non connectée - Mode développement sans DB');
    console.log('⚠️ Les fonctionnalités nécessitant la base de données ne fonctionneront pas');
  }
}).catch((error) => {
  console.error('❌ Erreur de connexion à la base de données:', error.message);
  console.log('⚠️ Le serveur continue en mode développement sans DB');
  console.log('⚠️ Redémarrez le serveur après avoir corrigé la configuration');
});

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par windowMs
});
app.use('/api/', limiter);

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (uploads)
const uploadsPath = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api/education', authRoutes); // Routes d'inscription
app.use('/api/education', educationRoutes); // Routes d'éducation

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'IA Diangou API is running',
    database: 'diangou',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API IA Diangou',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: {
        professeur: 'POST /api/education/register/professeur',
        parent: 'POST /api/education/register/parent',
        apprenant: 'POST /api/education/register/apprenant'
      },
      education: '/api/education'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  console.error('📍 URL:', req.url);
  console.error('📍 Méthode:', req.method);
  if (err.stack) {
    console.error('📍 Stack trace:', err.stack);
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.toString()
    })
  });
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur IA Diangou démarré sur le port ${PORT}`);
  console.log(`📊 Base de données: diangou`);
  console.log(`🌐 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

