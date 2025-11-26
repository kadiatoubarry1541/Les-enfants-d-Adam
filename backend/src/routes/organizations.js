import express from 'express';
import { Op } from 'sequelize';
import OrganizationGroup from '../models/OrganizationGroup.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// @route   GET /api/organizations/groups
// @desc    Récupérer les organisations d'organisation
// @access  Authentifié
router.get('/groups', async (req, res) => {
  try {
    const { type } = req.query;
    
    const where = { isActive: true };
    if (type) {
      where.type = type;
    }
    
    const groups = await OrganizationGroup.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      groups
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des organisations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des organisations'
    });
  }
});

// @route   POST /api/organizations/groups
// @desc    Créer un nouveau organisation d'organisation
// @access  Authentifié
router.post('/groups', async (req, res) => {
  try {
    const { name, description, type, createdBy } = req.body;
    
    const group = await OrganizationGroup.create({
      name,
      description,
      type,
      members: [createdBy || req.user.numeroH],
      posts: [],
      createdBy: createdBy || req.user.numeroH
    });
    
    res.status(201).json({
      success: true,
      group,
      message: 'Organisation créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du organisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du organisation'
    });
  }
});

// @route   POST /api/organizations/groups/:id/join
// @desc    Rejoindre un organisation d'organisation
// @access  Authentisé
router.post('/groups/:id/join', async (req, res) => {
  try {
    const { numeroH } = req.body;
    const group = await OrganizationGroup.findByPk(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Organisation non trouvé'
      });
    }
    
    const members = group.members || [];
    if (!members.includes(numeroH)) {
      members.push(numeroH);
      await group.update({ members });
    }
    
    res.json({
      success: true,
      message: 'Vous avez rejoint le organisation avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'adhésion au organisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'adhésion au organisation'
    });
  }
});

// @route   POST /api/organizations/groups/:id/posts
// @desc    Créer un post dans un organisation d'organisation
// @access  Authentifié
router.post('/groups/:id/posts', async (req, res) => {
  try {
    const { content, type, author, authorName } = req.body;
    const group = await OrganizationGroup.findByPk(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Organisation non trouvé'
      });
    }
    
    const posts = group.posts || [];
    const newPost = {
      id: Date.now().toString(),
      author,
      authorName,
      content,
      type,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    await group.update({ posts });
    
    res.status(201).json({
      success: true,
      post: newPost,
      message: 'Post créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du post'
    });
  }
});

export default router;








