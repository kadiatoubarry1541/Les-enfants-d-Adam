import { useEffect, useState } from 'react'
import { MonPartenaire } from '../../components/MonPartenaire'
import { MesParents } from '../../components/MesParents'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  prenomPere?: string
  numeroHPere?: string
  prenomMere?: string
  numeroHMere?: string
}

export default function Partenaire() {
  const [user, setUser] = useState<UserData | null>(null)

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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Si c'est une femme, afficher Mon Homme */}
      {effectiveUser.genre === 'FEMME' ? (
        <MesParents userData={effectiveUser as any} />
      ) : (
        /* Si c'est un homme, afficher Ma femme */
        <MonPartenaire userData={effectiveUser as any} />
      )}
    </div>
  )
}
