import { useState, useEffect } from 'react'

interface Message {
  id: string
  type: 'texte' | 'audio' | 'video'
  contenu: string
  auteur: string
  numeroH: string
  photo?: string
  date: string
}

interface LieuxExchangeProps {
  userData: any
  lieuType: 'lieu1' | 'lieu2' | 'lieu3'
  lieuNom: string
  lieuLabel: string
}

export function LieuxExchange({ userData, lieuType, lieuNom, lieuLabel }: LieuxExchangeProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [membres, setMembres] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'discussion' | 'membres'>('discussion')
  const [showModal, setShowModal] = useState(false)

  const storageKey = `lieu_${lieuType}_${lieuNom.replace(/\s+/g, '_')}_messages`

  useEffect(() => {
    // Charger les messages
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setMessages(JSON.parse(stored))
      } catch (e) {
        console.error('Erreur chargement messages:', e)
      }
    }

    // Trouver les membres avec le même lieu
    const membresAvecMemeLieu: any[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes('vivant') || key.includes('session_user') || key.includes('compte_test'))) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          const user = data.userData || data
          
          if (user && user.numeroH && user[lieuType] === lieuNom) {
            membresAvecMemeLieu.push({
              numeroH: user.numeroH,
              prenom: user.prenom || 'Utilisateur',
              nomFamille: user.nomFamille || '',
              photo: user.photo,
              [lieuType]: lieuNom
            })
          }
        } catch (e) {
          // Ignorer
        }
      }
    }
    setMembres(membresAvecMemeLieu)
  }, [storageKey, lieuType, lieuNom])

  const ajouterMessage = (type: 'texte' | 'audio' | 'video', contenu: string) => {
    const nouveauMessage: Message = {
      id: Date.now().toString(),
      type,
      contenu,
      auteur: `${userData.prenom} ${userData.nomFamille}`,
      numeroH: userData.numeroH,
      photo: userData.photo,
      date: new Date().toISOString()
    }

    const nouveaux = [...messages, nouveauMessage]
    setMessages(nouveaux)
    localStorage.setItem(storageKey, JSON.stringify(nouveaux))
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* En-tête */}
      <div style={{
        backgroundColor: '#3498db',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          📍 {lieuLabel}: {lieuNom}
        </h3>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          {membres.length} membre{membres.length > 1 ? 's' : ''} de ce lieu
        </p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('discussion')}
          style={{
            flex: 1,
            padding: '1rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: activeTab === 'discussion' ? '#3498db' : 'white',
            color: activeTab === 'discussion' ? 'white' : '#3498db',
            border: '2px solid #3498db',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          💬 Discussion ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('membres')}
          style={{
            flex: 1,
            padding: '1rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: activeTab === 'membres' ? '#27ae60' : 'white',
            color: activeTab === 'membres' ? 'white' : '#27ae60',
            border: '2px solid #27ae60',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          👥 Membres ({membres.length})
        </button>
      </div>

      {/* Contenu */}
      {activeTab === 'discussion' ? (
        <div>
          {/* Bouton ajouter message */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              ➕ Ajouter un message
            </button>
          </div>

          {/* Messages */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            minHeight: '400px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                <p style={{ fontSize: '1.1rem' }}>Aucun message pour le moment</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Soyez le premier à démarrer la conversation !
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      backgroundColor: msg.numeroH === userData.numeroH ? '#e3f2fd' : '#f8f9fa',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      borderLeft: `4px solid ${msg.numeroH === userData.numeroH ? '#3498db' : '#95a5a6'}`
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      {msg.photo ? (
                        <img
                          src={msg.photo}
                          alt={msg.auteur}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#667eea',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}>
                          {msg.auteur.charAt(0)}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h6 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                            {msg.auteur}
                          </h6>
                          <span style={{ fontSize: '0.85rem', color: '#95a5a6' }}>
                            {new Date(msg.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#6c757d', margin: '0.25rem 0' }}>
                          {msg.numeroH}
                        </p>
                      </div>
                    </div>

                    {msg.type === 'texte' ? (
                      <p style={{ fontSize: '1rem', color: '#333', lineHeight: '1.6', margin: 0 }}>
                        {msg.contenu}
                      </p>
                    ) : (
                      <div style={{
                        backgroundColor: msg.numeroH === userData.numeroH ? '#bbdefb' : '#e9ecef',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                          {msg.type === 'audio' && '🎤'}
                          {msg.type === 'video' && '🎥'}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#6c757d', textTransform: 'uppercase' }}>
                          {msg.type}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#2c3e50' }}>
            👥 Membres de {lieuNom}
          </h4>

          {membres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
              <p style={{ fontSize: '1.1rem' }}>Aucun membre pour ce lieu</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {membres.map((membre, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    border: '2px solid #e9ecef',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {membre.photo ? (
                    <img
                      src={membre.photo}
                      alt={membre.prenom}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginBottom: '1rem',
                        border: '4px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#667eea',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      margin: '0 auto 1rem'
                    }}>
                      {membre.prenom?.charAt(0) || '👤'}
                    </div>
                  )}
                  <h6 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '0.5rem' }}>
                    {membre.prenom} {membre.nomFamille}
                  </h6>
                  <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    {membre.numeroH}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ModalMessage
          onClose={() => setShowModal(false)}
          onAdd={ajouterMessage}
        />
      )}
    </div>
  )
}

// Modal d'ajout de message
function ModalMessage({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (type: 'texte' | 'audio' | 'video', contenu: string) => void
}) {
  const [type, setType] = useState<'texte' | 'audio' | 'video'>('texte')
  const [contenu, setContenu] = useState('')

  const handleSubmit = () => {
    if (!contenu.trim()) {
      alert('Veuillez remplir le contenu')
      return
    }

    onAdd(type, contenu)
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
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#2c3e50', fontWeight: 'bold' }}>
          ➕ Ajouter un message
        </h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#495057', fontSize: '1rem' }}>
            Type de message
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '8px',
              border: '2px solid #ced4da',
              fontSize: '1rem'
            }}
          >
            <option value="texte">📝 Texte</option>
            <option value="audio">🎤 Audio</option>
            <option value="video">🎥 Vidéo</option>
          </select>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#495057', fontSize: '1rem' }}>
            {type === 'texte' ? 'Message' : 'URL du fichier'}
          </label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder={type === 'texte' ? 'Écrivez votre message...' : 'https://...'}
            rows={type === 'texte' ? 6 : 3}
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
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}

