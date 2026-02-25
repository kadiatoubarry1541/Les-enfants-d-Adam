import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArbreGenealogique.css'
import { buildFamilyTree, getTreeCompletionRecommendations, FamilyMember as FamilyMemberType, CercleDesRacinesCounts } from '../services/FamilyTreeBuilder'
import { InvitationManager } from '../utils/invitationManager'
import { useI18n } from '../i18n/useI18n'
import { InvitationsReceived } from './InvitationsReceived'

interface FamilyMember {
  id: string
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  dateNaissance?: string
  dateDeces?: string
  photo?: string
  relation: 'pere' | 'mere' | 'enfant' | 'conjoint' | 'frere' | 'soeur' | 'oncle' | 'tante' | 'cousin' | 'cousine' | 'grand-pere' | 'grand-mere'
  generation: string
  isDeceased?: boolean
  parentId?: string
  children?: string[]
}

interface ArbreGenealogiqueProps {
  userData: any
  cercleCounts?: CercleDesRacinesCounts
}

export function ArbreGenealogique({ userData, cercleCounts }: ArbreGenealogiqueProps) {
  const { t } = useI18n()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [generationFilter, setGenerationFilter] = useState<string>('all')
  const [showStats, setShowStats] = useState(true)
  const [showLegend, setShowLegend] = useState(false)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [addMemberType, setAddMemberType] = useState<'vivant' | 'defunt' | null>(null)
  const [newMember, setNewMember] = useState({
    prenom: '',
    nomFamille: userData.nomFamille,
    numeroH: '',
    genre: 'HOMME' as 'HOMME' | 'FEMME' | 'AUTRE',
    relation: 'enfant' as 'pere' | 'mere' | 'enfant' | 'conjoint' | 'frere' | 'soeur',
    dateNaissance: '',
    dateDeces: '',
    isDeceased: false
  })

  const [recommendations, setRecommendations] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // Construire automatiquement l'arbre généalogique selon les conditions remplies
    const autoBuiltTree = buildFamilyTree(userData)
    setFamilyMembers(autoBuiltTree)
    
    // Obtenir les recommandations pour compléter l'arbre
    const recs = getTreeCompletionRecommendations(userData)
    setRecommendations(recs)
  }, [userData])

  const getGenerationMembers = (generation: string) => {
    if (generation === 'all') return familyMembers
    return familyMembers.filter(member => member.generation === generation)
  }

  const getRelationIcon = (relation: string) => {
    const icons: { [key: string]: string } = {
      pere: '👨',
      mere: '👩',
      enfant: '👶',
      conjoint: '💑',
      frere: '👦',
      soeur: '👧',
      oncle: '👨‍💼',
      tante: '👩‍💼',
      cousin: '👦‍🎓',
      cousine: '👧‍🎓',
      'grand-pere': '👴',
      'grand-mere': '👵'
    }
    return icons[relation] || '👤'
  }

  const handleAddMember = () => {
    if (!newMember.numeroH || !newMember.relation) {
      alert('Merci de renseigner le NuméroH et la relation.')
      return
    }

    // Si on ajoute un vivant, on envoie une invitation pour qu'il puisse accepter ou refuser
    if (addMemberType === 'vivant') {
      const fromName = `${userData.prenom ?? ''} ${userData.nomFamille ?? ''}`.trim() || userData.numeroH
      const toName = newMember.prenom || newMember.nomFamille || newMember.numeroH

      InvitationManager.sendInvitation({
        fromNumeroH: userData.numeroH,
        fromName,
        toNumeroH: newMember.numeroH.trim(),
        toName,
        relation: newMember.relation,
        message: undefined
      })

      alert(`Invitation envoyée au membre ${toName} (${newMember.numeroH}).\nIl pourra accepter ou refuser depuis sa page "Mes invitations".`)
    }

    // Réinitialiser le formulaire (on ne modifie pas directement l'arbre ici)
    setShowAddMemberForm(false)
    setAddMemberType(null)
    setNewMember({
      prenom: '',
      nomFamille: userData.nomFamille,
      numeroH: '',
      genre: 'HOMME',
      relation: 'enfant',
      dateNaissance: '',
      dateDeces: '',
      isDeceased: false
    })
  }

  const calculateGeneration = (relation: string): string => {
    const generationMap: { [key: string]: string } = {
      'grand-pere': 'G-1',
      'grand-mere': 'G-1',
      'pere': 'G0',
      'mere': 'G0',
      'enfant': 'G2',
      'frere': 'G1',
      'soeur': 'G1',
      'conjoint': 'G1',
      'oncle': 'G0',
      'tante': 'G0',
      'cousin': 'G1',
      'cousine': 'G1'
    }
    return generationMap[relation] || 'G1'
  }

  // Helper pour dessiner un nœud personne avec photo + nom complet + NumeroH
  const renderPersonNode = (
    person: Partial<FamilyMember> & { prenom?: string; nomFamille?: string; numeroH?: string; photo?: string; genre?: 'HOMME' | 'FEMME' | 'AUTRE' },
    x: number,
    y: number,
    w: number,
    h: number,
    opts?: { label?: string }
  ) => {
    const fullName = `${person.prenom ?? ''} ${person.nomFamille ?? ''}`.trim() || opts?.label || '—'
    const numero = person.numeroH || '—'
    const stroke = '#059669' // emerald-600
    const textDark = '#0f172a' // slate-900
    const textMuted = '#475569' // slate-600

    const photoX = x + 10
    const photoY = y + h / 2
    const textX = x + 60
    const titleY = y + 28
    const nameY = y + 50
    const numY = y + 66

    const femalePoints = `${x},${y} ${x + w - 20},${y} ${x + w},${y + h / 2} ${x + w - 20},${y + h} ${x},${y + h} ${x - 20},${y + h / 2}`

    return (
      <g>
        {person.genre === 'FEMME' ? (
          <polygon points={femalePoints} fill="white" stroke={stroke} strokeWidth={3} />
        ) : (
          <rect x={x} y={y} width={w} height={h} rx={10} fill="white" stroke={stroke} strokeWidth={3} />
        )}

        {/* Photo circulaire */}
        {person.photo ? (
          <>
            <defs>
              <clipPath id={`clip-${x}-${y}`}>
                <circle cx={photoX + 16} cy={photoY} r={16} />
              </clipPath>
            </defs>
            <image href={person.photo} x={photoX} y={photoY - 16} width={32} height={32} clipPath={`url(#clip-${x}-${y})`} preserveAspectRatio="xMidYMid slice" />
          </>
        ) : (
          <circle cx={photoX + 16} cy={photoY} r={16} fill="#10b981" opacity={0.2} />
        )}

        {/* Textes */}
        <text x={textX} y={titleY} fontSize={12} fontWeight="bold" fill={textDark}>{opts?.label || (person.genre === 'FEMME' ? 'Femme' : 'Homme')}</text>
        <text x={textX} y={nameY} fontSize={12} fill={textMuted}>{fullName}</text>
        <text x={textX} y={numY} fontSize={11} fill={stroke} fontWeight="bold">{numero}</text>
      </g>
    )
  }

  // Filtrer les membres visibles uniquement
  const visibleMembers = familyMembers.filter(m => m.isVisible !== false)
  const hiddenMembers = familyMembers.filter(m => m.isVisible === false)
  
  const filteredMembers = getGenerationMembers(generationFilter).filter(m => m.isVisible !== false)
  const generations = [...new Set(visibleMembers.map(m => m.generation))].sort()

  return (
    <div className="arbre-genealogique">
      <div className="arbre-header">
        <h3>🌳 Arbre Généalogique de {userData.prenom} {userData.nomFamille}</h3>

        {/* Indicateur de progression */}
        <div className="tree-progress" style={{
          marginBottom: '15px',
          padding: '12px',
          backgroundColor: '#E0F2FE',
          border: '1px solid #0284C7',
          borderRadius: '6px'
        }}>
          <strong style={{ color: '#0C4A6E' }}>
            📊 Progression de l'arbre : {visibleMembers.length} membre{visibleMembers.length > 1 ? 's' : ''} visible{visibleMembers.length > 1 ? 's' : ''}
            {hiddenMembers.length > 0 && ` | ${hiddenMembers.length} membre${hiddenMembers.length > 1 ? 's' : ''} en attente`}
          </strong>
        </div>
        
        <div className="arbre-controls">
          <div className="view-controls">
            <button 
              className="view-btn add-member-btn"
              onClick={() => {
                setShowAddMemberForm(!showAddMemberForm)
                setAddMemberType(null)
              }}
            >
              ➕ Ajouter un membre
            </button>
            <button
              className={`view-btn ${showStats ? 'active' : ''}`}
              onClick={() => setShowStats(!showStats)}
            >
              📊 Statistiques
            </button>
            <button
              className={`view-btn ${showLegend ? 'active' : ''}`}
              onClick={() => setShowLegend(!showLegend)}
            >
              📘 Légende
            </button>
          </div>

          <div className="filter-controls">
            <label>Génération:</label>
            <select 
              value={generationFilter} 
              onChange={(e) => setGenerationFilter(e.target.value)}
            >
              <option value="all">Toutes</option>
              {generations.map(gen => (
                <option key={gen} value={gen}>{gen}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout de membre */}
      {showAddMemberForm && (
        <div className="add-member-form">
          <h4>Ajouter un nouveau membre de la famille</h4>

          {/* Choix du type de membre à ajouter */}
          <div className="form-grid">
            <div className="form-group">
              <label>Que souhaitez-vous ajouter ?</label>
              <div className="add-member-type-buttons">
                <button
                  type="button"
                  className={`view-btn ${addMemberType === 'vivant' ? 'active' : ''}`}
                  onClick={() => setAddMemberType('vivant')}
                >
                  👤 Ajouter un vivant
                </button>
                <button
                  type="button"
                  className={`view-btn ${addMemberType === 'defunt' ? 'active' : ''}`}
                  onClick={() => {
                    setShowAddMemberForm(false)
                    setAddMemberType(null)
                    navigate('/defunt')
                  }}
                >
                  🕊️ Ajouter un défunt
                </button>
              </div>
            </div>
          </div>

          {/* Formulaire pour inviter un vivant */}
          {addMemberType === 'vivant' && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label>NuméroH du vivant à inviter *</label>
                  <input
                    type="text"
                    value={newMember.numeroH}
                    onChange={(e) => setNewMember({...newMember, numeroH: e.target.value})}
                    placeholder="NuméroH"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Relation souhaitée *</label>
                  <select
                    value={newMember.relation}
                    onChange={(e) => setNewMember({...newMember, relation: e.target.value as any})}
                  >
                    <option value="">Sélectionner une relation</option>
                    <option value="pere">Père</option>
                    <option value="mere">Mère</option>
                    <option value="grand-pere">Grand-père</option>
                    <option value="grand-mere">Grand-mère</option>
                    <option value="frere">Frère</option>
                    <option value="soeur">Sœur</option>
                    <option value="enfant">Enfant</option>
                    <option value="conjoint">Conjoint(e)</option>
                    <option value="oncle">Oncle</option>
                    <option value="tante">Tante</option>
                    <option value="cousin">Cousin</option>
                    <option value="cousine">Cousine</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="btn-submit"
                  onClick={handleAddMember}
                  disabled={!newMember.numeroH || !newMember.relation}
                >
                  Envoyer l'invitation
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddMemberForm(false)
                    setAddMemberType(null)
                  }}
                >
                  Annuler
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Vue arbre généalogique (seule vue, plus de vue liste) */}
      <div className="tree-view-horizontal">
        <svg className="tree-svg" width="100%" height="700" viewBox="0 0 1200 700">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="#4CAF50" />
              </marker>
            </defs>

            {/* Génération G-1: Grands-parents */}
            {familyMembers.filter(m => m.generation === 'G-1').length > 0 && (
              <g className="generation-g-1">
                {/* Grand-père paternel - HOMME = CARRÉ */}
                <rect 
                  x="50" y="50" width="180" height="80"
                  fill="white" stroke="#A0522D" strokeWidth="3"
                  onClick={() => setSelectedMember(familyMembers.find(m => m.id === '4') || null)}
                  style={{ cursor: 'pointer' }}
                />
                {/* Photo de profil */}
                <defs>
                  <clipPath id="clip-gp-pat">
                    <circle cx="95" cy="80" r="25" />
                  </clipPath>
                </defs>
                {familyMembers.find(m => m.id === '4')?.photo ? (
                  <image 
                    href={familyMembers.find(m => m.id === '4')?.photo} 
                    x="70" y="55" width="50" height="50"
                    clipPath="url(#clip-gp-pat)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <circle cx="95" cy="80" r="25" fill="#A0522D" opacity="0.3" />
                )}
                <text x="140" y="75" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2c5530">Père</text>
                <text x="180" y="95" textAnchor="middle" fontSize="12" fill="#666">
                  {familyMembers.find(m => m.id === '4')?.prenom || 'Grand-père'}
                </text>
                <text x="180" y="110" textAnchor="middle" fontSize="10" fill="#4CAF50" fontWeight="bold">
                  {familyMembers.find(m => m.id === '4')?.numeroH || 'GP001'}
                </text>
                {familyMembers.find(m => m.id === '4')?.isDeceased && (
                  <text x="215" y="70" fontSize="20">🕊️</text>
                )}

                {/* Ligne horizontale entre grands-parents paternels */}
                <line x1="230" y1="90" x2="270" y2="90" stroke="#4CAF50" strokeWidth="2" />

                {/* Grand-mère paternelle - FEMME = HEXAGONE */}
                <polygon 
                  points="285,50 435,50 450,90 435,130 285,130 270,90"
                  fill="white" stroke="#A0522D" strokeWidth="3"
                  onClick={() => setSelectedMember(familyMembers.find(m => m.id === '5') || null)}
                  style={{ cursor: 'pointer' }}
                />
                <defs>
                  <clipPath id="clip-gm-pat">
                    <circle cx="315" cy="80" r="25" />
                  </clipPath>
                </defs>
                {familyMembers.find(m => m.id === '5')?.photo ? (
                  <image 
                    href={familyMembers.find(m => m.id === '5')?.photo} 
                    x="290" y="55" width="50" height="50"
                    clipPath="url(#clip-gm-pat)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <circle cx="315" cy="80" r="25" fill="#A0522D" opacity="0.3" />
                )}
                <text x="360" y="75" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2c5530">Mère</text>
                <text x="400" y="95" textAnchor="middle" fontSize="12" fill="#666">
                  {familyMembers.find(m => m.id === '5')?.prenom || 'Grand-mère'}
                </text>
                <text x="400" y="110" textAnchor="middle" fontSize="10" fill="#4CAF50" fontWeight="bold">
                  {familyMembers.find(m => m.id === '5')?.numeroH || 'GM001'}
                </text>

                {/* Grands-parents maternels - HOMME = CARRÉ */}
                <rect 
                  x="700" y="50" width="180" height="80"
                  fill="white" stroke="#A0522D" strokeWidth="3"
                  onClick={() => setSelectedMember(familyMembers.find(m => m.id === '8') || null)}
                  style={{ cursor: 'pointer' }}
                />
                <defs>
                  <clipPath id="clip-gp-mat">
                    <circle cx="745" cy="80" r="25" />
                  </clipPath>
                </defs>
                {familyMembers.find(m => m.id === '8')?.photo ? (
                  <image 
                    href={familyMembers.find(m => m.id === '8')?.photo} 
                    x="720" y="55" width="50" height="50"
                    clipPath="url(#clip-gp-mat)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <circle cx="745" cy="80" r="25" fill="#A0522D" opacity="0.3" />
                )}
                <text x="790" y="75" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2c5530">Père</text>
                <text x="830" y="95" textAnchor="middle" fontSize="12" fill="#666">
                  {familyMembers.find(m => m.id === '8')?.prenom || 'Grand-père'}
                </text>
                <text x="830" y="110" textAnchor="middle" fontSize="10" fill="#4CAF50" fontWeight="bold">
                  {familyMembers.find(m => m.id === '8')?.numeroH || 'GP002'}
                </text>

                <line x1="880" y1="90" x2="920" y2="90" stroke="#4CAF50" strokeWidth="2" />

                {/* Grand-mère maternelle - FEMME = HEXAGONE */}
                <polygon 
                  points="935,50 1085,50 1100,90 1085,130 935,130 920,90"
                  fill="white" stroke="#A0522D" strokeWidth="3"
                  onClick={() => setSelectedMember(familyMembers.find(m => m.id === '9') || null)}
                  style={{ cursor: 'pointer' }}
                />
                <defs>
                  <clipPath id="clip-gm-mat">
                    <circle cx="965" cy="80" r="25" />
                  </clipPath>
                </defs>
                {familyMembers.find(m => m.id === '9')?.photo ? (
                  <image 
                    href={familyMembers.find(m => m.id === '9')?.photo} 
                    x="940" y="55" width="50" height="50"
                    clipPath="url(#clip-gm-mat)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <circle cx="965" cy="80" r="25" fill="#A0522D" opacity="0.3" />
                )}
                <text x="1010" y="75" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2c5530">Mère</text>
                <text x="1050" y="95" textAnchor="middle" fontSize="12" fill="#666">
                  {familyMembers.find(m => m.id === '9')?.prenom || 'Grand-mère'}
                </text>
                <text x="1050" y="110" textAnchor="middle" fontSize="10" fill="#4CAF50" fontWeight="bold">
                  {familyMembers.find(m => m.id === '9')?.numeroH || 'GM002'}
                </text>

                {/* Lignes verticales descendantes vers les parents */}
                <line x1="320" y1="130" x2="320" y2="200" stroke="#4CAF50" strokeWidth="2" />
                <line x1="1010" y1="130" x2="1010" y2="160" stroke="#4CAF50" strokeWidth="2" />
                {/* Ligne horizontale puis verticale vers la mère */}
                <line x1="1010" y1="160" x2="580" y2="160" stroke="#4CAF50" strokeWidth="2" />
                <line x1="580" y1="160" x2="580" y2="200" stroke="#4CAF50" strokeWidth="2" />
              </g>
            )}

            {/* Génération G0: Parents */}
            <g className="generation-g0">
              {/* Père - HOMME = CARRÉ */}
              <rect 
                x="230" y="200" width="180" height="80"
                fill="white" stroke="#CD853F" strokeWidth="3"
                onClick={() => setSelectedMember(familyMembers.find(m => m.id === '2') || null)}
                style={{ cursor: 'pointer' }}
              />
              <defs>
                <clipPath id="clip-pere">
                  <circle cx="275" cy="230" r="25" />
                </clipPath>
              </defs>
              {familyMembers.find(m => m.id === '2')?.photo ? (
                <image 
                  href={familyMembers.find(m => m.id === '2')?.photo} 
                  x="250" y="205" width="50" height="50"
                  clipPath="url(#clip-pere)"
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <circle cx="275" cy="230" r="25" fill="#CD853F" opacity="0.3" />
              )}
              <text x="320" y="225" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2c5530">Mari/Père</text>
              <text x="355" y="245" textAnchor="middle" fontSize="12" fill="#666">
                {familyMembers.find(m => m.id === '2')?.prenom || userData.prenomPere}
              </text>
              <text x="355" y="260" textAnchor="middle" fontSize="10" fill="#4CAF50" fontWeight="bold">
                {familyMembers.find(m => m.id === '2')?.numeroH || userData.numeroHPere}
              </text>

              {/* Ligne horizontale entre parents */}
              <line x1="410" y1="240" x2="490" y2="240" stroke="#4CAF50" strokeWidth="2" />
              <text x="450" y="230" textAnchor="middle" fontSize="11" fill="#FF9800" fontWeight="bold">Conjoints</text>

              {/* Mère - FEMME = HEXAGONE */}
              <polygon 
                points="505,200 655,200 670,240 655,280 505,280 490,240"
                fill="white" stroke="#CD853F" strokeWidth="3"
                onClick={() => setSelectedMember(familyMembers.find(m => m.id === '3') || null)}
                style={{ cursor: 'pointer' }}
              />
              <defs>
                <clipPath id="clip-mere">
                  <circle cx="535" cy="230" r="25" />
                </clipPath>
              </defs>
              {familyMembers.find(m => m.id === '3')?.photo ? (
                <image 
                  href={familyMembers.find(m => m.id === '3')?.photo} 
                  x="510" y="205" width="50" height="50"
                  clipPath="url(#clip-mere)"
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <circle cx="535" cy="230" r="25" fill="#CD853F" opacity="0.3" />
              )}
              <text x="580" y="225" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2c5530">Femme/Mère</text>
              <text x="615" y="245" textAnchor="middle" fontSize="12" fill="#666">
                {familyMembers.find(m => m.id === '3')?.prenom || userData.prenomMere}
              </text>
              <text x="615" y="260" textAnchor="middle" fontSize="10" fill="#4CAF50" fontWeight="bold">
                {familyMembers.find(m => m.id === '3')?.numeroH || userData.numeroHMere}
              </text>

              {/* Ligne verticale descendante depuis les parents */}
              <line x1="450" y1="280" x2="450" y2="320" stroke="#4CAF50" strokeWidth="2" />
            </g>

            {/* Génération G1: Vous et fratrie */}
            <g className="generation-g1">
              {/* Ligne horizontale pour connecter les enfants */}
              <line x1="200" y1="320" x2="700" y2="320" stroke="#4CAF50" strokeWidth="2" />

              {/* Frère - HOMME = CARRÉ */}
              <rect 
                x="100" y="350" width="180" height="80"
                fill="white" stroke="#667eea" strokeWidth="3"
                onClick={() => setSelectedMember(familyMembers.find(m => m.id === '6') || null)}
                style={{ cursor: 'pointer' }}
              />
              <defs>
                <clipPath id="clip-frere">
                  <circle cx="145" cy="380" r="25" />
                </clipPath>
              </defs>
              {familyMembers.find(m => m.id === '6')?.photo ? (
                <image 
                  href={familyMembers.find(m => m.id === '6')?.photo} 
                  x="120" y="355" width="50" height="50"
                  clipPath="url(#clip-frere)"
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <circle cx="145" cy="380" r="25" fill="#667eea" opacity="0.3" />
              )}
              <text x="190" y="375" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2c5530">Frère</text>
              <text x="225" y="395" textAnchor="middle" fontSize="12" fill="#666">
                {familyMembers.find(m => m.id === '6')?.prenom || 'Frère'}
              </text>
              <text x="225" y="410" textAnchor="middle" fontSize="10" fill="#4CAF50" fontWeight="bold">
                {familyMembers.find(m => m.id === '6')?.numeroH || 'F001'}
              </text>
              <line x1="190" y1="320" x2="190" y2="350" stroke="#4CAF50" strokeWidth="2" />

              {/* Sœur - FEMME = HEXAGONE */}
              <polygon 
                points="325,350 475,350 490,390 475,430 325,430 310,390"
                fill="white" stroke="#667eea" strokeWidth="3"
                onClick={() => setSelectedMember(familyMembers.find(m => m.id === '7') || null)}
                style={{ cursor: 'pointer' }}
              />
              <defs>
                <clipPath id="clip-soeur">
                  <circle cx="355" cy="380" r="25" />
                </clipPath>
              </defs>
              {familyMembers.find(m => m.id === '7')?.photo ? (
                <image 
                  href={familyMembers.find(m => m.id === '7')?.photo} 
                  x="330" y="355" width="50" height="50"
                  clipPath="url(#clip-soeur)"
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <circle cx="355" cy="380" r="25" fill="#667eea" opacity="0.3" />
              )}
              <text x="400" y="375" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2c5530">Fille/Sœur</text>
              <text x="435" y="395" textAnchor="middle" fontSize="12" fill="#666">
                {familyMembers.find(m => m.id === '7')?.prenom || 'Sœur'}
              </text>
              <text x="435" y="410" textAnchor="middle" fontSize="10" fill="#4CAF50" fontWeight="bold">
                {familyMembers.find(m => m.id === '7')?.numeroH || 'S001'}
              </text>
              <line x1="400" y1="320" x2="400" y2="350" stroke="#4CAF50" strokeWidth="2" />

              {/* Vous - selon votre genre */}
              {userData.genre === 'HOMME' ? (
                <rect 
                  x="520" y="350" width="180" height="80"
                  fill="white" stroke="#667eea" strokeWidth="3" 
                  className="current-user"
                  onClick={() => setSelectedMember(familyMembers.find(m => m.id === '1') || null)}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <polygon 
                  points="535,350 685,350 700,390 685,430 535,430 520,390"
                  fill="white" stroke="#667eea" strokeWidth="3"
                  className="current-user"
                  onClick={() => setSelectedMember(familyMembers.find(m => m.id === '1') || null)}
                  style={{ cursor: 'pointer' }}
                />
              )}
              {/* Photo de profil VOUS */}
              <defs>
                <clipPath id="clip-vous">
                  <circle cx="565" cy="380" r="25" />
                </clipPath>
              </defs>
              {userData.photo ? (
                <image 
                  href={userData.photo} 
                  x="540" y="355" width="50" height="50"
                  clipPath="url(#clip-vous)"
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <circle cx="565" cy="380" r="25" fill="#667eea" opacity="0.3" />
              )}
              <text x="610" y="375" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#667eea">
                {userData.genre === 'HOMME' ? 'Garçon/VOUS' : 'Fille/VOUS'}
              </text>
              <text x="645" y="395" textAnchor="middle" fontSize="12" fill="#666">
                {userData.prenom}
              </text>
              <text x="645" y="410" textAnchor="middle" fontSize="10" fill="#667eea" fontWeight="bold">
                {userData.numeroH}
              </text>
              <circle cx="695" cy="365" r="5" fill="#FF9800" />
              <line x1="610" y1="320" x2="610" y2="350" stroke="#4CAF50" strokeWidth="2" />

              {/* Ligne descendante pour vos enfants */}
              <line x1="610" y1="430" x2="610" y2="470" stroke="#4CAF50" strokeWidth="2" />
            </g>

            {/* Génération G2: Enfants + Conjoints + Petits-enfants (selon schéma) */}
            <g className="generation-g2">
              {/* barre horizontale reliant les enfants */}
              <line x1="500" y1="470" x2="720" y2="470" stroke="#059669" strokeWidth="2" />

              {/* Fille */}
              {renderPersonNode({ genre: 'FEMME', prenom: '', nomFamille: userData.nomFamille, numeroH: '' }, 420, 490, 170, 80, { label: 'Fille' })}
              <line x1="500" y1="470" x2="500" y2="490" stroke="#059669" strokeWidth="2" />

              {/* Mari à gauche de la fille */}
              {renderPersonNode({ genre: 'HOMME', prenom: '', nomFamille: '', numeroH: '' }, 290, 500, 110, 60, { label: 'Mari' })}
              <line x1="410" y1="520" x2="290" y2="520" stroke="#059669" strokeWidth="2" />

              {/* Petite-fille sous la fille */}
              <line x1="500" y1="570" x2="500" y2="610" stroke="#059669" strokeWidth="2" />
              {renderPersonNode({ genre: 'FEMME', prenom: '', nomFamille: userData.nomFamille, numeroH: '' }, 420, 610, 170, 80, { label: 'Fille' })}

              {/* Garçon */}
              {renderPersonNode({ genre: 'HOMME', prenom: '', nomFamille: userData.nomFamille, numeroH: '' }, 630, 490, 180, 80, { label: 'Garçon' })}
              <line x1="720" y1="470" x2="720" y2="490" stroke="#059669" strokeWidth="2" />

              {/* Femme à droite du garçon */}
              {renderPersonNode({ genre: 'FEMME', prenom: '', nomFamille: '', numeroH: '' }, 830, 500, 170, 80, { label: 'Femme' })}
              <line x1="810" y1="520" x2="830" y2="520" stroke="#059669" strokeWidth="2" />

              {/* Petit-garçon sous le garçon */}
              <line x1="720" y1="570" x2="720" y2="610" stroke="#059669" strokeWidth="2" />
              {renderPersonNode({ genre: 'HOMME', prenom: '', nomFamille: userData.nomFamille, numeroH: '' }, 630, 610, 180, 80, { label: 'Garçon' })}
            </g>

          </svg>
        </div>

      {/* Détails du membre sélectionné */}
      {selectedMember && (
        <div className="member-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Détails de {selectedMember.prenom} {selectedMember.nomFamille}</h3>
              <button onClick={() => setSelectedMember(null)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-photo">
                {selectedMember.photo ? (
                  <img src={selectedMember.photo} alt={selectedMember.prenom} />
                ) : (
                  <div className="avatar-large">
                    {selectedMember.prenom.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="detail-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">NumeroH:</span>
                    <span className="value">{selectedMember.numeroH}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Genre:</span>
                    <span className="value">{selectedMember.genre}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Relation:</span>
                    <span className="value">{getRelationIcon(selectedMember.relation)} {selectedMember.relation}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Génération:</span>
                    <span className="value">{selectedMember.generation}</span>
                  </div>
                  {selectedMember.dateNaissance && (
                    <div className="info-item">
                      <span className="label">Date de naissance:</span>
                      <span className="value">{new Date(selectedMember.dateNaissance).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedMember.dateDeces && (
                    <div className="info-item">
                      <span className="label">Date de décès:</span>
                      <span className="value">{new Date(selectedMember.dateDeces).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="label">Statut:</span>
                    <span className="value">
                      {selectedMember.isDeceased ? '🕊️ Décédé' : '❤️ Vivant'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques dans une fenêtre modale indépendante */}
      {showStats && (
        <div className="member-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📊 Statistiques de l'arbre</h3>
              <button onClick={() => setShowStats(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="arbre-stats">
                <div className="stat-card">
                  <p><strong>Total membres:</strong> {familyMembers.length}</p>
                  <p><strong>Vivants:</strong> {familyMembers.filter(m => !m.isDeceased).length}</p>
                  <p><strong>Décédés:</strong> {familyMembers.filter(m => m.isDeceased).length}</p>
                  <p><strong>Générations:</strong> {generations.length}</p>

                  {cercleCounts && (
                    <div className="mt-4 text-left">
                      <h5 className="text-sm sm:text-base font-semibold mb-2">
                        {t('wiz.live.title4')}
                      </h5>
                      <p className="text-xs sm:text-sm text-white/80 mb-3">
                        Effectifs calculés automatiquement à partir de votre arbre familial.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.brothers_mother')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbFreresMere}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.sisters_mother')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbSoeursMere}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.brothers_father')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbFreresPere}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.sisters_father')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbSoeursPere}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.aunts_maternal')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbTantesMaternelles}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.aunts_paternal')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbTantesPaternelles}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.uncles_maternal')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbOnclesMaternels}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.uncles_paternal')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbOnclesPaternels}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.cousins_male')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbCousins}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.cousins_female')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbCousines}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.daughters')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbFilles}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-medium text-white mb-1">
                            {t('label.sons')}
                          </div>
                          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-center font-semibold">
                            {cercleCounts.nbGarcons}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ancienne vue liste intégrée dans la modale Statistiques */}
                <div className="list-view">
                  <h4 className="mt-4 mb-2">📋 Détails des membres</h4>
                  <div className="members-list">
                    {filteredMembers.map(member => (
                      <div 
                        key={member.id}
                        className={`list-member ${member.isDeceased ? 'deceased' : ''}`}
                        onClick={() => setSelectedMember(member)}
                      >
                        <div className="member-avatar">
                          {member.photo ? (
                            <img src={member.photo} alt={member.prenom} />
                          ) : (
                            <div className="avatar-placeholder">
                              {member.prenom.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        <div className="member-details">
                          <h4>{member.prenom} {member.nomFamille}</h4>
                          <p><strong>NumeroH:</strong> {member.numeroH}</p>
                          <p><strong>Relation:</strong> {getRelationIcon(member.relation)} {member.relation}</p>
                          <p><strong>Génération:</strong> {member.generation}</p>
                          <p><strong>Genre:</strong> {member.genre}</p>
                          {member.dateNaissance && (
                            <p><strong>Né:</strong> {new Date(member.dateNaissance).toLocaleDateString()}</p>
                          )}
                          {member.dateDeces && (
                            <p><strong>Décédé:</strong> {new Date(member.dateDeces).toLocaleDateString()}</p>
                          )}
                        </div>
                        
                        <div className="member-status">
                          {member.isDeceased ? (
                            <span className="status deceased">🕊️ Décédé</span>
                          ) : (
                            <span className="status alive">❤️ Vivant</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mes invitations de famille (statistiques d'invitations) */}
                <div className="mt-6">
                  <h4 className="mb-2 text-base font-semibold text-white">
                    📩 Mes invitations de famille
                  </h4>
                  <div className="bg-white rounded-xl p-3 sm:p-4">
                    <InvitationsReceived userData={userData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Légende dans une fenêtre modale indépendante */}
      {showLegend && (
        <div className="member-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📘 Légende de l'arbre</h3>
              <button onClick={() => setShowLegend(false)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Recommandations pour compléter l'arbre (déplacées ici) */}
              {recommendations.length > 0 && (
                <div
                  className="tree-recommendations"
                  style={{
                    marginBottom: '16px',
                    padding: '15px',
                    backgroundColor: '#FEF3C7',
                    border: '2px solid #F59E0B',
                    borderRadius: '8px',
                    textAlign: 'left',
                  }}
                >
                  <h4 style={{ marginTop: 0, color: '#92400E', fontSize: '14px' }}>
                    💡 Recommandations pour compléter votre arbre généalogique :
                  </h4>
                  <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                    {recommendations.map((rec, index) => (
                      <li
                        key={index}
                        style={{ color: '#78350F', marginBottom: '6px', fontSize: '13px' }}
                      >
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="tree-legend-card">
                <div className="legend-section">
                  <div className="legend-section-title">Générations :</div>
                  <div className="legend-row">
                    <span className="legend-color" style={{ backgroundColor: '#A0522D' }} />
                    <span>G-1 : Grands-parents</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-color" style={{ backgroundColor: '#CD853F' }} />
                    <span>G0 : Parents</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-color" style={{ backgroundColor: '#667eea' }} />
                    <span>G1 : Vous / Fratrie</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-color" style={{ backgroundColor: '#4CAF50' }} />
                    <span>G2 : Enfants</span>
                  </div>
                </div>
                <div className="legend-section">
                  <div className="legend-section-title">Genres :</div>
                  <div className="legend-row">
                    <span className="legend-shape legend-male" /> <span>= Homme</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-shape legend-female" /> <span>= Femme</span>
                  </div>
                  <div className="legend-row">
                    <span className="legend-dot" /> <span>= Vous</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}





