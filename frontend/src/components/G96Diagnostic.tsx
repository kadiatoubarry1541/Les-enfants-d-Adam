import { useState, useEffect } from 'react'

export function G96Diagnostic() {
  const [diagnostic, setDiagnostic] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostic = async () => {
    setIsRunning(true)
    const results: any = {
      numeroH: 'G96C1P2R3E2F1 4',
      password: 'test123',
      steps: [],
      errors: [],
      success: false
    }

    try {
      // Étape 1: Vérifier localStorage
      results.steps.push('🔍 Vérification du localStorage...')
      const keys = ['vivant_video', 'defunt_video', 'defunt_written', 'dernier_vivant', 'dernier_defunt', 'vivant_written']
      const foundKeys = keys.filter(key => localStorage.getItem(key))
      results.steps.push(`✅ Clés trouvées: ${foundKeys.join(', ') || 'Aucune'}`)

      // Étape 2: Chercher le NumeroH spécifique
      results.steps.push('🔍 Recherche du NumeroH G96C1P2R3E2F1 4...')
      let foundUser = null
      let foundIn = ''

      for (const key of keys) {
        const raw = localStorage.getItem(key)
        if (raw) {
          try {
            const data = JSON.parse(raw)
            const userNumeroH = data.numeroH || data.numeroHD
            if (userNumeroH === 'G96C1P2R3E2F1 4' || userNumeroH === 'G96C1P2R3E2F1 4'.replace(/\s+/g, ' ').trim()) {
              foundUser = data
              foundIn = key
              break
            }
          } catch (e) {
            results.errors.push(`Erreur parsing ${key}: ${e}`)
          }
        }
      }

      if (foundUser) {
        results.steps.push(`✅ Utilisateur trouvé dans ${foundIn}`)
        results.user = foundUser
        results.steps.push(`📝 Nom: ${foundUser.prenom} ${foundUser.nomFamille}`)
        results.steps.push(`🔑 Mot de passe: ${foundUser.password ? '***' + foundUser.password.slice(-3) : 'Non défini'}`)
        
        // Étape 3: Tester la connexion
        results.steps.push('🔍 Test de connexion...')
        if (foundUser.password === 'test123') {
          results.steps.push('✅ Mot de passe correct!')
          results.success = true
        } else {
          results.steps.push(`❌ Mot de passe incorrect. Attendu: test123, Trouvé: ${foundUser.password}`)
          results.errors.push('Mot de passe incorrect')
        }
      } else {
        results.steps.push('❌ Utilisateur non trouvé')
        results.errors.push('NumeroH G96C1P2R3E2F1 4 non trouvé dans localStorage')
        
        // Créer un utilisateur de test
        results.steps.push('🔧 Création d\'un utilisateur de test...')
        const testUser = {
          numeroH: 'G96C1P2R3E2F1 4',
          password: 'test123',
          prenom: 'Test',
          nomFamille: 'User',
          type: 'vivant',
          generation: 'G96',
          continent: 'Afrique',
          pays: 'Guinée',
          region: 'Haute-Guinée',
          ethnie: 'Malinkés',
          famille: 'Barry',
          dateNaissance: '1990-01-01',
          telephone: '123456789'
        }
        
        localStorage.setItem('vivant_video', JSON.stringify(testUser))
        localStorage.setItem('dernier_vivant', JSON.stringify(testUser))
        results.steps.push('✅ Utilisateur de test créé!')
        results.user = testUser
        results.success = true
      }

    } catch (error) {
      results.errors.push(`Erreur générale: ${error}`)
    }

    setDiagnostic(results)
    setIsRunning(false)
  }

  const clearAndRecreate = () => {
    if (confirm('Effacer toutes les données et recréer l\'utilisateur de test ?')) {
      localStorage.clear()
      runDiagnostic()
    }
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  return (
    <div className="debug-info">
      <h4>🔧 Diagnostic Spécifique pour G96C1P2R3E2F1 4</h4>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={runDiagnostic}
          disabled={isRunning}
          style={{ 
            background: isRunning ? '#6c757d' : 'var(--primary-green)', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isRunning ? '⏳ Diagnostic en cours...' : '🔄 Relancer le diagnostic'}
        </button>
        
        <button 
          onClick={clearAndRecreate}
          style={{ 
            background: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ Effacer et recréer
        </button>
      </div>

      {diagnostic && (
        <div style={{ 
          background: diagnostic.success ? '#d4edda' : '#f8d7da', 
          border: `1px solid ${diagnostic.success ? '#c3e6cb' : '#f5c6cb'}`, 
          borderRadius: '4px', 
          padding: '15px',
          marginBottom: '15px'
        }}>
          <h5 style={{ color: diagnostic.success ? '#155724' : '#721c24', margin: '0 0 10px 0' }}>
            {diagnostic.success ? '✅ DIAGNOSTIC RÉUSSI' : '❌ DIAGNOSTIC ÉCHOUÉ'}
          </h5>
          
          {diagnostic.user && (
            <div style={{ background: 'white', padding: '10px', borderRadius: '4px', margin: '10px 0' }}>
              <h6>👤 Utilisateur trouvé:</h6>
              <p><strong>NumeroH:</strong> {diagnostic.user.numeroH}</p>
              <p><strong>Nom:</strong> {diagnostic.user.prenom} {diagnostic.user.nomFamille}</p>
              <p><strong>Mot de passe:</strong> {diagnostic.user.password ? '***' + diagnostic.user.password.slice(-3) : 'Non défini'}</p>
              <p><strong>Type:</strong> {diagnostic.user.type || 'Non spécifié'}</p>
            </div>
          )}
        </div>
      )}

      {diagnostic && (
        <div>
          <h5>📋 Étapes du diagnostic:</h5>
          <ol style={{ margin: '0', paddingLeft: '20px' }}>
            {diagnostic.steps.map((step: string, index: number) => (
              <li key={index} style={{ marginBottom: '5px', fontSize: '0.9rem' }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {diagnostic && diagnostic.errors.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h5 style={{ color: '#721c24' }}>❌ Erreurs détectées:</h5>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {diagnostic.errors.map((error: string, index: number) => (
              <li key={index} style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#721c24' }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {diagnostic && diagnostic.success && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          background: '#d1ecf1', 
          border: '1px solid #bee5eb', 
          borderRadius: '4px' 
        }}>
          <h5 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>🎉 Instructions de connexion:</h5>
          <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '0.9rem' }}>
            <li>NumeroH: <code>G96C1P2R3E2F1 4</code></li>
            <li>Mot de passe: <code>test123</code></li>
            <li>Cliquez sur "Se connecter"</li>
            <li>Vous devriez être redirigé vers votre tableau de bord</li>
          </ol>
        </div>
      )}
    </div>
  )
}
