import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface HistorySection {
  id: string;
  title: string;
  description: string;
  content: string;
  images: string[];
  videos: string[];
  documents: string[];
  period: string;
  location: string;
  importance: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export default function Prehistoire() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sections, setSections] = useState<HistorySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSection, setShowCreateSection] = useState(false);
  const [selectedSection, setSelectedSection] = useState<HistorySection | null>(null);
  const navigate = useNavigate();

  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    content: '',
    period: '',
    location: '',
    importance: 'medium' as 'low' | 'medium' | 'high'
  });

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
      loadSections();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const loadSections = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/history/prehistoire/sections', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSections(data.sections || []);
      } else {
        setSections(getDefaultSections());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sections:', error);
      setSections(getDefaultSections());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSections = (): HistorySection[] => [
    {
      id: '1',
      title: 'Les Premiers Habitants de la Guinée',
      description: 'Découvrez les traces des premiers humains qui ont foulé le sol guinéen il y a des milliers d\'années.',
      content: `La préhistoire de la Guinée remonte à plusieurs millénaires. Les premières traces d'occupation humaine datent du Paléolithique inférieur, vers 2,5 millions d'années avant notre ère. 

Les archéologues ont découvert des outils en pierre taillée dans plusieurs sites, notamment dans la région de Kindia et en Guinée forestière. Ces artefacts témoignent de la présence d'hominidés capables de fabriquer des outils rudimentaires.

Au Paléolithique moyen (300 000 - 30 000 ans avant J.-C.), les populations développent des techniques plus sophistiquées. Les bifaces et les racloirs retrouvés montrent une évolution significative des capacités cognitives et techniques.

Le Paléolithique supérieur (30 000 - 10 000 ans avant J.-C.) marque l'apparition de l'art rupestre. Des peintures et gravures ont été découvertes dans des grottes, représentant des animaux et des scènes de chasse.

Cette période préhistorique pose les fondations de l'histoire guinéenne et témoigne de la richesse culturelle de cette région depuis les temps les plus anciens.`,
      images: [],
      videos: [],
      documents: [],
      period: '2,5 millions - 10 000 ans avant J.-C.',
      location: 'Guinée',
      importance: 'high',
      isActive: true,
      createdBy: userData?.numeroH || 'G0C0P0R0E0F0 0',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'L\'Art Rupestre de la Guinée',
      description: 'Exploration des peintures et gravures préhistoriques qui ornent les grottes guinéennes.',
      content: `L'art rupestre de la Guinée constitue un patrimoine exceptionnel de l'humanité. Ces œuvres préhistoriques, datées entre 15 000 et 5 000 ans avant notre ère, révèlent la richesse culturelle et spirituelle des populations anciennes.

Les sites les plus remarquables se trouvent dans les régions montagneuses de Guinée forestière et du Fouta-Djallon. Les peintures utilisent des pigments naturels : ocre rouge, charbon noir, et argile blanche.

Les motifs représentés incluent :
- Des animaux sauvages (éléphants, antilopes, buffles)
- Des scènes de chasse et de cueillette
- Des figures humaines stylisées
- Des symboles géométriques mystérieux

Ces œuvres témoignent d'une cosmogonie complexe et d'un rapport étroit entre l'homme et la nature. Elles constituent les premiers témoignages artistiques de l'humanité en Afrique de l'Ouest.`,
      images: [],
      videos: [],
      documents: [],
      period: '15 000 - 5 000 ans avant J.-C.',
      location: 'Guinée forestière, Fouta-Djallon',
      importance: 'high',
      isActive: true,
      createdBy: 'G0C0P0R0E0F0 0',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Les Outils Préhistoriques',
      description: 'Étude des techniques de fabrication et de l\'évolution des outils en pierre.',
      content: `L'étude des outils préhistoriques de la Guinée révèle une évolution technologique remarquable sur plusieurs millénaires.

**Paléolithique inférieur (2,5 millions - 300 000 ans)**
- Galets aménagés (choppers)
- Bifaces rudimentaires
- Éclats de débitage

**Paléolithique moyen (300 000 - 30 000 ans)**
- Bifaces plus sophistiqués
- Racloirs et grattoirs
- Pointes de lances

**Paléolithique supérieur (30 000 - 10 000 ans)**
- Microlithes
- Harpons en os
- Aiguilles à coudre

Ces outils témoignent de l'adaptation des populations aux changements climatiques et environnementaux. Ils révèlent aussi des échanges culturels avec d'autres régions d'Afrique.`,
      images: [],
      videos: [],
      documents: [],
      period: '2,5 millions - 10 000 ans avant J.-C.',
      location: 'Sites archéologiques de Guinée',
      importance: 'medium',
      isActive: true,
      createdBy: 'G0C0P0R0E0F0 0',
      createdAt: new Date().toISOString()
    }
  ];

  const createSection = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/history/prehistoire/sections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newSection,
          createdBy: userData?.numeroH
        })
      });
      
      if (response.ok) {
        alert('Section créée avec succès !');
        setShowCreateSection(false);
        setNewSection({
          title: '',
          description: '',
          content: '',
          period: '',
          location: '',
          importance: 'medium'
        });
        loadSections();
      } else {
        alert('Erreur lors de la création de la section');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la section');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement de la préhistoire...</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        ← Retour
      </button>

      {/* En-tête professionnel */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="px-8 py-12 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">🦕</div>
                <div>
                  <h1 className="text-5xl font-bold mb-2">Préhistoire</h1>
                  <p className="text-xl text-amber-100">Avant 3000 av. J.-C.</p>
                </div>
              </div>
              <p className="text-lg text-amber-100 max-w-3xl leading-relaxed">
                Explorez les origines de l'humanité en Guinée. Découvrez les premiers habitants, 
                leurs outils, leur art et leur mode de vie à travers les découvertes archéologiques 
                qui révèlent notre passé lointain.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{sections.length}</div>
                  <div className="text-sm text-amber-100">Sections</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowCreateSection(true)}
          className="px-8 py-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
        >
          <span className="text-xl">➕</span>
          <span className="font-semibold">Ajouter une Section</span>
        </button>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl">
          <span className="text-xl">📚</span>
          <span className="font-semibold">Bibliographie</span>
        </button>
        <button className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl">
          <span className="text-xl">🗺️</span>
          <span className="font-semibold">Carte Interactive</span>
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateSection && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl">📝</div>
            <h3 className="text-2xl font-bold text-gray-900">Créer une nouvelle section préhistorique</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Titre de la section</label>
              <input
                type="text"
                value={newSection.title}
                onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                placeholder="Ex: Les Premiers Outils de Pierre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Période spécifique</label>
              <input
                type="text"
                value={newSection.period}
                onChange={(e) => setNewSection({...newSection, period: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                placeholder="Ex: 2,5 millions - 300 000 ans avant J.-C."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Localisation</label>
              <input
                type="text"
                value={newSection.location}
                onChange={(e) => setNewSection({...newSection, location: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                placeholder="Ex: Région de Kindia"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Importance historique</label>
              <select
                value={newSection.importance}
                onChange={(e) => setNewSection({...newSection, importance: e.target.value as any})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
              <textarea
                value={newSection.description}
                onChange={(e) => setNewSection({...newSection, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                rows={3}
                placeholder="Description courte de la section..."
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Contenu détaillé</label>
              <textarea
                value={newSection.content}
                onChange={(e) => setNewSection({...newSection, content: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                rows={8}
                placeholder="Contenu détaillé de la section préhistorique..."
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button
              onClick={createSection}
              className="px-8 py-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              ✅ Créer la Section
            </button>
            <button
              onClick={() => setShowCreateSection(false)}
              className="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold"
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des sections avec design professionnel */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* En-tête de section */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">{section.title}</h3>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span className="font-medium">{section.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <span className="font-medium">{section.location}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-medium ${
                      section.importance === 'high' ? 'bg-red-500' :
                      section.importance === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}>
                      {section.importance === 'high' ? '🔴 Importante' :
                       section.importance === 'medium' ? '🟡 Moyenne' :
                       '🟢 Faible'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSection(section)}
                  className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all duration-200 font-semibold backdrop-blur-sm"
                >
                  📖 Lire la suite
                </button>
              </div>
            </div>
            
            {/* Contenu de section */}
            <div className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{section.description}</p>
              
              {/* Métadonnées */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>📚</span>
                    <span>Section préhistorique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👤</span>
                    <span>{section.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{new Date(section.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium">
                    📷 Images
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium">
                    🎥 Vidéos
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium">
                    📄 Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de lecture détaillée */}
      {selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête modal */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-bold mb-4">{selectedSection.title}</h2>
                  <div className="flex items-center gap-6 text-sm">
                    <span>📅 {selectedSection.period}</span>
                    <span>📍 {selectedSection.location}</span>
                    <span>🦕 Préhistoire</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all duration-200 font-semibold backdrop-blur-sm"
                >
                  ✕ Fermer
                </button>
              </div>
            </div>
            
            {/* Contenu modal */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {selectedSection.content}
                </div>
              </div>
              
              {/* Section médias */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-3">
                    <span className="text-2xl">📷</span>
                    Images ({selectedSection.images.length})
                  </h4>
                  <p className="text-sm text-blue-700">Artéfacts et sites archéologiques</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <h4 className="font-bold text-green-900 mb-3 flex items-center gap-3">
                    <span className="text-2xl">🎥</span>
                    Vidéos ({selectedSection.videos.length})
                  </h4>
                  <p className="text-sm text-green-700">Documentaires et reconstitutions</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    Documents ({selectedSection.documents.length})
                  </h4>
                  <p className="text-sm text-purple-700">Publications scientifiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {sections.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          <div className="text-8xl mb-6">🦕</div>
          <h3 className="text-2xl font-bold mb-4">Aucune section préhistorique</h3>
          <p className="text-lg mb-6">Soyez le premier à contribuer à l'histoire de la préhistoire guinéenne !</p>
          <button
            onClick={() => setShowCreateSection(true)}
            className="px-8 py-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 font-semibold shadow-lg"
          >
            ➕ Créer la première section
          </button>
        </div>
      )}
    </div>
  );
}
