import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class Order extends Model {
  // Méthodes statiques
  static async getUserOrders(numeroH) {
    return await this.findAll({
      where: { buyerNumeroH: numeroH },
      order: [['created_at', 'DESC']]
    });
  }

  static async getSellerOrders(numeroH) {
    return await this.findAll({
      where: { sellerNumeroH: numeroH },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
Order.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'exchange_products',
      key: 'id'
    },
    comment: 'ID du produit acheté'
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
  productPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Prix du produit au moment de l\'achat'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Quantité achetée'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant total (prix × quantité)'
  },
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 5.00,
    comment: 'Taux de commission en pourcentage (5%)'
  },
  commissionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant de la commission (5% du total)'
  },
  sellerAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant reçu par le vendeur (total - commission)'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'GNF',
    comment: 'Devise de la transaction'
  },
  status: {
    type: DataTypes.STRING, // 'pending', 'completed', 'cancelled', 'refunded'
    defaultValue: 'pending',
    comment: 'Statut de la commande'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    comment: 'Méthode de paiement (mobile_money, bank_transfer, etc.)'
  },
  paymentReference: {
    type: DataTypes.STRING,
    comment: 'Référence du paiement'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date de complétion de la commande'
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['buyerNumeroH']
    },
    {
      fields: ['sellerNumeroH']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['status']
    }
  ]
});

export default Order;

