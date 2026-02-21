import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || ''

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  dateNaissance?: string
  date_naissance?: string
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
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [linkForm, setLinkForm] = useState({
    partnerNumeroH: '',
    numeroMariageMairie: ''
  })
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
      } else alert(data.message || 'Erreur')
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSubmitting(false)
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
      // ── Garde âge : moins de 18 ans → retour à Famille ──
      const dn = u.dateNaissance || u.date_naissance
      const age = calcAge(dn)
      if (age < 18) {
        navigate('/famille', { replace: true })
        return
      }

      // ── Garde genre / route ──────────────────────────────
      // Un HOMME ne doit pas accéder à /famille/mari (Mon Homme)
      // Une FEMME ne doit pas accéder à /famille/femmes (Ma Femme)
      const path = location.pathname
      if (u.genre === 'HOMME' && path.includes('/mari')) {
        navigate('/famille', { replace: true })
        return
      }
      if (u.genre === 'FEMME' && path.includes('/femmes')) {
        navigate('/famille', { replace: true })
        return
      }

      setLoading(false)
      loadMyPartner()
      loadActivities()
      loadPendingInvitations()
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
            <h2 className="text-3xl font-bold text-slate-800">
              {titleIcon} {title}
            </h2>
            <Link to="/famille/inspir" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm font-medium rounded-lg transition-colors border border-yellow-300">
              🤝 Inspir
            </Link>
          </div>
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
                    onClick={async () => {
                      if (!confirm('Supprimer cette invitation ?')) return
                      setSubmitting(true)
                      try {
                        const token = getToken()
                        const res = await fetch(`${API_BASE}/api/couple/leave`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                          body: JSON.stringify({ linkId: inv.id })
                        })
                        const data = await res.json()
                        if (data.success) loadPendingInvitations()
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                    disabled={submitting}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:opacity-50 text-white font-medium rounded-lg"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {partner ? (
        <>
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

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Ce que vous faites l'un pour l'autre
            </h3>
            <p className="text-slate-600 mb-4">
              Chacun voit ce que l'autre a fait pour lui et ce qu'il a fait pour l'autre.
            </p>

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
              {activities.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Aucune activité pour le moment.</p>
              ) : (
                activities.map((act) => (
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
          </div>
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
