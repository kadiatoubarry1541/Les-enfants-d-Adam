import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

import connectDB from '../config/database.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import badgeRoutes from './routes/badges.js';
import logoRoutes from './routes/logos.js';
import pageAdminRoutes from './routes/pageAdmins.js';
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
import professionalRoutes from './routes/professionals.js';
import appointmentRoutes from './routes/appointments.js';
import notificationRoutes from './routes/notifications.js';
import iaRoutes from './routes/ia.js';
import { handleUploadError } from './middleware/upload.js';
import { config } from '../config.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration dotenv
dotenv.config({ path: path.join(path.dirname(__dirname), 'config.env') });

const app = express();
const PORT = process.env.PORT || config.PORT || 5002;

// Démarrage automatique du serveur IA (Python) quand le backend démarre
let iaProcess = null;

const startIaServer = () => {
  if (process.env.DISABLE_IA_AUTO_START === 'true') {
    console.log('ℹ️ Démarrage automatique de l\'IA désactivé (DISABLE_IA_AUTO_START=true)');
    return;
  }

  if (iaProcess) {
    // IA déjà démarrée
    return;
  }

  const iaDir = path.join(__dirname, '../../IA SC');
  const pythonCmds = process.platform === 'win32' ? ['py', 'python'] : ['python3', 'python'];

  const trySpawn = (index) => {
    if (index >= pythonCmds.length) {
      console.error('❌ Impossible de démarrer automatiquement le Professeur IA (Python introuvable).');
      console.error('   Vérifiez que Python est installé, puis démarrez IA SC/app.py manuellement si nécessaire.');
      return;
    }

    const cmd = pythonCmds[index];
    console.log(`🔄 Tentative de démarrage du Professeur IA avec "${cmd}"...`);

    try {
      iaProcess = spawn(cmd, ['app.py'], {
        cwd: iaDir,
        stdio: 'inherit',
        shell: process.platform === 'win32'
      });

      iaProcess.on('error', (err) => {
        console.error(`❌ Erreur lors du démarrage du Professeur IA avec "${cmd}":`, err.message);
        iaProcess = null;
        trySpawn(index + 1);
      });

      iaProcess.on('exit', (code) => {
        console.log(`ℹ️ Professeur IA arrêté (code: ${code}).`);
        iaProcess = null;
      });

      console.log('✅ Professeur IA lancé automatiquement (port 5000).');
    } catch (e) {
      console.error(`❌ Exception lors du démarrage de l\'IA avec "${cmd}":`, e.message);
      iaProcess = null;
      trySpawn(index + 1);
    }
  };

  trySpawn(0);
};

// Créer ou mettre à jour le compte admin au démarrage (pour Render / production)
async function ensureAdmin() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return;
  const adminNumeroH = (process.env.ADMIN_NUMERO_H || 'G0C0P0R0E0F0 0').trim().replace(/\s+/g, ' ');
  try {
    let admin = await User.findByNumeroH(adminNumeroH);
    const saltRounds = config.BCRYPT_ROUNDS || 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    if (admin) {
      const valid = await bcrypt.compare(adminPassword, admin.password);
      if (!valid) {
        await admin.update({ password: hashedPassword, role: 'super-admin', isActive: true });
        console.log('✅ Compte admin mis à jour (mot de passe synchronisé avec ADMIN_PASSWORD)');
      }
    } else {
      admin = await User.create({
        numeroH: adminNumeroH,
        prenom: 'Administrateur',
        nomFamille: 'Principal',
        password: hashedPassword,
        role: 'super-admin',
        isActive: true,
        isVerified: true,
        type: 'vivant',
        genre: 'AUTRE',
        generation: 'G0'
      });
      console.log('✅ Compte admin créé (NumeroH:', adminNumeroH, ')');
    }
  } catch (e) {
    console.warn('⚠️ ensureAdmin:', e.message);
  }
}

// Connexion à la base puis démarrage du serveur (le serveur ne démarre que si la base est OK)
connectDB()
  .then(() => ensureAdmin())
  .then(() => {
    // Middleware de sécurité (déjà déclarés plus bas) — on démarre l'écoute ici
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📁 Dossier uploads: ${path.join(__dirname, '../uploads')}`);
      startIaServer();
    });
  })
  .catch((error) => {
    console.error('❌ Impossible de démarrer sans base de données.');
    console.error('   ', error?.message || error);
    process.exit(1);
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
    // En développement : accepter localhost et 127.0.0.1 sur n'importe quel port
    if (process.env.NODE_ENV === 'development') {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // En dev, accepter tout pour faciliter les tests
    }
    // En production
    if (!process.env.CORS_ORIGIN) return callback(null, true);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));

// Rate limiting
// ⚠️ En développement, on assouplit fortement la limite pour éviter
// de bloquer les tests (changement de photo de profil, reload, etc.)
const isDev = process.env.NODE_ENV === 'development';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 100, // en dev: 10 000 requêtes, en prod: 100
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});

// On applique le rate limit uniquement sur les routes API,
// pas sur les fichiers statiques /uploads
app.use('/api', limiter);

// Middleware pour parser le JSON
// Limite élevée pour enregistrement vivant (photo + vidéo en base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/logos', logoRoutes);
app.use('/api/page-admins', pageAdminRoutes);
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
app.use('/api/professionals', professionalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ia', iaRoutes);
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

// Middleware pour gérer les erreurs d'upload (multer) - DOIT être APRÈS les routes
app.use(handleUploadError);

// Middleware de gestion des erreurs générales
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

// Démarrage du serveur : fait dans connectDB().then() plus haut (serveur ne démarre que si la base est connectée)

export default app;
