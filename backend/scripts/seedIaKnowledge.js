/**
 * Script de seed pour IaKnowledge - Leçons de français du Professeur IA
 * Exécuter: node scripts/seedIaKnowledge.js (depuis le dossier backend)
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { sequelize } from '../src/config/database.js';
import IaKnowledge from '../src/models/IaKnowledge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const LEÇONS = [
  {
    slug: 'alphabet',
    title: "L'alphabet français",
    category: 'bases',
    level: 'debutant',
    triggers: ['alphabet', 'lettres', 'lettre', 'a b c', 'abc', 'lettres françaises'],
    answer: `Excellente question ! ✨

L'alphabet français compte 26 lettres, comme l'alphabet anglais.

Il y a 6 voyelles : A, E, I, O, U, Y
Et 20 consonnes : B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Z

En français, on prononce certaines lettres différemment. Par exemple :
- "E" se prononce souvent "eu" (comme dans "le")
- "U" se prononce "u" (comme dans "lune")
- "R" se prononce avec la gorge (c'est le "r" roulé français)

Continue comme ça ! 💪`,
  },
  {
    slug: 'salutations',
    title: 'Les salutations en français',
    category: 'vocabulaire',
    level: 'debutant',
    triggers: ['bonjour', 'salut', 'salutation', 'salutations', 'comment dire bonjour', 'bonsoir', 'au revoir'],
    answer: `Excellente question ! ✨

En français, on se salue de plusieurs façons :

Bonjour = le jour (matin et après-midi)
Bonsoir = le soir
Salut = informel, entre amis
Au revoir = pour partir
À bientôt = on se reverra

Pour demander "comment vas-tu ?" :
- Comment allez-vous ? (formel)
- Comment vas-tu ? (familier)
- Ça va ? (très informel)

Réponses possibles :
- Très bien, merci !
- Ça va bien.
- Pas mal.

Continue comme ça ! 💪`,
  },
  {
    slug: 'verbe-etre',
    title: 'Le verbe ÊTRE au présent',
    category: 'conjugaison',
    level: 'debutant',
    triggers: ['être', 'etre', 'verbe être', 'conjugaison être', 'je suis', 'tu es', 'il est'],
    answer: `Excellente question ! ✨

Le verbe ÊTRE (to be en anglais) se conjugue au présent ainsi :

Je suis
Tu es
Il / Elle / On est
Nous sommes
Vous êtes
Ils / Elles sont

Exemples :
- Je suis étudiant. (I am a student)
- Tu es gentil. (You are kind)
- Il est professeur. (He is a teacher)

C'est un verbe très important en français ! On l'utilise pour se présenter, décrire, etc.

Continue comme ça ! 💪`,
  },
  {
    slug: 'verbe-avoir',
    title: 'Le verbe AVOIR au présent',
    category: 'conjugaison',
    level: 'debutant',
    triggers: ['avoir', 'verbe avoir', 'conjugaison avoir', 'j\'ai', "j'ai", 'tu as', 'il a'],
    answer: `Excellente question ! ✨

Le verbe AVOIR (to have en anglais) se conjugue au présent :

J'ai
Tu as
Il / Elle / On a
Nous avons
Vous avez
Ils / Elles ont

Exemples :
- J'ai un livre. (I have a book)
- Tu as faim ? (Are you hungry?)
- Il a 20 ans. (He is 20 years old)

Avoir est aussi utilisé pour former le passé composé : J'ai mangé, Tu as parlé...

Continue comme ça ! 💪`,
  },
  {
    slug: 'articles',
    title: 'Les articles en français',
    category: 'grammaire',
    level: 'debutant',
    triggers: ['article', 'articles', 'le la les', 'un une des', 'défini', 'indéfini'],
    answer: `Excellente question ! ✨

En français, il y a des articles définis et indéfinis :

ARTICLES DÉFINIS (the) :
- Le (masculin) : le livre
- La (féminin) : la table
- L' (devant voyelle) : l'école
- Les (pluriel) : les enfants

ARTICLES INDÉFINIS (a/an/some) :
- Un (masculin) : un stylo
- Une (féminin) : une chaise
- Des (pluriel) : des crayons

On utilise LE/LA/LES quand on parle de quelque chose de précis.
On utilise UN/UNE/DES quand on parle de quelque chose en général.

Continue comme ça ! 💪`,
  },
  {
    slug: 'present',
    title: 'Le présent de l\'indicatif',
    category: 'conjugaison',
    level: 'debutant',
    triggers: ['présent', 'present', 'temps présent', 'conjuguer présent', 'verbe présent'],
    answer: `Excellente question ! ✨

Le présent décrit une action qui se passe maintenant, ou une habitude.

Pour les verbes en -ER (parler, manger, aimer) :
Je parl-e
Tu parl-es
Il/Elle parl-e
Nous parl-ons
Vous parl-ez
Ils/Elles parl-ent

Pour les verbes en -IR (finir) :
Je finis, Tu finis, Il finit, Nous finissons, Vous finissez, Ils finissent

Pour les verbes en -RE (vendre) :
Je vends, Tu vends, Il vend, Nous vendons, Vous vendez, Ils vendent

Les verbes irréguliers (être, avoir, aller, faire...) ont leur propre conjugaison.

Continue comme ça ! 💪`,
  },
  {
    slug: 'accords',
    title: 'Les accords en français',
    category: 'grammaire',
    level: 'intermediaire',
    triggers: ['accord', 'accords', 'accorder', 'accord des', 'pluriel', 'féminin', 'masculin'],
    answer: `Excellente question ! ✨

En français, les adjectifs et les participes passés s'accordent en genre et en nombre.

Avec le sujet :
- La fille est contente. (féminin)
- Le garçon est content. (masculin)
- Les filles sont contentes. (féminin pluriel)

Avec l'auxiliaire AVOIR, le participe passé ne s'accorde PAS avec le sujet :
- J'ai mangé une pomme. (mangé invariable)

Avec l'auxiliaire ÊTRE, le participe passé s'accorde avec le sujet :
- Elle est partie. (partie = féminin)
- Ils sont partis. (partis = masculin pluriel)

Continue comme ça ! 💪`,
  },
  {
    slug: 'nombres',
    title: 'Les nombres en français',
    category: 'vocabulaire',
    level: 'debutant',
    triggers: ['nombre', 'nombres', 'compter', 'un deux trois', 'chiffre', 'chiffres'],
    answer: `Excellente question ! ✨

Les nombres de base :
0 zéro, 1 un/une, 2 deux, 3 trois, 4 quatre, 5 cinq
6 six, 7 sept, 8 huit, 9 neuf, 10 dix

11 onze, 12 douze, 13 treize, 14 quatorze, 15 quinze
16 seize, 17 dix-sept, 18 dix-huit, 19 dix-neuf
20 vingt, 30 trente, 40 quarante, 50 cinquante
60 soixante, 70 soixante-dix, 80 quatre-vingts, 90 quatre-vingt-dix, 100 cent

Exemples : 21 = vingt et un, 75 = soixante-quinze

Continue comme ça ! 💪`,
  },
  // ——— Passé composé ———
  {
    slug: 'passe-compose',
    title: 'Le passé composé',
    category: 'conjugaison',
    level: 'debutant',
    triggers: ['passé composé', 'passe compose', 'j\'ai mangé', 'conjugaison passé', 'temps passé', 'verbe au passé'],
    answer: `Excellente question ! ✨

Le passé composé sert à parler d’une action terminée dans le passé.

**Formation :** auxiliaire (avoir ou être) + participe passé

**Avec AVOIR (la plupart des verbes) :**
J’ai mangé, Tu as parlé, Il a fini, Nous avons vu, Vous avez pris, Ils ont dit

**Avec ÊTRE (verbes de mouvement / changement d’état) :**
Je suis parti(e), Tu es venu(e), Il est allé, Nous sommes arrivé(e)s, Vous êtes entré(e)s, Ils sont sortis

**Accord :** avec être, le participe passé s’accorde avec le sujet (Elle est partie, Ils sont partis).

Continue comme ça ! 💪`,
  },
  // ——— Futur ———
  {
    slug: 'futur-simple',
    title: 'Le futur simple',
    category: 'conjugaison',
    level: 'debutant',
    triggers: ['futur', 'futur simple', 'je mangerai', 'conjugaison futur', 'verbe au futur'],
    answer: `Excellente question ! ✨

Le futur simple exprime une action à venir.

**Verbes en -ER (ex. manger) :** je mangerai, tu mangeras, il mangera, nous mangerons, vous mangerez, ils mangeront

**Verbes en -IR (ex. finir) :** je finirai, tu finiras, il finira, nous finirons, vous finirez, ils finiront

**Verbes irréguliers :**
être → je serai, tu seras, il sera…
avoir → j’aurai, tu auras…
aller → j’irai, tu iras…
faire → je ferai, tu feras…

Continue comme ça ! 💪`,
  },
  // ——— Pronoms ———
  {
    slug: 'pronoms-personnels',
    title: 'Les pronoms personnels',
    category: 'grammaire',
    level: 'debutant',
    triggers: ['pronoms', 'pronoms personnels', 'je tu il', 'sujet pronom', 'remplacer le sujet'],
    answer: `Excellente question ! ✨

Les pronoms personnels remplacent le nom (la personne ou la chose) qui fait l’action.

**Sujet :** Je, Tu, Il, Elle, On, Nous, Vous, Ils, Elles

**Exemples :**
- Marie mange → Elle mange
- Les enfants jouent → Ils jouent
- Toi et moi partons → Nous partons

**Complément (après le verbe) :** me, te, le, la, lui, nous, vous, les, leur

Continue comme ça ! 💪`,
  },
  // ——— Négation ———
  {
    slug: 'negation',
    title: 'La négation en français',
    category: 'grammaire',
    level: 'debutant',
    triggers: ['négation', 'negation', 'ne pas', 'ne...pas', 'pas de', 'jamais', 'rien'],
    answer: `Excellente question ! ✨

Pour dire "non", on utilise le plus souvent **ne … pas** autour du verbe.

**Forme :** sujet + ne + verbe + pas
- Je ne mange pas. (I don’t eat.)
- Tu n’es pas content. (You are not happy.)
- Il ne va pas à l’école. (He doesn’t go to school.)

**Autres négations :**
- ne … jamais = never
- ne … rien = nothing
- ne … plus = no longer
- ne … personne = nobody

Continue comme ça ! 💪`,
  },
  // ——— Vocabulaire famille ———
  {
    slug: 'vocab-famille',
    title: 'Vocabulaire de la famille',
    category: 'vocabulaire',
    level: 'debutant',
    triggers: ['famille', 'mère', 'père', 'frère', 'sœur', 'parents', 'grand-père', 'grand-mère', 'oncle', 'tante'],
    answer: `Excellente question ! ✨

**Famille proche :**
le père, la mère, le frère, la sœur, le fils, la fille, les parents, les enfants

**Grands-parents :** le grand-père, la grand-mère, les grands-parents

**Élargie :** l’oncle, la tante, le cousin, la cousine, le neveu, la nièce

**Exemples :** "Mon père s’appelle…", "J’ai deux sœurs.", "Mes grands-parents habitent à la campagne."

Continue comme ça ! 💪`,
  },
  // ——— Jours et mois ———
  {
    slug: 'jours-mois',
    title: 'Les jours et les mois',
    category: 'vocabulaire',
    level: 'debutant',
    triggers: ['jours', 'mois', 'lundi', 'mardi', 'janvier', 'février', 'date', 'quel jour', 'quel mois'],
    answer: `Excellente question ! ✨

**Les jours de la semaine :** lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche

**Les mois :** janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre

**Exemples :** "Aujourd’hui c’est lundi.", "Mon anniversaire est en mars.", "Nous sommes le 15 janvier."

Continue comme ça ! 💪`,
  },
  // ——— Homophones ———
  {
    slug: 'homophones-a-a',
    title: 'Homophones : a / à',
    category: 'orthographe',
    level: 'intermediaire',
    triggers: ['a ou à', 'a et à', 'différence a à', 'accent sur a', 'il a ou il à'],
    answer: `Excellente question ! ✨

**a** (sans accent) = verbe avoir (il/elle a)
- Il a faim. Elle a raison.

**à** (avec accent) = préposition (lieu, temps, but)
- Je vais à l’école. Il travaille à Paris. C’est à toi.

**Astuce :** Si tu peux remplacer par "avait", c’est le verbe → **a**. Sinon c’est la préposition → **à**.

Continue comme ça ! 💪`,
  },
  {
    slug: 'homophones-ou-ou',
    title: 'Homophones : ou / où',
    category: 'orthographe',
    level: 'intermediaire',
    triggers: ['ou ou où', 'ou et où', 'accent sur ou', 'où avec accent'],
    answer: `Excellente question ! ✨

**ou** (sans accent) = conjonction, choix (or / either… or)
- Tu veux du thé ou du café ? Reste ou pars.

**où** (avec accent) = lieu ou temps (where / when)
- Où habites-tu ? La ville où je suis né. Le jour où nous nous sommes rencontrés.

**Astuce :** "ou" = choix entre deux choses. "où" = un lieu ou un moment.

Continue comme ça ! 💪`,
  },
  // ——— MATHÉMATIQUES ———
  {
    slug: 'math-addition',
    title: 'L\'addition',
    category: 'mathematiques',
    level: 'debutant',
    triggers: ['addition', 'additionner', 'plus', 'somme', 'calcul addition', 'ajouter'],
    answer: `Excellente question ! ✨

L’**addition** consiste à ajouter des nombres pour obtenir une **somme**.

**Symbole :** + (plus)

**Exemple :** 5 + 3 = 8
- 5 et 3 sont les **termes**
- 8 est la **somme** (ou le résultat)

**Propriétés :**
- 3 + 5 = 5 + 3 (l’ordre ne change pas le résultat : commutativité)
- (2 + 4) + 1 = 2 + (4 + 1) (associativité)

**En phrase :** "J’ai 5 stylos, j’en achète 3. J’ai 5 + 3 = 8 stylos."

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-soustraction',
    title: 'La soustraction',
    category: 'mathematiques',
    level: 'debutant',
    triggers: ['soustraction', 'soustraire', 'moins', 'différence', 'calcul soustraction', 'retirer'],
    answer: `Excellente question ! ✨

La **soustraction** consiste à retirer une quantité d’une autre. Le résultat s’appelle la **différence**.

**Symbole :** − (moins)

**Exemple :** 10 − 4 = 6
- 10 est le premier nombre (celui dont on part)
- 4 est ce qu’on enlève
- 6 est la **différence**

**Attention :** 10 − 4 = 6 mais 4 − 10 n’est pas pareil (en nombres entiers naturels, le premier doit être plus grand).

**En phrase :** "J’avais 10 billes, j’en donne 4. Il me reste 10 − 4 = 6 billes."

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-multiplication',
    title: 'La multiplication',
    category: 'mathematiques',
    level: 'debutant',
    triggers: ['multiplication', 'multiplier', 'fois', 'produit', 'table de multiplication', 'x fois'],
    answer: `Excellente question ! ✨

La **multiplication** est une addition répétée. Le résultat s’appelle le **produit**.

**Symboles :** × ou * (fois)

**Exemple :** 4 × 3 = 4 + 4 + 4 = 12
- 4 et 3 sont les **facteurs**
- 12 est le **produit**

**Propriétés :**
- 4 × 3 = 3 × 4 (commutativité)
- Table de 2 : 2, 4, 6, 8, 10… ; table de 5 : 5, 10, 15, 20…

**En phrase :** "3 paquets de 6 œufs, ça fait 3 × 6 = 18 œufs."

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-division',
    title: 'La division',
    category: 'mathematiques',
    level: 'debutant',
    triggers: ['division', 'diviser', 'partager', 'quotient', 'reste', 'divise par'],
    answer: `Excellente question ! ✨

La **division** sert à partager en parts égales. Le résultat est le **quotient** ; ce qui reste éventuellement est le **reste**.

**Symbole :** ÷ ou /

**Exemple :** 17 ÷ 5 = 3 reste 2
- 17 = dividende, 5 = diviseur, 3 = quotient, 2 = reste
- Vérification : 5 × 3 + 2 = 17

**Division exacte :** 20 ÷ 4 = 5 (reste 0)

**En phrase :** "20 bonbons partagés entre 4 enfants : 20 ÷ 4 = 5 bonbons par enfant."

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-priorites',
    title: 'Priorités des opérations',
    category: 'mathematiques',
    level: 'intermediaire',
    triggers: ['priorité', 'ordre des opérations', 'calcul avec plusieurs opérations', 'parenthèses multiplication'],
    answer: `Excellente question ! ✨

Quand une expression contient plusieurs opérations, on suit un **ordre précis**.

**Règle :**
1. Les **parenthèses** en premier : ( )
2. Les **multiplications** et **divisions** (de gauche à droite)
3. Les **additions** et **soustractions** (de gauche à droite)

**Exemple :** 2 + 3 × 4 = 2 + 12 = 14 (on fait 3 × 4 avant le +)
**Exemple :** (2 + 3) × 4 = 5 × 4 = 20 (les parenthèses d’abord)

**Résumé :** Parenthèses → × et ÷ → + et −

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-decimaux',
    title: 'Nombres décimaux',
    category: 'mathematiques',
    level: 'debutant',
    triggers: ['décimal', 'decimaux', 'virgule', 'nombre à virgule', 'partie décimale'],
    answer: `Excellente question ! ✨

Un **nombre décimal** a une **partie entière** et une **partie décimale** séparées par une **virgule** (en français).

**Exemple :** 12,5
- 12 = partie entière
- 5 = partie décimale (5 dixièmes) → 12,5 = 12 + 5/10

**Lecture :** 3,14 = "trois virgule quatorze" (ou "trois et quatorze centièmes").

**Opérations :** On aligne les virgules pour additionner ou soustraire. Pour multiplier/diviser, on applique les règles des décimaux.

Continue comme ça ! 💪`,
  },
  // ——— Impératif ———
  {
    slug: 'imperatif',
    title: 'L\'impératif',
    category: 'conjugaison',
    level: 'debutant',
    triggers: ['impératif', 'imperatif', 'ordre', 'consigne', 'mangez', 'parle', 'allez'],
    answer: `Excellente question ! ✨

L’**impératif** sert à donner un ordre, un conseil ou une consigne. On n’utilise que **tu**, **nous** et **vous**.

**Verbes en -ER (ex. manger) :** Mange ! (tu), Mangeons ! (nous), Mangez ! (vous)
**Verbe aller :** Va ! Allez ! (pas de "s" à "va")
**Verbe être :** Sois ! Soyons ! Soyez !

**Négation :** Ne mange pas ! Ne partez pas !

**Exemples :** "Parle plus fort.", "Fermez la porte.", "Soyons prudents."

Continue comme ça ! 💪`,
  },
  // ——— Poser une question ———
  {
    slug: 'phrase-interrogative',
    title: 'La phrase interrogative',
    category: 'grammaire',
    level: 'debutant',
    triggers: ['question', 'interrogatif', 'comment poser une question', 'est-ce que', 'qu\'est-ce que'],
    answer: `Excellente question ! ✨

Pour poser une question en français, on peut :

**1. Inverser le sujet et le verbe :** Viens-tu ? Parle-t-il ?
**2. Utiliser "est-ce que" :** Est-ce que tu viens ? Est-ce qu’il parle ?
**3. Utiliser un mot interrogatif en tête :** Qui ? Quoi ? Où ? Quand ? Comment ? Pourquoi ? Combien ?
   - Qui est là ? Où vas-tu ? Comment ça va ? Combien ça coûte ?

**Qu’est-ce que** = quoi (objet) : Qu’est-ce que tu manges ?

Continue comme ça ! 💪`,
  },
];

async function seed() {
  console.log('🌱 Démarrage du seed IaKnowledge...');
  try {
    await connectDB();
    console.log('✅ Connexion DB OK');

    for (const lecon of LEÇONS) {
      const [item, created] = await IaKnowledge.findOrCreate({
        where: { slug: lecon.slug },
        defaults: lecon,
      });
      if (created) {
        console.log(`  ✓ Créé: ${lecon.slug}`);
      } else {
        await item.update(lecon);
        console.log(`  ↻ Mis à jour: ${lecon.slug}`);
      }
    }

    console.log('\n✅ Seed IaKnowledge terminé avec succès !');
    console.log('   Le Professeur IA peut maintenant répondre en détail sur :');
    console.log('   Français : alphabet, salutations, verbes (être, avoir, présent, passé composé, futur, impératif), articles, accords, pronoms, négation, questions, vocabulaire (famille, jours, mois), homophones (a/à, ou/où).');
    console.log('   Mathématiques : addition, soustraction, multiplication, division, priorités des opérations, nombres décimaux.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

seed();
