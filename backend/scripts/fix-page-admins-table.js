/**
 * Script pour corriger la table page_admins : ajoute les colonnes en snake_case
 * (page_path, page_name, etc.) si elles n'existent pas.
 * À lancer une fois : node scripts/fix-page-admins.js (depuis backend) ou npm run fix-page-admins
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      define: { timestamps: true, underscored: true, freezeTableName: true }
    })
  : new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'enfants_adam_eve',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      logging: false,
      define: { timestamps: true, underscored: true, freezeTableName: true }
    });

async function fixPageAdminsTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL OK');

    const q = sequelize.getQueryInterface();
    const table = 'page_admins';

    try {
      const tableDesc = await q.describeTable(table);
      const columns = Object.keys(tableDesc);

      const requiredColumns = [
        { name: 'page_path', type: 'VARCHAR(100)' },
        { name: 'page_name', type: 'VARCHAR(100)' },
        { name: 'admin_numero_h', type: 'VARCHAR(20)' },
        { name: 'assigned_by', type: 'VARCHAR(20)' },
        { name: 'assigned_at', type: 'TIMESTAMP WITH TIME ZONE' },
        { name: 'is_active', type: 'BOOLEAN' }
      ];

      for (const col of requiredColumns) {
        if (!columns.includes(col.name)) {
          try {
            await sequelize.query(
              `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type};`
            );
            console.log(`  ➕ Colonne ajoutée : ${col.name}`);
          } catch (e) {
            console.warn(`  ⚠️ ${col.name}:`, e.message);
          }
        }
      }

      // Si l'ancienne table a "pagePath" (camelCase), copier vers page_path puis supprimer pagePath
      if (columns.includes('pagePath') && columns.includes('page_path') === false) {
        await sequelize.query(
          `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "page_path" VARCHAR(100);`
        );
        await sequelize.query(
          `UPDATE "${table}" SET "page_path" = "pagePath" WHERE "pagePath" IS NOT NULL;`
        );
        await sequelize.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "pagePath";`);
        console.log('  🔄 Colonne pagePath migrée vers page_path');
      }
      if (columns.includes('pageName') && columns.includes('page_name') === false) {
        await sequelize.query(
          `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "page_name" VARCHAR(100);`
        );
        await sequelize.query(
          `UPDATE "${table}" SET "page_name" = "pageName" WHERE "pageName" IS NOT NULL;`
        );
        await sequelize.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "pageName";`);
        console.log('  🔄 Colonne pageName migrée vers page_name');
      }

      console.log('✅ Table page_admins à jour.');
    } catch (err) {
      if (err.message && err.message.includes('does not exist')) {
        console.log('ℹ️ La table page_admins n’existe pas encore. Elle sera créée au prochain démarrage du serveur (sync).');
      } else {
        throw err;
      }
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

fixPageAdminsTable();
