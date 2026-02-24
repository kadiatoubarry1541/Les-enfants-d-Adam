/**
 * Script de seed pour IaKnowledge — Professeur IA complet
 * Couvre : Français (CP → Terminale) + Mathématiques (CP → Terminale)
 * Total : ~107 leçons
 *
 * Exécuter depuis le dossier backend :
 *   node scripts/seedIaKnowledge.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../src/config/database.js';
import IaKnowledge from '../src/models/IaKnowledge.js';

import { LECONS_FR_1 } from './seedPart1_francais.js';
import { LECONS_FR_2 } from './seedPart2_francais.js';
import { LECONS_MATHS } from './seedPart3_maths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

// ── Fusion de toutes les leçons ──────────────────────────────────────────────
const TOUTES_LES_LECONS = [...LECONS_FR_1, ...LECONS_FR_2, ...LECONS_MATHS];

async function seed() {
  console.log('🌱 Démarrage du seed IaKnowledge...');
  console.log(`   → ${LECONS_FR_1.length} leçons Français partie 1`);
  console.log(`   → ${LECONS_FR_2.length} leçons Français partie 2`);
  console.log(`   → ${LECONS_MATHS.length} leçons Mathématiques`);
  console.log(`   → TOTAL : ${TOUTES_LES_LECONS.length} leçons\n`);

  try {
    await connectDB();
    console.log('✅ Connexion DB OK\n');

    let nbCrees = 0;
    let nbMisAJour = 0;
    let nbErreurs = 0;

    for (const lecon of TOUTES_LES_LECONS) {
      try {
        const [item, created] = await IaKnowledge.findOrCreate({
          where: { slug: lecon.slug },
          defaults: {
            ...lecon,
            triggers: JSON.stringify(lecon.triggers),
            isActive: true,
          },
        });

        if (created) {
          nbCrees++;
          console.log(`  ✓ Créé    : [${lecon.category}] ${lecon.slug}`);
        } else {
          await item.update({
            ...lecon,
            triggers: JSON.stringify(lecon.triggers),
            isActive: true,
          });
          nbMisAJour++;
          console.log(`  ↻ Mis à jour : [${lecon.category}] ${lecon.slug}`);
        }
      } catch (err) {
        nbErreurs++;
        console.error(`  ✗ Erreur sur ${lecon.slug} :`, err.message);
      }
    }

    console.log('\n════════════════════════════════════════════');
    console.log('✅ Seed IaKnowledge terminé !');
    console.log(`   Créées     : ${nbCrees}`);
    console.log(`   Mises à jour : ${nbMisAJour}`);
    console.log(`   Erreurs    : ${nbErreurs}`);
    console.log('════════════════════════════════════════════');
    console.log('\n📚 Le Professeur IA maîtrise maintenant :');
    console.log('   FRANÇAIS   — CP → Terminale');
    console.log('     • Grammaire, Conjugaison, Orthographe, Vocabulaire');
    console.log('     • Figures de style, Genres littéraires, Dissertation');
    console.log('     • Commentaire composé, Discours direct/indirect');
    console.log('   MATHÉMATIQUES — CP → Terminale');
    console.log('     • Arithmétique, Fractions, Puissances, Racines');
    console.log('     • Algèbre, Équations, Inéquations, Systèmes');
    console.log('     • Fonctions, Dérivation, Intégrales, Logarithme');
    console.log('     • Suites, Géométrie, Statistiques, Probabilités');
    console.log('\n🤖 Le Professeur IA est prêt à fonctionner à 100% !\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur critique :', err);
    process.exit(1);
  }
}

seed();
