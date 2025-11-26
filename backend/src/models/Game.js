import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Game extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: DataTypes.ENUM('waiting', 'active', 'paused', 'finished'),
        allowNull: false,
        defaultValue: 'waiting'
      },
      currentPlayerTurn: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'NumeroH du joueur qui doit poser la question actuellement'
      },
      currentCycle: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      depositAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 50000.00,
        comment: 'Total de points initial de 50 000 points'
      },
      juryNumeroH: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'NumeroH du jury humain unique'
      },
      createdBy: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Game',
      tableName: 'games',
      timestamps: true,
      indexes: [
        {
          fields: ['status']
        },
        {
          fields: ['juryNumeroH']
        }
      ]
    });
  }

  static associate(models) {
    this.hasMany(models.GamePlayer, {
      foreignKey: 'gameId',
      as: 'players'
    });
    this.hasMany(models.GameQuestion, {
      foreignKey: 'gameId',
      as: 'questions'
    });
    this.hasOne(models.GameDeposit, {
      foreignKey: 'gameId',
      as: 'deposit'
    });
    this.belongsTo(models.User, {
      foreignKey: 'juryNumeroH',
      targetKey: 'numeroH',
      as: 'jury'
    });
  }
}

export default Game;

