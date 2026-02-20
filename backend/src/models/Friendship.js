import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class Friendship extends Model {
  // Méthodes statiques
  static async getUserFriends(numeroH) {
    return await this.findAll({
      where: { 
        [Op.or]: [
          { requesterNumeroH: numeroH },
          { receiverNumeroH: numeroH }
        ],
        status: 'accepted'
      },
      order: [['created_at', 'DESC']]
    });
  }

  static async getPendingRequests(numeroH) {
    return await this.findAll({
      where: { 
        receiverNumeroH: numeroH,
        status: 'pending'
      },
      order: [['created_at', 'DESC']]
    });
  }

  static async getSentRequests(numeroH) {
    return await this.findAll({
      where: { 
        requesterNumeroH: numeroH,
        status: 'pending'
      },
      order: [['created_at', 'DESC']]
    });
  }

  static async checkFriendship(numeroH1, numeroH2) {
    return await this.findOne({
      where: {
        [Op.or]: [
          { requesterNumeroH: numeroH1, receiverNumeroH: numeroH2 },
          { requesterNumeroH: numeroH2, receiverNumeroH: numeroH1 }
        ]
      }
    });
  }
}

// Définition du modèle
Friendship.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  requesterNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    }
  },
  receiverNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    }
  },
  status: {
    type: DataTypes.STRING, // ENUM converti en STRING ('pending', 'accepted', 'rejected', 'blocked'),
    defaultValue: 'pending'
  },
  message: {
    type: DataTypes.TEXT,
    comment: 'Message d\'invitation'
  },
  acceptedAt: {
    type: DataTypes.DATE
  },
  rejectedAt: {
    type: DataTypes.DATE
  },
  blockedAt: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT,
    comment: 'Notes personnelles sur l\'amitié'
  }
}, {
  sequelize,
  modelName: 'Friendship',
  tableName: 'friendships',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['requesterNumeroH', 'receiverNumeroH']
    },
    {
      fields: ['status']
    },
    {
      fields: ['requesterNumeroH']
    },
    {
      fields: ['receiverNumeroH']
    }
  ]
});

export default Friendship;


