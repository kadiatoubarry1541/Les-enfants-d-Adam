import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import Formation from '../models/Formation.js';
import FormationRegistration from '../models/FormationRegistration.js';
import Professor from '../models/Professor.js';
import ProfessorRequest from '../models/ProfessorRequest.js';
import Course from '../models/Course.js';
import CoursePermission from '../models/CoursePermission.js';
import User from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configuration multer pour l'upload des médias
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/education';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `education-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image, vidéo, audio et PDF sont autorisés'), false);
    }
  }
});

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// ========== FORMATIONS ==========

// @route   GET /api/education/formations
// @desc    Récupérer les formations disponibles
// @access  Authentifié
router.get('/formations', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const where = { isActive: true };
    if (category) {
      where.category = category;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const formations = await Formation.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      formations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des formations'
    });
  }
});

// @route   POST /api/education/formations
// @desc    Créer une nouvelle formation
// @access  Admin
router.post('/formations', requireAdmin, async (req, res) => {
  try {
    const { title, description, category, duration, level, requirements, curriculum, maxStudents, price } = req.body;
    
    const formation = await Formation.create({
      title,
      description,
      category,
      duration: duration ? parseInt(duration) : null,
      level,
      requirements: requirements ? JSON.parse(requirements) : {},
      curriculum: curriculum ? JSON.parse(curriculum) : [],
      maxStudents: maxStudents ? parseInt(maxStudents) : null,
      price: price ? parseFloat(price) : 0,
      createdBy: req.user.numeroH
    });
    
    res.json({
      success: true,
      message: 'Formation créée avec succès',
      formation
    });
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la formation'
    });
  }
});

// @route   POST /api/education/formations/:id/register
// @desc    S'inscrire à une formation
// @access  Authentifié
router.post('/formations/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    
    const formation = await Formation.findByPk(id);
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    if (!formation.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cette formation n\'est plus disponible'
      });
    }
    
    // Vérifier si l'utilisateur est déjà inscrit
    const existingRegistration = await FormationRegistration.findOne({
      where: { formationId: id, numeroH: req.user.numeroH }
    });
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà inscrit à cette formation'
      });
    }
    
    const registration = await FormationRegistration.create({
      formationId: id,
      numeroH: req.user.numeroH,
      status: 'pending'
    });
    
    res.json({
      success: true,
      message: 'Demande d\'inscription envoyée avec succès',
      registration
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
});

// @route   GET /api/education/my-formations
// @desc    Récupérer les formations de l'utilisateur
// @access  Authentifié
router.get('/my-formations', async (req, res) => {
  try {
    const registrations = await FormationRegistration.getUserRegistrations(req.user.numeroH);
    
    res.json({
      success: true,
      registrations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des formations'
    });
  }
});

// ========== PROFESSEURS ==========

// @route   GET /api/education/professors
// @desc    Récupérer les professeurs disponibles
// @access  Authentifié
router.get('/professors', async (req, res) => {
  try {
    const { specialty, search } = req.query;
    
    const where = { isActive: true, isAvailable: true };
    if (specialty) {
      where.specialties = { [Op.contains]: [specialty] };
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { specialties: { [Op.contains]: [search] } },
        { city: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const professors = await Professor.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      professors
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des professeurs'
    });
  }
});

// @route   POST /api/education/professors
// @desc    Créer un nouveau professeur
// @access  Admin
router.post('/professors', requireAdmin, async (req, res) => {
  try {
    const { name, specialty, experience, qualifications, bio, contactInfo, hourlyRate, availability } = req.body;
    
    const professor = await Professor.create({
      name,
      specialty,
      experience: experience ? parseInt(experience) : null,
      qualifications: qualifications ? JSON.parse(qualifications) : [],
      bio,
      contactInfo: contactInfo ? JSON.parse(contactInfo) : {},
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      availability: availability ? JSON.parse(availability) : {},
      createdBy: req.user.numeroH
    });
    
    res.json({
      success: true,
      message: 'Professeur créé avec succès',
      professor
    });
  } catch (error) {
    console.error('Erreur lors de la création du professeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du professeur'
    });
  }
});

// @route   POST /api/education/professors/:id/request
// @desc    Demander un cours avec un professeur
// @access  Authentifié
router.post('/professors/:id/request', async (req, res) => {
  try {
    const { id } = req.params;
    const { requestMessage, scheduledDate, duration } = req.body;
    
    const professor = await Professor.findByPk(id);
    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professeur non trouvé'
      });
    }
    
    if (!professor.isActive || !professor.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Ce professeur n\'est pas disponible'
      });
    }
    
    const request = await ProfessorRequest.create({
      professorId: id,
      numeroH: req.user.numeroH,
      requestMessage,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      duration: duration ? parseInt(duration) : null,
      status: 'pending'
    });
    
    res.json({
      success: true,
      message: 'Demande envoyée avec succès',
      request
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'envoi de la demande'
    });
  }
});

// @route   GET /api/education/my-requests
// @desc    Récupérer les demandes de cours de l'utilisateur
// @access  Authentifié
router.get('/my-requests', async (req, res) => {
  try {
    const requests = await ProfessorRequest.getUserRequests(req.user.numeroH);
    
    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des demandes'
    });
  }
});

// ========== COURS ==========

// @route   GET /api/education/courses
// @desc    Récupérer les cours disponibles
// @access  Authentifié
router.get('/courses', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    
    const where = { isActive: true };
    if (type) {
      where.type = type;
    }
    if (category) {
      where.category = category;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const courses = await Course.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des cours'
    });
  }
});

// Middleware pour vérifier les permissions de création de cours
const canCreateCourse = async (req, res, next) => {
  try {
    const user = req.user;
    
    // L'admin peut toujours créer des cours
    if (user.role === 'admin' || user.role === 'super-admin' || user.numeroH === 'G0C0P0R0E0F0 0') {
      return next();
    }
    
    // Vérifier si l'utilisateur a la permission pour ce type de cours
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Type de cours requis'
      });
    }
    
    const hasPermission = await CoursePermission.checkPermission(user.numeroH, type);
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas la permission de créer ce type de cours. Contactez un administrateur.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification des permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification des permissions'
    });
  }
};

// @route   POST /api/education/courses
// @desc    Créer un nouveau cours
// @access  Admin ou Professeur autorisé
router.post('/courses', canCreateCourse, upload.single('media'), async (req, res) => {
  try {
    const { title, description, type, duration, level, category, prerequisites } = req.body;
    
    const courseData = {
      title,
      description,
      type,
      duration: duration ? parseInt(duration) : null,
      level,
      category,
      prerequisites: prerequisites ? JSON.parse(prerequisites) : [],
      createdBy: req.user.numeroH
    };
    
    if (req.file) {
      courseData.content = {
        mediaUrl: `/uploads/education/${req.file.filename}`,
        mediaType: req.file.mimetype
      };
    }
    
    const course = await Course.create(courseData);
    
    res.json({
      success: true,
      message: 'Cours créé avec succès',
      course
    });
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du cours'
    });
  }
});

// @route   GET /api/education/my-courses
// @desc    Récupérer les cours de l'utilisateur
// @access  Authentifié
router.get('/my-courses', async (req, res) => {
  try {
    const courses = await Course.getUserCourses(req.user.numeroH);
    
    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des cours'
    });
  }
});

// @route   POST /api/education/course-permissions
// @desc    Accorder une permission de création de cours à un professeur
// @access  Admin uniquement
router.post('/course-permissions', requireAdmin, async (req, res) => {
  try {
    const { numeroH, courseType, expiresAt, notes } = req.body;
    const user = req.user;

    if (!numeroH || !courseType) {
      return res.status(400).json({
        success: false,
        message: 'NumeroH et courseType sont requis'
      });
    }

    // Vérifier que l'utilisateur existe
    const targetUser = await User.findByNumeroH(numeroH);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si la permission existe déjà
    const existingPermission = await CoursePermission.findOne({
      where: { numeroH, courseType, isActive: true }
    });

    if (existingPermission) {
      return res.status(400).json({
        success: false,
        message: 'Cette permission existe déjà'
      });
    }

    const permission = await CoursePermission.create({
      numeroH,
      courseType,
      isActive: true,
      grantedBy: user.numeroH,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Permission accordée avec succès',
      permission
    });
  } catch (error) {
    console.error('Erreur lors de l\'octroi de permission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'octroi de permission'
    });
  }
});

// @route   GET /api/education/course-permissions
// @desc    Récupérer les permissions de cours
// @access  Admin uniquement
router.get('/course-permissions', requireAdmin, async (req, res) => {
  try {
    const { numeroH, courseType } = req.query;
    
    let where = {};
    if (numeroH) {
      where.numeroH = numeroH;
    }
    if (courseType) {
      where.courseType = courseType;
    }
    
    const permissions = await CoursePermission.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      permissions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des permissions'
    });
  }
});

// @route   GET /api/education/my-course-permissions
// @desc    Récupérer les permissions de cours de l'utilisateur
// @access  Authentifié
router.get('/my-course-permissions', async (req, res) => {
  try {
    const permissions = await CoursePermission.getUserPermissions(req.user.numeroH);
    
    res.json({
      success: true,
      permissions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des permissions'
    });
  }
});

// @route   GET /api/education/stats
// @desc    Récupérer les statistiques de l'éducation
// @access  Admin
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [formationStats, professorStats] = await Promise.all([
      Formation.getFormationStats(),
      Professor.getProfessorStats()
    ]);
    
    res.json({
      success: true,
      stats: {
        formations: formationStats,
        professors: professorStats
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

export default router;

