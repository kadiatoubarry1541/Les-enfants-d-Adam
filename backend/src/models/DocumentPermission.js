import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class DocumentPermission extends Model {
  // Méthodes statiques
  static async getUserPermissions(numeroH) {
    return await this.findAll({
      where: { numeroH },
      order: [['created_at', 'DESC']]
    });
  }

  static async getDocumentPermissions(documentType) {
    return await this.findAll({
      where: { documentType, isActive: true },
      order: [['created_at', 'DESC']]
    });
  }

  static async checkPermission(numeroH, documentType) {
    const permission = await this.findOne({
      where: { numeroH, documentType, isActive: true }
    });
    return permission !== null;
  }
}

// Définition du modèle
DocumentPermission.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  numeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'numero_h',
    references: {
      model: 'users',
      key: 'numero_h'
    }
  },
  documentType: {
    type: DataTypes.STRING, // ENUM converti en STRING ('extrait_naissance', 'acte_mariage', 'certificat_deces', 'document_familial', 'autre'),
    allowNull: true, // null = tous les types de documents
    comment: 'Type de document spécifique (null = tous les types)',
    field: 'document_type'
  },
  permissionType: {
    type: DataTypes.STRING, // ENUM converti en STRING ('send', 'receive', 'modify', 'all'),
    defaultValue: 'all',
    comment: 'Type de permission: send (envoyer), receive (recevoir), modify (modifier), all (tout)',
    field: 'permission_type'
  },
  role: {
    type: DataTypes.STRING, // 'state_agent', 'admin', 'supervisor'
    defaultValue: 'state_agent',
    comment: 'Rôle de l\'agent de l\'État',
    field: 'role'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  grantedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH de l\'administrateur qui a accordé la permission',
    field: 'granted_by'
  },
  grantedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'granted_at'
  },
  expiresAt: {
    type: DataTypes.DATE,
    comment: 'Date d\'expiration de la permission',
    field: 'expires_at'
  },
  notes: {
    type: DataTypes.TEXT,
    comment: 'Notes sur la permission',
    field: 'notes'
  }
}, {
  sequelize,
  modelName: 'DocumentPermission',
  tableName: 'document_permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['numero_h']
    },
    {
      fields: ['document_type']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default DocumentPermission;


