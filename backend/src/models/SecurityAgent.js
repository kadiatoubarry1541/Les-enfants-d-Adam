import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../../config/database.js';

class SecurityAgent extends Model {
  // Méthodes statiques
  static async getAgentsByRegion(region) {
    return await this.findAll({
      where: { region, isActive: true },
      order: [['name', 'ASC']]
    });
  }

  static async searchAgents(query) {
    return await this.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { agency: { [Op.iLike]: `%${query}%` } },
          { region: { [Op.iLike]: `%${query}%` } },
          { city: { [Op.iLike]: `%${query}%` } }
        ]
      },
      order: [['name', 'ASC']]
    });
  }

  static async getNearbyAgents(latitude, longitude, radius = 10) {
    // Cette méthode nécessiterait une extension PostGIS pour les calculs de distance
    // Pour l'instant, on retourne tous les agents actifs
    return await this.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
  }
}

// Définition du modèle
SecurityAgent.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  agency: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Agence de sécurité'
  },
  badgeNumber: {
    type: DataTypes.STRING,
    unique: true,
    comment: 'Numéro de badge'
  },
  region: {
    type: DataTypes.STRING // ENUM converti en STRING ('Basse-Guinée', 'Fouta-Djallon', 'Haute-Guinée', 'Guinée forestière'),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emergencyPhone: {
    type: DataTypes.STRING,
    comment: 'Numéro d\'urgence'
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  specialties: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Spécialités de sécurité'
  },
  experience: {
    type: DataTypes.INTEGER,
    comment: 'Années d\'expérience'
  },
  coordinates: {
    type: DataTypes.JSON,
    comment: 'Coordonnées GPS {lat, lng}'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    comment: 'Note moyenne (0-5)'
  },
  reviews: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Avis des clients'
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Tarif horaire'
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH de l\'administrateur qui a créé l\'agent'
  }
}, {
  sequelize,
  modelName: 'SecurityAgent',
  tableName: 'security_agents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['region']
    },
    {
      fields: ['city']
    },
    {
      fields: ['isActive', 'isAvailable']
    },
    {
      fields: ['badgeNumber']
    }
  ]
});

export default SecurityAgent;


