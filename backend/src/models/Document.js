import { DataTypes, Model } from 'sequelize';
import { Op } from 'sequelize';
import { sequelize } from '../../config/database.js';

class Document extends Model {
  // Méthodes statiques
  static async getUserDocuments(numeroH) {
    return await this.findAll({
      where: { uploadedBy: numeroH },
      order: [['created_at', 'DESC']]
    });
  }

  static async getDocumentsForUser(numeroH) {
    return await this.findAll({
      where: {
        [Op.or]: [
          { uploadedBy: numeroH },
          { recipient: numeroH },
          { isPublic: true }
        ]
      },
      order: [['created_at', 'DESC']]
    });
  }

  static async getPendingDocuments() {
    return await this.findAll({
      where: { status: 'pending' },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
Document.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING // ENUM converti en STRING ('birth_certificate', 'marriage_certificate', 'death_certificate', 'identity_card', 'passport', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    comment: 'Description du document'
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'URL du fichier PDF uploadé'
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom du fichier original'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    comment: 'Taille du fichier en octets'
  },
  uploadedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    comment: 'NumeroH de l\'utilisateur qui a uploadé le document'
  },
  recipient: {
    type: DataTypes.STRING,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    comment: 'NumeroH du destinataire (si applicable)'
  },
  status: {
    type: DataTypes.STRING, // ENUM converti en STRING ('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Document accessible à tous si true'
  },
  category: {
    type: DataTypes.STRING, // ENUM converti en STRING ('civil', 'administrative', 'legal', 'other'),
    defaultValue: 'other'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Tags pour la recherche'
  },
  // Nouveaux champs pour le workflow État-Citoyen
  sentByState: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Document envoyé par un agent de l\'État'
  },
  stateAgentNumeroH: {
    type: DataTypes.STRING,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    comment: 'NumeroH de l\'agent de l\'État qui a envoyé le document'
  },
  userValidationStatus: {
    type: DataTypes.STRING, // 'pending', 'confirmed', 'error_reported', 'corrected'
    defaultValue: 'pending',
    comment: 'Statut de validation par l\'utilisateur'
  },
  errorReport: {
    type: DataTypes.TEXT,
    comment: 'Erreurs signalées par l\'utilisateur'
  },
  errorReportedAt: {
    type: DataTypes.DATE,
    comment: 'Date de signalement d\'erreur'
  },
  correctionNotes: {
    type: DataTypes.TEXT,
    comment: 'Notes de correction par l\'agent'
  },
  correctedAt: {
    type: DataTypes.DATE,
    comment: 'Date de correction'
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Version du document (incrémenté à chaque modification)'
  },
  previousVersionId: {
    type: DataTypes.UUID,
    references: {
      model: 'documents',
      key: 'id'
    },
    comment: 'ID de la version précédente'
  }
}, {
  sequelize,
  modelName: 'Document',
  tableName: 'documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['uploadedBy']
    },
    {
      fields: ['recipient']
    },
    {
      fields: ['status']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    }
  ]
});

export default Document;

