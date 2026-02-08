// Script pour tester la connexion admin
import bcrypt from 'bcryptjs';
import { sequelize } from './config/database.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

async function testAdminLogin() {
  console.log('🔄 Test de connexion admin...\n');
  
  try {
    // Connexion à la base de données
    console.log('1️⃣ Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('   ✅ Connexion réussie\n');

    // Synchroniser les modèles
    await sequelize.sync({ alter: true });
    console.log('   ✅ Modèles synchronisés\n');

    const email = 'kadiatou1541.kb@gmail.com';
    const password = 'Neneyaya1';

    // Vérifier si l'admin existe
    console.log(`2️⃣ Recherche de l'utilisateur: ${email}...`);
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('   ⚠️ Utilisateur non trouvé, création en cours...\n');
      
      // Créer l'admin
      const hashedPassword = await bcrypt.hash(password, 12);
      user = await User.create({
        numeroH: 'ADMIN001',
        password: hashedPassword,
        prenom: 'Admin',
        nomFamille: 'Diangou',
        email,
        role: 'admin',
        isActive: true,
        metadata: { isAdmin: true }
      });
      console.log('   ✅ Compte admin créé\n');
    } else {
      console.log('   ✅ Utilisateur trouvé\n');
      
      // Vérifier le rôle
      if (user.role !== 'admin') {
        console.log('   ⚠️ Mise à jour du rôle en admin...');
        user.role = 'admin';
        await user.save();
        console.log('   ✅ Rôle mis à jour\n');
      }
      
      // Vérifier le mot de passe
      console.log('3️⃣ Vérification du mot de passe...');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        console.log('   ⚠️ Mot de passe incorrect, mise à jour...');
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();
        console.log('   ✅ Mot de passe mis à jour\n');
      } else {
        console.log('   ✅ Mot de passe correct\n');
      }
    }

    // Test final de connexion
    console.log('4️⃣ Test final de connexion...');
    const finalUser = await User.findOne({ where: { email } });
    const finalPasswordCheck = await bcrypt.compare(password, finalUser.password);
    
    if (finalPasswordCheck && finalUser.role === 'admin' && finalUser.isActive) {
      console.log('   ✅ TOUT EST OK !\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ COMPTE ADMIN PRÊT POUR LA CONNEXION !');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('📧 Email:', email);
      console.log('🔑 Mot de passe:', password);
      console.log('👤 NumeroH:', finalUser.numeroH);
      console.log('🎭 Rôle:', finalUser.role);
      console.log('✅ Actif:', finalUser.isActive ? 'Oui' : 'Non');
      console.log('\n💡 Vous pouvez maintenant vous connecter sur le frontend !\n');
    } else {
      console.log('   ❌ Problème détecté');
      console.log('   Rôle:', finalUser.role);
      console.log('   Actif:', finalUser.isActive);
      console.log('   Mot de passe valide:', finalPasswordCheck);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('   Code:', error.code || 'N/A');
    console.error('   Type:', error.name || 'N/A');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 SOLUTION:');
      console.error('   PostgreSQL n\'est pas démarré');
      console.error('   - Démarrez le service PostgreSQL');
    } else if (error.code === '28P01') {
      console.error('\n💡 SOLUTION:');
      console.error('   Mot de passe PostgreSQL incorrect');
      console.error('   - Vérifiez DB_PASSWORD dans config.env');
    } else if (error.code === '3D000') {
      console.error('\n💡 SOLUTION:');
      console.error('   Base de données "diangou" n\'existe pas');
      console.error('   - Créez-la avec: CREATE DATABASE diangou;');
    } else {
      console.error('\n💡 Détails:', error);
    }
    
    process.exit(1);
  }
}

testAdminLogin();

