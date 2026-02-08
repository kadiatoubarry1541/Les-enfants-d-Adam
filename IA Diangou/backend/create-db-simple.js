// Script simple pour créer la base de données
// Utilise psql via child_process

import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';

console.log('🔄 Création de la base de données "diangou"...\n');

// Construire la commande psql
// Note: Pour Windows, vous devrez peut-être utiliser le chemin complet
const psqlCommand = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -c "SELECT 1 FROM pg_database WHERE datname='diangou'"`;

console.log('💡 Instructions manuelles:\n');
console.log('1. Ouvrez une invite de commande ou PowerShell');
console.log('2. Connectez-vous à PostgreSQL:');
console.log(`   psql -U ${dbUser}`);
console.log('3. Exécutez:');
console.log('   CREATE DATABASE diangou;');
console.log('4. Quittez: \\q\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('OU utilisez cette commande directe:\n');
console.log(`psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -c "CREATE DATABASE diangou;"`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Essayer d'exécuter la commande si psql est disponible
try {
  const { stdout, stderr } = await execAsync(psqlCommand, {
    env: { ...process.env, PGPASSWORD: dbPassword },
    timeout: 5000
  });
  
  if (stdout.includes('1 row')) {
    console.log('✅ La base de données "diangou" existe déjà\n');
  } else {
    console.log('⚠️ La base de données "diangou" n\'existe pas\n');
    console.log('Exécutez la commande ci-dessus pour la créer.\n');
  }
} catch (error) {
  console.log('⚠️ Impossible d\'exécuter psql automatiquement');
  console.log('Suivez les instructions manuelles ci-dessus.\n');
}

