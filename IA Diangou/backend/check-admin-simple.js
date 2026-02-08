// Script simple pour vérifier l'admin dans la base
console.log('Démarrage de la vérification...\n');

import('./config/database.js').then(async ({ sequelize }) => {
  try {
    console.log('Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion réussie\n');

    const User = (await import('./src/models/User.js')).default;
    
    console.log('Recherche de l\'utilisateur...');
    const user = await User.findOne({ 
      where: { email: 'kadiatou1541.kb@gmail.com' }
    });

    if (user) {
      console.log('\n✅ UTILISATEUR TROUVÉ !');
      console.log('Email:', user.email);
      console.log('Rôle:', user.role);
      console.log('Actif:', user.isActive);
      console.log('NumeroH:', user.numeroH);
    } else {
      console.log('\n❌ UTILISATEUR NON TROUVÉ');
      console.log('Le compte admin n\'existe pas dans la base de données');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
}).catch(error => {
  console.error('Erreur d\'import:', error.message);
  process.exit(1);
});

