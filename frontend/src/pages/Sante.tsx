import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonDonSante } from '../components/ButtonDonSante';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface Hospital {
  id: string;
  name: string;
  type: 'public' | 'privé' | 'missionnaire';
  region: string;
  city: string;
  address: string;
  phone: string;
  emergencyPhone?: string;
  services: string[];
  specialties: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  isEmergency: boolean;
  rating: number;
  reviews: any[];
  createdBy: string;
}

interface Doctor {
  id: string;
  name: string;
  specialties: string[];
  qualifications: string[];
  experience: number;
  city: string;
  address: string;
  phone: string;
  email?: string;
  consultationFee: number;
  currency: string;
  availability: any;
  languages: string[];
  isActive: boolean;
  isAvailable: boolean;
  ratings: number;
  reviews: any[];
  createdBy: string;
}

interface HealthProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  price: number;
  currency: string;
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  isPrescriptionRequired: boolean;
  isActive: boolean;
  createdBy: string;
}

export default function Sante() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'hopitaux' | 'medecins' | 'realite'>('hopitaux');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [realityPosts, setRealityPosts] = useState<any[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMediaCapture, setShowMediaCapture] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<'video' | 'photo' | 'message' | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'text' as 'text' | 'image' | 'video',
    category: 'message' as 'video' | 'photo' | 'message'
  });
  const navigate = useNavigate();

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
      loadData();
      if (activeTab === 'realite') {
        loadRealityPosts();
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'realite') {
      loadRealityPosts();
    }
  }, [activeTab]);


  const loadRealityPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/reality/posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRealityPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    }
  };

  const handleCreatePost = () => {
    setNewPost({
      title: '',
      content: '',
      type: 'text',
      category: 'message'
    });
    setSelectedFile(null);
    setShowCreatePost(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const submitCreatePost = async () => {
    if (!newPost.title && !newPost.content && !selectedFile) {
      alert('Veuillez remplir au moins le titre, le contenu ou ajouter un média');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append('title', newPost.title || '');
      formData.append('content', newPost.content || '');
      formData.append('type', newPost.type);
      formData.append('category', newPost.category);
      formData.append('author', userData?.numeroH || '');
      formData.append('authorName', `${userData?.prenom} ${userData?.nomFamille}`);

      if (selectedFile) {
        formData.append('media', selectedFile);
      }

      const response = await fetch('/api/reality/create-post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Post créé avec succès !');
        setShowCreatePost(false);
        setSelectedFile(null);
        loadRealityPosts();
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la création du post');
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création du post');
    }
  };

  const getPostsByCategory = (category: 'video' | 'photo' | 'message') => {
    return realityPosts.filter(post => post.category === category);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadHospitals(),
        loadDoctors()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHospitals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/health/hospitals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHospitals(data.hospitals || []);
      } else {
        setHospitals(getDefaultHospitals());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des hôpitaux:', error);
      setHospitals(getDefaultHospitals());
    }
  };

  const loadDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/health/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
      } else {
        setDoctors(getDefaultDoctors());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error);
      setDoctors(getDefaultDoctors());
    }
  };


  const getDefaultHospitals = (): Hospital[] => [
    {
      id: '1',
      name: 'Hôpital National Ignace Deen',
      type: 'public',
      region: 'Conakry',
      city: 'Conakry',
      address: 'Kaloum, Conakry',
      phone: '+224 30 45 12 34',
      emergencyPhone: '+224 30 45 12 35',
      services: ['Urgences', 'Chirurgie', 'Médecine interne', 'Pédiatrie'],
      specialties: ['Cardiologie', 'Neurologie', 'Orthopédie'],
      coordinates: { lat: 9.6412, lng: -13.5784 },
      isActive: true,
      isEmergency: true,
      rating: 4.2,
      reviews: [],
      createdBy: 'admin'
    },
    {
      id: '2',
      name: 'Clinique Pasteur',
      type: 'privé',
      region: 'Conakry',
      city: 'Conakry',
      address: 'Hamdallaye, Conakry',
      phone: '+224 30 45 67 89',
      emergencyPhone: '+224 30 45 67 90',
      services: ['Consultations', 'Analyses', 'Imagerie'],
      specialties: ['Gynécologie', 'Pédiatrie', 'Médecine générale'],
      coordinates: { lat: 9.6412, lng: -13.5784 },
      isActive: true,
      isEmergency: false,
      rating: 4.5,
      reviews: [],
      createdBy: 'admin'
    },
    {
      id: '3',
      name: 'Hôpital Régional de Kindia',
      type: 'public',
      region: 'Kindia',
      city: 'Kindia',
      address: 'Centre-ville, Kindia',
      phone: '+224 30 45 23 45',
      emergencyPhone: '+224 30 45 23 46',
      services: ['Urgences', 'Médecine générale', 'Chirurgie'],
      specialties: ['Médecine interne', 'Chirurgie générale'],
      coordinates: { lat: 10.0569, lng: -12.8652 },
      isActive: true,
      isEmergency: true,
      rating: 3.8,
      reviews: [],
      createdBy: 'admin'
    }
  ];

  const getDefaultDoctors = (): Doctor[] => [
    {
      id: '1',
      name: 'Dr. Alpha Diallo',
      specialties: ['Cardiologie', 'Médecine interne'],
      qualifications: ['MD Cardiologie', 'Spécialiste en Médecine interne'],
      experience: 15,
      city: 'Conakry',
      address: 'Kaloum, Conakry',
      phone: '+224 123 456 789',
      email: 'alpha.diallo@email.com',
      consultationFee: 50000,
      currency: 'FG',
      availability: { monday: true, tuesday: true, wednesday: true },
      languages: ['Français', 'Soussou'],
      isActive: true,
      isAvailable: true,
      ratings: 4.8,
      reviews: [],
      createdBy: 'admin'
    },
    {
      id: '2',
      name: 'Dr. Fatou Camara',
      specialties: ['Gynécologie', 'Obstétrique'],
      qualifications: ['MD Gynécologie', 'Spécialiste en Obstétrique'],
      experience: 12,
      city: 'Conakry',
      address: 'Hamdallaye, Conakry',
      phone: '+224 987 654 321',
      email: 'fatou.camara@email.com',
      consultationFee: 45000,
      currency: 'FG',
      availability: { tuesday: true, thursday: true, friday: true },
      languages: ['Français', 'Malinké'],
      isActive: true,
      isAvailable: true,
      ratings: 4.6,
      reviews: [],
      createdBy: 'admin'
    },
    {
      id: '3',
      name: 'Dr. Mamadou Bah',
      specialties: ['Pédiatrie', 'Médecine générale'],
      qualifications: ['MD Pédiatrie', 'Médecine générale'],
      experience: 8,
      city: 'Kindia',
      address: 'Centre-ville, Kindia',
      phone: '+224 555 123 456',
      email: 'mamadou.bah@email.com',
      consultationFee: 35000,
      currency: 'FG',
      availability: { monday: true, wednesday: true, friday: true },
      languages: ['Français', 'Peul'],
      isActive: true,
      isAvailable: true,
      ratings: 4.4,
      reviews: [],
      createdBy: 'admin'
    }
  ];


  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || hospital.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = !selectedCity || doctor.city === selectedCity;
    const matchesSpecialty = !selectedSpecialty || doctor.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesCity && matchesSpecialty;
  });


  const callEmergency = () => {
    window.open('tel:117', '_self');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données de santé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bouton Don Santé - TRÈS VISIBLE EN HAUT */}
      <ButtonDonSante />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏥 Santé</h1>
              <p className="mt-2 text-gray-600">Hôpitaux, médecins et produits de santé</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={callEmergency}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🚨 Urgence: 117
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'hopitaux', label: 'Trouver un hôpital plus proche', icon: '🏥' },
              { id: 'medecins', label: 'Trouver un médecin compétent', icon: '👨‍⚕️' },
              { id: 'realite', label: 'Réalité (Admin)', icon: '📷' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {activeTab === 'hopitaux' && (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les villes</option>
                <option value="Conakry">Conakry</option>
                <option value="Kindia">Kindia</option>
                <option value="Kankan">Kankan</option>
                <option value="Labé">Labé</option>
                <option value="N\'Zérékoré">N'Zérékoré</option>
              </select>
            )}
            {activeTab === 'medecins' && (
              <>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les villes</option>
                  <option value="Conakry">Conakry</option>
                  <option value="Kindia">Kindia</option>
                  <option value="Kankan">Kankan</option>
                  <option value="Labé">Labé</option>
                  <option value="N\'Zérékoré">N'Zérékoré</option>
                </select>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les spécialités</option>
                  <option value="Cardiologie">Cardiologie</option>
                  <option value="Gynécologie">Gynécologie</option>
                  <option value="Pédiatrie">Pédiatrie</option>
                  <option value="Médecine générale">Médecine générale</option>
                  <option value="Chirurgie">Chirurgie</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Results */}

        {activeTab === 'hopitaux' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🏥 Hôpitaux Guinéens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.map((hospital) => (
                  <div key={hospital.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        hospital.type === 'public' ? 'bg-blue-100 text-blue-800' :
                        hospital.type === 'privé' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {hospital.type}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📞</span>
                        <span>{hospital.phone}</span>
                      </div>
                      {hospital.emergencyPhone && (
                        <div className="flex items-center text-sm text-red-600">
                          <span className="mr-2">🚨</span>
                          <span>Urgences: {hospital.emergencyPhone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">⭐</span>
                        <span>{hospital.rating}/5</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {hospital.services.map((service, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Appeler
                      </button>
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Itinéraire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medecins' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍⚕️ Médecins Compétents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">🏥</span>
                        <span>{doctor.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📞</span>
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">⭐</span>
                        <span>{doctor.ratings}/5 ({doctor.experience} ans d'expérience)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">💰</span>
                        <span>{doctor.consultationFee.toLocaleString()} {doctor.currency}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Spécialités:</h4>
                      <div className="flex flex-wrap gap-1">
                        {doctor.specialties.map((specialty, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Qualifications:</h4>
                      <div className="space-y-1">
                        {doctor.qualifications.map((qualification, index) => (
                          <div key={index} className="text-sm text-gray-600">• {qualification}</div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Prendre RDV
                      </button>
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Contacter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'realite' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📷 Réalité (Publications Admin)</h2>
              {userData?.numeroH === 'G0C0P0R0E0F0 0' || userData?.role === 'admin' ? (
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Vous êtes administrateur</h3>
                  <p className="text-blue-800 text-sm mb-4">Vous pouvez publier des vidéos, photos et textes.</p>
                  <button 
                    onClick={handleCreatePost}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ➕ Publier du contenu
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-center">Seuls les administrateurs peuvent publier du contenu ici.</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Contenu publié par admin */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border-2 border-gray-200">
                  <div className="text-4xl mb-4">📹</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vidéos de sensibilisation</h3>
                  <p className="text-gray-600 text-sm mb-4">Découvrez les campagnes de santé publique</p>
                  <button 
                    onClick={() => setSelectedContentType('video')}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Voir les vidéos ({getPostsByCategory('video').length})
                  </button>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-gray-200">
                  <div className="text-4xl mb-4">🖼️</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Photos de sensibilisation</h3>
                  <p className="text-gray-600 text-sm mb-4">Images de prévention santé</p>
                  <button 
                    onClick={() => setSelectedContentType('photo')}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Voir les photos ({getPostsByCategory('photo').length})
                  </button>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-gray-200">
                  <div className="text-4xl mb-4">📄</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Messages importants</h3>
                  <p className="text-gray-600 text-sm mb-4">Communiqués officiels de santé</p>
                  <button 
                    onClick={() => setSelectedContentType('message')}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Lire les messages ({getPostsByCategory('message').length})
                  </button>
                </div>
              </div>

              {/* Affichage des posts par catégorie */}
              {selectedContentType && (
                <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedContentType === 'video' ? '📹 Vidéos de sensibilisation' :
                       selectedContentType === 'photo' ? '🖼️ Photos de sensibilisation' :
                       '📄 Messages importants'}
                    </h3>
                    <button
                      onClick={() => setSelectedContentType(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕ Fermer
                    </button>
            </div>
                  
                  {getPostsByCategory(selectedContentType).length > 0 ? (
                    <div className="space-y-4">
                      {getPostsByCategory(selectedContentType).map((post: any) => (
                        <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{post.title}</h4>
                              <p className="text-sm text-gray-600">{post.authorName}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(post.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          
                          {post.mediaUrl && (
                            <div className="mb-3">
                              {post.type === 'video' ? (
                                <video controls className="w-full max-w-2xl rounded-lg">
                                  <source src={post.mediaUrl} type="video/mp4" />
                                </video>
                              ) : post.type === 'image' ? (
                                <img src={post.mediaUrl} alt={post.title} className="max-w-2xl rounded-lg" />
                              ) : null}
          </div>
        )}

                          <p className="text-gray-800">{post.content}</p>
      </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <div className="text-6xl mb-4">
                        {selectedContentType === 'video' ? '📹' :
                         selectedContentType === 'photo' ? '🖼️' : '📄'}
                      </div>
                      <p className="text-gray-500 text-lg mb-4">
                        Aucun {selectedContentType === 'video' ? 'vidéo' :
                                selectedContentType === 'photo' ? 'photo' : 'message'} publié pour le moment
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Modal de création de post */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              📝 Publier du contenu
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => {
                    const category = e.target.value as 'video' | 'photo' | 'message';
                    setNewPost({
                      ...newPost,
                      category,
                      type: category === 'video' ? 'video' : category === 'photo' ? 'image' : 'text'
                    });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="message">📄 Message</option>
                  <option value="photo">🖼️ Photo</option>
                  <option value="video">📹 Vidéo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Titre du contenu..."
                />
              </div>

              {(newPost.category === 'photo' || newPost.category === 'video') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newPost.category === 'photo' ? '🖼️' : '📹'} Fichier média *
                  </label>
                  <input
                    type="file"
                    accept={newPost.category === 'photo' ? 'image/*' : 'video/*'}
                    capture={newPost.category === 'photo' ? 'environment' : undefined}
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-600">✓ Fichier sélectionné : {selectedFile.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu *
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Rédigez votre contenu..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreatePost(false);
                  setSelectedFile(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitCreatePost}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Publication de Produit Gratuit */}
    </div>
  );
}