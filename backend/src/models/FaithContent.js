import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class FaithContent extends Model {
  static async getContentByReligion(religion) {
    return await this.findAll({
      where: {
        religion,
        isActive: true
      },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
FaithContent.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.STRING, // ENUM converti en STRING ('video', 'audio', 'text')
    allowNull: false
  },
  content: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Contenu du média (URLs, texte, etc.)'
  },
  religion: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Religion associée'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Catégorie du contenu'
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
  modelName: 'FaithContent',
  tableName: 'faith_content',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['religion']
    },
    {
      fields: ['category']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default FaithContent;