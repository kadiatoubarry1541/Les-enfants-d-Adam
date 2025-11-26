// Initialisation automatique d'un compte de test au démarrage de l'application
// Ce compte sera TOUJOURS disponible pour tester la connexion

export function initTestAccount() {
  // Vérifier si un compte de test existe déjà
  const testNumeroH = 'G96C1P2R3E2F1 4';
  const existingAccount = localStorage.getItem('dernier_vivant');
  
  let hasTestAccount = false;
  
  if (existingAccount) {
    try {
      const data = JSON.parse(existingAccount);
      if (data.numeroH === testNumeroH) {
        hasTestAccount = true;
        console.log('✅ Compte de test déjà présent');
      }
    } catch (e) {
      console.error('Erreur parsing compte existant');
    }
  }
  
  // Si pas de compte de test, le créer
  if (!hasTestAccount) {
    const testAccount = {
      numeroH: testNumeroH,
      password: 'test123',
      prenom: 'Test',
      nomFamille: 'User',
      email: 'test@example.com',
      type: 'vivant',
      genre: 'HOMME',
      generation: 'G96',
      dateNaissance: '1990-01-01',
      age: 34,
      pays: 'Guinée',
      region: 'Conakry',
      ethnie: 'Soussou',
      langues: ['Français', 'Soussou'],
      statutSocial: 'Célibataire',
      religion: 'Islam',
      situationEco: 'Moyen',
      isActive: true,
      isVerified: true,
      role: 'user',
      parents: [],
      children: [],
      lieuResidence1: 'Conakry, Guinée',
      lieuResidence2: '',
      lieuResidence3: '',
      tel1: '+224 621 00 00 00',
      tel2: '',
      nbFreresMere: 0,
      nbSoeursMere: 0,
      nbFreresPere: 0,
      nbSoeursPere: 0,
      nbFilles: 0,
      nbGarcons: 0,
      nbTantesMaternelles: 0,
      nbTantesPaternelles: 0,
      nbOnclesMaternels: 0,
      nbOnclesPaternels: 0,
      nbCousins: 0,
      nbCousines: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Sauvegarder dans TOUTES les clés pour assurer la disponibilité
    const keys = [
      'dernier_vivant',
      'vivant_written',
      'vivant_video'
    ];
    
    keys.forEach(key => {
      localStorage.setItem(key, JSON.stringify(testAccount));
    });
    
    console.log('✅ Compte de test créé automatiquement');
    console.log('📋 NuméroH: G96C1P2R3E2F1 4');
    console.log('🔐 Mot de passe: test123');
  }
}

// Créer plusieurs comptes de test pour garantir qu'il y en a toujours un disponible
export function ensureTestAccountsExist() {
  const testAccounts = [
    {
      numeroH: 'G0C0P0R0E0F0 0',
      password: 'Neneyaya1',
      prenom: 'Utilisateur',
      nomFamille: 'administrateur',
      role: 'admin',
      isAdmin: true
    },
    {
      numeroH: 'G96C1P2R3E2F1 4',
      password: 'test123',
      prenom: 'Test',
      nomFamille: 'User'
    },
    {
      numeroH: 'G96C1P2R3E2F1 5',
      password: 'test456',
      prenom: 'Démo',
      nomFamille: 'Utilisateur'
    },
    {
      numeroH: 'G96C1P2R3E2F1 6',
      password: 'demo123',
      prenom: 'Exemple',
      nomFamille: 'Compte'
    }
  ];
  
  testAccounts.forEach((account, index) => {
    const fullAccount = {
      ...account,
      email: `${account.numeroH.replace(/\s/g, '')}@test.com`,
      type: 'vivant',
      genre: index === 0 ? 'HOMME' : 'AUTRE', // Admin est HOMME pour voir toutes les sections
      generation: index === 0 ? 'G0' : 'G96',
      dateNaissance: '1990-01-01',
      age: 34,
      pays: 'Guinée',
      isActive: true,
      isVerified: true,
      role: account.role || 'user',
      isAdmin: account.isAdmin || false,
      parents: [],
      children: [],
      lieuResidence1: 'Guinée',
      langues: ['Français'],
      createdAt: new Date().toISOString()
    };
    
    // Sauvegarder dans plusieurs clés pour assurer l'accès
    const keys = [
      `compte_test_${account.numeroH.replace(/\s/g, '_')}`,
      ...(index === 0 ? ['dernier_vivant', 'vivant_written'] : []) // Le compte admin dans les clés principales
    ];
    
    keys.forEach(key => {
      localStorage.setItem(key, JSON.stringify(fullAccount));
      console.log(`✅ Compte créé dans ${key}: ${account.numeroH}`);
    });
  });
  
  // S'assurer qu'au moins un compte est dans 'dernier_vivant'
  const dernierVivant = localStorage.getItem('dernier_vivant');
  if (!dernierVivant) {
    const firstAccount = {
      ...testAccounts[0],
      email: 'test@example.com',
      type: 'vivant',
      genre: 'HOMME',
      generation: 'G96',
      dateNaissance: '1990-01-01',
      age: 34,
      pays: 'Guinée',
      isActive: true,
      isVerified: true,
      role: 'user',
      parents: [],
      children: [],
      lieuResidence1: 'Guinée',
      langues: ['Français'],
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('dernier_vivant', JSON.stringify(firstAccount));
    console.log('✅ Compte principal créé dans dernier_vivant');
  }
}







