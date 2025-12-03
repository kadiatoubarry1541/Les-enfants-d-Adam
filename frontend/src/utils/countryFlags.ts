// Mapping des codes pays vers leurs drapeaux (emoji)
export const COUNTRY_FLAGS: Record<string, string> = {
  // Afrique
  'P1': '🇬🇳', // Guinée
  'P2': '🇸🇳', // Sénégal
  'P3': '🇲🇱', // Mali
  'P4': '🇨🇮', // Côte d'Ivoire
  'P5': '🇧🇫', // Burkina Faso
  'P6': '🇳🇪', // Niger
  'P7': '🇹🇩', // Tchad
  'P8': '🇨🇲', // Cameroun
  'P9': '🇬🇭', // Ghana
  'P10': '🇳🇬', // Nigeria
  'P11': '🇪🇬', // Égypte
  'P12': '🇿🇦', // Afrique du Sud
  'P13': '🇰🇪', // Kenya
  'P14': '🇪🇹', // Éthiopie
  'P15': '🇹🇿', // Tanzanie
  
  // Asie
  'P16': '🇨🇳', // Chine
  'P17': '🇮🇳', // Inde
  'P18': '🇯🇵', // Japon
  'P19': '🇰🇷', // Corée du Sud
  'P20': '🇸🇦', // Arabie Saoudite
  'P21': '🇦🇪', // Émirats Arabes Unis
  'P22': '🇹🇷', // Turquie
  'P23': '🇮🇷', // Iran
  'P24': '🇵🇰', // Pakistan
  'P25': '🇧🇩', // Bangladesh
  'P26': '🇮🇩', // Indonésie
  'P27': '🇵🇭', // Philippines
  'P28': '🇹🇭', // Thaïlande
  'P29': '🇻🇳', // Vietnam
  'P30': '🇲🇾', // Malaisie
  
  // Europe
  'P31': '🇫🇷', // France
  '🇫🇷': '🇫🇷', // France (par nom aussi)
  'P32': '🇩🇪', // Allemagne
  '🇩🇪': '🇩🇪', // Allemagne
  'P33': '🇬🇧', // Royaume-Uni
  'P34': '🇮🇹', // Italie
  'P35': '🇪🇸', // Espagne
  'P36': '🇵🇹', // Portugal
  'P37': '🇳🇱', // Pays-Bas
  'P38': '🇧🇪', // Belgique
  'P39': '🇨🇭', // Suisse
  'P40': '🇦🇹', // Autriche
  'P41': '🇷🇺', // Russie
  'P42': '🇵🇱', // Pologne
  'P43': '🇬🇷', // Grèce
  'P44': '🇸🇪', // Suède
  'P45': '🇳🇴', // Norvège
  'P46': '🇩🇰', // Danemark
  'P47': '🇫🇮', // Finlande
  
  // Amérique du Nord
  'P48': '🇺🇸', // États-Unis
  'P49': '🇨🇦', // Canada
  'P50': '🇲🇽', // Mexique
  
  // Amérique du Sud
  'P51': '🇧🇷', // Brésil
  'P52': '🇦🇷', // Argentine
  'P53': '🇨🇱', // Chili
  'P54': '🇨🇴', // Colombie
  'P55': '🇵🇪', // Pérou
  'P56': '🇻🇪', // Venezuela
  
  // Océanie
  'P57': '🇦🇺', // Australie
  'P58': '🇳🇿', // Nouvelle-Zélande
};

// Mapping des noms de pays vers leurs drapeaux
export const COUNTRY_NAME_FLAGS: Record<string, string> = {
  // Afrique
  'Guinée': '🇬🇳',
  'Guinee': '🇬🇳',
  'Sénégal': '🇸🇳',
  'Senegal': '🇸🇳',
  'Mali': '🇲🇱',
  'Côte d\'Ivoire': '🇨🇮',
  'Cote d\'Ivoire': '🇨🇮',
  'Burkina Faso': '🇧🇫',
  'Niger': '🇳🇪',
  'Tchad': '🇹🇩',
  'Cameroun': '🇨🇲',
  'Ghana': '🇬🇭',
  'Nigeria': '🇳🇬',
  'Égypte': '🇪🇬',
  'Egypte': '🇪🇬',
  'Afrique du Sud': '🇿🇦',
  'Kenya': '🇰🇪',
  'Éthiopie': '🇪🇹',
  'Ethiopie': '🇪🇹',
  'Tanzanie': '🇹🇿',
  
  // Asie
  'Chine': '🇨🇳',
  'Inde': '🇮🇳',
  'Japon': '🇯🇵',
  'Corée du Sud': '🇰🇷',
  'Coree du Sud': '🇰🇷',
  'Arabie Saoudite': '🇸🇦',
  'Émirats Arabes Unis': '🇦🇪',
  'Emirats Arabes Unis': '🇦🇪',
  'Turquie': '🇹🇷',
  'Iran': '🇮🇷',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
  'Indonésie': '🇮🇩',
  'Indonesie': '🇮🇩',
  'Philippines': '🇵🇭',
  'Thaïlande': '🇹🇭',
  'Thailande': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Malaisie': '🇲🇾',
  
  // Europe
  'France': '🇫🇷',
  'Allemagne': '🇩🇪',
  'Royaume-Uni': '🇬🇧',
  'Royaume Uni': '🇬🇧',
  'Italie': '🇮🇹',
  'Espagne': '🇪🇸',
  'Portugal': '🇵🇹',
  'Pays-Bas': '🇳🇱',
  'Pays Bas': '🇳🇱',
  'Belgique': '🇧🇪',
  'Suisse': '🇨🇭',
  'Autriche': '🇦🇹',
  'Russie': '🇷🇺',
  'Pologne': '🇵🇱',
  'Grèce': '🇬🇷',
  'Grece': '🇬🇷',
  'Suède': '🇸🇪',
  'Suede': '🇸🇪',
  'Norvège': '🇳🇴',
  'Norvege': '🇳🇴',
  'Danemark': '🇩🇰',
  'Finlande': '🇫🇮',
  
  // Amérique du Nord
  'États-Unis': '🇺🇸',
  'Etats-Unis': '🇺🇸',
  'États Unis': '🇺🇸',
  'Etats Unis': '🇺🇸',
  'Canada': '🇨🇦',
  'Mexique': '🇲🇽',
  
  // Amérique du Sud
  'Brésil': '🇧🇷',
  'Bresil': '🇧🇷',
  'Argentine': '🇦🇷',
  'Chili': '🇨🇱',
  'Colombie': '🇨🇴',
  'Pérou': '🇵🇪',
  'Perou': '🇵🇪',
  'Venezuela': '🇻🇪',
  
  // Océanie
  'Australie': '🇦🇺',
  'Nouvelle-Zélande': '🇳🇿',
  'Nouvelle Zelande': '🇳🇿',
};

// Fonction pour obtenir le drapeau d'un pays
export function getCountryFlag(countryCode?: string, countryName?: string): string {
  if (countryCode && COUNTRY_FLAGS[countryCode]) {
    return COUNTRY_FLAGS[countryCode];
  }
  if (countryName) {
    // Essayer avec le nom exact
    if (COUNTRY_NAME_FLAGS[countryName]) {
      return COUNTRY_NAME_FLAGS[countryName];
    }
    // Essayer avec différentes variations
    const normalizedName = countryName.trim();
    for (const [name, flag] of Object.entries(COUNTRY_NAME_FLAGS)) {
      if (name.toLowerCase() === normalizedName.toLowerCase()) {
        return flag;
      }
    }
  }
  return '🌐'; // Drapeau par défaut
}

// Mapping des continents vers leurs icônes
export const CONTINENT_ICONS: Record<string, string> = {
  'C1': '🌍', // Afrique
  'C2': '🌏', // Asie
  'C3': '🌍', // Europe
  'C4': '🌎', // Amérique du Nord
  'C5': '🌎', // Amérique du Sud
  'C6': '🌏', // Océanie
};

export function getContinentIcon(continentCode?: string, continentName?: string): string {
  if (continentCode && CONTINENT_ICONS[continentCode]) {
    return CONTINENT_ICONS[continentCode];
  }
  if (continentName) {
    const name = continentName.toLowerCase();
    if (name.includes('afrique')) return '🌍';
    if (name.includes('asie')) return '🌏';
    if (name.includes('europe')) return '🌍';
    if (name.includes('amérique') || name.includes('amerique')) {
      if (name.includes('nord')) return '🌎';
      if (name.includes('sud')) return '🌎';
      return '🌎';
    }
    if (name.includes('océanie') || name.includes('oceanie')) return '🌏';
  }
  return '🌍'; // Icône par défaut
}

