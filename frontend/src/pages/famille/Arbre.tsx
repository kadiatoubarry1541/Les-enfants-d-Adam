import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArbreGenealogique } from '../../components/ArbreGenealogique'
import { buildFamilyTree, getCercleDesRacinesCounts } from '../../services/FamilyTreeBuilder'
import { useI18n } from '../../i18n/useI18n'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  [key: string]: any
}

interface PartnerInfo {
  numeroH: string
  prenom: string
  nomFamille: string
  genre?: 'HOMME' | 'FEMME' | 'AUTRE'
  photo?: string
}

interface ParentLinkInfo {
  id: string
  parentNumeroH: string
  childNumeroH: string
  parentType: 'pere' | 'mere'
  parent?: {
    numeroH: string
    prenom: string
    nomFamille: string
    photo?: string
    genre?: 'HOMME' | 'FEMME' | 'AUTRE'
  }
}

interface FamilyMessage {
  id: string
  numeroH: string
  authorName?: string
  content: string
  messageType?: 'text' | 'image' | 'video' | 'audio'
  mediaUrl?: string | null
  created_at?: string
  createdAt?: string
  familyName?: string
}

export default function Arbre() {
  const [user, setUser] = useState<UserData | null>(null)
  const [partner, setPartner] = useState<PartnerInfo | null>(null)
  const [parentsLinks, setParentsLinks] = useState<ParentLinkInfo[]>([])
  const [activeTab, setActiveTab] = useState<'arbre' | 'echanges'>('echanges')
  const { t } = useI18n()

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002'

  // Messagerie familiale (style WhatsApp)
  const [familyMessages, setFamilyMessages] = useState<FamilyMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Galerie famille par albums
  const [showGallery, setShowGallery] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [activeAlbum, setActiveAlbum] = useState<'bapteme' | 'mariage' | 'deces' | 'rencontre'>('bapteme')
  const [uploading, setUploading] = useState(false)
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null)
  const [viewerMedia, setViewerMedia] = useState<{ url: string; type: string } | null>(null)
  const [albums, setAlbums] = useState<Record<string, Array<{ url: string; type: string; uploadedAt: string }>>>({
    bapteme: [], mariage: [], deces: [], rencontre: []
  })

useEffect(() => {
  const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
  const u = sessionData.userData || sessionData
  if (u?.numeroH) setUser(u)
}, [])

useEffect(() => {
  const loadPartnerAndParents = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const [partnerRes, parentsRes] = await Promise.all([
        fetch(`${API_BASE}/api/couple/my-partner`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch(`${API_BASE}/api/parent-child/my-parents`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ])

      if (partnerRes.ok) {
        const data = await partnerRes.json()
        if (data.success && data.partner) {
          setPartner({
            numeroH: data.partner.numeroH,
            prenom: data.partner.prenom,
            nomFamille: data.partner.nomFamille,
            genre: (data.partner.genre || 'AUTRE') as PartnerInfo['genre'],
            photo: data.partner.photo
          })
        } else {
          setPartner(null)
        }
      }

      if (parentsRes.ok) {
        const data = await parentsRes.json()
        if (data.success && Array.isArray(data.parents)) {
          setParentsLinks(
            data.parents.map((p: any) => ({
              id: p.id,
              parentNumeroH: p.parentNumeroH,
              childNumeroH: p.childNumeroH,
              parentType: p.parentType,
              parent: p.parent
                ? {
                    numeroH: p.parent.numeroH,
                    prenom: p.parent.prenom,
                    nomFamille: p.parent.nomFamille,
                    photo: p.parent.photo,
                    genre: p.parent.genre
                  }
                : undefined
            }))
          )
        } else {
          setParentsLinks([])
        }
      }
    } catch {
      // Erreur réseau : ne pas bloquer l'affichage de l'arbre
    }
  }

  loadPartnerAndParents()
}, [API_BASE])

  useEffect(() => {
    if (activeTab === 'echanges') {
      loadFamilyMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const effectiveUser: UserData = user || {
    numeroH: '',
    prenom: 'Invité',
    nomFamille: '',
    genre: 'HOMME'
  }

const enhancedUser: UserData = useMemo(() => {
  let base: UserData = { ...effectiveUser }

  // Conjoint(e) lié(e)
  if (partner) {
    base = {
      ...base,
      conjointPrenom: partner.prenom,
      conjointNumeroH: partner.numeroH,
      conjointNomFamille: partner.nomFamille,
      conjointGenre: partner.genre,
      conjointPhoto: partner.photo
    }
  }

  // Parents liés (via API parent-child/my-parents)
  const pereLink = parentsLinks.find((p) => p.parentType === 'pere' && p.parent)
  const mereLink = parentsLinks.find((p) => p.parentType === 'mere' && p.parent)

  if (pereLink?.parent) {
    base = {
      ...base,
      prenomPere: pereLink.parent.prenom,
      numeroHPere: pereLink.parent.numeroH,
      famillePere: pereLink.parent.nomFamille,
      perePhoto: pereLink.parent.photo
    }
  }

  if (mereLink?.parent) {
    base = {
      ...base,
      prenomMere: mereLink.parent.prenom,
      numeroHMere: mereLink.parent.numeroH,
      familleMere: mereLink.parent.nomFamille,
      merePhoto: mereLink.parent.photo
    }
  }

  return base
}, [effectiveUser, partner, parentsLinks])

  const familyMembers = useMemo(() => buildFamilyTree(enhancedUser), [enhancedUser])
  const cercleCounts = useMemo(
    () => getCercleDesRacinesCounts(enhancedUser, familyMembers),
    [enhancedUser, familyMembers]
  )

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const loadFamilyMessages = async () => {
    try {
      setLoadingMessages(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/family-tree/messages', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // On affiche du plus ancien au plus récent
        const messages: FamilyMessage[] = (data.messages || []).slice().reverse()
        setFamilyMessages(messages)
        setTimeout(scrollToBottom, 150)
      } else {
        console.error('Erreur chargement messages familiaux:', data.message || data.error)
      }
    } catch (error) {
      console.error('Erreur chargement messages familiaux:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendFamilyMessage = async () => {
    if (!newMessage.trim() || isSending) return

    try {
      setIsSending(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/family-tree/messages', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          messageType: 'text'
        })
      })

      const data = await response.json()

      if (response.ok && data.success && data.message) {
        setFamilyMessages((prev) => [...prev, data.message])
        setNewMessage('')
        setTimeout(scrollToBottom, 100)
      } else {
        alert(data.message || 'Erreur lors de l\'envoi du message')
      }
    } catch (error: any) {
      console.error('Erreur envoi message familial:', error)
      alert(error?.message || 'Erreur lors de l\'envoi du message')
    } finally {
      setIsSending(false)
    }
  }

  const loadGallery = async () => {
    try {
      setGalleryLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/family/gallery`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        setAlbums(data.albums || { bapteme: [], mariage: [], deces: [], rencontre: [] })
      }
    } catch (e) {
      console.error('Erreur chargement galerie:', e)
    } finally {
      setGalleryLoading(false)
    }
  }

  const openGallery = () => {
    setShowGallery(true)
    loadGallery()
  }

  const handleUploadMedia = async (file: File) => {
    try {
      setUploading(true)
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('media', file)
      const res = await fetch(`${API_BASE}/api/family/gallery/${activeAlbum}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (res.ok) {
        setAlbums(data.albums)
      } else {
        alert(data.message || 'Erreur lors de l\'upload')
      }
    } catch {
      alert('Erreur de connexion au serveur')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMedia = async (index: number) => {
    if (!confirm('Supprimer ce média ?')) return
    try {
      setDeletingIdx(index)
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/family/gallery/${activeAlbum}/${index}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setAlbums(data.albums)
      } else {
        alert(data.message || 'Erreur lors de la suppression')
      }
    } catch {
      alert('Erreur de connexion au serveur')
    } finally {
      setDeletingIdx(null)
    }
  }

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(url)

  // Rencontre en PREMIER comme demandé
  const ALBUM_CONFIG = [
    { key: 'rencontre' as const, label: 'Rencontre', emoji: '🤝' },
    { key: 'bapteme'  as const,  label: 'Baptême',   emoji: '🕊️' },
    { key: 'mariage'  as const,  label: 'Mariage',   emoji: '💍' },
    { key: 'deces'    as const,  label: 'Décès',     emoji: '🕯️' },
  ]

  // Vue : 'list' = liste albums | 'detail' = contenu album
  const [galleryView, setGalleryView] = useState<'list' | 'detail'>('list')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6" />
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-6">
          {/* 1. Échanges familiaux = page par défaut */}
          <button
            onClick={() => setActiveTab('echanges')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'echanges'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💬 Échanges familiaux
          </button>

          {/* 2. Galerie famille (ouvre juste la modale) */}
          <button
            type="button"
            onClick={openGallery}
            className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
          >
            📷 Galerie famille
          </button>

          {/* 3. Mon arbre (en dernier) */}
          <button
            onClick={() => setActiveTab('arbre')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'arbre'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌳 Mon arbre
          </button>
        </div>

        {activeTab === 'arbre' && (
          <>
            <h2 className="text-2xl font-bold mb-4">🌳 Mon arbre généalogique</h2>
            <ArbreGenealogique
              userData={enhancedUser}
              cercleCounts={cercleCounts}
              onOpenGallery={openGallery}
            />
          </>
        )}

        {activeTab === 'echanges' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold">💬 Échanges familiaux</h2>
              <p className="text-gray-600">
                Communiquez avec tous les membres de la famille{' '}
                <span className="font-semibold">
                  {effectiveUser.nomFamille ? `« ${effectiveUser.nomFamille} »` : ''}
                </span>{' '}
                comme dans une discussion WhatsApp de groupe.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-900 space-y-2">
                <p className="font-semibold">Conseils d&apos;utilisation</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Les messages sont visibles par tous les membres de la même famille.</li>
                  <li>Utilisez ce canal pour les annonces importantes, les nouvelles et les prières.</li>
                  <li>Restez respectueux et bienveillant dans vos échanges.</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[340px] sm:h-[480px] bg-white">
                {/* Header style WhatsApp */}
                <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-xl">
                      👨‍👩‍👧‍👦
                    </div>
                    <div>
                      <p className="font-semibold">
                        Famille {effectiveUser.nomFamille || 'ADAM'}
                      </p>
                      <p className="text-xs text-green-100">Espace privé entre membres de la famille</p>
                    </div>
                  </div>
                </div>

                {/* Zone de messages */}
                <div className="flex-1 bg-gray-100 px-3 py-3 overflow-y-auto">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <div className="h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Chargement des messages...</span>
                      </div>
                    </div>
                  ) : familyMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500 text-sm space-y-2">
                        <p>Aucun message pour le moment.</p>
                        <p>Soyez le premier à écrire à votre famille.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {familyMessages.map((msg) => {
                        const isMe = msg.numeroH === effectiveUser.numeroH
                        const createdAt =
                          msg.createdAt || msg.created_at || new Date().toISOString()

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs sm:max-w-md px-3 py-2 rounded-2xl shadow-sm ${
                                isMe
                                  ? 'bg-green-500 text-white rounded-br-sm'
                                  : 'bg-white text-gray-900 rounded-bl-sm'
                              }`}
                            >
                              {!isMe && (
                                <p className="text-xs font-semibold mb-0.5 opacity-80">
                                  {msg.authorName || 'Membre de la famille'}
                                </p>
                              )}
                              {(msg.messageType === 'text' || !msg.messageType) && (
                                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                              )}
                              {msg.mediaUrl && msg.messageType === 'image' && (
                                <img
                                  src={msg.mediaUrl}
                                  alt="Pièce jointe"
                                  className="mt-1 rounded-lg max-h-60 object-cover"
                                />
                              )}
                              {msg.mediaUrl && msg.messageType === 'video' && (
                                <video
                                  src={msg.mediaUrl}
                                  controls
                                  className="mt-1 rounded-lg max-h-60 w-full"
                                />
                              )}
                              {msg.mediaUrl && msg.messageType === 'audio' && (
                                <audio
                                  src={msg.mediaUrl}
                                  controls
                                  className="mt-1 w-full"
                                />
                              )}
                              <p
                                className={`text-[10px] mt-1 ${
                                  isMe ? 'text-green-100' : 'text-gray-500'
                                }`}
                              >
                                {new Date(createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl text-gray-500 hover:bg-gray-100"
                      title="Pièce jointe (bientôt disponible)"
                    >
                      📎
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendFamilyMessage()
                        }
                      }}
                      placeholder="Écrivez un message familial..."
                      className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={sendFamilyMessage}
                      disabled={!newMessage.trim() || isSending}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-colors ${
                        !newMessage.trim() || isSending
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      ➤
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── GALERIE FAMILLE PAR ALBUMS ── */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <div>
                <h3 className="text-base font-bold">📷 Galerie de la famille</h3>
                <p className="text-[11px] text-gray-300 mt-0.5">Sélectionnez un album pour voir ou ajouter des médias</p>
              </div>
              <button
                onClick={() => { setShowGallery(false); setViewerMedia(null) }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-lg transition-colors"
              >✕</button>
            </div>

            {/* ── Boutons albums ── */}
            <div className="grid grid-cols-4 gap-0 border-b border-gray-200">
              {ALBUM_CONFIG.map(cfg => {
                const count = albums[cfg.key]?.length || 0
                const isActive = activeAlbum === cfg.key
                return (
                  <button
                    key={cfg.key}
                    onClick={() => setActiveAlbum(cfg.key)}
                    className={`flex flex-col items-center justify-center py-3 px-2 transition-all border-b-3 ${
                      isActive
                        ? 'bg-gray-50 border-b-2 border-gray-800 text-gray-900'
                        : 'bg-white border-b-2 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <span className="text-xl mb-0.5">{cfg.emoji}</span>
                    <span className={`text-[11px] font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{cfg.label}</span>
                    {count > 0 && (
                      <span className={`mt-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* ── Contenu album ── */}
            {galleryLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Chargement...</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                {/* Titre + bouton upload */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {ALBUM_CONFIG.find(c => c.key === activeAlbum)?.emoji} Album {ALBUM_CONFIG.find(c => c.key === activeAlbum)?.label}
                    </h4>
                    <p className="text-xs text-gray-400">{albums[activeAlbum]?.length || 0} média(s)</p>
                  </div>
                  <label className={`cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 active:scale-95'}`}>
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>＋ Ajouter</>
                    )}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      disabled={uploading}
                      onChange={async e => {
                        const files = Array.from(e.target.files || [])
                        for (const file of files) { await handleUploadMedia(file) }
                        e.target.value = ''
                      }}
                    />
                  </label>
                </div>

                {/* Grille médias */}
                {(albums[activeAlbum]?.length || 0) === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-gray-300">
                    <span className="text-5xl mb-3">{ALBUM_CONFIG.find(c => c.key === activeAlbum)?.emoji}</span>
                    <p className="text-sm font-medium text-gray-400">Aucune photo ni vidéo dans cet album</p>
                    <p className="text-xs text-gray-300 mt-1">Cliquez sur "＋ Ajouter" pour commencer</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {albums[activeAlbum].map((item, idx) => (
                      <div key={idx} className="group relative rounded-xl overflow-hidden bg-gray-100 shadow-sm" style={{ aspectRatio: '1' }}>
                        {/* Thumbnail */}
                        {item.type === 'video' || isVideo(item.url) ? (
                          <video
                            src={`${API_BASE}${item.url}`}
                            className="w-full h-full object-cover cursor-pointer"
                            muted
                            onClick={() => setViewerMedia(item)}
                          />
                        ) : (
                          <img
                            src={`${API_BASE}${item.url}`}
                            alt=""
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setViewerMedia(item)}
                          />
                        )}

                        {/* Badge vidéo */}
                        {(item.type === 'video' || isVideo(item.url)) && (
                          <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full">▶ Vidéo</div>
                        )}

                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => setViewerMedia(item)}
                            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-800 hover:bg-white text-sm"
                            title="Voir en grand"
                          >🔍</button>
                          <button
                            onClick={() => handleDeleteMedia(idx)}
                            disabled={deletingIdx === idx}
                            className="w-8 h-8 rounded-full bg-red-500/90 flex items-center justify-center text-white hover:bg-red-600 text-sm"
                            title="Supprimer"
                          >{deletingIdx === idx ? '...' : '🗑️'}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="px-5 py-2 border-t border-gray-100 text-[10px] text-gray-400 text-center">
              JPG · PNG · MP4 · WebM · MOV · Taille max 100 MB · Sélection multiple possible
            </div>
          </div>
        </div>
      )}

      {/* ── VISIONNEUSE PLEIN ÉCRAN ── */}
      {viewerMedia && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={() => setViewerMedia(null)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20" onClick={() => setViewerMedia(null)}>✕</button>
          {viewerMedia.type === 'video' || isVideo(viewerMedia.url) ? (
            <video
              src={`${API_BASE}${viewerMedia.url}`}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <img
              src={`${API_BASE}${viewerMedia.url}`}
              alt=""
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  )
}
