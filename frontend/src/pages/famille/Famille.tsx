import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isAdmin } from '../../utils/auth'

const API_BASE = import.meta.env.VITE_API_URL || ''

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  role?: string
  isAdmin?: boolean
}

export default function Famille() {
  const [user, setUser] = useState<UserData | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
    const u = sessionData.userData || sessionData
    if (u?.numeroH) setUser(u)
  }, [])

  // Redirection : parent → Mes Enfants, enfant → Mes Parents (page unique liée par le numéro)
  useEffect(() => {
    if (location.pathname !== '/famille' || !user?.numeroH) return
    const token = localStorage.getItem('token')
    if (!token) return
    let cancelled = false
    const run = async () => {
      try {
        const [resChildren, resParents] = await Promise.all([
          fetch(`${API_BASE}/api/parent-child/my-children`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/api/parent-child/my-parents`, { headers: { Authorization: `Bearer ${token}` } })
        ])
        if (cancelled) return
        const dataChildren = resChildren.ok ? await resChildren.json() : { children: [] }
        const dataParents = resParents.ok ? await resParents.json() : { parents: [] }
        const children = dataChildren.children || []
        const parents = dataParents.parents || []
        if (children.length > 0) {
          navigate('/famille/enfants', { replace: true })
          return
        }
        if (parents.length > 0) {
          navigate('/famille/parents', { replace: true })
        }
      } catch {
        // pas de redirection en cas d'erreur
      }
    }
    run()
    return () => { cancelled = true }
  }, [location.pathname, user?.numeroH, navigate])

  const effectiveUser: UserData = user || {
    numeroH: '',
    prenom: 'Invité',
    nomFamille: '',
    genre: 'HOMME'
  }

  // Vérifier si l'utilisateur est admin (aucune condition, tout voir)
  const userIsAdmin = isAdmin(effectiveUser)

  // Si on est sur une sous-page, afficher l'Outlet
  const isOnSubPage = location.pathname !== '/famille'

  if (isOnSubPage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/famille"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 shadow-sm border border-gray-200 dark:border-gray-600"
          >
            <span aria-hidden>←</span>
            Retour à Famille
          </Link>
        </div>
        <Outlet />
      </div>
    )
  }

  // Page d'accueil Famille avec liste des sections
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Bouton Retour */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => navigate('/compte')}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium text-sm shadow-sm border border-gray-200 dark:border-gray-600"
        >
          <span aria-hidden>←</span>
          Retour
        </button>
      </div>

      {/* En-tête */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow p-4 sm:p-5 mb-4 text-white">
        <h1 className="text-xl sm:text-2xl font-bold">👨‍👩‍👧‍👦 Ma Famille</h1>
      </div>

      {/* Badge Admin + lien Vue Admin */}
      {userIsAdmin && (
        <div className="mb-4 space-y-2">
          <div className="px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg">
            <p className="text-amber-900 text-sm font-semibold flex items-center gap-2">
              <span className="text-lg">👑</span>
              Mode Administrateur
            </p>
          </div>
          <Link
            to="/famille/admin"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow transition-colors"
          >
            <span>👑</span>
            Vue Admin – Toutes les liaisons
          </Link>
        </div>
      )}

      {/* Liste des sections */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
        <Link to="parents" className="group bg-white rounded-md shadow-sm hover:shadow border border-gray-200 hover:border-emerald-500 py-2 px-2 transition-all duration-200 hover:-translate-y-0.5">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-0.5">👨‍👩‍👦</div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-emerald-600 leading-tight">Mes Parents</h3>
          </div>
        </Link>

        <Link to="mari" className="group bg-white rounded-md shadow-sm hover:shadow border border-gray-200 hover:border-blue-500 py-2 px-2 transition-all duration-200 hover:-translate-y-0.5">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-0.5">🤵</div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-blue-600 leading-tight">Mon Homme</h3>
          </div>
        </Link>

        <Link to="femmes" className="group bg-white rounded-md shadow-sm hover:shadow border border-gray-200 hover:border-pink-500 py-2 px-2 transition-all duration-200 hover:-translate-y-0.5">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-0.5">👰</div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-pink-600 leading-tight">Ma Femme</h3>
          </div>
        </Link>

        <Link to="enfants" className="group bg-white rounded-md shadow-sm hover:shadow border border-gray-200 hover:border-purple-500 py-2 px-2 transition-all duration-200 hover:-translate-y-0.5">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-0.5">👶</div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-purple-600 leading-tight">Mes Enfants</h3>
          </div>
        </Link>

        <Link to="moi" className="group bg-white rounded-md shadow-sm hover:shadow border border-gray-200 hover:border-green-500 py-2 px-2 transition-all duration-200 hover:-translate-y-0.5">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-0.5">🌟</div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-green-600 leading-tight">Moi</h3>
          </div>
        </Link>

        <Link to="mes-amours" className="group bg-white rounded-md shadow-sm hover:shadow border border-gray-200 hover:border-pink-500 py-2 px-2 transition-all duration-200 hover:-translate-y-0.5">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-0.5">💕</div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-pink-600 leading-tight">Mes Amours</h3>
          </div>
        </Link>
      </div>
    </div>
  )
}
