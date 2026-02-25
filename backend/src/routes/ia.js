import express from 'express';
import IaKnowledge from '../models/IaKnowledge.js';
import IaConversation from '../models/IaConversation.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// =========================================================
// UTILITAIRES
// =========================================================

/** Supprime les accents pour la comparaison (ex: "eleve" -> "eleve") */
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Normalise une chaine pour la comparaison : minuscules + sans accents + espaces normalises */
function normalize(str) {
  return removeAccents(String(str || '').toLowerCase().trim()).replace(/\s+/g, ' ');
}

/** Detecte si le message est une salutation ou une formule de politesse courte */
function isGreetingOrPoliteness(message) {
  const text = normalize(message);
  if (!text || text.length > 80) return false;
  const greetings = [
    'salut', 'salu', 'bonjour', 'bonsoir', 'hello', 'hi', 'coucou', 'hey',
    'bonne journee', 'bonne soiree', 'bonne nuit', 'ca va', 'comment ca va',
    'comment allez-vous', 'comment vas-tu', 'quoi de neuf', 'yo', 'wesh',
    'salam', 'salam aleykoum', 'aleykoum salam',
  ];
  if (greetings.some(function(g) { return text === g || text.startsWith(g + ' ') || text.endsWith(' ' + g); })) return true;
  if (/^(salut|bonjour|hello|coucou|hey|yo)[\s!.,?]*$/i.test(text)) return true;
  if (/^(ca va|comment (tu vas|allez-vous)|quoi de neuf)[\s!.,?]*$/i.test(removeAccents(text))) return true;
  return false;
}

/** Reponse d'accueil quand l'utilisateur dit bonjour / salut */
const GREETING_RESPONSE = [
  'Bonjour ! Je suis votre Professeur IA, specialise en **Francais** et en **Mathematiques** (CP a la Terminale).',
  '',
  'Voici comment je peux vous aider :',
  '',
  '**FRANCAIS :** grammaire, conjugaison, orthographe, figures de style, commentaire, dissertation...',
  '**MATHEMATIQUES :** calculs, equations, geometrie, fractions, probabilites, fonctions, suites...',
  '**GEOMETRIE :** triangles, cercles, volumes, Pythagore, Thales, vecteurs...',
  '',
  '**Exemples de questions :**',
  '- Explique-moi le passe compose',
  '- Comment resoudre 3x + 5 = 20 ?',
  '- Quelle est l\'aire d\'un cercle de rayon 7 ?',
  '- Fais-moi un exercice sur les fractions',
  '',
  'Posez votre question, je suis la ! 💪',
].join('\n');

// =========================================================
// SYSTEME D'EXERCICES INTERACTIFS
// =========================================================

/** PGCD par algorithme d'Euclide */
function pgcd(a, b) {
  var t;
  while (b !== 0) { t = b; b = a % b; a = t; }
  return a;
}

/** Genere un exercice aleatoire selon la categorie demandee */
function generateExercice(type) {
  function exAddition() {
    var a = Math.floor(Math.random() * 900) + 100;
    var b = Math.floor(Math.random() * 900) + 100;
    return { question: 'Calculez : ' + a + ' + ' + b, reponse: a + b, explication: a + ' + ' + b + ' = ' + (a + b) };
  }
  function exSoustraction() {
    var b = Math.floor(Math.random() * 500) + 50;
    var a = b + Math.floor(Math.random() * 500) + 50;
    return { question: 'Calculez : ' + a + ' - ' + b, reponse: a - b, explication: a + ' - ' + b + ' = ' + (a - b) };
  }
  function exMultiplication() {
    var a = Math.floor(Math.random() * 12) + 2;
    var b = Math.floor(Math.random() * 12) + 2;
    return { question: 'Calculez : ' + a + ' x ' + b, reponse: a * b, explication: a + ' x ' + b + ' = ' + (a * b) };
  }
  function exDivision() {
    var b = Math.floor(Math.random() * 9) + 2;
    var q = Math.floor(Math.random() * 12) + 2;
    var a = b * q;
    return { question: 'Calculez : ' + a + ' / ' + b, reponse: q, explication: a + ' / ' + b + ' = ' + q + ' (car ' + b + ' x ' + q + ' = ' + a + ')' };
  }
  function exFraction() {
    var den = [2, 3, 4, 5, 6, 8, 10][Math.floor(Math.random() * 7)];
    var num1 = Math.floor(Math.random() * (den - 1)) + 1;
    var num2 = Math.floor(Math.random() * (den - 1)) + 1;
    var sommeNum = num1 + num2;
    var div = pgcd(sommeNum, den);
    var numSimp = sommeNum / div;
    var denSimp = den / div;
    var repStr = denSimp === 1 ? String(numSimp) : numSimp + '/' + denSimp;
    var explStr = num1 + '/' + den + ' + ' + num2 + '/' + den + ' = ' + sommeNum + '/' + den;
    if (div > 1) { explStr += ' = ' + repStr + ' (simplifie par ' + div + ')'; }
    return { question: 'Calculez : ' + num1 + '/' + den + ' + ' + num2 + '/' + den, reponse: repStr, explication: explStr };
  }
  function exPerimetre() {
    var L = Math.floor(Math.random() * 10) + 3;
    var l = Math.floor(Math.random() * 8) + 2;
    return {
      question: 'Perimetre d\'un rectangle de longueur ' + L + ' cm et largeur ' + l + ' cm ?',
      reponse: 2 * (L + l),
      explication: 'P = 2 x (L + l) = 2 x (' + L + ' + ' + l + ') = 2 x ' + (L + l) + ' = ' + (2 * (L + l)) + ' cm',
    };
  }
  function exPourcentage() {
    var taux = [5, 10, 15, 20, 25, 30, 50][Math.floor(Math.random() * 7)];
    var base = [100, 200, 400, 500, 800, 1000][Math.floor(Math.random() * 6)];
    return {
      question: 'Calculez ' + taux + '% de ' + base,
      reponse: (taux * base) / 100,
      explication: taux + '% de ' + base + ' = (' + taux + ' x ' + base + ') / 100 = ' + ((taux * base) / 100),
    };
  }
  function exPythagore() {
    var triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15]];
    var triple = triples[Math.floor(Math.random() * triples.length)];
    var a = triple[0]; var b = triple[1]; var c = triple[2];
    return {
      question: 'Triangle rectangle avec cotes ' + a + ' cm et ' + b + ' cm. Calculez l\'hypotenuse.',
      reponse: c,
      explication: 'c = racine(' + a + '^2 + ' + b + '^2) = racine(' + (a * a) + ' + ' + (b * b) + ') = racine(' + (a * a + b * b) + ') = ' + c + ' cm',
    };
  }

  var map = {
    addition: exAddition,
    soustraction: exSoustraction,
    multiplication: exMultiplication,
    division: exDivision,
    fraction: exFraction,
    perimetre: exPerimetre,
    pourcentage: exPourcentage,
    pythagore: exPythagore,
  };

  var types = Object.keys(map);
  var choix = (type && map[type]) ? type : types[Math.floor(Math.random() * types.length)];
  var result = map[choix]();
  result.type = choix;
  return result;
}

/** Detecte si l'utilisateur demande un exercice */
function detectExerciceRequest(message) {
  var msgNorm = normalize(message);
  var motsCles = [
    'exercice', 'entraine', 'quiz', 'test', 'devoir',
    'pose moi', 'donne moi', 'fais moi', 'propose', 'pratique',
    'un probleme', 'une question', 'interroge', 'teste moi',
  ];
  if (!motsCles.some(function(m) { return msgNorm.includes(m); })) return null;

  var typeMap = {
    addition: ['addition', 'additionner', 'ajouter', 'somme'],
    soustraction: ['soustraction', 'soustraire', 'difference', 'retirer'],
    multiplication: ['multiplication', 'multiplier', 'produit', 'fois'],
    division: ['division', 'diviser', 'quotient', 'partager'],
    fraction: ['fraction', 'numerateur', 'denominateur'],
    perimetre: ['perimetre', 'contour', 'rectangle'],
    pourcentage: ['pourcentage', 'pourcent', 'taux', 'reduction'],
    pythagore: ['pythagore', 'hypotenuse'],
  };

  var found = null;
  Object.keys(typeMap).forEach(function(t) {
    if (!found && typeMap[t].some(function(m) { return msgNorm.includes(m); })) {
      found = t;
    }
  });
  return found || 'random';
}

/** Formate un exercice pour l'affichage */
function formatExercice(ex) {
  return [
    'EXERCICE',
    '',
    '**' + ex.question + '**',
    '',
    'Prenez le temps de reflechir et calculez votre reponse.',
    'Tapez votre reponse et je la corrigerai !',
    '',
    '(Tapez "reponse: [votre reponse]" pour que je corrige)',
  ].join('\n');
}

/** Verifie si l'utilisateur tente de repondre a un exercice */
function detectReponseExercice(message) {
  var patterns = [
    /^reponse\s*[:=]\s*(.+)/i,
    /^ma reponse\s*[:=]?\s*(.+)/i,
    /^la reponse est\s+(.+)/i,
    /^le resultat est\s+(.+)/i,
    /^c est\s+(\d[\d.,/]*)\s*$/i,
  ];
  var i, match;
  for (i = 0; i < patterns.length; i++) {
    match = normalize(message).match(patterns[i]) || message.match(patterns[i]);
    if (match) return match[1].trim();
  }
  if (/^-?\d+([.,]\d+)?\s*(cm|m|kg|g|%|cm2|m2|km)?\s*$/.test(message.trim())) {
    return message.trim();
  }
  return null;
}

// =========================================================
// MOTEUR DE CALCUL MATHEMATIQUE AVANCE
// =========================================================

/**
 * Resout une equation du 1er degre : ax + b = c  =>  x = (c - b) / a
 */
function tryLinearEquation(message) {
  var eq = message.match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?\s*=\s*([+-]?\d+\.?\d*)/i);
  if (eq) {
    var a = parseFloat(eq[1]) || 1;
    var bStr = eq[2] ? eq[2].replace(/\s/g, '') : '0';
    var b = parseFloat(bStr) || 0;
    var c = parseFloat(eq[3]);
    if (a === 0) return null;
    var x = (c - b) / a;
    if (!Number.isFinite(x)) return null;
    return {
      isSolved: true,
      variable: 'x',
      value: Math.round(x * 10000) / 10000,
      equation: eq[0].trim(),
    };
  }
  return null;
}

/** Calcule sqrt(...) ou racine carree de N */
function trySqrt(message) {
  var sqrtMatch = message.match(/sqrt\s*\(\s*(\d+\.?\d*)\s*\)/i)
    || message.match(/racine\s*(carr[ee]e\s*(de|du)?\s*)(\d+\.?\d*)/i)
    || message.match(/\u221a\s*(\d+\.?\d*)/);

  if (sqrtMatch) {
    var n = parseFloat(sqrtMatch[sqrtMatch.length - 1]);
    if (n < 0) return { isSqrt: true, result: 'pas definie (nombre negatif)', n: n };
    var res = Math.sqrt(n);
    return { isSqrt: true, result: Math.round(res * 10000) / 10000, n: n };
  }
  return null;
}

/** Detecte si le message contient un calcul et retourne le resultat */
function tryMathCalculation(message) {
  if (!message || typeof message !== 'string') return { isCalculation: false };

  var msgLower = message.toLowerCase();

  // Racine carree
  var sqrtRes = trySqrt(message);
  if (sqrtRes) {
    return {
      isCalculation: true,
      result: sqrtRes.result,
      expression: 'racine(' + sqrtRes.n + ')',
      type: 'sqrt',
    };
  }

  // Equation du 1er degre avec x
  if (/\bx\b/.test(msgLower) && /=/.test(message)) {
    var eqRes = tryLinearEquation(message);
    if (eqRes) {
      return {
        isCalculation: true,
        result: eqRes.value,
        expression: eqRes.equation,
        variable: eqRes.variable,
        type: 'equation',
      };
    }
  }

  // Calcul numerique
  var cleaned = message
    .replace(/\u00d7/g, '*')
    .replace(/\u00f7/g, '/')
    .replace(/\^/g, '**')
    .replace(/,/g, '.')
    .replace(/(\d)\s*x\s*(\d)/gi, '$1 * $2')
    .replace(/\s+/g, ' ');

  var exprMatch = cleaned.match(/[\d\s+\-*/().**]+/);
  if (!exprMatch) return { isCalculation: false };

  var expr = exprMatch[0].trim();

  if (!/\d/.test(expr)) return { isCalculation: false };
  if (!/[+\-*/]/.test(expr)) return { isCalculation: false };
  if (!/^[\d\s+\-*/.()]+$/.test(expr)) return { isCalculation: false };

  if (/\/\s*0(?!\d)/.test(expr)) {
    return {
      isCalculation: true,
      result: 'impossible (division par zero)',
      expression: expr.trim(),
      type: 'division-zero',
    };
  }

  try {
    // eslint-disable-next-line no-new-func
    var result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result !== 'number' || !Number.isFinite(result)) return { isCalculation: false };
    return {
      isCalculation: true,
      result: Math.round(result * 1000000) / 1000000,
      expression: expr.trim(),
      type: 'arithmetic',
    };
  } catch (e) {
    return { isCalculation: false };
  }
}

/** Formate la reponse d'un calcul mathematique */
function formatMathAnswer(calc) {
  if (calc.type === 'sqrt') {
    return [
      'Excellente question ! ✨',
      '',
      'Calcul : Racine carree de ' + calc.expression.replace('racine(', '').replace(')', ''),
      '',
      'Resultat : ' + calc.expression + ' = **' + calc.result + '**',
      '',
      'La racine carree d\'un nombre N est le nombre qui, multiplie par lui-meme, donne N.',
      '',
      'Continue comme ca ! 💪',
    ].join('\n');
  }

  if (calc.type === 'equation') {
    return [
      'Excellente question ! ✨',
      '',
      'Equation : ' + calc.expression,
      '',
      'Solution : ' + calc.variable + ' = **' + calc.result + '**',
      '',
      'Pour resoudre une equation du 1er degre, on isole l\'inconnue en faisant passer les termes d\'un cote a l\'autre.',
      '',
      'Continue comme ca ! 💪',
    ].join('\n');
  }

  if (calc.type === 'division-zero') {
    return [
      'Attention ! ⚠️',
      '',
      'Expression : ' + calc.expression,
      '',
      '**La division par zero est impossible** — elle n\'est pas definie en mathematiques.',
      '',
      'On ne peut jamais diviser un nombre par 0. C\'est une regle fondamentale.',
      '',
      'Continue comme ca ! 💪',
    ].join('\n');
  }

  var resultStr = Number.isInteger(calc.result)
    ? String(calc.result)
    : String(calc.result).replace('.', ',');

  return [
    'Excellente question ! ✨',
    '',
    'Calcul : ' + calc.expression,
    '',
    'Resultat : ' + calc.expression + ' = **' + resultStr + '**',
    '',
    'Continue comme ca ! 💪',
  ].join('\n');
}

// =========================================================
// ALGORITHME DE RECHERCHE AMELIORE (scoring pondere)
// =========================================================

/**
 * Recherche la meilleure correspondance dans la base de connaissances.
 * Algorithme pondere :
 *  - +3 si le trigger normalise est contenu dans la question normalisee
 *  - +bonus selon la longueur du trigger (triggers longs = plus specifiques)
 *  - +2 si le trigger est un mot entier (word boundary)
 */
var findBestKnowledgeMatch = async function(question) {
  var qNorm = normalize(question);

  var knowledgeItems = await IaKnowledge.findAll({
    where: { isActive: true },
    order: [['created_at', 'ASC']],
  });

  var bestItem = null;
  var bestScore = 0;
  var i, item, triggers, allTriggers, score, j, raw, t, wordBoundary;

  for (i = 0; i < knowledgeItems.length; i++) {
    item = knowledgeItems[i];
    triggers = Array.isArray(item.triggers) ? item.triggers : [];
    allTriggers = triggers.concat([item.slug.replace(/-/g, ' '), item.title || '']);
    score = 0;

    for (j = 0; j < allTriggers.length; j++) {
      raw = allTriggers[j];
      t = normalize(raw);
      if (!t || t.length < 2) continue;

      if (qNorm.includes(t)) {
        score += 3;
        score += Math.min(t.length / 5, 4);
        wordBoundary = new RegExp('(^|\\s)' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)');
        if (wordBoundary.test(qNorm)) score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  return bestScore >= 3 ? bestItem : null;
};

// =========================================================
// ROUTES
// =========================================================

// POST /api/ia/search
router.post('/search', async function(req, res) {
  try {
    var question = (req.body || {}).question;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, message: 'Le champ "question" est obligatoire.' });
    }
    var bestItem = await findBestKnowledgeMatch(question);
    return res.json({
      success: true,
      match: bestItem ? { id: bestItem.id, slug: bestItem.slug, title: bestItem.title, category: bestItem.category, level: bestItem.level } : null,
      answer: bestItem ? bestItem.answer : null,
    });
  } catch (error) {
    console.error('[IA] Erreur /search:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la recherche.' });
  }
});

// POST /api/ia/chat  — endpoint principal
router.post('/chat', async function(req, res) {
  try {
    var body = req.body || {};
    var message = body.message;
    var lastExercice = body.lastExercice || null;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Le champ "message" est obligatoire.' });
    }

    var answer;

    // 1. Verification de reponse a un exercice precedent
    if (lastExercice) {
      var reponseEleve = detectReponseExercice(message);
      if (reponseEleve !== null) {
        var rep = String(lastExercice.reponse).replace(',', '.').trim();
        var eleveNorm = String(reponseEleve).replace(',', '.').trim();
        var correct = eleveNorm === rep || parseFloat(eleveNorm) === parseFloat(rep);
        if (correct) {
          answer = [
            'BRAVO ! Bonne reponse ! 🎉',
            '',
            lastExercice.question,
            'Reponse correcte : **' + lastExercice.reponse + '**',
            '',
            'Explication : ' + lastExercice.explication,
            '',
            'Excellent travail ! Voulez-vous un autre exercice ?',
            'Tapez "exercice" pour continuer !',
          ].join('\n');
        } else {
          answer = [
            'Pas tout a fait... Essayons ensemble !',
            '',
            lastExercice.question,
            'Votre reponse : ' + reponseEleve,
            'Bonne reponse : **' + lastExercice.reponse + '**',
            '',
            'Explication detaillee :',
            lastExercice.explication,
            '',
            'Ne vous decouragez pas ! La pratique reguliere est la cle du succes.',
            'Tapez "exercice" pour continuer !',
          ].join('\n');
        }
        try {
          await IaConversation.create({ sessionId: null, userMessage: message, botResponse: answer, source: 'professeur_ia_correction' });
        } catch (e) { /* silencieux */ }
        return res.json({ success: true, response: answer, lastExercice: null });
      }
    }

    // 2. Demande d'exercice ?
    var typeExercice = detectExerciceRequest(message);
    if (typeExercice) {
      var ex = generateExercice(typeExercice === 'random' ? null : typeExercice);
      answer = formatExercice(ex);
      try {
        await IaConversation.create({ sessionId: null, userMessage: message, botResponse: answer, source: 'professeur_ia_exercice' });
      } catch (e) { /* silencieux */ }
      return res.json({ success: true, response: answer, exercice: ex });
    }

    // 3. Calcul mathematique ?
    var calc = tryMathCalculation(message);
    if (calc.isCalculation) {
      answer = formatMathAnswer(calc);
    } else if (isGreetingOrPoliteness(message)) {
      // 4. Salutation
      answer = GREETING_RESPONSE;
    } else {
      // 5. Recherche dans la base de connaissances
      var bestItem = await findBestKnowledgeMatch(message);
      if (bestItem) {
        answer = bestItem.answer;
        var categoriesExercices = ['mathematiques', 'geometrie', 'probabilites', 'statistiques'];
        if (categoriesExercices.includes(bestItem.category)) {
          answer += '\n\n---\nEnvie de pratiquer ? Tapez **"exercice"** pour tester vos connaissances sur ce sujet !';
        }
      } else {
        // 6. Message par defaut
        answer = [
          'Je suis votre Professeur IA, specialise en **Francais** et **Mathematiques** (du CP a la Terminale).',
          '',
          'Je n\'ai pas trouve de reponse precise. Essayez de reformuler avec des mots-cles :',
          '',
          '**Francais :** conjugaison passe compose, figures de style, accord participe passe...',
          '**Maths :** equation second degre, theoreme Pythagore, fractions, probabilites...',
          '**Geometrie :** aire triangle, volume cylindre, theoreme Thales...',
          '',
          'Ou tapez **"exercice"** pour vous entrainer sur un calcul aleatoire !',
        ].join('\n');
      }
    }

    // Sauvegarde de la conversation
    try {
      await IaConversation.create({
        sessionId: null,
        userMessage: message,
        botResponse: answer,
        source: 'professeur_ia_backend',
      });
    } catch (e) {
      console.error('[IA] Erreur sauvegarde conversation:', e);
    }

    return res.json({ success: true, response: answer });
  } catch (error) {
    console.error('[IA] Erreur /chat:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors du traitement de la question.' });
  }
});

// POST /api/ia/log
router.post('/log', async function(req, res) {
  try {
    var body = req.body || {};
    var sessionId = body.sessionId;
    var question = body.question;
    var response = body.response;
    var source = body.source;
    if (!question || !response) {
      return res.status(400).json({ success: false, message: 'Les champs "question" et "response" sont obligatoires.' });
    }
    await IaConversation.create({
      sessionId: sessionId || null,
      userMessage: question,
      botResponse: response,
      source: source || 'professeur_ia',
    });
    return res.json({ success: true, message: 'Conversation IA enregistree.' });
  } catch (error) {
    console.error('[IA] Erreur /log:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'enregistrement.' });
  }
});

// GET /api/ia/knowledge (admin)
router.get('/knowledge', authenticate, requireAdmin, async function(_req, res) {
  try {
    var items = await IaKnowledge.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, items: items });
  } catch (error) {
    console.error('[IA] Erreur /knowledge GET:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// POST /api/ia/knowledge (admin)
router.post('/knowledge', authenticate, requireAdmin, async function(req, res) {
  try {
    var body = req.body || {};
    var slug = body.slug;
    var title = body.title;
    var category = body.category;
    var level = body.level;
    var triggers = body.triggers;
    var answer = body.answer;
    var isActive = body.isActive;
    if (!slug || !title || !answer) {
      return res.status(400).json({ success: false, message: 'Les champs "slug", "title" et "answer" sont obligatoires.' });
    }
    var normalizedTriggers = Array.isArray(triggers)
      ? triggers.map(function(t) { return String(t || '').trim(); }).filter(Boolean)
      : [];
    var findResult = await IaKnowledge.findOrCreate({
      where: { slug: slug },
      defaults: {
        title: title,
        category: category || null,
        level: level || null,
        triggers: normalizedTriggers,
        answer: answer,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });
    var item = findResult[0];
    var created = findResult[1];
    if (!created) {
      item.title = title;
      item.category = category || null;
      item.level = level || null;
      item.triggers = normalizedTriggers;
      item.answer = answer;
      if (typeof isActive === 'boolean') item.isActive = isActive;
      await item.save();
    }
    res.json({ success: true, created: created, item: item });
  } catch (error) {
    console.error('[IA] Erreur /knowledge POST:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

export default router;
