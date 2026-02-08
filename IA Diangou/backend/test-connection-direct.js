// Test direct de connexion avec les credentials du config.env
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

const { Client } = pg;

console.log('🔄 Test de connexion directe à PostgreSQL...\n');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'diangou',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
};

console.log('📋 Configuration utilisée:');
console.log(`   Host: ${config.host}`);
console.log(`   Port: ${config.port}`);
console.log(`   Database: ${config.database}`);
console.log(`   User: ${config.user}`);
console.log(`   Password: ${config.password ? '***' : '(vide)'}\n`);

const client = new Client(config);

try {
  console.log('1️⃣ Tentative de connexion...');
  await client.connect();
  console.log('   ✅ Connexion réussie !\n');

  console.log('2️⃣ Test de requête...');
  const result = await client.query('SELECT NOW() as current_time, current_database() as db_name');
  console.log(`   ✅ Requête réussie !`);
  console.log(`   📅 Heure serveur: ${result.rows[0].current_time}`);
  console.log(`   🗄️ Base de données: ${result.rows[0].db_name}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ CONNEXION RÉUSSIE !');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💡 Le problème vient peut-être de Sequelize.');
  console.log('   Vérifiez les logs du serveur backend.\n');

  await client.end();
  process.exit(0);

} catch (error) {
  console.error('\n❌ ERREUR DE CONNEXION:', error.message);
  console.error('   Code:', error.code);
  
  if (error.code === 'ECONNREFUSED') {
    console.error('\n💡 SOLUTION:');
    console.error('   PostgreSQL n\'est pas démarré ou n\'écoute pas sur le port', config.port);
    console.error('   - Vérifiez que le service PostgreSQL est démarré');
    console.error('   - Vérifiez que le port', config.port, 'est correct');
  } else if (error.code === '28P01') {
    console.error('\n💡 SOLUTION:');
    console.error('   Mot de passe incorrect pour l\'utilisateur', config.user);
    console.error('   - Vérifiez DB_PASSWORD dans config.env');
    console.error('   - Si vous n\'avez pas de mot de passe, laissez DB_PASSWORD= vide');
  } else if (error.code === '3D000') {
    console.error('\n💡 SOLUTION:');
    console.error('   La base de données "' + config.database + '" n\'existe pas');
    console.error('   - Créez-la avec: CREATE DATABASE ' + config.database + ';');
  } else if (error.code === 'ENOTFOUND') {
    console.error('\n💡 SOLUTION:');
    console.error('   Impossible de trouver le serveur', config.host);
    console.error('   - Vérifiez DB_HOST dans config.env');
  } else {
    console.error('\n💡 Détails complets:');
    console.error(error);
  }

  process.exit(1);
}

