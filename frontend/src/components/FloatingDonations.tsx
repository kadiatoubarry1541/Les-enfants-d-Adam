import { useLocation, useNavigate } from 'react-router-dom'

export function FloatingDonations() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // N'afficher que sur la page "Moi" et masquer ailleurs (y compris / et /solidarite)
  if (!pathname.startsWith('/moi') || pathname.startsWith('/solidarite')) return null

  return (
    <button
      aria-label="Aller à la page Solidarité"
      onClick={() => navigate('/solidarite')}
      className="fixed bottom-24 right-6 z-50 rounded-full shadow-lg hover:shadow-xl w-14 h-14 flex items-center justify-center text-xl text-white bg-gradient-to-r from-amber-500 to-orange-500"
      title="Solidarité"
    >
      <span role="img" aria-hidden>
        ❤️
      </span>
    </button>
  )
}
