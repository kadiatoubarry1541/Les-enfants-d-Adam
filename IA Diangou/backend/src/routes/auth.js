import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Professor from '../models/Professor.js';
import { config } from '../config.js';
import { sequelize } from '../../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuration multer pour l'upload des photos de profil et diplômes
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/profiles');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const diplomaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/diplomas');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `diploma-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

// Upload pour les diplômes (PDF ou images)
const uploadDiploma = multer({
  storage: diplomaStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max pour les diplômes
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF ou images sont autorisés pour les diplômes'), false);
    }
  }
});

// Upload multiple pour professeur (photo + diplôme) via deux middlewares distincts
const uploadProfessor = (req, res, next) => {
  // D'abord la photo de profil
  upload.single('photo')(req, res, (err) => {
    if (err) return next(err);
    // Puis le diplôme (PDF ou image)
    uploadDiploma.single('diplome')(req, res, next);
  });
};

// @route   POST /api/education/register/professeur
// @desc    Inscription d'un professeur
// @access  Public
router.post('/register/professeur', uploadProfessor, async (req, res) => {
  try {
    const { nomComplet, email, password, matiere, niveau, telephone } = req.body;
    const photoFile = req.files && req.files['photo'] ? req.files['photo'][0] : null;
    const diplomeFile = req.files && req.files['diplome'] ? req.files['diplome'][0] : null;
    const photoUrl = photoFile ? `/uploads/profiles/${photoFile.filename}` : null;
    const diplomeUrl = diplomeFile ? `/uploads/diplomas/${diplomeFile.filename}` : null;

    // Gestion des erreurs multer
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError
      });
    }

    // Validation
    if (!nomComplet || !email || !password || !matiere || !niveau) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires'
      });
    }

    // Validation du diplôme (obligatoire pour les professeurs)
    if (!diplomeFile) {
      return res.status(400).json({
        success: false,
        message: 'Le diplôme est obligatoire pour les professeurs'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Générer un NumeroH unique pour le professeur
    const numeroH = await generateNumeroH('PROF');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const [prenom, ...nomParts] = nomComplet.split(' ');
    const nomFamille = nomParts.join(' ') || prenom;

    const user = await User.create({
      numeroH,
      password: hashedPassword,
      prenom: prenom || nomComplet,
      nomFamille,
      email,
      role: 'professeur',
      isActive: true,
      metadata: {
        photoUrl,
        diplomeUrl,
        niveau,
        telephone: telephone || null
      }
    });

    // Créer le profil professeur
    const professor = await Professor.create({
      name: nomComplet,
      specialty: matiere,
      experience: 0,
      qualifications: [],
      bio: `Professeur de ${matiere} - Niveau ${niveau}`,
      contactInfo: {
        email,
        telephone: telephone || null
      },
      hourlyRate: null,
      availability: {},
      isActive: true,
      isAvailable: true,
      createdBy: numeroH,
      ratings: []
    });

    // Générer un token JWT
    const token = jwt.sign(
      { numeroH: user.numeroH, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Compte professeur créé avec succès',
      user: {
        numeroH: user.numeroH,
        prenom: user.prenom,
        nomFamille: user.nomFamille,
        email: user.email,
        role: user.role
      },
      professor: {
        id: professor.id,
        name: professor.name,
        specialty: professor.specialty
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription professeur:', error);
    
    // Supprimer la photo si elle a été uploadée mais qu'il y a eu une erreur
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Erreur lors de la suppression de la photo:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de l\'inscription'
    });
  }
});

// @route   POST /api/education/register/parent
// @desc    Inscription d'un parent
// @access  Public
router.post('/register/parent', upload.single('photo'), async (req, res) => {
  try {
    const { nomComplet, email, password, nomEnfant, ageEnfant, telephone } = req.body;
    const photoUrl = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    // Gestion des erreurs multer
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError
      });
    }

    // Validation
    if (!nomComplet || !email || !password || !nomEnfant || !ageEnfant || !telephone) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Générer un NumeroH unique pour le parent
    const numeroH = await generateNumeroH('PARENT');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const [prenom, ...nomParts] = nomComplet.split(' ');
    const nomFamille = nomParts.join(' ') || prenom;

    const user = await User.create({
      numeroH,
      password: hashedPassword,
      prenom: prenom || nomComplet,
      nomFamille,
      email,
      role: 'parent',
      isActive: true,
      metadata: {
        nomEnfant,
        ageEnfant: parseInt(ageEnfant),
        telephone,
        photoUrl
      }
    });

    // Générer un token JWT
    const token = jwt.sign(
      { numeroH: user.numeroH, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Compte parent créé avec succès',
      user: {
        numeroH: user.numeroH,
        prenom: user.prenom,
        nomFamille: user.nomFamille,
        email: user.email,
        role: user.role
      },
      enfant: {
        nom: nomEnfant,
        age: ageEnfant
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription parent:', error);
    
    // Supprimer la photo si elle a été uploadée mais qu'il y a eu une erreur
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Erreur lors de la suppression de la photo:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de l\'inscription'
    });
  }
});

// @route   POST /api/education/register/apprenant
// @desc    Inscription d'un apprenant
// @access  Public
router.post('/register/apprenant', upload.single('photo'), async (req, res) => {
  try {
    const { nomComplet, email, password, age, niveauScolaire, matierePreferee, nomParent, telephone } = req.body;
    const photoUrl = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    // Gestion des erreurs multer
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError
      });
    }

    // Validation
    if (!nomComplet || !email || !password || !age || !niveauScolaire || !nomParent || !telephone) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Générer un NumeroH unique pour l'apprenant
    const numeroH = await generateNumeroH('APPR');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const [prenom, ...nomParts] = nomComplet.split(' ');
    const nomFamille = nomParts.join(' ') || prenom;

    const user = await User.create({
      numeroH,
      password: hashedPassword,
      prenom: prenom || nomComplet,
      nomFamille,
      email,
      role: 'apprenant',
      isActive: true,
      metadata: {
        age: parseInt(age),
        niveauScolaire,
        matierePreferee: matierePreferee || null,
        nomParent,
        telephone,
        photoUrl
      }
    });

    // Générer un token JWT
    const token = jwt.sign(
      { numeroH: user.numeroH, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Compte apprenant créé avec succès',
      user: {
        numeroH: user.numeroH,
        prenom: user.prenom,
        nomFamille: user.nomFamille,
        email: user.email,
        role: user.role
      },
      apprenant: {
        age,
        niveauScolaire,
        matierePreferee,
        nomParent,
        telephone
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription apprenant:', error);
    
    // Supprimer la photo si elle a été uploadée mais qu'il y a eu une erreur
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Erreur lors de la suppression de la photo:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de l\'inscription'
    });
  }
});

// @route   POST /api/education/login
// @desc    Connexion d'un utilisateur
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Vérifier que la base de données est connectée
    try {
      await sequelize.authenticate();
    } catch (dbConnectionError) {
      console.error('❌ Base de données non connectée:', dbConnectionError.message);
      console.error('📍 Détails:', {
        code: dbConnectionError.code,
        name: dbConnectionError.name,
        message: dbConnectionError.message
      });
      return res.status(503).json({
        success: false,
        message: 'Service temporairement indisponible. La base de données n\'est pas connectée.',
        ...(process.env.NODE_ENV === 'development' && {
          error: dbConnectionError.message,
          code: dbConnectionError.code,
          hint: 'Vérifiez votre configuration de base de données dans config.env. Assurez-vous que PostgreSQL est démarré et que la base "diangou" existe.'
        })
      });
    }

    // Vérifier que sequelize est disponible
    if (!sequelize) {
      console.error('❌ Sequelize n\'est pas initialisé');
      return res.status(503).json({
        success: false,
        message: 'Service temporairement indisponible. La base de données n\'est pas initialisée.',
        ...(process.env.NODE_ENV === 'development' && {
          hint: 'Vérifiez que la base de données est correctement configurée dans config.env'
        })
      });
    }

    // Trouver l'utilisateur par email
    let user;
    try {
      user = await User.findOne({ where: { email } });
    } catch (dbError) {
      console.error('❌ Erreur de base de données lors de la recherche:', dbError);
      console.error('📍 Détails:', {
        message: dbError.message,
        name: dbError.name,
        code: dbError.code,
        original: dbError.original?.message,
        stack: dbError.stack
      });
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur de connexion à la base de données. Veuillez réessayer plus tard.';
      if (dbError.name === 'SequelizeConnectionError') {
        errorMessage = 'Impossible de se connecter à la base de données. Vérifiez que PostgreSQL est démarré.';
      } else if (dbError.name === 'SequelizeDatabaseError') {
        errorMessage = 'Erreur de base de données. Vérifiez que la base "diangou" existe.';
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && {
          error: dbError.message,
          errorName: dbError.name,
          details: dbError.toString(),
          originalError: dbError.original?.message
        })
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Votre compte est désactivé'
      });
    }

    // Vérifier le mot de passe
    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error('❌ Erreur lors de la comparaison du mot de passe:', bcryptError);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du mot de passe'
      });
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer un token JWT
    if (!config.JWT_SECRET) {
      console.error('❌ JWT_SECRET n\'est pas défini dans la configuration');
      return res.status(500).json({
        success: false,
        message: 'Erreur de configuration serveur'
      });
    }

    const token = jwt.sign(
      { numeroH: user.numeroH, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    if (!token) {
      console.error('❌ Erreur lors de la génération du token');
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération du token'
      });
    }

    console.log('✅ Token généré avec succès pour:', user.email, 'Rôle:', user.role);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        numeroH: user.numeroH,
        prenom: user.prenom,
        nomFamille: user.nomFamille,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    console.error('📍 Détails de l\'erreur:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Déterminer le type d'erreur
    let errorMessage = 'Erreur serveur lors de la connexion';
    let statusCode = 500;
    
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeDatabaseError') {
      errorMessage = 'Erreur de connexion à la base de données. Vérifiez votre configuration.';
      statusCode = 503;
    } else if (error.name === 'SequelizeValidationError') {
      errorMessage = 'Erreur de validation des données';
      statusCode = 400;
    } else if (error.message && error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Impossible de se connecter à la base de données. Vérifiez que PostgreSQL est démarré.';
      statusCode = 503;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        errorName: error.name,
        details: error.toString()
      })
    });
  }
});

// @route   POST /api/education/create-admin
// @desc    Créer un compte administrateur (route spéciale pour setup initial)
// @access  Public (à sécuriser en production)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, nomComplet } = req.body;

    // Validation
    if (!email || !password || !nomComplet) {
      return res.status(400).json({
        success: false,
        message: 'Email, mot de passe et nom complet requis'
      });
    }

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ where: { email } });
    
    if (existingAdmin) {
      // Mettre à jour le rôle et le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();

      // Générer un token JWT
      const token = jwt.sign(
        { numeroH: existingAdmin.numeroH, role: existingAdmin.role },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Compte admin mis à jour avec succès',
        user: {
          numeroH: existingAdmin.numeroH,
          prenom: existingAdmin.prenom,
          nomFamille: existingAdmin.nomFamille,
          email: existingAdmin.email,
          role: existingAdmin.role
        },
        token
      });
    }

    // Créer un nouveau compte admin
    const hashedPassword = await bcrypt.hash(password, 12);
    const [prenom, ...nomParts] = nomComplet.split(' ');
    const nomFamille = nomParts.join(' ') || prenom;

    // Générer un NumeroH unique pour l'admin
    let numeroH = 'ADMIN001';
    let exists = true;
    let counter = 1;
    
    while (exists) {
      const existing = await User.findOne({ where: { numeroH } });
      if (!existing) {
        exists = false;
      } else {
        counter++;
        numeroH = `ADMIN${counter.toString().padStart(3, '0')}`;
      }
    }

    const admin = await User.create({
      numeroH,
      password: hashedPassword,
      prenom: prenom || nomComplet,
      nomFamille,
      email,
      role: 'admin',
      isActive: true,
      metadata: {
        isAdmin: true,
        createdAt: new Date().toISOString()
      }
    });

    // Générer un token JWT
    const token = jwt.sign(
      { numeroH: admin.numeroH, role: admin.role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Compte admin créé avec succès',
      user: {
        numeroH: admin.numeroH,
        prenom: admin.prenom,
        nomFamille: admin.nomFamille,
        email: admin.email,
        role: admin.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'admin'
    });
  }
});

// Fonction pour générer un NumeroH unique
async function generateNumeroH(prefix) {
  let numeroH;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 100;

  while (exists && attempts < maxAttempts) {
    // Générer un NumeroH basé sur le préfixe et un timestamp
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    numeroH = `${prefix}${timestamp}${random}`;

    // Vérifier si ce NumeroH existe déjà
    const existing = await User.findOne({ where: { numeroH } });
    exists = !!existing;
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Impossible de générer un NumeroH unique');
  }

  return numeroH;
}

export default router;

