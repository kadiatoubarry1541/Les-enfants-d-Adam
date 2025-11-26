// Script pour nettoyer tous les utilisateurs sauf l'admin G0C0P0R0E0F0 0
export function cleanAllUsersExceptAdmin() {
  const adminNumeroH = 'G0C0P0R0E0F0 0';
  const keysToCheck: string[] = [];
  const keysToKeep: string[] = [];
  const keysToDelete: string[] = [];

  // Parcourir toutes les clés localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Liste des clés qui peuvent contenir des utilisateurs
    const userKeysPatterns = [
      'vivant_',
      'defunt_',
      'dernier_',
      'compte_test_',
      'session_user',
      'enfants_',
      'parents_',
      'famille_',
      'activite_',
      'education_',
      'amours_',
      'amis_'
    ];

    const isUserKey = userKeysPatterns.some(pattern => key.includes(pattern));
    
    if (isUserKey) {
      keysToCheck.push(key);
      const raw = localStorage.getItem(key);
      
      if (raw) {
        try {
          const data = JSON.parse(raw);
          const numeroH = data.numeroH || data.numeroHD || data.userData?.numeroH;
          
          if (numeroH === adminNumeroH || numeroH?.replace(/\s+/g, ' ').trim() === adminNumeroH) {
            // Garder cette clé car c'est l'admin
            keysToKeep.push(key);
            console.log(`✅ À conserver: ${key} (admin)`);
          } else {
            // Supprimer cette clé
            keysToDelete.push(key);
            console.log(`❌ À supprimer: ${key} (utilisateur: ${numeroH})`);
          }
        } catch (e) {
          // Si ce n'est pas du JSON valide, on le garde (ne concerne pas les utilisateurs)
          console.log(`⚠️ Clé ignorée (pas JSON): ${key}`);
        }
      }
    }
  }

  // Supprimer les clés identifiées
  let deletedCount = 0;
  keysToDelete.forEach(key => {
    localStorage.removeItem(key);
    deletedCount++;
  });

  console.log(`\n📊 Résumé du nettoyage:`);
  console.log(`   - Clés vérifiées: ${keysToCheck.length}`);
  console.log(`   - Clés conservées (admin): ${keysToKeep.length}`);
  console.log(`   - Clés supprimées: ${deletedCount}`);
  
  return {
    checked: keysToCheck.length,
    kept: keysToKeep.length,
    deleted: deletedCount,
    keptKeys: keysToKeep,
    deletedKeys: keysToDelete
  };
}

// Fonction pour vérifier si l'admin existe toujours
export function verifyAdminExists(): boolean {
  const adminNumeroH = 'G0C0P0R0E0F0 0';
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const numeroH = data.numeroH || data.numeroHD || data.userData?.numeroH;
        
        if (numeroH === adminNumeroH || numeroH?.replace(/\s+/g, ' ').trim() === adminNumeroH) {
          console.log(`✅ Admin trouvé dans: ${key}`);
          return true;
        }
      } catch (e) {
        // Ignore
      }
    }
  }
  
  console.log(`❌ Admin non trouvé!`);
  return false;
}

