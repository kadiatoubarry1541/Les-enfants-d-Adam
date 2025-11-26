import { useState, useEffect } from 'react'

interface CommunityMember {
  id: string
  prenom: string
  nomFamille: string
  numeroH: string
  activites: string[]
  photo?: string
  joinedDate: string
  lastSeen: string
  isOnline: boolean
}

interface CommunityPost {
  id: string
  author: CommunityMember
  content: string
  type: 'text' | 'image' | 'video' | 'poll'
  createdAt: string
  likes: number
  comments: number
  isLiked: boolean
  mediaUrl?: string
}

interface ActivityCommunityProps {
  activityName: string
}

export function ActivityCommunity({ activityName }: ActivityCommunityProps) {
  const [activeTab, setActiveTab] = useState('posts')
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [newPost, setNewPost] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des données de la communauté
    const mockMembers: CommunityMember[] = [
      {
        id: '1',
        prenom: 'Mamadou',
        nomFamille: 'Diallo',
        numeroH: 'G1C1P1R1E1F1 1',
        activites: ['Agriculteur/Agricultrice'],
        joinedDate: '2024-01-15',
        lastSeen: '2024-01-20T14:30:00Z',
        isOnline: true
      },
      {
        id: '2',
        prenom: 'Fatoumata',
        nomFamille: 'Barry',
        numeroH: 'G1C1P1R1E1F1 2',
        activites: ['Agriculteur/Agricultrice'],
        joinedDate: '2024-01-10',
        lastSeen: '2024-01-20T12:15:00Z',
        isOnline: false
      },
      {
        id: '3',
        prenom: 'Ibrahima',
        nomFamille: 'Sow',
        numeroH: 'G1C1P1R1E1F1 3',
        activites: ['Agriculteur/Agricultrice'],
        joinedDate: '2024-01-08',
        lastSeen: '2024-01-19T16:45:00Z',
        isOnline: true
      }
    ]

    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        author: mockMembers[0],
        content: 'Bonjour à tous ! J\'ai une excellente récolte cette année. Qui d\'autre a eu de bons résultats ?',
        type: 'text',
        createdAt: '2024-01-20T14:30:00Z',
        likes: 12,
        comments: 5,
        isLiked: false
      },
      {
        id: '2',
        author: mockMembers[1],
        content: 'Conseils pour la culture du riz en saison sèche ?',
        type: 'text',
        createdAt: '2024-01-20T12:15:00Z',
        likes: 8,
        comments: 3,
        isLiked: true
      },
      {
        id: '3',
        author: mockMembers[2],
        content: 'Photo de ma plantation de bananes',
        type: 'image',
        createdAt: '2024-01-19T16:45:00Z',
        likes: 15,
        comments: 7,
        isLiked: false,
        mediaUrl: '/api/placeholder/400/300'
      }
    ]

    setTimeout(() => {
      setMembers(mockMembers)
      setPosts(mockPosts)
      setIsLoading(false)
    }, 1000)
  }, [activityName])

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const newPostData: CommunityPost = {
      id: Date.now().toString(),
      author: members[0], // Utilisateur actuel
      content: newPost,
      type: 'text',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false
    }

    setPosts(prev => [newPostData, ...prev])
    setNewPost('')
  }

  const tabs = [
    { id: 'posts', label: 'Publications', icon: '📝' },
    { id: 'members', label: 'Membres', icon: '👥' },
    { id: 'events', label: 'Événements', icon: '📅' },
    { id: 'resources', label: 'Ressources', icon: '📚' }
  ]

  if (isLoading) {
    return (
      <div className="community-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de la communauté...</p>
      </div>
    )
  }

  return (
    <div className="activity-community">
      <div className="community-header">
        <div className="community-info">
          <h2>🌾 {activityName}</h2>
          <p className="community-description">
            Communauté des {activityName.toLowerCase()} de Guinée. Partagez vos expériences, conseils et défis professionnels.
          </p>
          <div className="community-stats">
            <span className="members-count">👥 {members.length} membres</span>
            <span className="posts-count">📝 {posts.length} publications</span>
            <span className="online-count">🟢 {members.filter(m => m.isOnline).length} en ligne</span>
          </div>
        </div>
        <div className="community-actions">
          <button className="join-btn">Rejoindre</button>
          <button className="share-btn">Partager</button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="community-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="community-content">
        {activeTab === 'posts' && (
          <div className="posts-tab">
            {/* Créer une nouvelle publication */}
            <div className="create-post">
              <textarea
                placeholder="Partagez quelque chose avec la communauté..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="post-textarea"
              />
              <div className="post-actions">
                <button className="attach-btn">📎</button>
                <button className="photo-btn">📷</button>
                <button className="video-btn">🎥</button>
                <button 
                  className="publish-btn"
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                >
                  Publier
                </button>
              </div>
            </div>

            {/* Liste des publications */}
            <div className="posts-list">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="author-info">
                      <div className="author-avatar">
                        {post.author.prenom.charAt(0)}
                      </div>
                      <div className="author-details">
                        <h4>{post.author.prenom} {post.author.nomFamille}</h4>
                        <p className="author-numero">NumeroH: {post.author.numeroH}</p>
                        <p className="post-date">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="post-content">
                    <p>{post.content}</p>
                    {post.type === 'image' && post.mediaUrl && (
                      <img src={post.mediaUrl} alt="Post content" className="post-image" />
                    )}
                  </div>
                  
                  <div className="post-actions">
                    <button 
                      className={`like-btn ${post.isLiked ? 'liked' : ''}`}
                      onClick={() => handleLikePost(post.id)}
                    >
                      👍 {post.likes}
                    </button>
                    <button className="comment-btn">
                      💬 {post.comments}
                    </button>
                    <button className="share-btn">
                      🔗 Partager
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-tab">
            <h3>👥 Membres de la Communauté</h3>
            <div className="members-grid">
              {members.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">
                    {member.prenom.charAt(0)}
                  </div>
                  <div className="member-info">
                    <h4>{member.prenom} {member.nomFamille}</h4>
                    <p className="member-numero">NumeroH: {member.numeroH}</p>
                    <p className="member-activities">
                      {member.activites.join(', ')}
                    </p>
                    <div className="member-status">
                      <span className={`status-indicator ${member.isOnline ? 'online' : 'offline'}`}>
                        {member.isOnline ? '🟢 En ligne' : '⚫ Hors ligne'}
                      </span>
                      <span className="last-seen">
                        Dernière activité: {new Date(member.lastSeen).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button className="contact-btn">Contacter</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-tab">
            <h3>📅 Événements de la Communauté</h3>
            <div className="events-list">
              <div className="event-card">
                <div className="event-date">
                  <span className="day">25</span>
                  <span className="month">Jan</span>
                </div>
                <div className="event-info">
                  <h4>Formation sur les techniques agricoles modernes</h4>
                  <p>📍 Conakry, Guinée</p>
                  <p>⏰ 09:00 - 17:00</p>
                  <p>👥 15 participants</p>
                </div>
                <button className="join-event-btn">Participer</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-tab">
            <h3>📚 Ressources et Documents</h3>
            <div className="resources-grid">
              <div className="resource-card">
                <div className="resource-icon">📄</div>
                <h4>Guide de l'agriculture en Guinée</h4>
                <p>Document PDF - 2.5 MB</p>
                <button className="download-btn">Télécharger</button>
              </div>
              <div className="resource-card">
                <div className="resource-icon">🎥</div>
                <h4>Techniques de plantation</h4>
                <p>Vidéo - 15 min</p>
                <button className="watch-btn">Regarder</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}















