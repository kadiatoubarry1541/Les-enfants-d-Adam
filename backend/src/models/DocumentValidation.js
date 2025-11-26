import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class DocumentValidation extends Model {
  // Méthodes statiques
  static async getDocumentValidations(documentId) {
    return await this.findAll({
      where: { documentId },
      order: [['created_at', 'DESC']]
    });
  }

  static async getLatestValidation(documentId) {
    return await this.findOne({
      where: { documentId },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
DocumentValidation.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'documents',
      key: 'id'
    },
    comment: 'ID du document validé'
  },
  action: {
    type: DataTypes.STRING, // 'confirmed', 'error_reported', 'corrected', 'resubmitted'
    allowNull: false,
    comment: 'Action effectuée'
  },
  performedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    comment: 'NumeroH de la personne qui a effectué l\'action'
  },
  notes: {
    type: DataTypes.TEXT,
    comment: 'Notes ou commentaires sur l\'action'
  },
  errorDetails: {
    type: DataTypes.JSON,
    comment: 'Détails des erreurs signalées (si applicable)'
  }
}, {
  sequelize,
  modelName: 'DocumentValidation',
  tableName: 'document_validations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['documentId']
    },
    {
      fields: ['performedBy']
    },
    {
      fields: ['action']
    }
  ]
});

export default DocumentValidation;

