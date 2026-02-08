import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import ParentChildLink from '../models/ParentChildLink.js';
import ParentChildActivity from '../models/ParentChildActivity.js';
import { Op } from 'sequelize';

const router = express.Router();
router.use(authenticate);

/** Admin : aucune condition, tout voir et tout gérer. */
const isAdmin = (user) => !!(user && (user.role === 'admin' || user.role === 'super-admin' || user.numeroH === 'G0C0P0R0E0F0 0' || user.bypassRestrictions));

/**
 * POST /api/parent-child/link
 * Le parent ajoute un enfant avec le numéro unique (code), NumeroH de l'enfant et numéro maternité.
 */
router.post('/link', async (req, res) => {
  try {
    const user = req.user;
    const { codeLiaison, childNumeroH, numeroMaternite, parentType } = req.body;

    if (!childNumeroH || !String(childNumeroH).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le NumeroH de l\'apprenant est obligatoire'
      });
    }

    const typeParent = parentType && ['pere', 'mere'].includes(parentType) ? parentType : 'pere';

    const child = await User.findByNumeroH(childNumeroH);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Aucun utilisateur trouvé avec ce NumeroH pour l\'apprenant'
      });
    }

    const existing = await ParentChildLink.findOne({
      where: {
        parentNumeroH: user.numeroH,
        childNumeroH,
        parentType: typeParent,
        isActive: true
      }
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ce lien parent-enfant existe déjà'
      });
    }

    const link = await ParentChildLink.create({
      parentNumeroH: user.numeroH,
      childNumeroH: String(childNumeroH).trim(),
      codeLiaison: codeLiaison ? String(codeLiaison).trim() : null,
      numeroMaternite: numeroMaternite ? String(numeroMaternite).trim() : null,
      parentType: typeParent,
      status: 'pending'
    });

    res.json({
      success: true,
      message: 'Demande envoyée. C\'est au destinataire (l\'apprenant) de confirmer le lien.',
      link: {
        id: link.id,
        parentNumeroH: link.parentNumeroH,
        childNumeroH: link.childNumeroH,
        codeLiaison: link.codeLiaison,
        numeroMaternite: link.numeroMaternite,
        parentType: link.parentType,
        status: link.status
      },
      child: {
        numeroH: child.numeroH,
        prenom: child.prenom,
        nomFamille: child.nomFamille,
        dateNaissance: child.dateNaissance,
        photo: child.photo
      }
    });
  } catch (error) {
    console.error('Erreur création lien parent-enfant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du lien'
    });
  }
});

/**
 * POST /api/parent-child/register-parents
 * L'apprenant (connecté) enregistre les NumeroH de ses parents pour qu'ils puissent le suivre.
 * Body: { parent1NumeroH, parent2NumeroH? }
 */
router.post('/register-parents', async (req, res) => {
  try {
    const user = req.user;
    const { parent1NumeroH, parent2NumeroH } = req.body;
    if (!parent1NumeroH || !String(parent1NumeroH).trim()) {
      return res.status(400).json({
        success: false,
        message: 'NumeroH du parent 1 est requis'
      });
    }
    const childNumeroH = user.numeroH;
    const parents = [parent1NumeroH.trim()];
    if (parent2NumeroH && String(parent2NumeroH).trim()) {
      parents.push(parent2NumeroH.trim());
    }
    const created = [];
    for (const parentNumeroH of parents) {
      if (parentNumeroH === childNumeroH) continue;
      const parentUser = await User.findByNumeroH(parentNumeroH);
      if (!parentUser) continue;
      const existing = await ParentChildLink.findOne({
        where: {
          parentNumeroH,
          childNumeroH,
          isActive: true
        }
      });
      if (existing) continue;
      const link = await ParentChildLink.create({
        parentNumeroH,
        childNumeroH,
        parentType: 'pere',
        status: 'active',
        confirmedAt: new Date()
      });
      created.push({ parentNumeroH, linkId: link.id });
    }
    res.json({
      success: true,
      message: created.length
        ? 'NumeroH des parents enregistrés. Ils pourront suivre votre progression.'
        : 'Aucun nouveau parent ajouté (déjà liés ou NumeroH invalides).',
      created: created.length
    });
  } catch (error) {
    console.error('Erreur register-parents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement des parents'
    });
  }
});

/**
 * GET /api/parent-child/pending-invitations
 * Invitations en attente pour l'enfant (le destinataire confirme).
 */
router.get('/pending-invitations', async (req, res) => {
  try {
    const user = req.user;
    const links = await ParentChildLink.getPendingInvitationsForChild(user.numeroH);
    const withParent = await Promise.all(
      links.map(async (link) => {
        const parent = await User.findOne({
          where: { numeroH: link.parentNumeroH },
          attributes: ['numeroH', 'prenom', 'nomFamille', 'photo', 'genre']
        });
        return { ...link.toJSON(), parent };
      })
    );
    res.json({ success: true, invitations: withParent });
  } catch (error) {
    console.error('Erreur invitations en attente:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * POST /api/parent-child/confirm/:linkId
 * L'enfant (destinataire) confirme le lien.
 */
router.post('/confirm/:linkId', async (req, res) => {
  try {
    const user = req.user;
    const { linkId } = req.params;
    const link = await ParentChildLink.findByPk(linkId);
    if (!link || !link.isActive) {
      return res.status(404).json({ success: false, message: 'Lien non trouvé' });
    }
    if (link.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Ce lien n\'est plus en attente' });
    }
    if (link.childNumeroH !== user.numeroH && !isAdmin(user)) {
      return res.status(403).json({ success: false, message: 'Seul l\'apprenant (destinataire) peut confirmer ce lien' });
    }
    link.status = 'active';
    link.confirmedAt = new Date();
    await link.save();
    res.json({ success: true, message: 'Lien confirmé. Vous êtes maintenant lié.' });
  } catch (error) {
    console.error('Erreur confirmation lien:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/parent-child/link/:linkId
 * Quitter / supprimer le lien (parent ou enfant, chacun est libre à tout moment).
 */
router.delete('/link/:linkId', async (req, res) => {
  try {
    const user = req.user;
    const { linkId } = req.params;
    const link = await ParentChildLink.findByPk(linkId);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Lien non trouvé' });
    }
    const isParent = link.parentNumeroH === user.numeroH;
    const isChild = link.childNumeroH === user.numeroH;
    if (!isParent && !isChild && !isAdmin(user)) {
      return res.status(403).json({ success: false, message: 'Vous ne faites pas partie de ce lien' });
    }
    link.isActive = false;
    await link.save();
    res.json({ success: true, message: 'Lien supprimé. Vous avez quitté cette liaison.' });
  } catch (error) {
    console.error('Erreur suppression lien:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * GET /api/parent-child/pending-sent
 * Demandes envoyées en attente de confirmation par l'enfant (pour le parent).
 */
router.get('/pending-sent', async (req, res) => {
  try {
    const user = req.user;
    const links = await ParentChildLink.getPendingSentByParent(user.numeroH);
    const withChild = await Promise.all(
      links.map(async (link) => {
        const child = await User.findOne({
          where: { numeroH: link.childNumeroH },
          attributes: ['numeroH', 'prenom', 'nomFamille', 'photo', 'genre']
        });
        return { ...link.toJSON(), child };
      })
    );
    res.json({ success: true, invitations: withChild });
  } catch (error) {
    console.error('Erreur demandes envoyées:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * GET /api/parent-child/my-children
 * Liste des enfants liés (pour le parent).
 */
router.get('/my-children', async (req, res) => {
  try {
    const user = req.user;
    const links = isAdmin(user)
      ? await ParentChildLink.findAll({ where: { status: 'active', isActive: true }, order: [['created_at', 'DESC']] })
      : await ParentChildLink.getMyChildren(user.numeroH);

    const childrenWithDetails = await Promise.all(
      links.map(async (link) => {
        const child = await User.findOne({
          where: { numeroH: link.childNumeroH },
          attributes: ['numeroH', 'prenom', 'nomFamille', 'dateNaissance', 'photo', 'genre']
        });
        const activities = await ParentChildActivity.getActivitiesForPair(link.parentNumeroH, link.childNumeroH);
        return {
          ...link.toJSON(),
          child,
          activitiesCount: activities.length
        };
      })
    );

    res.json({
      success: true,
      children: childrenWithDetails,
      ...(isAdmin(user) && { adminView: true })
    });
  } catch (error) {
    console.error('Erreur récupération mes enfants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

/**
 * GET /api/parent-child/my-parents
 * Liste des parents liés (pour l'enfant).
 */
router.get('/my-parents', async (req, res) => {
  try {
    const user = req.user;
    const links = isAdmin(user)
      ? await ParentChildLink.findAll({ where: { status: 'active', isActive: true }, order: [['created_at', 'DESC']] })
      : await ParentChildLink.getMyParents(user.numeroH);

    const parentsWithDetails = await Promise.all(
      links.map(async (link) => {
        const parent = await User.findOne({
          where: { numeroH: link.parentNumeroH },
          attributes: ['numeroH', 'prenom', 'nomFamille', 'photo', 'genre']
        });
        const activities = await ParentChildActivity.getActivitiesForPair(link.parentNumeroH, user.numeroH);
        return {
          ...link.toJSON(),
          parent,
          activitiesCount: activities.length
        };
      })
    );

    res.json({
      success: true,
      parents: parentsWithDetails,
      ...(isAdmin(user) && { adminView: true })
    });
  } catch (error) {
    console.error('Erreur récupération mes parents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

/**
 * GET /api/parent-child/activities
 * Activités pour une paire parent-enfant (query: parentNumeroH, childNumeroH)
 * ou toutes les activités pour l'utilisateur (pas de query = selon son rôle).
 */
router.get('/activities', async (req, res) => {
  try {
    const user = req.user;
    const { parentNumeroH, childNumeroH } = req.query;

    if (parentNumeroH && childNumeroH) {
      const link = await ParentChildLink.findOne({
        where: {
          parentNumeroH,
          childNumeroH,
          status: 'active',
          isActive: true
        }
      });
      if (!link) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à voir ces activités'
        });
      }
      const isParent = user.numeroH === parentNumeroH;
      const isChild = user.numeroH === childNumeroH;
      if (!isParent && !isChild) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
      const activities = await ParentChildActivity.getActivitiesForPair(parentNumeroH, childNumeroH);
      const fromUsers = await User.findAll({
        where: { numeroH: [...new Set(activities.map(a => a.fromNumeroH))] },
        attributes: ['numeroH', 'prenom', 'nomFamille']
      });
      const fromMap = Object.fromEntries(fromUsers.map(u => [u.numeroH, u]));
      const list = activities.map(a => ({
        ...a.toJSON(),
        fromName: fromMap[a.fromNumeroH] ? `${fromMap[a.fromNumeroH].prenom} ${fromMap[a.fromNumeroH].nomFamille}` : a.fromNumeroH
      }));
      return res.json({ success: true, activities: list });
    }

    let activitiesList;
    if (isAdmin(user)) {
      const all = await ParentChildActivity.findAll({
        where: { isActive: true },
        order: [['created_at', 'DESC']],
        limit: 500
      });
      const allIds = [...new Set(all.map(a => a.fromNumeroH))];
      const users = await User.findAll({ where: { numeroH: allIds }, attributes: ['numeroH', 'prenom', 'nomFamille'] });
      const userMap = Object.fromEntries(users.map(u => [u.numeroH, u]));
      activitiesList = all.map(a => ({
        ...a.toJSON(),
        fromName: userMap[a.fromNumeroH] ? `${userMap[a.fromNumeroH].prenom} ${userMap[a.fromNumeroH].nomFamille}` : a.fromNumeroH
      }));
    } else {
      const asParent = await ParentChildActivity.getActivitiesForParent(user.numeroH);
      const asChild = await ParentChildActivity.getActivitiesForChild(user.numeroH);
      const allIds = [...new Set([...asParent.map(a => a.fromNumeroH), ...asParent.map(a => a.toNumeroH), ...asChild.map(a => a.fromNumeroH), ...asChild.map(a => a.toNumeroH)])];
      const users = await User.findAll({
        where: { numeroH: allIds },
        attributes: ['numeroH', 'prenom', 'nomFamille']
      });
      const userMap = Object.fromEntries(users.map(u => [u.numeroH, u]));
      const combine = (list) => list.map(a => ({
        ...a.toJSON(),
        fromName: userMap[a.fromNumeroH] ? `${userMap[a.fromNumeroH].prenom} ${userMap[a.fromNumeroH].nomFamille}` : a.fromNumeroH
      }));
      activitiesList = [...combine(asParent), ...combine(asChild)].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 100);
    }

    res.json({ success: true, activities: activitiesList, ...(isAdmin(user) && { adminView: true }) });
  } catch (error) {
    console.error('Erreur récupération activités:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

/**
 * POST /api/parent-child/activity
 * Ajouter une activité (ce que je fais pour mon parent ou mon enfant).
 */
router.post('/activity', async (req, res) => {
  try {
    const user = req.user;
    const { parentNumeroH, childNumeroH, toNumeroH, type, content, mediaUrl } = req.body;

    if (!parentNumeroH || !childNumeroH || !toNumeroH) {
      return res.status(400).json({
        success: false,
        message: 'parentNumeroH, childNumeroH et toNumeroH sont requis'
      });
    }

    const link = await ParentChildLink.findOne({
      where: {
        parentNumeroH,
        childNumeroH,
        status: 'active',
        isActive: true
      }
    });
    if (!link) {
      return res.status(403).json({
        success: false,
        message: 'Lien parent-enfant non trouvé ou inactif'
      });
    }

    const isParent = user.numeroH === parentNumeroH;
    const isChild = user.numeroH === childNumeroH;
    if (!isParent && !isChild && !isAdmin(user)) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne faites pas partie de cette liaison'
      });
    }

    if (toNumeroH !== parentNumeroH && toNumeroH !== childNumeroH) {
      return res.status(400).json({
        success: false,
        message: 'toNumeroH doit être le parent ou l\'enfant de cette liaison'
      });
    }

    const activity = await ParentChildActivity.create({
      parentNumeroH,
      childNumeroH,
      fromNumeroH: user.numeroH,
      toNumeroH,
      type: type || 'message',
      content: content || null,
      mediaUrl: mediaUrl || null
    });

    res.json({
      success: true,
      message: 'Activité enregistrée',
      activity: {
        ...activity.toJSON(),
        fromName: `${user.prenom} ${user.nomFamille}`
      }
    });
  } catch (error) {
    console.error('Erreur ajout activité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

/**
 * GET /api/parent-child/admin/all-links
 * Admin uniquement : toutes les liaisons parent-enfant (actives + en attente).
 */
router.get('/admin/all-links', async (req, res) => {
  try {
    const user = req.user;
    if (!isAdmin(user)) {
      return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs' });
    }
    const links = await ParentChildLink.findAll({
      where: { isActive: true },
      order: [['created_at', 'DESC']]
    });
    const withUsers = await Promise.all(
      links.map(async (link) => {
        const [parent, child] = await Promise.all([
          User.findOne({ where: { numeroH: link.parentNumeroH }, attributes: ['numeroH', 'prenom', 'nomFamille', 'photo'] }),
          User.findOne({ where: { numeroH: link.childNumeroH }, attributes: ['numeroH', 'prenom', 'nomFamille', 'photo'] })
        ]);
        return {
          ...link.toJSON(),
          parent: parent ? parent.toJSON() : null,
          child: child ? child.toJSON() : null
        };
      })
    );
    res.json({ success: true, links: withUsers });
  } catch (error) {
    console.error('Erreur admin all-links parent-child:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
