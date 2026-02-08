// Script simple pour vérifier et créer l'admin
import bcrypt from 'bcryptjs';
import { sequelize } from './config/database.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

const email = 'kadiatou1541.kb@gmail.com';
const password = 'Neneyaya1';

console.log('═══════════════════════════════════════════════════════════════');
console.log('  VÉRIFICATION ET CRÉATION DU COMPTE ADMIN');
console.log('═══════════════════════════════════════════════════════════════\n');

async function main() {
  try {
    // 1. Connexion
    console.log('1️⃣ Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('   ✅ Connexion réussie\n');

    // 2. Synchronisation
    console.log('2️⃣ Synchronisation des modèles...');
    await sequelize.sync({ alter: true });
    console.log('   ✅ Modèles synchronisés\n');

    // 3. Vérifier/Créer l'admin
    console.log(`3️⃣ Recherche de l'utilisateur: ${email}...`);
    let user = await User.findOne({ where: { email } });
    
    if (user) {
      console.log('   ✅ Utilisateur trouvé');
      console.log(`   Rôle actuel: ${user.role}`);
      console.log(`   Actif: ${user.isActive ? 'Oui' : 'Non'}\n`);
      
      // Vérifier le mot de passe
      const passwordValid = await bcrypt.compare(password, user.password);
      console.log(`4️⃣ Vérification du mot de passe...`);
      if (passwordValid) {
        console.log('   ✅ Mot de passe correct\n');
      } else {
        console.log('   ⚠️ Mot de passe incorrect, mise à jour...');
        user.password = await bcrypt.hash(password, 12);
        await user.save();
        console.log('   ✅ Mot de passe mis à jour\n');
      }
      
      // Vérifier le rôle
      if (user.role !== 'admin') {
        console.log('5️⃣ Mise à jour du rôle en admin...');
        user.role = 'admin';
        user.isActive = true;
        await user.save();
        console.log('   ✅ Rôle mis à jour\n');
      } else {
        console.log('5️⃣ Rôle admin confirmé\n');
      }
    } else {
      console.log('   ⚠️ Utilisateur non trouvé, création...\n');
      
      console.log('4️⃣ Création du compte admin...');
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
      console.log('   ✅ Compte créé\n');
    }

    // 6. Test final
    console.log('6️⃣ Test final de connexion...');
    const finalUser = await User.findOne({ where: { email } });
    const finalPasswordCheck = await bcrypt.compare(password, finalUser.password);
    
    if (finalPasswordCheck && finalUser.role === 'admin' && finalUser.isActive) {
      console.log('   ✅ TOUT FONCTIONNE !\n');
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ BASE DE DONNÉES FONCTIONNE ET COMPTE ADMIN PRÊT !');
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
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 PostgreSQL n\'est pas démarré');
      console.error('   Solution: Démarrez le service PostgreSQL');
    } else if (error.code === '28P01') {
      console.error('\n💡 Mot de passe PostgreSQL incorrect');
      console.error('   Solution: Vérifiez DB_PASSWORD dans config.env');
    } else if (error.code === '3D000') {
      console.error('\n💡 Base de données "diangou" n\'existe pas');
      console.error('   Solution: Créez-la avec CREATE DATABASE diangou;');
    }
    
    console.error('\n💡 Détails:', error);
    process.exit(1);
  }
}

main();

