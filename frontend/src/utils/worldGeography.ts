// Données géographiques mondiales complètes
// Structure hiérarchique : Continent > Pays > Région > Préfecture > Sous-préfecture > Quartier

export interface GeographicLocation {
  code: string;
  name: string;
  children?: GeographicLocation[];
}

// Structure mondiale complète
export const WORLD_GEOGRAPHY: GeographicLocation[] = [
  // AFRIQUE
  {
    code: 'C1',
    name: 'Afrique',
    children: [
      {
        code: 'P1',
        name: 'Guinée',
        children: [
          // 1. Basse-Guinée (Guinée maritime) - région naturelle
          {
            code: 'R1',
            name: 'Basse-Guinée',
            children: [
              {
                code: 'PR1',
                name: 'Conakry',
                children: [
                  { code: 'SP1', name: 'Kaloum', children: [{ code: 'Q1', name: 'Kaloum Centre' }, { code: 'Q2', name: 'Sandervalia' }, { code: 'Q3', name: 'Boulbinet' }] },
                  { code: 'SP2', name: 'Dixinn', children: [{ code: 'Q4', name: 'Dixinn' }, { code: 'Q5', name: 'Lambandji' }, { code: 'Q6', name: 'Minière' }] },
                  { code: 'SP3', name: 'Matam', children: [{ code: 'Q7', name: 'Matam' }, { code: 'Q8', name: 'Koloma' }, { code: 'Q9', name: 'Madina' }] },
                  { code: 'SP4', name: 'Ratoma', children: [{ code: 'Q10', name: 'Ratoma' }, { code: 'Q11', name: 'Taouyah' }, { code: 'Q12', name: 'Kipé' }] },
                  { code: 'SP5', name: 'Matoto', children: [{ code: 'Q13', name: 'Matoto' }, { code: 'Q14', name: 'Kagbélén' }, { code: 'Q15', name: 'Sonfonia' }] }
                ]
              },
              { code: 'PR2', name: 'Boffa', children: [{ code: 'SP10', name: 'Boffa-Centre', children: [{ code: 'Q16', name: 'Boffa' }] }] },
              { code: 'PR3', name: 'Boké', children: [{ code: 'SP20', name: 'Boké-Centre', children: [{ code: 'Q20', name: 'Boké Ville' }, { code: 'Q21', name: 'Kamsar' }] }] },
              { code: 'PR4', name: 'Fria', children: [{ code: 'SP30', name: 'Fria-Centre', children: [{ code: 'Q30', name: 'Fria Ville' }] }] },
              { code: 'PR5', name: 'Gaoual', children: [{ code: 'SP40', name: 'Gaoual-Centre', children: [{ code: 'Q40', name: 'Gaoual' }] }] },
              { code: 'PR6', name: 'Koundara', children: [{ code: 'SP50', name: 'Koundara-Centre', children: [{ code: 'Q50', name: 'Koundara' }] }] },
              { code: 'PR7', name: 'Coyah', children: [{ code: 'SP60', name: 'Coyah-Centre', children: [{ code: 'Q60', name: 'Coyah' }] }] },
              { code: 'PR8', name: 'Dubréka', children: [{ code: 'SP70', name: 'Dubréka-Centre', children: [{ code: 'Q70', name: 'Dubréka' }] }] },
              { code: 'PR9', name: 'Forécariah', children: [{ code: 'SP80', name: 'Forécariah-Centre', children: [{ code: 'Q80', name: 'Forécariah' }] }] },
              { code: 'PR10', name: 'Kindia', children: [{ code: 'SP90', name: 'Kindia-Centre', children: [{ code: 'Q90', name: 'Kindia Ville' }] }] },
              { code: 'PR11', name: 'Télimélé', children: [{ code: 'SP100', name: 'Télimélé-Centre', children: [{ code: 'Q100', name: 'Télimélé' }] }] }
            ]
          },
          // 2. Moyenne-Guinée (Fouta-Djallon) - région naturelle
          {
            code: 'R2',
            name: 'Fouta-Djallon',
            children: [
              { code: 'PR12', name: 'Koubia', children: [{ code: 'SP110', name: 'Koubia-Centre', children: [{ code: 'Q110', name: 'Koubia' }] }] },
              { code: 'PR13', name: 'Labé', children: [{ code: 'SP120', name: 'Labé-Centre', children: [{ code: 'Q120', name: 'Labé Ville' }] }] },
              { code: 'PR14', name: 'Lélouma', children: [{ code: 'SP130', name: 'Lélouma-Centre', children: [{ code: 'Q130', name: 'Lélouma' }] }] },
              { code: 'PR15', name: 'Mali', children: [{ code: 'SP140', name: 'Mali-Centre', children: [{ code: 'Q140', name: 'Mali' }] }] },
              { code: 'PR16', name: 'Tougué', children: [{ code: 'SP150', name: 'Tougué-Centre', children: [{ code: 'Q150', name: 'Tougué' }] }] },
              { code: 'PR17', name: 'Dalaba', children: [{ code: 'SP160', name: 'Dalaba-Centre', children: [{ code: 'Q160', name: 'Dalaba' }] }] },
              { code: 'PR18', name: 'Mamou', children: [{ code: 'SP170', name: 'Mamou-Centre', children: [{ code: 'Q170', name: 'Mamou Ville' }] }] },
              { code: 'PR19', name: 'Pita', children: [{ code: 'SP180', name: 'Pita-Centre', children: [{ code: 'Q180', name: 'Pita Ville' }] }] }
            ]
          },
          // 3. Haute-Guinée - région naturelle
          {
            code: 'R3',
            name: 'Haute-Guinée',
            children: [
              { code: 'PR20', name: 'Dabola', children: [{ code: 'SP190', name: 'Dabola-Centre', children: [{ code: 'Q190', name: 'Dabola' }] }] },
              { code: 'PR21', name: 'Dinguiraye', children: [{ code: 'SP200', name: 'Dinguiraye-Centre', children: [{ code: 'Q200', name: 'Dinguiraye' }] }] },
              { code: 'PR22', name: 'Faranah', children: [{ code: 'SP210', name: 'Faranah-Centre', children: [{ code: 'Q210', name: 'Faranah Ville' }] }] },
              { code: 'PR23', name: 'Kissidougou', children: [{ code: 'SP220', name: 'Kissidougou-Centre', children: [{ code: 'Q220', name: 'Kissidougou Ville' }] }] },
              { code: 'PR24', name: 'Kankan', children: [{ code: 'SP230', name: 'Kankan-Centre', children: [{ code: 'Q230', name: 'Kankan Ville' }] }] },
              { code: 'PR25', name: 'Kérouané', children: [{ code: 'SP240', name: 'Kérouané-Centre', children: [{ code: 'Q240', name: 'Kérouané' }] }] },
              { code: 'PR26', name: 'Kouroussa', children: [{ code: 'SP250', name: 'Kouroussa-Centre', children: [{ code: 'Q250', name: 'Kouroussa Ville' }] }] },
              { code: 'PR27', name: 'Mandiana', children: [{ code: 'SP260', name: 'Mandiana-Centre', children: [{ code: 'Q260', name: 'Mandiana' }] }] },
              { code: 'PR28', name: 'Siguiri', children: [{ code: 'SP270', name: 'Siguiri-Centre', children: [{ code: 'Q270', name: 'Siguiri Ville' }] }] }
            ]
          },
          // 4. Guinée forestière - région naturelle
          {
            code: 'R4',
            name: 'Guinée forestière',
            children: [
              { code: 'PR29', name: 'Beyla', children: [{ code: 'SP280', name: 'Beyla-Centre', children: [{ code: 'Q280', name: 'Beyla' }] }] },
              { code: 'PR30', name: 'Guéckédou', children: [{ code: 'SP290', name: 'Guéckédou-Centre', children: [{ code: 'Q290', name: 'Guéckédou Ville' }] }] },
              { code: 'PR31', name: 'Lola', children: [{ code: 'SP300', name: 'Lola-Centre', children: [{ code: 'Q300', name: 'Lola' }] }] },
              { code: 'PR32', name: 'Macenta', children: [{ code: 'SP310', name: 'Macenta-Centre', children: [{ code: 'Q310', name: 'Macenta Ville' }] }] },
              { code: 'PR33', name: 'Nzérékoré', children: [{ code: 'SP320', name: 'Nzérékoré-Centre', children: [{ code: 'Q320', name: 'Nzérékoré Ville' }] }] },
              { code: 'PR34', name: 'Yomou', children: [{ code: 'SP330', name: 'Yomou-Centre', children: [{ code: 'Q330', name: 'Yomou' }] }] }
            ]
          }
        ]
      },
      {
        code: 'P2',
        name: 'Sénégal',
        children: [
          {
            code: 'R1',
            name: 'Dakar',
            children: [
              {
                code: 'PR1',
                name: 'Dakar',
                children: [
                  {
                    code: 'SP1',
                    name: 'Dakar Centre',
                    children: [
                      { code: 'Q1', name: 'Plateau' },
                      { code: 'Q2', name: 'Médina' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        code: 'P3',
        name: 'Mali',
        children: [
          {
            code: 'R1',
            name: 'Bamako',
            children: [
              {
                code: 'PR1',
                name: 'Bamako',
                children: [
                  {
                    code: 'SP1',
                    name: 'Bamako Centre',
                    children: [
                      { code: 'Q1', name: 'Commune I' },
                      { code: 'Q2', name: 'Commune II' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        code: 'P4',
        name: 'Côte d\'Ivoire',
        children: [
          {
            code: 'R1',
            name: 'Abidjan',
            children: [
              {
                code: 'PR1',
                name: 'Abidjan',
                children: [
                  {
                    code: 'SP1',
                    name: 'Abidjan Centre',
                    children: [
                      { code: 'Q1', name: 'Cocody' },
                      { code: 'Q2', name: 'Yopougon' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        code: 'P5',
        name: 'Burkina Faso',
        children: [
          {
            code: 'R1',
            name: 'Ouagadougou',
            children: [
              {
                code: 'PR1',
                name: 'Ouagadougou',
                children: [
                  {
                    code: 'SP1',
                    name: 'Ouagadougou Centre',
                    children: [
                      { code: 'Q1', name: 'Centre-ville' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // ASIE
  {
    code: 'C2',
    name: 'Asie',
    children: [
      {
        code: 'P1',
        name: 'Chine',
        children: [
          {
            code: 'R1',
            name: 'Pékin',
            children: [
              {
                code: 'PR1',
                name: 'Pékin',
                children: [
                  {
                    code: 'SP1',
                    name: 'Pékin Centre',
                    children: [
                      { code: 'Q1', name: 'Dongcheng' },
                      { code: 'Q2', name: 'Xicheng' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        code: 'P2',
        name: 'Inde',
        children: [
          {
            code: 'R1',
            name: 'Delhi',
            children: [
              {
                code: 'PR1',
                name: 'Delhi',
                children: [
                  {
                    code: 'SP1',
                    name: 'Delhi Centre',
                    children: [
                      { code: 'Q1', name: 'New Delhi' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // EUROPE
  {
    code: 'C3',
    name: 'Europe',
    children: [
      {
        code: 'P1',
        name: 'France',
        children: [
          {
            code: 'R1',
            name: 'Île-de-France',
            children: [
              {
                code: 'PR1',
                name: 'Paris',
                children: [
                  {
                    code: 'SP1',
                    name: 'Paris Centre',
                    children: [
                      { code: 'Q1', name: '1er Arrondissement' },
                      { code: 'Q2', name: '2e Arrondissement' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        code: 'P2',
        name: 'Allemagne',
        children: [
          {
            code: 'R1',
            name: 'Berlin',
            children: [
              {
                code: 'PR1',
                name: 'Berlin',
                children: [
                  {
                    code: 'SP1',
                    name: 'Berlin Centre',
                    children: [
                      { code: 'Q1', name: 'Mitte' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // AMÉRIQUE
  {
    code: 'C4',
    name: 'Amérique',
    children: [
      {
        code: 'P1',
        name: 'États-Unis',
        children: [
          {
            code: 'R1',
            name: 'New York',
            children: [
              {
                code: 'PR1',
                name: 'New York',
                children: [
                  {
                    code: 'SP1',
                    name: 'Manhattan',
                    children: [
                      { code: 'Q1', name: 'Downtown' },
                      { code: 'Q2', name: 'Midtown' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        code: 'P2',
        name: 'Canada',
        children: [
          {
            code: 'R1',
            name: 'Ontario',
            children: [
              {
                code: 'PR1',
                name: 'Toronto',
                children: [
                  {
                    code: 'SP1',
                    name: 'Toronto Centre',
                    children: [
                      { code: 'Q1', name: 'Downtown Toronto' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
      {
        code: 'P3',
        name: 'Brésil',
        children: [
          {
            code: 'R1',
            name: 'São Paulo',
            children: [
              {
                code: 'PR1',
                name: 'São Paulo',
                children: [
                  {
                    code: 'SP1',
                    name: 'São Paulo Centre',
                    children: [
                      { code: 'Q1', name: 'Centro' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // OCÉANIE
  {
    code: 'C5',
    name: 'Océanie',
    children: [
      {
        code: 'P1',
        name: 'Australie',
        children: [
          {
            code: 'R1',
            name: 'Nouvelle-Galles du Sud',
            children: [
              {
                code: 'PR1',
                name: 'Sydney',
                children: [
                  {
                    code: 'SP1',
                    name: 'Sydney Centre',
                    children: [
                      { code: 'Q1', name: 'CBD' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// Fonctions utilitaires pour accéder aux données
export function getContinents(): GeographicLocation[] {
  return WORLD_GEOGRAPHY;
}

export function getCountriesByContinent(continentCode: string): GeographicLocation[] {
  const continent = WORLD_GEOGRAPHY.find(c => c.code === continentCode);
  return continent?.children || [];
}

export function getRegionsByCountry(countryCode: string, continentCode?: string): GeographicLocation[] {
  // Si continentCode est fourni, chercher uniquement dans ce continent
  if (continentCode) {
    const continent = WORLD_GEOGRAPHY.find(c => c.code === continentCode);
    if (continent) {
      const country = continent.children?.find(c => c.code === countryCode);
      if (country) {
        return country.children || [];
      }
    }
    return [];
  }
  
  // Sinon, chercher dans tous les continents (comportement par défaut)
  for (const continent of WORLD_GEOGRAPHY) {
    const country = continent.children?.find(c => c.code === countryCode);
    if (country) {
      return country.children || [];
    }
  }
  return [];
}

export function getPrefecturesByRegion(regionCode: string, countryCode?: string, continentCode?: string): GeographicLocation[] {
  // Si continentCode et countryCode sont fournis, chercher uniquement dans ce contexte
  if (continentCode && countryCode) {
    const continent = WORLD_GEOGRAPHY.find(c => c.code === continentCode);
    if (continent) {
      const country = continent.children?.find(c => c.code === countryCode);
      if (country) {
        const region = country.children?.find(r => r.code === regionCode);
        if (region) {
          return region.children || [];
        }
      }
    }
    return [];
  }
  
  // Sinon, chercher dans tous les continents (comportement par défaut)
  for (const continent of WORLD_GEOGRAPHY) {
    for (const country of continent.children || []) {
      const region = country.children?.find(r => r.code === regionCode);
      if (region) {
        return region.children || [];
      }
    }
  }
  return [];
}

export function getSousPrefecturesByPrefecture(prefectureCode: string, regionCode?: string, countryCode?: string, continentCode?: string): GeographicLocation[] {
  // Si tous les codes sont fournis, chercher uniquement dans ce contexte
  if (continentCode && countryCode && regionCode) {
    const continent = WORLD_GEOGRAPHY.find(c => c.code === continentCode);
    if (continent) {
      const country = continent.children?.find(c => c.code === countryCode);
      if (country) {
        const region = country.children?.find(r => r.code === regionCode);
        if (region) {
          const prefecture = region.children?.find(p => p.code === prefectureCode);
          if (prefecture) {
            return prefecture.children || [];
          }
        }
      }
    }
    return [];
  }
  
  // Sinon, chercher dans tous les continents (comportement par défaut)
  for (const continent of WORLD_GEOGRAPHY) {
    for (const country of continent.children || []) {
      for (const region of country.children || []) {
        const prefecture = region.children?.find(p => p.code === prefectureCode);
        if (prefecture) {
          return prefecture.children || [];
        }
      }
    }
  }
  return [];
}

export function getQuartiersBySousPrefecture(sousPrefectureCode: string, prefectureCode?: string, regionCode?: string, countryCode?: string, continentCode?: string): GeographicLocation[] {
  // Si tous les codes sont fournis, chercher uniquement dans ce contexte
  if (continentCode && countryCode && regionCode && prefectureCode) {
    const continent = WORLD_GEOGRAPHY.find(c => c.code === continentCode);
    if (continent) {
      const country = continent.children?.find(c => c.code === countryCode);
      if (country) {
        const region = country.children?.find(r => r.code === regionCode);
        if (region) {
          const prefecture = region.children?.find(p => p.code === prefectureCode);
          if (prefecture) {
            const sousPrefecture = prefecture.children?.find(sp => sp.code === sousPrefectureCode);
            if (sousPrefecture) {
              return sousPrefecture.children || [];
            }
          }
        }
      }
    }
    return [];
  }
  
  // Sinon, chercher dans tous les continents (comportement par défaut)
  for (const continent of WORLD_GEOGRAPHY) {
    for (const country of continent.children || []) {
      for (const region of country.children || []) {
        for (const prefecture of region.children || []) {
          const sousPrefecture = prefecture.children?.find(sp => sp.code === sousPrefectureCode);
          if (sousPrefecture) {
            return sousPrefecture.children || [];
          }
        }
      }
    }
  }
  return [];
}

// Fonction pour trouver un élément par son code dans toute la hiérarchie
export function findLocationByCode(code: string): GeographicLocation | null {
  for (const continent of WORLD_GEOGRAPHY) {
    if (continent.code === code) return continent;
    for (const country of continent.children || []) {
      if (country.code === code) return country;
      for (const region of country.children || []) {
        if (region.code === code) return region;
        for (const prefecture of region.children || []) {
          if (prefecture.code === code) return prefecture;
          for (const sousPrefecture of prefecture.children || []) {
            if (sousPrefecture.code === code) return sousPrefecture;
            for (const quartier of sousPrefecture.children || []) {
              if (quartier.code === code) return quartier;
            }
          }
        }
      }
    }
  }
  return null;
}

/** Retourne le chemin hiérarchique (continent → … → lieu) pour un code. */
function findPathToCode(nodes: GeographicLocation[], code: string, path: GeographicLocation[]): GeographicLocation[] | null {
  for (const node of nodes) {
    const newPath = [...path, node];
    if (node.code === code) return newPath;
    if (node.children?.length) {
      const found = findPathToCode(node.children, code, newPath);
      if (found) return found;
    }
  }
  return null;
}

export function getLocationPath(code: string): GeographicLocation[] | null {
  if (!code) return null;
  return findPathToCode(WORLD_GEOGRAPHY, code, []);
}

const LEVEL_LABELS: Record<number, string> = {
  0: 'Continent',
  1: 'Pays',
  2: 'Région',
  3: 'Préfecture',
  4: 'Sous-préfecture',
  5: 'Quartier'
};

/** Nom court = nom du lieu (ex. Kaloum). */
export function getLocationShortName(code: string): string {
  const loc = findLocationByCode(code);
  return loc ? loc.name : code;
}

/** Chemin des noms uniquement : "Afrique · Guinée · Conakry · Conakry · Conakry Centre · Kaloum". */
export function getLocationPathNames(code: string): string {
  const path = getLocationPath(code);
  if (!path?.length) return code;
  return path.map((n) => n.name).join(' · ');
}

/** Nom complet pour affichage groupe (avec libellés) : "Quartier Kaloum · Sous-préfecture Conakry Centre · …". */
export function getLocationDisplayName(code: string): string {
  const path = getLocationPath(code);
  if (!path?.length) return code;
  const labels = path.map((n, i) => (LEVEL_LABELS[i] ? `${LEVEL_LABELS[i]} ` : '') + n.name);
  return labels.join(' · ');
}

/** Même que getLocationDisplayName mais version courte (noms seuls) pour liste. */
export function getLocationDisplayShort(code: string): string {
  return getLocationPathNames(code);
}

/** Titre suggéré pour un groupe : "Quartier Kaloum" ou "Sous-préfecture Conakry Centre". */
export function getLocationGroupTitle(code: string): string {
  const path = getLocationPath(code);
  if (!path?.length) return code;
  const last = path[path.length - 1];
  const levelLabel = LEVEL_LABELS[path.length - 1];
  return levelLabel ? `${levelLabel} ${last.name}` : last.name;
}

/** Liste plate de tous les lieux (quartiers, sous-préfectures, préfectures…) avec code pour sélection. */
export function getAllLocationsForGroups(): { code: string; name: string; title: string }[] {
  const out: { code: string; name: string; title: string }[] = [];
  for (const continent of WORLD_GEOGRAPHY) {
    for (const country of continent.children || []) {
      for (const region of country.children || []) {
        for (const prefecture of region.children || []) {
          for (const sousPrefecture of prefecture.children || []) {
            for (const quartier of sousPrefecture.children || []) {
              out.push({
                code: quartier.code,
                name: quartier.name,
                title: getLocationGroupTitle(quartier.code)
              });
            }
            out.push({
              code: sousPrefecture.code,
              name: sousPrefecture.name,
              title: getLocationGroupTitle(sousPrefecture.code)
            });
          }
          out.push({
            code: prefecture.code,
            name: prefecture.name,
            title: getLocationGroupTitle(prefecture.code)
          });
        }
        out.push({
          code: region.code,
          name: region.name,
          title: getLocationGroupTitle(region.code)
        });
      }
    }
  }
  return out;
}

// Fonction pour obtenir le code complet d'une localisation
export function getLocationCode(path: {
  continent?: string;
  country?: string;
  region?: string;
  prefecture?: string;
  sousPrefecture?: string;
  quartier?: string;
}): string {
  let code = '';
  if (path.continent) code += path.continent;
  if (path.country) code += path.country;
  if (path.region) code += path.region;
  if (path.prefecture) code += path.prefecture;
  if (path.sousPrefecture) code += path.sousPrefecture;
  if (path.quartier) code += path.quartier;
  return code;
}

// Fonction pour compter les préfectures dans une région
export function countPrefecturesInRegion(regionCode: string, countryCode?: string, continentCode?: string): number {
  const prefectures = getPrefecturesByRegion(regionCode, countryCode, continentCode);
  return prefectures.length;
}

// Fonction pour compter les sous-préfectures dans une préfecture
export function countSousPrefecturesInPrefecture(prefectureCode: string, regionCode?: string, countryCode?: string, continentCode?: string): number {
  const sousPrefectures = getSousPrefecturesByPrefecture(prefectureCode, regionCode, countryCode, continentCode);
  return sousPrefectures.length;
}

// Fonction pour compter les quartiers dans une sous-préfecture
export function countQuartiersInSousPrefecture(sousPrefectureCode: string, prefectureCode?: string, regionCode?: string, countryCode?: string, continentCode?: string): number {
  const quartiers = getQuartiersBySousPrefecture(sousPrefectureCode, prefectureCode, regionCode, countryCode, continentCode);
  return quartiers.length;
}
