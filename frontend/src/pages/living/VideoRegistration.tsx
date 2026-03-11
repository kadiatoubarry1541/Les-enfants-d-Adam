import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { VideoRecorder } from '../../components/VideoRecorder'
import { api } from '../../utils/api'
import { getAllCountries, getRegionsByCountry, getContinentAndRegionByCountry } from '../../utils/worldGeography'
import { ETHNIE_CODES, FAMILLE_CODES, ETHNIES, FAMILLES } from '../../utils/constants'

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
  email: string
  religion: string
  generation: string
  password: string
  confirmPassword: string
  video: Blob | null
  photo: File | null
  photoPreview: string | null
  genre: string
  handicap: string
  // Inscription simplifiée : 1 seule activité et 1 seul lieu (les autres se complètent en profil)
  activite1: string
  activite2: string
  activite3: string
  lieu1: string
  lieu2: string
  lieu3: string
  numeroH?: string
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
    email: '',
    religion: '',
    generation: '',
    password: '',
    confirmPassword: '',
    video: null,
    photo: null,
    photoPreview: null,
    genre: 'HOMME',
    handicap: '',
    
    // Activités professionnelles
    activite1: '',
    activite2: '',
    activite3: '',
    
    // Champs de lieu de résidence
    lieu1: '',
    lieu2: '',
    lieu3: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasShownReminder, setHasShownReminder] = useState(false)
  const [currentStep, setCurrentStep] = useState<'form' | 'video' | 'complete'>('form')
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set())
  
  const navigate = useNavigate()

  // Fonction pour valider les champs obligatoires
  const validateRequiredFields = (): boolean => {
    const errors = new Set<string>()
    
    if (!videoData.paysCode) errors.add('paysCode')
    if (!videoData.regionCode) errors.add('regionCode')
    if (!(videoData.sousPrefecture && videoData.sousPrefecture.trim())) errors.add('sousPrefecture')
    if (!(videoData.quartier && videoData.quartier.trim())) errors.add('quartier')
    if (!videoData.ethnie) errors.add('ethnie')
    if (!videoData.famille) errors.add('famille')
    if (!videoData.prenom) errors.add('prenom')
    if (!videoData.dateNaissance) errors.add('dateNaissance')
    if (!videoData.password) errors.add('password')
    if (!videoData.confirmPassword) errors.add('confirmPassword')
    if (videoData.password && videoData.confirmPassword && videoData.password !== videoData.confirmPassword) {
      errors.add('confirmPassword')
    }
    
    setValidationErrors(errors)
    return errors.size === 0
  }
  
  // Fonction pour obtenir la classe CSS d'un champ
  const getFieldClassName = (fieldName: string, hasValue: boolean): string => {
    const baseClass = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
    if (validationErrors.has(fieldName)) {
      return `${baseClass} border-red-500 border-2`
    }
    if (hasValue) {
      return `${baseClass} border-green-500`
    }
    return `${baseClass} border-gray-300`
  }

  const countries = useMemo(() => getAllCountries(), [])
  const regions = useMemo(
    () => (videoData.paysCode ? getRegionsByCountry(videoData.paysCode) : []),
    [videoData.paysCode]
  )

  const handleVideoRecorded = (videoBlob: Blob) => {
    console.log('✅ Vidéo enregistrée, taille:', videoBlob.size, 'bytes')
    setVideoData(prev => ({ ...prev, video: videoBlob }))
    // Ne pas changer automatiquement l'étape, laisser l'utilisateur voir le bouton "Finaliser"
    // setCurrentStep('complete')
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Impossible de convertir la vidéo'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
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

  const generateNumeroH = async (data: VideoData): Promise<string> => {
    const generation = calculateGeneration(data.dateNaissance)
    // Préfixe NumeroH : génération + continent + pays + région (choisie) + ethnie + famille
    const { continentCode: c } = data.paysCode ? getContinentAndRegionByCountry(data.paysCode) : { continentCode: 'C1', regionCode: 'R1' }
    const continentCode = data.continentCode || c
    const paysCode = data.paysCode || 'P1'
    const regionCode = data.regionCode || (data.paysCode ? getContinentAndRegionByCountry(data.paysCode).regionCode : 'R1')
    
    // Utiliser les codes depuis constants.ts avec fallback automatique
    const ethnieEntry = ETHNIE_CODES.find(e => e.label === data.ethnie)
    const familleEntry = FAMILLE_CODES.find(f => f.label === data.famille)
    
    // Générer un code automatique si non trouvé (système séquentiel adaptatif)
    const generateAutoCode = (name: string, prefix: string, existingCodes: string[]): string => {
      if (!name) return prefix + '999'
      // Trouver le plus grand numéro existant pour ce préfixe
      const existingNums = existingCodes
        .filter(c => c.startsWith(prefix))
        .map(c => {
          const numStr = c.substring(prefix.length)
          const num = parseInt(numStr, 10)
          return isNaN(num) ? 0 : num
        })
        .filter(n => n > 0)
      
      // Commencer au numéro suivant le plus grand existant
      const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1
      return prefix + nextNum.toString() // Pas de zéros devant : E1, E2, E10, E100, etc.
    }
    
    const ethnieCode = ethnieEntry?.code || generateAutoCode(data.ethnie, 'E', ETHNIE_CODES.map(e => e.code))
    const familleCode = familleEntry?.code || generateAutoCode(data.famille, 'F', FAMILLE_CODES.map(f => f.code))
    
    // Générer un numéro unique basé sur le préfixe complet
    const prefix = `${generation}${continentCode}${paysCode}${regionCode}${ethnieCode}${familleCode}`
    
    // Utiliser la fonction qui vérifie l'existence avant de générer
    const { generateUniqueNumeroH } = await import('../../utils/numeroHGenerator')
    return await generateUniqueNumeroH(prefix)
  }

  const showCredentialsReminder = (numeroH: string, password: string) => {
    if (!numeroH || !password || hasShownReminder) return
    setHasShownReminder(true)
    alert(
      "Retenez bien votre NumeroH et votre mot de passe afin d'avoir toujours accès à votre compte.\n\n" +
        `NumeroH : ${numeroH}\n` +
        `Mot de passe : ${password}`
    )
  }

  const handleSubmit = async () => {
    if (loading) return
    if (!videoData.video) {
      alert('Veuillez enregistrer votre vidéo.')
      return
    }

    // Valider tous les champs obligatoires
    if (!validateRequiredFields()) {
      alert('Veuillez remplir tous les champs obligatoires (marqués en rouge).')
      // Faire défiler vers le premier champ en erreur
      const firstErrorField = document.querySelector('.border-red-500')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setLoading(true)

    const numeroH = await generateNumeroH(videoData)
    
    // Région choisie ; sous-préfecture et quartier en saisie libre pour regroupement
    const inferred = {
      paysCode: videoData.paysCode,
      pays: countries.find(c => c.code === videoData.paysCode)?.name || videoData.pays,
      regionCode: videoData.regionCode,
      region: regions.find(r => r.code === videoData.regionCode)?.name || videoData.region,
      sousPrefecture: (videoData.sousPrefecture && videoData.sousPrefecture.trim()) || '',
      quartier: (videoData.quartier && videoData.quartier.trim()) || ''
    }
    
    setVideoData(prev => ({ ...prev, numeroH }))
    
    const videoBase64 = videoData.video ? await blobToBase64(videoData.video) : null

    const completeData = { 
      ...videoData,
      ...inferred,
      numeroH,
      password: videoData.password,
      confirmPassword: videoData.confirmPassword,
      prenom: videoData.prenom,
      nomFamille: videoData.famille,
      email: videoData.email?.trim() || `${numeroH}@example.com`,
      religion: videoData.religion?.trim() || '',
      genre: videoData.genre,
      photo: videoData.photoPreview,
      photoPreview: videoData.photoPreview,
      lieu1: (videoData.quartier && videoData.quartier.trim()) || videoData.lieu1 || '',
      video: videoBase64
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
        
        // ✅ CRÉER LA SESSION pour connexion automatique avec token
        localStorage.setItem('session_user', JSON.stringify({
          numeroH: numeroH,
          userData: userDataWithPassword,
          token: result.token || null, // Sauvegarder le token JWT si disponible
          type: 'vivant',
          source: 'registration_video'
        }))
        
        // Sauvegarder le token séparément si disponible
        if (result.token) {
          localStorage.setItem('token', result.token)
        }
        
        console.log('✅ Données sauvegardées avec mot de passe EN CLAIR:', {
          numeroH: userDataWithPassword.numeroH,
          password: userDataWithPassword.password,
          hasPassword: !!userDataWithPassword.password,
          passwordLength: userDataWithPassword.password?.length
        })
        
        showCredentialsReminder(numeroH, videoData.password)
        // Redirection immédiate vers le compte utilisateur
        navigate('/compte')
      } else {
        const details = (result as { errors?: Array<{ path: string; msg: string }> }).errors
          ?.map(e => `${e.path}: ${e.msg}`)
          .join('\n')
        alert(`❌ Erreur: ${result.message}${details ? '\n\n' + details : ''}`)
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
      
      showCredentialsReminder(numeroH, videoData.password)
      // Redirection immédiate vers le compte utilisateur
      navigate('/compte')
    } finally {
      setLoading(false)
    }
  }

  if (currentStep === 'form') {
    return (
      <div className="stack">
        <h2>Informations de base</h2>
        <div className="card" style={{ maxWidth: '32rem', width: '100%' }}>
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
                    if (e.target.value) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('dateNaissance')
                        return newErrors
                      })
                    }
                  }}
                  required
                  className={getFieldClassName('dateNaissance', !!videoData.dateNaissance)}
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
                <label>Pays *</label>
                <select 
                  value={videoData.paysCode} 
                  onChange={(e) => {
                    const selectedCountry = countries.find(c => c.code === e.target.value)
                    const inferred = e.target.value
                      ? getContinentAndRegionByCountry(e.target.value)
                      : { continentCode: '', regionCode: '' }
                    setVideoData(prev => ({ 
                      ...prev, 
                      pays: selectedCountry?.name || '',
                      paysCode: e.target.value,
                      continentCode: inferred.continentCode || prev.continentCode,
                      continent: selectedCountry ? '' : prev.continent,
                      region: '',
                      regionCode: inferred.regionCode || ''
                    }))
                    if (e.target.value) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('paysCode')
                        return newErrors
                      })
                    }
                  }}
                  required
                  className={getFieldClassName('paysCode', !!videoData.paysCode)}
                >
                  <option value="">Pays</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {videoData.paysCode && (
                  <small className="text-green-600">✓ Pays : {countries.find(c => c.code === videoData.paysCode)?.name}</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Région *</label>
                <select
                  value={videoData.regionCode}
                  onChange={(e) => {
                    const selected = regions.find(r => r.code === e.target.value)
                    setVideoData(prev => ({
                      ...prev,
                      region: selected?.name || '',
                      regionCode: e.target.value
                    }))
                    if (e.target.value) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('regionCode')
                        return newErrors
                      })
                    }
                  }}
                  disabled={!videoData.paysCode}
                  required
                  className={getFieldClassName('regionCode', !!videoData.regionCode)}
                >
                  <option value="">{videoData.paysCode ? `Région (${regions.length})` : 'Choisir un pays d\'abord'}</option>
                  {regions.map(r => (
                    <option key={r.code} value={r.code}>{r.name}</option>
                  ))}
                </select>
                {!videoData.paysCode && (
                  <small className="text-orange-600">Veuillez d&apos;abord sélectionner un pays</small>
                )}
                {videoData.regionCode && (
                  <small className="text-green-600 block mt-1">✓ Région : {regions.find(r => r.code === videoData.regionCode)?.name}</small>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Sous-préfecture *</label>
                <input
                  type="text"
                  value={videoData.sousPrefecture}
                  onChange={(e) => {
                    const v = e.target.value
                    setVideoData(prev => ({ ...prev, sousPrefecture: v }))
                    if (v.trim()) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('sousPrefecture')
                        return newErrors
                      })
                    }
                  }}
                  placeholder="Ex. Kaloum, Ratoma..."
                  className={getFieldClassName('sousPrefecture', !!(videoData.sousPrefecture && videoData.sousPrefecture.trim()))}
                />
                <small className="text-gray-500">Saisissez le nom de votre sous-préfecture</small>
                {videoData.sousPrefecture && videoData.sousPrefecture.trim() && (
                  <small className="text-green-600 block mt-1">✓ Sous-préfecture : {videoData.sousPrefecture.trim()}</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Quartier *</label>
                <input
                  type="text"
                  value={videoData.quartier}
                  onChange={(e) => {
                    const v = e.target.value
                    setVideoData(prev => ({ ...prev, quartier: v }))
                    if (v.trim()) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('quartier')
                        return newErrors
                      })
                    }
                  }}
                  placeholder="Ex. Hamdallaye, Taouyah..."
                  className={getFieldClassName('quartier', !!(videoData.quartier && videoData.quartier.trim()))}
                />
                <small className="text-gray-500">Saisissez le nom de votre quartier (regroupement avec les personnes du même quartier)</small>
                {videoData.quartier && videoData.quartier.trim() && (
                  <small className="text-green-600 block mt-1">✓ Quartier : {videoData.quartier.trim()}</small>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Activité principale (optionnel)</label>
                <select 
                  value={videoData.activite1}
                  onChange={(e) => {
                    setVideoData(prev => ({ ...prev, activite1: e.target.value }))
                    if (e.target.value) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('activite1')
                        return newErrors
                      })
                    }
                  }}
                  className={getFieldClassName('activite1', !!videoData.activite1)}
                >
                  <option value="">Activité</option>
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
                <label>Ethnie *</label>
                <select 
                  value={videoData.ethnie} 
                  onChange={(e) => {
                    setVideoData(prev => ({ ...prev, ethnie: e.target.value }))
                    if (e.target.value) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('ethnie')
                        return newErrors
                      })
                    }
                  }}
                  required
                  className={getFieldClassName('ethnie', !!videoData.ethnie)}
                >
                  <option value="">Ethnie</option>
                  {ETHNIES.map(ethnie => (
                    <option key={ethnie} value={ethnie}>{ethnie}</option>
                  ))}
                </select>
                {videoData.ethnie && (
                  <small className="text-green-600">✓ Ethnie sélectionnée : {videoData.ethnie}</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Famille (Nom) *</label>
                <select 
                  value={videoData.famille} 
                  onChange={(e) => {
                    setVideoData(prev => ({ ...prev, famille: e.target.value }))
                    if (e.target.value) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('famille')
                        return newErrors
                      })
                    }
                  }}
                  required
                  className={getFieldClassName('famille', !!videoData.famille)}
                >
                  <option value="">Nom de famille</option>
                  {FAMILLES.map(famille => (
                    <option key={famille} value={famille}>{famille}</option>
                  ))}
                </select>
                {videoData.famille && (
                  <small className="text-green-600">✓ Nom de famille sélectionné : {videoData.famille}</small>
                )}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>Prénom</label>
                <input 
                  value={videoData.prenom}
                  onChange={(e) => {
                    setVideoData(prev => ({ ...prev, prenom: e.target.value }))
                    if (e.target.value.trim()) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('prenom')
                        return newErrors
                      })
                    }
                  }}
                  placeholder="Prénom"
                  required
                  className={getFieldClassName('prenom', !!videoData.prenom)}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Téléphone</label>
                <input 
                  value={videoData.telephone}
                  onChange={(e) => setVideoData(prev => ({ ...prev, telephone: e.target.value }))}
                  placeholder="Téléphone"
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>NuméroH (Père)</label>
                <input 
                  value={videoData.numeroHPere}
                  onChange={(e) => setVideoData(prev => ({ ...prev, numeroHPere: e.target.value }))}
                  placeholder="Ex: G1C1P1R1E1F1 1"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>NuméroH (Mère)</label>
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
                <label>Personne en situation de handicap ?</label>
                <select
                  value={videoData.handicap}
                  onChange={(e) => setVideoData(prev => ({ ...prev, handicap: e.target.value }))}
                >
                  <option value="">Sélectionner</option>
                  <option value="NON">Non</option>
                  <option value="OUI">Oui</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="field">
                <label>E-mail</label>
                <input 
                  type="email"
                  value={videoData.email}
                  onChange={(e) => setVideoData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Religion</label>
                <input 
                  value={videoData.religion}
                  onChange={(e) => setVideoData(prev => ({ ...prev, religion: e.target.value }))}
                  placeholder="Religion"
                />
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
                  onChange={(e) => {
                    setVideoData(prev => ({ ...prev, password: e.target.value }))
                    if (e.target.value && e.target.value.length >= 6) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('password')
                        return newErrors
                      })
                    }
                  }}
                  placeholder="Mot de passe"
                  minLength={6}
                  required
                  className={getFieldClassName('password', !!videoData.password && videoData.password.length >= 6)}
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
                  onChange={(e) => {
                    setVideoData(prev => ({ ...prev, confirmPassword: e.target.value }))
                    if (e.target.value && videoData.password === e.target.value && e.target.value.length >= 6) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev)
                        newErrors.delete('confirmPassword')
                        return newErrors
                      })
                    }
                  }}
                  placeholder="Confirmer"
                  minLength={6}
                  required
                  className={getFieldClassName('confirmPassword', !!videoData.confirmPassword && videoData.password === videoData.confirmPassword && videoData.password.length >= 6)}
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
            {(() => {
              const missingFields: string[] = []
              if (!videoData.dateNaissance) missingFields.push('Date de naissance')
              if (!videoData.paysCode) missingFields.push('Pays')
              if (!videoData.regionCode) missingFields.push('Région')
              if (!(videoData.sousPrefecture && videoData.sousPrefecture.trim())) missingFields.push('Sous-préfecture')
              if (!(videoData.quartier && videoData.quartier.trim())) missingFields.push('Quartier')
              if (!videoData.ethnie) missingFields.push('Ethnie')
              if (!videoData.famille) missingFields.push('Nom de famille')
              if (!videoData.prenom) missingFields.push('Prénom')
              if (!videoData.password) missingFields.push('Mot de passe')
              if (!videoData.confirmPassword) missingFields.push('Confirmation du mot de passe')
              if (videoData.password && videoData.confirmPassword && videoData.password !== videoData.confirmPassword) {
                missingFields.push('Les mots de passe ne correspondent pas')
              }
              if (videoData.password && videoData.password.length < 6) {
                missingFields.push('Le mot de passe doit contenir au moins 6 caractères')
              }
              const isDisabled = missingFields.length > 0

              return (
                <button
                  className={`btn ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!validateRequiredFields()) {
                      alert('Veuillez remplir tous les champs obligatoires (marqués en rouge) avant de continuer.')
                      const firstErrorField = document.querySelector('.border-red-500')
                      if (firstErrorField) {
                        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }
                      return
                    }
                    setCurrentStep('video')
                  }}
                  disabled={isDisabled}
                  style={{
                    opacity: isDisabled ? 0.6 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isDisabled ? 'Remplir les champs obligatoires' : '✅ Enregistrer la vidéo'}
                </button>
              )
            })()}
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
            maxDuration={30}
          />
          {videoData.video && (
            <div className="actions" style={{ marginTop: '20px' }}>
              <button className="btn" onClick={handleSubmit}>
                ✅ Envoyer
              </button>
              <button 
                className="btn secondary" 
                onClick={() => {
                  setVideoData(prev => ({ ...prev, video: null }))
                  setCurrentStep('video')
                }}
                style={{ marginLeft: '10px' }}
              >
                Réenregistrer la vidéo
            </button>
          </div>
          )}
          {!videoData.video && (
            <div className="info-message" style={{ 
              padding: '15px', 
              backgroundColor: '#d1ecf1', 
              border: '1px solid #bee5eb', 
              borderRadius: '5px',
              marginTop: '20px'
            }}>
              <p>📹 Veuillez enregistrer votre vidéo ci-dessus. Une fois l'enregistrement terminé, vous pourrez finaliser votre inscription.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentStep === 'complete') {
    // Note: numeroH devrait déjà être généré et stocké dans videoData
    const numeroH = videoData.numeroH || 'Génération en cours...'
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
