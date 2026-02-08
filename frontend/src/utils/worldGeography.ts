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
          {
            code: 'R1',
            name: 'Conakry',
            children: [
              {
                code: 'PR1',
                name: 'Conakry',
                children: [
                  {
                    code: 'SP1',
                    name: 'Conakry Centre',
                    children: [
                      { code: 'Q1', name: 'Kaloum' },
                      { code: 'Q2', name: 'Dixinn' },
                      { code: 'Q3', name: 'Matam' },
                      { code: 'Q4', name: 'Matoto' },
                      { code: 'Q5', name: 'Ratoma' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            code: 'R2',
            name: 'Basse-Guinée',
            children: [
              {
                code: 'PR2',
                name: 'Boké',
                children: [
                  {
                    code: 'SP2',
                    name: 'Boké Centre',
                    children: [
                      { code: 'Q6', name: 'Boké Ville' },
                      { code: 'Q7', name: 'Kamsar' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            code: 'R3',
            name: 'Fouta-Djallon',
            children: [
              {
                code: 'PR3',
                name: 'Labé',
                children: [
                  {
                    code: 'SP3',
                    name: 'Labé Centre',
                    children: [
                      { code: 'Q8', name: 'Labé Ville' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            code: 'R4',
            name: 'Haute-Guinée',
            children: [
              {
                code: 'PR4',
                name: 'Kankan',
                children: [
                  {
                    code: 'SP4',
                    name: 'Kankan Centre',
                    children: [
                      { code: 'Q9', name: 'Kankan Ville' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            code: 'R5',
            name: 'Guinée forestière',
            children: [
              {
                code: 'PR5',
                name: 'N\'Zérékoré',
                children: [
                  {
                    code: 'SP5',
                    name: 'N\'Zérékoré Centre',
                    children: [
                      { code: 'Q10', name: 'N\'Zérékoré Ville' }
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
