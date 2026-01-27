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
    
    try {
      // Connexion directe et rapide
      const result = await api.login(numeroH, password)
      
      if (result.success) {
        // Redirection immédiate sans alert
        navigate('/compte')
      } else {
        // Messages d'erreur simples
        if (result.numeroHExists) {
          setError('Mot de passe incorrect')
        } else {
          setError('NumeroH ou mot de passe incorrect')
        }
      }
    } catch (error: any) {
      // Message d'erreur simple
      setError(error?.message || 'Erreur de connexion. Vérifiez vos identifiants.')
    }
  }

  return (
    <div className="stack max-w-lg mx-auto w-full px-2 xs:px-0">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('login.title')}</h1>
      <div className="card stack">
        <div className="row">
          <div className="col-6">
            <div className="field">
              <label>{t('login.numeroh')}</label>
              <input 
                value={numeroH} 
                onChange={(e)=>setNumeroH(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
                placeholder="Ex: G1C1P2R1E1F1 1" 
                autoFocus
              />
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>{t('login.password')}</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
              />
            </div>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button type="button" className="btn min-h-[44px] w-full sm:w-auto" onClick={onSubmit}>{t('login.submit')}</button>
        </div>
        <div className="text-center mt-5 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          {t('login.signup_prompt')} <a href="/choix" className="text-indigo-500 dark:text-indigo-400 underline cursor-pointer hover:no-underline">{t('login.signup_link')}</a>
        </div>
      </div>
    </div>
  )
}


