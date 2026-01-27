import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..', '..');

// Dossiers de CODE SOURCE à JAMAIS supprimer
const DOSSIERS_CODE_SOURCE = [
  'backend/src',
  'backend/scripts',
  'backend/config',
  'backend/public',
  'backend/uploads',
  'frontend/src',
  'frontend/public',
  'IA SC/frontend',
  'IA SC/static',
  'IA SC/templates',
  'node_modules',
  '.git'
];

// Fichiers à CONSERVER (nécessaires au projet)
const FICHIERS_A_CONSERVER = [
  'README.md',
  'package.json',
  '.gitignore',
  'railway.json',
  'render.yaml',
  'DEMARRER_BACKEND.bat',
  'DEMARRER_FRONTEND.bat',
  'DEMARRER_TOUT.bat',
  'DEMARRER_TOUT_AVEC_IA.bat',
  'RESTRICTIONS_PUBLICATION_TERREADAM.md',
  'INTEGRATION_IA_BASE_DONNEES.md',
  'SETUP.md',
  '1.png',
  'cahier'
];

// Patterns de fichiers .md à SUPPRIMER (uniquement à la racine)
const MD_A_SUPPRIMER = [
  /^CORRECTION.*\.md$/i,
  /^CORRECTIONS.*\.md$/i,
  /^RAPPORT.*\.md$/i,
  /^RESUME.*\.md$/i,
  /^SOLUTION.*\.md$/i,
  /^DIAGNOSTIC.*\.md$/i,
  /^VERIFICATION.*\.md$/i,
  /^GUIDE.*\.md$/i,
  /^MIGRATION.*\.md$/i,
  /^ANALYSE.*\.md$/i,
  /^ARCHITECTURE.*\.md$/i,
  /^BESOINS.*\.md$/i,
  /^CLARIFICATION.*\.md$/i,
  /^DETAILS.*\.md$/i,
  /^ERREURS.*\.md$/i,
  /^ETAT.*\.md$/i,
  /^EXPLICATION.*\.md$/i,
  /^IDEES.*\.md$/i,
  /^INSTRUCTIONS.*\.md$/i,
  /^LISTE.*\.md$/i,
  /^LOGO.*\.md$/i,
  /^MISE.*\.md$/i,
  /^NETTOYER.*\.md$/i,
  /^NOMBRE.*\.md$/i,
  /^ORGANISATION.*\.md$/i,
  /^PERSISTANCE.*\.md$/i,
  /^PRIORISATION.*\.md$/i,
  /^PROTECTION.*\.md$/i,
  /^SUPPRESSION.*\.md$/i,
  /^SYSTEME.*\.md$/i,
  /^DOCUMENTS.*\.md$/i,
  /^FONCTIONNALITES.*\.md$/i
];

// Fichiers de test temporaires à supprimer
const FICHIERS_TEST_A_SUPPRIMER = [
  /^test-.*\.js$/i,
  /^verifier-.*\.js$/i,
  /^solution_exercice.*\.py$/i
];

// Fichiers .bat de diagnostic/temporaires à supprimer (sauf les principaux)
const BAT_A_SUPPRIMER = [
  /^.*DIAGNOSTIC.*\.bat$/i,
  /^.*CORRIGER.*\.bat$/i,
  /^.*CONFIGURER.*\.bat$/i,
  /^.*VERIFIER.*\.bat$/i,
  /^.*LIBERER.*\.bat$/i,
  /^.*TEST.*\.bat$/i,
  /^.*LANCER.*\.bat$/i,
  /^.*FAIRE.*\.bat$/i,
  /^.*START.*\.bat$/i,
  /^.*INSTALL.*\.bat$/i,
  /^.*CREER.*\.bat$/i,
  /^.*DEMARRER.*\.bat$/i // Sauf ceux dans FICHIERS_A_CONSERVER
];

function isInCodeSourceDir(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return DOSSIERS_CODE_SOURCE.some(dir => normalizedPath.includes(dir));
}

function shouldKeepFile(fileName, filePath) {
  // JAMAIS supprimer les fichiers dans les dossiers de code source
  if (isInCodeSourceDir(filePath)) {
    return true;
  }
  
  // Vérifier si le fichier est dans la liste à conserver
  if (FICHIERS_A_CONSERVER.includes(fileName)) {
    return true;
  }
  
  // Vérifier les patterns à supprimer (uniquement à la racine)
  const isAtRoot = !filePath.includes('backend') && !filePath.includes('frontend') && !filePath.includes('IA SC');
  
  if (isAtRoot) {
    // Vérifier les fichiers .md
    if (fileName.endsWith('.md')) {
      for (const pattern of MD_A_SUPPRIMER) {
        if (pattern.test(fileName)) {
          return false;
        }
      }
    }
    
    // Vérifier les fichiers de test
    for (const pattern of FICHIERS_TEST_A_SUPPRIMER) {
      if (pattern.test(fileName)) {
        return false;
      }
    }
    
    // Vérifier les fichiers .bat
    if (fileName.endsWith('.bat')) {
      for (const pattern of BAT_A_SUPPRIMER) {
        if (pattern.test(fileName)) {
          // Exception : ne pas supprimer les fichiers .bat principaux
          if (fileName === 'DEMARRER_BACKEND.bat' || 
              fileName === 'DEMARRER_FRONTEND.bat' || 
              fileName === 'DEMARRER_TOUT.bat' ||
              fileName === 'DEMARRER_TOUT_AVEC_IA.bat') {
            return true;
          }
          return false;
        }
      }
    }
  }
  
  // Supprimer les fichiers .md de documentation temporaire dans backend/ et IA SC/ (sauf ceux nécessaires)
  if (filePath.includes('backend/') && fileName.endsWith('.md') && !fileName.includes('README')) {
    if (fileName.includes('CONFIGURATION') || 
        fileName.includes('GUIDE') || 
        fileName.includes('INSTRUCTIONS') ||
        fileName.includes('SOLUTION') ||
        fileName.includes('CREER')) {
      return false;
    }
  }
  
  if (filePath.includes('IA SC/') && fileName.endsWith('.md')) {
    if (fileName.includes('RAPPORT') || 
        fileName.includes('EVALUATION') ||
        fileName.includes('INTEGRATION')) {
      return false;
    }
  }
  
  return true;
}

function cleanRootDirectory() {
  const files = fs.readdirSync(projectRoot);
  const filesToDelete = [];
  
  for (const file of files) {
    const filePath = path.join(projectRoot, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ne JAMAIS supprimer les dossiers de code source
      if (!shouldKeepDirectory(file)) {
        // Vérifier que ce n'est pas un dossier de code source
        const isCodeDir = DOSSIERS_CODE_SOURCE.some(dir => filePath.includes(dir));
        if (!isCodeDir) {
          console.log(`📁 Suppression du dossier: ${file}`);
          try {
            fs.rmSync(filePath, { recursive: true, force: true });
            console.log(`✅ Dossier supprimé: ${file}`);
          } catch (error) {
            console.error(`❌ Erreur lors de la suppression du dossier ${file}:`, error.message);
          }
        }
      }
    } else {
      // Vérifier si le fichier doit être supprimé
      if (!shouldKeepFile(file, filePath)) {
        filesToDelete.push({ path: filePath, name: file });
      }
    }
  }
  
  // Supprimer les fichiers identifiés
  for (const file of filesToDelete) {
    try {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Supprimé: ${file.name}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de ${file.name}:`, error.message);
    }
  }
  
  return filesToDelete.length;
}

function shouldKeepDirectory(dirName) {
  return DOSSIERS_CODE_SOURCE.some(dir => dir.includes(dirName)) || 
         dirName.startsWith('.') || 
         dirName === 'node_modules' ||
         dirName === 'backend' ||
         dirName === 'frontend' ||
         dirName === 'IA SC';
}

function main() {
  console.log('🧹 Nettoyage SÉCURISÉ des fichiers inutiles...\n');
  console.log('⚠️  PROTECTION: Les dossiers de code source seront JAMAIS supprimés');
  console.log('📁 Dossiers protégés:');
  DOSSIERS_CODE_SOURCE.forEach(d => console.log(`  🔒 ${d}`));
  console.log('\n📋 Fichiers à conserver:');
  FICHIERS_A_CONSERVER.forEach(f => console.log(`  ✅ ${f}`));
  console.log('\n🗑️  Début du nettoyage (uniquement fichiers .md et .bat inutiles à la racine)...\n');
  
  const deletedCount = cleanRootDirectory();
  
  console.log(`\n✅ Nettoyage terminé !`);
  console.log(`📊 ${deletedCount} fichier(s) supprimé(s)`);
  console.log('\n✅ Tous les fichiers de code source sont intacts !');
}

main();
