import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import './Securite.css';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface SecurityAgent {
  id: string;
  name: string;
  agency: string;
  badgeNumber?: string;
  region: string;
  city: string;
  address?: string;
  phone: string;
  emergencyPhone?: string;
  email?: string;
  specialties?: string[];
  experience?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  isAvailable: boolean;
  rating?: number;
  reviews?: any[];
  hourlyRate?: number;
}

export default function Securite() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'policiers' | 'gendarmes' | 'pompiers' | 'agents'>('policiers');
  const [agents, setAgents] = useState<SecurityAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();
  const { t } = useI18n();

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
      loadAgents();
    } catch {
      navigate("/login");
    }
  }, [navigate, activeTab]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/security/agents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      } else {
        // Si l'API n'existe pas encore, utiliser des données par défaut
        setAgents(getDefaultAgents());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
      setAgents(getDefaultAgents());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAgents = (): SecurityAgent[] => {
    const defaultAgents: SecurityAgent[] = [
      {
        id: '1',
        name: 'Capitaine Mamadou Diallo',
        agency: 'Police Nationale',
        badgeNumber: 'PN-001234',
        region: 'Conakry',
        city: 'Conakry',
        address: 'Commissariat Central, Kaloum',
        phone: '+224 621 12 34 56',
        emergencyPhone: '+224 621 12 34 57',
        email: 'm.diallo@police.gn',
        specialties: ['Sécurité publique', 'Enquêtes'],
        experience: 15,
        isActive: true,
        isAvailable: true,
        rating: 4.5
      },
      {
        id: '2',
        name: 'Lieutenant Fatoumata Bah',
        agency: 'Gendarmerie Nationale',
        badgeNumber: 'GN-005678',
        region: 'Conakry',
        city: 'Conakry',
        address: 'Gendarmerie, Dixinn',
        phone: '+224 622 23 45 67',
        emergencyPhone: '+224 622 23 45 68',
        specialties: ['Sécurité routière', 'Ordre public'],
        experience: 12,
        isActive: true,
        isAvailable: true,
        rating: 4.3
      },
      {
        id: '3',
        name: 'Adjudant Ibrahima Camara',
        agency: 'Sapeurs-Pompiers',
        badgeNumber: 'SP-009012',
        region: 'Conakry',
        city: 'Conakry',
        address: 'Caserne Centrale, Matam',
        phone: '+224 623 34 56 78',
        emergencyPhone: '+224 18',
        specialties: ['Incendie', 'Secours d\'urgence'],
        experience: 20,
        isActive: true,
        isAvailable: true,
        rating: 4.8
      },
      {
        id: '4',
        name: 'Agent Alpha Barry',
        agency: 'Agent de Sécurité Privée',
        badgeNumber: 'ASP-001',
        region: 'Conakry',
        city: 'Conakry',
        address: 'Zone industrielle',
        phone: '+224 624 45 67 89',
        specialties: ['Surveillance', 'Protection'],
        experience: 8,
        isActive: true,
        isAvailable: true,
        rating: 4.2
      },
      {
        id: '5',
        name: 'Capitaine Aissatou Diallo',
        agency: 'Police Nationale',
        badgeNumber: 'PN-002345',
        region: 'Fouta-Djallon',
        city: 'Labé',
        address: 'Commissariat de Labé',
        phone: '+224 625 56 78 90',
        emergencyPhone: '+224 625 56 78 91',
        specialties: ['Sécurité publique'],
        experience: 10,
        isActive: true,
        isAvailable: true,
        rating: 4.4
      }
    ];

    // Filtrer par type d'agence selon l'onglet actif
    const agencyFilter: Record<string, string> = {
      'policiers': 'Police Nationale',
      'gendarmes': 'Gendarmerie Nationale',
      'pompiers': 'Sapeurs-Pompiers',
      'agents': 'Agent de Sécurité Privée'
    };

    return defaultAgents.filter(agent => {
      if (activeTab === 'agents') {
        return agent.agency.includes('Sécurité Privée');
      }
      return agent.agency === agencyFilter[activeTab];
    });
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = !searchTerm || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm);
    
    const matchesRegion = !selectedRegion || agent.region === selectedRegion;
    const matchesCity = !selectedCity || agent.city === selectedCity;
    
    return matchesSearch && matchesRegion && matchesCity;
  });

  const regions = Array.from(new Set(agents.map(a => a.region))).sort();
  const cities = Array.from(new Set(agents.filter(a => !selectedRegion || a.region === selectedRegion).map(a => a.city))).sort();

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading && agents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                🛡️ Sécurité
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Contacts des agents de sécurité
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/compte")}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                ← Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('policiers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'policiers'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                👮 Policiers
              </button>
              <button
                onClick={() => setActiveTab('gendarmes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'gendarmes'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                👮‍♂️ Gendarmes
              </button>
              <button
                onClick={() => setActiveTab('pompiers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'pompiers'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🚒 Pompiers
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'agents'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🛡️ Agents Privés
              </button>
            </nav>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom, agence, ville, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Région
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedCity('');
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Toutes les régions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ville
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Toutes les villes</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des agents */}
        <div className="space-y-4">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                          {activeTab === 'policiers' ? '👮' : 
                           activeTab === 'gendarmes' ? '👮‍♂️' :
                           activeTab === 'pompiers' ? '🚒' : '🛡️'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {agent.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {agent.agency}
                          {agent.badgeNumber && ` • Badge: ${agent.badgeNumber}`}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <span className="font-medium">📍</span> {agent.city}, {agent.region}
                          </div>
                          {agent.address && (
                            <div>
                              <span className="font-medium">🏠</span> {agent.address}
                            </div>
                          )}
                          {agent.experience && (
                            <div>
                              <span className="font-medium">⭐</span> {agent.experience} ans d'expérience
                            </div>
                          )}
                          {agent.rating && (
                            <div>
                              <span className="font-medium">⭐</span> {agent.rating.toFixed(1)}/5
                            </div>
                          )}
                        </div>
                        {agent.specialties && agent.specialties.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {agent.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleCall(agent.phone)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <span>📞</span>
                        <span className="font-semibold">{agent.phone}</span>
                      </button>
                      {agent.emergencyPhone && (
                        <button
                          onClick={() => handleCall(agent.emergencyPhone!)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <span>🚨</span>
                          <span className="font-semibold">Urgence: {agent.emergencyPhone}</span>
                        </button>
                      )}
                    </div>
                    {!agent.isAvailable && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Indisponible
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Aucun agent trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aucun agent de sécurité ne correspond à vos critères de recherche.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
