// Script de test rapide pour votre NumeroH spécifique
export const quickTestG96 = () => {
  console.log('🚀 Test rapide pour G96C1P2R3E2F1 4')
  
  // 1. Vérifier si l'utilisateur existe déjà
  const existingUsers = checkUserExists('G96C1P2R3E2F1 4')
  console.log('Utilisateurs existants:', existingUsers)
  
  if (existingUsers.length === 0) {
    console.log('❌ Aucun utilisateur trouvé. Création d\'un utilisateur de test...')
    createTestUser()
  } else {
    console.log('✅ Utilisateur trouvé:', existingUsers[0])
  }
  
  // 2. Tester la connexion
  const connectionTest = diagnoseConnection('G96C1P2R3E2F1 4', 'test123')
  
  if (connectionTest) {
    console.log('🎉 Test réussi ! Vous pouvez maintenant vous connecter avec:')
    console.log('NumeroH: G96C1P2R3E2F1 4')
    console.log('Mot de passe: test123')
  } else {
    console.log('❌ Test échoué. Vérifiez les détails ci-dessus.')
  }
  
  return connectionTest
}

// Import des fonctions nécessaires
import { createTestUser, checkUserExists, diagnoseConnection } from './testUser'

// Exécuter le test automatiquement si ce fichier est importé
if (typeof window !== 'undefined') {
  // Ajouter une fonction globale pour le test rapide
  (window as any).quickTestG96 = quickTestG96
  console.log('💡 Tapez quickTestG96() dans la console pour tester votre NumeroH')
}
