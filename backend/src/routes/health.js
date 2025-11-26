import express from 'express';
const router = express.Router();

/**
 * Route de santé pour vérifier que le serveur fonctionne
 * Utilisé par les plateformes de déploiement (Render, Railway, etc.)
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

export default router;

