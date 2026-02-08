import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Activité partagée entre les deux partenaires (ce que l'un fait pour l'autre).
 * Visible des deux côtés : Mon Homme et Ma Femme.
 */
class CoupleActivity extends Model {
  static async getActivitiesForCouple(numeroH1, numeroH2) {
    return await this.findAll({
      where: {
        [Op.or]: [
          { numeroH1, numeroH2 },
          { numeroH1: numeroH2, numeroH2: numeroH1 }
        ],
        isActive: true
      },
      order: [['created_at', 'DESC']],
      limit: 100
    });
  }
}

CoupleActivity.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  numeroH1: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'numero_h1'
  },
  numeroH2: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'numero_h2'
  },
  fromNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Qui a fait l\'action',
    field: 'from_numero_h'
  },
  toNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Pour qui',
    field: 'to_numero_h'
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'message',
    field: 'type'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'content'
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'media_url'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  sequelize,
  modelName: 'CoupleActivity',
  tableName: 'couple_activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['numero_h1', 'numero_h2'] },
    { fields: ['from_numero_h'] },
    { fields: ['created_at'] }
  ]
});

export default CoupleActivity;
