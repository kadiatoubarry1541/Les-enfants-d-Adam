import express from 'express';
import IaKnowledge from '../models/IaKnowledge.js';
import IaConversation from '../models/IaConversation.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ========= FONCTIONS UTILITAIRES =========

// ========= CALCULS MATHÉMATIQUES =========

/**
 * Détecte si le message contient un calcul et retourne le résultat si oui.
 * Accepte : "5 + 3", "10*2", "combien font 7 + 8 ?", "calcule 100/4", etc.
 * @returns {{ isCalculation: boolean, result?: number, expression?: string }} 
 */
function tryMathCalculation(message) {
  if (!message || typeof message !== 'string') return { isCalculation: false };

  // Remplacer symboles courants (×, ÷, virgule) et " x " entre nombres (multiplication)
  let cleaned = message
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '.')
    .replace(/(\d)\s+x\s+(\d)/gi, '$1 * $2')
    .replace(/\s+/g, ' ');

  // Extraire une expression : garder uniquement chiffres, opérateurs, espaces, parenthèses, point décimal
  const allowedMatch = cleaned.replace(/[^\d+\-*/().\s]/g, ' ').trim();
  const expr = allowedMatch.replace(/\s+/g, ' ');

  // Il faut au moins un chiffre et un opérateur
  if (!/\d/.test(expr) || !/[+*/-]/.test(expr)) return { isCalculation: false };

  // Sécurité : l'expression ne doit contenir que des caractères autorisés
  if (!/^[\d\s+*/().-]+$/.test(expr)) return { isCalculation: false };

  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result !== 'number' || !Number.isFinite(result)) return { isCalculation: false };
    return {
      isCalculation: true,
      result,
      expression: expr.trim(),
    };
  } catch {
    return { isCalculation: false };
  }
}

const findBestKnowledgeMatch = async (question) => {
  const questionLower = question.toLowerCase();

  const knowledgeItems = await IaKnowledge.findAll({
    where: { isActive: true },
    order: [['created_at', 'ASC']],
  });

  let bestItem = null;
  let bestScore = 0;

  for (const item of knowledgeItems) {
    const triggers = Array.isArray(item.triggers) ? item.triggers : [];
    let score = 0;

    for (const rawTrigger of triggers) {
      const trigger = String(rawTrigger || '').trim().toLowerCase();
      if (!trigger) continue;
      if (questionLower.includes(trigger)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  return bestItem;
};

// ========= RECHERCHE DE CONNAISSANCE POUR LE PROFESSEUR IA =========

// POST /api/ia/search
// Reçoit une question et renvoie, si possible, une réponse stockée dans IaKnowledge
router.post('/search', async (req, res) => {
  try {
    const { question } = req.body || {};

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Le champ "question" est obligatoire et doit être une chaîne.',
      });
    }

    const bestItem = await findBestKnowledgeMatch(question);

    return res.json({
      success: true,
      match: bestItem
        ? {
            id: bestItem.id,
            slug: bestItem.slug,
            title: bestItem.title,
            category: bestItem.category,
            level: bestItem.level,
          }
        : null,
      answer: bestItem ? bestItem.answer : null,
    });
  } catch (error) {
    console.error('[IA] Erreur lors de la recherche de connaissance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recherche de connaissance IA',
    });
  }
});

// ========= ENDPOINT PRINCIPAL POUR LE PROFESSEUR IA (SANS PYTHON) =========

// POST /api/ia/chat
// Remplace l'ancien serveur IA SC : le frontend envoie la question ici.
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Le champ "message" est obligatoire et doit être une chaîne.',
      });
    }

    // Répondre aux calculs mathématiques avant la base de connaissances
    const calc = tryMathCalculation(message);
    if (calc.isCalculation) {
      const answer = [
        'Excellente question ! ✨',
        '',
        `**Calcul :** ${calc.expression}`,
        '',
        `**Résultat :** ${calc.result}`,
        '',
        "J'ai calculé l'expression que tu m'as donnée. Continue comme ça ! 💪",
      ].join('\n');

      try {
        await IaConversation.create({
          sessionId: null,
          userMessage: message,
          botResponse: answer,
          source: 'professeur_ia_backend',
        });
      } catch (e) {
        console.error('[IA] Erreur lors de la sauvegarde de la conversation:', e);
      }

      return res.json({
        success: true,
        response: answer,
      });
    }

    const bestItem = await findBestKnowledgeMatch(message);

    let answer;
    if (bestItem) {
      answer = bestItem.answer;
    } else {
      answer = "Je suis désolé, je ne peux pas répondre à cette question pour le moment.";
    }

    // Sauvegarder la conversation côté Diangou
    try {
      await IaConversation.create({
        sessionId: null,
        userMessage: message,
        botResponse: answer,
        source: 'professeur_ia_backend',
      });
    } catch (e) {
      console.error('[IA] Erreur lors de la sauvegarde de la conversation:', e);
    }

    return res.json({
      success: true,
      response: answer,
    });
  } catch (error) {
    console.error('[IA] Erreur dans /chat:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du traitement de la question',
    });
  }
});

// ========= LOG DES CONVERSATIONS DU PROFESSEUR IA =========

// POST /api/ia/log
// Permet au serveur IA (Python) d'enregistrer les questions/réponses dans la base Diangou
router.post('/log', async (req, res) => {
  try {
    const { sessionId, question, response, source } = req.body || {};

    if (!question || !response) {
      return res.status(400).json({
        success: false,
        message: 'Les champs "question" et "response" sont obligatoires.',
      });
    }

    await IaConversation.create({
      sessionId: sessionId || null,
      userMessage: question,
      botResponse: response,
      source: source || 'professeur_ia',
    });

    return res.json({
      success: true,
      message: 'Conversation IA enregistrée avec succès',
    });
  } catch (error) {
    console.error('[IA] Erreur lors de l\'enregistrement de la conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement de la conversation IA',
    });
  }
});

// ========= GESTION DES FICHES DE CONNAISSANCE (ADMIN) =========

// Liste des fiches (admin)
router.get('/knowledge', authenticate, requireAdmin, async (req, res) => {
  try {
    const items = await IaKnowledge.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, items });
  } catch (error) {
    console.error('[IA] Erreur liste knowledge:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du chargement des connaissances IA',
    });
  }
});

// Création / mise à jour simple d'une fiche (admin)
router.post('/knowledge', authenticate, requireAdmin, async (req, res) => {
  try {
    const { slug, title, category, level, triggers, answer, isActive } = req.body || {};

    if (!slug || !title || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Les champs "slug", "title" et "answer" sont obligatoires.',
      });
    }

    const normalizedTriggers = Array.isArray(triggers)
      ? triggers.map((t) => String(t || '').trim()).filter(Boolean)
      : [];

    const [item, created] = await IaKnowledge.findOrCreate({
      where: { slug },
      defaults: {
        title,
        category: category || null,
        level: level || null,
        triggers: normalizedTriggers,
        answer,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });

    if (!created) {
      item.title = title;
      item.category = category || null;
      item.level = level || null;
      item.triggers = normalizedTriggers;
      item.answer = answer;
      if (typeof isActive === 'boolean') {
        item.isActive = isActive;
      }
      await item.save();
    }

    res.json({
      success: true,
      created,
      item,
    });
  } catch (error) {
    console.error('[IA] Erreur création/mise à jour knowledge:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement de la connaissance IA',
    });
  }
});

export default router;

