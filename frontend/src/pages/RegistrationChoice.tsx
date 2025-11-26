import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'

export function RegistrationChoice() {
  const { t } = useI18n()
  return (
    <div className="stack">
      <h2>{t('choice.title')}</h2>
      <div className="card">
        <div className="simple-options">
          <Link className="btn" to="/vivant">
            {t('choice.living')}
          </Link>
          
          <Link className="btn secondary" to="/defunt">
            {t('choice.deceased')}
          </Link>
        </div>
      </div>
    </div>
  )
}
