import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class FamilyTreeConfirmation extends Model {
  // Méthodes statiques
  static async getPendingConfirmations(numeroH) {
    return await this.findAll({
      where: {
        parentNumeroH: numeroH,
        status: 'pending'
      },
      order: [['created_at', 'DESC']]
    });
  }

  static async getChildConfirmations(childNumeroH) {
    return await this.findAll({
      where: {
        childNumeroH,
        status: 'pending'
      }
    });
  }

  static async confirmAccess(childNumeroH, parentNumeroH) {
    const confirmation = await this.findOne({
      where: {
        childNumeroH,
        parentNumeroH,
        status: 'pending'
      }
    });

    if (confirmation) {
      confirmation.status = 'confirmed';
      confirmation.confirmedAt = new Date();
      await confirmation.save();
      return confirmation;
    }

    return null;
  }
}

// Définition du modèle
FamilyTreeConfirmation.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  childNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH de l\'enfant qui demande l\'accès'
  },
  parentNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH du parent qui doit confirmer'
  },
  parentType: {
    type: DataTypes.STRING, // 'pere' ou 'mere'
    allowNull: false
  },
  status: {
    type: DataTypes.STRING, // 'pending', 'confirmed', 'rejected'
    defaultValue: 'pending'
  },
  confirmedAt: {
    type: DataTypes.DATE,
    comment: 'Date de confirmation'
  },
  rejectedAt: {
    type: DataTypes.DATE,
    comment: 'Date de rejet'
  },
  notes: {
    type: DataTypes.TEXT,
    comment: 'Notes sur la confirmation'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'FamilyTreeConfirmation',
  tableName: 'family_tree_confirmations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['childNumeroH']
    },
    {
      fields: ['parentNumeroH']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['childNumeroH', 'parentNumeroH', 'parentType']
    }
  ]
});

export default FamilyTreeConfirmation;

