import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class GameTransaction extends Model {
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
        references: {
          model: 'games',
          key: 'id'
        }
      },
      playerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'game_players',
          key: 'id'
        },
        comment: 'Null pour les transactions de dépôt'
      },
      answerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'game_answers',
          key: 'id'
        }
      },
      transactionType: {
        type: DataTypes.ENUM('gain', 'penalty', 'deposit_recharge', 'deposit_payment', 'voluntary_refusal'),
        allowNull: false,
        comment: 'Type de transaction'
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Nombre de points de la transaction (positif pour gains, négatif pour pertes)'
      },
      playerBalanceBefore: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Points du joueur avant la transaction'
      },
      playerBalanceAfter: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Points du joueur après la transaction'
      },
      depositAmountBefore: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Total de points avant la transaction'
      },
      depositAmountAfter: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Total de points après la transaction'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description de la transaction'
      },
      validatedBy: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'NumeroH du jury qui a validé cette transaction'
      }
    }, {
      sequelize,
      modelName: 'GameTransaction',
      tableName: 'game_transactions',
      timestamps: true,
      indexes: [
        {
          fields: ['gameId']
        },
        {
          fields: ['playerId']
        },
        {
          fields: ['transactionType']
        },
        {
          fields: ['createdAt']
        }
      ]
    });
  }

  static associate(models) {
    this.belongsTo(models.Game, {
      foreignKey: 'gameId',
      as: 'game'
    });
    this.belongsTo(models.GamePlayer, {
      foreignKey: 'playerId',
      as: 'player'
    });
    this.belongsTo(models.GameAnswer, {
      foreignKey: 'answerId',
      as: 'answer'
    });
  }
}

export default GameTransaction;

