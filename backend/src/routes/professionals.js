import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import ProfessionalAccount from '../models/ProfessionalAccount.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// ============ INSCRIPTION PROFESSIONNELLE ============

// POST /api/professionals/register - Inscription d'un compte professionnel
router.post('/register', authenticate, async (req, res) => {
  try {
    const { type, name, description, address, city, country, phone, email, services, specialties, photo } = req.body;

    if (!type || !name) {
      return res.status(400).json({ success: false, message: 'Type et nom requis' });
    }

    const validTypes = ['clinic', 'security_agency', 'journalist', 'enterprise', 'school', 'supplier', 'scientist', 'ngo'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Type invalide' });
    }

    const account = await ProfessionalAccount.create({
      type,
      name,
      description: description || '',
      address: address || '',
      city: city || '',
      country: country || '',
      phone: phone || '',
      email: email || '',
      services: services || [],
      specialties: specialties || [],
      photo: photo || null,
      ownerNumeroH: req.userId,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Inscription envoyée. En attente de validation par l\'administrateur.',
      account
    });
  } catch (error) {
    console.error('Erreur inscription professionnelle:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============ CONSULTATION PUBLIQUE ============

// GET /api/professionals/approved?type=clinic - Liste des comptes approuvés par type
router.get('/approved', async (req, res) => {
  try {
    const { type } = req.query;
    let accounts;
    if (type) {
      accounts = await ProfessionalAccount.getApprovedByType(type);
    } else {
      accounts = await ProfessionalAccount.findAll({
        where: { status: 'approved', isActive: true },
        order: [['name', 'ASC']]
      });
    }
    res.json({ success: true, accounts });
  } catch (error) {
    console.error('Erreur liste approuvés:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/professionals/search?q=xxx&type=clinic - Recherche
router.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.json({ success: true, accounts: [] });
    const accounts = await ProfessionalAccount.searchAccounts(q, type || null);
    res.json({ success: true, accounts });
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/professionals/:id - Détails d'un compte
router.get('/detail/:id', async (req, res) => {
  try {
    const account = await ProfessionalAccount.findByPk(req.params.id);
    if (!account || !account.isActive) {
      return res.status(404).json({ success: false, message: 'Compte non trouvé' });
    }
    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============ ESPACE PROPRIÉTAIRE ============

// GET /api/professionals/my-accounts - Mes comptes professionnels
router.get('/my-accounts', authenticate, async (req, res) => {
  try {
    const accounts = await ProfessionalAccount.getByOwner(req.userId);
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/professionals/:id - Mettre à jour mon compte
router.put('/:id', authenticate, async (req, res) => {
  try {
    const account = await ProfessionalAccount.findByPk(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Compte non trouvé' });
    }
    if (account.ownerNumeroH !== req.userId) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    const { name, description, address, city, country, phone, email, services, specialties, photo } = req.body;
    await account.update({
      name: name || account.name,
      description: description !== undefined ? description : account.description,
      address: address !== undefined ? address : account.address,
      city: city !== undefined ? city : account.city,
      country: country !== undefined ? country : account.country,
      phone: phone !== undefined ? phone : account.phone,
      email: email !== undefined ? email : account.email,
      services: services !== undefined ? services : account.services,
      specialties: specialties !== undefined ? specialties : account.specialties,
      photo: photo !== undefined ? photo : account.photo
    });

    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============ ADMINISTRATION ============

// GET /api/professionals/admin/pending - Comptes en attente (admin)
router.get('/admin/pending', authenticate, requireAdmin, async (req, res) => {
  try {
    const accounts = await ProfessionalAccount.getPendingAccounts();
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/professionals/admin/all - Tous les comptes (admin)
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { type, status } = req.query;
    const where = { isActive: true };
    if (type) where.type = type;
    if (status) where.status = status;
    const accounts = await ProfessionalAccount.findAll({ where, order: [['created_at', 'DESC']] });
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/professionals/admin/approve/:id - Approuver un compte (admin)
router.post('/admin/approve/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const account = await ProfessionalAccount.findByPk(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Compte non trouvé' });
    }

    await account.update({
      status: 'approved',
      approvedAt: new Date(),
      approvedBy: req.userId
    });

    // Notifier le propriétaire
    const typeLabels = {
      clinic: 'Clinique/Hôpital', security_agency: 'Agence de sécurité',
      journalist: 'Journaliste', enterprise: 'Entreprise',
      school: 'École/Professeur', supplier: 'Fournisseur'
    };

    await Notification.createNotification({
      recipientNumeroH: account.ownerNumeroH,
      type: 'account_approved',
      title: 'Compte approuvé !',
      message: `Votre compte ${typeLabels[account.type]} "${account.name}" a été approuvé. Vous avez maintenant accès à votre espace de travail.`,
      relatedId: account.id
    });

    res.json({ success: true, message: 'Compte approuvé', account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/professionals/admin/reject/:id - Rejeter un compte (admin)
router.post('/admin/reject/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const account = await ProfessionalAccount.findByPk(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Compte non trouvé' });
    }

    const { reason } = req.body;
    await account.update({
      status: 'rejected',
      rejectionReason: reason || 'Demande rejetée par l\'administrateur'
    });

    await Notification.createNotification({
      recipientNumeroH: account.ownerNumeroH,
      type: 'account_rejected',
      title: 'Compte non approuvé',
      message: `Votre demande "${account.name}" a été rejetée. Raison: ${reason || 'Non spécifiée'}`,
      relatedId: account.id
    });

    res.json({ success: true, message: 'Compte rejeté', account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE /api/professionals/admin/:id - Supprimer un compte (admin)
router.delete('/admin/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const account = await ProfessionalAccount.findByPk(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Compte non trouvé' });
    }
    await account.update({ isActive: false });
    res.json({ success: true, message: 'Compte supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
