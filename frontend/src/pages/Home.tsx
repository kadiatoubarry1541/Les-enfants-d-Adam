import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'

export function Home() {
  const { t } = useI18n()
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Logo du site */}
      <div className="text-center mb-12">
        <img 
          src="/logo.png" 
          alt="Logo du site" 
          className="mx-auto h-48 md:h-64 w-auto max-w-full object-contain"
          style={{ display: 'block' }}
          onError={(e) => {
            // Essayer d'autres chemins possibles
            const target = e.currentTarget;
            if (target.src.includes('/logo.png')) {
              target.src = './logo.png';
            } else if (target.src.includes('./logo.png')) {
              target.src = '/public/logo.png';
            } else {
              // Masquer si aucun chemin ne fonctionne
              target.style.display = 'none';
            }
          }}
        />
      </div>
      
      {/* Bouton S'inscrire */}
      <div className="text-center mb-6">
        <Link 
          to="/inscription"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          ✨ {t('home.register')}
        </Link>
      </div>

      {/* Connexion */}
      <div className="text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          🔐 {t('home.login')}
        </Link>
      </div>
    </div>
  )
}
