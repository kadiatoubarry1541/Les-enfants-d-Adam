import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Activité partagée entre parent et enfant (ce que l'un fait pour l'autre).
 * Visible des deux côtés : Mes Enfants (parent) et Mes Parents (enfant).
 */
class ParentChildActivity extends Model {
  static async getActivitiesForPair(parentNumeroH, childNumeroH) {
    return await this.findAll({
      where: {
        parentNumeroH,
        childNumeroH,
        isActive: true
      },
      order: [['created_at', 'DESC']],
      limit: 100
    });
  }

  static async getActivitiesForParent(parentNumeroH) {
    return await this.findAll({
      where: { parentNumeroH, isActive: true },
      order: [['created_at', 'DESC']],
      limit: 200
    });
  }

  static async getActivitiesForChild(childNumeroH) {
    return await this.findAll({
      where: { childNumeroH, isActive: true },
      order: [['created_at', 'DESC']],
      limit: 200
    });
  }
}

ParentChildActivity.init({
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
  fromNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Qui a fait l\'action (parent ou enfant)',
    field: 'from_numero_h'
  },
  toNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Pour qui (parent ou enfant)',
    field: 'to_numero_h'
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'message',
    comment: 'message, souvenir, note, cadeau, visite, etc.',
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
  modelName: 'ParentChildActivity',
  tableName: 'parent_child_activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['parent_numero_h', 'child_numero_h'] },
    { fields: ['from_numero_h'] },
    { fields: ['created_at'] }
  ]
});

export default ParentChildActivity;
