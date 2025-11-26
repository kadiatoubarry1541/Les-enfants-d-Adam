import { useState, useMemo } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { FAMILLES, ETHNIES, LANGUES, CONTINENT_CODE, PAYS, REGION_CODES, ETHNIE_CODES, FAMILLE_CODES } from '../../utils/constants'
import { CheckboxGroup, Field, FilePicker, Select, SelectCode } from '../../components/inputs'
import { ActivitySelector } from '../../components/ActivitySelector'
import { useI18n } from '../../i18n/useI18n'
import { calculerAge } from '../../utils/calculs'
import { buildNumeroH, computeGenerationCode } from '../../utils/codes'
import { LivingChoice } from './LivingChoice'
import { VideoRegistration } from './VideoRegistration'
import { api } from '../../utils/api'
import { 
  getRegions, 
  getPrefecturesByRegion, 
  getSousPrefecturesByPrefecture, 
  getDistrictsBySousPrefecture,
  getAllDistrictsAndQuartiers 
} from '../../utils/guineaGeography'

type EtatVivant = {
  // Page 1
  famillePere?: string
  prenomPere?: string
  pereStatut?: 'Vivant' | 'Mort'
  numeroHPere?: string
  familleMere?: string
  prenomMere?: string
  mereStatut?: 'Vivant' | 'Mort'
  numeroHMere?: string
  ethnie?: string
  regionOrigine?: string
  prefecture?: string
  sousPrefecture?: string
  prenom?: string  // ✅ Votre prénom

  // Page 2
  langues: string[]
  languesAutre?: string
  dateNaissance?: string
  age?: number | null
  rangNaissance?: string
  nomFamille?: string
  lieu1?: string
  lieu2?: string
  lieu3?: string
  nationalite?: string
  pays?: string
  genre?: 'FEMME' | 'HOMME' | 'AUTRE'
  statutSocial?: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf / Veuve' | 'Autre'
  nbFemmes?: number

  // Page 3
  religion?: string
  etatPhysique?: string
  situationSanitaire?: 'En bonne santé' | 'Malade'
  activite1?: string
  activite2?: string
  activite3?: string
  situationEco?: 'Droit au ZAKA' | 'Moyen' | 'Pauvre' | 'Riche'
  tel1?: string
  tel2?: string
  email?: string
  generation?: string

  // Page 4
  nbFreresMere?: number
  nbSoeursMere?: number
  nbFreresPere?: number
  nbSoeursPere?: number
  nbTantesMaternelles?: number
  nbTantesPaternelles?: number
  nbOnclesMaternels?: number
  nbOnclesPaternels?: number
  nbCousins?: number
  nbCousines?: number
  nbFilles?: number
  nbGarcons?: number

  // Page 5
  password?: string
  confirm?: string
  photo?: File
  numeroH?: string
}

const initial: EtatVivant = { langues: [] }

export function LivingWizard() {
  const [state, setState] = useState<EtatVivant>(initial)
  const navigate = useNavigate()
  const { t } = useI18n()

  const ageCalcule = useMemo(() => state.dateNaissance ? calculerAge(state.dateNaissance) : null, [state.dateNaissance])
  const generation = useMemo(() => state.dateNaissance ? computeGenerationCode(state.dateNaissance) : '', [state.dateNaissance])

  // Logique hiérarchique pour les données géographiques
  const regions = useMemo(() => getRegions(), [])
  const prefectures = useMemo(() => 
    state.regionOrigine ? getPrefecturesByRegion(state.regionOrigine) : [], 
    [state.regionOrigine]
  )
  const sousPrefectures = useMemo(() => 
    state.prefecture ? getSousPrefecturesByPrefecture(state.prefecture) : [], 
    [state.prefecture]
  )
  const districts = useMemo(() => 
    state.sousPrefecture ? getDistrictsBySousPrefecture(state.sousPrefecture) : [], 
    [state.sousPrefecture]
  )
  const allDistricts = useMemo(() => getAllDistrictsAndQuartiers(), [])

  const set = (patch: Partial<EtatVivant>) => {
    setState(s => {
      const newState = { ...s, ...patch }
      
      // Réinitialiser les champs dépendants quand on change la région
      if (patch.regionOrigine && patch.regionOrigine !== s.regionOrigine) {
        newState.prefecture = undefined
        newState.sousPrefecture = undefined
      }
      
      // Réinitialiser les champs dépendants quand on change la préfecture
      if (patch.prefecture && patch.prefecture !== s.prefecture) {
        newState.sousPrefecture = undefined
      }
      
      return newState
    })
  }

  const submitFinal = async () => {
    if (!state.password || state.password !== state.confirm) {
      alert('Les mots de passe ne correspondent pas.')
      return
    }
    
    // Convertir la photo en base64 si elle existe
    let photoBase64 = null
    if (state.photo) {
      try {
        photoBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(state.photo!)
        })
      } catch (error) {
        console.error('Erreur conversion photo:', error)
      }
    }
    
    // Vérifier si le NumeroH du père existe
    let pereData = null
    if (state.numeroHPere) {
      const searchKeys = ['dernier_vivant', 'vivant_written', 'vivant_video', 'defunt_video', 'defunt_written', 'dernier_defunt']
      for (const key of searchKeys) {
        const raw = localStorage.getItem(key)
        if (raw) {
          try {
            const data = JSON.parse(raw)
            if (data.numeroH === state.numeroHPere || data.numeroHD === state.numeroHPere) {
              pereData = data
              console.log('✅ Père trouvé:', pereData)
              break
            }
          } catch (e) {
            // Ignore
          }
        }
      }
      
      if (!pereData) {
        alert(`⚠️ Le NumeroH du père "${state.numeroHPere}" n'existe pas dans le système.\n\nVeuillez vérifier le numéro ou enregistrer le père d'abord.`)
        return
      }
    }
    
    const paysCode = state.pays || 'P2'
    const regionCode = REGION_CODES.find(r=>r.label===state.regionOrigine)?.code || 'R1'
    const ethnieCode = ETHNIE_CODES.find(e=>e.label===state.ethnie)?.code || 'E1'
    const familleCode = FAMILLE_CODES.find(f=>f.label.toLowerCase() === (state.nomFamille||'').toLowerCase())?.code || 'F1'
    const numero = buildNumeroH({
      generation: generation as `G${number}`,
      continent: CONTINENT_CODE.Afrique,
      pays: paysCode,
      region: regionCode,
      ethnie: ethnieCode,
      famille: familleCode
    })
    
    const userData = { 
      ...state, 
      age: ageCalcule, 
      generation, 
      numeroH: numero,
      password: state.password,
      confirmPassword: state.confirm,
      prenom: state.prenom || state.prenomPere || 'Utilisateur',
      nomFamille: state.nomFamille || 'Inconnu',
      email: state.email || `${numero}@example.com`,
      type: 'vivant' as const,
      // Photo de profil en base64
      photo: photoBase64,
      // Liens familiaux
      pereNumeroH: state.numeroHPere,
      mereNumeroH: state.numeroHMere,
      pereData: pereData,
      parents: [state.numeroHPere, state.numeroHMere].filter(Boolean),
      children: []
    }

    try {
      const result = await api.registerLiving(userData)
      
      if (result.success) {
        // ⚠️ IMPORTANT : S'assurer que le mot de passe EN CLAIR est toujours sauvegardé
        // Le backend retourne l'utilisateur sans le mot de passe (sécurité)
        const userDataWithPassword = {
          ...result.user,
          password: state.password, // Forcer le mot de passe en clair
          confirmPassword: state.confirm
        }
        
        // Sauvegarder dans plusieurs clés pour assurer la compatibilité
        localStorage.setItem('dernier_vivant', JSON.stringify(userDataWithPassword))
        localStorage.setItem('vivant_written', JSON.stringify(userDataWithPassword))
        localStorage.setItem('session_user', JSON.stringify({
          numeroH: numero,
          userData: userDataWithPassword,
          type: 'vivant',
          source: 'registration'
        }))
        
        console.log('✅ Données sauvegardées avec mot de passe EN CLAIR:', {
          numeroH: userDataWithPassword.numeroH,
          password: userDataWithPassword.password,
          hasPassword: !!userDataWithPassword.password,
          passwordLength: userDataWithPassword.password?.length
        })
        
        // Mettre à jour l'arbre généalogique du père
        if (pereData && state.numeroHPere) {
          const updatedPereData = {
            ...pereData,
            children: [...(pereData.children || []), numero]
          }
          
          // Sauvegarder le père mis à jour
          const pereKeys = ['dernier_vivant', 'vivant_written', 'vivant_video', 'defunt_video', 'defunt_written', 'dernier_defunt']
          pereKeys.forEach(key => {
            const raw = localStorage.getItem(key)
            if (raw) {
              try {
                const data = JSON.parse(raw)
                if (data.numeroH === state.numeroHPere || data.numeroHD === state.numeroHPere) {
                  localStorage.setItem(key, JSON.stringify(updatedPereData))
                  console.log(`✅ Père mis à jour dans ${key}`)
                }
              } catch (e) {
                // Ignore
              }
            }
          })
        }
        
        alert(`✅ Enregistrement réussi ! Votre NumeroH est: ${numero}.\n\n${pereData ? `✅ Vous avez été ajouté à l'arbre généalogique de ${pereData.prenom} ${pereData.nomFamille}` : '⚠️ Aucun père trouvé - vous êtes le premier de votre lignée'}\n\nVous êtes maintenant connecté !`)
        // Attendre un peu pour que l'utilisateur voie le message
        setTimeout(() => {
          navigate('/compte')
        }, 2000)
      } else {
        alert(`❌ Erreur: ${result.message}`)
      }
    } catch (error) {
      console.error('Erreur enregistrement:', error)
      // Fallback: sauvegarder localement avec le mot de passe EN CLAIR
      const dataWithClearPassword = {
        ...userData,
        password: state.password, // Mot de passe EN CLAIR
        confirmPassword: state.confirm
      }
      
      localStorage.setItem('dernier_vivant', JSON.stringify(dataWithClearPassword))
      localStorage.setItem('vivant_written', JSON.stringify(dataWithClearPassword))
      localStorage.setItem('session_user', JSON.stringify({
        numeroH: numero,
        userData: dataWithClearPassword,
        type: 'vivant',
        source: 'registration_fallback'
      }))
      
      console.log('✅ Données sauvegardées en fallback avec mot de passe EN CLAIR:', {
        numeroH: dataWithClearPassword.numeroH,
        password: dataWithClearPassword.password,
        hasPassword: !!dataWithClearPassword.password,
        passwordLength: dataWithClearPassword.password?.length
      })
      
      alert(`✅ Enregistrement sauvegardé localement ! Votre NumeroH est: ${numero}. Vous êtes maintenant connecté !`)
      // Attendre un peu pour que l'utilisateur voie le message
      setTimeout(() => {
        navigate('/compte')
      }, 1000)
    }
  }

  return (
    <Routes>
      <Route path="/" element={<LivingChoice />} />
      <Route path="/video" element={<VideoRegistration />} />
      <Route path="/formulaire" element={
        <div className="stack">
          <h2>{t('wiz.live.title1')}</h2>
          <div className="card stack">
            <div className="row">
              <div className="col-6">
                <Field label={t('label.family_father')}>
                  <Select value={state.famillePere} onChange={(v)=>set({ famillePere: v })} options={FAMILLES} placeholder="Sélectionner" />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.father_firstname')}>
                  <input value={state.prenomPere||''} onChange={e=>set({ prenomPere: e.target.value })} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.father_status')}>
                  <Select value={state.pereStatut} onChange={(v)=>set({ pereStatut: v as any })} options={[ 'Vivant','Mort' ]} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.father_numeroh')}>
                  <input value={state.numeroHPere||''} onChange={e=>set({ numeroHPere: e.target.value })} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.family_mother')}>
                  <Select value={state.familleMere} onChange={(v)=>set({ familleMere: v })} options={FAMILLES} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.mother_firstname')}>
                  <input value={state.prenomMere||''} onChange={e=>set({ prenomMere: e.target.value })} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.mother_status')}>
                  <Select value={state.mereStatut} onChange={(v)=>set({ mereStatut: v as any })} options={[ 'Vivant','Mort' ]} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.mother_numeroh')}>
                  <input value={state.numeroHMere||''} onChange={e=>set({ numeroHMere: e.target.value })} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.ethnie')}>
                  <Select value={state.ethnie} onChange={(v)=>set({ ethnie: v })} options={ETHNIES} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.region_origin')}>
                  <select 
                    value={state.regionOrigine} 
                    onChange={(e)=>set({ regionOrigine: e.target.value })} 
                  >
                    <option value="">Sélectionner</option>
                    {regions.map(r => (
                      <option key={r.code} value={r.code}>{r.name}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="col-6">
                <Field label="Préfecture">
                  <select 
                    value={state.prefecture} 
                    onChange={(e)=>set({ prefecture: e.target.value })} 
                    disabled={!state.regionOrigine}
                  >
                    <option value="">Sélectionner une préfecture</option>
                    {prefectures.map(p => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="col-6">
                <Field label="Sous-préfecture">
                  <select 
                    value={state.sousPrefecture} 
                    onChange={(e)=>set({ sousPrefecture: e.target.value })} 
                    disabled={!state.prefecture}
                  >
                    <option value="">Sélectionner une sous-préfecture</option>
                    {sousPrefectures.map(sp => (
                      <option key={sp.code} value={sp.code}>{sp.name}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
            <div className="actions">
              <button className="btn" onClick={()=>{ localStorage.setItem('vivant', JSON.stringify(state)); navigate('page-2') }}>{t('btn.next')}</button>
            </div>
          </div>
        </div>
      }/>
      <Route path="page-2" element={
        <div className="stack">
          <h2>{t('wiz.live.title2')}</h2>
          <div className="card stack">
            <Field label={t('label.languages')}>
              <CheckboxGroup options={LANGUES} values={state.langues} onChange={(v)=>set({ langues: v })} />
            </Field>
            <Field label={t('label.language_other')}>
              <input value={state.languesAutre||''} onChange={(e)=>set({ languesAutre: e.target.value })} />
            </Field>
            <div className="row">
              <div className="col-6">
                <Field label={t('label.birthdate')}>
                  <input type="date" value={state.dateNaissance||''} onChange={e=>set({ dateNaissance: e.target.value })} />
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.age_auto')}>
                  <input value={ageCalcule ?? ''} readOnly />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Field label={t('label.birth_rank')}>
                  <select value={state.rangNaissance||''} onChange={e=>set({ rangNaissance: e.target.value })}>
                    <option value="">Sélectionner</option>
                    {Array.from({length:20},(_,i)=>i+1).map(n=> <option key={n} value={String(n)}>{n}</option>)}
                  </select>
                </Field>
              </div>
              <div className="col-6">
                <Field label={t('label.family_name')}>
                  <input value={state.nomFamille||''} onChange={e=>set({ nomFamille: e.target.value })} />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field label="Lieu de résidence 1 (District/Quartier)">
                  <select 
                    value={state.lieu1} 
                    onChange={(e)=>set({ lieu1: e.target.value })} 
                    disabled={!state.sousPrefecture}
                  >
                    <option value="">Sélectionner un district/quartier</option>
                    {districts.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Basé sur votre sous-préfecture sélectionnée
                  </small>
                </Field>
              </div>
              <div className="col-4">
                <Field label="Lieu de résidence 2 (District/Quartier)">
                  <select 
                    value={state.lieu2} 
                    onChange={(e)=>set({ lieu2: e.target.value })} 
                  >
                    <option value="">Sélectionner un district/quartier</option>
                    {allDistricts.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Tous les districts et quartiers de Guinée
                  </small>
                </Field>
              </div>
              <div className="col-4">
                <Field label="Lieu de résidence 3 (District/Quartier)">
                  <select 
                    value={state.lieu3} 
                    onChange={(e)=>set({ lieu3: e.target.value })} 
                  >
                    <option value="">Sélectionner un district/quartier</option>
                    {allDistricts.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Tous les districts et quartiers de Guinée
                  </small>
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field label={t('label.nationality')}>
                  <input value={state.nationalite||''} onChange={e=>set({ nationalite: e.target.value })} />
                </Field>
              </div>
              <div className="col-4">
                <Field label={t('label.country')}>
                  <SelectCode value={state.pays} onChange={(v)=>set({ pays: v })} options={PAYS as any} />
                </Field>
              </div>
              <div className="col-4">
                <Field label={t('label.gender')}>
                  <Select value={state.genre} onChange={(v)=>set({ genre: v as any })} options={[ 'FEMME','HOMME','AUTRE' ]} />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Field label={t('label.social_status')}>
                  <Select value={state.statutSocial} onChange={(v)=>set({ statutSocial: v as any })} options={[ 'Célibataire','Marié(e)','Divorcé(e)','Veuf / Veuve','Autre' ]} />
                </Field>
              </div>
              {state.genre === 'HOMME' && state.statutSocial === 'Marié(e)' && (
                <div className="col-6">
                  <Field label={t('label.nb_wives')}>
                    <select value={String(state.nbFemmes||0)} onChange={e=>set({ nbFemmes: Number(e.target.value) })}>
                      {Array.from({length:10},(_,i)=>i).map(n=> <option key={n} value={n}>{n}</option>)}
                    </select>
                  </Field>
                </div>
              )}
            </div>
            <div className="actions">
              <button className="btn secondary" onClick={()=>navigate(-1)}>{t('btn.back')}</button>
              <button className="btn" onClick={()=>{ localStorage.setItem('vivant', JSON.stringify(state)); navigate('page-3') }}>{t('btn.next')}</button>
            </div>
          </div>
        </div>
      }/>
      <Route path="page-3" element={
        <div className="stack">
          <h2>{t('wiz.live.title3')}</h2>
          <div className="card stack">
            <div className="row">
              <div className="col-4"><Field label={t('label.religion')}><input value={state.religion||''} onChange={e=>set({ religion: e.target.value })} /></Field></div>
              <div className="col-4"><Field label={t('label.phys_state')}><input value={state.etatPhysique||''} onChange={e=>set({ etatPhysique: e.target.value })} /></Field></div>
              <div className="col-4"><Field label={t('label.health')}><Select value={state.situationSanitaire} onChange={(v)=>set({ situationSanitaire: v as any })} options={[ 'En bonne santé','Malade' ]} /></Field></div>
            </div>
            <div className="row">
              <div className="col-4"><ActivitySelector value={state.activite1} onChange={(v)=>set({ activite1: v })} label={t('label.activity1')} /></div>
              <div className="col-4"><ActivitySelector value={state.activite2} onChange={(v)=>set({ activite2: v })} label={t('label.activity2')} /></div>
              <div className="col-4"><ActivitySelector value={state.activite3} onChange={(v)=>set({ activite3: v })} label={t('label.activity3')} /></div>
            </div>
            <div className="row">
              <div className="col-4"><Field label={t('label.economic')}><Select value={state.situationEco} onChange={(v)=>set({ situationEco: v as any })} options={[ 'Droit au ZAKA','Moyen','Pauvre','Riche' ]} /></Field></div>
              <div className="col-4"><Field label={t('label.phone1')}><input value={state.tel1||''} onChange={e=>set({ tel1: e.target.value })} /></Field></div>
              <div className="col-4"><Field label={t('label.phone2')}><input value={state.tel2||''} onChange={e=>set({ tel2: e.target.value })} /></Field></div>
            </div>
            <div className="row">
              <div className="col-6"><Field label={t('label.email')}><input type="email" value={state.email||''} onChange={e=>set({ email: e.target.value })} /></Field></div>
              <div className="col-6"><Field label={t('label.generation_auto')}><input value={generation} readOnly /></Field></div>
            </div>
            <div className="actions">
              <button className="btn secondary" onClick={()=>navigate(-1)}>{t('btn.back')}</button>
              <button className="btn" onClick={()=>{ localStorage.setItem('vivant', JSON.stringify(state)); navigate('page-4') }}>{t('btn.next')}</button>
            </div>
          </div>
        </div>
      }/>
      <Route path="page-4" element={
        <div className="stack">
          <h2>{t('wiz.live.title4')}</h2>
          <div className="card stack">
            <div className="row">
              <div className="col-3"><Field label={t('label.brothers_mother')}><input type="number" min={0} value={state.nbFreresMere||0} onChange={e=>set({ nbFreresMere: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.sisters_mother')}><input type="number" min={0} value={state.nbSoeursMere||0} onChange={e=>set({ nbSoeursMere: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.brothers_father')}><input type="number" min={0} value={state.nbFreresPere||0} onChange={e=>set({ nbFreresPere: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.sisters_father')}><input type="number" min={0} value={state.nbSoeursPere||0} onChange={e=>set({ nbSoeursPere: Number(e.target.value) })} /></Field></div>
            </div>
            <div className="row">
              <div className="col-3"><Field label={t('label.aunts_maternal')}><input type="number" min={0} value={state.nbTantesMaternelles||0} onChange={e=>set({ nbTantesMaternelles: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.aunts_paternal')}><input type="number" min={0} value={state.nbTantesPaternelles||0} onChange={e=>set({ nbTantesPaternelles: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.uncles_maternal')}><input type="number" min={0} value={state.nbOnclesMaternels||0} onChange={e=>set({ nbOnclesMaternels: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.uncles_paternal')}><input type="number" min={0} value={state.nbOnclesPaternels||0} onChange={e=>set({ nbOnclesPaternels: Number(e.target.value) })} /></Field></div>
            </div>
            <div className="row">
              <div className="col-3"><Field label={t('label.cousins_male')}><input type="number" min={0} value={state.nbCousins||0} onChange={e=>set({ nbCousins: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.cousins_female')}><input type="number" min={0} value={state.nbCousines||0} onChange={e=>set({ nbCousines: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.daughters')}><input type="number" min={0} value={state.nbFilles||0} onChange={e=>set({ nbFilles: Number(e.target.value) })} /></Field></div>
              <div className="col-3"><Field label={t('label.sons')}><input type="number" min={0} value={state.nbGarcons||0} onChange={e=>set({ nbGarcons: Number(e.target.value) })} /></Field></div>
            </div>
            <div className="actions">
              <button className="btn secondary" onClick={()=>navigate(-1)}>{t('btn.back')}</button>
              <button className="btn" onClick={()=>{ localStorage.setItem('vivant', JSON.stringify(state)); navigate('page-5') }}>{t('btn.next')}</button>
            </div>
          </div>
        </div>
      }/>
      <Route path="page-5" element={
        <div className="stack">
          <h2>{t('wiz.live.title5')}</h2>
          <div className="card stack">
            <div className="row">
              <div className="col-6"><Field label={t('label.firstname')}><input value={state.prenom||''} onChange={e=>set({ prenom: e.target.value })} placeholder={t('label.firstname')} /></Field></div>
              <div className="col-6"><Field label={t('label.profile_email')}><input type="email" value={state.email||''} onChange={e=>set({ email: e.target.value })} placeholder="votre.email@exemple.com" /></Field></div>
            </div>
            <div className="row">
              <div className="col-4"><Field label={t('label.password')}><input type="password" value={state.password||''} onChange={e=>set({ password: e.target.value })} placeholder={t('label.password')} minLength={6} /></Field></div>
              <div className="col-4"><Field label={t('label.password_confirm')}><input type="password" value={state.confirm||''} onChange={e=>set({ confirm: e.target.value })} placeholder={t('label.password_confirm')} minLength={6} /></Field></div>
              <div className="col-4"><Field label={t('label.profile_photo')}><FilePicker accept="image/*" onFile={(f)=>set({ photo: f })} /></Field></div>
            </div>
            {state.password && state.password.length < 6 && (
              <div className="error">{t('error.password_len')}</div>
            )}
            {state.confirm && state.password !== state.confirm && (
              <div className="error">{t('error.password_match')}</div>
            )}
            {state.confirm && state.password === state.confirm && state.password && state.password.length >= 6 && (
              <div className="success">{t('ok.password_match')}</div>
            )}
            <div className="actions">
              <button className="btn secondary" onClick={()=>navigate(-1)}>{t('btn.back')}</button>
              <button 
                className="btn" 
                onClick={submitFinal}
                disabled={!state.prenom || !state.password || !state.confirm || state.password !== state.confirm || state.password.length < 6}
              >
                {t('btn.create_account')}
              </button>
            </div>
          </div>
        </div>
      }/>
    </Routes>
  )
}