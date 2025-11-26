import { useState } from 'react'
import { PublicationManager } from './PublicationManager'

interface FoiSectionsProps {
  userData: any
}

export function FoiSections({ userData }: FoiSectionsProps) {
  const [activeSection, setActiveSection] = useState<'hommes' | 'femmes' | 'enfants'>('hommes')

  const sections = [
    { id: 'hommes' as const, label: 'HOMMES', icon: '👨', color: '#3498db' },
    { id: 'femmes' as const, label: 'FEMMES', icon: '👩', color: '#e91e63' },
    { id: 'enfants' as const, label: 'ENFANTS - 18 ANS', icon: '👶', color: '#9c27b0' }
  ]

  const currentSection = sections.find(s => s.id === activeSection)!

  return (
    <div style={{ padding: '2rem' }}>
      {/* En-tête */}
      <div style={{
        backgroundColor: '#e8f5e9',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center',
        border: '3px solid #4caf50'
      }}>
        <h2 style={{ fontSize: '2.5rem', color: '#2e7d32', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          🕌 Foi - Partage Spirituel
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          Partagez vos réflexions et enseignements spirituels par catégorie
        </p>
      </div>

      {/* Navigation entre sections */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: '1.25rem 2.5rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: '3px solid',
              borderColor: activeSection === section.id ? section.color : '#ddd',
              backgroundColor: activeSection === section.id ? section.color : 'white',
              color: activeSection === section.id ? 'white' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: activeSection === section.id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
              transform: activeSection === section.id ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Contenu de la section active */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '2.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: `3px solid ${currentSection.color}`,
        minHeight: '500px'
      }}>
        <div style={{
          backgroundColor: `${currentSection.color}15`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          borderLeft: `5px solid ${currentSection.color}`
        }}>
          <h3 style={{ fontSize: '2rem', color: currentSection.color, marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {currentSection.icon} Section {currentSection.label}
          </h3>
          <p style={{ fontSize: '1.05rem', color: '#555' }}>
            Publications spirituelles et de foi destinées aux {currentSection.label.toLowerCase()}
          </p>
        </div>

        <PublicationManager
          userData={userData}
          storageKey={`foi_${activeSection}_${userData.numeroH}`}
          titre={`Publications - ${currentSection.label}`}
          description="Partagez vos réflexions, enseignements et expériences spirituelles"
        />
      </div>
    </div>
  )
}

