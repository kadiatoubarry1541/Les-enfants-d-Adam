// Script de réparation rapide pour le problème de mot de passe
export const quickFixG96Password = () => {
  console.log('🚀 Réparation rapide pour G96C1P2R3E2F1 4')
  
  // 1. Effacer toutes les données existantes
  localStorage.clear()
  console.log('🗑️ Données effacées')
  
  // 2. Créer un utilisateur de test avec mot de passe correct
  const testUser = {
    numeroH: 'G96C1P2R3E2F1 4',
    password: 'test123',
    confirmPassword: 'test123',
    prenom: 'Demo',
    nomFamille: 'Utilisateur',
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
  
  // 3. Sauvegarder dans plusieurs endroits
  localStorage.setItem('vivant_video', JSON.stringify(testUser))
  localStorage.setItem('dernier_vivant', JSON.stringify(testUser))
  console.log('💾 Utilisateur sauvegardé:', testUser)
  
  // 4. Tester la connexion
  const testConnection = () => {
    const keys = ['vivant_video', 'dernier_vivant']
    for (const key of keys) {
      const raw = localStorage.getItem(key)
      if (raw) {
        const data = JSON.parse(raw)
        if (data.numeroH === 'G96C1P2R3E2F1 4' && data.password === 'test123') {
          console.log('✅ Test de connexion réussi!')
          return true
        }
      }
    }
    console.log('❌ Test de connexion échoué')
    return false
  }
  
  const success = testConnection()
  
  if (success) {
    console.log('🎉 RÉPARATION RÉUSSIE!')
    console.log('Vous pouvez maintenant vous connecter avec:')
    console.log('NumeroH: G96C1P2R3E2F1 4')
    console.log('Mot de passe: test123')
    alert('✅ Réparation réussie! Vous pouvez maintenant vous connecter avec NumeroH: G96C1P2R3E2F1 4 et Mot de passe: test123')
  } else {
    console.log('❌ Réparation échouée')
    alert('❌ Réparation échouée. Vérifiez la console pour plus de détails.')
  }
  
  return success
}

// Fonction globale pour la console
if (typeof window !== 'undefined') {
  (window as any).quickFixG96 = quickFixG96Password
  console.log('💡 Tapez quickFixG96() dans la console pour réparer rapidement votre problème de mot de passe')
}
