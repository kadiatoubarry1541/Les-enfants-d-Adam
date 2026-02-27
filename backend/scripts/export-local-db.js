/**
 * Exporte la base de données LOCALE vers un fichier .sql
 * Utilise les variables DB_* de backend/config.env
 * Usage: depuis backend/ → node scripts/export-local-db.js
 * Fichier créé: backend/dumps/local-backup-YYYY-MM-DD-HHmm.sql (dumps/ dans .gitignore)
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(__dirname, '..');
dotenv.config({ path: path.join(backendDir, 'config.env') });

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '5432';
const database = process.env.DB_NAME || 'enfants_adam_eve';
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || '';

if (!password) {
  console.error('❌ DB_PASSWORD manquant dans backend/config.env');
  process.exit(1);
}

const dumpsDir = path.join(backendDir, 'dumps');
if (!fs.existsSync(dumpsDir)) fs.mkdirSync(dumpsDir, { recursive: true });

const date = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '-').replace(/\..*/, '');
const outFile = path.join(dumpsDir, `local-backup-${date}.sql`);
console.log('📤 Export base locale vers', outFile);

const env = { ...process.env, PGPASSWORD: password };
const pgDump = spawn('pg_dump', [
  '-h', host,
  '-p', port,
  '-U', user,
  '-d', database,
  '-F', 'p',           // plain SQL
  '--no-owner',
  '--no-acl',
  '-f', outFile
], { env, stdio: ['ignore', 'pipe', 'pipe'] });

let stderr = '';
pgDump.stderr.on('data', (ch) => { stderr += ch; });
pgDump.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ pg_dump a échoué. Vérifiez que PostgreSQL est installé et que pg_dump est dans le PATH.');
    if (stderr) console.error(stderr);
    process.exit(1);
  }
  console.log('✅ Export terminé:', outFile);
  console.log('💡 Pour envoyer cette base sur Render: définissez RENDER_DATABASE_URL (URL Render), puis npm run db:push-render');
});
