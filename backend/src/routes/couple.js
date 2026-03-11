import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import CoupleLink from '../models/CoupleLink.js';
import CoupleActivity from '../models/CoupleActivity.js';
import PartnerRating from '../models/PartnerRating.js';
import { sequelize } from '../config/database.js';

const router = express.Router();
router.use(authenticate);

// Crée la table couple_activities si elle n'existe pas (dev ET production)
async function ensureCoupleActivityTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "couple_activities" (
        "id"             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "numero_h1"      VARCHAR(255) NOT NULL,
        "numero_h2"      VARCHAR(255) NOT NULL,
        "from_numero_h"  VARCHAR(255) NOT NULL,
        "to_numero_h"    VARCHAR(255) NOT NULL,
        "type"           VARCHAR(50)  DEFAULT 'message',
        "content"        TEXT,
        "media_url"      TEXT,
        "is_active"      BOOLEAN      DEFAULT true,
        "created_at"     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "updated_at"     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_ca_pair ON "couple_activities" ("numero_h1", "numero_h2");`).catch(() => {});
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_ca_from ON "couple_activities" ("from_numero_h");`).catch(() => {});
    await sequelize.query(`ALTER TABLE "couple_activities" ALTER COLUMN "media_url" TYPE TEXT;`).catch(() => {});
  } catch (err) {
    console.warn('⚠️ ensureCoupleActivityTable:', err.message);
  }
}

/** Admin : aucune condition, tout voir et tout gérer. */
const isAdmin = (user) =>
  !!(
    user &&
    (
      user.role === 'admin' ||
      user.role === 'super-admin' ||
      user.numeroH === 'G7C7P7R7E7F7 7' ||
      user.bypassRestrictions
    )
  );

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
 * POST /api/couple/reject/:linkId
 * Le destinataire (partenaire) refuse le lien. L'initiateur pourra voir le refus (message "Désolé").
 */
router.post('/reject/:linkId', async (req, res) => {
  try {
    const user = req.user;
    const { linkId } = req.params;
    const { message } = req.body || {};
    const link = await CoupleLink.findByPk(linkId);
    if (!link || !link.isActive) {
      return res.status(404).json({ success: false, message: 'Lien non trouvé' });
    }
    if (link.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Ce lien n\'est plus en attente' });
    }
    const isDestinataire = link.initiatedByNumeroH !== user.numeroH && (link.numeroH1 === user.numeroH || link.numeroH2 === user.numeroH);
    if (!isDestinataire && !isAdmin(user)) {
      return res.status(403).json({ success: false, message: 'Seul le destinataire peut refuser ce lien' });
    }
    link.status = 'rejected';
    await link.save();
    res.json({
      success: true,
      message: 'Lien refusé. L\'autre personne sera notifiée.',
      rejectedMessage: message || 'Désolé, je ne souhaite pas créer ce lien.'
    });
  } catch (error) {
    console.error('Erreur rejet lien couple:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * GET /api/couple/pending-sent
 * Demandes envoyées par moi (en attente ou refusées), pour voir les réponses.
 */
router.get('/pending-sent', async (req, res) => {
  try {
    const user = req.user;
    const links = await CoupleLink.findAll({
      where: { initiatedByNumeroH: user.numeroH, isActive: true },
      order: [['createdAt', 'DESC']]
    });
    const withPartner = await Promise.all(
      links.map(async (link) => {
        const partnerNumeroH = link.numeroH1 === user.numeroH ? link.numeroH2 : link.numeroH1;
        const partner = await User.findOne({
          where: { numeroH: partnerNumeroH },
          attributes: ['numeroH', 'prenom', 'nomFamille', 'photo', 'genre']
        });
        return { ...link.toJSON(), partner: partner ? partner.toJSON() : null };
      })
    );
    res.json({ success: true, invitations: withPartner });
  } catch (error) {
    console.error('Erreur demandes envoyées couple:', error);
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
 * GET /api/couple/ratings/received
 * Notes que mon partenaire m'a données (pour la femme : tableau uniquement).
 */
router.get('/ratings/received', async (req, res) => {
  try {
    const user = req.user;
    const list = await PartnerRating.getReceivedBy(user.numeroH);
    res.json({ success: true, ratings: list.map((r) => r.toJSON()) });
  } catch (error) {
    console.error('Erreur récupération notes reçues:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * GET /api/couple/ratings/given
 * Notes que j'ai données à mon partenaire (pour le mari : tableau + formulaire).
 * Nécessite un lien actif.
 */
router.get('/ratings/given', async (req, res) => {
  try {
    const user = req.user;
    const link = await CoupleLink.getMyPartner(user.numeroH);
    if (!link) {
      return res.json({ success: true, ratings: [] });
    }
    const partnerNumeroH = link.numeroH1 === user.numeroH ? link.numeroH2 : link.numeroH1;
    const list = await PartnerRating.getForPair(user.numeroH, partnerNumeroH);
    res.json({ success: true, ratings: list.map((r) => r.toJSON()) });
  } catch (error) {
    console.error('Erreur récupération notes données:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * POST /api/couple/ratings
 * Ajouter une note pour mon partenaire (ex: mari → femme). Body: { annee, note }.
 */
router.post('/ratings', async (req, res) => {
  try {
    const user = req.user;
    const { annee, note } = req.body;
    if (annee == null || note == null) {
      return res.status(400).json({ success: false, message: 'annee et note sont requis' });
    }
    const link = await CoupleLink.getMyPartner(user.numeroH);
    if (!link) {
      return res.status(403).json({ success: false, message: 'Aucun partenaire lié' });
    }
    const partnerNumeroH = link.numeroH1 === user.numeroH ? link.numeroH2 : link.numeroH1;
    const numNote = Math.min(5, Math.max(1, parseInt(note, 10)));
    const numAnnee = parseInt(annee, 10) || new Date().getFullYear();
    const rating = await PartnerRating.create({
      fromNumeroH: user.numeroH,
      toNumeroH: partnerNumeroH,
      annee: numAnnee,
      note: numNote
    });
    res.json({ success: true, rating: rating.toJSON() });
  } catch (error) {
    console.error('Erreur ajout note partenaire:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
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
    await ensureCoupleActivityTable();
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
