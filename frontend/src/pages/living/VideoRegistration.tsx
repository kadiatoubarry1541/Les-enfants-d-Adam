import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { VideoRecorder } from '../../components/VideoRecorder'
import { api } from '../../utils/api'
import {
  getContinents,
  getCountriesByContinent,
  getRegionsByCountry,
  getPrefecturesByRegion,
  getSousPrefecturesByPrefecture,
  getQuartiersBySousPrefecture,
  type GeographicLocation
} from '../../utils/worldGeography'

interface VideoData {
  numeroHPere: string
  numeroHMere: string
  continent: string
  continentCode: string
  dateNaissance: string
  pays: string
  paysCode: string
  region: string
  regionCode: string
  prefecture: string
  prefectureCode: string
  sousPrefecture: string
  sousPrefectureCode: string
  quartier: string
  quartierCode: string
  ethnie: string
  famille: string
  prenom: string
  telephone: string
  generation: string
  password: string
  confirmPassword: string
  video: Blob | null
  photo: File | null
  photoPreview: string | null
  genre: string
  
  // Activités professionnelles
  activite1: string
  activite2: string
  activite3: string
  
  // Champs de lieu de résidence
  lieu1: string
  lieu2: string
  lieu3: string
}

export function VideoRegistration() {
  const [videoData, setVideoData] = useState<VideoData>({
    numeroHPere: '',
    numeroHMere: '',
    continent: '',
    continentCode: '',
    dateNaissance: '',
    pays: '',
    paysCode: '',
    region: '',
    regionCode: '',
    prefecture: '',
    prefectureCode: '',
    sousPrefecture: '',
    sousPrefectureCode: '',
    quartier: '',
    quartierCode: '',
    ethnie: '',
    famille: '',
    prenom: '',
    telephone: '',
    generation: '',
    password: '',
    confirmPassword: '',
    video: null,
    photo: null,
    photoPreview: null,
    genre: 'HOMME',
    
    // Activités professionnelles
    activite1: '',
    activite2: '',
    activite3: '',
    
    // Champs de lieu de résidence
    lieu1: '',
    lieu2: '',
    lieu3: ''
  })
  const [currentStep, setCurrentStep] = useState<'form' | 'video' | 'complete'>('form')
  
  const navigate = useNavigate()

  // Logique hiérarchique pour les données géographiques mondiales
  const continents = useMemo(() => getContinents(), [])
  const countries = useMemo(() => 
    videoData.continentCode ? getCountriesByContinent(videoData.continentCode) : [], 
    [videoData.continentCode]
  )
  const regions = useMemo(() => 
    videoData.paysCode && videoData.continentCode ? getRegionsByCountry(videoData.paysCode, videoData.continentCode) : [], 
    [videoData.paysCode, videoData.continentCode]
  )
  const prefectures = useMemo(() => 
    videoData.regionCode && videoData.paysCode && videoData.continentCode ? getPrefecturesByRegion(videoData.regionCode, videoData.paysCode, videoData.continentCode) : [], 
    [videoData.regionCode, videoData.paysCode, videoData.continentCode]
  )
  const sousPrefectures = useMemo(() => 
    videoData.prefectureCode && videoData.regionCode && videoData.paysCode && videoData.continentCode ? getSousPrefecturesByPrefecture(videoData.prefectureCode, videoData.regionCode, videoData.paysCode, videoData.continentCode) : [], 
    [videoData.prefectureCode, videoData.regionCode, videoData.paysCode, videoData.continentCode]
  )
  const quartiers = useMemo(() => 
    videoData.sousPrefectureCode && videoData.prefectureCode && videoData.regionCode && videoData.paysCode && videoData.continentCode ? getQuartiersBySousPrefecture(videoData.sousPrefectureCode, videoData.prefectureCode, videoData.regionCode, videoData.paysCode, videoData.continentCode) : [], 
    [videoData.sousPrefectureCode, videoData.prefectureCode, videoData.regionCode, videoData.paysCode, videoData.continentCode]
  )

  const handleVideoRecorded = (videoBlob: Blob) => {
    setVideoData(prev => ({ ...prev, video: videoBlob }))
    setCurrentStep('complete')
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.')
        return
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La photo doit faire moins de 5MB.')
        return
      }
      
      // Créer un aperçu
      const reader = new FileReader()
      reader.onload = (e) => {
        setVideoData(prev => ({
          ...prev,
          photo: file,
          photoPreview: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setVideoData(prev => ({
      ...prev,
      photo: null,
      photoPreview: null
    }))
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

  const generateNumeroH = (data: VideoData): string => {
    const generation = calculateGeneration(data.dateNaissance)
    
    // Utiliser les codes géographiques sélectionnés
    const continentCode = data.continentCode || 'C1'
    const paysCode = data.paysCode || 'P1'
    const regionCode = data.regionCode || 'R1'
    
    // Codes pour les ethnies
    const ethnieCodes: { [key: string]: string } = {
      'Peuls': 'E1',
      'Malinkés': 'E2',
      'Soussous': 'E3',
      'Kissi': 'E4',
      'Toma': 'E5',
      'Guerzés': 'E6',
      'Kpelle': 'E7'
    }
    
    // Codes pour les familles
    const familleCodes: { [key: string]: string } = {
      'Barry': 'F1',
      'Diallo': 'F2',
      'Sow': 'F3',
      'Bah': 'F4',
      'Balde': 'F5',
      'Camara': 'F6',
      'Keita': 'F7',
      'Touré': 'F8',
      'Sylla': 'F9',
      'Kouyaté': 'F10'
    }
    
    const ethnieCode = ethnieCodes[data.ethnie] || 'E1'
    const familleCode = familleCodes[data.famille] || 'F1'
    
    // Générer un numéro unique basé sur le préfixe complet
    const prefix = `${generation}${continentCode}${paysCode}${regionCode}${ethnieCode}${familleCode}`
    const counterKey = `numeroH_counter_${prefix}`
    const counter = localStorage.getItem(counterKey) || '0'
    const nextNumber = parseInt(counter) + 1
    localStorage.setItem(counterKey, nextNumber.toString())
    
    return `${prefix} ${nextNumber}`
  }

  const handleSubmit = async () => {
    if (!videoData.video) {
      alert('Veuillez enregistrer votre vidéo.')
      return
    }

    // Vérifier que le mot de passe est défini
    if (!videoData.password || !videoData.confirmPassword) {
      alert('Veuillez définir un mot de passe.')
      return
    }

    if (videoData.password !== videoData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.')
      return
    }

    // Vérifier les champs obligatoires géographiques
    if (!videoData.continentCode) {
      alert('Veuillez sélectionner un continent.')
      return
    }
    if (!videoData.paysCode) {
      alert('Veuillez sélectionner un pays.')
      return
    }
    if (!videoData.regionCode) {
      alert('Veuillez sélectionner une région.')
      return
    }
    if (!videoData.prefectureCode) {
      alert('Veuillez sélectionner une préfecture.')
      return
    }
    if (!videoData.sousPrefectureCode) {
      alert('Veuillez sélectionner une sous-préfecture.')
      return
    }
    if (!videoData.quartierCode) {
      alert('Veuillez sélectionner un quartier.')
      return
    }
    if (!videoData.lieu1) {
      alert('Le lieu de résidence 1 est obligatoire.')
      return
    }

    const numeroH = generateNumeroH(videoData)
    const completeData = { 
      ...videoData, 
      numeroH,
      // S'assurer que le mot de passe est inclus
      password: videoData.password,
      confirmPassword: videoData.confirmPassword,
      prenom: videoData.prenom,
      nomFamille: videoData.famille,
      email: `${numeroH}@example.com`,
      genre: videoData.genre, // Utilise la valeur sélectionnée
      // Inclure la photo de profil (en base64 pour localStorage)
      photo: videoData.photoPreview, // Sauvegarder la version base64, pas l'objet File
      photoPreview: videoData.photoPreview,
      // Utiliser le quartier comme lieu1 par défaut si non renseigné
      lieu1: videoData.lieu1 || videoData.quartier || ''
    }
    
    console.log('💾 Sauvegarde des données:', completeData)
    
    try {
      // ✅ SAUVEGARDER DANS LA BASE DE DONNÉES
      const result = await api.registerLiving(completeData)
      
      if (result.success) {
        // ⚠️ IMPORTANT : S'assurer que le mot de passe EN CLAIR est sauvegardé
        // Le backend retourne l'utilisateur sans le mot de passe (sécurité)
        // Mais api.registerLiving() le rajoute déjà
        const userDataWithPassword = {
          ...result.user,
          password: videoData.password, // Forcer le mot de passe en clair
          confirmPassword: videoData.confirmPassword
        }
        
        // Sauvegarder en localStorage avec le mot de passe EN CLAIR
        localStorage.setItem('vivant_video', JSON.stringify(userDataWithPassword))
        localStorage.setItem('dernier_vivant', JSON.stringify(userDataWithPassword))
        
        // ✅ CRÉER LA SESSION pour connexion automatique
        localStorage.setItem('session_user', JSON.stringify({
          numeroH: numeroH,
          userData: userDataWithPassword,
          type: 'vivant',
          source: 'registration_video'
        }))
        
        console.log('✅ Données sauvegardées avec mot de passe EN CLAIR:', {
          numeroH: userDataWithPassword.numeroH,
          password: userDataWithPassword.password,
          hasPassword: !!userDataWithPassword.password,
          passwordLength: userDataWithPassword.password?.length
        })
        
        // Afficher le numeroH généré et rediriger vers la page d'accueil
        alert(`✅ Enregistrement réussi !\n\nVotre NumeroH : ${numeroH}\n\nVous êtes maintenant connecté automatiquement !`)
        
        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          navigate('/moi')
        }, 2000)
        
        setCurrentStep('complete')
      } else {
        alert(`❌ Erreur: ${result.message}`)
      }
    } catch (error) {
      console.error('Erreur enregistrement:', error)
      // Fallback vers localStorage seulement
      // S'assurer que le mot de passe EN CLAIR est dans completeData
      const dataWithClearPassword = {
        ...completeData,
        password: videoData.password, // Mot de passe EN CLAIR
        confirmPassword: videoData.confirmPassword
      }
      
      localStorage.setItem('vivant_video', JSON.stringify(dataWithClearPassword))
      localStorage.setItem('dernier_vivant', JSON.stringify(dataWithClearPassword))
      
      // ✅ CRÉER LA SESSION même en fallback
      localStorage.setItem('session_user', JSON.stringify({
        numeroH: numeroH,
        userData: dataWithClearPassword,
        type: 'vivant',
        source: 'registration_video_fallback'
      }))
      
      console.log('✅ Données sauvegardées en fallback avec mot de passe EN CLAIR:', {
        numeroH: dataWithClearPassword.numeroH,
        password: dataWithClearPassword.password,
        hasPassword: !!dataWithClearPassword.password,
        passwordLength: dataWithClearPassword.password?.length
      })
      
      // Afficher le numeroH généré et rediriger vers la page d'accueil
      alert(`⚠️ Sauvegardé localement.\n\nVotre NumeroH : ${numeroH}\n\nVous êtes maintenant connecté automatiquement !`)
      
      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate('/moi')
      }, 2000)
      
      setCurrentStep('complete')
    }
  }

  if (currentStep === 'form') {
    return (
      <div className="stack">
        <h2>Informations de base</h2>
        <div className="card">
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>NuméroH/HD (Père)</label>
                <input 
                  value={videoData.numeroHPere}
                  onChange={(e) => setVideoData(prev => ({ ...prev, numeroHPere: e.target.value }))}
                  placeholder="Ex: G1C1P1R1E1F1 1"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>NuméroH/HD (Mère)</label>
                <input 
                  value={videoData.numeroHMere}
                  onChange={(e) => setVideoData(prev => ({ ...prev, numeroHMere: e.target.value }))}
                  placeholder="Ex: G1C1P1R1E1F1 2"
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Date de naissance</label>
                <input 
                  type="date"
                  value={videoData.dateNaissance}
                  onChange={(e) => {
                    const generation = calculateGeneration(e.target.value)
                    setVideoData(prev => ({ ...prev, dateNaissance: e.target.value, generation }))
                  }}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Continent * {videoData.continentCode && <span className="text-blue-600 font-semibold">({videoData.continentCode})</span>}</label>
                <select 
                  value={videoData.continentCode} 
                  onChange={(e) => {
                    const selectedContinent = continents.find(c => c.code === e.target.value)
                    setVideoData(prev => ({ 
                      ...prev, 
                      continent: selectedContinent?.name || '',
                      continentCode: e.target.value,
                      pays: '',
                      paysCode: '',
                      region: '',
                      regionCode: '',
                      prefecture: '',
                      prefectureCode: '',
                      sousPrefecture: '',
                      sousPrefectureCode: '',
                      quartier: '',
                      quartierCode: ''
                    }))
                  }}
                  required
                  className={videoData.continentCode ? 'border-green-500' : ''}
                >
                  <option value="">🌍 Sélectionner un continent</option>
                  {continents.map(continent => (
                    <option key={continent.code} value={continent.code}>
                      {continent.name} ({continent.code})
                    </option>
                  ))}
                </select>
                {videoData.continentCode && (
                  <small className="text-green-600">✓ Continent sélectionné : {videoData.continent}</small>
                )}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Pays * {videoData.paysCode && <span className="text-blue-600 font-semibold">({videoData.paysCode})</span>}</label>
                <select 
                  value={videoData.paysCode} 
                  onChange={(e) => {
                    const selectedCountry = countries.find(c => c.code === e.target.value)
                    setVideoData(prev => ({ 
                      ...prev, 
                      pays: selectedCountry?.name || '',
                      paysCode: e.target.value,
                      region: '',
                      regionCode: '',
                      prefecture: '',
                      prefectureCode: '',
                      sousPrefecture: '',
                      sousPrefectureCode: '',
                      quartier: '',
                      quartierCode: ''
                    }))
                  }}
                  disabled={!videoData.continentCode}
                  required
                  className={videoData.paysCode ? 'border-green-500' : ''}
                >
                  <option value="">🌐 {videoData.continentCode ? 'Sélectionner un pays' : 'Sélectionnez d\'abord un continent'}</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                {!videoData.continentCode && (
                  <small className="text-orange-600">⚠️ Veuillez d'abord sélectionner un continent</small>
                )}
                {videoData.paysCode && (
                  <small className="text-green-600">✓ Pays sélectionné : {videoData.pays}</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Région * {videoData.regionCode && <span className="text-blue-600 font-semibold">({videoData.regionCode})</span>}</label>
                <select 
                  value={videoData.regionCode} 
                  onChange={(e) => {
                    const selectedRegion = regions.find(r => r.code === e.target.value)
                    setVideoData(prev => ({ 
                      ...prev, 
                      region: selectedRegion?.name || '',
                      regionCode: e.target.value,
                      prefecture: '',
                      prefectureCode: '',
                      sousPrefecture: '',
                      sousPrefectureCode: '',
                      quartier: '',
                      quartierCode: ''
                    }))
                  }}
                  disabled={!videoData.paysCode}
                  required
                  className={videoData.regionCode ? 'border-green-500' : ''}
                >
                  <option value="">🗺️ {videoData.paysCode ? 'Sélectionner une région' : 'Sélectionnez d\'abord un pays'}</option>
                  {regions.map(region => (
                    <option key={region.code} value={region.code}>
                      {region.name} ({region.code})
                    </option>
                  ))}
                </select>
                {!videoData.paysCode && (
                  <small className="text-orange-600">⚠️ Veuillez d'abord sélectionner un pays</small>
                )}
                {videoData.regionCode && (
                  <small className="text-green-600">✓ Région sélectionnée : {videoData.region}</small>
                )}
                {videoData.paysCode && regions.length === 0 && (
                  <small className="text-orange-600">⚠️ Aucune région disponible pour ce pays</small>
                )}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Préfecture * {videoData.prefectureCode && <span className="text-blue-600 font-semibold">({videoData.prefectureCode})</span>}</label>
                <select 
                  value={videoData.prefectureCode} 
                  onChange={(e) => {
                    const selectedPrefecture = prefectures.find(p => p.code === e.target.value)
                    setVideoData(prev => ({ 
                      ...prev, 
                      prefecture: selectedPrefecture?.name || '',
                      prefectureCode: e.target.value,
                      sousPrefecture: '',
                      sousPrefectureCode: '',
                      quartier: '',
                      quartierCode: ''
                    }))
                  }}
                  disabled={!videoData.regionCode}
                  required
                  className={videoData.prefectureCode ? 'border-green-500' : ''}
                >
                  <option value="">🏛️ {videoData.regionCode ? 'Sélectionner une préfecture' : 'Sélectionnez d\'abord une région'}</option>
                  {prefectures.map(prefecture => (
                    <option key={prefecture.code} value={prefecture.code}>
                      {prefecture.name} ({prefecture.code})
                    </option>
                  ))}
                </select>
                {!videoData.regionCode && (
                  <small className="text-orange-600">⚠️ Veuillez d'abord sélectionner une région</small>
                )}
                {videoData.prefectureCode && (
                  <small className="text-green-600">✓ Préfecture sélectionnée : {videoData.prefecture}</small>
                )}
                {videoData.regionCode && prefectures.length === 0 && (
                  <small className="text-orange-600">⚠️ Aucune préfecture disponible pour cette région</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Sous-préfecture * {videoData.sousPrefectureCode && <span className="text-blue-600 font-semibold">({videoData.sousPrefectureCode})</span>}</label>
                <select 
                  value={videoData.sousPrefectureCode} 
                  onChange={(e) => {
                    const selectedSousPrefecture = sousPrefectures.find(sp => sp.code === e.target.value)
                    setVideoData(prev => ({ 
                      ...prev, 
                      sousPrefecture: selectedSousPrefecture?.name || '',
                      sousPrefectureCode: e.target.value,
                      quartier: '',
                      quartierCode: ''
                    }))
                  }}
                  disabled={!videoData.prefectureCode}
                  required
                  className={videoData.sousPrefectureCode ? 'border-green-500' : ''}
                >
                  <option value="">📍 {videoData.prefectureCode ? 'Sélectionner une sous-préfecture' : 'Sélectionnez d\'abord une préfecture'}</option>
                  {sousPrefectures.map(sousPrefecture => (
                    <option key={sousPrefecture.code} value={sousPrefecture.code}>
                      {sousPrefecture.name} ({sousPrefecture.code})
                    </option>
                  ))}
                </select>
                {!videoData.prefectureCode && (
                  <small className="text-orange-600">⚠️ Veuillez d'abord sélectionner une préfecture</small>
                )}
                {videoData.sousPrefectureCode && (
                  <small className="text-green-600">✓ Sous-préfecture sélectionnée : {videoData.sousPrefecture}</small>
                )}
                {videoData.prefectureCode && sousPrefectures.length === 0 && (
                  <small className="text-orange-600">⚠️ Aucune sous-préfecture disponible pour cette préfecture</small>
                )}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Quartier * {videoData.quartierCode && <span className="text-blue-600 font-semibold">({videoData.quartierCode})</span>}</label>
                <select 
                  value={videoData.quartierCode} 
                  onChange={(e) => {
                    const selectedQuartier = quartiers.find(q => q.code === e.target.value)
                    setVideoData(prev => ({ 
                      ...prev, 
                      quartier: selectedQuartier?.name || '',
                      quartierCode: e.target.value
                    }))
                  }}
                  disabled={!videoData.sousPrefectureCode}
                  required
                  className={videoData.quartierCode ? 'border-green-500' : ''}
                >
                  <option value="">🏘️ {videoData.sousPrefectureCode ? 'Sélectionner un quartier' : 'Sélectionnez d\'abord une sous-préfecture'}</option>
                  {quartiers.map(quartier => (
                    <option key={quartier.code} value={quartier.code}>
                      {quartier.name} ({quartier.code})
                    </option>
                  ))}
                </select>
                {!videoData.sousPrefectureCode && (
                  <small className="text-orange-600">⚠️ Veuillez d'abord sélectionner une sous-préfecture</small>
                )}
                {videoData.quartierCode && (
                  <small className="text-green-600">✓ Quartier sélectionné : {videoData.quartier}</small>
                )}
                {videoData.sousPrefectureCode && quartiers.length === 0 && (
                  <small className="text-orange-600">⚠️ Aucun quartier disponible pour cette sous-préfecture</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>📍 Localisation complète</label>
                <div className="p-3 bg-gray-50 rounded border">
                  {videoData.continentCode && videoData.paysCode && videoData.regionCode && videoData.prefectureCode && videoData.sousPrefectureCode && videoData.quartierCode ? (
                    <div className="text-sm">
                      <div className="font-semibold text-green-600 mb-2">✓ Localisation complète :</div>
                      <div className="space-y-1">
                        <div><strong>Continent:</strong> {videoData.continent} ({videoData.continentCode})</div>
                        <div><strong>Pays:</strong> {videoData.pays} ({videoData.paysCode})</div>
                        <div><strong>Région:</strong> {videoData.region} ({videoData.regionCode})</div>
                        <div><strong>Préfecture:</strong> {videoData.prefecture} ({videoData.prefectureCode})</div>
                        <div><strong>Sous-préfecture:</strong> {videoData.sousPrefecture} ({videoData.sousPrefectureCode})</div>
                        <div><strong>Quartier:</strong> {videoData.quartier} ({videoData.quartierCode})</div>
                        <div className="mt-2 pt-2 border-t">
                          <strong className="text-blue-600">Code complet:</strong> {videoData.continentCode}{videoData.paysCode}{videoData.regionCode}{videoData.prefectureCode}{videoData.sousPrefectureCode}{videoData.quartierCode}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Sélectionnez tous les niveaux géographiques pour voir la localisation complète
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Ethnie</label>
                <select value={videoData.ethnie} onChange={(e) => setVideoData(prev => ({ ...prev, ethnie: e.target.value }))}>
                  <option value="">Sélectionner</option>
                  <option value="Peuls">Peuls</option>
                  <option value="Malinkés">Malinkés</option>
                  <option value="Soussous">Soussous</option>
                  <option value="Kissi">Kissi</option>
                  <option value="Toma">Toma</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Famille (Nom)</label>
                <select value={videoData.famille} onChange={(e) => setVideoData(prev => ({ ...prev, famille: e.target.value }))}>
                  <option value="">Sélectionner</option>
                  <option value="Barry">Barry</option>
                  <option value="Diallo">Diallo</option>
                  <option value="Sow">Sow</option>
                  <option value="Bah">Bah</option>
                  <option value="Balde">Balde</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Prénom</label>
                <input 
                  value={videoData.prenom}
                  onChange={(e) => setVideoData(prev => ({ ...prev, prenom: e.target.value }))}
                  placeholder="Votre prénom"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Téléphone</label>
                <input 
                  value={videoData.telephone}
                  onChange={(e) => setVideoData(prev => ({ ...prev, telephone: e.target.value }))}
                  placeholder="Votre numéro de téléphone"
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Génération (auto)</label>
                <input 
                  value={videoData.generation}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Genre</label>
                <select 
                  value={videoData.genre}
                  onChange={(e) => setVideoData(prev => ({ ...prev, genre: e.target.value }))}
                >
                  <option value="HOMME">HOMME</option>
                  <option value="FEMME">FEMME</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Mot de passe</label>
                <input 
                  type="password"
                  value={videoData.password}
                  onChange={(e) => setVideoData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Choisissez un mot de passe"
                  minLength={6}
                />
                {videoData.password && videoData.password.length < 6 && (
                  <small className="error">Le mot de passe doit contenir au moins 6 caractères</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Confirmer le mot de passe</label>
                <input 
                  type="password"
                  value={videoData.confirmPassword}
                  onChange={(e) => setVideoData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirmez votre mot de passe"
                  minLength={6}
                />
                {videoData.confirmPassword && videoData.password !== videoData.confirmPassword && (
                  <small className="error">Les mots de passe ne correspondent pas</small>
                )}
                {videoData.confirmPassword && videoData.password === videoData.confirmPassword && videoData.password.length >= 6 && (
                  <small className="success">✓ Les mots de passe correspondent</small>
                )}
              </div>
            </div>
          </div>
          
          {/* Activités professionnelles */}
          <div className="row">
            <div className="col-12">
              <h3>Activités professionnelles</h3>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="field">
                <label>Activité principale *</label>
                <select 
                  value={videoData.activite1}
                  onChange={(e) => setVideoData(prev => ({ ...prev, activite1: e.target.value }))}
                >
                  <option value="">Sélectionner une activité</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Élevage">Élevage</option>
                  <option value="Pêche">Pêche</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Artisanat">Artisanat</option>
                  <option value="Transport">Transport</option>
                  <option value="Enseignement">Enseignement</option>
                  <option value="Santé">Santé</option>
                  <option value="Administration">Administration</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Construction">Construction</option>
                  <option value="Mécanique">Mécanique</option>
                  <option value="Restauration">Restauration</option>
                  <option value="Coiffure">Coiffure</option>
                  <option value="Couture">Couture</option>
                  <option value="Menuiserie">Menuiserie</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Plomberie">Plomberie</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Banque/Finance">Banque/Finance</option>
                  <option value="Télécommunications">Télécommunications</option>
                  <option value="Journalisme">Journalisme</option>
                  <option value="Étudiant">Étudiant</option>
                  <option value="Sans emploi">Sans emploi</option>
                  <option value="Retraité">Retraité</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Activité secondaire (optionnel)</label>
                <select 
                  value={videoData.activite2}
                  onChange={(e) => setVideoData(prev => ({ ...prev, activite2: e.target.value }))}
                >
                  <option value="">Sélectionner une activité</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Élevage">Élevage</option>
                  <option value="Pêche">Pêche</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Artisanat">Artisanat</option>
                  <option value="Transport">Transport</option>
                  <option value="Enseignement">Enseignement</option>
                  <option value="Santé">Santé</option>
                  <option value="Administration">Administration</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Construction">Construction</option>
                  <option value="Mécanique">Mécanique</option>
                  <option value="Restauration">Restauration</option>
                  <option value="Coiffure">Coiffure</option>
                  <option value="Couture">Couture</option>
                  <option value="Menuiserie">Menuiserie</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Plomberie">Plomberie</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Banque/Finance">Banque/Finance</option>
                  <option value="Télécommunications">Télécommunications</option>
                  <option value="Journalisme">Journalisme</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Activité tertiaire (optionnel)</label>
                <select 
                  value={videoData.activite3}
                  onChange={(e) => setVideoData(prev => ({ ...prev, activite3: e.target.value }))}
                >
                  <option value="">Sélectionner une activité</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Élevage">Élevage</option>
                  <option value="Pêche">Pêche</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Artisanat">Artisanat</option>
                  <option value="Transport">Transport</option>
                  <option value="Enseignement">Enseignement</option>
                  <option value="Santé">Santé</option>
                  <option value="Administration">Administration</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Construction">Construction</option>
                  <option value="Mécanique">Mécanique</option>
                  <option value="Restauration">Restauration</option>
                  <option value="Coiffure">Coiffure</option>
                  <option value="Couture">Couture</option>
                  <option value="Menuiserie">Menuiserie</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Plomberie">Plomberie</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Banque/Finance">Banque/Finance</option>
                  <option value="Télécommunications">Télécommunications</option>
                  <option value="Journalisme">Journalisme</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Champs de lieu de résidence */}
          <div className="row">
            <div className="col-12">
              <h3>Lieux de résidence</h3>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Lieu de résidence 1 (Quartier) *</label>
                <input
                  type="text"
                  value={videoData.lieu1 || videoData.quartier}
                  onChange={(e) => setVideoData(prev => ({ ...prev, lieu1: e.target.value }))}
                  placeholder={videoData.quartier || "Votre quartier"}
                  required
                />
                <small className="text-muted">
                  Quartier sélectionné : {videoData.quartier || 'Aucun'} (sera utilisé par défaut)
                </small>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Lieu de résidence 2 (Optionnel)</label>
                <input
                  type="text"
                  value={videoData.lieu2}
                  onChange={(e) => setVideoData(prev => ({ ...prev, lieu2: e.target.value }))}
                  placeholder="Autre lieu de résidence"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Lieu de résidence 3 (Optionnel)</label>
                <input
                  type="text"
                  value={videoData.lieu3}
                  onChange={(e) => setVideoData(prev => ({ ...prev, lieu3: e.target.value }))}
                  placeholder="Autre lieu de résidence"
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="field">
                <label>Photo de profil (optionnel)</label>
                <div className="photo-upload-section">
                  {videoData.photoPreview ? (
                    <div className="photo-preview">
                      <img 
                        src={videoData.photoPreview} 
                        alt="Aperçu de la photo" 
                        className="preview-image"
                      />
                      <div className="photo-actions">
                        <button 
                          type="button" 
                          className="btn-small secondary"
                          onClick={removePhoto}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="photo-upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        id="photo-upload"
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="photo-upload" className="upload-button">
                        <span className="upload-icon">📷</span>
                        <span>Cliquer pour ajouter une photo</span>
                        <small>Formats acceptés: JPG, PNG, GIF (max 5MB)</small>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="actions">
            <button 
              className="btn" 
              onClick={() => setCurrentStep('video')}
              disabled={
                !videoData.dateNaissance || 
                !videoData.region || 
                !videoData.prefecture ||
                !videoData.sousPrefecture ||
                !videoData.ethnie || 
                !videoData.famille || 
                !videoData.prenom || 
                !videoData.password || 
                !videoData.confirmPassword || 
                videoData.password !== videoData.confirmPassword ||
                !videoData.activite1 ||
                !videoData.lieu1
              }
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
    const numeroH = generateNumeroH(videoData)
    return (
      <div className="stack">
        <h2>✅ Enregistrement Terminé</h2>
        <div className="card success-card">
          <div className="success-content">
            <div className="success-icon" style={{ fontSize: '4rem', color: '#22c55e' }}>✓</div>
            <h3>Félicitations ! Votre inscription est terminée</h3>
            <div className="numero-h-display" style={{ 
              margin: '2rem 0',
              padding: '1.5rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '12px',
              border: '2px solid #3b82f6'
            }}>
              <h4 style={{ marginBottom: '1rem', color: '#1e40af' }}>🎯 Votre NumeroH généré automatiquement :</h4>
              <div className="numero-h-value" style={{ 
                fontSize: '1.8rem', 
                fontWeight: 'bold', 
                color: '#2563eb',
                padding: '1rem',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                margin: '1rem 0',
                textAlign: 'center',
                border: '2px solid #3b82f6',
                fontFamily: 'monospace'
              }}>
                {numeroH}
              </div>
              <div style={{ 
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                margin: '1rem 0',
                border: '1px solid #22c55e'
              }}>
                <p style={{ margin: 0, color: '#166534', fontWeight: '600', fontSize: '1.1rem' }}>
                  ✅ <strong>Vous êtes maintenant connecté automatiquement !</strong>
                </p>
                <p style={{ margin: '0.75rem 0 0 0', color: '#166534', fontSize: '0.95rem' }}>
                  Ce NumeroH vous permettra de vous connecter à votre compte à tout moment.
                </p>
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
                  <p style={{ margin: '0.25rem 0', color: '#166534', fontSize: '0.9rem' }}>
                    <strong>🔑 Identifiant :</strong> <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{numeroH}</code>
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#166534', fontSize: '0.9rem' }}>
                    <strong>🔒 Mot de passe :</strong> Celui que vous avez défini lors de l'inscription
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="actions" style={{ marginTop: '2rem' }}>
            <button 
              className="btn" 
              onClick={() => navigate('/moi')}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Accéder à mon compte →
            </button>
            <button 
              className="btn" 
              onClick={() => navigate('/')}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
