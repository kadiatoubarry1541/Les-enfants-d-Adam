import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import CoupleLink from '../models/CoupleLink.js';
import CoupleActivity from '../models/CoupleActivity.js';

const router = express.Router();
router.use(authenticate);

/** Admin : aucune condition, tout voir et tout gérer. */
const isAdmin = (user) => !!(user && (user.role === 'admin' || user.role === 'super-admin' || user.numeroH === 'G0C0P0R0E0F0 0' || user.bypassRestrictions));

/**
 * POST /api/couple/link
 * Lier les deux partenaires par leurs NumeroH et le numéro unique du mariage à la mairie.
 * Le numéro mariage mairie doit être unique (jamais de répétition).
 */
router.post('/link', async (req, res) => {
  try {
    const user = req.user;
    const { partnerNumeroH, numeroMariageMairie } = req.body;

    if (!partnerNumeroH || !String(partnerNumeroH).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le NumeroH du partenaire est obligatoire'
      });
    }

    const numeroMariage = numeroMariageMairie ? String(numeroMariageMairie).trim() : null;

    const partner = await User.findByNumeroH(partnerNumeroH);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Aucun utilisateur trouvé avec ce NumeroH pour le partenaire'
      });
    }

    if (numeroMariage) {
      const existingByNumero = await CoupleLink.findByNumeroMariage(numeroMariage);
      if (existingByNumero) {
        return res.status(400).json({
          success: false,
          message: 'Ce numéro de mariage (mairie) est déjà utilisé. Chaque numéro doit être unique et sans répétition.'
        });
      }
    }

    const alreadyLinked = await CoupleLink.getMyPartner(user.numeroH);
    if (alreadyLinked) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà lié(e) à un partenaire'
      });
    }

    const partnerAlreadyLinked = await CoupleLink.getMyPartner(partnerNumeroH);
    if (partnerAlreadyLinked) {
      return res.status(400).json({
        success: false,
        message: 'Ce partenaire est déjà lié(e) à quelqu\'un d\'autre'
      });
    }

    const [n1, n2] = [user.numeroH, partnerNumeroH].sort();
    const existingPair = await CoupleLink.findOne({
      where: { numeroH1: n1, numeroH2: n2, isActive: true }
    });
    if (existingPair) {
      return res.status(400).json({
        success: false,
        message: 'Un lien (en attente ou actif) existe déjà entre vous deux'
      });
    }
    const link = await CoupleLink.create({
      numeroH1: n1,
      numeroH2: n2,
      numeroMariageMairie: numeroMariage || null,
      status: 'pending',
      initiatedByNumeroH: user.numeroH
    });

    res.json({
      success: true,
      message: 'Demande envoyée. C\'est au destinataire (votre partenaire) de confirmer le lien.',
      link: {
        id: link.id,
        numeroH1: link.numeroH1,
        numeroH2: link.numeroH2,
        numeroMariageMairie: link.numeroMariageMairie
      },
      partner: {
        numeroH: partner.numeroH,
        prenom: partner.prenom,
        nomFamille: partner.nomFamille,
        photo: partner.photo,
        genre: partner.genre
      }
    });
  } catch (error) {
    console.error('Erreur création lien couple:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du lien'
    });
  }
});

/**
 * GET /api/couple/pending-invitations
 * Invitations en attente pour le destinataire (le partenaire confirme).
 */
router.get('/pending-invitations', async (req, res) => {
  try {
    const user = req.user;
    const links = await CoupleLink.getPendingInvitations(user.numeroH);
    const withInitiator = await Promise.all(
      links.map(async (link) => {
        const initiatorNumeroH = link.initiatedByNumeroH;
        const initiator = await User.findOne({
          where: { numeroH: initiatorNumeroH },
          attributes: ['numeroH', 'prenom', 'nomFamille', 'photo', 'genre']
        });
        return { ...link.toJSON(), initiator: initiator ? initiator.toJSON() : null };
      })
    );
    res.json({ success: true, invitations: withInitiator });
  } catch (error) {
    console.error('Erreur invitations couple:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * POST /api/couple/confirm/:linkId
 * Le destinataire (partenaire) confirme le lien.
 */
router.post('/confirm/:linkId', async (req, res) => {
  try {
    const user = req.user;
    const { linkId } = req.params;
    const link = await CoupleLink.findByPk(linkId);
    if (!link || !link.isActive) {
      return res.status(404).json({ success: false, message: 'Lien non trouvé' });
    }
    if (link.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Ce lien n\'est plus en attente' });
    }
    const isDestinataire = link.initiatedByNumeroH !== user.numeroH && (link.numeroH1 === user.numeroH || link.numeroH2 === user.numeroH);
    if (!isDestinataire && !isAdmin(user)) {
      return res.status(403).json({ success: false, message: 'Seul le destinataire (votre partenaire) peut confirmer ce lien' });
    }
    link.status = 'active';
    link.confirmedAt = new Date();
    await link.save();
    res.json({ success: true, message: 'Lien confirmé. Vous êtes maintenant liés.' });
  } catch (error) {
    console.error('Erreur confirmation lien couple:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/couple/leave
 * Quitter / supprimer le lien (chacun est libre à tout moment). Body: linkId ou on trouve le lien de l'utilisateur.
 */
router.delete('/leave', async (req, res) => {
  try {
    const user = req.user;
    const { linkId } = req.body;
    let link;
    if (linkId) {
      link = await CoupleLink.findByPk(linkId);
    } else {
      link = await CoupleLink.getMyPartner(user.numeroH);
    }
    if (!link || !link.isActive) {
      return res.status(404).json({ success: false, message: 'Lien non trouvé' });
    }
    const isPartOf = link.numeroH1 === user.numeroH || link.numeroH2 === user.numeroH;
    if (!isPartOf && !isAdmin(user)) {
      return res.status(403).json({ success: false, message: 'Vous ne faites pas partie de ce lien' });
    }
    link.isActive = false;
    await link.save();
    res.json({ success: true, message: 'Lien supprimé. Vous avez quitté cette liaison.' });
  } catch (error) {
    console.error('Erreur suppression lien couple:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * GET /api/couple/my-partner
 * Récupérer mon partenaire lié (pour Mon Homme / Ma Femme).
 */
router.get('/my-partner', async (req, res) => {
  try {
    const user = req.user;
    const link = await CoupleLink.getMyPartner(user.numeroH);

    if (!link) {
      return res.json({
        success: true,
        partner: null,
        link: null
      });
    }

    const partnerNumeroH = link.numeroH1 === user.numeroH ? link.numeroH2 : link.numeroH1;
    const partner = await User.findOne({
      where: { numeroH: partnerNumeroH },
      attributes: ['numeroH', 'prenom', 'nomFamille', 'photo', 'genre']
    });

    res.json({
      success: true,
      partner: partner ? partner.toJSON() : null,
      link: {
        id: link.id,
        numeroMariageMairie: link.numeroMariageMairie
      }
    });
  } catch (error) {
    console.error('Erreur récupération partenaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

/**
 * GET /api/couple/activities
 * Activités partagées du couple (ce que chacun a fait pour l'autre).
 * Admin : sans partenaire lié, retourne toutes les activités couple (limit 500).
 */
router.get('/activities', async (req, res) => {
  try {
    const user = req.user;
    const link = await CoupleLink.getMyPartner(user.numeroH);

    if (link) {
      const activities = await CoupleActivity.getActivitiesForCouple(link.numeroH1, link.numeroH2);
      const fromIds = [...new Set(activities.map(a => a.fromNumeroH))];
      const users = await User.findAll({
        where: { numeroH: fromIds },
        attributes: ['numeroH', 'prenom', 'nomFamille']
      });
      const userMap = Object.fromEntries(users.map(u => [u.numeroH, u]));
      const list = activities.map(a => ({
        ...a.toJSON(),
        fromName: userMap[a.fromNumeroH] ? `${userMap[a.fromNumeroH].prenom} ${userMap[a.fromNumeroH].nomFamille}` : a.fromNumeroH
      }));
      return res.json({ success: true, activities: list });
    }

    if (isAdmin(user)) {
      const all = await CoupleActivity.findAll({
        where: { isActive: true },
        order: [['created_at', 'DESC']],
        limit: 500
      });
      const fromIds = [...new Set(all.map(a => a.fromNumeroH))];
      const users = await User.findAll({ where: { numeroH: fromIds }, attributes: ['numeroH', 'prenom', 'nomFamille'] });
      const userMap = Object.fromEntries(users.map(u => [u.numeroH, u]));
      const list = all.map(a => ({
        ...a.toJSON(),
        fromName: userMap[a.fromNumeroH] ? `${userMap[a.fromNumeroH].prenom} ${userMap[a.fromNumeroH].nomFamille}` : a.fromNumeroH
      }));
      return res.json({ success: true, activities: list, adminView: true });
    }

    res.json({ success: true, activities: [] });
  } catch (error) {
    console.error('Erreur récupération activités couple:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

/**
 * POST /api/couple/activity
 * Ajouter une activité (ce que je fais pour mon partenaire).
 */
router.post('/activity', async (req, res) => {
  try {
    const user = req.user;
    const { type, content, mediaUrl } = req.body;

    const link = await CoupleLink.getMyPartner(user.numeroH);
    if (!link) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas lié(e) à un partenaire. Liez-vous d\'abord avec le NumeroH et le numéro de mariage à la mairie.'
      });
    }

    const toNumeroH = link.numeroH1 === user.numeroH ? link.numeroH2 : link.numeroH1;

    const activity = await CoupleActivity.create({
      numeroH1: link.numeroH1,
      numeroH2: link.numeroH2,
      fromNumeroH: user.numeroH,
      toNumeroH,
      type: type || 'message',
      content: content || null,
      mediaUrl: mediaUrl || null
    });

    res.json({
      success: true,
      message: 'Activité enregistrée. Votre partenaire la verra sur sa page.',
      activity: {
        ...activity.toJSON(),
        fromName: `${user.prenom} ${user.nomFamille}`
      }
    });
  } catch (error) {
    console.error('Erreur ajout activité couple:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

/**
 * GET /api/couple/admin/all-links
 * Admin uniquement : toutes les liaisons couple (actives + en attente).
 */
router.get('/admin/all-links', async (req, res) => {
  try {
    const user = req.user;
    if (!isAdmin(user)) {
      return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs' });
    }
    const links = await CoupleLink.findAll({
      where: { isActive: true },
      order: [['created_at', 'DESC']]
    });
    const withUsers = await Promise.all(
      links.map(async (link) => {
        const [u1, u2] = await Promise.all([
          User.findOne({ where: { numeroH: link.numeroH1 }, attributes: ['numeroH', 'prenom', 'nomFamille', 'photo'] }),
          User.findOne({ where: { numeroH: link.numeroH2 }, attributes: ['numeroH', 'prenom', 'nomFamille', 'photo'] })
        ]);
        return {
          ...link.toJSON(),
          user1: u1 ? u1.toJSON() : null,
          user2: u2 ? u2.toJSON() : null
        };
      })
    );
    res.json({ success: true, links: withUsers });
  } catch (error) {
    console.error('Erreur admin all-links couple:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
