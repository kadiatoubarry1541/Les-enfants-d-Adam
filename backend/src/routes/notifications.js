import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET /api/notifications - Mes notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.getForUser(req.userId);
    const unreadCount = await Notification.getUnreadCount(req.userId);
    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/notifications/unread-count - Nombre de non-lues
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.userId);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/notifications/mark-read/:id - Marquer comme lue
router.post('/mark-read/:id', authenticate, async (req, res) => {
  try {
    const notif = await Notification.findByPk(req.params.id);
    if (!notif || notif.recipientNumeroH !== req.userId) {
      return res.status(404).json({ success: false, message: 'Notification non trouvée' });
    }
    await notif.update({ isRead: true, readAt: new Date() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/notifications/mark-all-read - Tout marquer comme lu
router.post('/mark-all-read', authenticate, async (req, res) => {
  try {
    await Notification.markAllRead(req.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
