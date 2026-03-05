import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002'

interface GalleryItem {
  id: string
  url: string
  type: 'image' | 'video'
  album: AlbumKey
  uploaderName: string
  uploaderNumeroH: string
  created_at: string
}

type AlbumKey = 'rencontre' | 'bapteme' | 'mariage' | 'deces'

const ALBUMS = [
  {
    key: 'rencontre' as AlbumKey,
    label: 'Rencontre',
    emoji: '💑',
    gradient: 'from-indigo-600 to-purple-600',
    ring: 'ring-indigo-400',
    badge: 'bg-indigo-100 text-indigo-800',
    border: 'border-indigo-500',
  },
  {
    key: 'bapteme' as AlbumKey,
    label: 'Baptême',
    emoji: '👶',
    gradient: 'from-sky-500 to-blue-600',
    ring: 'ring-sky-400',
    badge: 'bg-sky-100 text-sky-800',
    border: 'border-sky-500',
  },
  {
    key: 'mariage' as AlbumKey,
    label: 'Mariage',
    emoji: '💍',
    gradient: 'from-amber-500 to-yellow-600',
    ring: 'ring-amber-400',
    badge: 'bg-amber-100 text-amber-800',
    border: 'border-amber-500',
  },
  {
    key: 'deces' as AlbumKey,
    label: 'Deuil',
    emoji: '🕊️',
    gradient: 'from-slate-500 to-gray-700',
    ring: 'ring-slate-400',
    badge: 'bg-slate-100 text-slate-700',
    border: 'border-slate-500',
  },
]

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function isVideo(item: GalleryItem) {
  return item.type === 'video' || item.url?.includes('video')
}

export default function GalerieFamily() {
  const navigate = useNavigate()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeAlbum, setActiveAlbum] = useState<AlbumKey | 'all'>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadAlbum, setUploadAlbum] = useState<AlbumKey>('rencontre')
  const [showUploadPanel, setShowUploadPanel] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const token = localStorage.getItem('token')
  const sessionRaw = localStorage.getItem('session_user')
  const session = sessionRaw ? JSON.parse(sessionRaw) : {}
  const currentUser = session.userData || session
  const myNumeroH = currentUser?.numeroH

  const loadGallery = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/family/shared-gallery`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Erreur chargement galerie')
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      setError('Impossible de charger la galerie. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadGallery()
  }, [token, loadGallery, navigate])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowRight') setLightboxIdx(i => i !== null ? Math.min(i + 1, filtered.length - 1) : null)
      if (e.key === 'ArrowLeft') setLightboxIdx(i => i !== null ? Math.max(i - 1, 0) : null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const filtered = activeAlbum === 'all' ? items : items.filter(i => i.album === activeAlbum)

  const handleUpload = async (file: File) => {
    if (!token || !file) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('media', file)
      const res = await fetch(`${API_BASE}/api/family/shared-gallery/${uploadAlbum}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur upload')
      }
      await loadGallery()
      setShowUploadPanel(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!confirm('Supprimer cette photo ?')) return
    try {
      const res = await fetch(`${API_BASE}/api/family/shared-gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      setItems(prev => prev.filter(i => i.id !== id))
      if (lightboxIdx !== null) setLightboxIdx(null)
    } catch {
      setError('Impossible de supprimer cette photo.')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const albumCounts = ALBUMS.map(a => ({
    ...a,
    count: items.filter(i => i.album === a.key).length,
  }))

  const lightboxItem = lightboxIdx !== null ? filtered[lightboxIdx] : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ═══ HEADER ═══ */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-indigo-300 hover:text-white text-sm mb-4 transition-colors"
              >
                ← Retour
              </button>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  Galerie Familiale
                </span>
              </h1>
              <p className="mt-2 text-indigo-200 text-sm sm:text-base">
                Partagez et revivez vos plus beaux souvenirs en famille
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold text-amber-300">{items.length}</div>
                <div className="text-xs text-indigo-200">photos</div>
              </div>
              <button
                onClick={() => setShowUploadPanel(v => !v)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-900/30 transition-all hover:scale-105"
              >
                <span className="text-lg">+</span>
                Ajouter
              </button>
            </div>
          </div>

          {/* Album Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {albumCounts.map(a => (
              <button
                key={a.key}
                onClick={() => setActiveAlbum(activeAlbum === a.key ? 'all' : a.key)}
                className={`group relative rounded-xl p-3 text-left transition-all hover:scale-[1.03] ${
                  activeAlbum === a.key
                    ? 'ring-2 ring-white/60 bg-white/20'
                    : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <div className="text-2xl mb-1">{a.emoji}</div>
                <div className="text-sm font-semibold text-white">{a.label}</div>
                <div className="text-xs text-indigo-300">{a.count} photo{a.count !== 1 ? 's' : ''}</div>
                {activeAlbum === a.key && (
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br ${a.gradient}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ UPLOAD PANEL ═══ */}
      {showUploadPanel && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Album de destination
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALBUMS.map(a => (
                    <button
                      key={a.key}
                      onClick={() => setUploadAlbum(a.key)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                        uploadAlbum === a.key
                          ? `bg-gradient-to-r ${a.gradient} text-white border-transparent shadow-md`
                          : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400`
                      }`}
                    >
                      {a.emoji} {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowUploadPanel(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm"
              >
                Annuler
              </button>
            </div>

            {/* Drop Zone */}
            <div
              className={`mt-4 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-5xl mb-3">{uploading ? '⏳' : '📸'}</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {uploading
                  ? 'Upload en cours...'
                  : 'Glissez une photo/vidéo ici ou cliquez pour choisir'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                JPG, PNG, MP4 — max 10 Mo
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                disabled={uploading}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handleUpload(f)
                  e.target.value = ''
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ FILTRES ═══ */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveAlbum('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeAlbum === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
            }`}
          >
            Tous ({items.length})
          </button>
          {ALBUMS.map(a => (
            <button
              key={a.key}
              onClick={() => setActiveAlbum(activeAlbum === a.key ? 'all' : a.key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeAlbum === a.key
                  ? `bg-gradient-to-r ${a.gradient} text-white shadow`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {a.emoji} {a.label} ({items.filter(i => i.album === a.key).length})
            </button>
          ))}
        </div>
      </div>

      {/* ═══ ERROR ═══ */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        </div>
      )}

      {/* ═══ GRID ═══ */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-gray-400 dark:text-gray-500 text-sm">Chargement de la galerie...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-7xl">📷</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Aucune photo dans cet album</p>
            <button
              onClick={() => setShowUploadPanel(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all hover:scale-105"
            >
              Ajouter la première photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((item, idx) => {
              const albumCfg = ALBUMS.find(a => a.key === item.album) || ALBUMS[0]
              const isOwner = item.uploaderNumeroH === myNumeroH
              return (
                <div
                  key={item.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-gray-100 dark:border-gray-700"
                  onClick={() => setLightboxIdx(idx)}
                >
                  {/* Media */}
                  {isVideo(item) ? (
                    <div className="relative aspect-square bg-gray-900">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-80"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xl ml-0.5">▶</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                      <img
                        src={item.url}
                        alt={`Photo ${albumCfg.label}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Album badge */}
                  <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${albumCfg.badge} bg-opacity-90 backdrop-blur-sm shadow`}>
                    {albumCfg.emoji} {albumCfg.label}
                  </div>

                  {/* Video badge */}
                  {isVideo(item) && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs font-bold rounded-full">
                      VIDÉO
                    </div>
                  )}

                  {/* Overlay info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-semibold truncate">{item.uploaderName}</p>
                    <p className="text-white/70 text-xs">{formatDate(item.created_at)}</p>
                    {isOwner && (
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(item.id) }}
                        className="mt-2 self-start px-2.5 py-1 bg-red-500/90 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightboxIdx(null)}
        >
          {/* Nav prev */}
          {lightboxIdx! > 0 && (
            <button
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-xl transition-all z-10"
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => i! - 1) }}
            >
              ‹
            </button>
          )}

          {/* Media */}
          <div
            className="relative max-w-4xl w-full mx-4 sm:mx-16"
            onClick={e => e.stopPropagation()}
          >
            {isVideo(lightboxItem) ? (
              <video
                src={lightboxItem.url}
                controls
                autoPlay
                className="w-full max-h-[75vh] rounded-xl object-contain shadow-2xl"
              />
            ) : (
              <img
                src={lightboxItem.url}
                alt=""
                className="w-full max-h-[75vh] rounded-xl object-contain shadow-2xl"
              />
            )}

            {/* Info bar */}
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{lightboxItem.uploaderName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {(() => {
                    const a = ALBUMS.find(x => x.key === lightboxItem.album) || ALBUMS[0]
                    return (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.badge}`}>
                        {a.emoji} {a.label}
                      </span>
                    )
                  })()}
                  <span className="text-white/60 text-xs">{formatDate(lightboxItem.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {lightboxItem.uploaderNumeroH === myNumeroH && (
                  <button
                    onClick={() => handleDelete(lightboxItem.id)}
                    className="px-3 py-1.5 bg-red-500/80 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Supprimer
                  </button>
                )}
                <span className="text-white/50 text-sm">{lightboxIdx! + 1} / {filtered.length}</span>
              </div>
            </div>
          </div>

          {/* Nav next */}
          {lightboxIdx! < filtered.length - 1 && (
            <button
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-xl transition-all z-10"
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => i! + 1) }}
            >
              ›
            </button>
          )}

          {/* Close */}
          <button
            className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all"
            onClick={() => setLightboxIdx(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* ═══ LIEN RETOUR FAMILLE ═══ */}
      <div className="fixed bottom-4 left-4">
        <Link
          to="/famille"
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 shadow-lg rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 transition-all hover:shadow-xl"
        >
          👨‍👩‍👧‍👦 Famille
        </Link>
      </div>
    </div>
  )
}
