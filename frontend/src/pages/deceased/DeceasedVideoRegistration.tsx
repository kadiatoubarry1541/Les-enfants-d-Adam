import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VideoRecorder } from '../../components/VideoRecorder'

interface DeceasedVideoData {
  numeroHPere: string
  numeroHMere: string
  continent: string
  dateNaissance: string
  pays: string
  region: string
  ethnie: string
  famille: string
  dateDeces: string
  video: Blob | null
  photo: File | null
  decet: string
  generation: string
}

export function DeceasedVideoRegistration() {
  const [deceasedData, setDeceasedData] = useState<DeceasedVideoData>({
    numeroHPere: '',
    numeroHMere: '',
    continent: 'Afrique',
    dateNaissance: '',
    pays: '',
    region: '',
    ethnie: '',
    famille: '',
    dateDeces: '',
    video: null,
    photo: null,
    decet: '',
    generation: ''
  })
  const [currentStep, setCurrentStep] = useState<'form' | 'video' | 'complete'>('form')
  
  const navigate = useNavigate()

  const handleVideoRecorded = (videoBlob: Blob) => {
    setDeceasedData(prev => ({ ...prev, video: videoBlob }))
    setCurrentStep('complete')
  }

  const calculateDecet = (dateDeces: string): string => {
    if (!dateDeces) return ''
    
    const deathDate = new Date(dateDeces)
    const deathYear = deathDate.getFullYear()
    
    // Calcul basé sur 3870 av. J.-C. (mort d'Abel)
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
    
    // Calcul basé sur 4004 av. J.-C. comme année 0
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

  const generateNumeroHD = (data: DeceasedVideoData): string => {
    const decet = calculateDecet(data.dateDeces)
    const generation = calculateGeneration(data.dateNaissance)
    const continent = 'C1' // Afrique
    const pays = data.pays === 'Guinée' ? 'P2' : 'P1'
    
    // Codes pour les régions
    const regionCodes: { [key: string]: string } = {
      'Basse-Guinée': 'R1',
      'Fouta-Djallon': 'R2',
      'Haute-Guinée': 'R3',
      'Guinée forestière': 'R4'
    }
    
    // Codes pour les ethnies
    const ethnieCodes: { [key: string]: string } = {
      'Peuls': 'E1',
      'Malinkés': 'E2',
      'Soussous': 'E3',
      'Kissi': 'E4',
      'Toma': 'E5'
    }
    
    // Codes pour les familles
    const familleCodes: { [key: string]: string } = {
      'Barry': 'F1',
      'Diallo': 'F2',
      'Sow': 'F3',
      'Bah': 'F4',
      'Balde': 'F5',
      'Camara': 'F6',
      'Keita': 'F7'
    }
    
    const regionCode = regionCodes[data.region] || 'R1'
    const ethnieCode = ethnieCodes[data.ethnie] || 'E1'
    const familleCode = familleCodes[data.famille] || 'F1'
    
    // Générer un numéro unique
    const counter = localStorage.getItem('numeroHD_counter') || '0'
    const nextNumber = parseInt(counter) + 1
    localStorage.setItem('numeroHD_counter', nextNumber.toString())
    
    return `${decet}${generation}${continent}${pays}${regionCode}${ethnieCode}${familleCode} ${nextNumber}`
  }

  const handleSubmit = () => {
    if (!deceasedData.video) {
      alert('Veuillez enregistrer votre vidéo.')
      return
    }

    const numeroHD = generateNumeroHD(deceasedData)
    const completeData = { 
      ...deceasedData, 
      numeroHD,
      decet: calculateDecet(deceasedData.dateDeces),
      generation: calculateGeneration(deceasedData.dateNaissance),
      age: calculateAge(deceasedData.dateNaissance, deceasedData.dateDeces),
      yearsSinceDeath: calculateYearsSinceDeath(deceasedData.dateDeces)
    }
    
    // Sauvegarder les données
    localStorage.setItem('defunt_video', JSON.stringify(completeData))
    
    setCurrentStep('complete')
  }

  if (currentStep === 'form') {
    return (
      <div className="stack">
        <h2>Informations du défunt</h2>
        <div className="card">
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>NuméroH/HD (Père)</label>
                <input 
                  value={deceasedData.numeroHPere}
                  onChange={(e) => setDeceasedData(prev => ({ ...prev, numeroHPere: e.target.value }))}
                  placeholder="Ex: G1C1P1R1E1F1 1"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>NuméroH/HD (Mère)</label>
                <input 
                  value={deceasedData.numeroHMere}
                  onChange={(e) => setDeceasedData(prev => ({ ...prev, numeroHMere: e.target.value }))}
                  placeholder="Ex: G1C1P1R1E1F1 2"
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Continent</label>
                <select value={deceasedData.continent} onChange={(e) => setDeceasedData(prev => ({ ...prev, continent: e.target.value }))}>
                  <option value="Afrique">Afrique</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Date de naissance</label>
                <input 
                  type="date"
                  value={deceasedData.dateNaissance}
                  onChange={(e) => {
                    const generation = calculateGeneration(e.target.value)
                    setDeceasedData(prev => ({ ...prev, dateNaissance: e.target.value, generation }))
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Pays</label>
                <select value={deceasedData.pays} onChange={(e) => setDeceasedData(prev => ({ ...prev, pays: e.target.value }))}>
                  <option value="">Sélectionner</option>
                  <option value="Égypte">Égypte</option>
                  <option value="Guinée">Guinée</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Région</label>
                <select value={deceasedData.region} onChange={(e) => setDeceasedData(prev => ({ ...prev, region: e.target.value }))}>
                  <option value="">Sélectionner</option>
                  <option value="Basse-Guinée">Basse-Guinée</option>
                  <option value="Fouta-Djallon">Fouta-Djallon</option>
                  <option value="Haute-Guinée">Haute-Guinée</option>
                  <option value="Guinée forestière">Guinée forestière</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Ethnie</label>
                <select value={deceasedData.ethnie} onChange={(e) => setDeceasedData(prev => ({ ...prev, ethnie: e.target.value }))}>
                  <option value="">Sélectionner</option>
                  <option value="Peuls">Peuls</option>
                  <option value="Malinkés">Malinkés</option>
                  <option value="Soussous">Soussous</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Famille</label>
                <select value={deceasedData.famille} onChange={(e) => setDeceasedData(prev => ({ ...prev, famille: e.target.value }))}>
                  <option value="">Sélectionner</option>
                  <option value="Barry">Barry</option>
                  <option value="Diallo">Diallo</option>
                  <option value="Sow">Sow</option>
                  <option value="Bah">Bah</option>
                  <option value="Balde">Balde</option>
                  <option value="Camara">Camara</option>
                  <option value="Keita">Keita</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Date de décès</label>
                <input 
                  type="date"
                  value={deceasedData.dateDeces}
                  onChange={(e) => {
                    const decet = calculateDecet(e.target.value)
                    setDeceasedData(prev => ({ ...prev, dateDeces: e.target.value, decet }))
                  }}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Photo de preuve</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="user"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setDeceasedData(prev => ({ ...prev, photo: file }))
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Décet (auto)</label>
                <input 
                  value={deceasedData.decet}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Génération (auto)</label>
                <input 
                  value={deceasedData.generation}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
          </div>
          
          <div className="actions">
            <button 
              className="btn" 
              onClick={() => setCurrentStep('video')}
              disabled={!deceasedData.dateNaissance || !deceasedData.dateDeces || !deceasedData.pays || !deceasedData.region || !deceasedData.ethnie || !deceasedData.famille}
            >
              Enregistrer la vidéo
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'video') {
    return (
      <div className="stack">
        <h2>Enregistrement Vidéo</h2>
        <div className="card">
          <VideoRecorder 
            onVideoRecorded={handleVideoRecorded}
            maxDuration={3}
          />
          <div className="actions">
            <button className="btn" onClick={handleSubmit}>
              Terminer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'complete') {
    const numeroHD = generateNumeroHD(deceasedData)
    const age = calculateAge(deceasedData.dateNaissance, deceasedData.dateDeces)
    const yearsSinceDeath = calculateYearsSinceDeath(deceasedData.dateDeces)
    
    return (
      <div className="stack">
        <h2>Enregistrement Terminé</h2>
        <div className="card success-card">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3>Merci pour votre inscription</h3>
            <p>L'enregistrement du défunt a été effectué avec succès.</p>
            <div className="numero-h-display">
              <h4>NumeroHD :</h4>
              <div className="numero-h-value">{numeroHD}</div>
              <p><strong>⚠️ IMPORTANT :</strong> Les défunts n'ont pas de compte de connexion.</p>
              <p>Ils existent uniquement dans l'arbre généalogique familial pour consultation.</p>
              <p>Ce numéro permet de retrouver les informations du défunt dans l'arbre généalogique.</p>
            </div>
            <div className="deceased-info">
              <h4>Informations calculées :</h4>
              <p><strong>Âge au décès :</strong> {age} ans</p>
              <p><strong>Années écoulées depuis le décès :</strong> {yearsSinceDeath} ans</p>
              <p><strong>Décet :</strong> {deceasedData.decet}</p>
              <p><strong>Génération :</strong> {deceasedData.generation}</p>
            </div>
          </div>
          <div className="actions">
            <button className="btn" onClick={() => navigate('/')}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
