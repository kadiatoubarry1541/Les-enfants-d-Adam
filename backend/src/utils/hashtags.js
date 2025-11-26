/**
 * Utilitaires pour gérer les hashtags
 */

/**
 * Extrait les hashtags d'un texte
 * @param {string} text - Le texte à analyser
 * @returns {string[]} - Liste des hashtags trouvés (sans le #)
 */
export function extractHashtags(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Expression régulière pour trouver les hashtags
  // Format: #mot ou #mot_avec_underscore ou #motAvecChiffres123
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
  const matches = text.match(hashtagRegex);
  
  if (!matches) {
    return [];
  }
  
  // Retirer le # et dédupliquer
  const hashtags = matches.map(tag => tag.substring(1).toLowerCase());
  return [...new Set(hashtags)];
}

/**
 * Formate un texte avec des hashtags cliquables (pour le frontend)
 * @param {string} text - Le texte à formater
 * @returns {string} - Le texte avec les hashtags formatés
 */
export function formatHashtags(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  // Remplacer les hashtags par des liens (pour le frontend)
  return text.replace(/#([a-zA-Z0-9_]+)/g, '<span class="hashtag" data-hashtag="$1">#$1</span>');
}

/**
 * Valide un hashtag
 * @param {string} hashtag - Le hashtag à valider (sans le #)
 * @returns {boolean} - True si valide
 */
export function isValidHashtag(hashtag) {
  if (!hashtag || typeof hashtag !== 'string') {
    return false;
  }
  
  // Un hashtag valide doit contenir au moins une lettre et peut contenir des chiffres et underscores
  const hashtagRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  return hashtagRegex.test(hashtag) && hashtag.length <= 50;
}


