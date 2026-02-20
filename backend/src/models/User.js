import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database.js';

class User extends Model {
  // Méthodes d'instance
  getFullName() {
    return `${this.prenom} ${this.nomFamille}`;
  }

  getAge() {
    if (this.dateNaissance) {
      const today = new Date();
      const birthDate = new Date(this.dateNaissance);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return null;
  }

  // Méthodes statiques
  static async findByNumeroH(numeroH) {
    if (!numeroH) {
      console.log('❌ NumeroH vide ou null');
      return null;
    }
    
    // Normaliser le NumeroH en supprimant les espaces supplémentaires
    const normalizedNumeroH = numeroH.trim().replace(/\s+/g, ' ');
    console.log('🔍 Recherche utilisateur avec NumeroH:', numeroH, '→ normalisé:', normalizedNumeroH);
    
    try {
      // Essayer d'abord une correspondance exacte avec le champ Sequelize (numeroH)
      let user = await this.findOne({ 
        where: { numeroH: normalizedNumeroH },
        raw: false // S'assurer qu'on récupère une instance Sequelize
      });
      
      // Si aucun utilisateur n'est trouvé, essayer avec le NumeroH original (sans normalisation)
      if (!user && normalizedNumeroH !== numeroH.trim()) {
        console.log('🔍 Essai avec NumeroH original (non normalisé):', numeroH.trim());
        user = await this.findOne({ 
          where: { numeroH: numeroH.trim() },
          raw: false
        });
      }
      
      // Si toujours aucun utilisateur, essayer avec une recherche directe sur le champ de base de données
      if (!user) {
        console.log('🔍 Essai avec recherche directe sur numero_h (champ DB)');
        user = await this.findOne({ 
          where: {
            [Op.or]: [
              { numeroH: normalizedNumeroH },
              { numeroH: numeroH.trim() }
            ]
          },
          raw: false
        });
      }
      
      // Si toujours aucun utilisateur, essayer avec une recherche insensible aux espaces (dernier recours)
      if (!user) {
        console.log('🔍 Essai avec recherche insensible aux espaces (dernier recours)');
        const numeroHSansEspaces = normalizedNumeroH.replace(/\s/g, '');
        
        try {
          // Utiliser une requête SQL brute pour une recherche plus flexible
          const [results] = await sequelize.query(
            `SELECT numero_h FROM users WHERE REPLACE(numero_h, ' ', '') = :numeroHSansEspaces LIMIT 1`,
            {
              replacements: { numeroHSansEspaces },
              type: sequelize.QueryTypes.SELECT
            }
          );
          
          if (results && results.length > 0 && results[0].numero_h) {
            // Utiliser findByPk avec le numero_h trouvé
            user = await this.findByPk(results[0].numero_h, { raw: false });
            if (user) {
              console.log('✅ Utilisateur trouvé avec recherche SQL insensible aux espaces:', user.numeroH);
            }
          }
        } catch (sqlError) {
          console.error('❌ Erreur lors de la recherche SQL:', sqlError);
          // Continuer sans lever d'erreur
        }
      }
      
      // Dernier recours : essayer avec findByPk directement si le numeroH ressemble à une clé primaire
      if (!user && normalizedNumeroH) {
        try {
          user = await this.findByPk(normalizedNumeroH, { raw: false });
          if (user) {
            console.log('✅ Utilisateur trouvé avec findByPk direct:', user.numeroH);
          }
        } catch (pkError) {
          // Ignorer l'erreur, ce n'est qu'un dernier recours
        }
      }
      
      if (user) {
        console.log('✅ Utilisateur trouvé:', user.numeroH, '(type:', user.type, ', actif:', user.isActive, ')');
      } else {
        console.log('❌ Aucun utilisateur trouvé avec NumeroH:', numeroH);
      }
      
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche de l\'utilisateur:', error);
      return null;
    }
  }

  static async findByType(type) {
    return await this.findAll({ where: { type } });
  }

  static async findByFamily(nomFamille) {
    return await this.findAll({ where: { nomFamille } });
  }
}

// Définition du modèle
User.init({
  // Identifiants principaux
  numeroH: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    field: 'numero_h'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // ENUM converti en STRING ('vivant', 'defunt')
    defaultValue: 'vivant'
  },
  
  // Informations personnelles
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nomFamille: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING, // ENUM converti en STRING ('FEMME', 'HOMME', 'AUTRE')
    defaultValue: 'AUTRE'
  },
  dateNaissance: {
    type: DataTypes.DATEONLY
  },
  
  // Informations familiales
  famillePere: {
    type: DataTypes.STRING
  },
  prenomPere: {
    type: DataTypes.STRING
  },
  pereStatut: {
    type: DataTypes.STRING, // ENUM converti en STRING ('Vivant', 'Mort')
  },
  numeroHPere: {
    type: DataTypes.STRING
  },
  familleMere: {
    type: DataTypes.STRING
  },
  prenomMere: {
    type: DataTypes.STRING
  },
  mereStatut: {
    type: DataTypes.STRING, // ENUM converti en STRING ('Vivant', 'Mort')
  },
  numeroHMere: {
    type: DataTypes.STRING
  },
  
  // Informations géographiques et ethniques
  ethnie: {
    type: DataTypes.STRING
  },
  regionOrigine: {
    type: DataTypes.STRING
  },
  pays: {
    type: DataTypes.STRING
  },
  origine: {
    type: DataTypes.STRING
  },
  nationalite: {
    type: DataTypes.STRING
  },
  lieuNaissance: {
    type: DataTypes.STRING,
    field: 'lieu_naissance'
  },
  rangNaissance: {
    type: DataTypes.STRING,
    field: 'rang_naissance'
  },
  
  // Informations calculées
  generation: {
    type: DataTypes.STRING
  },
  decet: {
    type: DataTypes.STRING
  },
  age: {
    type: DataTypes.INTEGER
  },
  anneesAvantNaissance: {
    type: DataTypes.INTEGER,
    field: 'annees_avant_naissance'
  },
  
  // Informations de contact
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  tel1: {
    type: DataTypes.STRING
  },
  tel2: {
    type: DataTypes.STRING
  },
  
  // Informations sociales
  statutSocial: {
    type: DataTypes.STRING, // ENUM converti en STRING ('Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf/Veuve', 'Concubinage', 'Séparé(e)', 'Autre')
    defaultValue: 'Célibataire'
  },
  religion: {
    type: DataTypes.STRING
  },
  situationEco: {
    type: DataTypes.STRING, // ENUM converti en STRING ('Riche', 'Pauvre', 'Moyen', 'Gens de droits')
    defaultValue: 'Moyen'
  },
  
  // Informations de santé
  etatPhysique: {
    type: DataTypes.STRING,
    field: 'etat_physique'
  },
  situationSanitaire: {
    type: DataTypes.STRING,
    field: 'situation_sanitaire'
  },
  
  // Langues (stockées comme JSON)
  langues: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  languesAutre: {
    type: DataTypes.STRING
  },
  
  // Médias
  photo: {
    type: DataTypes.STRING, // URL ou chemin du fichier
  },
  video: {
    type: DataTypes.STRING, // URL ou chemin du fichier
  },
  fingerprint: {
    type: DataTypes.TEXT, // Données biométriques
  },
  preuve: {
    type: DataTypes.STRING, // Document de preuve (acte de décès, etc.)
  },
  // Photos de famille
  familyPhoto: {
    type: DataTypes.STRING, // Photo de famille
    field: 'family_photo'
  },
  manPhoto: {
    type: DataTypes.STRING, // Photo de l'homme (utilisateur)
    field: 'man_photo'
  },
  wifePhoto: {
    type: DataTypes.STRING, // Photo de la femme
    field: 'wife_photo'
  },
  childrenPhotos: {
    type: DataTypes.TEXT, // Photos des enfants (JSON stringifié)
    field: 'children_photos'
  },
  
  // Informations pour les défunts
  dateDeces: {
    type: DataTypes.DATEONLY,
    field: 'date_deces'
  },
  anneeDeces: {
    type: DataTypes.INTEGER,
    field: 'annee_deces'
  },
  lieuDeces: {
    type: DataTypes.STRING,
    field: 'lieu_deces'
  },
  ageObtenu: {
    type: DataTypes.INTEGER,
    field: 'age_obtenu',
    comment: 'Âge au moment du décès'
  },
  anneesDepuisDeces: {
    type: DataTypes.INTEGER,
    field: 'annees_depuis_deces',
    comment: 'Nombre d\'années depuis le décès'
  },
  
  // Relations familiales
  nbFreresMere: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbSoeursMere: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbFreresPere: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbSoeursPere: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbFilles: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbGarcons: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbTantesMaternelles: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbTantesPaternelles: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbOnclesMaternels: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbOnclesPaternels: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbCousins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbCousines: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nbFemmes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'nb_femmes',
    comment: 'Nombre d\'épouses (pour les hommes)'
  },
  
  // Activités professionnelles
  activite1: {
    type: DataTypes.STRING
  },
  activite2: {
    type: DataTypes.STRING
  },
  activite3: {
    type: DataTypes.STRING
  },
  
  // Lieux de résidence
  lieu1: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Non spécifié'
  },
  lieu2: {
    type: DataTypes.STRING
  },
  lieu3: {
    type: DataTypes.STRING
  },
  
  // Nouveaux champs géographiques
  prefecture: {
    type: DataTypes.STRING
  },
  sousPrefecture: {
    type: DataTypes.STRING,
    field: 'sous_prefecture'
  },
  lieuResidence1: {
    type: DataTypes.STRING,
    field: 'lieu_residence_1'
  },
  lieuResidence2: {
    type: DataTypes.STRING,
    field: 'lieu_residence_2'
  },
  lieuResidence3: {
    type: DataTypes.STRING,
    field: 'lieu_residence_3'
  },
  
  // Portefeuille/Wallet
  wallet: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Solde du portefeuille utilisateur'
  },
  walletCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'GNF',
    comment: 'Devise du portefeuille'
  },
  
  // Métadonnées
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.STRING, // ENUM converti en STRING ('user', 'admin', 'super-admin')
    defaultValue: 'user'
  },
  children: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  parents: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  // Histoires utilisateur (7 sections inspirées de la vie du Prophète)
  userStories: {
    type: DataTypes.TEXT, // Stocké comme JSON stringifié
    defaultValue: '{}',
    comment: 'Histoires personnelles de l\'utilisateur en 7 sections'
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['numeroH']
    },
    {
      fields: ['type']
    },
    {
      fields: ['nomFamille']
    },
    {
      fields: ['prenom']
    },
    {
      fields: ['generation']
    },
    {
      fields: ['pays', 'regionOrigine', 'ethnie']
    }
  ]
});

// Hooks
User.beforeSave(async (user) => {
  // Calculer l'âge automatiquement
  if (user.dateNaissance) {
    user.age = user.getAge();
  }
});

export default User;