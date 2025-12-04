import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { VideoRecorder } from '../../components/VideoRecorder'
import {
  getContinents,
  getCountriesByContinent,
  getRegionsByCountry,
  getPrefecturesByRegion,
  getSousPrefecturesByPrefecture,
  getQuartiersBySousPrefecture,
  type GeographicLocation
} from '../../utils/worldGeography'
import { FAMILLES, ETHNIES, ETHNIE_CODES, FAMILLE_CODES } from '../../utils/constants'

interface DeceasedFormData {
  // Page 1 - Ô Dieu, pardonne-lui, fais-lui miséricorde et efface ses fautes.
  famillePere: string
  prenomPere: string
  pereStatut: string
  numeroHPere: string
  familleMere: string
  prenomMere: string
  numeroHMere: string
  mereStatut: string
  nomFamille: string
  prenom: string
  genre: string
  dateNaissance: string
  lieuNaissance: string
  rangNaissance: string
  dateDeces: string
  lieuDeces: string
  
  // Page 2 - Ô Dieu, fais de sa tombe une lumière et un jardin du Paradis.
  ethnie: string
  lieuResidence1: string
  lieuResidence2: string
  lieuResidence3: string
  religion: string
  statutSocial: string
  origine: string
  // Nouveaux champs géographiques mondiaux
  continent?: string
  continentCode?: string
  pays: string
  paysCode?: string
  region: string
  regionCode?: string
  prefecture?: string
  prefectureCode?: string
  sousPrefecture?: string
  sousPrefectureCode?: string
  quartier?: string
  quartierCode?: string
  
  // Page 3 - Ô Dieu, réunis-le avec sa famille dans le Firdaws
  nbFreresMere: number
  nbSoeursMere: number
  nbFreresPere: number
  nbSoeursPere: number
  nbFilles: number
  nbGarcons: number
  photo: File | null
  video: Blob | null
  decet: string
  generation: string
}

import { FAMILLES, ETHNIES, ETHNIE_CODES, FAMILLE_CODES } from '../../utils/constants'
const REGIONS = ['Basse-Guinée', 'Fouta-Djallon', 'Haute-Guinée', 'Guinée forestière']
const RELIGIONS = ['Islam', 'Christianisme', 'Animisme', 'Autre']
const STATUTS_SOCIAUX = ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf / Veuve', 'Autre']
const GENRES = ['Homme', 'Femme']

export function DeceasedWrittenForm() {
  const [formData, setFormData] = useState<DeceasedFormData>({
    famillePere: '',
    prenomPere: '',
    pereStatut: '',
    numeroHPere: '',
    familleMere: '',
    prenomMere: '',
    numeroHMere: '',
    mereStatut: '',
    nomFamille: '',
    prenom: '',
    genre: '',
    dateNaissance: '',
    lieuNaissance: '',
    rangNaissance: '',
    dateDeces: '',
    lieuDeces: '',
    ethnie: '',
    lieuResidence1: '',
    lieuResidence2: '',
    lieuResidence3: '',
    religion: '',
    statutSocial: '',
    origine: '',
    pays: '',
    region: '',
    nbFreresMere: 0,
    nbSoeursMere: 0,
    nbFreresPere: 0,
    nbSoeursPere: 0,
    nbFilles: 0,
    nbGarcons: 0,
    photo: null,
    video: null,
    decet: '',
    generation: ''
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  // Logique hiérarchique pour les données géographiques mondiales
  const continents = useMemo(() => getContinents(), [])
  const countries = useMemo(() => 
    formData.continentCode ? getCountriesByContinent(formData.continentCode) : [], 
    [formData.continentCode]
  )
  const regions = useMemo(() => 
    formData.paysCode && formData.continentCode ? getRegionsByCountry(formData.paysCode, formData.continentCode) : [], 
    [formData.paysCode, formData.continentCode]
  )
  const prefectures = useMemo(() => 
    formData.regionCode && formData.paysCode && formData.continentCode ? getPrefecturesByRegion(formData.regionCode, formData.paysCode, formData.continentCode) : [], 
    [formData.regionCode, formData.paysCode, formData.continentCode]
  )
  const sousPrefectures = useMemo(() => 
    formData.prefectureCode && formData.regionCode && formData.paysCode && formData.continentCode ? getSousPrefecturesByPrefecture(formData.prefectureCode, formData.regionCode, formData.paysCode, formData.continentCode) : [], 
    [formData.prefectureCode, formData.regionCode, formData.paysCode, formData.continentCode]
  )
  const quartiers = useMemo(() => 
    formData.sousPrefectureCode && formData.prefectureCode && formData.regionCode && formData.paysCode && formData.continentCode ? getQuartiersBySousPrefecture(formData.sousPrefectureCode, formData.prefectureCode, formData.regionCode, formData.paysCode, formData.continentCode) : [], 
    [formData.sousPrefectureCode, formData.prefectureCode, formData.regionCode, formData.paysCode, formData.continentCode]
  )

  const calculateDecet = (dateDeces: string): string => {
    if (!dateDeces) return ''
    const deathDate = new Date(dateDeces)
    const deathYear = deathDate.getFullYear()
    const anneeDepart = -3869 // 3870 av. J.-C.
    const ecart = deathYear - anneeDepart
    const decetIndex = Math.floor(ecart / 63) + 1
    const decetNumber = Math.max(1, Math.min(200, decetIndex))
    return `D${decetNumber}`
  }

  const calculateGeneration = (dateNaissance: string): string => {
    if (!dateNaissance) return ''
    const birthDate = new Date(dateNaissance)
    const birthYear = birthDate.getFullYear()
    const anneeDepart = -4003
    const ecart = birthYear - anneeDepart
    const generationIndex = Math.floor(ecart / 63) + 1
    const generationNumber = Math.max(1, Math.min(200, generationIndex))
    return `G${generationNumber}`
  }

  const calculateAge = (dateNaissance: string, dateDeces: string): number => {
    if (!dateNaissance || !dateDeces) return 0
    const birth = new Date(dateNaissance)
    const death = new Date(dateDeces)
    let age = death.getFullYear() - birth.getFullYear()
    const monthDiff = death.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const calculateYearsSinceDeath = (dateDeces: string): number => {
    if (!dateDeces) return 0
    const death = new Date(dateDeces)
    const now = new Date()
    let years = now.getFullYear() - death.getFullYear()
    const monthDiff = now.getMonth() - death.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < death.getDate())) {
      years--
    }
    return years
  }

  const generateNumeroHD = (data: DeceasedFormData): string => {
    const decet = calculateDecet(data.dateDeces)
    const generation = calculateGeneration(data.dateNaissance)
    
    // Utiliser les codes géographiques sélectionnés ou valeurs par défaut
    const continentCode = data.continentCode || 'C1'
    const paysCode = data.paysCode || 'P1'
    const regionCode = data.regionCode || 'R1'
    
    // Utiliser les codes depuis constants.ts avec fallback automatique
    const ethnieEntry = ETHNIE_CODES.find(e => e.label === data.ethnie)
    const familleEntry = FAMILLE_CODES.find(f => f.label.toLowerCase() === (data.nomFamille || '').toLowerCase())
    
    // Générer un code automatique si non trouvé
    const generateAutoCode = (name: string, prefix: string, existingCodes: string[]): string => {
      if (!name) return prefix + '999'
      const cleanName = name.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
      let codeNum = 1
      let code = prefix + codeNum.toString().padStart(3, '0')
      while (existingCodes.includes(code) && codeNum < 999) {
        codeNum++
        code = prefix + codeNum.toString().padStart(3, '0')
      }
      return code
    }
    
    const ethnieCode = ethnieEntry?.code || generateAutoCode(data.ethnie || '', 'E', ETHNIE_CODES.map(e => e.code))
    const familleCode = familleEntry?.code || generateAutoCode(data.nomFamille || '', 'F', FAMILLE_CODES.map(f => f.code))
    
    // Générer un numéro unique basé sur le préfixe complet pour défunt
    const prefix = `${decet}${generation}${continentCode}${paysCode}${regionCode}${ethnieCode}${familleCode}`
    const counterKey = `numeroHD_counter_${prefix}`
    const counter = parseInt(localStorage.getItem(counterKey) || '0', 10) || 0
    const nextNumber = counter + 1
    localStorage.setItem(counterKey, String(nextNumber))
    
    return `${prefix} ${nextNumber}`
  }

  const handleVideoRecorded = (videoBlob: Blob) => {
    setFormData(prev => ({ ...prev, video: videoBlob }))
  }

  const handleSubmit = () => {
    const numeroHD = generateNumeroHD(formData)
    const completeData = { 
      ...formData, 
      numeroHD,
      decet: calculateDecet(formData.dateDeces),
      generation: calculateGeneration(formData.dateNaissance),
      age: calculateAge(formData.dateNaissance, formData.dateDeces),
      yearsSinceDeath: calculateYearsSinceDeath(formData.dateDeces)
    }
    
    // ✅ IMPORTANT : Les défunts n'ont PAS de compte, ils existent uniquement dans l'arbre généalogique
    localStorage.setItem('defunt_ecrit', JSON.stringify(completeData))
    localStorage.setItem('dernier_defunt', JSON.stringify(completeData))
    
    // ❌ NE PAS créer de session - les défunts ne peuvent pas se connecter
    // Les défunts existent uniquement dans l'arbre généalogique pour consultation
    
    // Afficher le succès avec le numeroHD généré automatiquement
    alert(`✅ Défunt enregistré avec succès dans l'arbre généalogique !\n\nNumeroHD généré automatiquement : ${numeroHD}\n\n⚠️ IMPORTANT : Les défunts n'ont pas de compte de connexion.\nIls existent uniquement dans l'arbre généalogique familial pour consultation.`)
    
    // Rediriger vers la page d'accueil après 2 secondes
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  const updateField = (field: keyof DeceasedFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (currentPage === 1) {
    return (
      <div className="stack">
        <h2>Ô Dieu, pardonne-lui, fais-lui miséricorde et efface ses fautes.</h2>
        <div className="card">
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Famille (nom père)</label>
                <select value={formData.famillePere} onChange={(e) => updateField('famillePere', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {FAMILLES.map(famille => <option key={famille} value={famille}>{famille}</option>)}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Prénom du père</label>
                <input value={formData.prenomPere} onChange={(e) => updateField('prenomPere', e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Père Vivant ou Mort</label>
                <select value={formData.pereStatut} onChange={(e) => updateField('pereStatut', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option value="Vivant">Vivant</option>
                  <option value="Mort">Mort</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>NuméroH (père)</label>
                <input value={formData.numeroHPere} onChange={(e) => updateField('numeroHPere', e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Nom de mère (famille)</label>
                <select value={formData.familleMere} onChange={(e) => updateField('familleMere', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {FAMILLES.map(famille => <option key={famille} value={famille}>{famille}</option>)}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Prénom de mère</label>
                <input value={formData.prenomMere} onChange={(e) => updateField('prenomMere', e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Mère Vivant ou Mort</label>
                <select value={formData.mereStatut} onChange={(e) => updateField('mereStatut', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option value="Vivant">Vivant</option>
                  <option value="Mort">Mort</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>NuméroH/HD (mère)</label>
                <input value={formData.numeroHMere} onChange={(e) => updateField('numeroHMere', e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Famille (Nom)</label>
                <input value={formData.nomFamille} onChange={(e) => updateField('nomFamille', e.target.value)} />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Prénom</label>
                <input value={formData.prenom} onChange={(e) => updateField('prenom', e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Genre</label>
                <select value={formData.genre} onChange={(e) => updateField('genre', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {GENRES.map(genre => <option key={genre} value={genre}>{genre}</option>)}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Date de naissance</label>
                <input 
                  type="date" 
                  value={formData.dateNaissance} 
                  onChange={(e) => {
                    updateField('dateNaissance', e.target.value)
                    updateField('generation', calculateGeneration(e.target.value))
                  }} 
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Lieu de naissance</label>
                <input value={formData.lieuNaissance} onChange={(e) => updateField('lieuNaissance', e.target.value)} />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Rang de naissance</label>
                <select value={formData.rangNaissance} onChange={(e) => updateField('rangNaissance', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {Array.from({length:20},(_,i)=>i+1).map(n=> <option key={n} value={String(n)}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Année de décès</label>
                <input 
                  type="date" 
                  value={formData.dateDeces} 
                  onChange={(e) => {
                    updateField('dateDeces', e.target.value)
                    updateField('decet', calculateDecet(e.target.value))
                  }} 
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Lieu de décès</label>
                <input value={formData.lieuDeces} onChange={(e) => updateField('lieuDeces', e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Génération (auto)</label>
                <input value={formData.generation} readOnly className="readonly" />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Décet (auto)</label>
                <input value={formData.decet} readOnly className="readonly" />
              </div>
            </div>
          </div>
          
          <div className="actions">
            <button className="btn" onClick={() => setCurrentPage(2)}>
              Page suivante
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === 2) {
    return (
      <div className="stack">
        <h2>Ô Dieu, fais de sa tombe une lumière et un jardin du Paradis.</h2>
        <div className="card">
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Ethnies</label>
                <select value={formData.ethnie} onChange={(e) => updateField('ethnie', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {ETHNIES.map(ethnie => <option key={ethnie} value={ethnie}>{ethnie}</option>)}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Religion</label>
                <select value={formData.religion} onChange={(e) => updateField('religion', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {RELIGIONS.map(religion => <option key={religion} value={religion}>{religion}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-4">
              <div className="field">
                <label>Lieu de résidence 1</label>
                <input value={formData.lieuResidence1} onChange={(e) => updateField('lieuResidence1', e.target.value)} />
              </div>
            </div>
            <div className="col-4">
              <div className="field">
                <label>Lieu de résidence 2</label>
                <input value={formData.lieuResidence2} onChange={(e) => updateField('lieuResidence2', e.target.value)} />
              </div>
            </div>
            <div className="col-4">
              <div className="field">
                <label>Lieu de résidence 3</label>
                <input value={formData.lieuResidence3} onChange={(e) => updateField('lieuResidence3', e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Statut social</label>
                <select value={formData.statutSocial} onChange={(e) => updateField('statutSocial', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {STATUTS_SOCIAUX.map(statut => <option key={statut} value={statut}>{statut}</option>)}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Origine</label>
                <input value={formData.origine} onChange={(e) => updateField('origine', e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Pays (nationalité)</label>
                <select value={formData.pays} onChange={(e) => updateField('pays', e.target.value)}>
                  <option value="">Sélectionner</option>
                  <option value="Égypte">Égypte</option>
                  <option value="Guinée">Guinée</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Région (Origine)</label>
                <select value={formData.region} onChange={(e) => updateField('region', e.target.value)}>
                  <option value="">Sélectionner</option>
                  {REGIONS.map(region => <option key={region} value={region}>{region}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="actions">
            <button className="btn secondary" onClick={() => setCurrentPage(1)}>
              Page précédente
            </button>
            <button className="btn" onClick={() => setCurrentPage(3)}>
              Page suivante
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === 3) {
    return (
      <div className="stack">
        <h2>Ô Dieu, réunis-le avec sa famille dans le Firdaws (le Paradis suprême), comme Tu les avais réunis dans cette vie.</h2>
        <div className="card">
          <div className="row">
            <div className="col-3">
              <div className="field">
                <label>Frères même mère</label>
                <input 
                  type="number" 
                  min="0" 
                  value={formData.nbFreresMere} 
                  onChange={(e) => updateField('nbFreresMere', Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="col-3">
              <div className="field">
                <label>Sœurs même mère</label>
                <input 
                  type="number" 
                  min="0" 
                  value={formData.nbSoeursMere} 
                  onChange={(e) => updateField('nbSoeursMere', Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="col-3">
              <div className="field">
                <label>Frères même père</label>
                <input 
                  type="number" 
                  min="0" 
                  value={formData.nbFreresPere} 
                  onChange={(e) => updateField('nbFreresPere', Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="col-3">
              <div className="field">
                <label>Sœurs même père</label>
                <input 
                  type="number" 
                  min="0" 
                  value={formData.nbSoeursPere} 
                  onChange={(e) => updateField('nbSoeursPere', Number(e.target.value))} 
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Filles</label>
                <input 
                  type="number" 
                  min="0" 
                  value={formData.nbFilles} 
                  onChange={(e) => updateField('nbFilles', Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Garçons</label>
                <input 
                  type="number" 
                  min="0" 
                  value={formData.nbGarcons} 
                  onChange={(e) => updateField('nbGarcons', Number(e.target.value))} 
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Photo de preuve d'existence</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="user"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) updateField('photo', file)
                  }}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Vidéo (1 minute)</label>
                <VideoRecorder 
                  onVideoRecorded={handleVideoRecorded}
                  maxDuration={1}
                />
              </div>
            </div>
          </div>
          
          <div className="actions">
            <button className="btn secondary" onClick={() => setCurrentPage(2)}>
              Page précédente
            </button>
            <button className="btn" onClick={handleSubmit}>
              Soumettre
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
