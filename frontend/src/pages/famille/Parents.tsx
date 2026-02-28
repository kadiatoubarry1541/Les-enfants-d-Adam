import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MediaUploader } from '../../components/MediaUploader'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002'

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
  const [activeSession, setActiveSession] = useState('enfance')
  const [showMediaUploader, setShowMediaUploader] = useState(false)
  const [mediaItems, setMediaItems] = useState<Array<{ id: string; type: 'photo' | 'video' | 'audio'; url: string; caption?: string; date: string }>>([])
  const [notesFromParents, setNotesFromParents] = useState<Array<{ id: string; annee: number; note: number; parentName?: string }>>([])
  const [formAnnee, setFormAnnee] = useState(() => new Date().getFullYear())
  const [formNote, setFormNote] = useState(0)
  const [parentRatings, setParentRatings] = useState<Array<{ id: string; annee: number; note: number }>>([])
  const [notesOpen, setNotesOpen] = useState(false)
  const [showActivityMessage, setShowActivityMessage] = useState(false)

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

  const handleRejectLink = async (linkId: string) => {
    if (!confirm('Refuser cette demande ? Le parent sera notifié (Désolé).')) return
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/parent-child/reject/${linkId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Désolé, je ne souhaite pas créer ce lien.' })
      })
      const data = await res.json()
      if (data.success) {
        loadPendingInvitations()
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

  const loadNotesFromParents = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/parent-child/ratings/for-child`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setNotesFromParents((data.ratings || []).map((r: { id: string; annee: number; note: number; parentName?: string }) => ({
          id: r.id,
          annee: r.annee,
          note: r.note,
          parentName: r.parentName
        })))
      }
    } catch (e) {
      console.error('Erreur chargement notes des parents:', e)
    }
  }

  useEffect(() => {
    const u = loadUser()
    if (u?.numeroH) {
      setLoading(false)
      loadMyParents()
      loadPendingInvitations()
      loadNotesFromParents()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!selectedParent && parents.length > 0) {
      setSelectedParent(parents[0])
    }
  }, [parents, selectedParent])

  useEffect(() => {
    if (selectedParent) {
      loadActivitiesForParent(selectedParent)
    } else {
      setActivities([])
    }
  }, [selectedParent?.id])

  const handleAddMedia = (mediaData: { type: 'photo' | 'video' | 'audio'; url: string; caption?: string }) => {
    setMediaItems((prev) => [...prev, { id: Date.now().toString(), ...mediaData, date: new Date().toISOString() }])
    setShowMediaUploader(false)
  }

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
        state={{ returnToHub: true }}
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
        <p className="mt-3 text-slate-600 text-sm">Partagez vos souvenirs et recevez les notes de vos parents.</p>
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
                    onClick={() => handleRejectLink(inv.id)}
                    disabled={submitting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg"
                  >
                    Refuser
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
            state={{ returnToHub: true }}
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
              <div className="space-y-6">
                {/* Bannière */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-2xl font-semibold mb-2">❤️ Nos souvenirs d&apos;ensemble</h3>
                  <p className="text-purple-100">Moments précieux partagés avec mes parents</p>
                </div>

                {/* 3 cartes + Note et Message (même style) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex gap-3 mb-3 overflow-x-auto">
                    {[
                      { id: 'enfance', title: 'Mon enfance dans vos mains', icon: '👶' },
                      { id: 'paradis', title: 'Mon paradis dans vos mains', icon: '🌟' },
                      { id: 'objectif', title: 'Notre objectif pour demain', icon: '🎯' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`flex-1 min-w-[180px] px-4 py-3 rounded-lg border-2 transition-all ${
                          activeSession === s.id ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                        }`}
                        onClick={() => setActiveSession(s.id)}
                      >
                        <span className="text-2xl block mb-1">{s.icon}</span>
                        <span className="font-semibold text-sm block">{s.title}</span>
                      </button>
                    ))}
                  </div>
                  {/* Note et Message — même style, après Nos objectifs pour demain */}
                  <div className="flex gap-3 mb-6 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => { setNotesOpen((o) => !o); setShowActivityMessage(false); }}
                      className={`flex-1 min-w-[180px] px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        notesOpen ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                      }`}
                      aria-expanded={notesOpen}
                    >
                      <span className="text-slate-500 text-2xl" aria-hidden>☆</span>
                      <span className="font-semibold text-sm">Note</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowActivityMessage(true); setNotesOpen(false); }}
                      className={`flex-1 min-w-[180px] px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        showActivityMessage ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">💬</span>
                      <span className="font-semibold text-sm">Message</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-slate-800">
                      {activeSession === 'enfance' ? 'Mon enfance dans vos mains' : activeSession === 'paradis' ? 'Mon paradis dans vos mains' : 'Notre objectif pour demain'}
                    </h4>
                    <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm" onClick={() => setShowMediaUploader(true)}>📷 Ajouter média</button>
                  </div>
                  <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    {mediaItems.length === 0 ? (
                      <>
                        <p className="text-slate-600 mb-4">Aucun média partagé dans cette session</p>
                        <button type="button" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg" onClick={() => setShowMediaUploader(true)}>🚀 Commencer à partager</button>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mediaItems.map((m) => (
                          <div key={m.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            {m.type === 'photo' && <img src={m.url} alt="" className="w-full h-40 object-cover" />}
                            {m.type === 'video' && <video src={m.url} controls className="w-full h-40 bg-black" />}
                            {m.type === 'audio' && <div className="w-full h-24 bg-slate-200 flex items-center justify-center"><span className="text-3xl">🎵</span></div>}
                            {m.caption && <p className="p-2 text-sm text-slate-600">{m.caption}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenu Note — affiché quand on clique sur le bouton Note (ligne au-dessus) */}
                {notesOpen && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="text-slate-500" aria-hidden>☆</span>
                      Notes que mes parents m&apos;ont données
                    </h3>
                    <div className="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white shadow-sm">
                        <table className="min-w-full text-sm" aria-label="Notes">
                          <thead className="bg-slate-200 text-slate-800 border-b-2 border-slate-300">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left font-semibold">Année</th>
                              <th scope="col" className="px-4 py-3 text-left font-semibold">Note</th>
                              <th scope="col" className="px-4 py-3 text-left font-semibold">Donné par</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {notesFromParents.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-slate-500 bg-slate-50">
                                  Aucune note pour l&apos;instant. Vos parents peuvent vous noter depuis leur espace « Mes Enfants ».
                                </td>
                              </tr>
                            ) : (
                              notesFromParents.map((r) => (
                                <tr key={r.id} className="bg-white hover:bg-slate-50">
                                  <td className="px-4 py-3 text-slate-700">{r.annee}</td>
                                  <td className="px-4 py-3">
                                    <span className="flex items-center gap-0.5" title={`${r.note}/5`}>
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className={r.note >= s ? 'text-amber-400' : 'text-slate-300'}>★</span>
                                      ))}
                                      <span className="ml-1 text-slate-600 text-xs">{r.note}/5</span>
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">{r.parentName ?? '—'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-xs font-medium text-slate-600 rounded-b-xl flex flex-wrap items-center justify-between gap-2">
                          <span>Tableau Notes — {notesFromParents.length} note{notesFromParents.length !== 1 ? 's' : ''}</span>
                          {notesFromParents.length > 0 && (
                            <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-lg font-semibold">
                              Note moyenne : {(notesFromParents.reduce((s, r) => s + r.note, 0) / notesFromParents.length).toFixed(1)}/5 ★
                            </span>
                          )}
                        </div>
                    </div>
                  </div>
                )}

                {/* Activités : zone Message ouverte au clic sur le bouton Message */}
                {showActivityMessage && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Activités avec {selectedParent.parent ? `${selectedParent.parent.prenom} ${selectedParent.parent.nomFamille}` : selectedParent.parentNumeroH}
                    </h3>
                    <p className="text-slate-600 mt-1 text-sm">
                      Ce que vous faites pour votre parent et ce qu&apos;il/elle fait pour vous.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowActivityMessage(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm"
                  >
                    ← Retour
                  </button>
                </div>

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
                )}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">Sélectionnez un parent pour voir les activités partagées.</p>
              </div>
            )}

            {showMediaUploader && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowMediaUploader(false)}>
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-slate-800">📷 Ajouter un média</h3>
                    <button type="button" className="text-slate-500 hover:text-slate-700 text-2xl" onClick={() => setShowMediaUploader(false)}>✕</button>
                  </div>
                  <div className="p-4"><MediaUploader onClose={() => setShowMediaUploader(false)} onUpload={handleAddMedia} /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
