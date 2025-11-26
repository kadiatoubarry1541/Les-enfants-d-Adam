import { useState, useEffect } from 'react'

interface UserData {
  numeroH?: string
  numeroHD?: string
  password?: string
  prenom?: string
  nomFamille?: string
  type?: string
  [key: string]: any
}

export function NumeroHChecker() {
  const [numeroH, setNumeroH] = useState('G96C1P2R3E2F1 4')
  const [searchResults, setSearchResults] = useState<{
    found: boolean
    users: UserData[]
    details: string[]
  }>({ found: false, users: [], details: [] })

  const searchNumeroH = () => {
    const candidats: UserData[] = []
    const details: string[] = []
    
    // Chercher dans tous les localStorage
    const keys = [
      'vivant_video',
      'defunt_video', 
      'defunt_written',
      'dernier_vivant',
      'dernier_defunt',
      'vivant_written' // Ajout pour les formulaires écrits vivants
    ]
    
    keys.forEach(key => {
      const raw = localStorage.getItem(key)
      if (raw) {
        try {
          const data = JSON.parse(raw)
          candidats.push({ ...data, source: key })
          details.push(`✅ Trouvé dans ${key}`)
        } catch (e) {
          details.push(`❌ Erreur parsing ${key}: ${e}`)
        }
      } else {
        details.push(`❌ Aucune donnée dans ${key}`)
      }
    })
    
    // Recherche exacte
    const exactMatches = candidats.filter(u => {
      const userNumeroH = u.numeroH || u.numeroHD
      return userNumeroH === numeroH
    })
    
    // Recherche partielle (au cas où il y aurait des espaces différents)
    const partialMatches = candidats.filter(u => {
      const userNumeroH = u.numeroH || u.numeroHD
      return userNumeroH && userNumeroH.replace(/\s+/g, ' ').trim() === numeroH.replace(/\s+/g, ' ').trim()
    })
    
    setSearchResults({
      found: exactMatches.length > 0,
      users: exactMatches.length > 0 ? exactMatches : partialMatches,
      details
    })
  }

  useEffect(() => {
    searchNumeroH()
  }, [])

  const clearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
      localStorage.clear()
      setSearchResults({ found: false, users: [], details: [] })
    }
  }

  const addTestUser = () => {
    const prenom = prompt('Entrez le prénom:') || 'Demo'
    const nomFamille = prompt('Entrez le nom de famille:') || 'Utilisateur'
    
    const testUser = {
      numeroH: 'G96C1P2R3E2F1 4',
      password: 'test123',
      prenom: prenom,
      nomFamille: nomFamille,
      type: 'vivant',
      generation: 'G96',
      continent: 'Afrique',
      pays: 'Guinée',
      region: 'Haute-Guinée',
      ethnie: 'Malinkés',
      famille: 'Barry'
    }
    
    localStorage.setItem('vivant_video', JSON.stringify(testUser))
    searchNumeroH()
    alert(`✅ Utilisateur ${prenom} ${nomFamille} ajouté avec succès !`)
  }

  return (
    <div className="debug-info">
      <h4>🔍 Vérificateur de NumeroH</h4>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          <strong>NumeroH à rechercher :</strong>
        </label>
        <input 
          type="text" 
          value={numeroH} 
          onChange={(e) => setNumeroH(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}
        />
        <button 
          onClick={searchNumeroH}
          style={{ 
            marginTop: '5px',
            background: 'var(--primary-green)', 
            color: 'white', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔍 Rechercher
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={addTestUser}
          style={{ 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          ➕ Ajouter utilisateur test
        </button>
        <button 
          onClick={clearAllData}
          style={{ 
            background: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ Effacer toutes les données
        </button>
      </div>

      <div style={{ 
        background: searchResults.found ? '#d4edda' : '#f8d7da', 
        border: `1px solid ${searchResults.found ? '#c3e6cb' : '#f5c6cb'}`, 
        borderRadius: '4px', 
        padding: '15px',
        marginBottom: '15px'
      }}>
        <h5 style={{ color: searchResults.found ? '#155724' : '#721c24', margin: '0 0 10px 0' }}>
          {searchResults.found ? '✅ NumeroH TROUVÉ !' : '❌ NumeroH NON TROUVÉ'}
        </h5>
        
        {searchResults.found && searchResults.users.length > 0 && (
          <div>
            <p><strong>Utilisateurs trouvés :</strong></p>
            {searchResults.users.map((user, index) => (
              <div key={index} style={{ 
                background: 'white', 
                padding: '10px', 
                borderRadius: '4px', 
                margin: '5px 0',
                border: '1px solid #ddd'
              }}>
                <p><strong>NumeroH:</strong> {user.numeroH || user.numeroHD}</p>
                <p><strong>Nom:</strong> {user.prenom} {user.nomFamille}</p>
                <p><strong>Type:</strong> {user.type || 'Non spécifié'}</p>
                <p><strong>Source:</strong> {user.source}</p>
                <p><strong>Mot de passe:</strong> {user.password ? '***' + user.password.slice(-3) : 'Non défini'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h5>📋 Détails de la recherche :</h5>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          {searchResults.details.map((detail, index) => (
            <li key={index} style={{ marginBottom: '5px', fontSize: '0.9rem' }}>
              {detail}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '15px', padding: '10px', background: '#e9ecef', borderRadius: '4px' }}>
        <h6>💡 Instructions :</h6>
        <ol style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>Vérifiez que votre NumeroH est exactement : <code>G96C1P2R3E2F1 4</code></li>
          <li>Si non trouvé, cliquez sur "Ajouter utilisateur test"</li>
          <li>Essayez de vous connecter avec : NumeroH = <code>G96C1P2R3E2F1 4</code> et Mot de passe = <code>test123</code></li>
          <li>Si ça ne marche toujours pas, vérifiez la console du navigateur (F12)</li>
        </ol>
      </div>
    </div>
  )
}
