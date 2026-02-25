import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { Router } from 'express';
import { Op } from 'sequelize';
import User from '../models/User.js';
import DeceasedMember from '../models/DeceasedMember.js';
import FamilyTreeConfirmation from '../models/FamilyTreeConfirmation.js';
import { FamilyTree } from '../models/additional.js';
import ActivityGroup from '../models/ActivityGroup.js';
import { config } from '../../config.js';
import upload from '../middleware/upload.js';

const router = Router();

// Toutes les données utilisateur proviennent uniquement de la base de données PostgreSQL.

// Fonction pour créer un utilisateur de test en base (optionnel, au démarrage)
const loadTestUsers = async () => {
  try {
    // Vérifier s'il y a déjà un utilisateur de test
    const existingTestUser = await User.findByNumeroH('G96C1P2R3E2F1 4');
    if (existingTestUser) {
      console.log(`📦 Utilisateur de test déjà existant: ${existingTestUser.numeroH}`);
      return;
    }
    
    // Créer un utilisateur de test par défaut
    const testUser = await User.create({
      numeroH: 'G96C1P2R3E2F1 4',
      prenom: 'Test',
      nomFamille: 'User',
      email: 'test@example.com',
      password: '$2a$12$LmABvyZWgvyU8dVt0.Lzueh6bNWJXW7J1oXM5qqYSrTNzJHbNj9jO', // bcrypt hash of 'test123'
      genre: 'AUTRE',
      dateNaissance: '1990-01-01',
      generation: 'G96',
      isActive: true,
      isVerified: true,
      role: 'user'
    });
    
    console.log(`📦 Utilisateur de test créé: ${testUser.numeroH}`);
  } catch (error) {
    console.error('Erreur chargement utilisateurs de test:', error);
  }
};

// Charger l'utilisateur de test en base au démarrage (si pas déjà présent)
loadTestUsers();

// Fonction pour gérer les confirmations par les parents vivants
async function handleParentConfirmations(user) {
  const confirmations = [];

  // Si le père est fourni, vérifier s'il est vivant
  if (user.numeroHPere) {
    const pere = await User.findOne({ 
      where: { 
        numeroH: user.numeroHPere, 
        type: 'vivant',
        isActive: true 
      } 
    });
    
    if (pere) {
      // Père vivant : créer une confirmation
      const confirmation = await FamilyTreeConfirmation.create({
        childNumeroH: user.numeroH,
        parentNumeroH: user.numeroHPere,
        parentType: 'pere',
        status: 'pending'
      });
      confirmations.push(confirmation);
    } else {
      // Père décédé ou n'existe pas : accès direct
      // L'utilisateur sera ajouté directement à l'arbre
    }
  }

  // Si la mère est fournie, vérifier si elle est vivante
  if (user.numeroHMere) {
    const mere = await User.findOne({ 
      where: { 
        numeroH: user.numeroHMere, 
        type: 'vivant',
        isActive: true 
      } 
    });
    
    if (mere) {
      // Mère vivante : créer une confirmation
      const confirmation = await FamilyTreeConfirmation.create({
        childNumeroH: user.numeroH,
        parentNumeroH: user.numeroHMere,
        parentType: 'mere',
        status: 'pending'
      });
      confirmations.push(confirmation);
    } else {
      // Mère décédée ou n'existe pas : accès direct
    }
  }

  // Si les deux parents sont décédés ou n'existent pas, ajouter directement à l'arbre
  const pereVivant = user.numeroHPere ? await User.findOne({ 
    where: { 
      numeroH: user.numeroHPere, 
      type: 'vivant', 
      isActive: true 
    } 
  }) : null;
  
  const mereVivante = user.numeroHMere ? await User.findOne({ 
    where: { 
      numeroH: user.numeroHMere, 
      type: 'vivant', 
      isActive: true 
    } 
  }) : null;

  if (!pereVivant && !mereVivante) {
    // Les deux parents sont décédés ou n'existent pas, accès direct
    await addUserToFamilyTree(user.numeroH, user.numeroHPere, user.numeroHMere);
  }

  return confirmations;
}

// Fonction pour ajouter un utilisateur à l'arbre familial
async function addUserToFamilyTree(numeroH, numeroHPere, numeroHMere) {
  
  // Trouver ou créer l'arbre
  let tree = await FamilyTree.findOne({
    where: {
      [Op.or]: [
        { numeroHPere, numeroHMere },
        { members: { [Op.contains]: [numeroH] } }
      ],
      isActive: true
    }
  });

  if (!tree && (numeroHPere || numeroHMere)) {
    // Chercher un arbre existant avec les mêmes parents
    tree = await FamilyTree.findOne({
      where: {
        [Op.or]: [
          { numeroHPere, numeroHMere },
          { numeroHPere, numeroHMere: null },
          { numeroHPere: null, numeroHMere }
        ],
        isActive: true
      }
    });
  }

  if (tree) {
    // Ajouter l'utilisateur à l'arbre existant
    const members = tree.members || [];
    if (!members.includes(numeroH)) {
      members.push(numeroH);
      await tree.update({ members });
    }
  } else {
    // Créer un nouvel arbre
    const user = await User.findOne({ where: { numeroH } });
    tree = await FamilyTree.create({
      rootMember: numeroH,
      numeroHPere: numeroHPere || user?.numeroHPere || null,
      numeroHMere: numeroHMere || user?.numeroHMere || null,
      members: [numeroH],
      deceasedMembers: []
    });
  }

  return tree;
}

// Fonction pour créer automatiquement les groupes d'activités et ajouter l'utilisateur
async function createActivityGroupsForUser(user) {
  try {
    const activities = [
      { type: 'Activité1', value: user.activite1 },
      { type: 'Activité2', value: user.activite2 },
      { type: 'Activité3', value: user.activite3 }
    ];

    for (const activity of activities) {
      if (activity.value) {
        // Chercher ou créer un groupe pour cette activité
        let group = await ActivityGroup.findOne({
          where: {
            activity: activity.type,
            name: activity.value,
            isActive: true
          }
        });

        if (!group) {
          // Créer un nouveau groupe pour cette activité
          group = await ActivityGroup.create({
            name: activity.value,
            description: `Organisation pour ${activity.type}: ${activity.value}`,
            activity: activity.type,
            members: [user.numeroH],
            posts: [],
            createdBy: user.numeroH
          });
        } else {
          // Ajouter l'utilisateur au groupe existant s'il n'est pas déjà membre
          const members = group.members || [];
          if (!members.includes(user.numeroH)) {
            members.push(user.numeroH);
            await group.update({ members });
          }
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la création des groupes d\'activités:', error);
    // Ne pas bloquer l'enregistrement si la création des groupes échoue
  }
}

// Fonction pour ajouter un décédé à l'arbre familial
async function addDeceasedToFamilyTree(numeroHD, numeroHPere, numeroHMere) {
  
  // Trouver l'arbre avec les mêmes parents
  let tree = await FamilyTree.findOne({
    where: {
      [Op.or]: [
        { numeroHPere, numeroHMere },
        { numeroHPere, numeroHMere: null },
        { numeroHPere: null, numeroHMere }
      ],
      isActive: true
    }
  });

  if (tree) {
    // Ajouter le décédé à l'arbre existant
    const deceasedMembers = tree.deceasedMembers || [];
    if (!deceasedMembers.includes(numeroHD)) {
      deceasedMembers.push(numeroHD);
      await tree.update({ deceasedMembers });
    }
  } else {
    // Créer un nouvel arbre pour les décédés
    tree = await FamilyTree.create({
      rootMember: numeroHD,
      numeroHPere: numeroHPere || null,
      numeroHMere: numeroHMere || null,
      members: [],
      deceasedMembers: [numeroHD]
    });
  }

  return tree;
}

// Middleware de validation
const validateUser = [
  body('numeroH').trim().notEmpty().withMessage('Le NumeroH est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
  body('nomFamille').trim().notEmpty().withMessage('Le nom de famille est requis'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Email invalide'),
];

// @route   POST /api/auth/register
// @desc    Enregistrer un nouvel utilisateur
// @access  Public
router.post('/register', validateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errList = errors.array();
      console.warn('[register] Validation échouée:', errList.map(e => ({ path: e.path, msg: e.msg })));
      console.warn('[register] Body reçu (clés):', Object.keys(req.body || {}));
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errList
      });
    }

    // Extraire les données nécessaires
    const { numeroH, email, password } = req.body;

    // Hasher le mot de passe
    const saltRounds = config.BCRYPT_ROUNDS;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer l'objet utilisateur avec TOUS les champs du formulaire
    const userData = {
      ...req.body, // Tous les champs du formulaire
      password: hashedPassword, // Remplacer par le mot de passe hashé
      numeroH: numeroH,
      genre: req.body.genre || 'AUTRE',
      dateNaissance: req.body.dateNaissance || null,
      generation: req.body.generation || 'G1',
      type: req.body.type || 'vivant',
      isActive: true,
      isVerified: false,
      role: 'user'
    };

    try {
      // Essayer d'utiliser la base de données PostgreSQL
      const where = email
        ? { [Op.or]: [{ numeroH: numeroH }, { email: email }] }
        : { numeroH: numeroH };
      const existingUser = await User.findOne({ where });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec ce NumeroH ou cet email existe déjà'
        });
      }

      // Si l'utilisateur est un défunt, créer un DeceasedMember au lieu d'un User
      if (userData.type === 'defunt' || userData.isDeceased) {
        // Les décédés n'ont pas de compte, seulement un enregistrement dans l'arbre
        const deceasedData = {
          numeroHD: userData.numeroH,
          prenom: userData.prenom,
          nomFamille: userData.nomFamille,
          genre: userData.genre,
          dateNaissance: userData.dateNaissance,
          dateDeces: userData.dateDeces,
          anneeDeces: userData.anneeDeces,
          lieuNaissance: userData.lieuNaissance,
          lieuDeces: userData.lieuDeces,
          numeroHPere: userData.numeroHPere,
          numeroHMere: userData.numeroHMere,
          prenomPere: userData.prenomPere,
          prenomMere: userData.prenomMere,
          pereStatut: userData.pereStatut || 'Mort',
          mereStatut: userData.mereStatut || 'Mort',
          ethnie: userData.ethnie,
          regionOrigine: userData.regionOrigine,
          pays: userData.pays,
          religion: userData.religion,
          statutSocial: userData.statutSocial,
          generation: userData.generation,
          decet: userData.decet,
          ageObtenu: userData.ageObtenu,
          photo: userData.photo,
          video: userData.video,
          preuve: userData.preuve,
          additionalInfo: userData.additionalInfo || null,
          createdBy: userData.createdBy || null
        };

        const deceased = await DeceasedMember.create(deceasedData);
        
        // Ajouter le décédé à l'arbre familial
        await addDeceasedToFamilyTree(deceased.numeroHD, deceased.numeroHPere, deceased.numeroHMere);
        
        return res.status(201).json({
          success: true,
          message: 'Décédé enregistré dans l\'arbre généalogique (pas de compte créé)',
          deceased: deceased.toJSON()
        });
      }

      // ✅ CRÉER L'UTILISATEUR EN BASE DE DONNÉES
      console.log('💾 Tentative de création utilisateur avec NumeroH:', userData.numeroH);
      const newUser = await User.create(userData);
      
      // ✅ VÉRIFIER QUE L'UTILISATEUR EST BIEN SAUVEGARDÉ EN BASE
      console.log('🔍 Vérification que le NumeroH est bien sauvegardé en base:', newUser.numeroH);
      
      // Recharger depuis la base pour s'assurer que tout est correct
      let savedUser = await User.findByNumeroH(newUser.numeroH);
      
      // Si l'utilisateur n'est pas trouvé, essayer plusieurs fois avec des délais
      if (!savedUser) {
        console.warn('⚠️ Utilisateur non trouvé immédiatement, nouvelle tentative...');
        // Attendre un peu pour la synchronisation de la base
        await new Promise(resolve => setTimeout(resolve, 500));
        savedUser = await User.findByNumeroH(newUser.numeroH);
      }
      
      // Si toujours pas trouvé, essayer avec findByPk
      if (!savedUser && newUser.numeroH) {
        console.warn('⚠️ Essai avec findByPk...');
        savedUser = await User.findByPk(newUser.numeroH);
      }
      
      // Si toujours pas trouvé, utiliser newUser directement mais logger l'erreur
      if (!savedUser) {
        console.error('❌ ERREUR: L\'utilisateur n\'a pas été trouvé en base après création!', {
          numeroH: newUser.numeroH,
          id: newUser.id || 'N/A'
        });
        // Utiliser newUser comme fallback mais continuer quand même
        savedUser = newUser;
      } else {
        console.log('✅ ✅ ✅ UTILISATEUR CRÉÉ ET VÉRIFIÉ EN BASE DE DONNÉES ✅ ✅ ✅');
        console.log('✅ NumeroH sauvegardé:', savedUser.numeroH);
        console.log('✅ Prénom:', savedUser.prenom);
        console.log('✅ Nom de famille:', savedUser.nomFamille);
        console.log('✅ L\'utilisateur peut maintenant se connecter avec ce NumeroH et son mot de passe');
      }

      // Gérer les confirmations par les parents vivants
      if (newUser.numeroHPere || newUser.numeroHMere) {
        await handleParentConfirmations(newUser);
      }

      // Créer automatiquement les groupes d'activités et ajouter l'utilisateur
      await createActivityGroupsForUser(newUser);

      // Générer le token JWT
      const token = jwt.sign(
        { userId: savedUser.numeroH, numeroH: savedUser.numeroH },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRE }
      );

      // Retourner la réponse (sans le mot de passe) - utiliser savedUser qui est vérifié en base
      const userWithoutPassword = { ...savedUser.dataValues };
      delete userWithoutPassword.password;

      console.log('✅ ✅ ✅ INSCRIPTION RÉUSSIE ✅ ✅ ✅');
      console.log('✅ NumeroH sauvegardé en base de données PostgreSQL:', savedUser.numeroH);
      console.log('✅ Utilisateur peut maintenant se connecter avec:');
      console.log('   - NumeroH:', savedUser.numeroH);
      console.log('   - Mot de passe: (celui qu\'il a choisi)');
      console.log('✅ Le NumeroH est UNIQUE et FIXE - il ne changera jamais');
      console.log('✅ NumeroH sauvegardé en base:', savedUser.numeroH);
      console.log('✅ Utilisateur peut maintenant se connecter avec ce NumeroH et son mot de passe');

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        user: userWithoutPassword,
        token
      });

    } catch (dbError) {
      console.error('❌ Erreur base de données lors de l\'inscription:', dbError);
      return res.status(500).json({
        success: false,
        message: 'La base de données est indisponible. Aucune inscription n\'a été enregistrée. Veuillez réessayer plus tard.'
      });
    }

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Connexion utilisateur
// @access  Public
router.post('/login', [
  body('numeroH').notEmpty().withMessage('Le NumeroH est requis'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { numeroH, password } = req.body;
    
    console.log('🔍 Tentative de connexion pour:', numeroH);

    try {
      // Essayer d'utiliser la base de données PostgreSQL
      // Normaliser le NumeroH avant la recherche
      const normalizedNumeroH = numeroH.trim().replace(/\s+/g, ' ');
      console.log('🔍 NumeroH normalisé pour recherche:', normalizedNumeroH);
      
      let user = await User.findByNumeroH(normalizedNumeroH);
      
      // Si pas trouvé avec le normalisé, essayer avec l'original
      if (!user && normalizedNumeroH !== numeroH.trim()) {
        console.log('🔍 Essai avec NumeroH original (non normalisé):', numeroH.trim());
        user = await User.findByNumeroH(numeroH.trim());
      }
      
      if (!user) {
        console.log('❌ NumeroH non trouvé dans la base de données:', numeroH);
        return res.status(401).json({
          success: false,
          message: 'NumeroH ou mot de passe incorrect',
        });
      }

      // Empêcher les décédés de se connecter
      if (user.type === 'defunt' || user.isDeceased) {
        console.log('❌ Tentative de connexion d\'un défunt:', numeroH);
        return res.status(403).json({
          success: false,
          message: 'Les décédés n\'ont pas de compte. Leurs informations sont dans l\'arbre généalogique.',
          numeroHExists: false
        });
      }
      
      console.log('✅ ✅ ✅ UTILISATEUR TROUVÉ DANS LA BASE DE DONNÉES ✅ ✅ ✅');
      console.log('✅ NumeroH:', user.numeroH);
      console.log('✅ Prénom:', user.prenom);
      console.log('✅ Nom:', user.nomFamille);
      console.log('✅ Le NumeroH permet bien l\'accès au compte utilisateur');

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('❌ Mot de passe incorrect pour:', numeroH);
        return res.status(401).json({
          success: false,
          message: 'Mot de passe incorrect',
          numeroHExists: true
        });
      }

      // Vérifier si l'utilisateur est actif
      if (!user.isActive) {
        console.log('❌ Compte désactivé:', numeroH);
        return res.status(401).json({
          success: false,
          message: 'Compte désactivé'
        });
      }

      // Mettre à jour la dernière connexion
      user.lastLogin = new Date();
      await user.save();

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.numeroH, numeroH: user.numeroH },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRE }
      );

      // Retourner la réponse (sans le mot de passe)
      const userWithoutPassword = { ...user.dataValues };
      delete userWithoutPassword.password;
      
      console.log('✅ ✅ ✅ CONNEXION RÉUSSIE ✅ ✅ ✅');
      console.log('✅ NumeroH utilisé:', numeroH);
      console.log('✅ Utilisateur trouvé dans la base de données PostgreSQL');
      console.log('✅ Prénom:', user.prenom);
      console.log('✅ Nom:', user.nomFamille);
      console.log('✅ Le NumeroH permet bien l\'accès au compte utilisateur');

      res.json({
        success: true,
        message: 'Connexion réussie',
        user: userWithoutPassword,
        token
      });

    } catch (dbError) {
      console.error('❌ Erreur base de données lors de la connexion:', dbError);
      return res.status(500).json({
        success: false,
        message: 'La base de données est indisponible. Connexion impossible pour le moment. Veuillez réessayer plus tard.'
      });
    }

  } catch (error) {
    console.error('💥 Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// @route   GET /api/auth/last-numero
// @desc    Récupérer le dernier numéro utilisé pour un préfixe donné
// @access  Public
router.get('/last-numero', async (req, res) => {
  try {
    const { prefix } = req.query;
    
    if (!prefix) {
      return res.status(400).json({
        success: false,
        message: 'Le préfixe est requis'
      });
    }
    
    try {
      // Chercher dans la base de données tous les NumeroH qui commencent par ce préfixe
      const users = await User.findAll({
        where: {
          numeroH: {
            [Op.like]: `${prefix}%`
          }
        },
        attributes: ['numeroH']
      });
      
      let maxNumber = 0;
      
      // Extraire le numéro le plus élevé
      users.forEach(user => {
        const numeroH = user.numeroH;
        if (numeroH && numeroH.startsWith(prefix)) {
          const parts = numeroH.split(' ');
          if (parts.length > 1) {
            const number = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(number) && number > maxNumber) {
              maxNumber = number;
            }
          }
        }
      });
      
      res.json({
        success: true,
        lastNumber: maxNumber,
        prefix: prefix
      });
      
    } catch (dbError) {
      console.warn('⚠️ Base de données indisponible pour last-numero:', dbError.message);
      // Retourner 0 si la base n'est pas disponible
      res.json({
        success: true,
        lastNumber: 0,
        prefix: prefix
      });
    }
  } catch (error) {
    console.error('Erreur récupération dernier numéro:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtenir les informations de l'utilisateur connecté
// @access  Private
router.get('/me', (req, res) => {
  // Middleware d'authentification à implémenter
  res.json({
    success: true,
    message: 'Endpoint d\'authentification fonctionnel'
  });
});

// @route   POST /api/auth/logout
// @desc    Déconnexion utilisateur
// @access  Private
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// @route   PUT /api/auth/profile
// @desc    Mettre à jour le profil utilisateur
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { numeroH } = req.body;
    
    if (!numeroH) {
      return res.status(400).json({
        success: false,
        message: 'NumeroH requis'
      });
    }

    const user = await User.findByNumeroH(numeroH);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Mettre à jour les champs autorisés
    const allowedFields = [
      'prenom', 'nomFamille', 'email', 'telephone', 'tel1', 'genre',
      'dateNaissance', 'age', 'generation', 'ethnie', 'region', 'pays',
      'nationalite', 'prenomPere', 'nomFamillePere', 'numeroHPere',
      'prenomMere', 'nomFamilleMere', 'numeroHMere'
    ];
    
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await user.update(updates);

    const userWithoutPassword = { ...user.dataValues };
    delete userWithoutPassword.password;

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du profil'
    });
  }
});

// @route   POST /api/auth/profile/photo
// @desc    Mettre à jour la photo de profil
// @access  Private
router.post('/profile/photo', (req, res) => {
  // Wrapper multer pour attraper ses erreurs et renvoyer du JSON propre
  upload.single('photo')(req, res, async (multerErr) => {
    if (multerErr) {
      console.error('Erreur multer upload photo:', multerErr);
      return res.status(400).json({
        success: false,
        message: multerErr.message || 'Erreur lors de l\'upload du fichier'
      });
    }

    try {
      const { numeroH } = req.body;

      if (!numeroH) {
        return res.status(400).json({
          success: false,
          message: 'NumeroH requis'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni'
        });
      }

      console.log('📸 Upload photo pour:', numeroH, '- Fichier:', req.file.filename);

      const user = await User.findByNumeroH(numeroH);

      if (!user) {
        console.log('❌ Utilisateur non trouvé pour photo:', numeroH);
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      const photoUrl = `/uploads/${req.file.filename}`;

      await user.update({ photo: photoUrl });

      const userWithoutPassword = { ...user.dataValues };
      delete userWithoutPassword.password;

      console.log('✅ Photo mise à jour:', photoUrl);

      res.json({
        success: true,
        message: 'Photo de profil mise à jour avec succès',
        photoUrl,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la mise à jour de la photo'
      });
    }
  });
});

export default router;