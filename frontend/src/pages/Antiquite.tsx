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

export default function Antiquite() {
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
      const response = await fetch('/api/history/antiquite/sections', {
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
      title: 'L\'Empire du Ghana et la Guinée',
      description: 'Découvrez l\'influence de l\'Empire du Ghana sur les territoires de l\'actuelle Guinée.',
      content: `L'Empire du Ghana, également connu sous le nom d'Empire du Wagadou, a exercé une influence considérable sur les territoires de l'actuelle Guinée entre le VIIIe et le XIe siècle.

**Origines et Expansion**
L'Empire du Ghana s'est développé autour de la ville de Koumbi Saleh, dans l'actuel Mali. Son influence s'étendait jusqu'aux régions de Haute-Guinée et de Guinée forestière, où les populations locales ont adopté certaines pratiques administratives et commerciales.

**Organisation Politique**
L'empire était dirigé par un roi (Ghana) qui contrôlait le commerce de l'or. Les territoires guinéens servaient de zones de transit pour les caravanes transportant l'or vers le nord.

**Impact Culturel**
- Introduction de techniques agricoles avancées
- Développement du commerce transsaharien
- Influence sur l'organisation sociale des populations locales
- Transmission de connaissances métallurgiques

**Déclin et Héritage**
L'effondrement de l'Empire du Ghana au XIe siècle a laissé un vide politique que les populations guinéennes ont comblé en développant leurs propres structures politiques et commerciales.`,
      images: [],
      videos: [],
      documents: [],
      period: 'VIIIe - XIe siècle',
      location: 'Haute-Guinée, Guinée forestière',
      importance: 'high',
      isActive: true,
      createdBy: userData?.numeroH || 'G0C0P0R0E0F0 0',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Les Royaumes Mandingues',
      description: 'Exploration des premiers royaumes mandingues qui ont émergé en Guinée.',
      content: `Les royaumes mandingues représentent une étape cruciale dans l'histoire de la Guinée antique. Ces entités politiques ont émergé à partir du XIIe siècle et ont façonné la culture et l'organisation sociale de la région.

**Le Royaume de Sosso**
Le Royaume de Sosso, dirigé par Soumaoro Kanté, a été l'un des premiers royaumes mandingues importants. Il contrôlait une grande partie de l'actuelle Guinée et du Mali actuels.

**L'Empire du Mali**
Sous la direction de Soundiata Keïta, l'Empire du Mali a succédé au Royaume de Sosso et a étendu son influence sur toute la région guinéenne.

**Caractéristiques des Royaumes Mandingues**
- Système de castes (nobles, artisans, esclaves)
- Organisation militaire sophistiquée
- Développement de l'agriculture intensive
- Commerce de l'or et du sel
- Transmission orale de l'histoire (griots)

**Héritage Culturel**
Les royaumes mandingues ont laissé un héritage culturel durable :
- Traditions musicales et artistiques
- Techniques agricoles
- Organisation sociale hiérarchisée
- Système de valeurs communautaires`,
      images: [],
      videos: [],
      documents: [],
      period: 'XIIe - XVe siècle',
      location: 'Guinée centrale et orientale',
      importance: 'high',
      isActive: true,
      createdBy: 'G0C0P0R0E0F0 0',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Le Commerce Transsaharien',
      description: 'Analyse du rôle de la Guinée dans les réseaux commerciaux transsahariens.',
      content: `La Guinée a joué un rôle central dans le commerce transsaharien durant l'Antiquité et le Moyen Âge. Les routes commerciales traversaient le territoire guinéen, reliant l'Afrique subsaharienne au monde méditerranéen.

**Routes Commerciales**
Les principales routes commerciales passaient par :
- La route de l'or (Guinée forestière vers Tombouctou)
- La route du sel (Sahara vers les régions côtières)
- La route des esclaves (vers les ports atlantiques)

**Produits Échangés**
- **Or** : Exploité dans les régions de Guinée forestière
- **Sel** : Importé du Sahara
- **Épices** : Poivre, gingembre, noix de cola
- **Textiles** : Coton et étoffes locales
- **Métaux** : Fer et cuivre

**Impact Économique**
Le commerce transsaharien a stimulé :
- Le développement urbain
- L'émergence de centres commerciaux
- L'introduction de nouvelles techniques
- L'enrichissement culturel

**Villes Commerciales**
Plusieurs villes guinéennes sont devenues des centres commerciaux importants :
- Kankan (carrefour commercial)
- Kissidougou (commerce de l'or)
- Nzérékoré (échanges forestiers)`,
      images: [],
      videos: [],
      documents: [],
      period: 'VIIIe - XVIe siècle',
      location: 'Routes commerciales de Guinée',
      importance: 'high',
      isActive: true,
      createdBy: 'G0C0P0R0E0F0 0',
      createdAt: new Date().toISOString()
    }
  ];

  const createSection = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/history/antiquite/sections', {
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
          <div className="text-lg text-gray-600">Chargement de l'antiquité...</div>
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
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="px-8 py-12 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">🏛️</div>
                <div>
                  <h1 className="text-5xl font-bold mb-2">Antiquité</h1>
                  <p className="text-xl text-blue-100">3000 av. J.-C. - 476 ap. J.-C.</p>
                </div>
              </div>
              <p className="text-lg text-blue-100 max-w-3xl leading-relaxed">
                Plongez dans l'âge d'or des civilisations antiques en Guinée. Découvrez les empires, 
                les royaumes et les réseaux commerciaux qui ont façonné l'histoire de cette région 
                durant l'Antiquité.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{sections.length}</div>
                  <div className="text-sm text-blue-100">Sections</div>
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
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
        >
          <span className="text-xl">➕</span>
          <span className="font-semibold">Ajouter une Section</span>
        </button>
        <button className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl">
          <span className="text-xl">🗺️</span>
          <span className="font-semibold">Cartes Historiques</span>
        </button>
        <button className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl">
          <span className="text-xl">📚</span>
          <span className="font-semibold">Sources Antiques</span>
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateSection && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl">📝</div>
            <h3 className="text-2xl font-bold text-gray-900">Créer une nouvelle section antique</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Titre de la section</label>
              <input
                type="text"
                value={newSection.title}
                onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Ex: L'Empire du Ghana"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Période spécifique</label>
              <input
                type="text"
                value={newSection.period}
                onChange={(e) => setNewSection({...newSection, period: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Ex: VIIIe - XIe siècle"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Localisation</label>
              <input
                type="text"
                value={newSection.location}
                onChange={(e) => setNewSection({...newSection, location: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Ex: Haute-Guinée"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Importance historique</label>
              <select
                value={newSection.importance}
                onChange={(e) => setNewSection({...newSection, importance: e.target.value as any})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                rows={3}
                placeholder="Description courte de la section..."
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Contenu détaillé</label>
              <textarea
                value={newSection.content}
                onChange={(e) => setNewSection({...newSection, content: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                rows={8}
                placeholder="Contenu détaillé de la section antique..."
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button
              onClick={createSection}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
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
                    <span>🏛️</span>
                    <span>Section antique</span>
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-bold mb-4">{selectedSection.title}</h2>
                  <div className="flex items-center gap-6 text-sm">
                    <span>📅 {selectedSection.period}</span>
                    <span>📍 {selectedSection.location}</span>
                    <span>🏛️ Antiquité</span>
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
                  <p className="text-sm text-blue-700">Artéfacts et monuments antiques</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <h4 className="font-bold text-green-900 mb-3 flex items-center gap-3">
                    <span className="text-2xl">🎥</span>
                    Vidéos ({selectedSection.videos.length})
                  </h4>
                  <p className="text-sm text-green-700">Documentaires historiques</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    Documents ({selectedSection.documents.length})
                  </h4>
                  <p className="text-sm text-purple-700">Sources historiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {sections.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          <div className="text-8xl mb-6">🏛️</div>
          <h3 className="text-2xl font-bold mb-4">Aucune section antique</h3>
          <p className="text-lg mb-6">Soyez le premier à contribuer à l'histoire de l'antiquité guinéenne !</p>
          <button
            onClick={() => setShowCreateSection(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg"
          >
            ➕ Créer la première section
          </button>
        </div>
      )}
    </div>
  );
}
