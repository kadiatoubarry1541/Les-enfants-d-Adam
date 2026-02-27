/**
 * Envoie ta base locale vers Render en une seule commande.
 * Utilise backend/config.env (DB_* pour la base locale, RENDER_DATABASE_URL pour Render).
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(__dirname, '..');

function run(cmd, args, env) {
  return new Promise((resolve, reject) => {
    const c = spawn(cmd, args, { cwd: backendDir, env: { ...process.env, ...env }, stdio: 'inherit' });
    c.on('close', code => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
  });
}

async function main() {
  console.log('📤 Étape 1/2 : export de la base locale...\n');
  await run('node', ['scripts/export-local-db.js']).catch(() => {
    console.error('\n❌ Export impossible. Vérifiez que PostgreSQL est installé et que backend/config.env contient DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.');
    process.exit(1);
  });
  console.log('\n📥 Étape 2/2 : envoi vers Render...\n');
  await run('node', ['scripts/import-to-render.js']).catch(() => {
    console.error('\n❌ Import impossible. Vérifiez que RENDER_DATABASE_URL est dans backend/config.env (URL de la base Render).');
    process.exit(1);
  });
  console.log('\n✅ C’est fait : ta base Render = ta base locale.');
}

main();
