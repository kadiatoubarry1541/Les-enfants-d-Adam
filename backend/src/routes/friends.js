import express from 'express';
import { Op } from 'sequelize';
import Friend from '../models/Friend.js';
import FriendRequest from '../models/FriendRequest.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// ─── Aliases pour MesAmours.tsx ───────────────────────────────────────────────

// GET /api/friends/list → amis de l'utilisateur connecté
router.get('/list', async (req, res) => {
  try {
    const numeroH = req.user.numeroH;
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [
          { userNumeroH: numeroH },
          { friendNumeroH: numeroH }
        ],
        status: 'accepted'
      },
      order: [['acceptedAt', 'DESC']]
    });
    res.json({ success: true, friends });
  } catch (error) {
    console.error('Erreur /friends/list:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/friends/requests → demandes en attente pour l'utilisateur connecté
router.get('/requests', async (req, res) => {
  try {
    const requests = await FriendRequest.findAll({
      where: { toUser: req.user.numeroH, status: 'pending' },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Erreur /friends/requests:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/friends/send-request → envoyer une demande (fromUser = utilisateur connecté)
router.post('/send-request', async (req, res) => {
  try {
    const fromUser = req.user.numeroH;
    const { toUser, message } = req.body;
    if (!toUser) {
      return res.status(400).json({ success: false, message: 'NumeroH du destinataire requis' });
    }
    if (fromUser === toUser) {
      return res.status(400).json({ success: false, message: 'Vous ne pouvez pas vous ajouter vous-même' });
    }
    const existingRequest = await FriendRequest.findOne({
      where: { fromUser, toUser, status: 'pending' }
    });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Une demande d\'amitié est déjà en cours' });
    }
    const request = await FriendRequest.create({ fromUser, toUser, message: message || null, status: 'pending' });
    res.status(201).json({ success: true, request, message: 'Demande d\'amitié envoyée' });
  } catch (error) {
    console.error('Erreur /friends/send-request:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/friends/respond-request → répondre à une demande { requestId, action: 'accept'|'reject' }
router.post('/respond-request', async (req, res) => {
  try {
    const { requestId, action } = req.body;
    if (!requestId || !action) {
      return res.status(400).json({ success: false, message: 'requestId et action requis' });
    }
    const request = await FriendRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Demande non trouvée' });
    }
    const status = action === 'accept' ? 'accepted' : 'rejected';
    await request.update({ status });
    if (status === 'accepted') {
      await Friend.create({
        userNumeroH: request.fromUser,
        friendNumeroH: request.toUser,
        status: 'accepted',
        requestedAt: request.createdAt,
        acceptedAt: new Date()
      });
    }
    res.json({ success: true, message: action === 'accept' ? 'Demande acceptée' : 'Demande rejetée' });
  } catch (error) {
    console.error('Erreur /friends/respond-request:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

// @route   GET /api/friends/:numeroH
// @desc    Récupérer les amis d'un utilisateur
// @access  Authentifié
router.get('/:numeroH', async (req, res) => {
  try {
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [
          { userNumeroH: req.params.numeroH },
          { friendNumeroH: req.params.numeroH }
        ],
        status: 'accepted'
      },
      order: [['acceptedAt', 'DESC']]
    });
    
    res.json({
      success: true,
      friends
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des amis'
    });
  }
});

// @route   GET /api/friends/requests/:numeroH
// @desc    Récupérer les demandes d'amitié d'un utilisateur
// @access  Authentifié
router.get('/requests/:numeroH', async (req, res) => {
  try {
    const requests = await FriendRequest.findAll({
      where: {
        toUser: req.params.numeroH,
        status: 'pending'
      },
      order: [['createdAt', 'DESC']]
    });
    
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

// @route   POST /api/friends/request
// @desc    Envoyer une demande d'amitié
// @access  Authentifié
router.post('/request', async (req, res) => {
  try {
    const { toUser, message, fromUser } = req.body;
    
    if (!toUser || !fromUser) {
      return res.status(400).json({
        success: false,
        message: 'Utilisateur requis'
      });
    }
    
    // Vérifier si une demande existe déjà
    const existingRequest = await FriendRequest.findOne({
      where: {
        fromUser,
        toUser,
        status: 'pending'
      }
    });
    
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Une demande d\'amitié est déjà en cours'
      });
    }
    
    const request = await FriendRequest.create({
      fromUser,
      toUser,
      message,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      request,
      message: 'Demande d\'amitié envoyée'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'envoi de la demande'
    });
  }
});

// @route   POST /api/friends/requests/:id/respond
// @desc    Répondre à une demande d'amitié
// @access  Authentifié
router.post('/requests/:id/respond', async (req, res) => {
  try {
    const { response } = req.body;
    const request = await FriendRequest.findByPk(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }
    
    await request.update({ status: response });
    
    if (response === 'accepted') {
      // Créer la relation d'amitié
      await Friend.create({
        userNumeroH: request.fromUser,
        friendNumeroH: request.toUser,
        status: 'accepted',
        requestedAt: request.createdAt,
        acceptedAt: new Date()
      });
    }
    
    res.json({
      success: true,
      message: response === 'accepted' ? 'Demande acceptée' : 'Demande refusée'
    });
  } catch (error) {
    console.error('Erreur lors de la réponse à la demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la réponse à la demande'
    });
  }
});

// @route   DELETE /api/friends/:id
// @desc    Supprimer un ami
// @access  Authentifié
router.delete('/:id', async (req, res) => {
  try {
    const friend = await Friend.findByPk(req.params.id);
    
    if (!friend) {
      return res.status(404).json({
        success: false,
        message: 'Ami non trouvé'
      });
    }
    
    await friend.destroy();
    
    res.json({
      success: true,
      message: 'Ami supprimé'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'ami:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de l\'ami'
    });
  }
});

export default router;






















