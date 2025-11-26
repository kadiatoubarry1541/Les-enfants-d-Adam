import { useState, useEffect } from 'react'

interface FamilyMember {
  id: string
  numeroH: string
  nomComplet: string
  type: 'parent' | 'femme' | 'mari' | 'fiancé' | 'enfant' | 'invite'
  dateAjout: string
}

interface MemberInvitationProps {
  ownerNumeroH: string
}

export function MemberInvitation({ ownerNumeroH }: MemberInvitationProps) {
  const [membres, setMembres] = useState<FamilyMember[]>([])
  const [showForm, setShowForm] = useState(false)
  const [numeroH, setNumeroH] = useState('')
  const [nomComplet, setNomComplet] = useState('')
  const [memberType, setMemberType] = useState<FamilyMember['type']>('invite')

  useEffect(() => {
    // Charger les membres depuis le localStorage
    const storedMembers = localStorage.getItem(`membres_${ownerNumeroH}`)
    if (storedMembers) {
      setMembres(JSON.parse(storedMembers))
    }
  }, [ownerNumeroH])

  const handleAddMember = () => {
    if (!numeroH.trim() || !nomComplet.trim()) {
      alert('Veuillez remplir tous les champs')
      return
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      numeroH: numeroH.trim(),
      nomComplet: nomComplet.trim(),
      type: memberType,
      dateAjout: new Date().toISOString()
    }

    const updatedMembers = [...membres, newMember]
    setMembres(updatedMembers)
    localStorage.setItem(`membres_${ownerNumeroH}`, JSON.stringify(updatedMembers))

    // Réinitialiser le formulaire
    setNumeroH('')
    setNomComplet('')
    setMemberType('invite')
    setShowForm(false)
  }

  const handleRemoveMember = (id: string) => {
    const updatedMembers = membres.filter(m => m.id !== id)
    setMembres(updatedMembers)
    localStorage.setItem(`membres_${ownerNumeroH}`, JSON.stringify(updatedMembers))
  }

  const getTypeLabel = (type: FamilyMember['type']) => {
    switch (type) {
      case 'parent': return '👨‍👩‍👦 Parent'
      case 'femme': return '👰 Femme'
      case 'mari': return '🤵 Mari'
      case 'fiancé': return '💑 Fiancé(e)'
      case 'enfant': return '👶 Enfant'
      default: return '👤 Invité'
    }
  }

  const getTypeColor = (type: FamilyMember['type']) => {
    switch (type) {
      case 'parent': return 'bg-purple-100 text-purple-800'
      case 'femme': return 'bg-pink-100 text-pink-800'
      case 'mari': return 'bg-blue-100 text-blue-800'
      case 'fiancé': return 'bg-rose-100 text-rose-800'
      case 'enfant': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-slate-800">
          👥 Membres invités ({membres.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {showForm ? '✕ Annuler' : '+ Ajouter un membre'}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Ajouter un membre</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                NuméroH/HD
              </label>
              <input
                type="text"
                value={numeroH}
                onChange={(e) => setNumeroH(e.target.value)}
                placeholder="Ex: G0C0P0R0E0F0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de relation
              </label>
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value as FamilyMember['type'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="parent">👨‍👩‍👦 Parent</option>
                <option value="femme">👰 Femme</option>
                <option value="mari">🤵 Mari</option>
                <option value="fiancé">💑 Fiancé(e)</option>
                <option value="enfant">👶 Enfant</option>
                <option value="invite">👤 Invité</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              ✓ Ajouter
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des membres */}
      {membres.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="mb-3">Aucun membre invité pour le moment</p>
          <p className="text-sm">Ajoutez des membres pour leur permettre d'accéder à votre site familial</p>
        </div>
      ) : (
        <div className="space-y-3">
          {membres.map((membre) => (
            <div
              key={membre.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-800">{membre.nomComplet}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(membre.type)}`}>
                    {getTypeLabel(membre.type)}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">NuméroH:</span> {membre.numeroH}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Ajouté le {new Date(membre.dateAjout).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRemoveMember(membre.id)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                🗑️ Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-slate-800 mb-2">ℹ️ Comment ça marche ?</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Ajoutez les personnes en saisissant leur <strong>NuméroH</strong> et <strong>nom complet</strong></li>
          <li>• Ils pourront se connecter à votre site familial avec: <strong>NuméroH + Nom complet + Mot de passe</strong></li>
          <li>• Ils pourront voir vos contenus, aimer ❤️, pleurer 😢 ou laisser des commentaires 💬</li>
          <li>• Seules les personnes invitées auront accès à votre site</li>
        </ul>
      </div>
    </div>
  )
}












