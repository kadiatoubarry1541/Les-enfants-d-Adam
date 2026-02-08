import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || ''

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
}

interface ParentLink {
  id: string
  parentNumeroH: string
  childNumeroH: string
  codeLiaison: string
  numeroMaternite?: string
  parentType: 'pere' | 'mere'
  parent?: {
    numeroH: string
    prenom: string
    nomFamille: string
    photo?: string
    genre?: string
  }
  activitiesCount?: number
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

interface PendingInvitation {
  id: string
  parentNumeroH: string
  childNumeroH: string
  parentType: string
  codeLiaison?: string
  parent?: { numeroH: string; prenom: string; nomFamille: string }
}

export default function Parents() {
  const [user, setUser] = useState<UserData | null>(null)
  const [parents, setParents] = useState<ParentLink[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedParent, setSelectedParent] = useState<ParentLink | null>(null)
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

  const loadMyParents = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/parent-child/my-parents`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setParents(data.parents || [])
      }
    } catch (e) {
      console.error('Erreur chargement mes parents:', e)
    }
  }

  const loadPendingInvitations = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/parent-child/pending-invitations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPendingInvitations(data.invitations || [])
      }
    } catch (e) {
      console.error('Erreur invitations:', e)
    }
  }

  const handleConfirmLink = async (linkId: string) => {
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/parent-child/confirm/${linkId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        loadPendingInvitations()
        loadMyParents()
      } else alert(data.message || 'Erreur')
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLeaveLink = async (linkId: string) => {
    if (!confirm('Quitter cette liaison ? Vous pourrez vous relier plus tard.')) return
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/parent-child/link/${linkId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setSelectedParent(null)
        loadMyParents()
      } else alert(data.message || 'Erreur')
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  const loadActivitiesForParent = async (link: ParentLink) => {
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
      loadMyParents()
      loadPendingInvitations()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedParent) {
      loadActivitiesForParent(selectedParent)
    } else {
      setActivities([])
    }
  }, [selectedParent?.id])

  const handleAddActivity = async () => {
    if (!selectedParent || !newActivityContent.trim() || !user) return
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
          parentNumeroH: selectedParent.parentNumeroH,
          childNumeroH: selectedParent.childNumeroH,
          toNumeroH: selectedParent.parentNumeroH,
          type: 'message',
          content: newActivityContent.trim()
        })
      })
      const data = await res.json()
      if (data.success) {
        setNewActivityContent('')
        loadActivitiesForParent(selectedParent)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">👨‍👩‍👦 Mes Parents</h2>
          <Link to="/famille/inspir" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm font-medium rounded-lg transition-colors border border-yellow-300">
            🤝 Inspir
          </Link>
        </div>
      </div>

      {pendingInvitations.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-amber-800 mb-4">📩 Invitations reçues (à confirmer)</h3>
          <p className="text-slate-600 mb-4">Un parent souhaite vous lier. Confirmez pour accepter ou supprimez pour refuser.</p>
          <div className="space-y-3">
            {pendingInvitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{inv.parentType === 'mere' ? '👩' : '👨'}</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {inv.parent ? `${inv.parent.prenom} ${inv.parent.nomFamille}` : inv.parentNumeroH}
                    </p>
                    <p className="text-sm text-slate-500">{inv.parentNumeroH}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirmLink(inv.id)}
                    disabled={submitting}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg"
                  >
                    ✓ Confirmer
                  </button>
                  <button
                    onClick={() => handleLeaveLink(inv.id)}
                    disabled={submitting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {parents.length === 0 && pendingInvitations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">
            Aucun parent lié pour le moment. Vos parents doivent vous ajouter depuis leur page « Mes Enfants » avec leur code de liaison, votre NumeroH et votre numéro maternité.
          </p>
          <Link
            to="/famille"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Retour à Famille
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {parents.map((link) => (
              <div
                key={link.id}
                className={`rounded-xl border-2 p-4 transition-all ${
                  selectedParent?.id === link.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <button
                  onClick={() => setSelectedParent(link)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-2xl">
                      {link.parentType === 'mere' ? '👩' : '👨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800">
                        {link.parent ? `${link.parent.prenom} ${link.parent.nomFamille}` : link.parentNumeroH}
                      </p>
                      <p className="text-sm text-slate-500">
                        {link.parentType === 'mere' ? 'Maman' : 'Papa'}
                      </p>
                      <p className="text-xs text-slate-400">{link.parentNumeroH}</p>
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
            {selectedParent ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Activités avec {selectedParent.parent ? `${selectedParent.parent.prenom} ${selectedParent.parent.nomFamille}` : selectedParent.parentNumeroH}
                </h3>
                <p className="text-slate-600 mb-4">
                  Ce que vous faites pour votre parent et ce qu'il/elle fait pour vous.
                </p>

                <div className="mb-6 flex gap-2">
                  <textarea
                    value={newActivityContent}
                    onChange={(e) => setNewActivityContent(e.target.value)}
                    placeholder="Ajouter un message ou une activité pour votre parent..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <button
                    onClick={handleAddActivity}
                    disabled={submitting || !newActivityContent.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg self-end"
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
                            ? 'bg-blue-50 border-blue-200 ml-4'
                            : 'bg-amber-50 border-amber-200 mr-4'
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
                <p className="text-slate-500">Sélectionnez un parent pour voir les activités partagées.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
