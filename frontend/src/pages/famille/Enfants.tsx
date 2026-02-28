import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MediaUploader } from '../../components/MediaUploader'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002'

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
  status?: string
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
  const [noteAnnee, setNoteAnnee] = useState(() => new Date().getFullYear())
  const [noteRating, setNoteRating] = useState(0)
  const [activeSession, setActiveSession] = useState('avant')
  const [showMediaUploader, setShowMediaUploader] = useState(false)
  const [mediaItems, setMediaItems] = useState<Array<{ id: string; type: 'photo' | 'video' | 'audio'; url: string; caption?: string; date: string }>>([])
  const [childRatings, setChildRatings] = useState<Array<{ id: string; annee: number; note: number }>>([])
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

  const loadRatingsForChild = async (link: ChildLink) => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(
        `${API_BASE}/api/parent-child/ratings?parentNumeroH=${encodeURIComponent(link.parentNumeroH)}&childNumeroH=${encodeURIComponent(link.childNumeroH)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) {
        const data = await res.json()
        setChildRatings((data.ratings || []).map((r: { id: string; annee: number; note: number }) => ({ id: r.id, annee: r.annee, note: r.note })))
      }
    } catch (e) {
      console.error('Erreur chargement notes:', e)
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
      loadRatingsForChild(selectedChild)
    } else {
      setActivities([])
      setChildRatings([])
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

  const handleAddMedia = (mediaData: { type: 'photo' | 'video' | 'audio'; url: string; caption?: string }) => {
    setMediaItems((prev) => [...prev, { id: Date.now().toString(), ...mediaData, date: new Date().toISOString() }])
    setShowMediaUploader(false)
  }

  const handleAddNote = async () => {
    if (!selectedChild || !user) return
    if (noteRating < 1 || noteRating > 5) {
      alert('Veuillez choisir une note entre 1 et 5 étoiles.')
      return
    }
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/parent-child/ratings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childNumeroH: selectedChild.childNumeroH,
          annee: noteAnnee,
          note: noteRating
        })
      })
      const data = await res.json()
      if (data.success) {
        setNoteRating(0)
        loadRatingsForChild(selectedChild)
      } else {
        const msg = res.status === 404 && data.message === 'Route non trouvée'
          ? 'Service des notes indisponible. Redémarrez le serveur backend (npm run dev dans le dossier backend) puis réessayez.'
          : (data.message || 'Erreur')
        alert(msg)
      }
    } catch (e) {
      alert('Erreur réseau. Vérifiez que le backend tourne sur le port configuré (ex. 5002).')
    } finally {
      setSubmitting(false)
    }
  }

  const parseNoteContent = (content: string | undefined): { annee: number; note: number } | null => {
    if (!content) return null
    try {
      const o = JSON.parse(content)
      if (typeof o.annee === 'number' && typeof o.note === 'number') return { annee: o.annee, note: o.note }
    } catch {}
    return null
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
        state={{ returnToHub: true }}
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
        <p className="mt-3 text-slate-600 text-sm">
          Partagez vos moments et recevez les notes de vos enfants.
        </p>
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
          <h3 className="text-lg font-bold text-amber-800 mb-4">📤 Demandes envoyées</h3>
          <p className="text-slate-600 mb-4">L&apos;enfant peut accepter ou refuser. S&apos;il refuse, vous verrez « Refusé - Désolé ».</p>
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
                    <p className="text-sm mt-1">
                      {inv.status === 'rejected' ? (
                        <span className="text-red-600 font-medium">❌ Refusé - Désolé</span>
                      ) : (
                        <span className="text-amber-600">⏳ En attente</span>
                      )}
                    </p>
                  </div>
                </div>
                {inv.status !== 'rejected' && (
                  <button
                    onClick={() => handleLeaveLink(inv.id)}
                    disabled={submitting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm"
                  >
                    Annuler la demande
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {children.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-slate-600 text-sm">
          <span className="font-medium">{children.length} enfant{children.length > 1 ? 's' : ''} lié{children.length > 1 ? 's' : ''}</span>
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
              <>
              <div className="space-y-6">
                {(() => {
                  const childName = selectedChild.child ? `${selectedChild.child.prenom} ${selectedChild.child.nomFamille}` : selectedChild.childNumeroH
                  return (
                    <>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="text-2xl font-semibold mb-2">❤️ Nos souvenirs d&apos;ensemble</h3>
                        <p className="text-green-100">Moments précieux partagés avec {childName}</p>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex gap-3 mb-6 overflow-x-auto">
                          {[
                            { id: 'avant', title: 'Ma vie avant toi', icon: '👤' },
                            { id: 'paradis', title: 'Mon paradis dans tes mains', icon: '💕' },
                            { id: 'objectif', title: 'Notre objectif pour demain', icon: '🎯' }
                          ].map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              className={`flex-1 min-w-[180px] px-4 py-3 rounded-lg border-2 transition-all ${
                                activeSession === s.id ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                              }`}
                              onClick={() => setActiveSession(s.id)}
                            >
                              <span className="text-2xl block mb-1">{s.icon}</span>
                              <span className="font-semibold text-sm block">{s.title}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-slate-800">
                            {activeSession === 'avant' ? 'Ma vie avant toi' : activeSession === 'paradis' ? 'Mon paradis dans tes mains' : 'Notre objectif pour demain'}
                          </h4>
                          <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm" onClick={() => setShowMediaUploader(true)}>📷 Ajouter média</button>
                        </div>
                        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                          {mediaItems.length === 0 ? (
                            <>
                              <p className="text-slate-600 mb-4">Aucun média partagé dans cette session</p>
                              <button type="button" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg" onClick={() => setShowMediaUploader(true)}>🚀 Commencer à partager</button>
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

                    </>
                  )
                })()}

                {!showActivityMessage ? (
                  <button
                    type="button"
                    onClick={() => setShowActivityMessage(true)}
                    className="w-full mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left transition-all flex items-center gap-4 hover:border-green-300 hover:bg-green-50/30"
                  >
                    <span className="text-4xl">💬</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">Message</h3>
                      <p className="text-slate-600 text-sm">Ce que vous faites pour votre enfant et ce qu&apos;il/elle fait pour vous — Activités avec {selectedChild.child ? `${selectedChild.child.prenom} ${selectedChild.child.nomFamille}` : selectedChild.childNumeroH}</p>
                    </div>
                    <span className="ml-auto text-2xl text-slate-400">→</span>
                  </button>
                ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Activités avec {selectedChild.child ? `${selectedChild.child.prenom} ${selectedChild.child.nomFamille}` : selectedChild.childNumeroH}
                    </h3>
                    <p className="text-slate-600 mt-1 text-sm">
                      Ce que vous faites pour votre enfant et ce qu&apos;il/elle fait pour vous.
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
                  {activities.filter(a => a.type !== 'note').length === 0 ? (
                    <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-4xl mb-3">💬</div>
                      <p className="text-slate-600 font-medium mb-1">Aucune activité pour le moment</p>
                      <p className="text-slate-500 text-sm mb-4">Envoyez un message ou une activité à votre enfant avec le champ ci-dessus pour commencer l’échange.</p>
                      <p className="text-slate-400 text-xs">Les messages que vous envoyez et ceux de votre enfant apparaîtront ici.</p>
                    </div>
                  ) : (
                    activities.filter(a => a.type !== 'note').map((act) => (
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
                )}

                {/* Notes : Année + Note (étoiles) + tableau + note moyenne */}
                <div className="mt-8 pt-6 border-t border-slate-200" id="section-notes">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-slate-500" aria-hidden>☆</span>
                    Notes
                  </h4>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-100 text-slate-600">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Année</th>
                          <th className="px-4 py-3 text-left font-semibold">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={noteAnnee}
                              onChange={(e) => setNoteAnnee(parseInt(e.target.value, 10) || new Date().getFullYear())}
                              min={2000}
                              max={2030}
                              className="min-w-[160px] w-40 px-3 py-2.5 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-green-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-0.5 items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className={`text-2xl transition-colors ${noteRating >= star ? 'text-amber-400' : 'text-slate-300 hover:text-slate-400'}`}
                                  onClick={() => setNoteRating(star)}
                                  aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50">
                      <button
                        onClick={handleAddNote}
                        disabled={submitting || noteRating < 1}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm"
                      >
                        {submitting ? 'Envoi…' : '✓ Ajouter la note'}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white shadow-sm">
                    <table id="tableau-notes" className="min-w-full text-sm" aria-label="Notes">
                      <thead className="bg-slate-200 text-slate-800 border-b-2 border-slate-300">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left font-semibold">Année</th>
                          <th scope="col" className="px-4 py-3 text-left font-semibold">Note</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {childRatings.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="px-4 py-8 text-center text-slate-500 bg-slate-50">
                              Aucune note. Renseignez une année et une note ci-dessus puis cliquez sur « Ajouter la note ».
                            </td>
                          </tr>
                        ) : (
                          childRatings.map((r) => (
                            <tr key={r.id} className="bg-white hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-slate-700 border-b border-slate-200">{r.annee}</td>
                              <td className="px-4 py-3 border-b border-slate-200">
                                <span className="flex items-center gap-0.5" title={`${r.note}/5`}>
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <span key={s} className={r.note >= s ? 'text-amber-400' : 'text-slate-300'}>★</span>
                                  ))}
                                  <span className="ml-1 text-slate-600 text-xs">{r.note}/5</span>
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-xs font-medium text-slate-600 rounded-b-xl flex flex-wrap items-center justify-between gap-2">
                      <span>Tableau <strong>Notes</strong> — {childRatings.length} note{childRatings.length !== 1 ? 's' : ''}</span>
                      {childRatings.length > 0 && (
                        <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-lg font-semibold">Note moyenne : {(childRatings.reduce((s, r) => s + r.note, 0) / childRatings.length).toFixed(1)}/5 ★</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

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
              </>
            ) : (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center">
                <div className="text-5xl mb-4">👶</div>
                <p className="text-slate-700 font-medium mb-2">Sélectionnez un enfant</p>
                <p className="text-slate-500 text-sm">Cliquez sur un enfant dans la liste à gauche pour afficher et gérer les activités partagées avec lui ou elle.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
