import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'

export function LoginMembre() {
  const [numeroH, setNumeroH] = useState('')
  const [nomComplet, setNomComplet] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useI18n()

  const onSubmit = async () => {
    setError('')
    setIsLoading(true)
    
    if (!numeroH || !nomComplet || !password) {
      setError('Veuillez remplir tous les champs.')
      setIsLoading(false)
      return
    }
    
    try {
      // Simuler la vérification des membres invités
      // En réalité, cela devrait vérifier dans la base de données
      // si cette personne est invitée par le propriétaire du site
      
      // Pour la démo, on accepte certaines combinaisons
      const validCombinations = [
        { numeroH: 'G96C1P2R3E2F1 4', nomComplet: 'Test User', password: 'test123' },
        { numeroH: 'G96C1P2R3E2F1 5', nomComplet: 'Membre Test', password: 'member123' }
      ]
      
      const isValidMember = validCombinations.some(combo => 
        combo.numeroH === numeroH && 
        combo.nomComplet.toLowerCase() === nomComplet.toLowerCase() &&
        combo.password === password
      )
      
      if (isValidMember) {
        // Créer une session pour le membre invité
        const memberSession = {
          numeroH,
          nomComplet,
          type: 'membre_invite',
          permissions: ['view', 'like', 'comment', 'react'],
          loginDate: new Date().toISOString()
        }
        
        localStorage.setItem('member_session', JSON.stringify(memberSession))
        
        // Rediriger vers la page du propriétaire
        navigate('/moi')
      } else {
        setError("Vous n'êtes pas autorisé à accéder à ce site. Vérifiez vos informations ou contactez le propriétaire.")
      }
    } catch (error) {
      setError('Erreur lors de la connexion. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-membre">
      <div className="login-container">
        <div className="login-header">
          <h1>{t('member.login.title')}</h1>
          <p>{t('member.login.subtitle')}</p>
        </div>
        
        <div className="login-form">
          <div className="form-group">
            <label>{t('login.numeroh')}</label>
            <input 
              type="text"
              value={numeroH}
              onChange={(e) => setNumeroH(e.target.value)}
              placeholder="Ex: G96C1P2R3E2F1 4"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>{t('member.fullname')}</label>
            <input 
              type="text"
              value={nomComplet}
              onChange={(e) => setNomComplet(e.target.value)}
              placeholder="Ex: Fatoumata Barry"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>{t('login.password')}</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="form-input"
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              className="btn login-btn"
              onClick={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? t('member.loading') : t('member.submit')}
            </button>
          </div>
        </div>
        
        <div className="login-info">
          <h3>{t('member.info.how')}</h3>
          <div className="info-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>{t('member.info.invitation')}</h4>
                <p>{t('member.info.invitation.desc')}</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>{t('member.info.login')}</h4>
                <p>{t('member.info.login.desc')}</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>{t('member.info.interaction')}</h4>
                <p>{t('member.info.interaction.desc')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-footer">
          <p>{t('member.footer.q')}</p>
          <p>{t('member.footer.a')}</p>
        </div>
      </div>
    </div>
  )
}
