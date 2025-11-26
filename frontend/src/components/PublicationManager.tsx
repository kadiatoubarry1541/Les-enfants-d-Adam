import { useState, useEffect } from 'react'

interface Publication {
  id: string
  type: 'photo' | 'video' | 'audio' | 'texte'
  contenu: string
  description?: string
  auteur: string
  date: string
  numeroH: string
}

interface PublicationManagerProps {
  userData: any
  storageKey: string
  titre: string
  description?: string
}

export function PublicationManager({ userData, storageKey, titre, description }: PublicationManagerProps) {
  const [publications, setPublications] = useState<Publication[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setPublications(JSON.parse(stored))
      } catch (e) {
        console.error('Erreur chargement publications:', e)
      }
    }
  }, [storageKey])

  const ajouterPublication = (type: 'photo' | 'video' | 'audio' | 'texte', contenu: string, desc?: string) => {
    const nouvellePublication: Publication = {
      id: Date.now().toString(),
      type,
      contenu,
      description: desc,
      auteur: `${userData.prenom} ${userData.nomFamille}`,
      date: new Date().toISOString(),
      numeroH: userData.numeroH
    }

    const nouvelles = [...publications, nouvellePublication]
    setPublications(nouvelles)
    localStorage.setItem(storageKey, JSON.stringify(nouvelles))
  }

  const supprimerPublication = (id: string) => {
    const nouvelles = publications.filter(p => p.id !== id)
    setPublications(nouvelles)
    localStorage.setItem(storageKey, JSON.stringify(nouvelles))
  }

  return (
    <div className="publication-manager">
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '2rem', color: '#2c3e50', marginBottom: '1rem' }}>
          {titre}
        </h3>
        {description && (
          <p style={{ color: '#7f8c8d', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            {description}
          </p>
        )}
        
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#229954'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
        >
          ➕ Ajouter une publication
        </button>
      </div>

      {/* Liste des publications */}
      {publications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #ddd'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
            Aucune publication pour le moment
          </p>
          <p style={{ color: '#95a5a6', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Commencez à partager vos contenus avec la communauté
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {publications.map((pub) => (
            <div
              key={pub.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid #e9ecef',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>
                  {pub.type === 'photo' && '📷'}
                  {pub.type === 'video' && '🎥'}
                  {pub.type === 'audio' && '🎤'}
                  {pub.type === 'texte' && '📝'}
                </span>
                <button
                  onClick={() => supprimerPublication(pub.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  🗑️ Supprimer
                </button>
              </div>
              
              {pub.type === 'texte' ? (
                <p style={{ color: '#333', marginBottom: '1rem', lineHeight: '1.7', fontSize: '1rem' }}>
                  {pub.contenu}
                </p>
              ) : (
                <div style={{ 
                  backgroundColor: '#f0f3f5', 
                  padding: '2.5rem', 
                  borderRadius: '10px', 
                  textAlign: 'center',
                  marginBottom: '1rem',
                  border: '1px solid #dee2e6'
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>
                    {pub.type === 'photo' && '🖼️'}
                    {pub.type === 'video' && '📹'}
                    {pub.type === 'audio' && '🔊'}
                  </div>
                  <p style={{ color: '#6c757d', fontSize: '0.95rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {pub.type}
                  </p>
                  <p style={{ color: '#95a5a6', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {pub.contenu.substring(0, 30)}...
                  </p>
                </div>
              )}
              
              {pub.description && (
                <div style={{ 
                  backgroundColor: '#fff3cd', 
                  padding: '0.75rem', 
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}>
                  <p style={{ color: '#856404', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
                    💬 {pub.description}
                  </p>
                </div>
              )}
              
              <div style={{ 
                borderTop: '2px solid #e9ecef', 
                paddingTop: '0.75rem', 
                fontSize: '0.85rem', 
                color: '#6c757d'
              }}>
                <p style={{ margin: '0.25rem 0', fontWeight: '600' }}>
                  👤 {pub.auteur}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  🗓️ {new Date(pub.date).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'ajout */}
      {showModal && (
        <ModalPublication
          onClose={() => setShowModal(false)}
          onAdd={ajouterPublication}
        />
      )}
    </div>
  )
}

// Modal d'ajout de publication
function ModalPublication({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (type: 'photo' | 'video' | 'audio' | 'texte', contenu: string, description?: string) => void
}) {
  const [type, setType] = useState<'photo' | 'video' | 'audio' | 'texte'>('texte')
  const [contenu, setContenu] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (!contenu.trim()) {
      alert('Veuillez remplir le contenu')
      return
    }

    onAdd(type, contenu, description)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          maxWidth: '650px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#2c3e50', fontWeight: 'bold' }}>
          ➕ Ajouter une publication
        </h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#495057', fontSize: '1rem' }}>
            Type de contenu
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '8px',
              border: '2px solid #ced4da',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            <option value="texte">📝 Texte</option>
            <option value="photo">📷 Photo</option>
            <option value="video">🎥 Vidéo</option>
            <option value="audio">🎤 Audio</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#495057', fontSize: '1rem' }}>
            {type === 'texte' ? 'Contenu du texte' : 'URL du fichier'}
          </label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder={type === 'texte' ? 'Écrivez votre contenu ici...' : 'https://...'}
            rows={type === 'texte' ? 8 : 3}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '8px',
              border: '2px solid #ced4da',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#495057', fontSize: '1rem' }}>
            Description (optionnelle)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ajoutez une description..."
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '8px',
              border: '2px solid #ced4da',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '8px',
              border: '2px solid #dee2e6',
              backgroundColor: 'white',
              color: '#495057',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#27ae60',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(39,174,96,0.3)'
            }}
          >
            Publier
          </button>
        </div>
      </div>
    </div>
  )
}

