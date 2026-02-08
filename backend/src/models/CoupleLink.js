import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../../config/database.js';

/**
 * Liaison couple (Mon Homme / Ma Femme) identifiée par les deux NumeroH
 * et le numéro unique reçu lors du mariage à la mairie (jamais de répétition).
 */
class CoupleLink extends Model {
  static async getMyPartner(numeroH) {
    const link = await this.findOne({
      where: {
        [Op.or]: [
          { numeroH1: numeroH },
          { numeroH2: numeroH }
        ],
        status: 'active',
        isActive: true
      }
    });
    return link;
  }

  static async findByNumeroMariage(numeroMariageMairie) {
    return await this.findOne({
      where: { numeroMariageMairie: numeroMariageMairie.trim(), isActive: true }
    });
  }

  /** Invitations en attente pour le destinataire (celui qui n'a pas créé le lien). */
  static async getPendingInvitations(numeroH) {
    return await this.findAll({
      where: {
        [Op.or]: [{ numeroH1: numeroH }, { numeroH2: numeroH }],
        status: 'pending',
        isActive: true,
        initiatedByNumeroH: { [Op.ne]: numeroH }
      },
      order: [['created_at', 'DESC']]
    });
  }
}

CoupleLink.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  numeroH1: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH du premier partenaire',
    field: 'numero_h1'
  },
  numeroH2: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'NumeroH du second partenaire',
    field: 'numero_h2'
  },
  numeroMariageMairie: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'Numéro reçu lors du mariage à la mairie (optionnel, unique si renseigné)',
    field: 'numero_mariage_mairie'
  },
  initiatedByNumeroH: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'NumeroH de celui qui a créé le lien (destinataire = l\'autre)',
    field: 'initiated_by_numero_h'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    comment: 'pending = en attente de confirmation par le destinataire, active = confirmé',
    field: 'status'
  },
  confirmedAt: {
    type: DataTypes.DATE,
    field: 'confirmed_at'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  sequelize,
  modelName: 'CoupleLink',
  tableName: 'couple_links',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['numero_h1'] },
    { fields: ['numero_h2'] },
    { unique: true, fields: ['numero_mariage_mairie'] },
    { unique: true, fields: ['numero_h1', 'numero_h2'] }
  ]
});

export default CoupleLink;
