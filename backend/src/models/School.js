import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * École partenaire : inscription pour plus de visibilité.
 * Liée au NumeroH du créateur (contact principal).
 */
class School extends Model {
  static async getVisibleSchools() {
    return await this.findAll({
      where: { isActive: true },
      order: [['created_at', 'DESC']]
    });
  }
}

School.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom de l\'établissement'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Adresse'
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Téléphone ou email de contact'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Présentation courte'
  },
  createdByNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH du compte qui a enregistré l\'école',
    field: 'created_by_numero_h'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Visible après validation admin',
    field: 'is_active'
  }
}, {
  sequelize,
  modelName: 'School',
  tableName: 'schools',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['created_by_numero_h'] },
    { fields: ['is_active'] }
  ]
});

export default School;
