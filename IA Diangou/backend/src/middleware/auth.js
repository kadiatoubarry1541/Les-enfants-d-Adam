import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config.js';

// Middleware pour vérifier l'authentification
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise - Token manquant'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await User.findByNumeroH(decoded.numeroH);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé ou compte désactivé'
        });
      }
      
      req.user = user;
      req.userId = user.numeroH;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification'
    });
  }
};

// Middleware pour vérifier que l'utilisateur est admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Privilèges administrateur requis'
      });
    }
    
    next();
  } catch (error) {
    console.error('Erreur de vérification admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification des privilèges'
    });
  }
};

