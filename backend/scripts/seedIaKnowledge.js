/**
 * Script de seed pour IaKnowledge — Professeur IA EXTRAORDINAIRE
 * Couvre : Français (CP → Terminale) + Mathématiques (CP → Terminale) + Géométrie + Conjugaison + Littérature + Analyse avancée
 * Total : ~209 leçons
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
import { LECONS_GEOMETRIE } from './seedPart4_geometrie.js';
import { LECONS_CONJUGAISON_COMPLETE } from './seedPart5_conjugaison_complete.js';
import { LECONS_MATHS_PRIMAIRE } from './seedPart6_primaire_maths.js';
import { LECONS_LITTERATURE } from './seedPart7_litterature.js';
import { LECONS_ANALYSE_AVANCEE } from './seedPart8_analyse_avancee.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

// ── Fusion de toutes les leçons ──────────────────────────────────────────────
const TOUTES_LES_LECONS = [
  ...LECONS_FR_1,
  ...LECONS_FR_2,
  ...LECONS_MATHS,
  ...LECONS_GEOMETRIE,
  ...LECONS_CONJUGAISON_COMPLETE,
  ...LECONS_MATHS_PRIMAIRE,
  ...LECONS_LITTERATURE,
  ...LECONS_ANALYSE_AVANCEE,
];

async function seed() {
  console.log('');
  console.log('███████████████████████████████████████████████████████');
  console.log('  PROFESSEUR IA EXTRAORDINAIRE — Seed complet          ');
  console.log('███████████████████████████████████████████████████████');
  console.log('');
  console.log(`  Français Part 1      : ${LECONS_FR_1.length} leçons`);
  console.log(`  Français Part 2      : ${LECONS_FR_2.length} leçons`);
  console.log(`  Mathématiques base   : ${LECONS_MATHS.length} leçons`);
  console.log(`  Géométrie complète   : ${LECONS_GEOMETRIE.length} leçons`);
  console.log(`  Conjugaison totale   : ${LECONS_CONJUGAISON_COMPLETE.length} leçons`);
  console.log(`  Maths primaire       : ${LECONS_MATHS_PRIMAIRE.length} leçons`);
  console.log(`  Littérature & style  : ${LECONS_LITTERATURE.length} leçons`);
  console.log(`  Analyse avancée      : ${LECONS_ANALYSE_AVANCEE.length} leçons`);
  console.log('  ─────────────────────────────────────────────────────');
  console.log(`  TOTAL                : ${TOUTES_LES_LECONS.length} leçons`);
  console.log('');

  try {
    await connectDB();
    console.log('  ✅ Connexion DB OK\n');

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
          console.log(`  ↻ Màj     : [${lecon.category}] ${lecon.slug}`);
        }
      } catch (err) {
        nbErreurs++;
        console.error(`  ✗ Erreur  : ${lecon.slug} →`, err.message);
      }
    }

    console.log('');
    console.log('███████████████████████████████████████████████████████');
    console.log('  SEED TERMINÉ AVEC SUCCÈS !');
    console.log(`  ✓ Créées       : ${nbCrees}`);
    console.log(`  ↻ Mises à jour : ${nbMisAJour}`);
    console.log(`  ✗ Erreurs      : ${nbErreurs}`);
    console.log('███████████████████████████████████████████████████████');
    console.log('');
    console.log('  Le Professeur IA maîtrise maintenant :');
    console.log('');
    console.log('  ✅ FRANÇAIS — CP → Terminale');
    console.log('     • Grammaire, Orthographe, Vocabulaire, Homophones');
    console.log('     • Conjugaison TOTALE : tous les temps et modes');
    console.log('       Présent, Imparfait, Passé simple, Passé composé');
    console.log('       Plus-que-parfait, Passé antérieur, Futur simple');
    console.log('       Futur antérieur, Conditionnel (présent + passé)');
    console.log('       Subjonctif (présent + passé + emplois)');
    console.log('       Participe présent, Gérondif, Infinitif passé');
    console.log('       Voix passive, Concordance des temps, Discours indirect');
    console.log('       Verbes irréguliers, Verbes pronominaux');
    console.log('     • Figures de style (18 figures avec effets)');
    console.log('     • Genres et registres littéraires complets');
    console.log('     • Mouvements littéraires (Humanisme → Surréalisme)');
    console.log('     • Auteurs : Hugo, Baudelaire, Molière, Racine, Zola...');
    console.log('     • Versification : alexandrin, rime, sonnet...');
    console.log('     • Point de vue, focalisation, schéma narratif');
    console.log('     • Argumentation : types d\'arguments, connecteurs');
    console.log('     • Méthodes EAF : commentaire, dissertation, analyse linéaire');
    console.log('     • Grand Oral : structure, conseils, exemples');
    console.log('');
    console.log('  ✅ MATHÉMATIQUES — CP → Terminale STPL');
    console.log('     • Numération, tables, division euclidienne');
    console.log('     • Fractions, Décimaux, Pourcentages');
    console.log('     • Proportionnalité, Règle de trois, Vitesse-Distance-Temps');
    console.log('     • Multiples, Diviseurs, Nombres premiers, PGCD, PPCM');
    console.log('     • Puissances, Racines, Notation scientifique');
    console.log('     • Calcul mental, Méthode résolution de problèmes, Échelles');
    console.log('     • Équations 1er et 2nd degré (discriminant, Viète)');
    console.log('     • Inéquations, Systèmes d\'équations');
    console.log('     • Fonctions de référence + étude complète de fonction');
    console.log('     • Dérivées : toutes les règles + exemples');
    console.log('     • Limites, asymptotes, formes indéterminées');
    console.log('     • Intégrales, primitives, valeur moyenne, aires');
    console.log('     • Équations différentielles y\'=ay et y\'=ay+b');
    console.log('     • Logarithme ln(x) et Exponentielle e^x');
    console.log('     • Suites arithmétiques et géométriques + récurrence');
    console.log('     • Trigonométrie avancée : formules d\'addition, angle double');
    console.log('     • Loi binomiale B(n,p) : formule, E(X), V(X)');
    console.log('     • Loi normale N(μ,σ) : standardisation, intervalle de confiance');
    console.log('     • Matrices : opérations, déterminant, inverse, AX=B');
    console.log('     • Statistiques : variance, écart-type, régression linéaire');
    console.log('     • Probabilités conditionnelles, Bayes, indépendance');
    console.log('     • Nombres complexes : forme algébrique, module, argument');
    console.log('');
    console.log('  ✅ GÉOMÉTRIE — Primaire → Lycée');
    console.log('     • Figures planes : triangle, rectangle, carré, cercle...');
    console.log('     • Solides : pavé, cube, cylindre, cône, sphère, pyramide');
    console.log('     • Pythagore et Thalès (énoncé + réciproque)');
    console.log('     • Trigonométrie SOHCAHTOA + cercle trigonométrique');
    console.log('     • Angles, symétries, transformations (translation, rotation)');
    console.log('     • Vecteurs, Repère cartésien, Produit scalaire');
    console.log('     • Équation de droite, droites parallèles/perpendiculaires');
    console.log('     • Géométrie dans l\'espace : plans, droites, vecteur normal');
    console.log('     • Unités de mesure et conversions, Échelles');
    console.log('');
    console.log('  🤖 Le Professeur IA est prêt à fonctionner à 100% EXTRAORDINAIRE !');
    console.log(`  📚 ${TOUTES_LES_LECONS.length} leçons couvrant CP → Terminale en Français, Maths et Géométrie`);
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur critique :', err);
    process.exit(1);
  }
}

seed();
