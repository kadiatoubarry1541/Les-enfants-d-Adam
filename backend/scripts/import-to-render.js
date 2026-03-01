/**
 * Importe un fichier .sql (export local) dans la base Render
 * Utilise RENDER_DATABASE_URL ou DATABASE_URL (URL complète Render)
 * Usage: depuis backend/ → RENDER_DATABASE_URL="postgresql://..." node scripts/import-to-render.js [fichier.sql]
 * Si pas de fichier: utilise le plus récent dans backend/dumps/
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(__dirname, '..');
dotenv.config({ path: path.join(backendDir, 'config.env') });

const databaseUrl = process.env.RENDER_DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ Définissez RENDER_DATABASE_URL, NEON_DATABASE_URL ou DATABASE_URL (URL de la base en ligne, ex. Neon)');
  console.error('   Exemple: RENDER_DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"');
  process.exit(1);
}

const dumpsDir = path.join(backendDir, 'dumps');
let sqlFile = process.argv[2];
if (!sqlFile) {
  if (!fs.existsSync(dumpsDir)) {
    console.error('❌ Dossier backend/dumps/ introuvable. Lancez d\'abord: npm run db:export');
    process.exit(1);
  }
  const files = fs.readdirSync(dumpsDir).filter(f => f.endsWith('.sql'));
  if (files.length === 0) {
    console.error('❌ Aucun fichier .sql dans backend/dumps/. Lancez d\'abord: npm run db:export');
    process.exit(1);
  }
  files.sort();
  sqlFile = path.join(dumpsDir, files[files.length - 1]);
  console.log('📂 Fichier utilisé (dernier backup):', path.basename(sqlFile));
} else {
  sqlFile = path.isAbsolute(sqlFile) ? sqlFile : path.join(process.cwd(), sqlFile);
  if (!fs.existsSync(sqlFile)) {
    console.error('❌ Fichier introuvable:', sqlFile);
    process.exit(1);
  }
}

console.log('📥 Import vers la base Render...');

// psql avec une URL: psql "postgresql://..." -f file.sql
const psql = spawn('psql', [databaseUrl, '-f', sqlFile], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let stderr = '';
psql.stderr.on('data', (ch) => { stderr += ch; });
psql.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Import échoué. Vérifiez que psql est dans le PATH et que l\'URL Render est correcte.');
    if (stderr) console.error(stderr);
    process.exit(1);
  }
  console.log('✅ Base Render mise à jour avec les données locales.');
});
