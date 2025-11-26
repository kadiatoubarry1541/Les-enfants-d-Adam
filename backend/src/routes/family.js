import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Configuration multer pour l'upload des photos de famille
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/family';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const user = req.user;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `family-${user.numeroH}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// @route   GET /api/family/photos
// @desc    Récupérer les photos de famille de l'utilisateur
// @access  Authentifié
router.get('/photos', async (req, res) => {
  try {
    const user = req.user;
    
    // Récupérer les photos depuis le modèle User (on ajoutera ces champs plus tard)
    // Pour l'instant, on retourne les données depuis le profil utilisateur
    const userData = await User.findOne({ where: { numeroH: user.numeroH } });
    
    const photos = {
      familyPhoto: userData?.familyPhoto || null,
      manPhoto: userData?.manPhoto || null,
      wifePhoto: userData?.wifePhoto || null,
      childrenPhotos: userData?.childrenPhotos ? JSON.parse(userData.childrenPhotos) : []
    };

    res.json({
      success: true,
      photos
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des photos'
    });
  }
});

// @route   POST /api/family/photos/family
// @desc    Uploader la photo de famille
// @access  Authentifié
router.post('/photos/family', upload.single('photo'), async (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const photoUrl = `/uploads/family/${req.file.filename}`;
    
    // Mettre à jour le profil utilisateur
    await User.update(
      { familyPhoto: photoUrl },
      { where: { numeroH: user.numeroH } }
    );

    res.json({
      success: true,
      message: 'Photo de famille uploadée avec succès',
      photoUrl
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo de famille:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'upload de la photo'
    });
  }
});

// @route   POST /api/family/photos/man
// @desc    Uploader la photo de l'homme (utilisateur)
// @access  Authentifié
router.post('/photos/man', upload.single('photo'), async (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const photoUrl = `/uploads/family/${req.file.filename}`;
    
    // Mettre à jour le profil utilisateur
    await User.update(
      { manPhoto: photoUrl },
      { where: { numeroH: user.numeroH } }
    );

    res.json({
      success: true,
      message: 'Photo uploadée avec succès',
      photoUrl
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'upload de la photo'
    });
  }
});

// @route   POST /api/family/photos/wife
// @desc    Uploader la photo de la femme
// @access  Authentifié
router.post('/photos/wife', upload.single('photo'), async (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const photoUrl = `/uploads/family/${req.file.filename}`;
    
    // Mettre à jour le profil utilisateur
    await User.update(
      { wifePhoto: photoUrl },
      { where: { numeroH: user.numeroH } }
    );

    res.json({
      success: true,
      message: 'Photo de la femme uploadée avec succès',
      photoUrl
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'upload de la photo'
    });
  }
});

// @route   POST /api/family/photos/children
// @desc    Uploader une photo d'enfant
// @access  Authentifié
router.post('/photos/children', upload.single('photo'), async (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const photoUrl = `/uploads/family/${req.file.filename}`;
    const { childName } = req.body;
    
    // Récupérer les photos d'enfants existantes
    const userData = await User.findOne({ where: { numeroH: user.numeroH } });
    const childrenPhotos = userData?.childrenPhotos ? JSON.parse(userData.childrenPhotos) : [];
    
    // Ajouter la nouvelle photo
    childrenPhotos.push({
      name: childName || 'Enfant',
      photoUrl,
      uploadedAt: new Date().toISOString()
    });
    
    // Mettre à jour le profil utilisateur
    await User.update(
      { childrenPhotos: JSON.stringify(childrenPhotos) },
      { where: { numeroH: user.numeroH } }
    );

    res.json({
      success: true,
      message: 'Photo d\'enfant uploadée avec succès',
      photoUrl,
      childrenPhotos
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'upload de la photo'
    });
  }
});

// @route   DELETE /api/family/photos/children/:index
// @desc    Supprimer une photo d'enfant
// @access  Authentifié
router.delete('/photos/children/:index', async (req, res) => {
  try {
    const user = req.user;
    const index = parseInt(req.params.index);
    
    // Récupérer les photos d'enfants existantes
    const userData = await User.findOne({ where: { numeroH: user.numeroH } });
    const childrenPhotos = userData?.childrenPhotos ? JSON.parse(userData.childrenPhotos) : [];
    
    if (index < 0 || index >= childrenPhotos.length) {
      return res.status(400).json({
        success: false,
        message: 'Index invalide'
      });
    }
    
    // Supprimer le fichier physique
    const photoPath = path.join(__dirname, '../../', childrenPhotos[index].photoUrl);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
    
    // Supprimer la photo de la liste
    childrenPhotos.splice(index, 1);
    
    // Mettre à jour le profil utilisateur
    await User.update(
      { childrenPhotos: JSON.stringify(childrenPhotos) },
      { where: { numeroH: user.numeroH } }
    );

    res.json({
      success: true,
      message: 'Photo d\'enfant supprimée avec succès',
      childrenPhotos
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la photo'
    });
  }
});

export default router;

