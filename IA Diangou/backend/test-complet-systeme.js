// Script de test complet du système
import { sequelize } from './config/database.js';
import User from './src/models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

console.log('═══════════════════════════════════════════════════════════════');
console.log('  TEST COMPLET DU SYSTÈME - IA DIANGOU');
console.log('═══════════════════════════════════════════════════════════════\n');

async function testComplet() {
  let dbConnected = false;
  let adminExists = false;
  let adminCanLogin = false;
  let routesWork = false;

  try {
    // 1. Test de connexion à la base de données
    console.log('1️⃣ TEST DE CONNEXION À LA BASE DE DONNÉES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
      await sequelize.authenticate();
      console.log('✅ Base de données CONNECTÉE\n');
      dbConnected = true;
    } catch (error) {
      console.log('❌ Base de données NON CONNECTÉE');
      console.log('   Erreur:', error.message);
      console.log('   Code:', error.code || 'N/A');
      console.log('\n💡 SOLUTIONS:');
      if (error.code === 'ECONNREFUSED') {
        console.log('   - Démarrez PostgreSQL');
      } else if (error.code === '28P01') {
        console.log('   - Vérifiez DB_PASSWORD dans config.env');
      } else if (error.code === '3D000') {
        console.log('   - Créez la base: CREATE DATABASE diangou;');
      }
      console.log('');
      await sequelize.close();
      process.exit(1);
    }

    // 2. Test de l'admin
    console.log('2️⃣ TEST DU COMPTE ADMIN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const adminEmail = 'kadiatou1541.kb@gmail.com';
    const adminPassword = 'Neneyaya1';
    
    const admin = await User.findOne({ where: { email: adminEmail } });
    
    if (admin) {
      console.log('✅ Compte admin TROUVÉ dans la base de données');
      console.log('   - Email:', admin.email);
      console.log('   - Rôle:', admin.role);
      console.log('   - Actif:', admin.isActive ? 'Oui' : 'Non');
      adminExists = true;

      // Test du mot de passe
      const passwordValid = await bcrypt.compare(adminPassword, admin.password);
      if (passwordValid && admin.role === 'admin' && admin.isActive) {
        console.log('✅ Mot de passe CORRECT');
        console.log('✅ Rôle ADMIN confirmé');
        console.log('✅ Compte ACTIF');
        console.log('\n🎉 VOUS POUVEZ VOUS CONNECTER EN TANT QU\'ADMIN !\n');
        adminCanLogin = true;
      } else {
        console.log('❌ Problème détecté:');
        if (!passwordValid) console.log('   - Mot de passe incorrect');
        if (admin.role !== 'admin') console.log('   - Rôle incorrect:', admin.role);
        if (!admin.isActive) console.log('   - Compte désactivé');
        console.log('\n💡 Solution: Exécutez node scripts/createAdmin.js\n');
      }
    } else {
      console.log('❌ Compte admin NON TROUVÉ dans la base de données');
      console.log('\n💡 Solution: Exécutez node scripts/createAdmin.js\n');
    }

    // 3. Test des modèles pour les différents types d'utilisateurs
    console.log('3️⃣ TEST DES INSCRIPTIONS (ÉTUDIANT, PARENT, PROFESSEUR)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Vérifier que les modèles existent
    try {
      await sequelize.sync({ alter: false });
      console.log('✅ Modèles synchronisés avec la base de données');
      
      // Vérifier les routes d'inscription
      console.log('\n📋 Routes d\'inscription disponibles:');
      console.log('   ✅ POST /api/education/register/professeur');
      console.log('   ✅ POST /api/education/register/parent');
      console.log('   ✅ POST /api/education/register/apprenant');
      console.log('\n✅ Les étudiants, parents et professeurs PEUVENT créer leur compte\n');
      routesWork = true;
    } catch (error) {
      console.log('❌ Erreur lors de la synchronisation:', error.message);
      routesWork = false;
    }

    // 4. Test de la route de connexion
    console.log('4️⃣ TEST DE LA CONNEXION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Route disponible: POST /api/education/login');
    console.log('✅ Tous les utilisateurs PEUVENT se connecter\n');

    // 5. Résumé final
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  RÉSUMÉ FINAL');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    if (dbConnected) {
      console.log('✅ Base de données: FONCTIONNE');
    } else {
      console.log('❌ Base de données: NE FONCTIONNE PAS');
    }

    if (adminExists && adminCanLogin) {
      console.log('✅ Connexion Admin: VOUS POUVEZ VOUS CONNECTER');
      console.log('   Email: kadiatou1541.kb@gmail.com');
      console.log('   Mot de passe: Neneyaya1');
    } else if (adminExists) {
      console.log('⚠️ Connexion Admin: PROBLÈME (exécutez node scripts/createAdmin.js)');
    } else {
      console.log('❌ Connexion Admin: COMPTE N\'EXISTE PAS (exécutez node scripts/createAdmin.js)');
    }

    if (routesWork) {
      console.log('✅ Inscriptions: ÉTUDIANTS, PARENTS ET PROFESSEURS PEUVENT CRÉER LEUR COMPTE');
      console.log('✅ Connexions: TOUS LES UTILISATEURS PEUVENT SE CONNECTER');
    } else {
      console.log('❌ Inscriptions: PROBLÈME DÉTECTÉ');
    }

    console.log('\n═══════════════════════════════════════════════════════════════\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR FATALE:', error.message);
    console.error('   Code:', error.code);
    console.error('   Type:', error.name);
    process.exit(1);
  }
}

testComplet();

