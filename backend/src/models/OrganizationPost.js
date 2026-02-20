import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class OrganizationPost extends Model {
  // Méthodes statiques
  static async getGroupPosts(groupId, limit = 50, offset = 0) {
    return await this.findAll({
      where: { groupId, isActive: true },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }

  static async getUserPosts(numeroH) {
    return await this.findAll({
      where: { numeroH, isActive: true },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
OrganizationPost.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'organization_groups',
      key: 'id'
    }
  },
  numeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    }
  },
  postType: {
    type: DataTypes.STRING, // ENUM converti en STRING ('text', 'image', 'video', 'audio', 'mixed'),
    defaultValue: 'text'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mediaUrls: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'URLs des fichiers média'
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  editedAt: {
    type: DataTypes.DATE
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deletedAt: {
    type: DataTypes.DATE
  },
  likes: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Liste des NumeroH qui ont aimé'
  },
  comments: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Commentaires sur le post'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'OrganizationPost',
  tableName: 'organization_posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['groupId']
    },
    {
      fields: ['numeroH']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default OrganizationPost;


