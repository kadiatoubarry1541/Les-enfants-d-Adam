import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Note qu'un parent donne à son enfant (année + note 1-5).
 * Seul le parent peut ajouter ; l'enfant ne voit que le tableau en lecture.
 */
class ParentChildRating extends Model {
  static async getForChild(childNumeroH) {
    return await this.findAll({
      where: { childNumeroH, isActive: true },
      order: [['annee', 'DESC'], ['created_at', 'DESC']]
    });
  }

  static async getForPair(parentNumeroH, childNumeroH) {
    return await this.findAll({
      where: { parentNumeroH, childNumeroH, isActive: true },
      order: [['annee', 'DESC'], ['created_at', 'DESC']]
    });
  }
}

ParentChildRating.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  parentNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'parent_numero_h'
  },
  childNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'child_numero_h'
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
  modelName: 'ParentChildRating',
  tableName: 'parent_child_ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['parent_numero_h', 'child_numero_h'] },
    { fields: ['child_numero_h'] },
    { fields: ['annee'] }
  ]
});

export default ParentChildRating;
