import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../../config.js';

// Alias pour authenticateToken (compatibilité)
export const authenticateToken = async (req, res, next) => {
  return authenticate(req, res, next);
};

// Middleware pour vérifier l'authentification
export const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    
    
    // Si pas de token, vérifier si c'est un admin via un header spécial
    // (pour les cas où le token n'est pas disponible mais l'utilisateur est connecté)
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7).trim() === '') {
      // Vérifier si c'est une requête d'un admin via un header spécial
      const adminHeader = req.headers['x-admin-numero-h'];
      if (adminHeader) {
        // L'admin principal G0C0P0R0E0F0 0 bypass toutes les vérifications
        if (adminHeader === 'G0C0P0R0E0F0 0') {
          const user = await User.findByNumeroH(adminHeader);
          if (user) {
            req.user = user;
            req.userId = user.numeroH;
            req.user.isMasterAdmin = true;
            req.user.bypassRestrictions = true;
            req.user.canViewAll = true;
            req.user.canEditAll = true;
            req.user.canDeleteAll = true;
            next();
            return;
          }
        }
        
        const user = await User.findByNumeroH(adminHeader);
        
        if (user && user.isActive) {
          req.user = user;
          req.userId = user.numeroH;
          if (user.numeroH === 'G1C1P1R1E1F1 1' || user.numeroH === 'G0C0P0R0E0F0 0') {
            req.user.isMasterAdmin = true;
          }
          next();
          return;
        }
      }
      return res.status(401).json({
        success: false,
        message: 'Authentification requise - Token manquant'
      });
    }

    // Extraire le token
    const token = authHeader.substring(7); // Remove 'Bearer '
    
    // Si token vide mais header présent, essayer avec l'admin header
    if (!token || token.trim() === '') {
      const adminHeader = req.headers['x-admin-numero-h'];
      if (adminHeader) {
        const user = await User.findByNumeroH(adminHeader);
        if (user && user.isActive && (
          user.role === 'admin' || 
          user.role === 'super-admin' || 
          user.numeroH === 'G1C1P1R1E1F1 1' ||
          user.numeroH === 'G0C0P0R0E0F0 0'
        )) {
          req.user = user;
          req.userId = user.numeroH;
          if (user.numeroH === 'G1C1P1R1E1F1 1' || user.numeroH === 'G0C0P0R0E0F0 0') {
            req.user.isMasterAdmin = true;
          }
          next();
          return;
        }
      }
      
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou vide'
      });
    }
    
    // Vérifier le token
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findByNumeroH(decoded.numeroH);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      // L'admin principal G0C0P0R0E0F0 0 bypass toutes les vérifications
      if (user.numeroH === 'G0C0P0R0E0F0 0') {
        req.user = user;
        req.userId = user.numeroH;
        req.user.isMasterAdmin = true;
        req.user.bypassRestrictions = true;
        req.user.canViewAll = true;
        req.user.canEditAll = true;
        req.user.canDeleteAll = true;
        next();
        return;
      }
      
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Compte désactivé'
        });
      }
      
      // Ajouter l'utilisateur à la requête
      req.user = user;
      req.userId = user.numeroH;
      
      next();
    } catch (jwtError) {
      // Si le JWT échoue (expiré, invalide, fallback), essayer x-admin-numero-h comme fallback
      const adminHeader = req.headers['x-admin-numero-h'];
      if (adminHeader) {
        try {
          if (adminHeader === 'G0C0P0R0E0F0 0') {
            const user = await User.findByNumeroH(adminHeader);
            if (user) {
              req.user = user;
              req.userId = user.numeroH;
              req.user.isMasterAdmin = true;
              req.user.bypassRestrictions = true;
              req.user.canViewAll = true;
              req.user.canEditAll = true;
              req.user.canDeleteAll = true;
              next();
              return;
            }
          }

          const user = await User.findByNumeroH(adminHeader);
          if (user && user.isActive && (
            user.role === 'admin' ||
            user.role === 'super-admin' ||
            user.numeroH === 'G0C0P0R0E0F0 0'
          )) {
            req.user = user;
            req.userId = user.numeroH;
            if (user.numeroH === 'G0C0P0R0E0F0 0') {
              req.user.isMasterAdmin = true;
            }
            next();
            return;
          }
        } catch (fallbackError) {
          console.error('Erreur fallback x-admin-numero-h:', fallbackError);
        }
      }

      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expiré - veuillez vous reconnecter',
          expired: true
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Token invalide - veuillez vous reconnecter'
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
    // S'assurer que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // L'admin principal G0C0P0R0E0F0 0 bypass toutes les vérifications
    if (req.user.numeroH === 'G0C0P0R0E0F0 0') {
      next();
      return;
    }
    
    // Vérifier le rôle
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

// Middleware pour vérifier que l'utilisateur est super-admin
export const requireSuperAdmin = async (req, res, next) => {
  try {
    // S'assurer que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // Vérifier le rôle
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Privilèges super-administrateur requis'
      });
    }
    
    next();
  } catch (error) {
    console.error('Erreur de vérification super-admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification des privilèges'
    });
  }
};

// Middleware spécial pour l'administrateur principal - Accès complet sans restriction
export const requireMasterAdmin = async (req, res, next) => {
  try {
    // S'assurer que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // Vérifier si c'est le compte administrateur principal
    const masterAdminNumeroH = 'G1C1P1R1E1F1 1';
    const superMasterAdmin = 'G0C0P0R0E0F0 0';
    
    // L'admin principal G0C0P0R0E0F0 0 a accès absolu
    if (req.user.numeroH === superMasterAdmin) {
      req.user.isMasterAdmin = true;
      req.user.canViewAll = true;
      req.user.canEditAll = true;
      req.user.canDeleteAll = true;
      req.user.canManageUsers = true;
      req.user.canManageContent = true;
      req.user.canManageSystem = true;
      req.user.bypassRestrictions = true;
      next();
      return;
    }
    
    if (req.user.numeroH === masterAdminNumeroH) {
      // Accès complet sans restriction
      req.user.isMasterAdmin = true;
      req.user.canViewAll = true;
      req.user.canEditAll = true;
      req.user.canDeleteAll = true;
      req.user.canManageUsers = true;
      req.user.canManageContent = true;
      req.user.canManageSystem = true;
      next();
      return;
    }
    
    // Pour les autres super-admins
    if (req.user.role === 'super-admin') {
      next();
      return;
    }
    
    return res.status(403).json({
      success: false,
      message: 'Accès refusé - Privilèges administrateur principal requis'
    });
  } catch (error) {
    console.error('Erreur de vérification master-admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification des privilèges'
    });
  }
};

// Middleware pour bypasser toutes les restrictions pour l'admin principal
export const bypassAllRestrictions = async (req, res, next) => {
  try {
    if (req.user && req.user.numeroH === 'G0C0P0R0E0F0 0') {
      // L'administrateur principal peut tout faire
      req.user.isMasterAdmin = true;
      req.user.canViewAll = true;
      req.user.canEditAll = true;
      req.user.canDeleteAll = true;
      req.user.canManageUsers = true;
      req.user.canManageContent = true;
      req.user.canManageSystem = true;
      req.user.bypassRestrictions = true;
    }
    next();
  } catch (error) {
    console.error('Erreur bypass restrictions:', error);
    next(); // Continuer même en cas d'erreur
  }
};











