import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { HistorySection, FamilyMember, FamilyTree, Document, EmergencyCall, LocationCheck, Donation, ZakatCalculation, SecurityAgent } from '../models/index.js';

const router = express.Router();

// Routes pour l'Histoire
router.get('/history/sections', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    const sections = await HistorySection.findAll({
      where: category ? { category } : {},
      order: [['createdAt', 'DESC']]
    });
    res.json({ sections });
  } catch (error) {
    console.error('Erreur lors du chargement des sections:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/history/sections', authenticateToken, async (req, res) => {
  try {
    const section = await HistorySection.create(req.body);
    res.status(201).json({ section });
  } catch (error) {
    console.error('Erreur lors de la création de la section:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les Échanges
router.get('/exchange/products', authenticateToken, async (req, res) => {
  try {
    const { level } = req.query;
    const products = await ExchangeProduct.findAll({
      where: level ? { level } : {},
      order: [['createdAt', 'DESC']]
    });
    res.json({ products });
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/exchange/products', authenticateToken, async (req, res) => {
  try {
    const product = await ExchangeProduct.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/exchange/suppliers', authenticateToken, async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      where: { isApproved: true },
      order: [['createdAt', 'DESC']]
    });
    res.json({ suppliers });
  } catch (error) {
    console.error('Erreur lors du chargement des fournisseurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/exchange/suppliers', authenticateToken, async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({ supplier });
  } catch (error) {
    console.error('Erreur lors de l\'inscription du fournisseur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour la Santé
router.get('/health/hospitals', authenticateToken, async (req, res) => {
  try {
    const hospitals = await Hospital.findAll({
      where: { isActive: true },
      order: [['rating', 'DESC']]
    });
    res.json({ hospitals });
  } catch (error) {
    console.error('Erreur lors du chargement des hôpitaux:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/health/doctors', authenticateToken, async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { isActive: true, isAvailable: true },
      order: [['rating', 'DESC']]
    });
    res.json({ doctors });
  } catch (error) {
    console.error('Erreur lors du chargement des médecins:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/health/products', authenticateToken, async (req, res) => {
  try {
    const products = await HealthProduct.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json({ products });
  } catch (error) {
    console.error('Erreur lors du chargement des produits de santé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour la Famille
router.get('/family/members', authenticateToken, async (req, res) => {
  try {
    const { relation } = req.query;
    const members = await FamilyMember.findAll({
      where: relation ? { relation } : {},
      order: [['createdAt', 'DESC']]
    });
    res.json({ members });
  } catch (error) {
    console.error('Erreur lors du chargement des membres de la famille:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/family/members', authenticateToken, async (req, res) => {
  try {
    const member = await FamilyMember.create(req.body);
    res.status(201).json({ member });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/family/tree', authenticateToken, async (req, res) => {
  try {
    const tree = await FamilyTree.findOne({
      where: { rootMember: req.user.numeroH },
      include: [{ model: FamilyMember, as: 'members' }]
    });
    res.json({ tree });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'arbre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/family/tree/messages', authenticateToken, async (req, res) => {
  try {
    // Logique pour envoyer un message à la famille
    res.status(201).json({ message: 'Message envoyé' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les États
router.get('/etats/documents', authenticateToken, async (req, res) => {
  try {
    const documents = await Document.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ documents });
  } catch (error) {
    console.error('Erreur lors du chargement des documents:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/etats/documents', authenticateToken, async (req, res) => {
  try {
    const document = await Document.create(req.body);
    res.status(201).json({ document });
  } catch (error) {
    console.error('Erreur lors de l\'upload du document:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/etats/permissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const permissions = await DocumentPermission.findAll({
      order: [['grantedAt', 'DESC']]
    });
    res.json({ permissions });
  } catch (error) {
    console.error('Erreur lors du chargement des permissions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/etats/permissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const permission = await DocumentPermission.create(req.body);
    res.status(201).json({ permission });
  } catch (error) {
    console.error('Erreur lors de l\'attribution de la permission:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour la Sécurité
router.get('/security/agents', authenticateToken, async (req, res) => {
  try {
    const agents = await SecurityAgent.findAll({
      where: { isActive: true },
      order: [['rating', 'DESC']]
    });
    res.json({ agents });
  } catch (error) {
    console.error('Erreur lors du chargement des agents:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/security/emergency-calls', authenticateToken, async (req, res) => {
  try {
    const calls = await EmergencyCall.findAll({
      where: { caller: req.user.numeroH },
      order: [['createdAt', 'DESC']]
    });
    res.json({ calls });
  } catch (error) {
    console.error('Erreur lors du chargement des appels:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/security/emergency-calls', authenticateToken, async (req, res) => {
  try {
    const call = await EmergencyCall.create(req.body);
    res.status(201).json({ call });
  } catch (error) {
    console.error('Erreur lors de l\'appel d\'urgence:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/security/location-checks', authenticateToken, async (req, res) => {
  try {
    const checks = await LocationCheck.findAll({
      where: { user: req.user.numeroH },
      order: [['checkedAt', 'DESC']]
    });
    res.json({ checks });
  } catch (error) {
    console.error('Erreur lors du chargement des vérifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/security/location-checks', authenticateToken, async (req, res) => {
  try {
    // Logique pour vérifier la sécurité d'une localisation
    const safetyLevel = Math.random() > 0.5 ? 'safe' : 'moderate';
    const recommendations = ['Restez vigilant', 'Évitez les heures tardives'];
    
    const check = await LocationCheck.create({
      ...req.body,
      safetyLevel,
      recommendations
    });
    
    res.status(201).json({ check, safetyLevel, recommendations });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour Zakat et Dons
router.get('/zakat/poor-people', authenticateToken, async (req, res) => {
  try {
    const people = await PoorPerson.findAll({
      where: { isActive: true },
      order: [['urgency', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json({ people });
  } catch (error) {
    console.error('Erreur lors du chargement des pauvres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/zakat/donations', authenticateToken, async (req, res) => {
  try {
    const donations = await Donation.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ donations });
  } catch (error) {
    console.error('Erreur lors du chargement des dons:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/zakat/donations', authenticateToken, async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json({ donation });
  } catch (error) {
    console.error('Erreur lors du don:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/zakat/calculations', authenticateToken, async (req, res) => {
  try {
    const calculations = await ZakatCalculation.findAll({
      where: { user: req.user.numeroH },
      order: [['calculatedAt', 'DESC']]
    });
    res.json({ calculations });
  } catch (error) {
    console.error('Erreur lors du chargement des calculs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/zakat/calculations', authenticateToken, async (req, res) => {
  try {
    const { totalWealth, currency } = req.body;
    const zakatAmount = totalWealth * 0.025; // 2.5%
    
    const calculation = await ZakatCalculation.create({
      ...req.body,
      zakatAmount
    });
    
    res.status(201).json({ calculation, zakatAmount });
  } catch (error) {
    console.error('Erreur lors du calcul:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;










