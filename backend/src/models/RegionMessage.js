import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class RegionMessage extends Model {
  // Méthodes statiques
  static async getGroupMessages(groupId, limit = 50, offset = 0) {
    return await this.findAll({
      where: { groupId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  }

  static async getUserMessages(numeroH) {
    return await this.findAll({
      where: { numeroH },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
RegionMessage.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'region_groups',
      key: 'id'
    },
    field: 'group_id'
  },
  numeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    field: 'numero_h'
  },
  messageType: {
    type: DataTypes.STRING,
    defaultValue: 'text',
    field: 'message_type'
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'information',
    allowNull: true,
    comment: 'Catégorie du message: information, rencontre, deces, reunion',
    field: 'category'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mediaUrl: {
    type: DataTypes.STRING,
    comment: 'URL du fichier média',
    field: 'media_url'
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_edited'
  },
  editedAt: {
    type: DataTypes.DATE,
    field: 'edited_at'
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_deleted'
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  },
  reactions: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Réactions des utilisateurs {numeroH: reactionType}'
  },
  hashtags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Liste des hashtags extraits du contenu',
    field: 'hashtags'
  },
  sharedFrom: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID du message original si c\'est un repost',
    field: 'shared_from'
  },
  shareCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Nombre de fois que le message a été partagé',
    field: 'share_count'
  }
}, {
  sequelize,
  modelName: 'RegionMessage',
  tableName: 'region_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['group_id']
    },
    {
      fields: ['numero_h']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default RegionMessage;


