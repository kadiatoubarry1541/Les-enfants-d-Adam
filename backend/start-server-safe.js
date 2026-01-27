/**
 * Script de démarrage sécurisé du serveur
 * Ne bloque pas le démarrage même si la base de données échoue
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration dotenv
dotenv.config({ path: path.join(__dirname, 'config.env') });

const app = express();
const PORT = process.env.PORT || 5002;

console.log('🚀 Démarrage du serveur backend...');
console.log(`📡 Port configuré: ${PORT}`);

// CORS - Très permissif pour le développement
app.use(cors({
  origin: true, // Autoriser toutes les origines
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-numero-h']
}));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de santé - DOIT fonctionner même sans base de données
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serveur fonctionnel',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route de test simple
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test réussi',
    timestamp: new Date().toISOString()
  });
});

// Essayer de charger les routes seulement si la base de données fonctionne
let dbConnected = false;

async function tryLoadDatabase() {
  try {
    const connectDB = (await import('./src/config/database.js')).default;
    await connectDB();
    dbConnected = true;
    console.log('✅ Base de données connectée');
  } catch (error) {
    console.warn('⚠️ Base de données non connectée:', error.message);
    console.warn('⚠️ Le serveur démarre quand même, mais certaines fonctionnalités seront limitées');
    console.warn('💡 Vérifiez votre configuration dans config.env');
    console.warn('💡 Assurez-vous que DB_PASSWORD est défini et est une chaîne de caractères');
    dbConnected = false;
  }
  
  // Charger les routes dans tous les cas
  await loadRoutes();
}

async function loadRoutes() {
  // Routes qui ne nécessitent pas de base de données
  try {
    const authRoutes = (await import('./src/routes/auth.js')).default;
    app.use('/api/auth', authRoutes);
    console.log('✅ Routes auth chargées');
  } catch (error) {
    console.warn('⚠️ Routes auth non chargées:', error.message);
    if (error.message.includes('nodemailer')) {
      console.warn('💡 Installez nodemailer: npm install nodemailer');
    }
  }
  
  // Routes qui nécessitent la base de données (peuvent échouer)
  try {
    const adminRoutes = (await import('./src/routes/admin.js')).default;
    app.use('/api/admin', adminRoutes);
    console.log('✅ Routes admin chargées');
  } catch (error) {
    console.warn('⚠️ Routes admin non chargées:', error.message);
  }
  
  // Autres routes...
  try {
    const badgeRoutes = (await import('./src/routes/badges.js')).default;
    app.use('/api/badges', badgeRoutes);
    console.log('✅ Routes badges chargées');
  } catch (error) {
    console.warn('⚠️ Routes badges non chargées:', error.message);
  }
  
  try {
    const logoRoutes = (await import('./src/routes/logos.js')).default;
    app.use('/api/logos', logoRoutes);
    console.log('✅ Routes logos chargées');
  } catch (error) {
    console.warn('⚠️ Routes logos non chargées:', error.message);
  }
  
  try {
    const userRoutes = (await import('./src/routes/user.js')).default;
    app.use('/api/user', userRoutes);
    console.log('✅ Routes user chargées');
  } catch (error) {
    console.warn('⚠️ Routes user non chargées:', error.message);
  }
  
  try {
    const organizationRoutes = (await import('./src/routes/organizations.js')).default;
    app.use('/api/organizations', organizationRoutes);
    console.log('✅ Routes organizations chargées');
  } catch (error) {
    console.warn('⚠️ Routes organizations non chargées:', error.message);
  }
  
  // Charger les autres routes de manière sécurisée
  const otherRoutes = [
    { name: 'activities', path: './src/routes/activities.js', endpoint: '/api/activities' },
    { name: 'residences', path: './src/routes/residences.js', endpoint: '/api/residences' },
    { name: 'education', path: './src/routes/education.js', endpoint: '/api/education' },
    { name: 'regions', path: './src/routes/regions.js', endpoint: '/api/regions' },
    { name: 'faith', path: './src/routes/faith.js', endpoint: '/api/faith' },
    { name: 'friends', path: './src/routes/friends.js', endpoint: '/api/friends' },
    { name: 'exchange', path: './src/routes/exchange.js', endpoint: '/api/exchange' },
    { name: 'family', path: './src/routes/family.js', endpoint: '/api/family' },
  ];
  
  for (const route of otherRoutes) {
    try {
      const routeModule = (await import(route.path)).default;
      app.use(route.endpoint, routeModule);
      console.log(`✅ Routes ${route.name} chargées`);
    } catch (error) {
      console.warn(`⚠️ Routes ${route.name} non chargées:`, error.message);
    }
  }
}

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrer le serveur avec gestion d'erreur pour le port
const server = app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('✅ SERVEUR BACKEND DÉMARRÉ AVEC SUCCÈS');
  console.log('='.repeat(60));
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Base de données: ${dbConnected ? '✅ Connectée' : '⚠️ Non connectée'}`);
  console.log('');
  console.log('✅ Le serveur est maintenant accessible !');
  console.log('✅ Testez: http://localhost:' + PORT + '/api/health');
  console.log('='.repeat(60));
  console.log('');
});

// Gérer l'erreur de port déjà utilisé
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('');
    console.error('❌ ERREUR : Le port 5002 est déjà utilisé !');
    console.error('');
    console.error('🔧 SOLUTION :');
    console.error('1. Trouvez le processus qui utilise le port 5002 :');
    console.error('   netstat -ano | findstr :5002');
    console.error('');
    console.error('2. Tuez le processus (remplacez <PID> par le numéro trouvé) :');
    console.error('   taskkill /PID <PID> /F');
    console.error('');
    console.error('3. OU changez le port dans backend/config.env :');
    console.error('   PORT=5003');
    console.error('');
    console.error('4. Puis relancez : npm start');
    console.error('');
    process.exit(1);
  } else {
    console.error('❌ Erreur serveur:', error);
    process.exit(1);
  }
});

// Essayer de connecter la base de données en arrière-plan
tryLoadDatabase().catch(error => {
  console.error('❌ Erreur lors de la tentative de connexion à la base de données:', error.message);
});
