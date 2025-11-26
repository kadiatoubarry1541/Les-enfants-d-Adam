import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useI18n } from '../i18n/useI18n'

export function Login() {
  const [numeroH, setNumeroH] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useI18n()

  // Auto-remplir depuis sessionStorage si on vient d'un test
  useEffect(() => {
    const testNumeroH = sessionStorage.getItem('test_numeroH')
    const testPassword = sessionStorage.getItem('test_password')
    
    if (testNumeroH && testPassword) {
      setNumeroH(testNumeroH)
      setPassword(testPassword)
      console.log('✅ Identifiants de test chargés')
      
      // Nettoyer après utilisation
      sessionStorage.removeItem('test_numeroH')
      sessionStorage.removeItem('test_password')
    }
  }, [])

  const onSubmit = async () => {
    setError('')
    if (!numeroH || !password) {
      setError(t('login.error_required'))
      return
    }
    
    console.log('🔍 TENTATIVE DE CONNEXION:', numeroH)
    console.log('🔐 Mot de passe saisi:', password)
    
    try {
      // Utiliser l'API qui gère backend + fallback localStorage
      const result = await api.login(numeroH, password)
      
      console.log('📋 Résultat de connexion:', result)
      
      if (result.success) {
        console.log('✅ CONNEXION RÉUSSIE:', result.message || 'Authentification validée')
        console.log('👤 Utilisateur connecté:', result.user)
        
        // La session est déjà sauvegardée par api.login()
        alert(`✅ ${t('login.submit')} !\n\nBienvenue ${result.user?.prenom} ${result.user?.nomFamille || ''}`)
        
        navigate('/compte')
      } else {
        console.log('❌ ÉCHEC DE CONNEXION:', result.message)
        
        // Si le result indique que le numeroH existe mais pas le bon mot de passe
        if (result.numeroHExists) {
          setError('Mot de passe incorrect pour ce NumeroH. Veuillez vérifier votre mot de passe.')
        } else {
          // Vérifier si le NumeroH existe dans localStorage (peut-être avec un mauvais mot de passe)
          const searchKeys = [
            'dernier_vivant',
            'vivant_written',
            'vivant_video',
            'defunt_video', 
            'defunt_written',
            'dernier_defunt'
          ]
          
          let numeroHExists = false
          let existingUser = null
          
          for (const key of searchKeys) {
            const raw = localStorage.getItem(key)
            if (raw) {
              try {
                const data = JSON.parse(raw)
                const userNumeroH = data.numeroH || data.numeroHD
                const normalizedUserNumeroH = userNumeroH?.replace(/\s+/g, ' ').trim()
                const normalizedNumeroH = numeroH.replace(/\s+/g, ' ').trim()
                
                console.log(`🔍 Comparaison: "${normalizedUserNumeroH}" === "${normalizedNumeroH}"`)
                
                if (normalizedUserNumeroH === normalizedNumeroH) {
                  numeroHExists = true
                  existingUser = data
                  console.log(`⚠️ NumeroH trouvé dans ${key}:`, {
                    numeroH: existingUser.numeroH,
                    hasPassword: !!existingUser.password,
                    password: existingUser.password
                  })
                  break
                }
              } catch (e) {
                // Ignore
              }
            }
          }
          
          if (numeroHExists) {
            setError(`Mot de passe incorrect pour ce NumeroH.\n\nNumeroH: ${existingUser.numeroH || existingUser.numeroHD}\nUtilisateur: ${existingUser.prenom} ${existingUser.nomFamille || existingUser.nom}\n\nVeuillez vérifier votre mot de passe.`)
          } else {
            // NumeroH n'existe pas → Proposer l'inscription
            const wantsToRegister = confirm(`Le NumeroH "${numeroH}" n'existe pas encore.\n\n${t('login.signup_prompt')}`)
            
            if (wantsToRegister) {
              navigate('/choix')
              return
            } else {
              setError(`NumeroH non trouvé. ${t('login.signup_prompt')}`)
            }
          }
        }
      }
    } catch (error) {
      console.error('💥 ERREUR CONNEXION:', error)
      setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.')
    }
  }

  return (
    <div className="stack">
      <h1>{t('login.title')}</h1>
      <div className="card stack">
        <div className="row">
          <div className="col-6">
            <div className="field">
              <label>{t('login.numeroh')}</label>
              <input value={numeroH} onChange={(e)=>setNumeroH(e.target.value)} placeholder="Ex: G1C1P2R1E1F1 1" />
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>{t('login.password')}</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn" onClick={onSubmit}>{t('login.submit')}</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          {t('login.signup_prompt')} <a href="/choix" style={{ color: '#667eea', textDecoration: 'underline', cursor: 'pointer' }}>{t('login.signup_link')}</a>
        </div>
      </div>
    </div>
  )
}


