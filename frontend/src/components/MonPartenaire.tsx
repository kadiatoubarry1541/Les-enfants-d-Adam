import { useState } from 'react'
import { MediaUploader } from './MediaUploader'
import { MediaReactions } from './MediaReactions'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: string
}

interface PartnerNote {
  id: string
  partnerName: string
  annee: number
  note: number
}

interface MediaItem {
  id: string
  type: 'photo' | 'video' | 'audio'
  url: string
  caption?: string
  date: string
  reactions?: any[]
}

export function MonPartenaire({ userData }: { userData: UserData }) {
  const [activeSession, setActiveSession] = useState('avant')
  const [showMediaUploader, setShowMediaUploader] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [partnerNotes, setPartnerNotes] = useState<PartnerNote[]>([])
  const [showAddPartner, setShowAddPartner] = useState(false)
  const [newPartnerName, setNewPartnerName] = useState('')

  const isHomme = userData.genre === 'HOMME'
  const title = isHomme ? 'Mon Homme' : 'Mon Homme'

  const sessions = [
    { id: 'avant', title: 'Ma vie avant toi', icon: '👤', description: 'Mon parcours' },
    { id: 'ensemble', title: isHomme ? 'Nos vies ensemble' : 'Mon paradis dans tes mains', icon: '💕', description: 'Nos moments' },
    { id: 'objectif', title: 'Notre objectif pour demain', icon: '🎯', description: 'Nos projets' }
  ]

  const handleAddMedia = (mediaData: any) => {
    const newMedia: MediaItem = {
      id: Date.now().toString(),
      type: mediaData.type,
      url: mediaData.url,
      caption: mediaData.caption,
      date: new Date().toISOString(),
      reactions: []
    }
    setMediaItems(prev => [...prev, newMedia])
    setShowMediaUploader(false)
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

    setMediaItems(prev => 
      prev.map(media => 
        media.id === mediaId 
          ? { ...media, reactions: [...(media.reactions || []), newReaction] }
          : media
      )
    )
  }

  const handleAddPartner = () => {
    if (newPartnerName.trim()) {
      const newPartner: PartnerNote = {
        id: Date.now().toString(),
        partnerName: newPartnerName.trim(),
        annee: new Date().getFullYear(),
        note: 0
      }
      setPartnerNotes(prev => [...prev, newPartner])
      setNewPartnerName('')
      setShowAddPartner(false)
    }
  }

  const handleNoteChange = (id: string, note: number) => {
    setPartnerNotes(prev => 
      prev.map(p => p.id === id ? { ...p, note } : p)
    )
  }

  const handleYearChange = (id: string, annee: number) => {
    setPartnerNotes(prev => 
      prev.map(p => p.id === id ? { ...p, annee } : p)
    )
  }

  const handleRemovePartner = (id: string) => {
    setPartnerNotes(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{isHomme ? '🤵 Mon Homme' : '🤵 Mon Homme'}</h2>
        <p className="text-slate-600">Partagez vos moments et recevez les notes de votre partenaire</p>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {sessions.map(session => (
            <button
              key={session.id}
              className={`flex-1 min-w-[200px] px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                activeSession === session.id
                  ? 'border-pink-600 bg-pink-50 text-pink-700'
                  : 'border-gray-300 text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveSession(session.id)}
            >
              <span className="text-2xl block mb-1">{session.icon}</span>
              <span className="font-semibold text-sm block">{session.title}</span>
            </button>
          ))}
        </div>

        {/* Contenu de la session active */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">
              {sessions.find(s => s.id === activeSession)?.title}
            </h3>
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              onClick={() => setShowMediaUploader(true)}
            >
              📷 Ajouter média
            </button>
          </div>

          {/* Galerie de médias */}
          <div>
            {mediaItems.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <p className="text-slate-600 mb-4 text-lg">Aucun média partagé dans cette session</p>
                <button 
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md"
                  onClick={() => setShowMediaUploader(true)}
                >
                  🚀 Commencer à partager
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems.map(media => (
                  <div key={media.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    {media.type === 'photo' && (
                      <img src={media.url} alt={media.caption} className="w-full h-48 object-cover" />
                    )}
                    {media.type === 'video' && (
                      <video controls className="w-full h-48 bg-black">
                        <source src={media.url} type="video/mp4" />
                      </video>
                    )}
                    {media.type === 'audio' && (
                      <div className="w-full h-48 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-6xl">🎵</span>
                          <audio controls className="mt-4 w-full px-4">
                            <source src={media.url} type="audio/mpeg" />
                          </audio>
                        </div>
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

      {/* Tableau de notes du partenaire */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-slate-800">
            ⭐ Notes de {isHomme ? 'mon homme' : 'mon homme'}
          </h3>
          {isHomme && partnerNotes.length < 5 && (
            <button 
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors duration-200"
              onClick={() => setShowAddPartner(true)}
            >
              + Ajouter un homme
            </button>
          )}
        </div>

        {/* Formulaire d'ajout de partenaire */}
        {showAddPartner && (
          <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Ajouter un homme</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                placeholder="Entrez le nom complet"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                onClick={handleAddPartner}
              >
                ✓ Ajouter
              </button>
              <button 
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                onClick={() => {
                  setShowAddPartner(false)
                  setNewPartnerName('')
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {partnerNotes.length === 0 && !isHomme ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg">
              <p className="text-slate-600">Notes de votre homme</p>
            </div>
          ) : partnerNotes.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg">
              <p className="text-slate-600 mb-3">Aucun homme ajouté</p>
              <button 
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors duration-200"
                onClick={() => setShowAddPartner(true)}
              >
                Ajouter votre premier homme
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    {isHomme ? 'Homme' : 'Mon Homme'}
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Année</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Note</th>
                  {isHomme && <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {partnerNotes.map(note => (
                  <tr key={note.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-4">
                      <span className="font-medium text-slate-800 flex items-center gap-2">
                        <span className="text-2xl">{isHomme ? '👩' : '👨'}</span>
                        {note.partnerName}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        value={note.annee}
                        onChange={(e) => handleYearChange(note.id, parseInt(e.target.value))}
                        className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        min="2020"
                        max="2030"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            className={`text-2xl transition-transform duration-150 hover:scale-125 ${
                              note.note >= star ? 'opacity-100' : 'opacity-30'
                            }`}
                            onClick={() => handleNoteChange(note.id, star)}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </td>
                    {isHomme && (
                      <td className="px-4 py-4">
                        <button 
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                          onClick={() => handleRemovePartner(note.id)}
                        >
                          🗑️ Supprimer
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {partnerNotes.length > 0 && (
          <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
            <p className="text-slate-700">
              <strong className="text-pink-700">Note moyenne:</strong> {
                (partnerNotes.reduce((sum, note) => sum + note.note, 0) / partnerNotes.length).toFixed(1)
              }/5 ⭐
            </p>
          </div>
        )}
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
