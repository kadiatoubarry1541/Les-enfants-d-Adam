import { useState, useEffect, useRef, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002'

interface GalleryItem {
  id: string
  url: string
  type: 'image' | 'video'
  album: string
  uploaderName: string
  uploaderNumeroH: string
  created_at: string
}

const ALBUM_LABELS: Record<string, { label: string; emoji: string }> = {
  rencontre: { label: 'Rencontre', emoji: '💑' },
  bapteme: { label: 'Baptême', emoji: '👶' },
  mariage: { label: 'Mariage', emoji: '💍' },
  deces: { label: 'Deuil', emoji: '🕊️' },
}

interface Message {
  id: string
  sender: string
  senderName: string
  content: string
  type: 'text' | 'image' | 'video' | 'audio'
  timestamp: Date
  fileUrl?: string
  isRead: boolean
}

interface User {
  numeroH: string
  prenom: string
  nomFamille: string
  photo?: string
  isOnline: boolean
  lastSeen?: Date
}

interface CommunicationHubProps {
  userData: any
  showGroups?: boolean
  showBroadcast?: boolean
  showGallery?: boolean
}

export function CommunicationHub({ userData, showGroups = true, showBroadcast = true, showGallery = true }: CommunicationHubProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'groups' | 'broadcast' | 'galerie'>('messages')
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryFilter, setGalleryFilter] = useState<string>('all')
  const [galleryLightbox, setGalleryLightbox] = useState<GalleryItem | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  // const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadUsers()
    if (selectedUser) {
      loadMessages(selectedUser.numeroH)
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadUsers = async () => {
    // Simuler le chargement des utilisateurs
    const mockUsers: User[] = [
      {
        numeroH: 'G1C1P2R1E1F1 1',
        prenom: 'Fatoumata',
        nomFamille: 'Diallo',
        isOnline: true,
        lastSeen: new Date()
      },
      {
        numeroH: 'G1C1P2R1E2F2 1',
        prenom: 'Moussa',
        nomFamille: 'Barry',
        isOnline: false,
        lastSeen: new Date(Date.now() - 3600000) // Il y a 1 heure
      },
      {
        numeroH: 'G1C1P2R1E3F3 1',
        prenom: 'Aminata',
        nomFamille: 'Sow',
        isOnline: true,
        lastSeen: new Date()
      }
    ]
    setUsers(mockUsers)
  }

  const loadMessages = async (numeroH: string) => {
    // Simuler le chargement des messages
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: numeroH,
        senderName: 'Fatoumata Diallo',
        content: 'Bonjour, comment allez-vous ?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true
      },
      {
        id: '2',
        sender: userData.numeroH,
        senderName: userData.prenom + ' ' + userData.nomFamille,
        content: 'Très bien merci, et vous ?',
        type: 'text',
        timestamp: new Date(Date.now() - 3500000),
        isRead: true
      }
    ]
    setMessages(mockMessages)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadGallery = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setGalleryLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/family/shared-gallery`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setGalleryItems(data.items || [])
      }
    } finally {
      setGalleryLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'galerie') loadGallery()
  }, [activeTab, loadGallery])

  const sendGalleryPhotoToChat = (item: GalleryItem) => {
    if (!selectedUser) return
    const message: Message = {
      id: Date.now().toString(),
      sender: userData.numeroH,
      senderName: userData.prenom + ' ' + userData.nomFamille,
      content: `Photo de la galerie (${ALBUM_LABELS[item.album]?.label || item.album})`,
      type: item.type === 'video' ? 'video' : 'image',
      timestamp: new Date(),
      fileUrl: item.url,
      isRead: false,
    }
    setMessages(prev => [...prev, message])
    setActiveTab('messages')
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return

    const message: Message = {
      id: Date.now().toString(),
      sender: userData.numeroH,
      senderName: userData.prenom + ' ' + userData.nomFamille,
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      isRead: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedUser) return

    const fileType = file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 'audio'

    const message: Message = {
      id: Date.now().toString(),
      sender: userData.numeroH,
      senderName: userData.prenom + ' ' + userData.nomFamille,
      content: `Fichier ${fileType}: ${file.name}`,
      type: fileType as any,
      timestamp: new Date(),
      fileUrl: URL.createObjectURL(file),
      isRead: false
    }

    setMessages(prev => [...prev, message])
  }

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const message: Message = {
          id: Date.now().toString(),
          sender: userData.numeroH,
          senderName: userData.prenom + ' ' + userData.nomFamille,
          content: 'Message vocal',
          type: 'audio',
          timestamp: new Date(),
          fileUrl: audioUrl,
          isRead: false
        }

        setMessages(prev => [...prev, message])
        // setAudioChunks([])
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement audio:', error)
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getOnlineStatus = (user: User) => {
    if (user.isOnline) return 'En ligne'
    if (user.lastSeen) {
      const diff = Date.now() - user.lastSeen.getTime()
      const minutes = Math.floor(diff / 60000)
      if (minutes < 60) return `Il y a ${minutes} min`
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `Il y a ${hours}h`
      return `Il y a ${Math.floor(hours / 24)}j`
    }
    return 'Hors ligne'
  }

  return (
    <div className="communication-hub">
      <div className="hub-header">
        <h3>Centre de Communication</h3>
        <div className="hub-tabs">
          <button 
            className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          {showGroups && (
            <button 
              className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              Groupes
            </button>
          )}
          {showBroadcast && (
            <button
              className={`tab ${activeTab === 'broadcast' ? 'active' : ''}`}
              onClick={() => setActiveTab('broadcast')}
            >
              Diffusion
            </button>
          )}
          {showGallery && (
            <button
              className={`tab ${activeTab === 'galerie' ? 'active' : ''}`}
              onClick={() => setActiveTab('galerie')}
              style={{ position: 'relative' }}
            >
              📸 Galerie
              {galleryItems.length > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: 'linear-gradient(135deg, #6366f1, #9333ea)',
                  color: 'white', borderRadius: '50%', width: '16px', height: '16px',
                  fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700'
                }}>
                  {galleryItems.length > 99 ? '99+' : galleryItems.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="hub-content">
        {activeTab === 'messages' && (
          <div className="messages-container">
            <div className="users-sidebar">
              <h4>Utilisateurs</h4>
              <div className="users-list">
                {users.map(user => (
                  <div 
                    key={user.numeroH}
                    className={`user-item ${selectedUser?.numeroH === user.numeroH ? 'selected' : ''}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="user-avatar">
                      {user.photo ? (
                        <img src={user.photo} alt="Avatar" />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.prenom.charAt(0)}
                        </div>
                      )}
                      <div className={`online-indicator ${user.isOnline ? 'online' : 'offline'}`}></div>
                    </div>
                    <div className="user-info">
                      <h5>{user.prenom} {user.nomFamille}</h5>
                      <p className="user-status">{getOnlineStatus(user)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chat-area">
              {selectedUser ? (
                <>
                  <div className="chat-header">
                    <div className="chat-user-info">
                      <div className="user-avatar">
                        {selectedUser.photo ? (
                          <img src={selectedUser.photo} alt="Avatar" />
                        ) : (
                          <div className="avatar-placeholder">
                            {selectedUser.prenom.charAt(0)}
                          </div>
                        )}
                        <div className={`online-indicator ${selectedUser.isOnline ? 'online' : 'offline'}`}></div>
                      </div>
                      <div>
                        <h4>{selectedUser.prenom} {selectedUser.nomFamille}</h4>
                        <p>{getOnlineStatus(selectedUser)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="messages-list">
                    {messages.map(message => (
                      <div 
                        key={message.id}
                        className={`message ${message.sender === userData.numeroH ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          {message.type === 'text' && (
                            <p>{message.content}</p>
                          )}
                          {message.type === 'image' && message.fileUrl && (
                            <img src={message.fileUrl} alt="Image" className="message-image" />
                          )}
                          {message.type === 'video' && message.fileUrl && (
                            <video src={message.fileUrl} controls className="message-video" />
                          )}
                          {message.type === 'audio' && message.fileUrl && (
                            <audio src={message.fileUrl} controls className="message-audio" />
                          )}
                        </div>
                        <div className="message-meta">
                          <span className="message-time">{formatTime(message.timestamp)}</span>
                          {message.sender !== userData.numeroH && (
                            <span className="message-sender">{message.senderName}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="message-input">
                    <div className="input-actions">
                      <label className="file-upload-btn">
                        📷
                        <input 
                          type="file" 
                          accept="image/*,video/*,audio/*" 
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <button 
                        className={`audio-btn ${isRecording ? 'recording' : ''}`}
                        onMouseDown={startAudioRecording}
                        onMouseUp={stopAudioRecording}
                        onMouseLeave={stopAudioRecording}
                      >
                        🎤
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                      className="send-btn"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                    >
                      Envoyer
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-chat-selected">
                  <p>Sélectionnez un utilisateur pour commencer à discuter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {showGroups && activeTab === 'groups' && (
          <div className="groups-container">
            <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Groupes de Communication</h3>
            <div className="groups-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', padding: '20px' }}>
              
              {/* Organisation ENFANTS */}
              <div className="group-card" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                borderRadius: '20px', 
                padding: '30px', 
                color: 'white',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="group-icon" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '15px' }}>👶</div>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '10px', fontWeight: '700' }}>ENFANTS</h2>
                <p style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '20px', opacity: '0.9' }}>
                  Espace dédié aux enfants (moins de 18 ans)<br/>
                  Enseignement des bonnes manières et éducation
                </p>
                <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>
                  <span className="group-members" style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px' }}>
                    👥 15 membres actifs
                  </span>
                </div>
                <button className="btn" style={{ width: '100%', background: 'white', color: '#667eea', fontWeight: '700', padding: '12px', fontSize: '1.1rem' }}>
                  Rejoindre le organisation
                </button>
              </div>

              {/* Organisation HOMMES */}
              <div className="group-card" style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                borderRadius: '20px', 
                padding: '30px', 
                color: 'white',
                boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="group-icon" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '15px' }}>👨</div>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '10px', fontWeight: '700' }}>HOMMES</h2>
                <p style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '20px', opacity: '0.9' }}>
                  Espace réservé aux hommes<br/>
                  Éducation, conseils et discussions
                </p>
                <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>
                  <span className="group-members" style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px' }}>
                    👥 30 membres actifs
                  </span>
                </div>
                <button className="btn" style={{ width: '100%', background: 'white', color: '#4facfe', fontWeight: '700', padding: '12px', fontSize: '1.1rem' }}>
                  Rejoindre le organisation
                </button>
              </div>

              {/* Organisation FEMMES */}
              <div className="group-card" style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                borderRadius: '20px', 
                padding: '30px', 
                color: 'white',
                boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="group-icon" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '15px' }}>👩</div>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '10px', fontWeight: '700' }}>FEMMES</h2>
                <p style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '20px', opacity: '0.9' }}>
                  Espace réservé aux femmes<br/>
                  Éducation, conseils et discussions
                </p>
                <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>
                  <span className="group-members" style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px' }}>
                    👥 25 membres actifs
                  </span>
                </div>
                <button className="btn" style={{ width: '100%', background: 'white', color: '#f5576c', fontWeight: '700', padding: '12px', fontSize: '1.1rem' }}>
                  Rejoindre le organisation
                </button>
              </div>

            </div>
          </div>
        )}

        {showBroadcast && activeTab === 'broadcast' && (
          <div className="broadcast-container">
            <h4>Diffusion de Contenu</h4>
            <div className="broadcast-form">
              <textarea
                placeholder="Partagez quelque chose avec la communauté..."
                className="broadcast-textarea"
              ></textarea>
              <div className="broadcast-actions">
                <label className="file-upload-btn">
                  📷 Photos/Vidéos
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    style={{ display: 'none' }}
                  />
                </label>
                <button className="btn">Publier</button>
              </div>
            </div>
          </div>
        )}

        {showGallery && activeTab === 'galerie' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Header galerie */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
              padding: '16px',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ color: 'white', margin: 0, fontSize: '15px', fontWeight: '700' }}>
                  📸 Galerie Familiale
                </h4>
                <a
                  href="/galerie-famille"
                  style={{
                    fontSize: '11px', color: '#c7d2fe',
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '4px 10px', borderRadius: '12px',
                  }}
                >
                  Voir tout →
                </a>
              </div>
              {/* Filtres albums */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'Tous', emoji: '🖼️' },
                  { key: 'rencontre', label: 'Rencontre', emoji: '💑' },
                  { key: 'bapteme', label: 'Baptême', emoji: '👶' },
                  { key: 'mariage', label: 'Mariage', emoji: '💍' },
                  { key: 'deces', label: 'Deuil', emoji: '🕊️' },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setGalleryFilter(f.key)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: galleryFilter === f.key
                        ? 'linear-gradient(135deg, #6366f1, #9333ea)'
                        : 'rgba(255,255,255,0.15)',
                      color: 'white',
                      transition: 'all 0.2s',
                    }}
                  >
                    {f.emoji} {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu galerie */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: '#f9fafb' }}>
              {galleryLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
                  <p style={{ fontSize: '13px' }}>Chargement...</p>
                </div>
              ) : galleryItems.filter(i => galleryFilter === 'all' || i.album === galleryFilter).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📷</div>
                  <p style={{ fontSize: '13px' }}>Aucune photo dans cet album</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                }}>
                  {galleryItems
                    .filter(i => galleryFilter === 'all' || i.album === galleryFilter)
                    .map(item => {
                      const alb = ALBUM_LABELS[item.album]
                      return (
                        <div
                          key={item.id}
                          style={{
                            position: 'relative',
                            aspectRatio: '1',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: '#e5e7eb',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                          }}
                          onClick={() => setGalleryLightbox(item)}
                        >
                          {item.type === 'video' ? (
                            <video
                              src={item.url}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              muted
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={alb?.label || ''}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              loading="lazy"
                            />
                          )}
                          {/* Album emoji */}
                          <div style={{
                            position: 'absolute', top: '3px', left: '3px',
                            fontSize: '12px', lineHeight: 1,
                          }}>
                            {alb?.emoji}
                          </div>
                          {/* Send to chat overlay */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(99,102,241,0.0)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                          }}
                            className="gallery-hover-overlay"
                          />
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {/* Lightbox mini dans le chat */}
            {galleryLightbox && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 100,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '16px',
              }}
                onClick={() => setGalleryLightbox(null)}
              >
                <div
                  style={{ maxWidth: '100%', maxHeight: '70%', position: 'relative' }}
                  onClick={e => e.stopPropagation()}
                >
                  {galleryLightbox.type === 'video' ? (
                    <video
                      src={galleryLightbox.url}
                      controls autoPlay
                      style={{ maxWidth: '100%', maxHeight: '55vh', borderRadius: '12px' }}
                    />
                  ) : (
                    <img
                      src={galleryLightbox.url}
                      alt=""
                      style={{ maxWidth: '100%', maxHeight: '55vh', borderRadius: '12px', objectFit: 'contain' }}
                    />
                  )}
                </div>
                {/* Info + bouton envoyer */}
                <div style={{
                  marginTop: '12px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '8px',
                }}
                  onClick={e => e.stopPropagation()}
                >
                  <p style={{ color: 'white', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                    {ALBUM_LABELS[galleryLightbox.album]?.emoji} {ALBUM_LABELS[galleryLightbox.album]?.label} — {galleryLightbox.uploaderName}
                  </p>
                  {selectedUser && (
                    <button
                      onClick={() => {
                        sendGalleryPhotoToChat(galleryLightbox)
                        setGalleryLightbox(null)
                      }}
                      style={{
                        padding: '8px 20px',
                        background: 'linear-gradient(135deg, #6366f1, #9333ea)',
                        color: 'white', border: 'none',
                        borderRadius: '20px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: '700',
                        boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                      }}
                    >
                      Envoyer à {selectedUser.prenom}
                    </button>
                  )}
                  <button
                    onClick={() => setGalleryLightbox(null)}
                    style={{
                      color: 'rgba(255,255,255,0.6)', background: 'none',
                      border: 'none', cursor: 'pointer', fontSize: '12px',
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
