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
      {/* Bouton flottant */}
      <button
        aria-label="Ouvrir la messagerie"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg hover:shadow-xl w-14 h-14 flex items-center justify-center text-2xl"
      >
        💬
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[min(96vw,900px)] max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Messagerie</h3>
              <button className="px-2 py-1 rounded-md hover:bg-gray-100" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 56px)' }}>
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
