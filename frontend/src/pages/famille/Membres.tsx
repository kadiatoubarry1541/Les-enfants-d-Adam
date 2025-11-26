import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
}

interface FamilyMember {
  numeroH: string
  nomComplet: string
  type: 'parent' | 'femme' | 'mari' | 'enfant' | 'invite'
}

function getTypeLabel(type: FamilyMember['type']) {
  switch (type) {
    case 'parent': return 'Parent'
    case 'femme': return 'Femme'
    case 'mari': return 'Mari'
    case 'enfant': return 'Enfant'
    default: return 'Invité'
  }
}

export default function Membres() {
  const [user, setUser] = useState<UserData | null>(null)
  const [membres, setMembres] = useState<FamilyMember[]>([])

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
    const u = sessionData.userData || sessionData
    if (!u?.numeroH) return
    setUser(u)

    const membresStockes = localStorage.getItem(`membres_${u.numeroH}`)
    if (membresStockes) setMembres(JSON.parse(membresStockes))
  }, [])

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="max-w-5xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">📋 Membres invités ({membres.length})</h2>
        {membres.length === 0 ? (
          <div className="text-gray-500">Aucun membre ajouté pour le moment.</div>
        ) : (
          <div className="stack">
            {membres.map((m, i) => (
              <div key={i} className="p-3 bg-white rounded-xl ring-1 ring-gray-200">
                <div className="row">
                  <div className="col-6 font-medium">{m.nomComplet}</div>
                  <div className="col-3 text-blue-700 font-semibold">{m.numeroH}</div>
                  <div className="col-3">{getTypeLabel(m.type)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
