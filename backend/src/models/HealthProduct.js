import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../../config/database.js';

class HealthProduct extends Model {
  // Méthodes statiques
  static async searchProducts(query) {
    return await this.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { category: { [Op.iLike]: `%${query}%` } },
          { brand: { [Op.iLike]: `%${query}%` } }
        ]
      },
      order: [['name', 'ASC']]
    });
  }

  static async getProductsByCategory(category) {
    return await this.findAll({
      where: { category, isActive: true },
      order: [['name', 'ASC']]
    });
  }

  static async getFreeProducts() {
    return await this.findAll({
      where: {
        isFree: true,
        publishedByState: true,
        isActive: true
      },
      order: [['created_at', 'DESC']]
    });
  }

  static async getFreeProductsByCategory(category) {
    return await this.findAll({
      where: {
        isFree: true,
        publishedByState: true,
        isActive: true,
        category
      },
      order: [['created_at', 'DESC']]
    });
  }
}

// Définition du modèle
HealthProduct.init({
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
  category: {
    type: DataTypes.STRING, // ENUM converti en STRING ('médicament', 'équipement', 'supplément', 'produit de soin', 'autre')
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    comment: 'Marque du produit'
  },
  dosage: {
    type: DataTypes.STRING,
    comment: 'Dosage ou spécifications'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Prix du produit'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'GNF'
  },
  availability: {
    type: DataTypes.STRING, // ENUM converti en STRING ('disponible', 'rupture de stock', 'indisponible')
    defaultValue: 'disponible'
  },
  pharmacy: {
    type: DataTypes.STRING,
    comment: 'Pharmacie ou point de vente'
  },
  location: {
    type: DataTypes.STRING,
    comment: 'Localisation du produit'
  },
  contactInfo: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Informations de contact'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPrescriptionRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Prescription médicale requise'
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Produit gratuit distribué par l\'État'
  },
  publishedByState: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Publié par l\'État pour distribution gratuite'
  },
  distributionLocation: {
    type: DataTypes.STRING,
    comment: 'Lieu de distribution du produit gratuit'
  },
  distributionDate: {
    type: DataTypes.DATE,
    comment: 'Date de distribution du produit gratuit'
  },
  quantityAvailable: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Quantité disponible pour distribution gratuite'
  },
  imageUrl: {
    type: DataTypes.STRING,
    comment: 'URL de l\'image du produit'
  },
  sideEffects: {
    type: DataTypes.TEXT,
    comment: 'Effets secondaires'
  },
  contraindications: {
    type: DataTypes.TEXT,
    comment: 'Contre-indications'
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH de l\'administrateur qui a créé le produit'
  }
}, {
  sequelize,
  modelName: 'HealthProduct',
  tableName: 'health_products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['availability']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default HealthProduct;


