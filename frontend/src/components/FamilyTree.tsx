import { useState, useEffect } from 'react'
import { FamilyTreeNode } from './FamilyTreeNode'

interface FamilyMember {
  id: string
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'Homme' | 'Femme' | 'Autre'
  dateNaissance: string
  dateDeces?: string
  photo?: string
  generation: string
  decet?: string
  isAlive: boolean
  children: FamilyMember[]
  parents: FamilyMember[]
  siblings: FamilyMember[]
  spouse?: FamilyMember
  logo?: string
}

interface FamilyTreeProps {
  userData: any
}

export function FamilyTree({ userData }: FamilyTreeProps) {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([])
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [treeView, setTreeView] = useState<'ancestors' | 'descendants' | 'full'>('full')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFamilyTree()
  }, [userData])

  const loadFamilyTree = async () => {
    try {
      setLoading(true)
      // Simuler le chargement des données familiales
      // Dans un vrai système, on ferait un appel API
      const mockFamilyData = generateMockFamilyData(userData)
      setFamilyData(mockFamilyData)
    } catch (error) {
      console.error('Erreur lors du chargement de l\'arbre généalogique:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockFamilyData = (user: any): FamilyMember[] => {
    // Générer des données de test pour l'arbre généalogique
    return [
      {
        id: '1',
        numeroH: user.numeroH,
        prenom: user.prenom,
        nomFamille: user.nomFamille,
        genre: user.genre,
        dateNaissance: user.dateNaissance,
        generation: user.generation,
        isAlive: true,
        children: [],
        parents: [],
        siblings: [],
        logo: user.logo
      }
    ]
  }

  const getLogoIcon = (logo?: string) => {
    const logos: Record<string, string> = {
      'roi-grand': '👑',
      'roi-moyen': '👑',
      'roi-petit': '👑',
      'savant': '📖',
      'prophete': '🌙',
      'riche': '🥇'
    }
    return logos[logo || ''] || '⭐'
  }

  // Fonction pour obtenir la couleur de génération (utilisée dans le CSS)
  // const getGenerationColor = (generation: string) => {
  //   const genNum = parseInt(generation.replace('G', ''))
  //   if (genNum <= 10) return '#8B4513' // Marron pour les anciennes générations
  //   if (genNum <= 50) return '#D2691E' // Orange pour les générations moyennes
  //   if (genNum <= 100) return '#228B22' // Vert pour les générations récentes
  //   return '#4169E1' // Bleu pour les générations très récentes
  // }

  if (loading) {
    return (
      <div className="family-tree-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de l'arbre généalogique...</p>
      </div>
    )
  }

  return (
    <div className="family-tree-container">
      <div className="family-tree-header">
        <h3>Arbre Généalogique des {userData.nomFamille}</h3>
        <div className="tree-controls">
          <button 
            className={`btn ${treeView === 'ancestors' ? 'active' : ''}`}
            onClick={() => setTreeView('ancestors')}
          >
            Ancêtres
          </button>
          <button 
            className={`btn ${treeView === 'descendants' ? 'active' : ''}`}
            onClick={() => setTreeView('descendants')}
          >
            Descendants
          </button>
          <button 
            className={`btn ${treeView === 'full' ? 'active' : ''}`}
            onClick={() => setTreeView('full')}
          >
            Complet
          </button>
        </div>
      </div>

      <div className="family-tree-content">
        <div className="tree-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#8B4513' }}></div>
            <span>Générations 1-10 (Anciennes)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#D2691E' }}></div>
            <span>Générations 11-50 (Moyennes)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#228B22' }}></div>
            <span>Générations 51-100 (Récentes)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4169E1' }}></div>
            <span>Générations 101+ (Très récentes)</span>
          </div>
        </div>

        <div className="tree-visualization">
          <svg className="family-tree-svg" viewBox="0 0 1200 800">
            {/* Lignes de connexion entre les membres */}
            <g className="tree-connections">
              {/* Les connexions seront générées dynamiquement */}
            </g>
            
            {/* Nœuds de l'arbre généalogique */}
            <g className="tree-nodes">
              {familyData.map((member, index) => (
                <FamilyTreeNode
                  key={member.id}
                  member={member}
                  position={{ x: 100 + (index * 200), y: 100 + (index * 150) }}
                  onSelect={(member) => setSelectedMember(member as FamilyMember)}
                  isSelected={selectedMember?.id === member.id}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Panneau de détails du membre sélectionné */}
      {selectedMember && (
        <div className="member-details-panel">
          <div className="panel-header">
            <h4>Détails du Membre</h4>
            <button 
              className="close-btn"
              onClick={() => setSelectedMember(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="member-info">
            <div className="member-photo">
              {selectedMember.photo ? (
                <img src={selectedMember.photo} alt="Photo" />
              ) : (
                <div className="photo-placeholder">
                  {selectedMember.prenom.charAt(0)}
                </div>
              )}
              {selectedMember.logo && (
                <div className="status-logo">
                  {getLogoIcon(selectedMember.logo)}
                </div>
              )}
            </div>
            
            <div className="member-details">
              <h5>{selectedMember.prenom} {selectedMember.nomFamille}</h5>
              <p><strong>NumeroH:</strong> {selectedMember.numeroH}</p>
              <p><strong>Génération:</strong> {selectedMember.generation}</p>
              {selectedMember.decet && (
                <p><strong>Décet:</strong> {selectedMember.decet}</p>
              )}
              <p><strong>Date de naissance:</strong> {selectedMember.dateNaissance}</p>
              {selectedMember.dateDeces && (
                <p><strong>Date de décès:</strong> {selectedMember.dateDeces}</p>
              )}
              <p><strong>Statut:</strong> {selectedMember.isAlive ? 'Vivant' : 'Décédé'}</p>
              <p><strong>Genre:</strong> {selectedMember.genre}</p>
            </div>
          </div>
          
          <div className="member-actions">
            <button className="btn">Voir la fiche complète</button>
            <button className="btn secondary">Ajouter un enfant</button>
            <button className="btn secondary">Modifier les informations</button>
          </div>
        </div>
      )}

      {/* Statistiques de l'arbre */}
      <div className="tree-statistics">
        <div className="stat-item">
          <span className="stat-number">{familyData.length}</span>
          <span className="stat-label">Membres enregistrés</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {familyData.filter(m => m.isAlive).length}
          </span>
          <span className="stat-label">Vivants</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {familyData.filter(m => !m.isAlive).length}
          </span>
          <span className="stat-label">Décédés</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {new Set(familyData.map(m => m.generation)).size}
          </span>
          <span className="stat-label">Générations</span>
        </div>
      </div>
    </div>
  )
}
