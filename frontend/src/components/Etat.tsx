import { useState, useEffect } from 'react'

interface EtatInfo {
  id: string
  type: 'civil' | 'professionnel' | 'social' | 'familial' | 'financier' | 'sante'
  title: string
  description: string
  status: 'excellent' | 'bon' | 'moyen' | 'difficile' | 'critique'
  date: string
  details?: string
  actions?: string[]
}

interface EtatStats {
  totalStates: number
  excellent: number
  bon: number
  moyen: number
  difficile: number
  critique: number
}

interface EtatProps {
  userData: any
}

export function Etat({ userData }: EtatProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [etatInfos, setEtatInfos] = useState<EtatInfo[]>([])
  const [stats, setStats] = useState<EtatStats | null>(null)
  const [showAddEtat, setShowAddEtat] = useState(false)

  useEffect(() => {
    // Simuler des données d'état pour la démo
    const mockEtatInfos: EtatInfo[] = [
      {
        id: '1',
        type: 'civil',
        title: 'État Civil',
        description: 'Situation civile actuelle',
        status: 'bon',
        date: '2024-01-20',
        details: 'Célibataire, sans enfants',
        actions: ['Mariage', 'Divorce', 'Naissance']
      },
      {
        id: '2',
        type: 'professionnel',
        title: 'Situation Professionnelle',
        description: 'État de l\'emploi et carrière',
        status: 'excellent',
        date: '2024-01-18',
        details: 'Employé stable, perspectives d\'évolution',
        actions: ['Promotion', 'Changement', 'Formation']
      },
      {
        id: '3',
        type: 'social',
        title: 'État Social',
        description: 'Relations sociales et communautaires',
        status: 'bon',
        date: '2024-01-15',
        details: 'Bien intégré dans la communauté',
        actions: ['Rejoindre organisation', 'Organiser événement']
      },
      {
        id: '4',
        type: 'familial',
        title: 'État Familial',
        description: 'Relations avec la famille',
        status: 'excellent',
        date: '2024-01-12',
        details: 'Relations harmonieuses avec parents et frères/sœurs',
        actions: ['Réunion familiale', 'Aide familiale']
      },
      {
        id: '5',
        type: 'financier',
        title: 'État Financier',
        description: 'Situation économique personnelle',
        status: 'moyen',
        date: '2024-01-10',
        details: 'Revenus stables mais épargne limitée',
        actions: ['Épargne', 'Investissement', 'Budget']
      },
      {
        id: '6',
        type: 'sante',
        title: 'État de Santé',
        description: 'Condition physique et mentale',
        status: 'bon',
        date: '2024-01-08',
        details: 'Santé générale bonne, exercice régulier',
        actions: ['Consultation', 'Sport', 'Régime']
      }
    ]

    const mockStats: EtatStats = {
      totalStates: mockEtatInfos.length,
      excellent: mockEtatInfos.filter(e => e.status === 'excellent').length,
      bon: mockEtatInfos.filter(e => e.status === 'bon').length,
      moyen: mockEtatInfos.filter(e => e.status === 'moyen').length,
      difficile: mockEtatInfos.filter(e => e.status === 'difficile').length,
      critique: mockEtatInfos.filter(e => e.status === 'critique').length
    }

    setEtatInfos(mockEtatInfos)
    setStats(mockStats)
  }, [])

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      civil: '📋',
      professionnel: '💼',
      social: '👥',
      familial: '👨‍👩‍👧‍👦',
      financier: '💰',
      sante: '🏥'
    }
    return icons[type] || '📊'
  }

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      civil: 'Civil',
      professionnel: 'Professionnel',
      social: 'Social',
      familial: 'Familial',
      financier: 'Financier',
      sante: 'Santé'
    }
    return labels[type] || type
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      excellent: '#4CAF50',
      bon: '#8BC34A',
      moyen: '#FF9800',
      difficile: '#FF5722',
      critique: '#F44336'
    }
    return colors[status] || '#9E9E9E'
  }

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      excellent: '🌟',
      bon: '✅',
      moyen: '⚠️',
      difficile: '❌',
      critique: '🚨'
    }
    return icons[status] || '❓'
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'details', label: 'Détails', icon: '📋' },
    { id: 'evolution', label: 'Évolution', icon: '📈' },
    { id: 'actions', label: 'Actions', icon: '🎯' }
  ]

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-purple-600 mb-2 text-3xl font-bold">📊 État de {userData.prenom} {userData.nomFamille}</h3>
        <p className="text-purple-400 text-lg">NumeroH: {userData.numeroH}</p>
      </div>

      {/* Statistiques d'état */}
      {stats && (
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl mb-2">📊</div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{stats.totalStates}</h4>
                <p className="text-gray-600">États suivis</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-md text-center border-l-4 border-green-500">
              <div className="text-2xl mb-2">🌟</div>
              <div>
                <h4 className="text-xl font-bold text-green-800">{stats.excellent}</h4>
                <p className="text-green-600">Excellent</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-md text-center border-l-4 border-blue-500">
              <div className="text-2xl mb-2">✅</div>
              <div>
                <h4 className="text-xl font-bold text-blue-800">{stats.bon}</h4>
                <p className="text-blue-600">Bon</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
              <div className="text-2xl mb-2">⚠️</div>
              <div>
                <h4 className="text-xl font-bold text-yellow-800">{stats.moyen}</h4>
                <p className="text-yellow-600">Moyen</p>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-md text-center border-l-4 border-red-500">
              <div className="text-2xl mb-2">❌</div>
              <div>
                <h4 className="text-xl font-bold text-red-800">{stats.difficile}</h4>
                <p className="text-red-600">Difficile</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="etat-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="tab-header">
              <h4>📊 Vue d'ensemble de votre état</h4>
              <button 
                className="btn-primary"
                onClick={() => setShowAddEtat(true)}
              >
                + Ajouter un état
              </button>
            </div>

            <div className="etat-summary">
              <div className="summary-card">
                <h5>🎯 Résumé Global</h5>
                <div className="summary-content">
                  <p>Votre état général est <strong>Bon</strong> avec quelques domaines à améliorer.</p>
                  <div className="summary-recommendations">
                    <h6>Recommandations :</h6>
                    <ul>
                      <li>Améliorer la situation financière</li>
                      <li>Maintenir les relations familiales</li>
                      <li>Continuer le développement professionnel</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="quick-overview">
                <h5>⚡ Aperçu Rapide</h5>
                <div className="quick-items">
                  {etatInfos.slice(0, 3).map(etat => (
                    <div key={etat.id} className="quick-item">
                      <div className="quick-icon">
                        {getTypeIcon(etat.type)}
                      </div>
                      <div className="quick-content">
                        <h6>{etat.title}</h6>
                        <div 
                          className="quick-status"
                          style={{ color: getStatusColor(etat.status) }}
                        >
                          {getStatusIcon(etat.status)} {etat.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="details-tab">
            <h4>📋 Détails de tous les états</h4>
            
            <div className="etat-list">
              {etatInfos.map(etat => (
                <div key={etat.id} className="etat-card">
                  <div className="etat-header">
                    <div className="etat-type">
                      <span className="type-icon">{getTypeIcon(etat.type)}</span>
                      <span className="type-label">{getTypeLabel(etat.type)}</span>
                    </div>
                    <div 
                      className="etat-status"
                      style={{ backgroundColor: getStatusColor(etat.status) }}
                    >
                      {getStatusIcon(etat.status)} {etat.status}
                    </div>
                  </div>
                  
                  <div className="etat-content">
                    <h5>{etat.title}</h5>
                    <p className="etat-description">{etat.description}</p>
                    {etat.details && (
                      <p className="etat-details"><strong>Détails:</strong> {etat.details}</p>
                    )}
                    <p className="etat-date">
                      <strong>Dernière mise à jour:</strong> {new Date(etat.date).toLocaleDateString()}
                    </p>
                  </div>

                  {etat.actions && etat.actions.length > 0 && (
                    <div className="etat-actions">
                      <h6>Actions possibles :</h6>
                      <div className="actions-list">
                        {etat.actions.map((action, index) => (
                          <button key={index} className="action-btn">
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="evolution-tab">
            <h4>📈 Évolution de votre état</h4>
            
            <div className="evolution-chart">
              <h5>Graphique d'évolution</h5>
              <div className="chart-container">
                <div className="chart-bars">
                  {etatInfos.map(etat => (
                    <div key={etat.id} className="chart-bar">
                      <div 
                        className="bar-fill"
                        style={{ 
                          height: `${etat.status === 'excellent' ? 100 : 
                                   etat.status === 'bon' ? 80 : 
                                   etat.status === 'moyen' ? 60 : 
                                   etat.status === 'difficile' ? 40 : 20}%`,
                          backgroundColor: getStatusColor(etat.status)
                        }}
                      ></div>
                      <span className="bar-label">{getTypeLabel(etat.type)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="evolution-timeline">
              <h5>Timeline des changements</h5>
              <div className="timeline">
                {etatInfos.map(etat => (
                  <div key={etat.id} className="timeline-item">
                    <div className="timeline-date">
                      {new Date(etat.date).toLocaleDateString()}
                    </div>
                    <div className="timeline-content">
                      <h6>{etat.title}</h6>
                      <p>État: <span style={{ color: getStatusColor(etat.status) }}>
                        {getStatusIcon(etat.status)} {etat.status}
                      </span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="actions-tab">
            <h4>🎯 Actions recommandées</h4>
            
            <div className="actions-grid">
              <div className="action-category">
                <h5>💼 Professionnel</h5>
                <div className="action-items">
                  <div className="action-item">
                    <h6>Développement de compétences</h6>
                    <p>Suivre une formation pour améliorer vos compétences</p>
                    <button className="btn-action">Commencer</button>
                  </div>
                  <div className="action-item">
                    <h6>Réseautage professionnel</h6>
                    <p>Élargir votre réseau professionnel</p>
                    <button className="btn-action">Rejoindre</button>
                  </div>
                </div>
              </div>

              <div className="action-category">
                <h5>💰 Financier</h5>
                <div className="action-items">
                  <div className="action-item">
                    <h6>Plan d'épargne</h6>
                    <p>Mettre en place un plan d'épargne mensuel</p>
                    <button className="btn-action">Créer</button>
                  </div>
                  <div className="action-item">
                    <h6>Investissement</h6>
                    <p>Explorer les options d'investissement</p>
                    <button className="btn-action">Découvrir</button>
                  </div>
                </div>
              </div>

              <div className="action-category">
                <h5>🏥 Santé</h5>
                <div className="action-items">
                  <div className="action-item">
                    <h6>Exercice régulier</h6>
                    <p>Maintenir une routine d'exercice</p>
                    <button className="btn-action">Planifier</button>
                  </div>
                  <div className="action-item">
                    <h6>Consultation médicale</h6>
                    <p>Prendre rendez-vous pour un check-up</p>
                    <button className="btn-action">Réserver</button>
                  </div>
                </div>
              </div>

              <div className="action-category">
                <h5>👥 Social</h5>
                <div className="action-items">
                  <div className="action-item">
                    <h6>Participation communautaire</h6>
                    <p>S'impliquer dans les activités communautaires</p>
                    <button className="btn-action">Participer</button>
                  </div>
                  <div className="action-item">
                    <h6>Relations familiales</h6>
                    <p>Renforcer les liens familiaux</p>
                    <button className="btn-action">Organiser</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal pour ajouter un état */}
      {showAddEtat && (
        <div className="modal-overlay" onClick={() => setShowAddEtat(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 Ajouter un nouvel état</h3>
              <button onClick={() => setShowAddEtat(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Fonctionnalité en développement...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}





































