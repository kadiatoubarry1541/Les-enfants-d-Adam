import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Government extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Nom du gouvernement (ex: "Gouvernement de la République de Guinée")'
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Pays du gouvernement'
      },
      region: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Région si applicable (état fédéral, région autonome)'
      },
      presidentNumeroH: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'users',
          key: 'numero_h'
        },
        comment: 'NumeroH du Président'
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date de début du mandat'
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date de fin du mandat (null si en cours)'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Gouvernement actif ou historique'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description du gouvernement'
      },
      createdBy: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'NumeroH de l\'admin qui a créé le gouvernement'
      }
    }, {
      sequelize,
      modelName: 'Government',
      tableName: 'governments',
      timestamps: true,
      indexes: [
        {
          fields: ['presidentNumeroH']
        },
        {
          fields: ['country']
        },
        {
          fields: ['isActive']
        },
        {
          unique: true,
          fields: ['presidentNumeroH', 'isActive'],
          where: {
            isActive: true
          }
        }
      ]
    });
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'presidentNumeroH',
      targetKey: 'numeroH',
      as: 'president'
    });
    this.hasMany(models.GovernmentMember, {
      foreignKey: 'governmentId',
      as: 'members'
    });
  }
}

export default Government;

