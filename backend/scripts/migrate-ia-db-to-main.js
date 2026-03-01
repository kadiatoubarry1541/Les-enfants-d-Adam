/**
 * Migre tout le contenu des bases IAscience ET diangou vers la base principale.
 * Ensuite vous pourrez supprimer IAscience et diangou (il ne reste que la base principale).
 *
 * Usage (depuis backend/) :
 *   node scripts/migrate-ia-db-to-main.js
 *
 * Variables (backend/config.env ou env) :
 *   DATABASE_URL ou DB_* = base principale (cible), ex. enfants_adam_ev ou enfants_adam_eve
 *   IASCIENCE_DATABASE_URL = base IAscience (source)
 *   DIANGOU_DATABASE_URL = base diangou (source)
 */

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(__dirname, '..');
dotenv.config({ path: path.join(backendDir, 'config.env') });

const { Client } = pg;

function getMainDbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const db = process.env.DB_NAME || 'enfants_adam_eve';
  const user = process.env.DB_USER || 'postgres';
  const pass = process.env.DB_PASSWORD || '';
  const ssl = host.includes('neon.tech') ? '?sslmode=require' : '';
  return `postgresql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}${ssl}`;
}

const IA_DB_URL = process.env.IASCIENCE_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/IAscience';
const DIANGOU_DB_URL = process.env.DIANGOU_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/diangou';

const MAIN_URL = getMainDbUrl();
const mainSsl = MAIN_URL.includes('neon.tech') || MAIN_URL.includes('sslmode=require');

function pgType(dataType, charMax, numericPrecision) {
  const t = (dataType || '').toLowerCase();
  if (t === 'character varying' || t === 'varchar') return charMax ? `VARCHAR(${charMax})` : 'TEXT';
  if (t === 'character' || t === 'char') return charMax ? `CHAR(${charMax})` : 'CHAR(1)';
  if (t === 'integer' || t === 'int4') return 'INTEGER';
  if (t === 'bigint' || t === 'int8') return 'BIGINT';
  if (t === 'smallint' || t === 'int2') return 'SMALLINT';
  if (t === 'serial' || t === 'serial4') return 'SERIAL';
  if (t === 'bigserial' || t === 'serial8') return 'BIGSERIAL';
  if (t === 'real' || t === 'float4') return 'REAL';
  if (t === 'double precision' || t === 'float8') return 'DOUBLE PRECISION';
  if (t === 'numeric' || t === 'decimal') return numericPrecision ? `NUMERIC(${numericPrecision})` : 'NUMERIC';
  if (t === 'boolean' || t === 'bool') return 'BOOLEAN';
  if (t === 'timestamp without time zone' || t === 'timestamp') return 'TIMESTAMP';
  if (t === 'timestamp with time zone' || t === 'timestamptz') return 'TIMESTAMPTZ';
  if (t === 'date') return 'DATE';
  if (t === 'time') return 'TIME';
  if (t === 'uuid') return 'UUID';
  if (t === 'jsonb') return 'JSONB';
  if (t === 'json') return 'JSON';
  return 'TEXT';
}

async function migrateDiangou(mainClient, diangouClient) {
  console.log('\n--- Migration base DIANGOU ---\n');
  const tablesRes = await diangouClient.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
  `);
  const tables = tablesRes.rows.map(r => r.tablename).filter(t => !t.startsWith('Sequelize'));
  if (tables.length === 0) {
    console.log('   Aucune table dans diangou (ou base vide).');
    return;
  }
  await mainClient.query('CREATE SCHEMA IF NOT EXISTS diangou');
  for (const table of tables) {
    const colsRes = await diangouClient.query(`
      SELECT column_name, data_type, character_maximum_length, numeric_precision, is_nullable, column_default
      FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position
    `, [table]);
    if (colsRes.rows.length === 0) continue;
    const colDefs = colsRes.rows.map(c => {
      const type = pgType(c.data_type, c.character_maximum_length, c.numeric_precision);
      const nullStr = c.is_nullable === 'YES' ? '' : ' NOT NULL';
      const def = c.column_default && !String(c.column_default).includes('nextval') ? ` DEFAULT ${c.column_default}` : '';
      return `"${c.column_name}" ${type}${nullStr}${def}`;
    }).join(', ');
    const mainTable = `diangou."${table}"`;
    await mainClient.query(`DROP TABLE IF EXISTS ${mainTable} CASCADE`);
    await mainClient.query(`CREATE TABLE ${mainTable} (${colDefs})`);
    const rows = (await diangouClient.query(`SELECT * FROM "${table}"`)).rows;
    if (rows.length === 0) {
      console.log(`   ${table}: 0 ligne (table créée).`);
      continue;
    }
    const cols = colsRes.rows.map(c => c.column_name);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    const colList = cols.map(c => `"${c}"`).join(', ');
    for (const row of rows) {
      const vals = cols.map(c => row[c]);
      await mainClient.query(`INSERT INTO ${mainTable} (${colList}) VALUES (${placeholders})`, vals);
    }
    console.log(`   ${table}: ${rows.length} ligne(s) copiée(s).`);
  }
  console.log('   Base diangou migrée dans le schéma diangou de la base principale.');
}

async function run() {
  console.log('📦 Migration IAscience + diangou → base principale\n');
  console.log('  Base principale (cible):', MAIN_URL.replace(/:[^:@]+@/, ':****@'));
  console.log('  IAscience (source):', IA_DB_URL.replace(/:[^:@]+@/, ':****@'));
  console.log('  diangou (source):', DIANGOU_DB_URL.replace(/:[^:@]+@/, ':****@'));
  console.log('');

  const mainClient = new Client({
    connectionString: MAIN_URL,
    ssl: mainSsl ? { rejectUnauthorized: false } : false,
  });

  try {
    await mainClient.connect();
    console.log('✅ Connecté à la base principale.');
  } catch (e) {
    console.error('❌ Impossible de se connecter à la base principale:', e.message);
    console.error('   Vérifiez DB_NAME (ex. enfants_adam_ev ou enfants_adam_eve) et config.env');
    process.exit(1);
  }

  let iaConnected = false;
  const iaClient = new Client({ connectionString: IA_DB_URL });
  try {
    await iaClient.connect();
    iaConnected = true;
    console.log('✅ Connecté à la base IAscience.');
  } catch (e) {
    console.warn('⚠️ IAscience non accessible (ignorée):', e.message);
    iaClient.end().catch(() => {});
  }

  let diangouConnected = false;
  const diangouClient = new Client({ connectionString: DIANGOU_DB_URL });
  try {
    await diangouClient.connect();
    diangouConnected = true;
    console.log('✅ Connecté à la base diangou.');
  } catch (e) {
    console.warn('⚠️ diangou non accessible (ignorée):', e.message);
    diangouClient.end().catch(() => {});
  }

  try {
    if (iaConnected) {
      console.log('\n--- Migration base IASCIENCE ---\n');
      await mainClient.query(`
        CREATE TABLE IF NOT EXISTS ia_sc_sessions (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await mainClient.query(`
        CREATE TABLE IF NOT EXISTS ia_sc_messages (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          user_message TEXT NOT NULL,
          bot_response TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await mainClient.query(`
        CREATE TABLE IF NOT EXISTS ia_sc_conversations (
          id SERIAL PRIMARY KEY,
          user_message TEXT NOT NULL,
          bot_response TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await mainClient.query('CREATE INDEX IF NOT EXISTS idx_ia_sc_messages_session ON ia_sc_messages(session_id);');
      await mainClient.query('CREATE INDEX IF NOT EXISTS idx_ia_sc_messages_created ON ia_sc_messages(created_at);');

      const sessions = (await iaClient.query('SELECT id, session_id, created_at, last_activity FROM sessions ORDER BY id')).rows;
      const messages = (await iaClient.query('SELECT id, session_id, user_message, bot_response, created_at FROM messages ORDER BY id')).rows;
      const conversations = (await iaClient.query('SELECT id, user_message, bot_response, created_at FROM conversations ORDER BY id')).rows;

      for (const row of sessions) {
        await mainClient.query(
          `INSERT INTO ia_sc_sessions (session_id, created_at, last_activity) VALUES ($1, $2, $3) ON CONFLICT (session_id) DO NOTHING`,
          [row.session_id, row.created_at, row.last_activity]
        );
      }
      for (const row of messages) {
        await mainClient.query(
          `INSERT INTO ia_sc_messages (session_id, user_message, bot_response, created_at) VALUES ($1, $2, $3, $4)`,
          [row.session_id, row.user_message, row.bot_response, row.created_at]
        );
      }
      for (const row of conversations) {
        await mainClient.query(
          `INSERT INTO ia_sc_conversations (user_message, bot_response, created_at) VALUES ($1, $2, $3)`,
          [row.user_message, row.bot_response, row.created_at]
        );
      }
      console.log('   IAscience: sessions=%d, messages=%d, conversations=%d', sessions.length, messages.length, conversations.length);
    }

    if (diangouConnected) {
      await migrateDiangou(mainClient, diangouClient);
    }

    console.log('\n✅ Migration terminée. Tout est dans la base principale.');
    console.log('\n📌 Pour ne garder qu’UNE SEULE base (supprimer IAscience et diangou) :');
    console.log('    1. Arrêtez IA SC et toute app qui utilise IAscience ou diangou.');
    console.log('    2. Dans pgAdmin : clic droit sur la base → Query Tool (connecté à postgres), puis exécutez :');
    console.log('       DROP DATABASE IF EXISTS "IAscience";');
    console.log('       DROP DATABASE IF EXISTS diangou;');
    console.log('    3. Il restera : postgres (système) + votre base principale (enfants_adam_ev / enfants_adam_eve).');
    console.log('');
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  } finally {
    await mainClient.end();
    if (iaConnected) await iaClient.end();
    if (diangouConnected) await diangouClient.end();
  }
}

run();
