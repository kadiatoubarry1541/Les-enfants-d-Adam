import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Note qu'un partenaire donne à l'autre (ex: mari → femme).
 * fromNumeroH = celui qui donne la note, toNumeroH = celui qui la reçoit.
 * En pratique : le mari note sa femme ; la femme ne voit que le tableau.
 */
class PartnerRating extends Model {
  static async getReceivedBy(toNumeroH) {
    return await this.findAll({
      where: { toNumeroH, isActive: true },
      order: [['annee', 'DESC'], ['created_at', 'DESC']]
    });
  }

  static async getForPair(fromNumeroH, toNumeroH) {
    return await this.findAll({
      where: { fromNumeroH, toNumeroH, isActive: true },
      order: [['annee', 'DESC'], ['created_at', 'DESC']]
    });
  }
}

PartnerRating.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fromNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Celui qui donne la note (ex: mari)',
    field: 'from_numero_h'
  },
  toNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Celui qui reçoit la note (ex: femme)',
    field: 'to_numero_h'
  },
  annee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'annee'
  },
  note: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'note'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  sequelize,
  modelName: 'PartnerRating',
  tableName: 'partner_ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['from_numero_h', 'to_numero_h'] },
    { fields: ['to_numero_h'] },
    { fields: ['annee'] }
  ]
});

export default PartnerRating;
