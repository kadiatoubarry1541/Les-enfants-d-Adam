import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, connectDB } from '../config/database.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

async function listUsers() {
  try {
    console.log('🔄 Connexion à la base de données PostgreSQL...');
    await connectDB();
    console.log('✅ Connecté à PostgreSQL\n');

    const users = await User.findAll({
      attributes: ['numeroH', 'email', 'role', 'isActive', 'isVerified'],
      order: [
        ['role', 'ASC'],
        ['numeroH', 'ASC']
      ],
      raw: true
    });

    if (!users || users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la table "users".');
      console.log('💡 Vérifie que les migrations / scripts d\'initialisation ont bien été exécutés.');
      return;
    }

    console.log(`👥 ${users.length} utilisateur(s) trouvé(s) dans la base :\n`);

    const admins = users.filter(
      (u) => u.role === 'admin' || u.role === 'super-admin'
    );

    if (admins.length > 0) {
      console.log('🎯 Comptes administrateur (role = admin / super-admin) :\n');
      admins.forEach((u, index) => {
        console.log(
          `${index + 1}. NumeroH: ${u.numeroH || '—'} | Email: ${u.email || '—'} | Rôle: ${u.role} | Actif: ${
            u.isActive ? 'Oui' : 'Non'
          } | Vérifié: ${u.isVerified ? 'Oui' : 'Non'}`
        );
      });
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('⚠️ Aucun compte avec role "admin" ou "super-admin" trouvé.\n');
    }

    console.log('📋 Tous les comptes utilisateurs :\n');
    users.forEach((u, index) => {
      console.log(
        `${index + 1}. NumeroH: ${u.numeroH || '—'} | Email: ${u.email || '—'} | Rôle: ${
          u.role || '—'
        } | Actif: ${u.isActive ? 'Oui' : 'Non'}`
      );
    });
  } catch (error) {
    console.error('\n❌ Erreur lors de la liste des utilisateurs :', error.message);
    if (error.code) {
      console.error('Code:', error.code);
    }
    console.error('Détails complets:', error);
  } finally {
    try {
      await sequelize.close();
      console.log('\n✅ Connexion PostgreSQL fermée.');
    } catch (closeError) {
      console.error('❌ Erreur lors de la fermeture de la connexion :', closeError.message);
    }
    process.exit(0);
  }
}

listUsers();

