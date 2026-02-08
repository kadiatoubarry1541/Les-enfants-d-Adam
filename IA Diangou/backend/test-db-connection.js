// Script de test de connexion à la base de données
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, 'config.env') });

const { Client } = pg;

async function testConnection() {
  console.log('🔄 Test de connexion à PostgreSQL...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres', // On se connecte d'abord à la base 'postgres'
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  };

  console.log('📋 Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' : '(vide)'}\n`);

  const client = new Client(config);

  try {
    // Test 1: Connexion à PostgreSQL
    console.log('1️⃣ Test de connexion à PostgreSQL...');
    await client.connect();
    console.log('   ✅ PostgreSQL est accessible\n');

    // Test 2: Vérifier si la base "diangou" existe
    console.log('2️⃣ Vérification de la base de données "diangou"...');
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'diangou'"
    );

    if (dbCheck.rows.length > 0) {
      console.log('   ✅ Base de données "diangou" existe\n');
    } else {
      console.log('   ⚠️ Base de données "diangou" n\'existe pas');
      console.log('   🔄 Création de la base de données...');
      await client.query('CREATE DATABASE diangou');
      console.log('   ✅ Base de données "diangou" créée avec succès\n');
    }

    // Test 3: Se connecter à la base "diangou"
    await client.end();
    const diangouClient = new Client({
      ...config,
      database: 'diangou'
    });

    console.log('3️⃣ Test de connexion à la base "diangou"...');
    await diangouClient.connect();
    console.log('   ✅ Connexion à "diangou" réussie\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ TOUS LES TESTS SONT RÉUSSIS !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 Vous pouvez maintenant redémarrer le serveur backend.\n');

    await diangouClient.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 SOLUTION:');
      console.error('   PostgreSQL n\'est pas démarré ou n\'écoute pas sur le port', config.port);
      console.error('   - Vérifiez que PostgreSQL est installé');
      console.error('   - Démarrez le service PostgreSQL');
      console.error('   - Sur Windows: Services → PostgreSQL');
    } else if (error.code === '28P01') {
      console.error('\n💡 SOLUTION:');
      console.error('   Mot de passe incorrect pour l\'utilisateur', config.user);
      console.error('   - Vérifiez DB_PASSWORD dans config.env');
    } else if (error.code === '3D000') {
      console.error('\n💡 SOLUTION:');
      console.error('   La base de données "postgres" n\'existe pas');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 SOLUTION:');
      console.error('   Impossible de trouver le serveur', config.host);
      console.error('   - Vérifiez DB_HOST dans config.env');
    } else {
      console.error('\n💡 Détails:', error);
    }

    process.exit(1);
  }
}

testConnection();

