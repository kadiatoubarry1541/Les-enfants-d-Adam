/**
 * Corrige la table users : s'assure que les colonnes sont en snake_case
 * (numero_h_pere, numero_h_mere). Si des colonnes camelCase existent, les migre.
 * À lancer une fois : npm run fix-users-table (depuis backend)
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

async function fixUsersTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL OK');

    const table = 'users';
    const q = sequelize.getQueryInterface();

    try {
      const tableDesc = await q.describeTable(table);
      const columns = Object.keys(tableDesc);

      // Colonnes snake_case attendues par le modèle User (avec field: 'numero_h_pere' etc.)
      const needSnake = [
        { snake: 'numero_h_pere', camel: 'numeroHPere' },
        { snake: 'numero_h_mere', camel: 'numeroHMere' }
      ];

      for (const { snake, camel } of needSnake) {
        const hasSnake = columns.includes(snake);
        const hasCamel = columns.includes(camel);

        if (hasCamel && !hasSnake) {
          await sequelize.query(
            `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${snake}" VARCHAR(255);`
          );
          await sequelize.query(
            `UPDATE "${table}" SET "${snake}" = "${camel}" WHERE "${camel}" IS NOT NULL;`
          );
          await sequelize.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${camel}";`);
          console.log(`  🔄 Colonne ${camel} migrée vers ${snake}`);
        } else if (!hasSnake) {
          await sequelize.query(
            `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${snake}" VARCHAR(255);`
          );
          console.log(`  ➕ Colonne ajoutée : ${snake}`);
        }
      }

      console.log('✅ Table users à jour (numero_h_pere, numero_h_mere).');
    } catch (err) {
      if (err.message && err.message.includes('does not exist')) {
        console.log('ℹ️ La table users n’existe pas encore. Elle sera créée au prochain démarrage.');
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

fixUsersTable();
