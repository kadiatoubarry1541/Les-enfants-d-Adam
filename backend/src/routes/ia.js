import express from 'express';
import IaKnowledge from '../models/IaKnowledge.js';
import IaConversation from '../models/IaConversation.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// =========================================================
// UTILITAIRES
// =========================================================

/** Supprime les accents pour la comparaison (ex: "élève" → "eleve") */
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Normalise une chaîne pour la comparaison : minuscules + sans accents + espaces normalisés */
function normalize(str) {
  return removeAccents(String(str || '').toLowerCase().trim()).replace(/\s+/g, ' ');
}

/** Détecte si le message est une salutation ou une formule de politesse courte */
function isGreetingOrPoliteness(message) {
  const text = normalize(message);
  if (!text || text.length > 80) return false;
  const greetings = [
    'salut', 'salu', 'bonjour', 'bonsoir', 'hello', 'hi', 'coucou', 'hey',
    'bonne journee', 'bonne soirée', 'bonne nuit', 'ca va', 'comment ca va',
    'comment allez-vous', 'comment vas-tu', 'quoi de neuf', 'yo', 'wesh',
    'salam', 'salam aleykoum', 'aleykoum salam'
  ];
  if (greetings.some(g => text === g || text.startsWith(g + ' ') || text.endsWith(' ' + g))) return true;
  if (/^(salut|bonjour|hello|coucou|hey|yo)[\s!.,?]*$/i.test(text)) return true;
  if (/^(ca va|comment (tu vas|allez-vous)|quoi de neuf)[\s!.,?]*$/i.test(removeAccents(text))) return true;
  return false;
}

/** Réponse d’accueil quand l’utilisateur dit bonjour / salut */
const GREETING_RESPONSE = 'Bonjour ! Je peux vous aider en Français et en Mathématiques. Posez-moi une question (orthographe, grammaire, calcul, équation, etc.) et j’y répondrai.';

// =========================================================
// MOTEUR DE CALCUL MATHÉMATIQUE AVANCÉ
// =========================================================

/**
 * Résout une équation du 1er degré : ax + b = c  →  x = (c - b) / a
 * Retourne { isSolved, variable, value, equation } ou null
 */
function tryLinearEquation(message) {
  // Cherche un pattern comme "3x + 5 = 20" ou "x - 4 = 10" ou "2x = 14"
  // Pattern général plus souple : trouve "ax + b = c" ou "x + b = c"
  const eq = message.match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?\s*=\s*([+-]?\d+\.?\d*)/i);
  if (eq) {
    let a = parseFloat(eq[1]) || 1;
    const bStr = eq[2] ? eq[2].replace(/\s/g, '') : '0';
    const b = parseFloat(bStr) || 0;
    const c = parseFloat(eq[3]);
    if (a === 0) return null;
    const x = (c - b) / a;
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

/**
 * Calcule sqrt(...) ou racine carrée de N
 */
function trySqrt(message) {
  const sqrtMatch = message.match(/sqrt\s*\(\s*(\d+\.?\d*)\s*\)/i)
    || message.match(/racine\s*(carr[eé]e\s*(de|du)?\s*)(\d+\.?\d*)/i)
    || message.match(/√\s*(\d+\.?\d*)/);

  if (sqrtMatch) {
    const n = parseFloat(sqrtMatch[sqrtMatch.length - 1]);
    if (n < 0) return { isSqrt: true, result: 'pas définie (nombre négatif)', n };
    const res = Math.sqrt(n);
    return { isSqrt: true, result: Math.round(res * 10000) / 10000, n };
  }
  return null;
}

/**
 * Détecte si le message contient un calcul et retourne le résultat.
 * Gère : +, -, *, /, **, ^, sqrt, racine carrée, équations du 1er degré, fractions simples.
 */
function tryMathCalculation(message) {
  if (!message || typeof message !== 'string') return { isCalculation: false };

  const msgLower = message.toLowerCase();

  // ── Racine carrée ───────────────────────────────────────────────────────────
  const sqrtRes = trySqrt(message);
  if (sqrtRes) {
    return {
      isCalculation: true,
      result: sqrtRes.result,
      expression: `√${sqrtRes.n}`,
      type: 'sqrt',
    };
  }

  // ── Équation du 1er degré avec x ────────────────────────────────────────────
  if (/\bx\b/.test(msgLower) && /=/.test(message)) {
    const eqRes = tryLinearEquation(message);
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

  // ── Calcul numérique ────────────────────────────────────────────────────────
  let cleaned = message
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\^/g, '**')       // puissances
    .replace(/,/g, '.')          // virgule décimale
    .replace(/(\d)\s*x\s*(\d)/gi, '$1 * $2') // "3 x 4" → "3 * 4"
    .replace(/\s+/g, ' ');

  // Extraire uniquement les parties mathématiques
  const exprMatch = cleaned.match(/[\d\s+\-*/().**]+/);
  if (!exprMatch) return { isCalculation: false };

  const expr = exprMatch[0].trim();

  if (!/\d/.test(expr)) return { isCalculation: false };
  if (!/[+\-*/]/.test(expr)) return { isCalculation: false };
  if (!/^[\d\s+\-*/.()]+$/.test(expr)) return { isCalculation: false };

  // Division par zéro
  if (/\/\s*0(?!\d)/.test(expr)) {
    return {
      isCalculation: true,
      result: 'impossible (division par zéro)',
      expression: expr.trim(),
      type: 'division-zero',
    };
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result !== 'number' || !Number.isFinite(result)) return { isCalculation: false };
    return {
      isCalculation: true,
      result: Math.round(result * 1000000) / 1000000, // 6 décimales max
      expression: expr.trim(),
      type: 'arithmetic',
    };
  } catch {
    return { isCalculation: false };
  }
}

/** Formate la réponse d'un calcul mathématique */
function formatMathAnswer(calc) {
  if (calc.type === 'sqrt') {
    return [
      'Excellente question ! ✨',
      '',
      `📐 **Calcul :** Racine carrée de ${calc.expression.replace('√', '')}`,
      '',
      `✅ **Résultat :** ${calc.expression} = **${calc.result}**`,
      '',
      '💡 La racine carrée d\'un nombre N est le nombre qui, multiplié par lui-même, donne N.',
      '',
      'Continue comme ça ! 💪',
    ].join('\n');
  }

  if (calc.type === 'equation') {
    return [
      'Excellente question ! ✨',
      '',
      `📐 **Équation :** ${calc.expression}`,
      '',
      `✅ **Solution :** ${calc.variable} = **${calc.result}**`,
      '',
      '💡 Pour résoudre une équation du 1er degré, on isole l\'inconnue en faisant passer les termes d\'un côté à l\'autre.',
      '',
      'Continue comme ça ! 💪',
    ].join('\n');
  }

  if (calc.type === 'division-zero') {
    return [
      'Attention ! ⚠️',
      '',
      `📐 **Expression :** ${calc.expression}`,
      '',
      '❌ **La division par zéro est impossible** — elle n\'est pas définie en mathématiques.',
      '',
      '💡 On ne peut jamais diviser un nombre par 0. C\'est une règle fondamentale.',
      '',
      'Continue comme ça ! 💪',
    ].join('\n');
  }

  // Calcul standard
  const resultStr = Number.isInteger(calc.result)
    ? String(calc.result)
    : String(calc.result).replace('.', ',');

  return [
    'Excellente question ! ✨',
    '',
    `🧮 **Calcul :** ${calc.expression}`,
    '',
    `✅ **Résultat :** ${calc.expression} = **${resultStr}**`,
    '',
    'Continue comme ça ! 💪',
  ].join('\n');
}

// =========================================================
// ALGORITHME DE RECHERCHE AMÉLIORÉ (scoring pondéré)
// =========================================================

/**
 * Recherche la meilleure correspondance dans la base de connaissances.
 * Algorithme pondéré :
 *  - +3 si le trigger normalisé est contenu dans la question normalisée
 *  - +bonus selon la longueur du trigger (triggers longs = plus spécifiques)
 *  - +2 si le trigger est un mot entier (word boundary)
 *  - Le slug lui-même est aussi testé comme trigger
 */
const findBestKnowledgeMatch = async (question) => {
  const qNorm = normalize(question);

  const knowledgeItems = await IaKnowledge.findAll({
    where: { isActive: true },
    order: [['created_at', 'ASC']],
  });

  let bestItem = null;
  let bestScore = 0;

  for (const item of knowledgeItems) {
    const triggers = Array.isArray(item.triggers) ? item.triggers : [];
    // Ajouter le slug comme trigger implicite
    const allTriggers = [...triggers, item.slug.replace(/-/g, ' '), item.title || ''];
    let score = 0;

    for (const raw of allTriggers) {
      const t = normalize(raw);
      if (!t || t.length < 2) continue;

      if (qNorm.includes(t)) {
        // Score de base
        score += 3;
        // Bonus pour triggers longs (plus spécifiques)
        score += Math.min(t.length / 5, 4);
        // Bonus si mot entier (word boundary)
        const wordBoundary = new RegExp(`(^|\\s)${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`);
        if (wordBoundary.test(qNorm)) score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  // Seuil minimum pour éviter les faux positifs
  return bestScore >= 3 ? bestItem : null;
};

// =========================================================
// ROUTES
// =========================================================

// POST /api/ia/search
router.post('/search', async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, message: 'Le champ "question" est obligatoire.' });
    }
    const bestItem = await findBestKnowledgeMatch(question);
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
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Le champ "message" est obligatoire.' });
    }

    let answer;

    // 1. Calcul mathématique ?
    const calc = tryMathCalculation(message);
    if (calc.isCalculation) {
      answer = formatMathAnswer(calc);
    } else if (isGreetingOrPoliteness(message)) {
      // 2. Salutation (bonjour, salut, etc.) → réponse d’accueil
      answer = GREETING_RESPONSE;
    } else {
      // 3. Recherche dans la base de connaissances
      const bestItem = await findBestKnowledgeMatch(message);
      if (bestItem) {
        answer = bestItem.answer;
      } else {
        // 4. Message par défaut : inviter à poser une question français/maths
        answer = 'Je suis là pour vous aider en Français et en Mathématiques. Posez-moi une question précise (ex. : une règle de grammaire, un calcul, une équation) et j’essaierai de vous répondre.';
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
router.post('/log', async (req, res) => {
  try {
    const { sessionId, question, response, source } = req.body || {};
    if (!question || !response) {
      return res.status(400).json({ success: false, message: 'Les champs "question" et "response" sont obligatoires.' });
    }
    await IaConversation.create({
      sessionId: sessionId || null,
      userMessage: question,
      botResponse: response,
      source: source || 'professeur_ia',
    });
    return res.json({ success: true, message: 'Conversation IA enregistrée.' });
  } catch (error) {
    console.error('[IA] Erreur /log:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'enregistrement.' });
  }
});

// GET /api/ia/knowledge (admin)
router.get('/knowledge', authenticate, requireAdmin, async (_req, res) => {
  try {
    const items = await IaKnowledge.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, items });
  } catch (error) {
    console.error('[IA] Erreur /knowledge GET:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// POST /api/ia/knowledge (admin)
router.post('/knowledge', authenticate, requireAdmin, async (req, res) => {
  try {
    const { slug, title, category, level, triggers, answer, isActive } = req.body || {};
    if (!slug || !title || !answer) {
      return res.status(400).json({ success: false, message: 'Les champs "slug", "title" et "answer" sont obligatoires.' });
    }
    const normalizedTriggers = Array.isArray(triggers)
      ? triggers.map((t) => String(t || '').trim()).filter(Boolean)
      : [];
    const [item, created] = await IaKnowledge.findOrCreate({
      where: { slug },
      defaults: { title, category: category || null, level: level || null, triggers: normalizedTriggers, answer, isActive: typeof isActive === 'boolean' ? isActive : true },
    });
    if (!created) {
      item.title = title; item.category = category || null; item.level = level || null;
      item.triggers = normalizedTriggers; item.answer = answer;
      if (typeof isActive === 'boolean') item.isActive = isActive;
      await item.save();
    }
    res.json({ success: true, created, item });
  } catch (error) {
    console.error('[IA] Erreur /knowledge POST:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

export default router;
