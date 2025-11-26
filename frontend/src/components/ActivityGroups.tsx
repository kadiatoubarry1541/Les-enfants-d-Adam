import { useState, useEffect } from 'react'
import { CATEGORIES_ACTIVITES } from '../utils/activities'

interface ActivityGroup {
  id: string
  name: string
  category: string
  members: number
  description: string
  icon: string
  lastActivity: string
  isJoined: boolean
}

interface ActivityGroupsProps {
  userData: any
}

export function ActivityGroups({ userData }: ActivityGroupsProps) {
  const [activeTab, setActiveTab] = useState('my-groups')
  const [groups, setGroups] = useState<ActivityGroup[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // Récupérer les activités de l'utilisateur
  const userActivities = [
    userData.activite1,
    userData.activite2,
    userData.activite3
  ].filter(Boolean)

  useEffect(() => {
    // Simuler des organisations d'activités
    const mockGroups: ActivityGroup[] = [
      {
        id: '1',
        name: 'Agriculteurs de Guinée',
        category: 'Agriculture et élevage',
        members: 1247,
        description: 'Communauté des agriculteurs et agricultrices de Guinée. Partagez vos expériences, conseils et défis.',
        icon: '🌾',
        lastActivity: '2024-01-20T14:30:00Z',
        isJoined: userActivities.includes('Agriculteur/Agricultrice')
      },
      {
        id: '2',
        name: 'Enseignants Unis',
        category: 'Éducation',
        members: 892,
        description: 'Espace de partage pour tous les enseignants et professeurs. Ressources pédagogiques et discussions.',
        icon: '🎓',
        lastActivity: '2024-01-20T12:15:00Z',
        isJoined: userActivities.includes('Enseignant/Enseignante') || userActivities.includes('Professeur')
      },
      {
        id: '3',
        name: 'Professionnels de la Santé',
        category: 'Santé',
        members: 456,
        description: 'Communauté des médecins, infirmiers et professionnels de la santé.',
        icon: '🏥',
        lastActivity: '2024-01-20T10:45:00Z',
        isJoined: userActivities.some(activity => 
          ['Médecin', 'Infirmier/Infirmière', 'Pharmacien/Pharmacienne', 'Dentiste'].includes(activity)
        )
      },
      {
        id: '4',
        name: 'Artisans Créatifs',
        category: 'Artisanat et métiers',
        members: 678,
        description: 'Espace pour tous les artisans et métiers manuels. Partagez vos créations et techniques.',
        icon: '🔨',
        lastActivity: '2024-01-19T16:20:00Z',
        isJoined: userActivities.some(activity => 
          ['Artisan/Artisane', 'Mécanicien/Mécanicienne', 'Électricien/Électricienne'].includes(activity)
        )
      },
      {
        id: '5',
        name: 'Commerçants Entrepreneurs',
        category: 'Commerce et services',
        members: 934,
        description: 'Réseau des commerçants et entrepreneurs. Conseils business et opportunités.',
        icon: '🛒',
        lastActivity: '2024-01-19T14:10:00Z',
        isJoined: userActivities.some(activity => 
          ['Commerçant/Commerçante', 'Entrepreneur/Entrepreneuse'].includes(activity)
        )
      },
      {
        id: '6',
        name: 'Techniciens et Ingénieurs',
        category: 'Ingénierie et technique',
        members: 345,
        description: 'Communauté des ingénieurs, techniciens et professionnels techniques.',
        icon: '⚙️',
        lastActivity: '2024-01-19T11:30:00Z',
        isJoined: userActivities.some(activity => 
          ['Ingénieur', 'Technicien/Technicienne', 'Informaticien/Informaticienne'].includes(activity)
        )
      }
    ]

    setGroups(mockGroups)
  }, [userActivities])

  // Filtrer les organisations
  const filteredGroups = groups.filter(group => {
    const matchesCategory = !selectedCategory || group.category === selectedCategory
    const matchesSearch = !searchTerm || 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  // Grouper par catégorie
  const groupsByCategory = filteredGroups.reduce((acc, group) => {
    if (!acc[group.category]) {
      acc[group.category] = []
    }
    acc[group.category].push(group)
    return acc
  }, {} as Record<string, ActivityGroup[]>)

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: true, members: group.members + 1 }
        : group
    ))
  }

  const handleLeaveGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: false, members: Math.max(0, group.members - 1) }
        : group
    ))
  }

  const tabs = [
    { id: 'my-groups', label: 'Mes Groupes', icon: '👥' },
    { id: 'all-groups', label: 'Tous les Groupes', icon: '🌐' },
    { id: 'recommended', label: 'Recommandés', icon: '⭐' }
  ]

  const categories = Object.keys(CATEGORIES_ACTIVITES)

  return (
    <div className="activity-groups-page">
      <div className="groups-header">
        <h3>🏢 Communautés Professionnelles</h3>
        <p className="user-activities">
          Vos activités : {userActivities.join(', ') || 'Aucune activité sélectionnée'}
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="groups-tabs">
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

      {/* Filtres */}
      <div className="groups-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher un organisation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filters">
          <button
            className={`category-filter ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            Toutes les catégories
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="groups-content">
        {activeTab === 'my-groups' && (
          <div className="my-groups-tab">
            <h4>👥 Mes Communautés</h4>
            {groups.filter(group => group.isJoined).length > 0 ? (
              <div className="groups-grid">
                {groups.filter(group => group.isJoined).map(group => (
                  <div key={group.id} className="group-card joined">
                    <div className="group-header">
                      <div className="group-icon">{group.icon}</div>
                      <div className="group-info">
                        <h5>{group.name}</h5>
                        <p className="group-category">{group.category}</p>
                      </div>
                      <button 
                        className="leave-btn"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        Quitter
                      </button>
                    </div>
                    <p className="group-description">{group.description}</p>
                    <div className="group-stats">
                      <span className="members-count">👥 {group.members} membres</span>
                      <span className="last-activity">
                        Dernière activité : {new Date(group.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-groups">
                <p>Vous n'êtes membre d'aucun organisation professionnel.</p>
                <p>Rejoignez des communautés liées à vos activités !</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'all-groups' && (
          <div className="all-groups-tab">
            <h4>🌐 Toutes les Communautés</h4>
            {Object.keys(groupsByCategory).length > 0 ? (
              Object.entries(groupsByCategory).map(([category, categoryGroups]) => (
                <div key={category} className="category-section">
                  <h5 className="category-title">{category}</h5>
                  <div className="groups-grid">
                    {categoryGroups.map(group => (
                      <div key={group.id} className={`group-card ${group.isJoined ? 'joined' : ''}`}>
                        <div className="group-header">
                          <div className="group-icon">{group.icon}</div>
                          <div className="group-info">
                            <h5>{group.name}</h5>
                            <p className="group-category">{group.category}</p>
                          </div>
                          {group.isJoined ? (
                            <button 
                              className="leave-btn"
                              onClick={() => handleLeaveGroup(group.id)}
                            >
                              Quitter
                            </button>
                          ) : (
                            <button 
                              className="join-btn"
                              onClick={() => handleJoinGroup(group.id)}
                            >
                              Rejoindre
                            </button>
                          )}
                        </div>
                        <p className="group-description">{group.description}</p>
                        <div className="group-stats">
                          <span className="members-count">👥 {group.members} membres</span>
                          <span className="last-activity">
                            Dernière activité : {new Date(group.lastActivity).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>Aucun organisation trouvé pour cette recherche.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommended' && (
          <div className="recommended-tab">
            <h4>⭐ Groupes Recommandés</h4>
            <div className="groups-grid">
              {groups
                .filter(group => !group.isJoined && userActivities.some(activity => 
                  group.name.toLowerCase().includes(activity.toLowerCase().split('/')[0])
                ))
                .map(group => (
                  <div key={group.id} className="group-card recommended">
                    <div className="group-header">
                      <div className="group-icon">{group.icon}</div>
                      <div className="group-info">
                        <h5>{group.name}</h5>
                        <p className="group-category">{group.category}</p>
                        <span className="recommended-badge">⭐ Recommandé</span>
                      </div>
                      <button 
                        className="join-btn"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Rejoindre
                      </button>
                    </div>
                    <p className="group-description">{group.description}</p>
                    <div className="group-stats">
                      <span className="members-count">👥 {group.members} membres</span>
                      <span className="last-activity">
                        Dernière activité : {new Date(group.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}















