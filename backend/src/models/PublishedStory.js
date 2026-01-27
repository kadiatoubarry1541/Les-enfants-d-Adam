import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class PublishedStory extends Model {}

PublishedStory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'numero_h',
    comment: 'NumeroH de l\'auteur de l\'histoire'
  },
  authorName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'author_name',
    comment: 'Nom complet de l\'auteur'
  },
  sectionId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'section_id',
    comment: 'ID de la section (naissance, jeunesse, etc.)'
  },
  sectionTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'section_title',
    comment: 'Titre de la section'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Contenu textuel de l\'histoire'
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Tableau des URLs des photos'
  },
  videos: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Tableau des URLs des vidéos'
  },
  generation: {
    type: DataTypes.STRING,
    comment: 'Génération de l\'auteur'
  },
  region: {
    type: DataTypes.STRING,
    comment: 'Région de l\'auteur'
  },
  country: {
    type: DataTypes.STRING,
    comment: 'Pays de l\'auteur'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_published',
    comment: 'Statut de publication'
  },
  publishedAt: {
    type: DataTypes.DATE,
    field: 'published_at',
    defaultValue: DataTypes.NOW,
    comment: 'Date de publication'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Nombre de vues'
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Nombre de likes'
  }
}, {
  sequelize,
  modelName: 'PublishedStory',
  tableName: 'published_stories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['numeroH']
    },
    {
      fields: ['sectionId']
    },
    {
      fields: ['isPublished']
    },
    {
      fields: ['generation']
    },
    {
      fields: ['publishedAt']
    }
  ]
});

export default PublishedStory;
