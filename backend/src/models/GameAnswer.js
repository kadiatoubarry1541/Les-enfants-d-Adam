import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class GameAnswer extends Model {
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
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'game_questions',
          key: 'id'
        }
      },
      playerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'game_players',
          key: 'id'
        }
      },
      numeroH: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'NumeroH du joueur qui a répondu'
      },
      answerContent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Contenu de la réponse (null si refus volontaire)'
      },
      answerType: {
        type: DataTypes.ENUM('text', 'audio', 'video'),
        allowNull: true
      },
      answerMediaUrl: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      isVoluntaryRefusal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'True si le joueur a volontairement refusé de répondre'
      },
      status: {
        type: DataTypes.ENUM('pending', 'validated_correct', 'validated_wrong', 'refused'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Status après validation du jury'
      },
      pointsEarned: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Points gagnés ou perdus (+10000, -5000, -10000)'
      },
      validatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date de validation par le jury'
      },
      validatedBy: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'NumeroH du jury qui a validé'
      }
    }, {
      sequelize,
      modelName: 'GameAnswer',
      tableName: 'game_answers',
      timestamps: true,
      indexes: [
        {
          fields: ['gameId']
        },
        {
          fields: ['questionId']
        },
        {
          fields: ['playerId']
        },
        {
          fields: ['status']
        }
      ]
    });
  }

  static associate(models) {
    this.belongsTo(models.Game, {
      foreignKey: 'gameId',
      as: 'game'
    });
    this.belongsTo(models.GameQuestion, {
      foreignKey: 'questionId',
      as: 'question'
    });
    this.belongsTo(models.GamePlayer, {
      foreignKey: 'playerId',
      as: 'player'
    });
    this.belongsTo(models.User, {
      foreignKey: 'numeroH',
      targetKey: 'numeroH',
      as: 'answerer'
    });
  }
}

export default GameAnswer;

