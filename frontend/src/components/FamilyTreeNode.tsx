import { useState } from 'react'

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
  logo?: string
}

interface Position {
  x: number
  y: number
}

interface FamilyTreeNodeProps {
  member: FamilyMember
  position: Position
  onSelect: (member: FamilyMember) => void
  isSelected: boolean
}

export function FamilyTreeNode({ member, position, onSelect, isSelected }: FamilyTreeNodeProps) {
  const [isHovered, setIsHovered] = useState(false)

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

  const getGenerationColor = (generation: string) => {
    const genNum = parseInt(generation.replace('G', ''))
    if (genNum <= 10) return '#8B4513' // Marron pour les anciennes générations
    if (genNum <= 50) return '#D2691E' // Orange pour les générations moyennes
    if (genNum <= 100) return '#228B22' // Vert pour les générations récentes
    return '#4169E1' // Bleu pour les générations très récentes
  }

  const getGenderIcon = (genre: string) => {
    switch (genre) {
      case 'Homme': return '👨'
      case 'Femme': return '👩'
      default: return '👤'
    }
  }

  const getStatusColor = () => {
    if (!member.isAlive) return '#666' // Gris pour les décédés
    return member.logo ? '#FFD700' : '#4CAF50' // Or pour les statuts spéciaux, vert pour les vivants
  }

  return (
    <g
      className={`family-node ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      transform={`translate(${position.x}, ${position.y})`}
      onClick={() => onSelect(member)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cercle principal */}
      <circle
        cx="0"
        cy="0"
        r="40"
        fill={getStatusColor()}
        stroke={isSelected ? '#FF6B6B' : '#333'}
        strokeWidth={isSelected ? 3 : 2}
        className="node-circle"
      />

      {/* Photo de profil ou initiale */}
      {member.photo ? (
        <image
          href={member.photo}
          x="-25"
          y="-25"
          width="50"
          height="50"
          clipPath="url(#nodeClip)"
        />
      ) : (
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fontSize="20"
          fill="white"
          fontWeight="bold"
          className="node-initial"
        >
          {member.prenom.charAt(0)}
        </text>
      )}

      {/* Logo de statut */}
      {member.logo && (
        <text
          x="25"
          y="-25"
          fontSize="16"
          className="status-logo"
        >
          {getLogoIcon(member.logo)}
        </text>
      )}

      {/* Icône de genre */}
      <text
        x="-25"
        y="-25"
        fontSize="14"
        className="gender-icon"
      >
        {getGenderIcon(member.genre)}
      </text>

      {/* Nom et prénom */}
      <text
        x="0"
        y="60"
        textAnchor="middle"
        fontSize="12"
        fill="#333"
        fontWeight="bold"
        className="node-name"
      >
        {member.prenom}
      </text>
      
      <text
        x="0"
        y="75"
        textAnchor="middle"
        fontSize="10"
        fill="#666"
        className="node-family"
      >
        {member.nomFamille}
      </text>

      {/* Génération */}
      <text
        x="0"
        y="90"
        textAnchor="middle"
        fontSize="10"
        fill={getGenerationColor(member.generation)}
        fontWeight="bold"
        className="node-generation"
      >
        {member.generation}
      </text>

      {/* Décet pour les décédés */}
      {member.decet && (
        <text
          x="0"
          y="105"
          textAnchor="middle"
          fontSize="9"
          fill="#8B0000"
          className="node-decet"
        >
          {member.decet}
        </text>
      )}

      {/* Indicateur de statut (vivant/décédé) */}
      <circle
        cx="30"
        cy="-30"
        r="8"
        fill={member.isAlive ? '#4CAF50' : '#666'}
        className="status-indicator"
      />

      {/* Lignes de connexion (seront gérées par le composant parent) */}
      <defs>
        <clipPath id="nodeClip">
          <circle cx="0" cy="0" r="25" />
        </clipPath>
      </defs>
    </g>
  )
}
