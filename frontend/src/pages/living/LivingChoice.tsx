import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/useI18n'

export function LivingChoice() {
  const { t } = useI18n()
  return (
    <div className="stack">
      <h2>{t('choice.method.title')}</h2>
      <div className="card">
        <div className="simple-options">
          <Link className="btn" to="/vivant/video">
            {t('choice.method.video')}
          </Link>
          
          <Link className="btn secondary" to="/vivant/formulaire">
            {t('choice.method.written')}
          </Link>
        </div>
      </div>
    </div>
  )
}
