// Script de réparation automatique des mots de passe
export const fixPasswordIssues = () => {
  console.log('🔧 Réparation des problèmes de mot de passe...')
  
  const keys = ['vivant_video', 'defunt_video', 'defunt_written', 'dernier_vivant', 'dernier_defunt', 'vivant_written']
  let fixed = 0
  
  keys.forEach(key => {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        const data = JSON.parse(raw)
        
        // Si l'utilisateur n'a pas de mot de passe, en ajouter un
        if (!data.password && data.numeroH) {
          data.password = 'test123' // Mot de passe par défaut
          data.confirmPassword = 'test123'
          localStorage.setItem(key, JSON.stringify(data))
          console.log(`✅ Mot de passe ajouté pour ${data.numeroH} dans ${key}`)
          fixed++
        }
        
        // Si le mot de passe est vide ou undefined
        if (data.password === '' || data.password === null || data.password === undefined) {
          data.password = 'test123'
          data.confirmPassword = 'test123'
          localStorage.setItem(key, JSON.stringify(data))
          console.log(`✅ Mot de passe corrigé pour ${data.numeroH} dans ${key}`)
          fixed++
        }
        
      } catch (e) {
        console.error(`❌ Erreur lors de la réparation de ${key}:`, e)
      }
    }
  })
  
  console.log(`🎉 Réparation terminée. ${fixed} utilisateur(s) corrigé(s).`)
  return fixed
}

export const createSecureTestUser = (prenom?: string, nomFamille?: string) => {
  const testUser = {
    numeroH: 'G96C1P2R3E2F1 4',
    password: 'test123',
    confirmPassword: 'test123',
    prenom: prenom || 'Demo',
    nomFamille: nomFamille || 'Utilisateur',
    type: 'vivant',
    generation: 'G96',
    continent: 'Afrique',
    pays: 'Guinée',
    region: 'Haute-Guinée',
    ethnie: 'Malinkés',
    famille: 'Barry',
    dateNaissance: '1990-01-01',
    telephone: '123456789',
    email: 'test@example.com'
  }
  
  // Sauvegarder dans plusieurs endroits
  localStorage.setItem('vivant_video', JSON.stringify(testUser))
  localStorage.setItem('dernier_vivant', JSON.stringify(testUser))
  
  console.log('✅ Utilisateur de test sécurisé créé:', testUser)
  return testUser
}

export const verifyAllPasswords = () => {
  console.log('🔍 Vérification de tous les mots de passe...')
  
  const keys = ['vivant_video', 'defunt_video', 'defunt_written', 'dernier_vivant', 'dernier_defunt', 'vivant_written']
  const results: any[] = []
  
  keys.forEach(key => {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        const data = JSON.parse(raw)
        const hasPassword = data.password && data.password.length > 0
        const hasNumeroH = data.numeroH || data.numeroHD
        
        results.push({
          key,
          numeroH: hasNumeroH ? (data.numeroH || data.numeroHD) : 'N/A',
          hasPassword,
          password: data.password || 'Aucun',
          prenom: data.prenom || 'N/A',
          nomFamille: data.nomFamille || 'N/A'
        })
        
        console.log(`${hasPassword ? '✅' : '❌'} ${key}: ${hasNumeroH ? (data.numeroH || data.numeroHD) : 'N/A'} - Mot de passe: ${hasPassword ? 'OUI' : 'NON'}`)
        
      } catch (e) {
        console.error(`❌ Erreur parsing ${key}:`, e)
      }
    }
  })
  
  return results
}

// Fonction globale pour la console
if (typeof window !== 'undefined') {
  (window as any).fixPasswords = fixPasswordIssues
  ;(window as any).createSecureUser = createSecureTestUser
  ;(window as any).verifyPasswords = verifyAllPasswords
  console.log('💡 Fonctions disponibles dans la console:')
  console.log('  - fixPasswords() : Réparer tous les mots de passe')
  console.log('  - createSecureUser() : Créer un utilisateur de test sécurisé')
  console.log('  - verifyPasswords() : Vérifier tous les mots de passe')
}
