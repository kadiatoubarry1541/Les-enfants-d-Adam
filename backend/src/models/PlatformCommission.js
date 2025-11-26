import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../../config/database.js';

class PlatformCommission extends Model {
  // Méthodes statiques
  static async getTotalCommissions() {
    const result = await this.sequelize.query(
      'SELECT SUM(amount) as total FROM platform_commissions WHERE status = :status',
      {
        replacements: { status: 'collected' },
        type: this.sequelize.QueryTypes.SELECT
      }
    );
    return result[0]?.total || 0;
  }

  static async getCommissionsByPeriod(startDate, endDate) {
    return await this.findAll({
      where: {
        status: 'collected',
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
PlatformCommission.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    comment: 'ID de la commande associée'
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'exchange_products',
      key: 'id'
    },
    comment: 'ID du produit'
  },
  buyerNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    comment: 'NumeroH de l\'acheteur'
  },
  sellerNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    comment: 'NumeroH du vendeur'
  },
  transactionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant total de la transaction'
  },
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 5.00,
    comment: 'Taux de commission (5%)'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant de la commission (5% du total)'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'GNF',
    comment: 'Devise'
  },
  status: {
    type: DataTypes.STRING, // 'pending', 'collected', 'refunded'
    defaultValue: 'collected',
    comment: 'Statut de la commission'
  }
}, {
  sequelize,
  modelName: 'PlatformCommission',
  tableName: 'platform_commissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default PlatformCommission;

