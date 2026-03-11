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
  // Champs libres quand l'utilisateur choisit "Autre"
  activite1Autre?: string
  ethnieAutre?: string
  familleAutre?: string
  activiteDescription?: string   // Description facultative de la profession (Autre)
  activiteDoc?: File | null       // Document professionnel facultatif (diplôme, attestation…)
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
    activite1Autre: '',
    ethnieAutre: '',
    familleAutre: '',
    activiteDescription: '',
    activiteDoc: null,
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

    const hasCustomActivite =
      data.activite1 === 'Autre' ? !!(data.activite1Autre && data.activite1Autre.trim()) : !!data.activite1
    const hasEthnie =
      data.ethnie === 'Autre' ? !!(data.ethnieAutre && data.ethnieAutre.trim()) : !!data.ethnie
    const hasFamille =
      data.famille === 'Autre' ? !!(data.familleAutre && data.familleAutre.trim()) : !!data.famille

    if (!data.paysCode) errors.add('paysCode')
    if (!data.regionCode) errors.add('regionCode')
    if (!(data.sousPrefecture && data.sousPrefecture.trim())) errors.add('sousPrefecture')
    if (!(data.quartier && data.quartier.trim())) errors.add('quartier')
    if (!hasEthnie) errors.add('ethnie')
    if (!hasFamille) errors.add('famille')
    if (!data.prenom) errors.add('prenom')
    if (!data.dateNaissance) errors.add('dateNaissance')
    if (!hasCustomActivite) errors.add('activite1')
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

    // Normaliser les champs \"Autre\" pour l'activité, l'ethnie et la famille
    const effectiveActivite1 =
      data.activite1 === 'Autre' && data.activite1Autre?.trim()
        ? data.activite1Autre.trim()
        : data.activite1
    const effectiveEthnie =
      data.ethnie === 'Autre' && data.ethnieAutre?.trim()
        ? data.ethnieAutre.trim()
        : data.ethnie
    const effectiveFamille =
      data.famille === 'Autre' && data.familleAutre?.trim()
        ? data.familleAutre.trim()
        : data.famille

    const normalizedForm: WrittenData = {
      ...data,
      activite1: effectiveActivite1,
      ethnie: effectiveEthnie,
      famille: effectiveFamille
    }

    const numeroH = await generateNumeroH(normalizedForm)

    // Région choisie dans la liste ; sous-préfecture et quartier en saisie libre pour regroupement
    const inferred = {
      paysCode: normalizedForm.paysCode,
      pays: countries.find((c) => c.code === normalizedForm.paysCode)?.name || normalizedForm.pays,
      regionCode: normalizedForm.regionCode,
      region: regions.find((r) => r.code === normalizedForm.regionCode)?.name || normalizedForm.region,
      sousPrefecture: (normalizedForm.sousPrefecture && normalizedForm.sousPrefecture.trim()) || '',
      quartier: (normalizedForm.quartier && normalizedForm.quartier.trim()) || ''
    }

    setData((prev) => ({ ...prev, numeroH }))

    const completeData = {
      ...normalizedForm,
      ...inferred,
      numeroH,
      password: normalizedForm.password,
      confirmPassword: normalizedForm.confirmPassword,
      prenom: normalizedForm.prenom,
      nomFamille: effectiveFamille,
      email: (normalizedForm.email && normalizedForm.email.trim()) ? normalizedForm.email.trim() : `${numeroH}@example.com`,
      religion: normalizedForm.religion?.trim() || '',
      handicap: normalizedForm.handicap || '',
      genre: normalizedForm.genre,
      photo: normalizedForm.photoPreview,
      photoPreview: normalizedForm.photoPreview,
      lieu1: (normalizedForm.quartier && normalizedForm.quartier.trim()) || normalizedForm.lieu1 || ''
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

  // ── Déclencheurs progressifs ──────────────────────────────────────────────
  const ethnieFilled = !!(data.ethnie && (data.ethnie !== 'Autre' || data.ethnieAutre?.trim()))
  const familleFilled = !!(data.famille && (data.famille !== 'Autre' || data.familleAutre?.trim()))
  const activiteFilled = !!(data.activite1 && (data.activite1 !== 'Autre' || data.activite1Autre?.trim()))
  const identiteOK = ethnieFilled && familleFilled && activiteFilled
  const coordonneesOK = !!(data.prenom && data.telephone)

  // Calcul indicateur d'étapes
  const totalSteps = 4
  const step1Done = !!data.dateNaissance
  const step2Done = step1Done && !!data.paysCode && !!data.regionCode && !!(data.sousPrefecture?.trim()) && !!(data.quartier?.trim())
  const step3Done = step2Done && identiteOK && coordonneesOK
  const step4Done = step3Done && !!data.email && !!data.password && data.password === data.confirmPassword && data.password.length >= 6
  const currentStep = step4Done ? 4 : step3Done ? 3 : step2Done ? 2 : 1

  const missingFields: string[] = []
  if (!data.dateNaissance) missingFields.push('Date de naissance')
  if (!data.paysCode) missingFields.push('Pays')
  if (!data.regionCode) missingFields.push('Région')
  if (!(data.sousPrefecture && data.sousPrefecture.trim())) missingFields.push('Sous-préfecture')
  if (!(data.quartier && data.quartier.trim())) missingFields.push('Quartier')
  if (!ethnieFilled) missingFields.push('Ethnie')
  if (!familleFilled) missingFields.push('Nom de famille')
  if (!activiteFilled) missingFields.push('Activité principale')
  if (!data.prenom) missingFields.push('Prénom')
  if (!data.telephone) missingFields.push('Téléphone')
  if (!data.email) missingFields.push('E-mail')
  if (!data.password) missingFields.push('Mot de passe')
  if (!data.confirmPassword) missingFields.push('Confirmation du mot de passe')
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    missingFields.push('Les mots de passe ne correspondent pas')
  }
  if (data.password && data.password.length < 6) {
    missingFields.push('Le mot de passe doit contenir au moins 6 caractères')
  }
  const isDisabled = missingFields.length > 0

  // Labels des étapes
  const stepLabels = ['Identité', 'Localisation', 'Profil', 'Sécurité']

  return (
    <div className="stack">
      <h2>Inscription par écrit</h2>

      {/* ── Barre de progression ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
          <span>Étape {currentStep} sur {totalSteps}</span>
          <span className="text-blue-600 font-semibold">{stepLabels[currentStep - 1]}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-gray-500">
          {stepLabels.map((label, i) => (
            <span key={label} className={currentStep > i ? 'text-blue-600 font-semibold' : ''}>
              {currentStep > i ? '✓ ' : ''}{label}
            </span>
          ))}
        </div>
      </div>

      <div className="card" style={{ maxWidth: '32rem', width: '100%' }}>

        {/* ══ SECTION 1 – Toujours visible : Date de naissance + Genre ══ */}
        <div className="row">
          <div className="col-6">
            <div className="field">
              <label>Date de naissance *</label>
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
                Vous pouvez taper la date directement au clavier.
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

        {/* ══ SECTION 2 – Après la date : Pays ══ */}
        {data.dateNaissance && (
          <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
            <div className="col-12">
              <div className="field">
                <label>Pays *</label>
                <select
                  value={data.paysCode}
                  onChange={(e) => {
                    const selectedCountry = countries.find((c) => c.code === e.target.value)
                    const inferred = e.target.value
                      ? getContinentAndRegionByCountry(e.target.value)
                      : { continentCode: '', regionCode: '' }
                    setData((prev) => ({
                      ...prev,
                      pays: selectedCountry?.name || '',
                      paysCode: e.target.value,
                      continentCode: inferred.continentCode || prev.continentCode,
                      continent: selectedCountry ? '' : prev.continent,
                      region: '',
                      regionCode: inferred.regionCode || '',
                      sousPrefecture: '',
                      quartier: ''
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
                  <option value="">— Choisir un pays —</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {data.paysCode && (
                  <small className="text-green-600">
                    ✓ {countries.find((c) => c.code === data.paysCode)?.name}
                  </small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ SECTION 3 – Après le pays : Région ══ */}
        {data.paysCode && (
          <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
            <div className="col-12">
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
                  required
                  className={getFieldClassName('regionCode', !!data.regionCode)}
                >
                  <option value="">— Choisir une région ({regions.length} disponibles) —</option>
                  {regions.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {data.regionCode && (
                  <small className="text-green-600">
                    ✓ {regions.find((r) => r.code === data.regionCode)?.name}
                  </small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ SECTION 4 – Après le pays : Sous-préfecture + Quartier ══ */}
        {data.paysCode && (
          <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
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
                  className={getFieldClassName('sousPrefecture', !!(data.sousPrefecture?.trim()))}
                />
                {data.sousPrefecture?.trim() && (
                  <small className="text-green-600">✓ {data.sousPrefecture.trim()}</small>
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
                  className={getFieldClassName('quartier', !!(data.quartier?.trim()))}
                />
                <small className="text-gray-500">
                  Permet de vous regrouper avec les personnes du même quartier.
                </small>
                {data.quartier?.trim() && (
                  <small className="text-green-600">✓ {data.quartier.trim()}</small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ SECTION 5 – Après le pays : Activité principale ══ */}
        {data.paysCode && (
          <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
            <div className="col-12">
              <div className="field">
                <label>Activité principale *</label>
                <select
                  value={data.activite1}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, activite1: e.target.value, activite1Autre: '', activiteDescription: '', activiteDoc: null }))
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
                  <option value="">— Choisir une activité —</option>
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
                  <option value="Autre">✏️ Autre (je saisis mon activité)</option>
                </select>

                {/* Sous-champs quand "Autre" est sélectionné */}
                {data.activite1 === 'Autre' && (
                  <div className="mt-3 space-y-3" style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '0.75rem' }}>
                    {/* Nom de l'activité (obligatoire) */}
                    <div>
                      <input
                        type="text"
                        value={data.activite1Autre || ''}
                        onChange={(e) => {
                          setData((prev) => ({ ...prev, activite1Autre: e.target.value }))
                          if (e.target.value.trim()) {
                            setValidationErrors((prev) => {
                              const next = new Set(prev)
                              next.delete('activite1')
                              return next
                            })
                          }
                        }}
                        placeholder="Nom de votre activité (ex. Designer UX, Coach sportif…)"
                        className={getFieldClassName('activite1', !!(data.activite1Autre?.trim()))}
                      />
                    </div>

                    {/* Description facultative */}
                    <div>
                      <textarea
                        value={data.activiteDescription || ''}
                        onChange={(e) => setData((prev) => ({ ...prev, activiteDescription: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Description facultative : diplômes, certifications, expérience…"
                      />
                    </div>

                    {/* Upload document professionnel (facultatif) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document professionnel <span className="text-gray-400 font-normal">(facultatif)</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        id="activite-doc-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setData((prev) => ({ ...prev, activiteDoc: file }))
                        }}
                      />
                      <label
                        htmlFor="activite-doc-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.4rem 0.8rem',
                          border: '1px dashed #6b7280',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: '#374151',
                          background: '#f9fafb'
                        }}
                      >
                        📎 {data.activiteDoc ? data.activiteDoc.name : 'Joindre un document (diplôme, attestation, carte pro…)'}
                      </label>
                      {data.activiteDoc && (
                        <button
                          type="button"
                          onClick={() => setData((prev) => ({ ...prev, activiteDoc: null }))}
                          className="ml-2 text-xs text-red-500 underline"
                        >
                          Supprimer
                        </button>
                      )}
                      <small className="block text-gray-400 mt-1">
                        PDF, image ou Word acceptés. Ce document n&apos;est pas obligatoire.
                      </small>
                    </div>
                  </div>
                )}

                {data.activite1 && data.activite1 !== 'Autre' && (
                  <small className="text-green-600">✓ Activité : {data.activite1}</small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ SECTION 6 – Après le pays : Ethnie + Famille ══ */}
        {data.paysCode && (
          <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
            <div className="col-6">
              <div className="field">
                <label>Ethnie *</label>
                <select
                  value={data.ethnie}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, ethnie: e.target.value, ethnieAutre: '' }))
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
                  <option value="">— Ethnie —</option>
                  {ETHNIES.map((ethnie) => (
                    <option key={ethnie} value={ethnie}>{ethnie}</option>
                  ))}
                  <option value="Autre">✏️ Autre</option>
                </select>
                {data.ethnie === 'Autre' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={data.ethnieAutre || ''}
                      onChange={(e) => setData((prev) => ({ ...prev, ethnieAutre: e.target.value }))}
                      placeholder="Saisissez votre ethnie"
                      className={getFieldClassName('ethnie', !!(data.ethnieAutre?.trim()))}
                    />
                    <small className="text-gray-500 block mt-1">
                      Votre ethnie n&apos;est pas dans la liste ? Écrivez-la ici.
                    </small>
                  </div>
                )}
                {data.ethnie && data.ethnie !== 'Autre' && (
                  <small className="text-green-600">✓ {data.ethnie}</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label>Famille (Nom) *</label>
                <select
                  value={data.famille}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, famille: e.target.value, familleAutre: '' }))
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
                  <option value="">— Nom de famille —</option>
                  {FAMILLES.map((famille) => (
                    <option key={famille} value={famille}>{famille}</option>
                  ))}
                  <option value="Autre">✏️ Autre</option>
                </select>
                {data.famille === 'Autre' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={data.familleAutre || ''}
                      onChange={(e) => setData((prev) => ({ ...prev, familleAutre: e.target.value }))}
                      placeholder="Saisissez votre nom de famille"
                      className={getFieldClassName('famille', !!(data.familleAutre?.trim()))}
                    />
                    <small className="text-gray-500 block mt-1">
                      Votre nom de famille n&apos;est pas dans la liste ? Écrivez-le ici.
                    </small>
                  </div>
                )}
                {data.famille && data.famille !== 'Autre' && (
                  <small className="text-green-600">✓ {data.famille}</small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ SECTION 7 – Après ethnie + famille : Prénom + Téléphone ══ */}
        {identiteOK && (
          <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
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
        )}

        {/* ══ SECTION 8 – Après prénom : NuméroH Père + Mère (optionnel) ══ */}
        {data.prenom && (
          <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
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
        )}

        {/* ══ SECTION 9 – Après prénom + téléphone : Email + Religion + Handicap ══ */}
        {coordonneesOK && (
          <>
            <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
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
                <div className="field">
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
          </>
        )}

        {/* ══ SECTION 10 – Après email : Mot de passe + Photo ══ */}
        {data.email && (
          <>
            <div className="row" style={{ animation: 'fadeInDown 0.3s ease' }}>
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
                      className={getFieldClassName('password', !!data.password && data.password.length >= 6)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                      style={{ border: '1px solid #d1d5db', borderRadius: '999px', padding: '0.4rem 0.7rem', background: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {data.password && data.password.length < 6 && (
                    <small className="error">Au moins 6 caractères requis</small>
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
                          if (e.target.value && data.password === e.target.value && e.target.value.length >= 6) {
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
                        className={getFieldClassName('confirmPassword', !!data.confirmPassword && data.password === data.confirmPassword && data.password.length >= 6)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
                        style={{ border: '1px solid #d1d5db', borderRadius: '999px', padding: '0.4rem 0.7rem', background: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {data.confirmPassword && data.password !== data.confirmPassword && (
                      <small className="error">Les mots de passe ne correspondent pas</small>
                    )}
                    {data.confirmPassword && data.password === data.confirmPassword && data.password.length >= 6 && (
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
                        <img src={data.photoPreview} alt="Aperçu de la photo" className="preview-image" />
                        <div className="photo-actions">
                          <button type="button" className="btn-small secondary" onClick={removePhoto}>
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
                          <span className="upload-icon" style={{ fontSize: '2.5rem', lineHeight: 1 }}>📷</span>
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
                style={{ opacity: isDisabled || loading ? 0.6 : 1, cursor: isDisabled || loading ? 'not-allowed' : 'pointer' }}
              >
                {isDisabled
                  ? 'Remplir les champs obligatoires'
                  : loading
                  ? 'Envoi en cours…'
                  : '✅ Envoyer'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

