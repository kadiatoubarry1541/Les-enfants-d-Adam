import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class GameQuestion extends Model {
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
      askedBy: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'NumeroH du joueur qui a posé la question'
      },
      questionType: {
        type: DataTypes.ENUM('text', 'audio', 'video'),
        allowNull: false,
        defaultValue: 'text'
      },
      questionContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Contenu de la question (texte)'
      },
      questionMediaUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL du média si audio ou vidéo'
      },
      cycleNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Numéro du cycle dans lequel cette question a été posée'
      },
      status: {
        type: DataTypes.ENUM('pending', 'answered', 'validated', 'closed'),
        allowNull: false,
        defaultValue: 'pending'
      }
    }, {
      sequelize,
      modelName: 'GameQuestion',
      tableName: 'game_questions',
      timestamps: true,
      indexes: [
        {
          fields: ['gameId']
        },
        {
          fields: ['askedBy']
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
    this.belongsTo(models.User, {
      foreignKey: 'askedBy',
      targetKey: 'numeroH',
      as: 'asker'
    });
    this.hasMany(models.GameAnswer, {
      foreignKey: 'questionId',
      as: 'answers'
    });
  }
}

export default GameQuestion;

