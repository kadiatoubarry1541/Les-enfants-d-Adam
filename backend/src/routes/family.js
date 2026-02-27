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
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max (pour les vidéos)
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image et vidéo sont autorisés'), false);
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

// ─────────────────────────────────────────────────────────────────────────────
// GALERIE FAMILLE PAR ALBUMS  (bapteme | mariage | deces | rencontre)
// ─────────────────────────────────────────────────────────────────────────────

const VALID_ALBUMS = ['bapteme', 'mariage', 'deces', 'rencontre'];

function parseAlbums(raw) {
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

// GET /api/family/gallery → retourne tous les albums
router.get('/gallery', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { numeroH: req.user.numeroH } });
    const albums = parseAlbums(userData?.galleryAlbums);
    for (const key of VALID_ALBUMS) { if (!albums[key]) albums[key] = []; }
    res.json({ success: true, albums });
  } catch (error) {
    console.error('Erreur /family/gallery GET:', error);
    res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
  }
});

// POST /api/family/gallery/:album → ajouter un média à un album
router.post('/gallery/:album', upload.single('media'), async (req, res) => {
  try {
    const { album } = req.params;
    if (!VALID_ALBUMS.includes(album)) {
      return res.status(400).json({ success: false, message: 'Album invalide' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
    }
    const mediaUrl = `/uploads/family/${req.file.filename}`;
    const isVideo = req.file.mimetype.startsWith('video/');

    const userData = await User.findOne({ where: { numeroH: req.user.numeroH } });
    const albums = parseAlbums(userData?.galleryAlbums);
    if (!albums[album]) albums[album] = [];
    // unshift = les plus récents en premier
    albums[album].unshift({ url: mediaUrl, type: isVideo ? 'video' : 'image', uploadedAt: new Date().toISOString() });

    await User.update({ galleryAlbums: JSON.stringify(albums) }, { where: { numeroH: req.user.numeroH } });
    res.json({ success: true, mediaUrl, albums });
  } catch (error) {
    console.error('Erreur /family/gallery POST:', error);
    res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
  }
});

// DELETE /api/family/gallery/:album/:index → supprimer un média
router.delete('/gallery/:album/:index', async (req, res) => {
  try {
    const { album } = req.params;
    const index = parseInt(req.params.index);
    if (!VALID_ALBUMS.includes(album)) {
      return res.status(400).json({ success: false, message: 'Album invalide' });
    }
    const userData = await User.findOne({ where: { numeroH: req.user.numeroH } });
    const albums = parseAlbums(userData?.galleryAlbums);
    if (!albums[album] || index < 0 || index >= albums[album].length) {
      return res.status(400).json({ success: false, message: 'Média introuvable' });
    }
    const filePath = path.join(path.dirname(path.dirname(__dirname)), albums[album][index].url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    albums[album].splice(index, 1);
    await User.update({ galleryAlbums: JSON.stringify(albums) }, { where: { numeroH: req.user.numeroH } });
    res.json({ success: true, albums });
  } catch (error) {
    console.error('Erreur /family/gallery DELETE:', error);
    res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
  }
});

export default router;

