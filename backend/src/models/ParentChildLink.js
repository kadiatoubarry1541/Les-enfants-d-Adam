import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Liaison parent-enfant identifiée par un numéro unique défini par le parent,
 * le numéro reçu à la maternité et le NumeroH de l'enfant.
 */
class ParentChildLink extends Model {
  static async getMyChildren(parentNumeroH) {
    return await this.findAll({
      where: { parentNumeroH, status: 'active', isActive: true },
      order: [['created_at', 'DESC']]
    });
  }

  static async getMyParents(childNumeroH) {
    return await this.findAll({
      where: { childNumeroH, status: 'active', isActive: true },
      order: [['created_at', 'DESC']]
    });
  }

  static async getPendingInvitationsForChild(childNumeroH) {
    return await this.findAll({
      where: { childNumeroH, status: 'pending', isActive: true },
      order: [['created_at', 'DESC']]
    });
  }

  static async getPendingSentByParent(parentNumeroH) {
    return await this.findAll({
      where: { parentNumeroH, status: 'pending', isActive: true },
      order: [['created_at', 'DESC']]
    });
  }

  static async findLinkByCodeAndChild(codeLiaison, childNumeroH, numeroMaternite) {
    const where = { codeLiaison, childNumeroH, status: 'pending' };
    if (numeroMaternite) where.numeroMaternite = numeroMaternite;
    return await this.findOne({ where });
  }
}

ParentChildLink.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  parentNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH du parent',
    field: 'parent_numero_h'
  },
  childNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH de l\'enfant',
    field: 'child_numero_h'
  },
  codeLiaison: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Numéro unique défini par le parent (optionnel)',
    field: 'code_liaison'
  },
  numeroMaternite: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Numéro reçu par l\'enfant à la maternité',
    field: 'numero_maternite'
  },
  parentType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'pere',
    comment: 'pere ou mere (optionnel, défaut pere)',
    field: 'parent_type'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    comment: 'pending = en attente de validation par l\'enfant, active = lié',
    field: 'status'
  },
  confirmedAt: {
    type: DataTypes.DATE,
    field: 'confirmed_at'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  sequelize,
  modelName: 'ParentChildLink',
  tableName: 'parent_child_links',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['parent_numero_h'] },
    { fields: ['child_numero_h'] },
    { fields: ['code_liaison', 'child_numero_h'] },
    { unique: true, fields: ['parent_numero_h', 'child_numero_h', 'parent_type'] }
  ]
});

export default ParentChildLink;
