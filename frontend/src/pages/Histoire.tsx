import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface Generation {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
  period: string;
  description: string;
  keyEvents: string[];
  importantFigures: string[];
  culturalDevelopments: string[];
  religiousEvents: string[];
  scientificAdvances: string[];
  images?: string[];
  videos?: string[];
  documents?: string[];
}

export default function Histoire() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchGen, setSearchGen] = useState<string>('');
  const navigate = useNavigate();

  // Calculer les 96 générations depuis Adam (4004 av. J.-C.)
  useEffect(() => {
    const adamYear = -4004; // 4004 av. J.-C.
    const generationLength = 63;
    const calculatedGenerations: Generation[] = [];
    
    for (let gen = 1; gen <= 96; gen++) {
      const startYear = adamYear + (gen - 1) * generationLength;
      const endYear = startYear + generationLength - 1;
      
      calculatedGenerations.push({
        id: gen,
        name: `Génération ${gen}`,
        startYear: startYear,
        endYear: endYear,
        period: `${Math.abs(startYear)} ${startYear < 0 ? 'av. J.-C.' : 'ap. J.-C.'} - ${Math.abs(endYear)} ${endYear < 0 ? 'av. J.-C.' : 'ap. J.-C.'}`,
        description: getGenerationDescription(gen),
        keyEvents: getKeyEvents(gen),
        importantFigures: getImportantFigures(gen),
        culturalDevelopments: getCulturalDevelopments(gen),
        religiousEvents: getReligiousEvents(gen),
        scientificAdvances: getScientificAdvances(gen)
      });
    }
    
    setGenerations(calculatedGenerations);
    setLoading(false);
  }, []);

  useEffect(() => {
    const session = localStorage.getItem("session_user");
    if (!session) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(session);
      const user = parsed.userData || parsed;
      if (!user || !user.numeroH) {
        navigate("/login");
        return;
      }
      
      setUserData(user);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const getGenerationDescription = (gen: number): string => {
    if (gen === 1) return "Les premiers enfants d'Adam et Ève, fondateurs de l'humanité selon la tradition biblique et coranique.";
    if (gen <= 10) return "Période des patriarches bibliques, développement des premières civilisations.";
    if (gen <= 20) return "Émergence des premières grandes civilisations (Mésopotamie, Égypte, Indus).";
    if (gen <= 30) return "Âge du bronze, développement de l'écriture et des premières villes.";
    if (gen <= 40) return "Âge du fer, expansion des empires et développement des religions monothéistes.";
    if (gen <= 50) return "Période classique, développement de la philosophie et des sciences.";
    if (gen <= 60) return "Moyen Âge, expansion de l'Islam et développement des sciences arabes.";
    if (gen <= 70) return "Renaissance et découvertes géographiques, développement des sciences.";
    if (gen <= 80) return "Révolution industrielle et scientifique, colonisation européenne.";
    if (gen <= 90) return "XXe siècle, guerres mondiales et indépendances africaines.";
    if (gen <= 96) return "Époque contemporaine, mondialisation et développement technologique.";
    return "Période de développement de l'humanité.";
  };

  const getKeyEvents = (gen: number): string[] => {
    const events: string[] = [];
    
    if (gen === 1) events.push("Naissance de Caïn et Abel", "Premier meurtre de l'histoire", "Fondation de la première famille");
    if (gen === 2) events.push("Naissance de Seth", "Continuation de la lignée adamique", "Développement de l'agriculture");
    if (gen === 3) events.push("Naissance d'Énosch", "Premiers cultes religieux", "Développement de l'élevage");
    
    // Période des patriarches
    if (gen >= 4 && gen <= 10) {
      events.push("Période des patriarches bibliques", "Développement de l'agriculture", "Premières migrations humaines");
    }
    
    // Premières civilisations
    if (gen >= 11 && gen <= 20) {
      events.push("Fondation de Sumer", "Construction des premières pyramides", "Développement de l'écriture cunéiforme");
    }
    
    // Âge du bronze
    if (gen >= 21 && gen <= 30) {
      events.push("Développement de l'âge du bronze", "Construction de Stonehenge", "Premières lois écrites");
    }
    
    // Âge du fer et empires
    if (gen >= 31 && gen <= 40) {
      events.push("Développement de l'âge du fer", "Fondation de Rome", "Naissance de Bouddha");
    }
    
    // Période classique
    if (gen >= 41 && gen <= 50) {
      events.push("Naissance de Jésus-Christ", "Expansion de l'Empire romain", "Développement de la philosophie grecque");
    }
    
    // Moyen Âge
    if (gen >= 51 && gen <= 60) {
      events.push("Naissance de l'Islam", "Expansion musulmane", "Développement des sciences arabes");
    }
    
    // Renaissance
    if (gen >= 61 && gen <= 70) {
      events.push("Renaissance européenne", "Découverte de l'Amérique", "Révolution scientifique");
    }
    
    // Révolution industrielle
    if (gen >= 71 && gen <= 80) {
      events.push("Révolution industrielle", "Colonisation de l'Afrique", "Développement des sciences modernes");
    }
    
    // XXe siècle
    if (gen >= 81 && gen <= 90) {
      events.push("Première Guerre mondiale", "Indépendances africaines", "Développement technologique");
    }
    
    // Époque contemporaine
    if (gen >= 91 && gen <= 96) {
      events.push("Mondialisation", "Révolution numérique", "Développement durable");
    }
    
    return events.slice(0, 5);
  };

  const getImportantFigures = (gen: number): string[] => {
    const figures: string[] = [];
    
    // Génération 1 - Adam et Ève
    if (gen === 1) figures.push("Adam (Prophète)", "Ève", "Caïn", "Abel");
    
    // Génération 2 - Seth
    if (gen === 2) figures.push("Seth", "Énosch");
    
    // Prophètes bibliques et patriarches (Générations 3-10)
    if (gen >= 3 && gen <= 10) {
      figures.push("Noé (Prophète)", "Abraham (Prophète)", "Isaac (Prophète)", "Jacob (Prophète)", "Joseph (Prophète)");
    }
    
    // Prophètes et rois de l'Antiquité (Générations 11-30)
    if (gen >= 11 && gen <= 30) {
      figures.push("Hammurabi (Roi)", "Moïse (Prophète)", "David (Roi-Prophète)", "Salomon (Roi)", "Cyrus le Grand (Roi)", "Élie (Prophète)", "Élisée (Prophète)");
    }
    
    // Prophètes et philosophes classiques (Générations 31-50)
    if (gen >= 31 && gen <= 50) {
      figures.push("Socrate (Philosophe)", "Platon (Philosophe)", "Aristote (Philosophe)", "Alexandre le Grand (Roi)", "Jules César (Empereur)", "Jésus-Christ (Prophète)", "Jean-Baptiste (Prophète)");
    }
    
    // Prophètes islamiques et califes (Générations 51-60)
    if (gen >= 51 && gen <= 60) {
      figures.push("Muhammad (PBSL) (Prophète)", "Abu Bakr (Calife)", "Umar (Calife)", "Ali (Calife)", "Khalid ibn al-Walid (Général)", "Uthman (Calife)", "Hassan (Calife)", "Hussein (Calife)");
    }
    
    // Savants et artistes de la Renaissance (Générations 61-70)
    if (gen >= 61 && gen <= 70) {
      figures.push("Léonard de Vinci (Savant)", "Michel-Ange (Artiste)", "Galilée (Savant)", "Copernic (Savant)", "Martin Luther (Réformateur)", "Newton (Savant)", "Descartes (Philosophe)");
    }
    
    // Savants et dirigeants modernes (Générations 71-80)
    if (gen >= 71 && gen <= 80) {
      figures.push("Napoléon Bonaparte (Empereur)", "Charles Darwin (Savant)", "Louis Pasteur (Savant)", "Thomas Edison (Savant)", "Marie Curie (Savante)", "Einstein (Savant)", "Tesla (Savant)");
    }
    
    // Présidents et dirigeants contemporains (Générations 81-90)
    if (gen >= 81 && gen <= 90) {
      figures.push("Winston Churchill (Premier Ministre)", "Franklin Roosevelt (Président)", "Staline (Dirigeant)", "Hitler (Dictateur)", "Mahatma Gandhi (Dirigeant)", "Martin Luther King (Dirigeant)", "Nelson Mandela (Président)");
    }
    
    // Présidents et dirigeants africains (Générations 70-96)
    if (gen >= 70 && gen <= 96) {
      figures.push("Samori Touré (Résistant)", "El Hadj Oumar Tall (Chef religieux)", "Ahmadou Bamba (Chef religieux)", "Modibo Keita (Président Mali)", "Sékou Touré (Président Guinée)", "Léopold Sédar Senghor (Président Sénégal)", "Kwame Nkrumah (Président Ghana)", "Patrice Lumumba (Premier Ministre)", "Thomas Sankara (Président Burkina Faso)");
    }
    
    // Rois et empereurs africains historiques
    if (gen >= 50 && gen <= 80) {
      figures.push("Soundiata Keita (Empereur Mali)", "Mansa Musa (Empereur Mali)", "Askia Mohammed (Empereur Songhaï)", "Chaka Zoulou (Roi)", "Menelik II (Empereur Éthiopie)", "Samori Touré (Roi Wassoulou)");
    }
    
    // Savants musulmans historiques
    if (gen >= 52 && gen <= 70) {
      figures.push("Al-Kindi (Savant)", "Al-Farabi (Savant)", "Ibn Sina (Avicenne) (Savant)", "Al-Biruni (Savant)", "Ibn Rushd (Averroès) (Savant)", "Al-Ghazali (Savant)", "Ibn Khaldun (Savant)");
    }
    
    // Prophètes mineurs bibliques
    if (gen >= 20 && gen <= 40) {
      figures.push("Isaïe (Prophète)", "Jérémie (Prophète)", "Ézéchiel (Prophète)", "Daniel (Prophète)", "Osée (Prophète)", "Joël (Prophète)", "Amos (Prophète)");
    }
    
    return figures.slice(0, 8);
  };

  const getCulturalDevelopments = (gen: number): string[] => {
    const developments: string[] = [];
    
    if (gen <= 10) developments.push("Développement de l'agriculture", "Premières formes d'art", "Traditions orales");
    if (gen >= 11 && gen <= 20) developments.push("Invention de l'écriture", "Architecture monumentale", "Premières religions");
    if (gen >= 21 && gen <= 30) developments.push("Développement de la métallurgie", "Artisanat spécialisé", "Commerce à longue distance");
    if (gen >= 31 && gen <= 40) developments.push("Philosophie grecque", "Art romain", "Développement des langues");
    if (gen >= 41 && gen <= 50) developments.push("Architecture chrétienne", "Manuscrits enluminés", "Musique religieuse");
    if (gen >= 51 && gen <= 60) developments.push("Art islamique", "Calligraphie arabe", "Architecture mauresque");
    if (gen >= 61 && gen <= 70) developments.push("Renaissance artistique", "Musique classique", "Littérature moderne");
    if (gen >= 71 && gen <= 80) developments.push("Romantisme", "Impressionnisme", "Littérature réaliste");
    if (gen >= 81 && gen <= 90) developments.push("Modernisme", "Cinéma", "Musique jazz");
    if (gen >= 91 && gen <= 96) developments.push("Art contemporain", "Musique électronique", "Cinéma numérique");
    
    return developments.slice(0, 4);
  };

  const getReligiousEvents = (gen: number): string[] => {
    const events: string[] = [];
    
    if (gen === 1) events.push("Création d'Adam et Ève", "Premier péché", "Promesse de rédemption");
    if (gen <= 10) events.push("Période des patriarches", "Alliance avec Abraham", "Développement du monothéisme");
    if (gen >= 11 && gen <= 20) events.push("Sortie d'Égypte", "Don de la Torah", "Construction du Temple");
    if (gen >= 21 && gen <= 30) events.push("Prophètes d'Israël", "Exil à Babylone", "Retour à Jérusalem");
    if (gen >= 31 && gen <= 40) events.push("Naissance de Jésus-Christ", "Ministère de Jésus", "Crucifixion et Résurrection");
    if (gen >= 41 && gen <= 50) events.push("Expansion du christianisme", "Persécutions romaines", "Édits de tolérance");
    if (gen >= 51 && gen <= 60) events.push("Naissance de l'Islam", "Hégire", "Expansion musulmane");
    if (gen >= 61 && gen <= 70) events.push("Réforme protestante", "Contre-Réforme", "Guerres de religion");
    if (gen >= 71 && gen <= 80) events.push("Sécularisation", "Missionnaires en Afrique", "Développement des églises africaines");
    if (gen >= 81 && gen <= 90) events.push("Mouvements religieux modernes", "Dialogue interreligieux", "Libération théologique");
    if (gen >= 91 && gen <= 96) events.push("Islam en Afrique", "Christianisme africain", "Traditions religieuses");
    
    return events.slice(0, 4);
  };

  const getScientificAdvances = (gen: number): string[] => {
    const advances: string[] = [];
    
    if (gen <= 10) advances.push("Découverte du feu", "Outils en pierre", "Premières techniques agricoles");
    if (gen >= 11 && gen <= 20) advances.push("Invention de la roue", "Métallurgie du cuivre", "Astronomie primitive");
    if (gen >= 21 && gen <= 30) advances.push("Âge du bronze", "Navigation maritime", "Mathématiques babyloniennes");
    if (gen >= 31 && gen <= 40) advances.push("Âge du fer", "Géométrie grecque", "Médecine hippocratique");
    if (gen >= 41 && gen <= 50) advances.push("Architecture romaine", "Ingénierie hydraulique", "Astronomie ptolémaïque");
    if (gen >= 51 && gen <= 60) advances.push("Sciences arabes", "Algèbre", "Médecine islamique");
    if (gen >= 61 && gen <= 70) advances.push("Révolution copernicienne", "Télescope", "Microscope");
    if (gen >= 71 && gen <= 80) advances.push("Révolution scientifique", "Lois de Newton", "Découverte de l'électricité");
    if (gen >= 81 && gen <= 90) advances.push("Théorie de l'évolution", "Radioactivité", "Relativité");
    if (gen >= 91 && gen <= 96) advances.push("Physique quantique", "Génétique", "Technologies numériques");
    
    return advances.slice(0, 4);
  };

  // Ressources réelles (articles/images/vidéos) soigneusement choisies pour éviter toute apparition de cheveux féminins
  function getRealResources(genId: number): { title: string; url: string; type: 'article' | 'image' | 'video' }[] {
    // Reorganisation par grandes périodes
    if (genId >= 1 && genId <= 10) {
      return [
        { title: "Tablettes d'écriture cunéiforme (Musée britannique)", url: "https://www.britishmuseum.org/collection/object/W_1923-1112-1", type: 'image' },
        { title: "Grottes de Lascaux (art rupestre)", url: "https://www.lascaux.fr/fr", type: 'article' },
        { title: "Manuscrits de la mer Morte (bibliothèque numérique)", url: "https://www.deadseascrolls.org.il/", type: 'image' }
      ]
    }
    if (genId >= 11 && genId <= 20) {
      return [
        { title: "Pyramides d'Égypte (Musée d'Égypte)", url: "https://egypt-museum.com/", type: 'article' },
        { title: "Ziggourat d'Ur (restitution et fouilles)", url: "https://oi.uchicago.edu/research/projects/ur-ancient-city-mesopotamia", type: 'article' },
        { title: "Hiéroglyphes et stèles (Musée du Louvre)", url: "https://collections.louvre.fr/", type: 'image' }
      ]
    }
    if (genId >= 21 && genId <= 40) {
      return [
        { title: "Parthénon et art classique (Musée de l'Acropole)", url: "https://www.theacropolismuseum.gr/en", type: 'image' },
        { title: "Empire achéménide à Persépolis (ICHTO Iran)", url: "https://whc.unesco.org/en/list/114/", type: 'article' },
        { title: "Bouddhisme ancien — stupas et manuscrits", url: "https://www.britannica.com/topic/stupa", type: 'article' }
      ]
    }
    if (genId >= 41 && genId <= 60) {
      return [
        { title: "Manuscrits bibliques et évangéliaires (Gallica)", url: "https://gallica.bnf.fr/accueil/fr/content/accueil-fr?mode=desktop", type: 'image' },
        { title: "Calligraphie et Corans anciens (Musée d'art islamique)", url: "https://mia.org.qa/en/", type: 'image' },
        { title: "Hégire et premiers siècles de l'Islam (UNESCO)", url: "https://fr.unesco.org/silkroad/", type: 'article' }
      ]
    }
    if (genId >= 61 && genId <= 80) {
      return [
        { title: "Codex de Léonard de Vinci (Bibliothèque britannique)", url: "https://www.bl.uk/collection-guides/leonardo-da-vinci", type: 'image' },
        { title: "Observations de Galilée (Sidereus Nuncius)", url: "https://brunelleschi.imss.fi.it/galileopalazzo/", type: 'article' },
        { title: "Mali impérial: Mansa Musa et Tombouctou (UNESCO)", url: "https://whc.unesco.org/fr/list/119/", type: 'article' }
      ]
    }
    if (genId >= 81 && genId <= 96) {
      return [
        { title: "Manuscrits de Tombouctou (bibliothèques)", url: "https://www.hypotheses.org/31606", type: 'image' },
        { title: "Discours de Mandela (Fondation Nelson Mandela)", url: "https://www.nelsonmandela.org/collections/digital-archives", type: 'article' },
        { title: "Archives coloniales et indépendances (INA)", url: "https://www.ina.fr/", type: 'video' }
      ]
    }
    // Défaut — ressources généralistes fiables
    return [
      { title: "UNESCO — Patrimoine mondial", url: "https://whc.unesco.org/fr/list/", type: 'article' },
      { title: "Musée britannique — Collections", url: "https://www.britishmuseum.org/collection", type: 'image' },
      { title: "Bibliothèque nationale de France — Gallica", url: "https://gallica.bnf.fr/", type: 'article' }
    ]
  }


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement de l'histoire...</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📚 Histoire de l'Humanité</h1>
              <p className="mt-2 text-gray-600">De 4004 av. J.-C. à nos jours - {userData.prenom} fait partie de la Génération {userData.generation || '96'}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/histoire-humanite')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                📚 Histoire de l'Humanité
              </button>
              <button
                onClick={() => navigate('/a-retenir')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                📖 À Retenir
              </button>
              <button
                onClick={() => navigate('/moi')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                ← Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Toutes les sections sur une seule page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Section Générations */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>👑</span>
              <span>Les 96 Générations de l'Humanité</span>
            </h2>
              
              {/* Saut rapide vers une génération */}
              <div className="mb-6 flex gap-4 items-center">
                <label className="font-semibold">Aller à la génération:</label>
                <input
                  type="number"
                  min={1}
                  max={96}
                  placeholder="1 - 96"
                  value={searchGen}
                  onChange={(e) => setSearchGen(e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    const n = parseInt(searchGen, 10);
                    if (!isNaN(n) && n >= 1 && n <= 96) {
                      const found = generations.find(g => g.id === n);
                      if (found) setSelectedGeneration(found);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generations.map(gen => (
                  <div 
                    key={gen.id} 
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedGeneration(gen)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{gen.name}</h3>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
                        {gen.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{gen.period}</p>
                    <p className="text-gray-600 text-sm mb-3">{gen.description}</p>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        📅 {gen.keyEvents[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        👑 {gen.importantFigures[0]}
                      </div>
                    </div>
              </div>
                ))}
              </div>
            </div>
          </div>

        {/* Section Chronologie */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span>📅</span>
              <span>Chronologie Générale de l'Humanité</span>
            </h2>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">🏛️ Antiquité (Générations 1-50)</h3>
                  <p className="text-blue-800">De Adam et Ève jusqu'à la chute de l'Empire romain</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-2">🕌 Moyen Âge (Générations 51-70)</h3>
                  <p className="text-green-800">De l'expansion de l'Islam jusqu'à la Renaissance</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-900 mb-2">⚙️ Époque Moderne (Générations 71-90)</h3>
                  <p className="text-purple-800">De la Révolution industrielle aux guerres mondiales</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-xl font-bold text-orange-900 mb-2">🌍 Époque Contemporaine (Générations 91-96)</h3>
                  <p className="text-orange-800">De la mondialisation à nos jours</p>
                </div>
              </div>
            </div>
          </div>

        {/* Section Personnages */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span>👑</span>
              <span>Grandes Figures de l'Histoire</span>
            </h2>
              
        <div className="space-y-8">
                {/* Prophètes */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🕌 Prophètes et Messagers Divins
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-bold text-blue-900">Adam (Prophète)</h4>
                      <p className="text-sm text-blue-800">Premier homme et prophète selon la tradition</p>
                      <span className="text-xs text-blue-600">Génération 1</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-bold text-blue-900">Noé (Prophète)</h4>
                      <p className="text-sm text-blue-800">Prophète du Déluge et constructeur de l'Arche</p>
                      <span className="text-xs text-blue-600">Génération 6</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-bold text-blue-900">Abraham (Prophète)</h4>
                      <p className="text-sm text-blue-800">Père des trois religions monothéistes</p>
                      <span className="text-xs text-blue-600">Génération 8</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-bold text-blue-900">Moïse (Prophète)</h4>
                      <p className="text-sm text-blue-800">Libérateur d'Israël et receveur des Tables de la Loi</p>
                      <span className="text-xs text-blue-600">Génération 12</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-bold text-blue-900">Jésus-Christ (Prophète)</h4>
                      <p className="text-sm text-blue-800">Messie et fondateur du christianisme</p>
                      <span className="text-xs text-blue-600">Génération 44</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-bold text-blue-900">Muhammad (PBSL)</h4>
                      <p className="text-sm text-blue-800">Dernier prophète et fondateur de l'Islam</p>
                      <span className="text-xs text-blue-600">Génération 52</span>
                    </div>
                  </div>
                </div>

                {/* Figures Africaines */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🌍 Figures Africaines Importantes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-bold text-green-900">Soundiata Keita (Empereur)</h4>
                      <p className="text-sm text-green-800">Fondateur de l'Empire du Mali</p>
                      <span className="text-xs text-green-600">Génération 65</span>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-bold text-green-900">Mansa Musa (Empereur)</h4>
                      <p className="text-sm text-green-800">Empereur du Mali, l'homme le plus riche de l'histoire</p>
                      <span className="text-xs text-green-600">Génération 68</span>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-bold text-green-900">Samori Touré (Résistant)</h4>
                      <p className="text-sm text-green-800">Résistant et fondateur de l'Empire Wassoulou</p>
                      <span className="text-xs text-green-600">Génération 78</span>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-bold text-green-900">El Hadj Oumar Tall (Chef religieux)</h4>
                      <p className="text-sm text-green-800">Chef religieux et conquérant peulh</p>
                      <span className="text-xs text-green-600">Génération 76</span>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-bold text-green-900">Ahmadou Bamba (Chef religieux)</h4>
                      <p className="text-sm text-green-800">Fondateur du mouridisme</p>
                      <span className="text-xs text-green-600">Génération 79</span>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-bold text-green-900">Sékou Touré (Président)</h4>
                      <p className="text-sm text-green-800">Premier président de la Guinée</p>
                      <span className="text-xs text-green-600">Génération 85</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Section Culture */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span>🎭</span>
              <span>Développement Culturel de l'Humanité</span>
            </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🏛️ Arts et Architecture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-bold text-purple-900">Art Rupestre</h4>
                      <p className="text-sm text-purple-800">Premières expressions artistiques de l'humanité</p>
                      <span className="text-xs text-purple-600">Générations 1-5</span>
                  </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-bold text-purple-900">Architecture Monumentale</h4>
                      <p className="text-sm text-purple-800">Pyramides, ziggourats, temples</p>
                      <span className="text-xs text-purple-600">Générations 11-20</span>
                        </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-bold text-purple-900">Art Islamique</h4>
                      <p className="text-sm text-purple-800">Calligraphie, géométrie, architecture mauresque</p>
                      <span className="text-xs text-purple-600">Générations 51-60</span>
                      </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-bold text-purple-900">Renaissance</h4>
                      <p className="text-sm text-purple-800">Renaissance artistique européenne</p>
                      <span className="text-xs text-purple-600">Générations 61-70</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🌍 Cultures Africaines</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="font-bold text-orange-900">Empires Peulhs</h4>
                      <p className="text-sm text-orange-800">Macina, Sokoto, Fouta Djallon</p>
                      <span className="text-xs text-orange-600">Générations 70-80</span>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="font-bold text-orange-900">Empires Malinkés</h4>
                      <p className="text-sm text-orange-800">Mali, Songhaï, Kaabu</p>
                      <span className="text-xs text-orange-600">Générations 65-75</span>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="font-bold text-orange-900">Traditions Oratoires</h4>
                      <p className="text-sm text-orange-800">Griots, épopées, contes</p>
                      <span className="text-xs text-orange-600">Toutes générations</span>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="font-bold text-orange-900">Artisanat Traditionnel</h4>
                      <p className="text-sm text-orange-800">Bogolan, sculpture, tissage</p>
                      <span className="text-xs text-orange-600">Toutes générations</span>
                    </div>
                  </div>
                </div>
              </div>
        </div>
          </div>
      </div>

      {/* Modal de détail d'une génération */}
      {selectedGeneration && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedGeneration.name}</h2>
                  <p className="text-lg opacity-90">{selectedGeneration.period}</p>
              </div>
              <button
                  onClick={() => setSelectedGeneration(null)}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors duration-200"
              >
                ✕ Fermer
              </button>
            </div>
          </div>
          
          <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">📝 Description</h3>
                  <p className="text-gray-700">{selectedGeneration.description}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">📅 Événements Clés</h3>
                  <ul className="space-y-2">
                    {selectedGeneration.keyEvents.map((event, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-gray-700">{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">👑 Personnages Importants</h3>
                  <ul className="space-y-2">
                    {selectedGeneration.importantFigures.map((figure, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-gray-700">{figure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">🎭 Développements Culturels</h3>
                  <ul className="space-y-2">
                    {selectedGeneration.culturalDevelopments.map((dev, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span className="text-gray-700">{dev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">🕌 Événements Religieux</h3>
                  <ul className="space-y-2">
                    {selectedGeneration.religiousEvents.map((event, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span className="text-gray-700">{event}</span>
                      </li>
                    ))}
                  </ul>
            </div>
            
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">🔬 Avancées Scientifiques</h3>
                  <ul className="space-y-2">
                    {selectedGeneration.scientificAdvances.map((advance, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-gray-700">{advance}</span>
                      </li>
                    ))}
                  </ul>
              </div>

                {/* Ressources réelles */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">🔗 Ressources réelles</h3>
                  <ul className="space-y-2">
                    {getRealResources(selectedGeneration.id).map((r, idx) => (
                      <li key={idx}>
                        <a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                          {r.type === 'article' ? '📄' : r.type === 'image' ? '🖼️' : '🎥'} {r.title}
                        </a>
                      </li>
                    ))}
                  </ul>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}