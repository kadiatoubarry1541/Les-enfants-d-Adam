import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { VideoRecorder } from '../../components/VideoRecorder'
import { api } from '../../utils/api'
import { 
  getRegions, 
  getPrefecturesByRegion, 
  getSousPrefecturesByPrefecture, 
  getDistrictsBySousPrefecture,
  getAllDistrictsAndQuartiers 
} from '../../utils/guineaGeography'

interface VideoData {
  numeroHPere: string
  numeroHMere: string
  continent: string
  dateNaissance: string
  pays: string
  region: string
  prefecture: string
  sousPrefecture: string
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
    continent: 'Afrique',
    dateNaissance: '',
    pays: 'Guinée',
    region: '',
    prefecture: '',
    sousPrefecture: '',
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

  // Logique hiérarchique pour les données géographiques
  const regions = useMemo(() => getRegions(), [])
  const prefectures = useMemo(() => 
    videoData.region ? getPrefecturesByRegion(videoData.region) : [], 
    [videoData.region]
  )
  const sousPrefectures = useMemo(() => 
    videoData.prefecture ? getSousPrefecturesByPrefecture(videoData.prefecture) : [], 
    [videoData.prefecture]
  )
  const districts = useMemo(() => 
    videoData.sousPrefecture ? getDistrictsBySousPrefecture(videoData.sousPrefecture) : [], 
    [videoData.sousPrefecture]
  )
  const allDistricts = useMemo(() => getAllDistrictsAndQuartiers(), [])

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
      'Balde': 'F5'
    }
    
    const regionCode = regionCodes[data.region] || 'R1'
    const ethnieCode = ethnieCodes[data.ethnie] || 'E1'
    const familleCode = familleCodes[data.famille] || 'F1'
    
    // Générer un numéro unique
    const counter = localStorage.getItem('numeroH_counter') || '0'
    const nextNumber = parseInt(counter) + 1
    localStorage.setItem('numeroH_counter', nextNumber.toString())
    
    return `${generation}${continent}${pays}${regionCode}${ethnieCode}${familleCode} ${nextNumber}`
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

    // Vérifier le champ obligatoire
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
      photoPreview: videoData.photoPreview
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
        
        alert(`✅ Enregistrement vidéo réussi ! Votre NumeroH est: ${numeroH}\n\nVous êtes maintenant connecté !`)
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
      
      alert(`⚠️ Sauvegardé localement. Votre NumeroH est: ${numeroH}\n\nVous êtes maintenant connecté !`)
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
                <label>Région</label>
                <select 
                  value={videoData.region} 
                  onChange={(e) => {
                    const regionCode = e.target.value
                    setVideoData(prev => ({ 
                      ...prev, 
                      region: regionCode,
                      prefecture: '', // Réinitialiser la préfecture
                      sousPrefecture: '' // Réinitialiser la sous-préfecture
                    }))
                  }}
                >
                  <option value="">Sélectionner</option>
                  {regions.map(region => (
                    <option key={region.code} value={region.code}>{region.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Préfecture</label>
                <select 
                  value={videoData.prefecture} 
                  onChange={(e) => {
                    const prefectureCode = e.target.value
                    setVideoData(prev => ({ 
                      ...prev, 
                      prefecture: prefectureCode,
                      sousPrefecture: '' // Réinitialiser la sous-préfecture
                    }))
                  }}
                  disabled={!videoData.region}
                >
                  <option value="">Sélectionner une préfecture</option>
                  {prefectures.map(prefecture => (
                    <option key={prefecture.code} value={prefecture.code}>{prefecture.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Sous-préfecture</label>
                <select 
                  value={videoData.sousPrefecture} 
                  onChange={(e) => setVideoData(prev => ({ ...prev, sousPrefecture: e.target.value }))}
                  disabled={!videoData.prefecture}
                >
                  <option value="">Sélectionner une sous-préfecture</option>
                  {sousPrefectures.map(sousPrefecture => (
                    <option key={sousPrefecture.code} value={sousPrefecture.code}>{sousPrefecture.name}</option>
                  ))}
                </select>
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
            <div className="col-12">
              <div className="field">
                <label>Lieu de résidence 1 (District/Quartier) *</label>
                <select 
                  value={videoData.lieu1}
                  onChange={(e) => setVideoData(prev => ({ ...prev, lieu1: e.target.value }))}
                  disabled={!videoData.sousPrefecture}
                  required
                >
                  <option value="">Sélectionner un district/quartier</option>
                  {districts.map(district => (
                    <option key={district.code} value={district.code}>{district.name}</option>
                  ))}
                </select>
                <small className="text-muted">
                  Basé sur votre sous-préfecture sélectionnée
                </small>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Lieu de résidence 2 (District/Quartier)</label>
                <select 
                  value={videoData.lieu2}
                  onChange={(e) => setVideoData(prev => ({ ...prev, lieu2: e.target.value }))}
                >
                  <option value="">Sélectionner un district/quartier</option>
                  {allDistricts.map(district => (
                    <option key={district.code} value={district.code}>{district.name}</option>
                  ))}
                </select>
                <small className="text-muted">
                  Tous les districts et quartiers de Guinée
                </small>
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Lieu de résidence 3 (District/Quartier)</label>
                <select 
                  value={videoData.lieu3}
                  onChange={(e) => setVideoData(prev => ({ ...prev, lieu3: e.target.value }))}
                >
                  <option value="">Sélectionner un district/quartier</option>
                  {allDistricts.map(district => (
                    <option key={district.code} value={district.code}>{district.name}</option>
                  ))}
                </select>
                <small className="text-muted">
                  Tous les districts et quartiers de Guinée
                </small>
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
        <h2>Enregistrement Terminé</h2>
        <div className="card success-card">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3>Merci pour votre inscription !</h3>
            <p>Attendez 3 minutes pour que votre inscription soit validée.</p>
            <div className="numero-h-display">
              <h4>Votre NumeroH :</h4>
              <div className="numero-h-value">{numeroH}</div>
              <p>Ce numéro vous permettra de vous connecter à votre compte</p>
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
