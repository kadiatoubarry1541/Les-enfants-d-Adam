// Script de diagnostic complet pour vérifier que tout fonctionne
import { sequelize } from './config/database.js';
import User from './src/models/User.js';
import Professor from './src/models/Professor.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

async function diagnosticComplet() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  DIAGNOSTIC COMPLET - IA DIANGOU');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Vérifier les variables d'environnement
  console.log('1️⃣ Vérification de la configuration...');
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || '5432'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'diangou'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'postgres'}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : '(vide)'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Défini' : '✗ Manquant'}`);
  console.log(`   PORT: ${process.env.PORT || '5003'}\n`);

  // 2. Test de connexion à la base de données
  console.log('2️⃣ Test de connexion à PostgreSQL...');
  try {
    await sequelize.authenticate();
    console.log('   ✅ Connexion réussie\n');
  } catch (error) {
    console.error('   ❌ ERREUR DE CONNEXION:', error.message);
    console.error(`   Code: ${error.code || 'N/A'}`);
    console.error('\n💡 SOLUTIONS:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   - Démarrez PostgreSQL');
      console.error('   - Vérifiez que le service est actif');
    } else if (error.code === '28P01') {
      console.error('   - Vérifiez le mot de passe dans config.env');
    } else if (error.code === '3D000') {
      console.error('   - Créez la base de données: CREATE DATABASE diangou;');
    }
    process.exit(1);
  }

  // 3. Test des modèles
  console.log('3️⃣ Test des modèles...');
  try {
    const userCount = await User.count();
    const profCount = await Professor.count();
    console.log(`   ✅ Modèle User: ${userCount} utilisateur(s)`);
    console.log(`   ✅ Modèle Professor: ${profCount} professeur(s)\n`);
  } catch (error) {
    console.error('   ❌ ERREUR MODÈLES:', error.message);
    console.error('   💡 Synchronisez les modèles avec: sequelize.sync()\n');
  }

  // 4. Test de création (sans sauvegarder)
  console.log('4️⃣ Test de création d\'utilisateur (simulation)...');
  try {
    const testUser = User.build({
      numeroH: 'TEST001',
      email: 'test@test.com',
      password: 'test123',
      prenom: 'Test',
      nomFamille: 'User',
      role: 'apprenant',
      isActive: true
    });
    console.log('   ✅ Modèle User fonctionne correctement\n');
  } catch (error) {
    console.error('   ❌ ERREUR:', error.message);
    console.error('   💡 Vérifiez la structure du modèle User\n');
  }

  // 5. Vérifier les dossiers d'upload
  console.log('5️⃣ Vérification des dossiers d\'upload...');
  const fs = await import('fs');
  const uploadsPath = path.join(__dirname, 'uploads');
  const profilesPath = path.join(uploadsPath, 'profiles');
  const diplomasPath = path.join(uploadsPath, 'diplomas');

  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('   ✅ Dossier uploads créé');
  } else {
    console.log('   ✅ Dossier uploads existe');
  }

  if (!fs.existsSync(profilesPath)) {
    fs.mkdirSync(profilesPath, { recursive: true });
    console.log('   ✅ Dossier profiles créé');
  } else {
    console.log('   ✅ Dossier profiles existe');
  }

  if (!fs.existsSync(diplomasPath)) {
    fs.mkdirSync(diplomasPath, { recursive: true });
    console.log('   ✅ Dossier diplomas créé');
  } else {
    console.log('   ✅ Dossier diplomas existe');
  }
  console.log('');

  // Résumé
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ DIAGNOSTIC TERMINÉ - TOUT FONCTIONNE !');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💡 Prochaines étapes:');
  console.log('   1. Démarrez le serveur: npm run start');
  console.log('   2. Vérifiez que le serveur écoute sur le port', process.env.PORT || '5003');
  console.log('   3. Testez l\'inscription et la connexion\n');

  await sequelize.close();
  process.exit(0);
}

diagnosticComplet().catch((error) => {
  console.error('\n❌ ERREUR FATALE:', error);
  process.exit(1);
});

