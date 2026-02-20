import express from 'express';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize';
import { sequelize } from '../../config/database.js';
import User from '../models/User.js';
import PublishedStory from '../models/PublishedStory.js';
import { authenticate } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration multer pour l'upload des médias
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/user-stories');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `story-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max (pour vidéos de 5 minutes)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image et vidéo sont autorisés'), false);
    }
  }
});

const router = Router();

// Route publique pour récupérer les histoires publiées (avant authenticate)
// @route   GET /api/user-stories/published
// @desc    Récupérer toutes les histoires publiées (publique)
// @access  Public
router.get('/published', async (req, res) => {
  try {
    const { sectionId, generation, region, country, search, limit = 50, offset = 0 } = req.query;

    const where = {
      isPublished: true
    };

    if (sectionId) {
      where.sectionId = sectionId;
    }
    if (generation) {
      where.generation = generation;
    }
    if (region) {
      where.region = region;
    }
    if (country) {
      where.country = country;
    }

    const stories = await PublishedStory.findAll({
      where,
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Filtrer par recherche si fourni
    let filteredStories = stories;
    if (search) {
      const searchLower = String(search).toLowerCase();
      filteredStories = stories.filter((story) =>
        story.content.toLowerCase().includes(searchLower) ||
        story.authorName.toLowerCase().includes(searchLower) ||
        story.sectionTitle.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      stories: filteredStories,
      total: filteredStories.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des histoires publiées:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des histoires'
    });
  }
});

// @route   GET /api/user-stories/published/stats
// @desc    Récupérer les statistiques des histoires publiées
// @access  Public
router.get('/published/stats', async (req, res) => {
  try {
    const totalStories = await PublishedStory.count({
      where: { isPublished: true }
    });

    const storiesBySection = await PublishedStory.findAll({
      where: { isPublished: true },
      attributes: [
        'sectionId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['sectionId'],
      raw: true
    });

    const storiesByGeneration = await PublishedStory.findAll({
      where: { isPublished: true },
      attributes: [
        'generation',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['generation'],
      raw: true
    });

    res.json({
      success: true,
      stats: {
        totalStories,
        storiesBySection,
        storiesByGeneration
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
});

// Toutes les autres routes nécessitent l'authentification
router.use(authenticate);

// @route   POST /api/user-stories
// @desc    Sauvegarder une section d'histoire utilisateur
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { numeroH, sectionId, data } = req.body;

    if (!numeroH || !sectionId) {
      return res.status(400).json({
        success: false,
        message: 'NumeroH et sectionId sont requis'
      });
    }

    const user = await User.findByNumeroH(numeroH);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Récupérer les histoires existantes ou initialiser un objet vide
    let stories = {};
    try {
      if (user.userStories && typeof user.userStories === 'string') {
        stories = JSON.parse(user.userStories);
      } else if (user.userStories && typeof user.userStories === 'object') {
        stories = user.userStories;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des histoires existantes:', error);
      stories = {};
    }

    // Mettre à jour la section spécifique
    // Si data est fourni, utiliser data, sinon utiliser l'ancien format pour compatibilité
    if (data) {
      stories[sectionId] = {
        content: data.content || '',
        photos: data.photos || [],
        videos: data.videos || []
      };
    } else {
      // Compatibilité avec l'ancien format
      stories[sectionId] = {
        content: req.body.content || '',
        photos: [],
        videos: []
      };
    }

    // Sauvegarder dans la base de données
    await user.update({ userStories: JSON.stringify(stories) });

    res.json({
      success: true,
      message: 'Histoire sauvegardée avec succès',
      sectionId,
      data: stories[sectionId]
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'histoire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la sauvegarde de l\'histoire'
    });
  }
});

// @route   POST /api/user-stories/all
// @desc    Sauvegarder toutes les sections d'histoire utilisateur
// @access  Private
router.post('/all', async (req, res) => {
  try {
    const { numeroH, stories } = req.body;

    if (!numeroH || !stories) {
      return res.status(400).json({
        success: false,
        message: 'NumeroH et stories sont requis'
      });
    }

    const user = await User.findByNumeroH(numeroH);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Sauvegarder toutes les histoires
    await user.update({ userStories: JSON.stringify(stories) });

    res.json({
      success: true,
      message: 'Toutes les histoires ont été sauvegardées avec succès',
      stories
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des histoires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la sauvegarde des histoires'
    });
  }
});

// @route   GET /api/user-stories/:numeroH
// @desc    Récupérer toutes les histoires d'un utilisateur
// @access  Private
router.get('/:numeroH', async (req, res) => {
  try {
    const { numeroH } = req.params;
    const requestingUser = req.user;

    if (!numeroH) {
      return res.status(400).json({
        success: false,
        message: 'NumeroH est requis'
      });
    }

    // Vérifier que l'utilisateur demande ses propres histoires ou qu'il est admin
    if (requestingUser.numeroH !== numeroH && requestingUser.role !== 'admin' && requestingUser.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Vous ne pouvez accéder qu\'à vos propres histoires'
      });
    }

    const user = await User.findByNumeroH(numeroH);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Récupérer les histoires
    let stories = {};
    try {
      if (user.userStories && typeof user.userStories === 'string') {
        stories = JSON.parse(user.userStories);
      } else if (user.userStories && typeof user.userStories === 'object') {
        stories = user.userStories;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des histoires:', error);
      stories = {};
    }

    res.json({
      success: true,
      stories,
      numeroH: user.numeroH
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des histoires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des histoires'
    });
  }
});

// @route   POST /api/user-stories/upload
// @desc    Uploader une photo ou vidéo pour une section
// @access  Private
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const { numeroH, sectionId, type } = req.body;

    if (!numeroH || !sectionId || !type) {
      // Supprimer le fichier uploadé si les paramètres sont invalides
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'NumeroH, sectionId et type sont requis'
      });
    }

    const user = await User.findByNumeroH(numeroH);
    
    if (!user) {
      // Supprimer le fichier uploadé si l'utilisateur n'existe pas
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier que le type est valide
    if (type !== 'photo' && type !== 'video') {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Type invalide. Doit être "photo" ou "video"'
      });
    }

    // Récupérer les histoires existantes
    let stories = {};
    try {
      if (user.userStories && typeof user.userStories === 'string') {
        stories = JSON.parse(user.userStories);
      } else if (user.userStories && typeof user.userStories === 'object') {
        stories = user.userStories;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des histoires existantes:', error);
      stories = {};
    }

    // Initialiser la section si elle n'existe pas
    if (!stories[sectionId]) {
      stories[sectionId] = {
        content: '',
        photos: [],
        videos: []
      };
    }

    // Ajouter le fichier à la section
    const fileUrl = `/uploads/user-stories/${req.file.filename}`;
    if (type === 'photo') {
      if (!stories[sectionId].photos) {
        stories[sectionId].photos = [];
      }
      stories[sectionId].photos.push(fileUrl);
    } else {
      if (!stories[sectionId].videos) {
        stories[sectionId].videos = [];
      }
      stories[sectionId].videos.push(fileUrl);
    }

    // Sauvegarder dans la base de données
    await user.update({ userStories: JSON.stringify(stories) });

    res.json({
      success: true,
      message: `${type === 'photo' ? 'Photo' : 'Vidéo'} uploadée avec succès`,
      fileUrl,
      type
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    // Supprimer le fichier en cas d'erreur
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Erreur lors de la suppression du fichier:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'upload'
    });
  }
});

// @route   POST /api/user-stories/publish
// @desc    Publier une section d'histoire
// @access  Private
router.post('/publish', async (req, res) => {
  try {
    const { numeroH, sectionId } = req.body;

    if (!numeroH || !sectionId) {
      return res.status(400).json({
        success: false,
        message: 'NumeroH et sectionId sont requis'
      });
    }

    const user = await User.findByNumeroH(numeroH);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Récupérer les histoires de l'utilisateur
    let stories = {};
    try {
      if (user.userStories && typeof user.userStories === 'string') {
        stories = JSON.parse(user.userStories);
      } else if (user.userStories && typeof user.userStories === 'object') {
        stories = user.userStories;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des histoires:', error);
      return res.status(400).json({
        success: false,
        message: 'Aucune histoire trouvée pour cette section'
      });
    }

    const sectionData = stories[sectionId];
    if (!sectionData || !sectionData.content) {
      return res.status(400).json({
        success: false,
        message: 'Cette section ne contient pas de contenu à publier'
      });
    }

    // Trouver le titre de la section
    const sectionTitles = {
      'naissance': 'Naissance et Enfance',
      'jeunesse': 'Jeunesse et Apprentissage',
      'mariage': 'Union et Engagement',
      'revelation': 'Réalisation et Mission',
      'persecution': 'Épreuves et Résilience',
      'unification': 'Réalisation et Unification',
      'heritage': 'Héritage et Transmission'
    };

    // Vérifier si l'histoire est déjà publiée
    const existingStory = await PublishedStory.findOne({
      where: {
        numeroH: user.numeroH,
        sectionId: sectionId,
        isPublished: true
      }
    });

    const storyData = {
      numeroH: user.numeroH,
      authorName: `${user.prenom} ${user.nomFamille}`,
      sectionId: sectionId,
      sectionTitle: sectionTitles[sectionId] || sectionId,
      content: sectionData.content,
      photos: sectionData.photos || [],
      videos: sectionData.videos || [],
      generation: user.generation || null,
      region: user.regionOrigine || null,
      country: user.pays || null,
      isPublished: true,
      publishedAt: new Date()
    };

    if (existingStory) {
      // Mettre à jour l'histoire existante
      await existingStory.update(storyData);
    } else {
      // Créer une nouvelle publication
      await PublishedStory.create(storyData);
    }

    res.json({
      success: true,
      message: 'Histoire publiée avec succès dans l\'Histoire de l\'Humanité',
      story: storyData
    });
  } catch (error) {
    console.error('Erreur lors de la publication:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la publication'
    });
  }
});

export default router;
