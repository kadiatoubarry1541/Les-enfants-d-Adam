import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class FamilyProblemMedia extends Model {}

FamilyProblemMedia.init({
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
  numeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'numero_h'
  },
  authorName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'author_name',
    defaultValue: 'Membre'
  },
  mediaType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'media_type',
    defaultValue: 'video'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mediaUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'media_url'
  }
}, {
  sequelize,
  modelName: 'FamilyProblemMedia',
  tableName: 'family_problem_media',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['family_name'] },
    { fields: ['numero_h'] },
    { fields: ['created_at'] }
  ]
});

export default FamilyProblemMedia;

