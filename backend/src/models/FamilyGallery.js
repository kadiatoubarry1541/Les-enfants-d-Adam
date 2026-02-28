import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class FamilyGallery extends Model {}

FamilyGallery.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  familyName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'family_name'
  },
  uploaderNumeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'uploader_numero_h'
  },
  uploaderName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Membre',
    field: 'uploader_name'
  },
  album: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(512),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20),
    defaultValue: 'image'
  }
}, {
  sequelize,
  modelName: 'FamilyGallery',
  tableName: 'family_gallery',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['family_name'] },
    { fields: ['uploader_numero_h'] },
    { fields: ['album'] }
  ]
});

export default FamilyGallery;
