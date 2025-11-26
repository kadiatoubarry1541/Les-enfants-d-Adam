import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class RegionMessagePermission extends Model {
  static async checkPermission(groupId, numeroH) {
    const permission = await this.findOne({
      where: { groupId, numeroH }
    });
    return permission && permission.canSend;
  }

  static async grantPermission(groupId, numeroH, grantedBy) {
    const [permission, created] = await this.findOrCreate({
      where: { groupId, numeroH },
      defaults: {
        canSend: true,
        grantedBy
      }
    });
    
    if (!created) {
      await permission.update({ canSend: true, grantedBy });
    }
    
    return permission;
  }

  static async revokePermission(groupId, numeroH) {
    const permission = await this.findOne({
      where: { groupId, numeroH }
    });
    
    if (permission) {
      await permission.update({ canSend: false });
    }
    
    return permission;
  }

  static async getGroupPermissions(groupId) {
    return await this.findAll({
      where: { groupId, canSend: true }
    });
  }
}

RegionMessagePermission.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'region_groups',
      key: 'id'
    },
    field: 'group_id'
  },
  numeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    field: 'numero_h'
  },
  canSend: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'can_send'
  },
  grantedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'users',
      key: 'numero_h'
    },
    field: 'granted_by'
  }
}, {
  sequelize,
  modelName: 'RegionMessagePermission',
  tableName: 'region_message_permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['group_id', 'numero_h'],
      unique: true
    }
  ]
});

export default RegionMessagePermission;

