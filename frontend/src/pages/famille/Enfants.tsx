import { useEffect, useState } from 'react'
import { MediaUploader } from '../../components/MediaUploader'
import { MediaReactions } from '../../components/MediaReactions'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  nbFilles?: number
  nbGarcons?: number
}

interface Enfant {
  id: string
  prenom: string
  numeroH: string
  genre: 'FILLE' | 'GARCON'
  dateNaissance?: string
  age?: number
}

interface MediaItem {
  id: string
  section: 'joie' | 'energie' | 'objectifs'
  type: 'photo' | 'video' | 'audio' | 'text'
  url?: string
  content?: string
  caption?: string
  date: string
  reactions?: any[]
}

export default function Enfants() {
  const [user, setUser] = useState<UserData | null>(null)
  const [enfants, setEnfants] = useState<Enfant[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEnfant, setNewEnfant] = useState({
    prenom: '',
    numeroH: '',
    genre: 'GARCON' as 'FILLE' | 'GARCON',
    dateNaissance: ''
  })
  const [activeSection, setActiveSection] = useState<'joie' | 'energie' | 'objectifs'>('joie')
  const [showMediaUploader, setShowMediaUploader] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [newTextContent, setNewTextContent] = useState('')

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
    const u = sessionData.userData || sessionData
    if (u?.numeroH) {
      setUser(u)
      // Charger les enfants depuis le localStorage
      const storedEnfants = localStorage.getItem(`enfants_${u.numeroH}`)
      if (storedEnfants) {
        setEnfants(JSON.parse(storedEnfants))
      }
      // Charger les médias depuis le localStorage
      const storedMedia = localStorage.getItem(`enfants_media_${u.numeroH}`)
      if (storedMedia) {
        setMediaItems(JSON.parse(storedMedia))
      }
    }
  }, [])

  const effectiveUser: UserData = user || {
    numeroH: '',
    prenom: 'Invité',
    nomFamille: '',
    genre: 'HOMME'
  }

  const handleAddEnfant = () => {
    if (!newEnfant.prenom || !newEnfant.numeroH) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const enfant: Enfant = {
      id: Date.now().toString(),
      prenom: newEnfant.prenom,
      numeroH: newEnfant.numeroH,
      genre: newEnfant.genre,
      dateNaissance: newEnfant.dateNaissance || undefined,
      age: newEnfant.dateNaissance 
        ? new Date().getFullYear() - new Date(newEnfant.dateNaissance).getFullYear()
        : undefined
    }

    const updatedEnfants = [...enfants, enfant]
    setEnfants(updatedEnfants)
    localStorage.setItem(`enfants_${effectiveUser.numeroH}`, JSON.stringify(updatedEnfants))

    // Réinitialiser le formulaire
    setNewEnfant({ prenom: '', numeroH: '', genre: 'GARCON', dateNaissance: '' })
    setShowAddForm(false)
  }

  const handleRemoveEnfant = (id: string) => {
    const updatedEnfants = enfants.filter(e => e.id !== id)
    setEnfants(updatedEnfants)
    localStorage.setItem(`enfants_${effectiveUser.numeroH}`, JSON.stringify(updatedEnfants))
  }

  const handleAddMedia = (mediaData: any) => {
    const newMedia: MediaItem = {
      id: Date.now().toString(),
      section: activeSection,
      type: mediaData.type,
      url: mediaData.url,
      caption: mediaData.caption,
      date: new Date().toISOString(),
      reactions: []
    }
    const updatedMedia = [...mediaItems, newMedia]
    setMediaItems(updatedMedia)
    localStorage.setItem(`enfants_media_${effectiveUser.numeroH}`, JSON.stringify(updatedMedia))
    setShowMediaUploader(false)
  }

  const handleAddText = () => {
    if (newTextContent.trim()) {
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        section: activeSection,
        type: 'text',
        content: newTextContent.trim(),
        date: new Date().toISOString(),
        reactions: []
      }
      const updatedMedia = [...mediaItems, newMedia]
      setMediaItems(updatedMedia)
      localStorage.setItem(`enfants_media_${effectiveUser.numeroH}`, JSON.stringify(updatedMedia))
      setNewTextContent('')
    }
  }

  const handleAddReaction = (mediaId: string, type: 'like' | 'cry' | 'comment', content?: string) => {
    const memberSession = JSON.parse(localStorage.getItem('member_session') || '{}')
    if (!memberSession.numeroH) return

    const newReaction = {
      id: Date.now().toString(),
      type,
      memberName: memberSession.nomComplet,
      memberNumeroH: memberSession.numeroH,
      content,
      date: new Date().toISOString()
    }

    const updatedMedia = mediaItems.map(media => 
      media.id === mediaId 
        ? { ...media, reactions: [...(media.reactions || []), newReaction] }
        : media
    )
    setMediaItems(updatedMedia)
    localStorage.setItem(`enfants_media_${effectiveUser.numeroH}`, JSON.stringify(updatedMedia))
  }

  const getMediaBySection = (section: 'joie' | 'energie' | 'objectifs') => {
    return mediaItems.filter(m => m.section === section)
  }

  const nbFilles = enfants.filter(e => e.genre === 'FILLE').length
  const nbGarcons = enfants.filter(e => e.genre === 'GARCON').length

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">👶 Mes Enfants</h2>
            <p className="text-slate-600">
              {nbGarcons} garçon{nbGarcons > 1 ? 's' : ''} • {nbFilles} fille{nbFilles > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {showAddForm ? '✕ Annuler' : '+ Ajouter un enfant'}
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Ajouter un enfant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newEnfant.prenom}
                onChange={(e) => setNewEnfant({ ...newEnfant, prenom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Prénom de l'enfant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                NuméroH <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newEnfant.numeroH}
                onChange={(e) => setNewEnfant({ ...newEnfant, numeroH: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: G0C0P0R0E0F0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                value={newEnfant.genre}
                onChange={(e) => setNewEnfant({ ...newEnfant, genre: e.target.value as 'FILLE' | 'GARCON' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="GARCON">👦 Garçon</option>
                <option value="FILLE">👧 Fille</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                value={newEnfant.dateNaissance}
                onChange={(e) => setNewEnfant({ ...newEnfant, dateNaissance: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAddEnfant}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              ✓ Ajouter
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des enfants */}
      {enfants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">Aucun enfant ajouté pour le moment</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            + Ajouter votre premier enfant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enfants.map((enfant) => (
            <div
              key={enfant.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl">
                  {enfant.genre === 'FILLE' ? '👧' : '👦'}
                </div>
                <button
                  onClick={() => handleRemoveEnfant(enfant.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  🗑️
                </button>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{enfant.prenom}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium">NuméroH:</span>{' '}
                  <span className="text-green-600">{enfant.numeroH}</span>
                </p>
                {enfant.age && (
                  <p className="text-slate-600">
                    <span className="font-medium">Âge:</span> {enfant.age} ans
                  </p>
                )}
                {enfant.dateNaissance && (
                  <p className="text-slate-600">
                    <span className="font-medium">Né(e) le:</span>{' '}
                    {new Date(enfant.dateNaissance).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sections de publication */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">📸 Publications</h3>
        
        {/* Navigation des sections */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveSection('joie')}
            className={`flex-1 min-w-[200px] px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              activeSection === 'joie'
                ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                : 'border-gray-300 text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl block mb-1">😊</span>
            <span className="font-semibold text-sm block">Ma joie</span>
          </button>
          <button
            onClick={() => setActiveSection('energie')}
            className={`flex-1 min-w-[200px] px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              activeSection === 'energie'
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl block mb-1">⚡</span>
            <span className="font-semibold text-sm block">Mon Energie</span>
          </button>
          <button
            onClick={() => setActiveSection('objectifs')}
            className={`flex-1 min-w-[200px] px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              activeSection === 'objectifs'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl block mb-1">🎯</span>
            <span className="font-semibold text-sm block">Nos objectifs</span>
          </button>
        </div>

        {/* Contenu de la section active */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-semibold text-slate-800">
              {activeSection === 'joie' ? '😊 Ma joie' : activeSection === 'energie' ? '⚡ Mon Energie' : '🎯 Nos objectifs'}
            </h4>
            <div className="flex gap-3">
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2"
                onClick={() => setShowMediaUploader(true)}
              >
                📷 Publier un média
              </button>
            </div>
          </div>

          {/* Options de publication */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bouton pour publier un média (photo, vidéo, audio) */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6 hover:shadow-md transition-shadow">
              <h5 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                📷 Publier un média
              </h5>
              <p className="text-sm text-slate-600 mb-4">Publiez une photo, une vidéo ou un audio</p>
              <button
                onClick={() => setShowMediaUploader(true)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>📷</span>
                <span>Photo</span>
                <span>•</span>
                <span>🎥</span>
                <span>Vidéo</span>
                <span>•</span>
                <span>🎵</span>
                <span>Audio</span>
              </button>
            </div>

            {/* Formulaire de texte */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-6">
              <h5 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                📝 Publier un texte
              </h5>
              <p className="text-sm text-slate-600 mb-4">Écrivez et publiez un texte</p>
              <textarea
                value={newTextContent}
                onChange={(e) => setNewTextContent(e.target.value)}
                placeholder="Écrivez votre texte ici..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                rows={3}
              />
              <button
                onClick={handleAddText}
                disabled={!newTextContent.trim()}
                className={`w-full px-4 py-3 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                  newTextContent.trim()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>📝</span>
                <span>Publier le texte</span>
              </button>
            </div>
          </div>

          {/* Galerie de médias */}
          <div>
            {getMediaBySection(activeSection).length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <p className="text-slate-600 mb-4 text-lg">Aucun contenu publié dans cette section</p>
                <button 
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md"
                  onClick={() => setShowMediaUploader(true)}
                >
                  🚀 Commencer à publier
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getMediaBySection(activeSection).map(media => (
                  <div key={media.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    {media.type === 'photo' && media.url && (
                      <img src={media.url} alt={media.caption} className="w-full h-48 object-cover" />
                    )}
                    {media.type === 'video' && media.url && (
                      <video controls className="w-full h-48 bg-black">
                        <source src={media.url} type="video/mp4" />
                      </video>
                    )}
                    {media.type === 'audio' && media.url && (
                      <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-6xl">🎵</span>
                          <audio controls className="mt-4 w-full px-4">
                            <source src={media.url} type="audio/mpeg" />
                          </audio>
                        </div>
                      </div>
                    )}
                    {media.type === 'text' && (
                      <div className="w-full min-h-48 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
                        <p className="text-slate-700 text-center">{media.content}</p>
                      </div>
                    )}
                    <div className="p-4">
                      {media.caption && (
                        <p className="text-slate-700 mb-2">{media.caption}</p>
                      )}
                      <div className="text-xs text-slate-500 mb-3">
                        📅 {new Date(media.date).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      
                      {/* Réactions des membres */}
                      <MediaReactions
                        mediaId={media.id}
                        reactions={media.reactions || []}
                        onAddReaction={(type, content) => handleAddReaction(media.id, type, content)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour upload de médias */}
      {showMediaUploader && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowMediaUploader(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-2xl font-semibold text-slate-800">📷 Ajouter un média</h3>
              <button 
                className="text-slate-400 hover:text-slate-600 text-2xl"
                onClick={() => setShowMediaUploader(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MediaUploader 
                onClose={() => setShowMediaUploader(false)}
                onUpload={handleAddMedia}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}












