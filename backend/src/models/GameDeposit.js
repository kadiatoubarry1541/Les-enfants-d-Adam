import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class GameDeposit extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'games',
          key: 'id'
        }
      },
      initialAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 50000.00,
        comment: 'Total de points initial (toujours 50 000 points)'
      },
      currentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 50000.00,
        comment: 'Total de points actuel (initial - points gagnés + pénalités reçues)'
      },
      totalGainsPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total des points gagnés par les joueurs'
      },
      totalPenaltiesReceived: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total des points de pénalité reçus des joueurs'
      },
      lastRechargeBy: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'NumeroH de la personne qui a rechargé les points'
      },
      lastRechargeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date de la dernière recharge de points'
      },
      lastRechargeAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Nombre de points de la dernière recharge'
      }
    }, {
      sequelize,
      modelName: 'GameDeposit',
      tableName: 'game_deposits',
      timestamps: true,
      indexes: [
        {
          fields: ['gameId']
        }
      ]
    });
  }

  static associate(models) {
    this.belongsTo(models.Game, {
      foreignKey: 'gameId',
      as: 'game'
    });
    this.belongsTo(models.User, {
      foreignKey: 'lastRechargeBy',
      targetKey: 'numeroH',
      as: 'recharger'
    });
  }
}

export default GameDeposit;

