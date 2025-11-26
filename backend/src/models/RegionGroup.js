import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../../config/database.js';

class RegionGroup extends Model {
  static async getUserRegionGroups(numeroH) {
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
RegionGroup.init({
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
  region: {
    type: DataTypes.STRING // ENUM converti en STRING ('Basse-Guinée', 'Fouta-Djallon', 'Haute-Guinée', 'Guinée forestière', 'Guinée'),
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
  modelName: 'RegionGroup',
  tableName: 'region_groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['region']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default RegionGroup;