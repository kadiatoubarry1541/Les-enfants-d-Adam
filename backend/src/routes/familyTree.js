import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import DeceasedMember from '../models/DeceasedMember.js';
import FamilyTreeConfirmation from '../models/FamilyTreeConfirmation.js';
import { FamilyTree } from '../models/additional.js';
import { Op } from 'sequelize';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// ========== GESTION DES ARBRES GÉNÉALOGIQUES ==========

// @route   GET /api/family-tree/tree
// @desc    Récupérer l'arbre généalogique de l'utilisateur
// @access  Authentifié
router.get('/tree', async (req, res) => {
  try {
    const user = req.user;
    
    // Trouver l'arbre auquel appartient l'utilisateur
    let tree = await FamilyTree.findOne({
      where: {
        [Op.or]: [
          { rootMember: user.numeroH },
          { members: { [Op.contains]: [user.numeroH] } },
          { chefFamille1: user.numeroH },
          { chefFamille2: user.numeroH }
        ],
        isActive: true
      }
    });

    // Si l'arbre n'existe pas, le créer automatiquement
    if (!tree) {
      tree = await createOrFindFamilyTree(user);
    }

    // Récupérer tous les membres de l'arbre (vivants et décédés)
    const members = await getTreeMembers(tree);
    const deceasedMembers = await getTreeDeceasedMembers(tree);

    res.json({
      success: true,
      tree: {
        id: tree.id,
        rootMember: tree.rootMember,
        chefFamille1: tree.chefFamille1,
        chefFamille2: tree.chefFamille2,
        members,
        deceasedMembers
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'arbre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'arbre'
    });
  }
});

// Fonction pour créer ou trouver un arbre généalogique
async function createOrFindFamilyTree(user) {
  // Vérifier si l'utilisateur a des parents
  const numeroHPere = user.numeroHPere;
  const numeroHMere = user.numeroHMere;

  // Si l'utilisateur a des parents, chercher un arbre existant avec ces parents
  if (numeroHPere || numeroHMere) {
    const existingTree = await FamilyTree.findOne({
      where: {
        [Op.or]: [
          { numeroHPere, numeroHMere },
          { numeroHPere, numeroHMere: null },
          { numeroHPere: null, numeroHMere }
        ],
        isActive: true
      }
    });

    if (existingTree) {
      // Ajouter l'utilisateur à l'arbre existant
      const members = existingTree.members || [];
      if (!members.includes(user.numeroH)) {
        members.push(user.numeroH);
        await existingTree.update({ members });
      }
      return existingTree;
    }
  }

  // Créer un nouvel arbre
  const newTree = await FamilyTree.create({
    rootMember: user.numeroH,
    numeroHPere: user.numeroHPere || null,
    numeroHMere: user.numeroHMere || null,
    members: [user.numeroH],
    deceasedMembers: []
  });

  return newTree;
}

// Fonction pour récupérer les membres vivants de l'arbre
async function getTreeMembers(tree) {
  const members = tree.members || [];
  const users = await User.findAll({
    where: {
      numeroH: { [Op.in]: members },
      type: 'vivant',
      isActive: true
    },
    attributes: ['numeroH', 'prenom', 'nomFamille', 'genre', 'dateNaissance', 'photo']
  });
  return users;
}

// Fonction pour récupérer les membres décédés de l'arbre
async function getTreeDeceasedMembers(tree) {
  const deceasedMembers = tree.deceasedMembers || [];
  const deceased = await DeceasedMember.findAll({
    where: {
      numeroHD: { [Op.in]: deceasedMembers },
      isActive: true
    }
  });
  return deceased;
}

// ========== GESTION DES CONFIRMATIONS PAR LES PARENTS ==========

// @route   POST /api/family-tree/request-access
// @desc    Demander l'accès à l'arbre familial (créer des confirmations)
// @access  Authentifié
router.post('/request-access', async (req, res) => {
  try {
    const user = req.user;
    const { numeroHPere, numeroHMere } = req.body;

    // Vérifier que l'utilisateur a fourni au moins un parent
    if (!numeroHPere && !numeroHMere) {
      return res.status(400).json({
        success: false,
        message: 'Au moins un parent (père ou mère) est requis'
      });
    }

    const confirmations = [];

    // Si le père est fourni, vérifier s'il est vivant ou décédé
    if (numeroHPere) {
      const pere = await User.findOne({ where: { numeroH: numeroHPere, type: 'vivant' } });
      
      if (pere && pere.isActive) {
        // Père vivant : créer une confirmation
        const confirmation = await FamilyTreeConfirmation.create({
          childNumeroH: user.numeroH,
          parentNumeroH: numeroHPere,
          parentType: 'pere',
          status: 'pending'
        });
        confirmations.push(confirmation);
      } else {
        // Père décédé : accès direct (pas de confirmation nécessaire)
        // L'utilisateur sera ajouté directement à l'arbre
      }
    }

    // Si la mère est fournie, vérifier si elle est vivante ou décédée
    if (numeroHMere) {
      const mere = await User.findOne({ where: { numeroH: numeroHMere, type: 'vivant' } });
      
      if (mere && mere.isActive) {
        // Mère vivante : créer une confirmation
        const confirmation = await FamilyTreeConfirmation.create({
          childNumeroH: user.numeroH,
          parentNumeroH: numeroHMere,
          parentType: 'mere',
          status: 'pending'
        });
        confirmations.push(confirmation);
      } else {
        // Mère décédée : accès direct (pas de confirmation nécessaire)
      }
    }

    // Si les deux parents sont décédés, ajouter directement à l'arbre
    const pereVivant = numeroHPere ? await User.findOne({ where: { numeroH: numeroHPere, type: 'vivant', isActive: true } }) : null;
    const mereVivante = numeroHMere ? await User.findOne({ where: { numeroH: numeroHMere, type: 'vivant', isActive: true } }) : null;

    if (!pereVivant && !mereVivante) {
      // Les deux parents sont décédés ou n'existent pas, accès direct
      await addUserToFamilyTree(user.numeroH, numeroHPere, numeroHMere);
    }

    res.json({
      success: true,
      message: confirmations.length > 0 
        ? 'Demandes de confirmation envoyées aux parents vivants' 
        : 'Accès direct accordé (parents décédés)',
      confirmations
    });
  } catch (error) {
    console.error('Erreur lors de la demande d\'accès:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la demande d\'accès'
    });
  }
});

// @route   GET /api/family-tree/pending-confirmations
// @desc    Récupérer les confirmations en attente pour l'utilisateur (en tant que parent)
// @access  Authentifié
router.get('/pending-confirmations', async (req, res) => {
  try {
    const user = req.user;
    const confirmations = await FamilyTreeConfirmation.getPendingConfirmations(user.numeroH);

    // Récupérer les informations des enfants
    const confirmationsWithChildren = await Promise.all(
      confirmations.map(async (conf) => {
        const child = await User.findOne({
          where: { numeroH: conf.childNumeroH },
          attributes: ['numeroH', 'prenom', 'nomFamille', 'dateNaissance', 'photo']
        });
        return {
          ...conf.toJSON(),
          child
        };
      })
    );

    res.json({
      success: true,
      confirmations: confirmationsWithChildren
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des confirmations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des confirmations'
    });
  }
});

// @route   POST /api/family-tree/confirm-access/:confirmationId
// @desc    Confirmer l'accès d'un enfant à l'arbre familial
// @access  Authentifié
router.post('/confirm-access/:confirmationId', async (req, res) => {
  try {
    const { confirmationId } = req.params;
    const user = req.user;

    const confirmation = await FamilyTreeConfirmation.findByPk(confirmationId);

    if (!confirmation) {
      return res.status(404).json({
        success: false,
        message: 'Confirmation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est bien le parent concerné
    if (confirmation.parentNumeroH !== user.numeroH) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à confirmer cette demande'
      });
    }

    // Confirmer l'accès
    await FamilyTreeConfirmation.confirmAccess(confirmation.childNumeroH, user.numeroH);

    // Ajouter l'enfant à l'arbre familial
    await addUserToFamilyTree(confirmation.childNumeroH, null, null);

    res.json({
      success: true,
      message: 'Accès confirmé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la confirmation'
    });
  }
});

// @route   POST /api/family-tree/reject-access/:confirmationId
// @desc    Rejeter l'accès d'un enfant à l'arbre familial
// @access  Authentifié
router.post('/reject-access/:confirmationId', async (req, res) => {
  try {
    const { confirmationId } = req.params;
    const user = req.user;

    const confirmation = await FamilyTreeConfirmation.findByPk(confirmationId);

    if (!confirmation) {
      return res.status(404).json({
        success: false,
        message: 'Confirmation non trouvée'
      });
    }

    if (confirmation.parentNumeroH !== user.numeroH) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à rejeter cette demande'
      });
    }

    confirmation.status = 'rejected';
    confirmation.rejectedAt = new Date();
    await confirmation.save();

    res.json({
      success: true,
      message: 'Accès rejeté'
    });
  } catch (error) {
    console.error('Erreur lors du rejet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du rejet'
    });
  }
});

// ========== GESTION DES CHEFS DE FAMILLE ==========

// @route   PUT /api/family-tree/set-family-heads
// @desc    Nommer les chefs de famille (2 par arbre)
// @access  Authentifié (doit être chef de famille ou admin)
router.put('/set-family-heads', async (req, res) => {
  try {
    const user = req.user;
    const { chefFamille1, chefFamille2 } = req.body;

    if (!chefFamille1 && !chefFamille2) {
      return res.status(400).json({
        success: false,
        message: 'Au moins un chef de famille est requis'
      });
    }

    // Trouver l'arbre de l'utilisateur
    const tree = await FamilyTree.findOne({
      where: {
        [Op.or]: [
          { rootMember: user.numeroH },
          { members: { [Op.contains]: [user.numeroH] } },
          { chefFamille1: user.numeroH },
          { chefFamille2: user.numeroH }
        ],
        isActive: true
      }
    });

    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Arbre généalogique non trouvé'
      });
    }

    // Vérifier que l'utilisateur est un chef de famille actuel ou admin
    const isCurrentHead = tree.chefFamille1 === user.numeroH || tree.chefFamille2 === user.numeroH;
    const isAdmin = user.role === 'admin' || user.role === 'super-admin' || user.numeroH === 'G0C0P0R0E0F0 0';

    if (!isCurrentHead && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les chefs de famille ou les administrateurs peuvent nommer les chefs'
      });
    }

    // Vérifier que les nouveaux chefs sont membres de l'arbre
    const members = tree.members || [];
    if (chefFamille1 && !members.includes(chefFamille1)) {
      return res.status(400).json({
        success: false,
        message: 'Le premier chef de famille doit être membre de l\'arbre'
      });
    }
    if (chefFamille2 && !members.includes(chefFamille2)) {
      return res.status(400).json({
        success: false,
        message: 'Le deuxième chef de famille doit être membre de l\'arbre'
      });
    }

    // Mettre à jour les chefs de famille
    await tree.update({
      chefFamille1: chefFamille1 || tree.chefFamille1,
      chefFamille2: chefFamille2 || tree.chefFamille2
    });

    res.json({
      success: true,
      message: 'Chefs de famille mis à jour avec succès',
      tree
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des chefs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour des chefs'
    });
  }
});

// ========== GESTION DES DÉCÉDÉS ==========

// @route   POST /api/family-tree/add-deceased
// @desc    Ajouter un décédé à l'arbre généalogique (sans compte)
// @access  Authentifié
router.post('/add-deceased', async (req, res) => {
  try {
    const user = req.user;
    const deceasedData = req.body;

    // Créer le membre décédé
    const deceased = await DeceasedMember.create({
      ...deceasedData,
      createdBy: user.numeroH
    });

    // Ajouter le décédé à l'arbre familial
    await addDeceasedToFamilyTree(deceased.numeroHD, deceased.numeroHPere, deceased.numeroHMere);

    res.json({
      success: true,
      message: 'Décédé ajouté à l\'arbre généalogique avec succès',
      deceased
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du décédé:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'ajout du décédé'
    });
  }
});

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

export default router;

