import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../../config/database.js';

class OrganizationGroup extends Model {
  static async getUserGroups(numeroH) {
    return await this.findAll({
      where: {
        members: {
          [Op.contains]: [numeroH]
        }
      },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
OrganizationGroup.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.STRING, // ENUM converti en STRING ('hommes', 'femmes', 'enfants', 'recentes', 'recherches', 'anciens'),
    allowNull: false
  },
  members: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Liste des NumeroH des membres'
  },
  posts: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Publications du Organisation'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH du créateur'
  }
}, {
  sequelize,
  modelName: 'OrganizationGroup',
  tableName: 'organization_groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default OrganizationGroup;