import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isAdmin } from '../../utils/auth'
import { MediaUploader } from '../../components/MediaUploader'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  dateNaissance?: string
  date_naissance?: string
  role?: string
  isAdmin?: boolean
}

/** Calcule l'âge exact en années */
function calcAge(dateStr?: string): number {
  if (!dateStr) return 99
  const birth = new Date(dateStr)
  if (isNaN(birth.getTime())) return 99
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

interface PartnerInfo {
  numeroH: string
  prenom: string
  nomFamille: string
  photo?: string
  genre?: string
}

interface LinkInfo {
  id: string
  numeroMariageMairie: string
}

interface PendingInvitation {
  id: string
  numeroH1: string
  numeroH2: string
  numeroMariageMairie: string
  initiatedByNumeroH?: string
  initiator?: { numeroH: string; prenom: string; nomFamille: string }
}

interface Activity {
  id: string
  fromNumeroH: string
  toNumeroH: string
  type: string
  content?: string
  fromName?: string
  created_at: string
}

function getToken() {
  return localStorage.getItem('token')
}

export default function Partenaire() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<UserData | null>(null)
  const [partner, setPartner] = useState<PartnerInfo | null>(null)
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null)
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([])
  const [pendingSent, setPendingSent] = useState<Array<{ id: string; status: string; partner?: PartnerInfo }>>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [linkForm, setLinkForm] = useState({
    partnerNumeroH: '',
    numeroMariageMairie: ''
  })
  const [newActivityContent, setNewActivityContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [noteAnnee, setNoteAnnee] = useState(() => new Date().getFullYear())
  const [noteRating, setNoteRating] = useState(0)
  const [activeSession, setActiveSession] = useState<'avant' | 'paradis' | 'objectif'>('avant')
  const [showMediaUploader, setShowMediaUploader] = useState(false)
  const [showSouvenirSection, setShowSouvenirSection] = useState(false)
  const [showMessageSection, setShowMessageSection] = useState(false)
  type SessionId = 'avant' | 'paradis' | 'objectif'
  const [mediaBySession, setMediaBySession] = useState<Record<SessionId, Array<{ id: string; type: 'photo' | 'video' | 'audio'; url: string; caption?: string; date: string }>>>({
    avant: [],
    paradis: [],
    objectif: []
  })
  const [partnerRatings, setPartnerRatings] = useState<Array<{ id: string; annee: number; note: number }>>([])

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

  const loadMyPartner = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/couple/my-partner`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPartner(data.partner || null)
        setLinkInfo(data.link || null)
      }
    } catch (e) {
      console.error('Erreur chargement partenaire:', e)
    }
  }

  const loadActivities = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/couple/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setActivities(data.activities || [])
      }
    } catch (e) {
      console.error('Erreur chargement activités:', e)
    }
  }

  const loadPartnerRatings = async (genre?: string) => {
    const token = getToken()
    if (!token) return
    const g = genre ?? user?.genre
    try {
      const path = g === 'HOMME' ? '/api/couple/ratings/given' : '/api/couple/ratings/received'
      const res = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setPartnerRatings((data.ratings || []).map((r: { id: string; annee: number; note: number }) => ({ id: r.id, annee: r.annee, note: r.note })))
      }
    } catch (e) {
      console.error('Erreur chargement notes partenaire:', e)
    }
  }

  const loadPendingInvitations = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/couple/pending-invitations`, {
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
      const res = await fetch(`${API_BASE}/api/couple/confirm/${linkId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        loadPendingInvitations()
        loadMyPartner()
        loadActivities()
        loadPendingSent()
      } else alert(data.message || 'Erreur')
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRejectLink = async (linkId: string) => {
    if (!confirm('Refuser cette demande ? L\'autre personne sera notifiée (Désolé).')) return
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/couple/reject/${linkId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Désolé, je ne souhaite pas créer ce lien.' })
      })
      const data = await res.json()
      if (data.success) {
        loadPendingInvitations()
        loadPendingSent()
      } else alert(data.message || 'Erreur')
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  const loadPendingSent = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/couple/pending-sent`, {
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

  const handleLeaveLink = async () => {
    if (!confirm('Quitter cette liaison avec votre partenaire ? Vous pourrez vous relier plus tard.')) return
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/couple/leave`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: linkInfo?.id })
      })
      const data = await res.json()
      if (data.success) {
        setPartner(null)
        setLinkInfo(null)
        loadMyPartner()
        loadActivities()
      } else alert(data.message || 'Erreur')
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const u = loadUser()

    if (u?.numeroH) {
      const isUserAdmin = isAdmin(u)

      // ── Garde âge : moins de 18 ans → retour à Famille (sauf admin général) ──
      const dn = u.dateNaissance || u.date_naissance
      const age = calcAge(dn)
      if (age < 18 && !isUserAdmin) {
        navigate('/famille', { replace: true })
        return
      }

      // ── Garde genre / route (sauf admin général qui peut tout voir) ──────────
      // Un HOMME ne doit pas accéder à /famille/mari (Mon Homme)
      // Une FEMME ne doit pas accéder à /famille/femmes (Ma Femme)
      const path = location.pathname
      if (!isUserAdmin && u.genre === 'HOMME' && path.includes('/mari')) {
        navigate('/famille', { replace: true })
        return
      }
      if (!isUserAdmin && u.genre === 'FEMME' && path.includes('/femmes')) {
        navigate('/famille', { replace: true })
        return
      }

      setLoading(false)
      loadMyPartner()
      loadActivities()
      loadPartnerRatings(u.genre)
      loadPendingInvitations()
      loadPendingSent()
    } else {
      setLoading(false)
    }
  }, [navigate, location.pathname])

  const handleCreateLink = async () => {
    if (!linkForm.partnerNumeroH.trim()) {
      alert('Le NumeroH du partenaire est obligatoire.')
      return
    }
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/couple/link`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          partnerNumeroH: linkForm.partnerNumeroH.trim(),
          numeroMariageMairie: linkForm.numeroMariageMairie.trim() || undefined
        })
      })
      const data = await res.json()
      if (data.success) {
        setLinkForm({ partnerNumeroH: '', numeroMariageMairie: '' })
        setShowLinkForm(false)
        loadMyPartner()
        loadActivities()
        loadPendingInvitations()
        loadPendingSent()
      } else {
        alert(data.message || 'Erreur lors de la liaison')
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddActivity = async () => {
    if (!newActivityContent.trim() || !user) return
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/couple/activity`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'message',
          content: newActivityContent.trim()
        })
      })
      const data = await res.json()
      if (data.success) {
        setNewActivityContent('')
        loadActivities()
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
    const newItem = { id: Date.now().toString(), ...mediaData, date: new Date().toISOString() }
    setMediaBySession((prev) => ({
      ...prev,
      [activeSession]: [...(prev[activeSession] || []), newItem]
    }))
    setShowMediaUploader(false)
  }

  const handleAddNote = async () => {
    if (!user || user.genre !== 'HOMME') return
    if (noteRating < 1 || noteRating > 5) {
      alert('Veuillez choisir une note entre 1 et 5 étoiles.')
      return
    }
    setSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/couple/ratings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ annee: noteAnnee, note: noteRating })
      })
      const data = await res.json()
      if (data.success) {
        setNoteRating(0)
        loadPartnerRatings()
      } else {
        alert(data.message || 'Erreur')
      }
    } catch (e) {
      alert('Erreur réseau')
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
      </div>
    )
  }

  const isHomme = user?.genre === 'HOMME'
  const title = isHomme ? 'Ma Femme' : 'Mon Homme'
  const titleIcon = isHomme ? '👰' : '🤵'
  const partnerLabel = isHomme ? 'votre femme' : 'votre homme'
  const userIsAdmin = isAdmin(user)

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
            <h2 className="text-3xl font-bold text-slate-800">
              {titleIcon} {title}
            </h2>
            <Link to="/famille/inspir" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm font-medium rounded-lg transition-colors border border-yellow-300">
              🤝 Inspir
            </Link>
          </div>
        </div>
        <p className="mt-3 text-slate-600 text-sm">
          Partagez vos moments et recevez les notes de {partnerLabel}.
        </p>
        <div className="mt-4 flex justify-end">
          {!partner && (
            <button
              onClick={() => setShowLinkForm(!showLinkForm)}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
            >
              {showLinkForm ? '✕ Annuler' : '💍 Lier mon partenaire'}
            </button>
          )}
        </div>
      </div>

      {showLinkForm && (
        <div className="bg-pink-50 rounded-xl border border-pink-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Lier {title} (seul le NumeroH est obligatoire)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                NumeroH de {partnerLabel} <span className="text-slate-500">*</span>
              </label>
              <input
                type="text"
                value={linkForm.partnerNumeroH}
                onChange={(e) => setLinkForm({ ...linkForm, partnerNumeroH: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="Ex: G0C0P0R0E0F0 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Numéro reçu lors du mariage à la mairie (optionnel)
              </label>
              <input
                type="text"
                value={linkForm.numeroMariageMairie}
                onChange={(e) => setLinkForm({ ...linkForm, numeroMariageMairie: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="Ex: MARIAGE-2024-001"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCreateLink}
              disabled={submitting}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-medium rounded-lg"
            >
              {submitting ? 'Enregistrement...' : '✓ Lier'}
            </button>
            <button
              onClick={() => setShowLinkForm(false)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {pendingSent.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">📤 Demandes que j&apos;ai envoyées</h3>
          <div className="space-y-3">
            {pendingSent.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💑</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {inv.partner ? `${inv.partner.prenom} ${inv.partner.nomFamille}` : 'Partenaire'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {inv.status === 'rejected' ? '❌ Refusé (Désolé)' : '⏳ En attente'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingInvitations.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-amber-800 mb-4">📩 Invitations reçues (à confirmer)</h3>
          <p className="text-slate-600 mb-4">Votre partenaire souhaite vous lier. Confirmez pour accepter ou supprimez pour refuser.</p>
          <div className="space-y-3">
            {pendingInvitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💑</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {inv.initiator ? `${inv.initiator.prenom} ${inv.initiator.nomFamille}` : inv.initiatedByNumeroH}
                    </p>
                    <p className="text-sm text-slate-500">Numéro mairie : {inv.numeroMariageMairie}</p>
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

      {(partner || userIsAdmin) ? (
        <>
          {partner ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4">💑 Mon partenaire</h3>
                <button
                  onClick={handleLeaveLink}
                  disabled={submitting}
                  className="text-sm text-slate-600 hover:text-slate-700 disabled:opacity-50"
                >
                  Quitter la liaison
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-3xl">
                  {partner.genre === 'FEMME' ? '👰' : '🤵'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-lg">
                    {partner.prenom} {partner.nomFamille}
                  </p>
                  <p className="text-slate-600">{partner.numeroH}</p>
                  {linkInfo?.numeroMariageMairie && (
                    <p className="text-sm text-slate-500 mt-1">
                      Numéro mariage (mairie) : <span className="font-mono">{linkInfo.numeroMariageMairie}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : userIsAdmin ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
              <p className="text-amber-900 font-medium mb-2">👑 Mode administrateur</p>
              <p className="text-slate-700 text-sm mb-4">
                Aucun partenaire lié. En tant qu&apos;administrateur, toutes les sections ci-dessous sont visibles. Liez un partenaire pour utiliser les activités et notes partagées.
              </p>
              <button
                onClick={() => setShowLinkForm(true)}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg"
              >
                💍 Lier mon partenaire
              </button>
            </div>
          ) : null}

          {/* Bouton Souvenir : ouvre la section souvenirs */}
          {!showSouvenirSection ? (
            <button
              type="button"
              onClick={() => setShowSouvenirSection(true)}
              className="w-full mb-3 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg shadow text-white text-left transition-all flex items-center gap-3"
            >
              <span className="text-xl">❤️</span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm block">Souvenir</span>
                <span className="text-pink-100 text-xs">Nos souvenirs avec {partnerLabel}</span>
              </div>
              <span className="text-slate-200 text-lg shrink-0">→</span>
            </button>
          ) : (
            <>
              {/* Bannière + Retour */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg p-4 mb-4 text-white flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-xl font-semibold mb-1">❤️ Nos souvenirs d&apos;ensemble</h3>
                  <p className="text-pink-100 text-sm">Moments précieux partagés avec {partnerLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSouvenirSection(false)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-sm"
                >
                  ← Retour
                </button>
              </div>

              {/* 3 pages distinctes (boutons = navigation) */}
              <div className="flex gap-3 mb-4 overflow-x-auto">
                {[
                  { id: 'avant' as const, title: 'Ma vie avant toi', icon: '👤' },
                  { id: 'paradis' as const, title: isHomme ? 'Nos vies ensemble' : 'Mon paradis dans tes mains', icon: '💕' },
                  { id: 'objectif' as const, title: 'Notre objectif pour demain', icon: '🎯' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`flex-1 min-w-[180px] px-4 py-3 rounded-lg border-2 transition-all ${
                      activeSession === s.id ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                    }`}
                    onClick={() => setActiveSession(s.id)}
                  >
                    <span className="text-2xl block mb-1">{s.icon}</span>
                    <span className="font-semibold text-sm block">{s.title}</span>
                  </button>
                ))}
              </div>

              {/* Contenu de la page active (une page = un contenu distinct) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-800">
                    {activeSession === 'avant' ? 'Ma vie avant toi' : activeSession === 'paradis' ? (isHomme ? 'Nos vies ensemble' : 'Mon paradis dans tes mains') : 'Notre objectif pour demain'}
                  </h4>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm"
                    onClick={() => setShowMediaUploader(true)}
                  >
                    📷 Ajouter média
                  </button>
                </div>
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  {(mediaBySession[activeSession]?.length ?? 0) === 0 ? (
                    <>
                      <p className="text-slate-600 mb-4">Aucun média partagé dans cette page</p>
                      <button
                        type="button"
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg"
                        onClick={() => setShowMediaUploader(true)}
                      >
                        🚀 Commencer à partager
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(mediaBySession[activeSession] || []).map((m) => (
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
          )}

          {!showMessageSection ? (
            <button
              type="button"
              onClick={() => setShowMessageSection(true)}
              className="w-full mb-3 px-4 py-2.5 bg-white rounded-lg shadow-sm border border-slate-200 text-left transition-all flex items-center gap-3 hover:border-pink-300 hover:bg-pink-50/30"
            >
              <span className="text-xl">💬</span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm block text-slate-800">Message</span>
                <span className="text-slate-600 text-xs">Échangez avec {partnerLabel}</span>
              </div>
              <span className="text-slate-400 text-lg shrink-0">→</span>
            </button>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Ce que vous faites l&apos;un pour l&apos;autre
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Chacun voit ce que l'autre a fait pour lui et ce qu'il a fait pour l'autre.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMessageSection(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm"
                >
                  ← Retour
                </button>
              </div>

              <div className="mb-6 flex gap-2">
              <textarea
                value={newActivityContent}
                onChange={(e) => setNewActivityContent(e.target.value)}
                placeholder={`Ajouter un message ou une activité pour ${partnerLabel}...`}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                rows={2}
              />
              <button
                onClick={handleAddActivity}
                disabled={submitting || !newActivityContent.trim()}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-medium rounded-lg self-end"
              >
                Envoyer
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.filter(a => a.type !== 'note').length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-slate-600 font-medium mb-1">Aucune activité pour le moment</p>
                  <p className="text-slate-500 text-sm mb-4">Envoyez un message à {partnerLabel} avec le champ ci-dessus pour commencer l'échange.</p>
                  <p className="text-slate-400 text-xs">Les messages que vous envoyez et ceux de votre partenaire apparaîtront ici.</p>
                </div>
              ) : (
                activities.filter(a => a.type !== 'note').map((act) => (
                  <div
                    key={act.id}
                    className={`p-4 rounded-lg border ${
                      act.fromNumeroH === user?.numeroH
                        ? 'bg-pink-50 border-pink-200 ml-4'
                        : 'bg-purple-50 border-purple-200 mr-4'
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

            {/* Tableau Notes (alimenté par l’ajout de notes) */}
            <div className="mt-8 pt-6 border-t border-slate-200" id="section-notes">
              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-slate-500" aria-hidden>☆</span>
                Notes
              </h4>
              {isHomme && (
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
                          className="min-w-[160px] w-40 px-3 py-2.5 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-400"
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
                    type="button"
                    onClick={handleAddNote}
                    disabled={submitting || noteRating < 1}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm"
                  >
                    {submitting ? 'Envoi…' : '✓ Ajouter la note'}
                  </button>
                </div>
              </div>
              )}

              <div className="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white shadow-sm">
                <table id="tableau-notes" className="min-w-full text-sm" aria-label="Notes">
                  <thead className="bg-slate-200 text-slate-800 border-b-2 border-slate-300">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left font-semibold">Année</th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold">Note</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {partnerRatings.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-slate-500 bg-slate-50">
                          {isHomme ? 'Aucune note. Renseignez une année et une note ci-dessus puis cliquez sur « Ajouter la note ».' : "Aucune note pour l'instant. Votre mari peut vous noter depuis son espace « Ma Femme »."}
                        </td>
                      </tr>
                    ) : (
                      partnerRatings.map((r) => (
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
                  <span>Tableau <strong>Notes</strong> — {partnerRatings.length} note{partnerRatings.length !== 1 ? 's' : ''}</span>
                  {partnerRatings.length > 0 && (
                    <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-lg font-semibold">Note moyenne : {(partnerRatings.reduce((s, r) => s + r.note, 0) / partnerRatings.length).toFixed(1)}/5 ★</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

          {showMediaUploader && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowMediaUploader(false)}>
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-xl font-semibold text-slate-800">📷 Ajouter un média</h3>
                  <button type="button" className="text-slate-500 hover:text-slate-700 text-2xl" onClick={() => setShowMediaUploader(false)}>✕</button>
                </div>
                <div className="p-4">
                  <MediaUploader onClose={() => setShowMediaUploader(false)} onUpload={handleAddMedia} />
                </div>
              </div>
            </div>
          )}
        </>
      ) : !showLinkForm && pendingInvitations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">
            Aucun partenaire lié. Liez-vous avec le NumeroH de {partnerLabel} et le numéro du mariage à la mairie. Le destinataire devra confirmer.
          </p>
          <button
            onClick={() => setShowLinkForm(true)}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg"
          >
            💍 Lier mon partenaire
          </button>
        </div>
      ) : null}
    </div>
  )
}
