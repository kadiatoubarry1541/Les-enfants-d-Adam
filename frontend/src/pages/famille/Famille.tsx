import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
    const u = sessionData.userData || sessionData
    if (u?.numeroH) setUser(u)
  }, [])

  const effectiveUser: UserData = user || {
    numeroH: '',
    prenom: 'Invité',
    nomFamille: '',
    genre: 'HOMME'
  }

  // Vérifier si l'utilisateur est admin
  const isAdmin = effectiveUser.role === 'admin' || effectiveUser.isAdmin === true

  // Si on est sur une sous-page, afficher l'Outlet
  const isOnSubPage = location.pathname !== '/famille'

  if (isOnSubPage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/famille"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            ← Retour à Famille
          </Link>
        </div>
        <Outlet />
      </div>
    )
  }

  // Page d'accueil Famille avec liste des sections
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 mb-8 text-white">
        <h1 className="text-5xl font-bold">👨‍👩‍👧‍👦 Ma Famille</h1>
      </div>

      {/* Badge Admin */}
      {isAdmin && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-lg">
          <p className="text-amber-900 font-semibold flex items-center gap-2">
            <span className="text-2xl">👑</span>
            Mode Administrateur - Vous avez accès à toutes les sections
          </p>
        </div>
      )}

      {/* Liste des sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mes Parents/DA - TOUJOURS VISIBLE */}
        <Link
          to="parents"
          className="group bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-gray-200 hover:border-emerald-500 p-8 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">👨‍👩‍👦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600">
              Mes Parents
            </h3>
            <p className="text-gray-600">
              Informations sur votre père et votre mère
            </p>
          </div>
        </Link>

        {/* Mon Homme - TOUJOURS VISIBLE */}
        <Link
          to="mari"
          className="group bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-gray-200 hover:border-blue-500 p-8 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🤵</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">
              Mon Homme
            </h3>
            <p className="text-gray-600">
              Espace dédié à votre conjoint
            </p>
          </div>
        </Link>

        {/* Ma Femme - TOUJOURS VISIBLE */}
        <Link
          to="femmes"
          className="group bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-gray-200 hover:border-pink-500 p-8 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">👰</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600">
              Ma Femme
            </h3>
            <p className="text-gray-600">
              Gérez votre épouse
            </p>
          </div>
        </Link>

        {/* Mes Enfants - TOUJOURS VISIBLE */}
        <Link
          to="enfants"
          className="group bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-gray-200 hover:border-purple-500 p-8 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600">
              Mes Enfants
            </h3>
            <p className="text-gray-600">
              Liste et informations de vos enfants
            </p>
          </div>
        </Link>

        {/* Mon Arbre - TOUJOURS VISIBLE */}
        <Link
          to="arbre"
          className="group bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-gray-200 hover:border-green-500 p-8 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🌳</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600">
              Mon Arbre
            </h3>
            <p className="text-gray-600">
              Arbre généalogique complet
            </p>
          </div>
        </Link>

        {/* Mes Amours - TOUJOURS VISIBLE */}
        <Link
          to="mes-amours"
          className="group bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-gray-200 hover:border-pink-500 p-8 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">💕</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600">
              Mes Amours
            </h3>
            <p className="text-gray-600">
              Liste d'amis et informations personnelles
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
