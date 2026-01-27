import { useState, useEffect } from 'react'
import { CommunicationHub } from './CommunicationHub'

export function FloatingMessenger() {
  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Charger les données utilisateur depuis localStorage
    const session = localStorage.getItem("session_user")
    if (session) {
      try {
        const parsed = JSON.parse(session)
        setUserData(parsed.userData || parsed)
      } catch (e) {
        console.error('Erreur parsing session:', e)
      }
    }
  }, [])

  return (
    <>
      {/* Bouton flottant - position safe-area pour mobiles */}
      <button
        aria-label="Ouvrir la messagerie"
        onClick={() => setOpen(true)}
        className="fixed z-50 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg hover:shadow-xl active:scale-95 transition-transform min-w-[56px] min-h-[56px] w-14 h-14 flex items-center justify-center text-2xl"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom, 0px))", right: "max(1rem, env(safe-area-inset-right, 0px))" }}
      >
        💬
      </button>

      {/* Modal responsive - plein écran sur très petit */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <div className="relative bg-white dark:bg-gray-800 rounded-none sm:rounded-xl shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[min(96vw,900px)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
              <h3 className="text-base sm:text-lg font-semibold">Messagerie</h3>
              <button className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setOpen(false)} aria-label="Fermer">✕</button>
            </div>
            <div className="p-4 overflow-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 56px)' }}>
              {userData ? (
                <CommunicationHub userData={userData} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Veuillez vous connecter pour accéder à la messagerie</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
