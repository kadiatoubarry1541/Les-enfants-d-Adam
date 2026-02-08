import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || ''

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
}

interface ChildLink {
  id: string
  parentNumeroH: string
  childNumeroH: string
  codeLiaison: string
  numeroMaternite?: string
  parentType: 'pere' | 'mere'
  child?: {
    numeroH: string
    prenom: string
    nomFamille: string
    dateNaissance?: string
    photo?: string
    genre?: string
  }
  activitiesCount?: number
}

interface PendingSent {
  id: string
  childNumeroH: string
  parentType: string
  child?: { numeroH: string; prenom: string; nomFamille: string }
}

interface Activity {
  id: string
  parentNumeroH: string
  childNumeroH: string
  fromNumeroH: string
  toNumeroH: string
  type: string
  content?: string
  mediaUrl?: string
  fromName?: string
  created_at: string
}

function getToken() {
  return localStorage.getItem('token')
}

export default function Enfants() {
  const [user, setUser] = useState<UserData | null>(null)
  const [children, setChildren] = useState<ChildLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLink, setNewLink] = useState({
    codeLiaison: '',
    childNumeroH: '',
    numeroMaternite: '',
    parentType: 'pere' as 'pere' | 'mere'
  })
  const [pendingSent, setPendingSent] = useState<PendingSent[]>([])
  const [selectedChild, setSelectedChild] = useState<ChildLink | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [newActivityContent, setNewActivityContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadUser = () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
      const u = sessionData.userData || sessionData
      if (u?.numeroH) setUser(u)
      return u
    } catch {
      return null
    }
  }

  const loadMyChildren = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/parent-child/my-children`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setChildren(data.children || [])
      }
    } catch (e) {
      console.error('Erreur chargement mes enfants:', e)
    }
  }

  const loadPendingSent = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/parent-child/pending-sent`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPendingSent(data.invitations || [])
      }
    } catch (e) {
      console.error('Erreur demandes envoyées:', e)
    }
  }

  const handleLeaveLink = async (linkId: string) => {
    if (!confirm('Quitter cette liaison avec cet enfant ? Vous pourrez relier plus tard.')) return
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/parent-child/link/${linkId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setSelectedChild(null)
        loadMyChildren()
        loadPendingSent()
      } else alert(data.message || 'Erreur')
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  const loadActivitiesForChild = async (link: ChildLink) => {
    const token = getToken()
    if (!token || !user) return
    try {
      const res = await fetch(
        `${API_BASE}/api/parent-child/activities?parentNumeroH=${encodeURIComponent(link.parentNumeroH)}&childNumeroH=${encodeURIComponent(link.childNumeroH)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) {
        const data = await res.json()
        setActivities(data.activities || [])
      }
    } catch (e) {
      console.error('Erreur chargement activités:', e)
    }
  }

  useEffect(() => {
    const u = loadUser()
    if (u?.numeroH) {
      setLoading(false)
      loadMyChildren()
      loadPendingSent()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedChild) {
      loadActivitiesForChild(selectedChild)
    } else {
      setActivities([])
    }
  }, [selectedChild?.id])

  const handleAddLink = async () => {
    if (!newLink.childNumeroH.trim()) {
      alert('Le NumeroH de l\'enfant est obligatoire.')
      return
    }
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/parent-child/link`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codeLiaison: newLink.codeLiaison.trim() || undefined,
          childNumeroH: newLink.childNumeroH.trim(),
          numeroMaternite: newLink.numeroMaternite.trim() || undefined,
          parentType: newLink.parentType
        })
      })
      const data = await res.json()
      if (data.success) {
        setNewLink({ codeLiaison: '', childNumeroH: '', numeroMaternite: '', parentType: 'pere' })
        setShowAddForm(false)
        loadMyChildren()
        loadPendingSent()
      } else {
        alert(data.message || 'Erreur lors de l\'ajout du lien')
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddActivity = async () => {
    if (!selectedChild || !newActivityContent.trim() || !user) return
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/parent-child/activity`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentNumeroH: selectedChild.parentNumeroH,
          childNumeroH: selectedChild.childNumeroH,
          toNumeroH: selectedChild.childNumeroH,
          type: 'message',
          content: newActivityContent.trim()
        })
      })
      const data = await res.json()
      if (data.success) {
        setNewActivityContent('')
        loadActivitiesForChild(selectedChild)
      } else {
        alert(data.message || 'Erreur')
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link
        to="/famille"
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
      >
        ← Retour à Famille
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-800">👶 Mes Enfants</h2>
            <Link to="/famille/inspir" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm font-medium rounded-lg transition-colors border border-yellow-300">
              🤝 Inspir
            </Link>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            {showAddForm ? '✕ Annuler' : '+ Ajouter un enfant'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Lier un enfant (seul le NumeroH est obligatoire)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                NumeroH de l'enfant <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newLink.childNumeroH}
                onChange={(e) => setNewLink({ ...newLink, childNumeroH: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Ex: G0C0P0R0E0F0 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Votre code de liaison (optionnel)
              </label>
              <input
                type="text"
                value={newLink.codeLiaison}
                onChange={(e) => setNewLink({ ...newLink, codeLiaison: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Ex: FAMILLE2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Numéro reçu à la maternité (optionnel)
              </label>
              <input
                type="text"
                value={newLink.numeroMaternite}
                onChange={(e) => setNewLink({ ...newLink, numeroMaternite: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Numéro maternité"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vous êtes (optionnel)</label>
              <select
                value={newLink.parentType}
                onChange={(e) => setNewLink({ ...newLink, parentType: e.target.value as 'pere' | 'mere' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="pere">👨 Père</option>
                <option value="mere">👩 Mère</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAddLink}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg"
            >
              {submitting ? 'Enregistrement...' : '✓ Lier cet enfant'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {pendingSent.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-amber-800 mb-4">⏳ En attente de confirmation</h3>
          <p className="text-slate-600 mb-4">L'enfant doit confirmer le lien. Vous pouvez supprimer la demande si besoin.</p>
          <div className="space-y-3">
            {pendingSent.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👶</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {inv.child ? `${inv.child.prenom} ${inv.child.nomFamille}` : inv.childNumeroH}
                    </p>
                    <p className="text-sm text-slate-500">{inv.childNumeroH}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLeaveLink(inv.id)}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm"
                >
                  Supprimer la demande
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {children.length === 0 && !showAddForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">Aucun enfant lié. Ajoutez un enfant avec votre code de liaison, son NumeroH et son numéro maternité.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
          >
            + Ajouter votre premier enfant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {children.map((link) => (
              <div
                key={link.id}
                className={`rounded-xl border-2 p-4 transition-all ${
                  selectedChild?.id === link.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-slate-200 bg-white hover:border-green-300'
                }`}
              >
                <button
                  onClick={() => setSelectedChild(link)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-2xl">
                      {link.child?.genre === 'FEMME' ? '👧' : '👦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800">
                        {link.child ? `${link.child.prenom} ${link.child.nomFamille}` : link.childNumeroH}
                      </p>
                      <p className="text-sm text-slate-500">{link.childNumeroH}</p>
                      {link.numeroMaternite && (
                        <p className="text-xs text-slate-400">Maternité: {link.numeroMaternite}</p>
                      )}
                    </div>
                  </div>
                </button>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleLeaveLink(link.id)}
                    disabled={submitting}
                    className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    Quitter la liaison
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedChild ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Activités avec {selectedChild.child ? `${selectedChild.child.prenom} ${selectedChild.child.nomFamille}` : selectedChild.childNumeroH}
                </h3>
                <p className="text-slate-600 mb-4">
                  Ce que vous faites pour votre enfant et ce qu'il/elle fait pour vous.
                </p>

                <div className="mb-6 flex gap-2">
                  <textarea
                    value={newActivityContent}
                    onChange={(e) => setNewActivityContent(e.target.value)}
                    placeholder="Ajouter un message ou une activité pour votre enfant..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={2}
                  />
                  <button
                    onClick={handleAddActivity}
                    disabled={submitting || !newActivityContent.trim()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg self-end"
                  >
                    Envoyer
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activities.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">Aucune activité pour le moment.</p>
                  ) : (
                    activities.map((act) => (
                      <div
                        key={act.id}
                        className={`p-4 rounded-lg border ${
                          act.fromNumeroH === user?.numeroH
                            ? 'bg-green-50 border-green-200 ml-4'
                            : 'bg-blue-50 border-blue-200 mr-4'
                        }`}
                      >
                        <p className="text-sm font-medium text-slate-700">
                          {act.fromName || act.fromNumeroH}
                          {act.fromNumeroH === user?.numeroH ? ' (vous)' : ''}
                        </p>
                        {act.content && <p className="text-slate-800 mt-1">{act.content}</p>}
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(act.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">Sélectionnez un enfant pour voir les activités partagées.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
