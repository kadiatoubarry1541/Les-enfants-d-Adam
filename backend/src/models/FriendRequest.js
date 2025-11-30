import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class FriendRequest extends Model {
  static async getUserRequests(numeroH) {
    return await this.findAll({
      where: {
        toUser: numeroH,
        status: 'pending'
      },
      order: [['createdAt', 'DESC']]
    });
  }
}

// Définition du modèle
FriendRequest.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fromUser: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH de l\'expéditeur'
  },
  fromUserName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom de l\'expéditeur'
  },
  toUser: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH du destinataire'
  },
  message: {
    type: DataTypes.TEXT,
    comment: 'Message accompagnant la demande'
  },
  status: {
    type: DataTypes.STRING, // ENUM converti en STRING ('pending', 'accepted', 'rejected')
    defaultValue: 'pending'
  }
}, {
  sequelize,
  modelName: 'FriendRequest',
  tableName: 'friend_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['fromUser']
    },
    {
      fields: ['toUser']
    },
    {
      fields: ['status']
    }
  ]
});

export default FriendRequest;










