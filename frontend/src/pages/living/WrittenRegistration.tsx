import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'
import { getAllCountries, getRegionsByCountry, getContinentAndRegionByCountry } from '../../utils/worldGeography'
import { ETHNIE_CODES, FAMILLE_CODES, ETHNIES, FAMILLES } from '../../utils/constants'

interface WrittenData {
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
  photo: File | null
  photoPreview: string | null
  genre: string
  handicap: string
  activite1: string
  activite2: string
  activite3: string
  lieu1: string
  lieu2: string
  lieu3: string
  numeroH?: string
}

export function WrittenRegistration() {
  const [data, setData] = useState<WrittenData>({
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
    photo: null,
    photoPreview: null,
    genre: 'HOMME',
    handicap: '',
    activite1: '',
    activite2: '',
    activite3: '',
    lieu1: '',
    lieu2: '',
    lieu3: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasShownReminder, setHasShownReminder] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  const countries = useMemo(() => getAllCountries(), [])
  const regions = useMemo(
    () => (data.paysCode ? getRegionsByCountry(data.paysCode) : []),
    [data.paysCode]
  )

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

  const validateRequiredFields = (): boolean => {
    const errors = new Set<string>()

    if (!data.paysCode) errors.add('paysCode')
    if (!data.regionCode) errors.add('regionCode')
    if (!(data.sousPrefecture && data.sousPrefecture.trim())) errors.add('sousPrefecture')
    if (!(data.quartier && data.quartier.trim())) errors.add('quartier')
    if (!data.ethnie) errors.add('ethnie')
    if (!data.famille) errors.add('famille')
    if (!data.prenom) errors.add('prenom')
    if (!data.dateNaissance) errors.add('dateNaissance')
    if (!data.activite1) errors.add('activite1')
    if (!data.email) errors.add('email')
    if (!data.telephone) errors.add('telephone')
    if (!data.password) errors.add('password')
    if (!data.confirmPassword) errors.add('confirmPassword')
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      errors.add('confirmPassword')
    }

    setValidationErrors(errors)
    return errors.size === 0
  }

  const getFieldClassName = (fieldName: string, hasValue: boolean): string => {
    const baseClass =
      'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
    if (validationErrors.has(fieldName)) {
      return `${baseClass} border-red-500 border-2`
    }
    if (hasValue) {
      return `${baseClass} border-green-500`
    }
    return `${baseClass} border-gray-300`
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La photo doit faire moins de 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setData((prev) => ({
          ...prev,
          photo: file,
          photoPreview: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setData((prev) => ({
      ...prev,
      photo: null,
      photoPreview: null
    }))
  }

  const generateNumeroH = async (form: WrittenData): Promise<string> => {
    const generation = calculateGeneration(form.dateNaissance)
    // Préfixe NumeroH : génération + continent + pays + région (choisie) + ethnie + famille
    const { continentCode: c } = form.paysCode ? getContinentAndRegionByCountry(form.paysCode) : { continentCode: 'C1', regionCode: 'R1' }
    const continentCode = form.continentCode || c
    const paysCode = form.paysCode || 'P1'
    const regionCode = form.regionCode || (form.paysCode ? getContinentAndRegionByCountry(form.paysCode).regionCode : 'R1')

    const ethnieEntry = ETHNIE_CODES.find((e) => e.label === form.ethnie)
    const familleEntry = FAMILLE_CODES.find((f) => f.label === form.famille)

    const generateAutoCode = (name: string, prefix: string, existingCodes: string[]): string => {
      if (!name) return prefix + '999'
      const existingNums = existingCodes
        .filter((c) => c.startsWith(prefix))
        .map((c) => {
          const numStr = c.substring(prefix.length)
          const num = parseInt(numStr, 10)
          return isNaN(num) ? 0 : num
        })
        .filter((n) => n > 0)
      const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1
      return prefix + nextNum.toString()
    }

    const ethnieCode =
      ethnieEntry?.code || generateAutoCode(form.ethnie, 'E', ETHNIE_CODES.map((e) => e.code))
    const familleCode =
      familleEntry?.code ||
      generateAutoCode(form.famille, 'F', FAMILLE_CODES.map((f) => f.code))

    const prefix = `${generation}${continentCode}${paysCode}${regionCode}${ethnieCode}${familleCode}`
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
    if (!validateRequiredFields()) {
      alert('Veuillez remplir tous les champs obligatoires (marqués en rouge).')
      const firstErrorField = document.querySelector('.border-red-500')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setLoading(true)

    const numeroH = await generateNumeroH(data)

    // Région choisie dans la liste ; sous-préfecture et quartier en saisie libre pour regroupement
    const inferred = {
      paysCode: data.paysCode,
      pays: countries.find((c) => c.code === data.paysCode)?.name || data.pays,
      regionCode: data.regionCode,
      region: regions.find((r) => r.code === data.regionCode)?.name || data.region,
      sousPrefecture: (data.sousPrefecture && data.sousPrefecture.trim()) || '',
      quartier: (data.quartier && data.quartier.trim()) || ''
    }

    setData((prev) => ({ ...prev, numeroH }))

    const completeData = {
      ...data,
      ...inferred,
      numeroH,
      password: data.password,
      confirmPassword: data.confirmPassword,
      prenom: data.prenom,
      nomFamille: data.famille,
      email: (data.email && data.email.trim()) ? data.email.trim() : `${numeroH}@example.com`,
      religion: data.religion?.trim() || '',
    handicap: data.handicap || '',
      genre: data.genre,
      photo: data.photoPreview,
      photoPreview: data.photoPreview,
      lieu1: (data.quartier && data.quartier.trim()) || data.lieu1 || ''
    }

    try {
      const result = await api.registerLiving(completeData as any)

      if (result.success) {
        const userDataWithPassword = {
          ...result.user,
          password: data.password,
          confirmPassword: data.confirmPassword
        }

        localStorage.setItem('vivant_written', JSON.stringify(userDataWithPassword))
        localStorage.setItem('dernier_vivant', JSON.stringify(userDataWithPassword))

        localStorage.setItem(
          'session_user',
          JSON.stringify({
            numeroH: numeroH,
            userData: userDataWithPassword,
            token: result.token || null,
            type: 'vivant',
            source: 'registration_written'
          })
        )

        if (result.token) {
          localStorage.setItem('token', result.token)
        }

        showCredentialsReminder(numeroH, data.password)
        navigate('/compte')
      } else {
        alert(`❌ Erreur: ${result.message}`)
      }
    } catch (error) {
      console.error('Erreur enregistrement (écrit):', error)
      const dataWithClearPassword = {
        ...completeData,
        password: data.password,
        confirmPassword: data.confirmPassword
      }

      localStorage.setItem('vivant_written', JSON.stringify(dataWithClearPassword))
      localStorage.setItem('dernier_vivant', JSON.stringify(dataWithClearPassword))

      localStorage.setItem(
        'session_user',
        JSON.stringify({
          numeroH: numeroH,
          userData: dataWithClearPassword,
          type: 'vivant',
          source: 'registration_written_fallback'
        })
      )

      showCredentialsReminder(numeroH, data.password)
      navigate('/compte')
    } finally {
      setLoading(false)
    }
  }

  const missingFields: string[] = []
  if (!data.dateNaissance) missingFields.push('Date de naissance')
  if (!data.paysCode) missingFields.push('Pays')
  if (!data.regionCode) missingFields.push('Région')
  if (!(data.sousPrefecture && data.sousPrefecture.trim())) missingFields.push('Sous-préfecture')
  if (!(data.quartier && data.quartier.trim())) missingFields.push('Quartier')
  if (!data.ethnie) missingFields.push('Ethnie')
  if (!data.famille) missingFields.push('Nom de famille')
  if (!data.prenom) missingFields.push('Prénom')
  if (!data.activite1) missingFields.push('Activité principale')
  if (!data.email) missingFields.push('E-mail')
  if (!data.telephone) missingFields.push('Téléphone')
  if (!data.password) missingFields.push('Mot de passe')
  if (!data.confirmPassword) missingFields.push('Confirmation du mot de passe')
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    missingFields.push('Les mots de passe ne correspondent pas')
  }
  if (data.password && data.password.length < 6) {
    missingFields.push('Le mot de passe doit contenir au moins 6 caractères')
  }
  const isDisabled = missingFields.length > 0

  return (
    <div className="stack">
      <h2>Inscription par écrit</h2>
      <div className="card" style={{ maxWidth: '32rem', width: '100%' }}>
        <div className="row">
          <div className="col-6">
            <div className="field">
              <label>Date de naissance</label>
              <input
                type="date"
                value={data.dateNaissance}
                onChange={(e) => {
                  const generation = calculateGeneration(e.target.value)
                  setData((prev) => ({ ...prev, dateNaissance: e.target.value, generation }))
                  if (e.target.value) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('dateNaissance')
                      return next
                    })
                  }
                }}
                required
                className={getFieldClassName('dateNaissance', !!data.dateNaissance)}
              />
              <small style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                Vous pouvez aussi taper la date directement au clavier pour aller plus vite.
              </small>
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>Genre</label>
              <select
                value={data.genre}
                onChange={(e) => setData((prev) => ({ ...prev, genre: e.target.value }))}
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
                value={data.paysCode}
                onChange={(e) => {
                  const selectedCountry = countries.find((c) => c.code === e.target.value)
                  setData((prev) => ({
                    ...prev,
                    pays: selectedCountry?.name || '',
                    paysCode: e.target.value,
                    region: '',
                    regionCode: ''
                  }))
                  if (e.target.value) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('paysCode')
                      return next
                    })
                  }
                }}
                required
                className={getFieldClassName('paysCode', !!data.paysCode)}
              >
                <option value="">Pays</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {data.paysCode && (
                <small className="text-green-600">
                  ✓ Pays : {countries.find((c) => c.code === data.paysCode)?.name}
                </small>
              )}
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>Région *</label>
              <select
                value={data.regionCode}
                onChange={(e) => {
                  const selected = regions.find((r) => r.code === e.target.value)
                  setData((prev) => ({
                    ...prev,
                    region: selected?.name || '',
                    regionCode: e.target.value
                  }))
                  if (e.target.value) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('regionCode')
                      return next
                    })
                  }
                }}
                disabled={!data.paysCode}
                required
                className={getFieldClassName('regionCode', !!data.regionCode)}
              >
                <option value="">
                  {data.paysCode ? `Région (${regions.length})` : 'Choisir un pays d\'abord'}
                </option>
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
              {!data.paysCode && (
                <small className="text-orange-600">Veuillez d&apos;abord sélectionner un pays</small>
              )}
              {data.regionCode && (
                <small className="text-green-600 block mt-1">
                  ✓ Région : {regions.find((r) => r.code === data.regionCode)?.name}
                </small>
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
                value={data.sousPrefecture}
                onChange={(e) => {
                  const v = e.target.value
                  setData((prev) => ({ ...prev, sousPrefecture: v }))
                  if (v.trim()) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('sousPrefecture')
                      return next
                    })
                  }
                }}
                placeholder="Ex. Kaloum, Ratoma..."
                className={getFieldClassName('sousPrefecture', !!(data.sousPrefecture && data.sousPrefecture.trim()))}
              />
              <small className="text-gray-500">
                Saisissez le nom de votre sous-préfecture
              </small>
              {data.sousPrefecture && data.sousPrefecture.trim() && (
                <small className="text-green-600 block mt-1">
                  ✓ Sous-préfecture : {data.sousPrefecture.trim()}
                </small>
              )}
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>Quartier *</label>
              <input
                type="text"
                value={data.quartier}
                onChange={(e) => {
                  const v = e.target.value
                  setData((prev) => ({ ...prev, quartier: v }))
                  if (v.trim()) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('quartier')
                      return next
                    })
                  }
                }}
                placeholder="Ex. Hamdallaye, Taouyah..."
                className={getFieldClassName('quartier', !!(data.quartier && data.quartier.trim()))}
              />
              <small className="text-gray-500">
                Saisissez le nom de votre quartier (regroupement avec les personnes du même quartier)
              </small>
              {data.quartier && data.quartier.trim() && (
                <small className="text-green-600 block mt-1">
                  ✓ Quartier : {data.quartier.trim()}
                </small>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="field">
              <label>Activité principale *</label>
              <select
                value={data.activite1}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, activite1: e.target.value }))
                  if (e.target.value) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('activite1')
                      return next
                    })
                  }
                }}
                required
                className={getFieldClassName('activite1', !!data.activite1)}
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
                value={data.ethnie}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, ethnie: e.target.value }))
                  if (e.target.value) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('ethnie')
                      return next
                    })
                  }
                }}
                required
                className={getFieldClassName('ethnie', !!data.ethnie)}
              >
                <option value="">Ethnie</option>
                {ETHNIES.map((ethnie) => (
                  <option key={ethnie} value={ethnie}>
                    {ethnie}
                  </option>
                ))}
              </select>
              {data.ethnie && (
                <small className="text-green-600">
                  ✓ Ethnie sélectionnée : {data.ethnie}
                </small>
              )}
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>Famille (Nom) *</label>
              <select
                value={data.famille}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, famille: e.target.value }))
                  if (e.target.value) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('famille')
                      return next
                    })
                  }
                }}
                required
                className={getFieldClassName('famille', !!data.famille)}
              >
                <option value="">Nom de famille</option>
                {FAMILLES.map((famille) => (
                  <option key={famille} value={famille}>
                    {famille}
                  </option>
                ))}
              </select>
              {data.famille && (
                <small className="text-green-600">
                  ✓ Nom de famille sélectionné : {data.famille}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="field">
              <label>Prénom *</label>
              <input
                value={data.prenom}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, prenom: e.target.value }))
                  if (e.target.value.trim()) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('prenom')
                      return next
                    })
                  }
                }}
                placeholder="Prénom"
                required
                className={getFieldClassName('prenom', !!data.prenom)}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>Téléphone *</label>
              <input
                value={data.telephone}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, telephone: e.target.value }))
                  if (e.target.value.trim()) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('telephone')
                      return next
                    })
                  }
                }}
                placeholder="Téléphone"
                required
                className={getFieldClassName('telephone', !!data.telephone)}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="field">
              <label>NuméroH (Père)</label>
              <input
                value={data.numeroHPere}
                onChange={(e) => setData((prev) => ({ ...prev, numeroHPere: e.target.value }))}
                placeholder="Ex: G1C1P1R1E1F1 1"
              />
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>NuméroH (Mère)</label>
              <input
                value={data.numeroHMere}
                onChange={(e) => setData((prev) => ({ ...prev, numeroHMere: e.target.value }))}
                placeholder="Ex: G1C1P1R1E1F1 2"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="field">
              <label>E-mail *</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, email: e.target.value }))
                  if (e.target.value.trim()) {
                    setValidationErrors((prev) => {
                      const next = new Set(prev)
                      next.delete('email')
                      return next
                    })
                  }
                }}
                placeholder="Email"
                required
                className={getFieldClassName('email', !!data.email)}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>Religion</label>
              <input
                value={data.religion}
                onChange={(e) => setData((prev) => ({ ...prev, religion: e.target.value }))}
                placeholder="Religion"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="field" style={{ maxWidth: '16rem' }}>
              <label>Personne en situation de handicap ?</label>
              <select
                value={data.handicap}
                onChange={(e) => setData((prev) => ({ ...prev, handicap: e.target.value }))}
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
              <label>Mot de passe *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, password: e.target.value }))
                    if (e.target.value && e.target.value.length >= 6) {
                      setValidationErrors((prev) => {
                        const next = new Set(prev)
                        next.delete('password')
                        return next
                      })
                    }
                  }}
                  placeholder="Mot de passe"
                  minLength={6}
                  required
                  className={getFieldClassName(
                    'password',
                    !!data.password && data.password.length >= 6
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '999px',
                    padding: '0.4rem 0.7rem',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {data.password && data.password.length < 6 && (
                <small className="error">
                  Le mot de passe doit contenir au moins 6 caractères
                </small>
              )}
            </div>
          </div>
          {data.password && (
            <div className="col-6">
              <div className="field">
                <label>Confirmer le mot de passe *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={data.confirmPassword}
                    onChange={(e) => {
                      setData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                      if (
                        e.target.value &&
                        data.password === e.target.value &&
                        e.target.value.length >= 6
                      ) {
                        setValidationErrors((prev) => {
                          const next = new Set(prev)
                          next.delete('confirmPassword')
                          return next
                        })
                      }
                    }}
                    placeholder="Confirmer"
                    minLength={6}
                    required
                    className={getFieldClassName(
                      'confirmPassword',
                      !!data.confirmPassword &&
                        data.password === data.confirmPassword &&
                        data.password.length >= 6
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? 'Masquer la confirmation du mot de passe'
                        : 'Afficher la confirmation du mot de passe'
                    }
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '999px',
                      padding: '0.4rem 0.7rem',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '1.1rem'
                    }}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {data.confirmPassword && data.password !== data.confirmPassword && (
                  <small className="error">Les mots de passe ne correspondent pas</small>
                )}
                {data.confirmPassword &&
                  data.password === data.confirmPassword &&
                  data.password.length >= 6 && (
                    <small className="success">✓ Les mots de passe correspondent</small>
                  )}
              </div>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-12">
            <div className="field">
              <label>Photo de profil</label>
              <div className="photo-upload-section">
                {data.photoPreview ? (
                  <div className="photo-preview">
                    <img
                      src={data.photoPreview}
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
                      id="photo-upload-written"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="photo-upload-written" className="upload-button">
                      <span
                        className="upload-icon"
                        style={{ fontSize: '2.5rem', lineHeight: 1 }}
                      >
                        📷
                      </span>
                      <span style={{ fontWeight: 600 }}>Photo de profil</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button
            className={`btn ${isDisabled ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={isDisabled || loading}
            style={{
              opacity: isDisabled || loading ? 0.6 : 1,
              cursor: isDisabled || loading ? 'not-allowed' : 'pointer'
            }}
          >
            {isDisabled
              ? 'Remplir les champs obligatoires'
              : loading
              ? 'Envoi en cours…'
              : '✅ Envoyer'}
          </button>
        </div>
      </div>
    </div>
  )
}

