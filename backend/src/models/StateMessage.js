import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../config/database.js';

class StateMessage extends Model {
  // Méthodes statiques
  static async getConversation(documentId, userId) {
    return await this.findAll({
      where: {
        documentId: documentId || null,
        [Op.or]: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
      order: [['created_at', 'ASC']]
    });
  }

  static async getUserMessages(userId) {
    return await this.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
      order: [['created_at', 'DESC']]
    });
  }

  static async getUnreadCount(userId) {
    return await this.count({
      where: {
        recipientId: userId,
        isRead: false
      }
    });
  }

  static async markAsRead(messageId, userId) {
    const message = await this.findByPk(messageId);
    if (message && message.recipientId === userId) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }
    return message;
  }

  static async markConversationAsRead(documentId, userId) {
    await this.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          documentId: documentId || null,
          recipientId: userId,
          isRead: false
        }
      }
    );
  }
}

// Définition du modèle
StateMessage.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'documents',
      key: 'id'
    },
    comment: 'ID du document associé (null pour messages généraux)'
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    comment: 'NumeroH de l\'expéditeur'
  },
  senderName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom complet de l\'expéditeur'
  },
  recipientId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    comment: 'NumeroH du destinataire'
  },
  recipientName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom complet du destinataire'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Sujet du message (optionnel)'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Contenu du message'
  },
  messageType: {
    type: DataTypes.STRING, // 'general', 'document_request', 'document_response', 'clarification', 'notification'
    defaultValue: 'general',
    comment: 'Type de message'
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Liste des pièces jointes (URLs)'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Message lu ou non'
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date de lecture du message'
  },
  isImportant: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Message important'
  },
  priority: {
    type: DataTypes.STRING, // 'low', 'normal', 'high', 'urgent'
    defaultValue: 'normal',
    comment: 'Priorité du message'
  }
}, {
  sequelize,
  modelName: 'StateMessage',
  tableName: 'state_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['documentId']
    },
    {
      fields: ['senderId']
    },
    {
      fields: ['recipientId']
    },
    {
      fields: ['isRead']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['documentId', 'senderId', 'recipientId']
    }
  ]
});

export default StateMessage;

