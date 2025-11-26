// Script de test pour vérifier et créer un utilisateur de test
export const createTestUser = (prenom?: string, nomFamille?: string, numeroH?: string, password?: string) => {
  const testUser = {
    numeroH: numeroH || 'G96C1P2R3E2F1 4',
    password: password || 'test123',
    prenom: prenom || 'Demo',
    nomFamille: nomFamille || 'Utilisateur',
    type: 'vivant',
    generation: numeroH ? numeroH.substring(0, 3) : 'G96',
    continent: 'Afrique',
    pays: 'Guinée',
    region: 'Haute-Guinée',
    ethnie: 'Malinkés',
    famille: nomFamille || 'Barry',
    dateNaissance: '1990-01-01',
    telephone: '123456789',
    email: `${(prenom || 'test').toLowerCase()}@example.com`
  }
  
  // Sauvegarder dans plusieurs endroits pour être sûr
  localStorage.setItem('vivant_video', JSON.stringify(testUser))
  localStorage.setItem('dernier_vivant', JSON.stringify(testUser))
  
  console.log('✅ Utilisateur de test créé:', testUser)
  return testUser
}

// Fonction spéciale pour créer rapidement un utilisateur avec des paramètres personnalisés
export const createCustomUser = (options: {
  numeroH: string
  prenom: string
  nomFamille: string
  password: string
  [key: string]: any
}) => {
  const customUser = {
    ...options,
    type: options.type || 'vivant',
    generation: options.numeroH.substring(0, 3),
    continent: options.continent || 'Afrique',
    pays: options.pays || 'Guinée',
    region: options.region || 'Non spécifié',
    ethnie: options.ethnie || 'Non spécifié',
    famille: options.nomFamille,
    dateNaissance: options.dateNaissance || '1990-01-01',
    telephone: options.telephone || '',
    email: options.email || `${options.prenom.toLowerCase()}@example.com`
  }
  
  // Sauvegarder dans plusieurs endroits
  localStorage.setItem('vivant_video', JSON.stringify(customUser))
  localStorage.setItem('dernier_vivant', JSON.stringify(customUser))
  
  console.log('✅ Utilisateur personnalisé créé:', customUser)
  return customUser
}

export const checkUserExists = (numeroH: string) => {
  const searchKeys = [
    'vivant_video',
    'defunt_video', 
    'defunt_written',
    'dernier_vivant',
    'dernier_defunt',
    'vivant_written'
  ]
  
  const results: any[] = []
  
  searchKeys.forEach(key => {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        const data = JSON.parse(raw)
        const userNumeroH = data.numeroH || data.numeroHD
        if (userNumeroH === numeroH || userNumeroH === numeroH.replace(/\s+/g, ' ').trim()) {
          results.push({ ...data, source: key })
        }
      } catch (e) {
        console.error(`Erreur parsing ${key}:`, e)
      }
    }
  })
  
  return results
}

export const clearAllData = () => {
  const keys = [
    'vivant_video',
    'defunt_video', 
    'defunt_written',
    'dernier_vivant',
    'dernier_defunt',
    'vivant_written',
    'session_user',
    'numeroH_counter'
  ]
  
  keys.forEach(key => localStorage.removeItem(key))
  console.log('🗑️ Toutes les données effacées')
}

// Fonction pour diagnostiquer les problèmes de connexion
export const diagnoseConnection = (numeroH: string, password: string) => {
  console.log('🔍 Diagnostic de connexion:')
  console.log('NumeroH recherché:', numeroH)
  console.log('Mot de passe recherché:', password)
  
  const users = checkUserExists(numeroH)
  console.log('Utilisateurs trouvés avec ce NumeroH:', users)
  
  if (users.length === 0) {
    console.log('❌ Aucun utilisateur trouvé avec ce NumeroH')
    console.log('💡 Suggestion: Créez un utilisateur de test avec createTestUser()')
    return false
  }
  
  const passwordMatch = users.some(user => user.password === password)
  if (!passwordMatch) {
    console.log('❌ Mot de passe incorrect')
    console.log('💡 Mots de passe trouvés:', users.map(u => u.password))
    return false
  }
  
  console.log('✅ Utilisateur et mot de passe corrects!')
  return true
}
