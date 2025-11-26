// Données géographiques complètes de la Guinée
// Structure hiérarchique : Région > Préfecture > Sous-préfecture > District/Quartier

export interface GeographicLocation {
  code: string
  name: string
  children?: GeographicLocation[]
}

// Structure complète de la Guinée
export const GUINEA_GEOGRAPHY: GeographicLocation[] = [
  {
    code: 'RG01',
    name: 'Conakry',
    children: [
      {
        code: 'PR01',
        name: 'Conakry',
        children: [
          {
            code: 'SP01',
            name: 'Conakry Centre',
            children: [
              { code: 'DT01', name: 'Kaloum' },
              { code: 'DT02', name: 'Dixinn' },
              { code: 'DT03', name: 'Matam' },
              { code: 'DT04', name: 'Matoto' },
              { code: 'DT05', name: 'Ratoma' }
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'RG02',
    name: 'Basse-Guinée',
    children: [
      {
        code: 'PR02',
        name: 'Boké',
        children: [
          {
            code: 'SP02',
            name: 'Boké Centre',
            children: [
              { code: 'DT06', name: 'Boké Ville' },
              { code: 'DT07', name: 'Kamsar' },
              { code: 'DT08', name: 'Sangarédi' },
              { code: 'DT09', name: 'Tanéné' }
            ]
          },
          {
            code: 'SP03',
            name: 'Fria',
            children: [
              { code: 'DT10', name: 'Fria Ville' },
              { code: 'DT11', name: 'Bambéto' },
              { code: 'DT12', name: 'Tinguilinta' }
            ]
          },
          {
            code: 'SP04',
            name: 'Gaoual',
            children: [
              { code: 'DT13', name: 'Gaoual Centre' },
              { code: 'DT14', name: 'Koundara' },
              { code: 'DT15', name: 'Malanta' }
            ]
          },
          {
            code: 'SP05',
            name: 'Koundara',
            children: [
              { code: 'DT16', name: 'Koundara Centre' },
              { code: 'DT17', name: 'Sambailo' },
              { code: 'DT18', name: 'Youkounkoun' }
            ]
          }
        ]
      },
      {
        code: 'PR03',
        name: 'Kindia',
        children: [
          {
            code: 'SP06',
            name: 'Kindia Centre',
            children: [
              { code: 'DT19', name: 'Kindia Ville' },
              { code: 'DT20', name: 'Coyah' },
              { code: 'DT21', name: 'Dubréka' },
              { code: 'DT22', name: 'Forecariah' }
            ]
          },
          {
            code: 'SP07',
            name: 'Coyah',
            children: [
              { code: 'DT23', name: 'Coyah Centre' },
              { code: 'DT24', name: 'Boffa' },
              { code: 'DT25', name: 'Fria' }
            ]
          },
          {
            code: 'SP08',
            name: 'Dubréka',
            children: [
              { code: 'DT26', name: 'Dubréka Centre' },
              { code: 'DT27', name: 'Boffa' },
              { code: 'DT28', name: 'Forecariah' }
            ]
          },
          {
            code: 'SP09',
            name: 'Forecariah',
            children: [
              { code: 'DT29', name: 'Forecariah Centre' },
              { code: 'DT30', name: 'Boffa' },
              { code: 'DT31', name: 'Coyah' }
            ]
          },
          {
            code: 'SP10',
            name: 'Télimélé',
            children: [
              { code: 'DT32', name: 'Télimélé Centre' },
              { code: 'DT33', name: 'Gaoual' },
              { code: 'DT34', name: 'Koundara' }
            ]
          }
        ]
      },
      {
        code: 'PR04',
        name: 'Mamou',
        children: [
          {
            code: 'SP11',
            name: 'Mamou Centre',
            children: [
              { code: 'DT35', name: 'Mamou Ville' },
              { code: 'DT36', name: 'Dalaba' },
              { code: 'DT37', name: 'Pita' }
            ]
          },
          {
            code: 'SP12',
            name: 'Dalaba',
            children: [
              { code: 'DT38', name: 'Dalaba Centre' },
              { code: 'DT39', name: 'Ditinn' },
              { code: 'DT40', name: 'Mamou' }
            ]
          },
          {
            code: 'SP13',
            name: 'Pita',
            children: [
              { code: 'DT41', name: 'Pita Centre' },
              { code: 'DT42', name: 'Ditinn' },
              { code: 'DT43', name: 'Mamou' }
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'RG03',
    name: 'Moyenne-Guinée (Fouta-Djallon)',
    children: [
      {
        code: 'PR05',
        name: 'Labé',
        children: [
          {
            code: 'SP14',
            name: 'Labé Centre',
            children: [
              { code: 'DT44', name: 'Labé Ville' },
              { code: 'DT45', name: 'Koubia' },
              { code: 'DT46', name: 'Lélouma' },
              { code: 'DT47', name: 'Mali' },
              { code: 'DT48', name: 'Tougué' }
            ]
          },
          {
            code: 'SP15',
            name: 'Koubia',
            children: [
              { code: 'DT49', name: 'Koubia Centre' },
              { code: 'DT50', name: 'Lélouma' },
              { code: 'DT51', name: 'Mali' }
            ]
          },
          {
            code: 'SP16',
            name: 'Lélouma',
            children: [
              { code: 'DT52', name: 'Lélouma Centre' },
              { code: 'DT53', name: 'Koubia' },
              { code: 'DT54', name: 'Mali' }
            ]
          },
          {
            code: 'SP17',
            name: 'Mali',
            children: [
              { code: 'DT55', name: 'Mali Centre' },
              { code: 'DT56', name: 'Koubia' },
              { code: 'DT57', name: 'Lélouma' }
            ]
          },
          {
            code: 'SP18',
            name: 'Tougué',
            children: [
              { code: 'DT58', name: 'Tougué Centre' },
              { code: 'DT59', name: 'Koubia' },
              { code: 'DT60', name: 'Mali' }
            ]
          }
        ]
      },
      {
        code: 'PR06',
        name: 'Faranah',
        children: [
          {
            code: 'SP19',
            name: 'Faranah Centre',
            children: [
              { code: 'DT61', name: 'Faranah Ville' },
              { code: 'DT62', name: 'Dabola' },
              { code: 'DT63', name: 'Dinguiraye' },
              { code: 'DT64', name: 'Kissidougou' }
            ]
          },
          {
            code: 'SP20',
            name: 'Dabola',
            children: [
              { code: 'DT65', name: 'Dabola Centre' },
              { code: 'DT66', name: 'Dinguiraye' },
              { code: 'DT67', name: 'Faranah' }
            ]
          },
          {
            code: 'SP21',
            name: 'Dinguiraye',
            children: [
              { code: 'DT68', name: 'Dinguiraye Centre' },
              { code: 'DT69', name: 'Dabola' },
              { code: 'DT70', name: 'Faranah' }
            ]
          },
          {
            code: 'SP22',
            name: 'Kissidougou',
            children: [
              { code: 'DT71', name: 'Kissidougou Centre' },
              { code: 'DT72', name: 'Dabola' },
              { code: 'DT73', name: 'Faranah' }
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'RG04',
    name: 'Haute-Guinée',
    children: [
      {
        code: 'PR07',
        name: 'Kankan',
        children: [
          {
            code: 'SP23',
            name: 'Kankan Centre',
            children: [
              { code: 'DT74', name: 'Kankan Ville' },
              { code: 'DT75', name: 'Kérouané' },
              { code: 'DT76', name: 'Kouroussa' },
              { code: 'DT77', name: 'Mandiana' },
              { code: 'DT78', name: 'Siguiri' }
            ]
          },
          {
            code: 'SP24',
            name: 'Kérouané',
            children: [
              { code: 'DT79', name: 'Kérouané Centre' },
              { code: 'DT80', name: 'Kouroussa' },
              { code: 'DT81', name: 'Mandiana' }
            ]
          },
          {
            code: 'SP25',
            name: 'Kouroussa',
            children: [
              { code: 'DT82', name: 'Kouroussa Centre' },
              { code: 'DT83', name: 'Kérouané' },
              { code: 'DT84', name: 'Mandiana' }
            ]
          },
          {
            code: 'SP26',
            name: 'Mandiana',
            children: [
              { code: 'DT85', name: 'Mandiana Centre' },
              { code: 'DT86', name: 'Kérouané' },
              { code: 'DT87', name: 'Kouroussa' }
            ]
          },
          {
            code: 'SP27',
            name: 'Siguiri',
            children: [
              { code: 'DT88', name: 'Siguiri Centre' },
              { code: 'DT89', name: 'Kérouané' },
              { code: 'DT90', name: 'Kouroussa' }
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'RG05',
    name: 'Guinée forestière',
    children: [
      {
        code: 'PR08',
        name: 'Nzérékoré',
        children: [
          {
            code: 'SP28',
            name: 'Nzérékoré Centre',
            children: [
              { code: 'DT91', name: 'Nzérékoré Ville' },
              { code: 'DT92', name: 'Beyla' },
              { code: 'DT93', name: 'Guéckédou' },
              { code: 'DT94', name: 'Lola' },
              { code: 'DT95', name: 'Macenta' },
              { code: 'DT96', name: 'Yomou' }
            ]
          },
          {
            code: 'SP29',
            name: 'Beyla',
            children: [
              { code: 'DT97', name: 'Beyla Centre' },
              { code: 'DT98', name: 'Guéckédou' },
              { code: 'DT99', name: 'Macenta' }
            ]
          },
          {
            code: 'SP30',
            name: 'Guéckédou',
            children: [
              { code: 'DT100', name: 'Guéckédou Centre' },
              { code: 'DT101', name: 'Beyla' },
              { code: 'DT102', name: 'Macenta' }
            ]
          },
          {
            code: 'SP31',
            name: 'Lola',
            children: [
              { code: 'DT103', name: 'Lola Centre' },
              { code: 'DT104', name: 'Beyla' },
              { code: 'DT105', name: 'Macenta' }
            ]
          },
          {
            code: 'SP32',
            name: 'Macenta',
            children: [
              { code: 'DT106', name: 'Macenta Centre' },
              { code: 'DT107', name: 'Beyla' },
              { code: 'DT108', name: 'Guéckédou' }
            ]
          },
          {
            code: 'SP33',
            name: 'Yomou',
            children: [
              { code: 'DT109', name: 'Yomou Centre' },
              { code: 'DT110', name: 'Beyla' },
              { code: 'DT111', name: 'Macenta' }
            ]
          }
        ]
      }
    ]
  }
]

// Fonctions utilitaires pour récupérer les données géographiques
export const getRegions = (): GeographicLocation[] => {
  return GUINEA_GEOGRAPHY.map(region => ({
    code: region.code,
    name: region.name
  }))
}

export const getPrefecturesByRegion = (regionCode: string): GeographicLocation[] => {
  const region = GUINEA_GEOGRAPHY.find(r => r.code === regionCode)
  return region?.children?.map(prefecture => ({
    code: prefecture.code,
    name: prefecture.name
  })) || []
}

export const getSousPrefecturesByPrefecture = (prefectureCode: string): GeographicLocation[] => {
  for (const region of GUINEA_GEOGRAPHY) {
    const prefecture = region.children?.find(p => p.code === prefectureCode)
    if (prefecture) {
      return prefecture.children?.map(sousPrefecture => ({
        code: sousPrefecture.code,
        name: sousPrefecture.name
      })) || []
    }
  }
  return []
}

export const getDistrictsBySousPrefecture = (sousPrefectureCode: string): GeographicLocation[] => {
  for (const region of GUINEA_GEOGRAPHY) {
    for (const prefecture of region.children || []) {
      const sousPrefecture = prefecture.children?.find(sp => sp.code === sousPrefectureCode)
      if (sousPrefecture) {
        return sousPrefecture.children || []
      }
    }
  }
  return []
}

// Fonction pour obtenir tous les districts et quartiers de Guinée (pour les lieux de résidence 2 et 3)
export const getAllDistrictsAndQuartiers = (): GeographicLocation[] => {
  const allDistricts: GeographicLocation[] = []
  
  for (const region of GUINEA_GEOGRAPHY) {
    for (const prefecture of region.children || []) {
      for (const sousPrefecture of prefecture.children || []) {
        for (const district of sousPrefecture.children || []) {
          allDistricts.push(district)
        }
      }
    }
  }
  
  return allDistricts
}

// Fonction pour obtenir les districts et quartiers d'une sous-préfecture spécifique
export const getDistrictsBySousPrefectureCode = (sousPrefectureCode: string): GeographicLocation[] => {
  for (const region of GUINEA_GEOGRAPHY) {
    for (const prefecture of region.children || []) {
      const sousPrefecture = prefecture.children?.find(sp => sp.code === sousPrefectureCode)
      if (sousPrefecture) {
        return sousPrefecture.children || []
      }
    }
  }
  return []
}

// Codes pour les régions (pour compatibilité avec l'existant)
export const REGION_CODES_GUINEA = [
  { code: 'RG01', label: 'Conakry' },
  { code: 'RG02', label: 'Basse-Guinée' },
  { code: 'RG03', label: 'Moyenne-Guinée (Fouta-Djallon)' },
  { code: 'RG04', label: 'Haute-Guinée' },
  { code: 'RG05', label: 'Guinée forestière' }
]

// Codes pour les préfectures
export const PREFECTURE_CODES_GUINEA = [
  { code: 'PR01', label: 'Conakry' },
  { code: 'PR02', label: 'Boké' },
  { code: 'PR03', label: 'Kindia' },
  { code: 'PR04', label: 'Mamou' },
  { code: 'PR05', label: 'Labé' },
  { code: 'PR06', label: 'Faranah' },
  { code: 'PR07', label: 'Kankan' },
  { code: 'PR08', label: 'Nzérékoré' }
]

// Codes pour les sous-préfectures
export const SOUS_PREFECTURE_CODES_GUINEA = [
  { code: 'SP01', label: 'Conakry Centre' },
  { code: 'SP02', label: 'Boké Centre' },
  { code: 'SP03', label: 'Fria' },
  { code: 'SP04', label: 'Gaoual' },
  { code: 'SP05', label: 'Koundara' },
  { code: 'SP06', label: 'Kindia Centre' },
  { code: 'SP07', label: 'Coyah' },
  { code: 'SP08', label: 'Dubréka' },
  { code: 'SP09', label: 'Forecariah' },
  { code: 'SP10', label: 'Télimélé' },
  { code: 'SP11', label: 'Mamou Centre' },
  { code: 'SP12', label: 'Dalaba' },
  { code: 'SP13', label: 'Pita' },
  { code: 'SP14', label: 'Labé Centre' },
  { code: 'SP15', label: 'Koubia' },
  { code: 'SP16', label: 'Lélouma' },
  { code: 'SP17', label: 'Mali' },
  { code: 'SP18', label: 'Tougué' },
  { code: 'SP19', label: 'Faranah Centre' },
  { code: 'SP20', label: 'Dabola' },
  { code: 'SP21', label: 'Dinguiraye' },
  { code: 'SP22', label: 'Kissidougou' },
  { code: 'SP23', label: 'Kankan Centre' },
  { code: 'SP24', label: 'Kérouané' },
  { code: 'SP25', label: 'Kouroussa' },
  { code: 'SP26', label: 'Mandiana' },
  { code: 'SP27', label: 'Siguiri' },
  { code: 'SP28', label: 'Nzérékoré Centre' },
  { code: 'SP29', label: 'Beyla' },
  { code: 'SP30', label: 'Guéckédou' },
  { code: 'SP31', label: 'Lola' },
  { code: 'SP32', label: 'Macenta' },
  { code: 'SP33', label: 'Yomou' }
]

// Codes pour les districts et quartiers
export const DISTRICT_CODES_GUINEA = [
  { code: 'DT01', label: 'Kaloum' },
  { code: 'DT02', label: 'Dixinn' },
  { code: 'DT03', label: 'Matam' },
  { code: 'DT04', label: 'Matoto' },
  { code: 'DT05', label: 'Ratoma' },
  { code: 'DT06', label: 'Boké Ville' },
  { code: 'DT07', label: 'Kamsar' },
  { code: 'DT08', label: 'Sangarédi' },
  { code: 'DT09', label: 'Tanéné' },
  { code: 'DT10', label: 'Fria Ville' },
  { code: 'DT11', label: 'Bambéto' },
  { code: 'DT12', label: 'Tinguilinta' },
  { code: 'DT13', label: 'Gaoual Centre' },
  { code: 'DT14', label: 'Koundara' },
  { code: 'DT15', label: 'Malanta' },
  { code: 'DT16', label: 'Koundara Centre' },
  { code: 'DT17', label: 'Sambailo' },
  { code: 'DT18', label: 'Youkounkoun' },
  { code: 'DT19', label: 'Kindia Ville' },
  { code: 'DT20', label: 'Coyah' },
  { code: 'DT21', label: 'Dubréka' },
  { code: 'DT22', label: 'Forecariah' },
  { code: 'DT23', label: 'Coyah Centre' },
  { code: 'DT24', label: 'Boffa' },
  { code: 'DT25', label: 'Fria' },
  { code: 'DT26', label: 'Dubréka Centre' },
  { code: 'DT27', label: 'Boffa' },
  { code: 'DT28', label: 'Forecariah' },
  { code: 'DT29', label: 'Forecariah Centre' },
  { code: 'DT30', label: 'Boffa' },
  { code: 'DT31', label: 'Coyah' },
  { code: 'DT32', label: 'Télimélé Centre' },
  { code: 'DT33', label: 'Gaoual' },
  { code: 'DT34', label: 'Koundara' },
  { code: 'DT35', label: 'Mamou Ville' },
  { code: 'DT36', label: 'Dalaba' },
  { code: 'DT37', label: 'Pita' },
  { code: 'DT38', label: 'Dalaba Centre' },
  { code: 'DT39', label: 'Ditinn' },
  { code: 'DT40', label: 'Mamou' },
  { code: 'DT41', label: 'Pita Centre' },
  { code: 'DT42', label: 'Ditinn' },
  { code: 'DT43', label: 'Mamou' },
  { code: 'DT44', label: 'Labé Ville' },
  { code: 'DT45', label: 'Koubia' },
  { code: 'DT46', label: 'Lélouma' },
  { code: 'DT47', label: 'Mali' },
  { code: 'DT48', label: 'Tougué' },
  { code: 'DT49', label: 'Koubia Centre' },
  { code: 'DT50', label: 'Lélouma' },
  { code: 'DT51', label: 'Mali' },
  { code: 'DT52', label: 'Lélouma Centre' },
  { code: 'DT53', label: 'Koubia' },
  { code: 'DT54', label: 'Mali' },
  { code: 'DT55', label: 'Mali Centre' },
  { code: 'DT56', label: 'Koubia' },
  { code: 'DT57', label: 'Lélouma' },
  { code: 'DT58', label: 'Tougué Centre' },
  { code: 'DT59', label: 'Koubia' },
  { code: 'DT60', label: 'Mali' },
  { code: 'DT61', label: 'Faranah Ville' },
  { code: 'DT62', label: 'Dabola' },
  { code: 'DT63', label: 'Dinguiraye' },
  { code: 'DT64', label: 'Kissidougou' },
  { code: 'DT65', label: 'Dabola Centre' },
  { code: 'DT66', label: 'Dinguiraye' },
  { code: 'DT67', label: 'Faranah' },
  { code: 'DT68', label: 'Dinguiraye Centre' },
  { code: 'DT69', label: 'Dabola' },
  { code: 'DT70', label: 'Faranah' },
  { code: 'DT71', label: 'Kissidougou Centre' },
  { code: 'DT72', label: 'Dabola' },
  { code: 'DT73', label: 'Faranah' },
  { code: 'DT74', label: 'Kankan Ville' },
  { code: 'DT75', label: 'Kérouané' },
  { code: 'DT76', label: 'Kouroussa' },
  { code: 'DT77', label: 'Mandiana' },
  { code: 'DT78', label: 'Siguiri' },
  { code: 'DT79', label: 'Kérouané Centre' },
  { code: 'DT80', label: 'Kouroussa' },
  { code: 'DT81', label: 'Mandiana' },
  { code: 'DT82', label: 'Kouroussa Centre' },
  { code: 'DT83', label: 'Kérouané' },
  { code: 'DT84', label: 'Mandiana' },
  { code: 'DT85', label: 'Mandiana Centre' },
  { code: 'DT86', label: 'Kérouané' },
  { code: 'DT87', label: 'Kouroussa' },
  { code: 'DT88', label: 'Siguiri Centre' },
  { code: 'DT89', label: 'Kérouané' },
  { code: 'DT90', label: 'Kouroussa' },
  { code: 'DT91', label: 'Nzérékoré Ville' },
  { code: 'DT92', label: 'Beyla' },
  { code: 'DT93', label: 'Guéckédou' },
  { code: 'DT94', label: 'Lola' },
  { code: 'DT95', label: 'Macenta' },
  { code: 'DT96', label: 'Yomou' },
  { code: 'DT97', label: 'Beyla Centre' },
  { code: 'DT98', label: 'Guéckédou' },
  { code: 'DT99', label: 'Macenta' },
  { code: 'DT100', label: 'Guéckédou Centre' },
  { code: 'DT101', label: 'Beyla' },
  { code: 'DT102', label: 'Macenta' },
  { code: 'DT103', label: 'Lola Centre' },
  { code: 'DT104', label: 'Beyla' },
  { code: 'DT105', label: 'Macenta' },
  { code: 'DT106', label: 'Macenta Centre' },
  { code: 'DT107', label: 'Beyla' },
  { code: 'DT108', label: 'Guéckédou' },
  { code: 'DT109', label: 'Yomou Centre' },
  { code: 'DT110', label: 'Beyla' },
  { code: 'DT111', label: 'Macenta' }
]








