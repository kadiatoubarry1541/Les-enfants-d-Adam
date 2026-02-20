import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefiEducatifContent from '../components/DefiEducatifContent';
import { Header } from '../components/Header';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface Formation {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  level: string;
  requirements: string[];
  curriculum: string[];
  isActive: boolean;
  createdBy: string;
  maxStudents: number;
  price: number;
  startDate: string;
  endDate: string;
}

interface Professor {
  id: string;
  name: string;
  specialties: string[];
  qualifications: string[];
  experience: number;
  city: string;
  address: string;
  phone: string;
  email: string;
  consultationFee: number;
  availability: any;
  languages: string[];
  isActive: boolean;
  isAvailable: boolean;
  ratings: number;
  reviews: any[];
  createdBy: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  type: 'audio' | 'video' | 'written' | 'library';
  content: string;
  duration: number;
  level: string;
  category: string;
  instructor: string;
  materials: string[];
  isActive: boolean;
  createdBy: string;
}

interface FormationRegistration {
  id: string;
  studentNumeroH: string;
  studentName: string;
  formationId: string;
  formationTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface ProfessorRequest {
  id: string;
  studentNumeroH: string;
  studentName: string;
  professorId: string;
  professorName: string;
  subject: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
}

interface Stage {
  id: string;
  title: string;
  description: string;
  specialties: string[];
  qualifications: string[];
  experience: number;
  city: string;
  address: string;
  phone: string;
  email: string;
  consultationFee: number;
  availability: any;
  languages: string[];
  isActive: boolean;
  isAvailable: boolean;
  ratings: number;
  reviews: any[];
  createdBy: string;
}

interface StageRequest {
  id: string;
  studentNumeroH: string;
  studentName: string;
  stageId: string;
  stageTitle: string;
  subject: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
}

interface Progress {
  id: string;
  studentNumeroH: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: string[];
  lastAccessed: string;
  totalTimeSpent: number;
}

interface Certificate {
  id: string;
  studentNumeroH: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  issuedBy: string;
  badgeUrl: string;
  isValid: boolean;
}

export default function Education() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'formation-scientifique' | 'science' | 'defi-educatif'>('defi-educatif');
  const [formations, setFormations] = useState<Formation[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<FormationRegistration[]>([]);
  const [myRequests, setMyRequests] = useState<ProfessorRequest[]>([]);
  const [myStageRequests, setMyStageRequests] = useState<StageRequest[]>([]);
  const [myProgress, setMyProgress] = useState<Progress[]>([]);
  const [myCertificates, setMyCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showProfessorRequestForm, setShowProfessorRequestForm] = useState(false);
  const [showStageRequestForm, setShowStageRequestForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<'audio' | 'video' | 'written' | 'exercice' | 'library' | 'progress' | 'certificates'>('audio');
  const navigate = useNavigate();

  const [registrationForm, setRegistrationForm] = useState({
    numeroH: '',
    motivation: ''
  });

  const [professorRequestForm, setProfessorRequestForm] = useState({
    numeroH: '',
    subject: '',
    message: ''
  });

  const [stageRequestForm, setStageRequestForm] = useState({
    numeroH: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const session = localStorage.getItem("session_user");
    const token = localStorage.getItem("token");
    
    if (!session || !token) {
      console.warn('Session ou token manquant, redirection vers login');
      localStorage.removeItem('session_user');
      localStorage.removeItem('token');
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(session);
      const user = parsed.userData || parsed;
      if (!user || !user.numeroH) {
        console.warn('Données utilisateur invalides, redirection vers login');
        localStorage.removeItem('session_user');
        localStorage.removeItem('token');
        navigate("/login");
        return;
      }
      
      console.log('✅ Utilisateur connecté:', user.email, 'Rôle:', user.role);
      setUserData(user);
      loadData();
    } catch (error) {
      console.error('Erreur lors du parsing de la session:', error);
      localStorage.removeItem('session_user');
      localStorage.removeItem('token');
      navigate("/login");
    }
  }, [navigate]);

  // Fonction helper pour vérifier le token
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn('Token manquant, redirection vers login');
      localStorage.removeItem('session_user');
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    }
    return token;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFormations(),
        loadProfessors(),
        loadStages(),
        loadCourses(),
        loadMyRegistrations(),
        loadMyRequests(),
        loadMyStageRequests(),
        loadMyProgress(),
        loadMyCertificates()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFormations = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch('/api/education/formations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormations(data.formations || []);
      } else if (response.status === 401) {
        console.warn('Token invalide pour loadFormations');
        localStorage.removeItem('token');
        localStorage.removeItem('session_user');
        navigate('/login');
      } else {
        setFormations(getDefaultFormations());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
      setFormations(getDefaultFormations());
    }
  };

  const loadProfessors = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch('/api/education/professors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfessors(data.professors || []);
      } else if (response.status === 401) {
        console.warn('Token invalide pour loadProfessors');
        localStorage.removeItem('token');
        localStorage.removeItem('session_user');
        navigate('/login');
      } else {
        setProfessors(getDefaultProfessors());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des professeurs:', error);
      setProfessors(getDefaultProfessors());
    }
  };

  const loadCourses = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        setCourses(getDefaultCourses());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      setCourses(getDefaultCourses());
    }
  };

  const loadMyRegistrations = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/my-registrations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des inscriptions:', error);
    }
  };

  const loadMyRequests = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    }
  };

  const loadStages = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/stages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStages(data.stages || []);
      } else {
        setStages(getDefaultStages());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stages:', error);
      setStages(getDefaultStages());
    }
  };

  const loadMyStageRequests = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/my-stage-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyStageRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes de stages:', error);
    }
  };

  const loadMyProgress = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/my-progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyProgress(data.progress || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du progrès:', error);
    }
  };

  const loadMyCertificates = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/my-certificates', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des certificats:', error);
    }
  };

  const handleFormationRegistration = async (formation: Formation) => {
    setSelectedFormation(formation);
    setRegistrationForm({
      numeroH: userData?.numeroH || '',
      motivation: ''
    });
    setShowRegistrationForm(true);
  };

  const submitFormationRegistration = async () => {
    if (!selectedFormation || !registrationForm.numeroH) return;

    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/register-formation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formationId: selectedFormation.id,
          studentNumeroH: registrationForm.numeroH,
          motivation: registrationForm.motivation
        })
      });
      
      if (response.ok) {
        alert('Demande d\'inscription envoyée avec succès !');
        setShowRegistrationForm(false);
        loadMyRegistrations();
      } else {
        alert('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  const handleProfessorRequest = async (professor: Professor) => {
    setSelectedProfessor(professor);
    setProfessorRequestForm({
      numeroH: userData?.numeroH || '',
      subject: '',
      message: ''
    });
    setShowProfessorRequestForm(true);
  };

  const submitProfessorRequest = async () => {
    if (!selectedProfessor || !professorRequestForm.numeroH) return;

    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/request-professor', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          professorId: selectedProfessor.id,
          studentNumeroH: professorRequestForm.numeroH,
          subject: professorRequestForm.subject,
          message: professorRequestForm.message
        })
      });
      
      if (response.ok) {
        alert('Demande envoyée au professeur avec succès !');
        setShowProfessorRequestForm(false);
        loadMyRequests();
      } else {
        alert('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur lors de la demande:', error);
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  const handleStageRequest = async (stage: Stage) => {
    setSelectedStage(stage);
    setStageRequestForm({
      numeroH: userData?.numeroH || '',
      subject: '',
      message: ''
    });
    setShowStageRequestForm(true);
  };

  const submitStageRequest = async () => {
    if (!selectedStage || !stageRequestForm.numeroH) return;

    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/education/request-stage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stageId: selectedStage.id,
          studentNumeroH: stageRequestForm.numeroH,
          subject: stageRequestForm.subject,
          message: stageRequestForm.message
        })
      });
      
      if (response.ok) {
        alert('Demande de stage envoyée avec succès !');
        setShowStageRequestForm(false);
        loadMyStageRequests();
      } else {
        alert('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de stage:', error);
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  const getDefaultFormations = (): Formation[] => [
    {
      id: '1',
      title: 'Formation en Informatique',
      description: 'Apprenez les bases de l\'informatique et de la programmation',
      category: 'Technologie',
      duration: 6,
      level: 'Débutant',
      requirements: ['Aucun prérequis'],
      curriculum: ['Introduction', 'Bases de données', 'Programmation'],
      isActive: true,
      createdBy: 'admin',
      maxStudents: 30,
      price: 50000,
      startDate: '2024-01-15',
      endDate: '2024-07-15'
    },
    {
      id: '2',
      title: 'Formation en Langues',
      description: 'Apprenez l\'anglais et le français',
      category: 'Langues',
      duration: 4,
      level: 'Intermédiaire',
      requirements: ['Niveau scolaire'],
      curriculum: ['Grammaire', 'Vocabulaire', 'Conversation'],
      isActive: true,
      createdBy: 'admin',
      maxStudents: 25,
      price: 30000,
      startDate: '2024-02-01',
      endDate: '2024-06-01'
    }
  ];

  const getDefaultProfessors = (): Professor[] => [
    {
      id: '1',
      name: 'Dr. Alpha Diallo',
      specialties: ['Mathématiques', 'Physique'],
      qualifications: ['PhD Mathématiques', 'Master Physique'],
      experience: 15,
      city: 'Conakry',
      address: 'Hamdallaye',
      phone: '+224 123 456 789',
      email: 'alpha.diallo@email.com',
      consultationFee: 25000,
      availability: { monday: true, tuesday: true },
      languages: ['Français', 'Anglais'],
      isActive: true,
      isAvailable: true,
      ratings: 4.8,
      reviews: [],
      createdBy: 'admin'
    },
    {
      id: '2',
      name: 'Prof. Fatou Camara',
      specialties: ['Français', 'Littérature'],
      qualifications: ['Master Français', 'Licence Littérature'],
      experience: 10,
      city: 'Conakry',
      address: 'Kaloum',
      phone: '+224 987 654 321',
      email: 'fatou.camara@email.com',
      consultationFee: 20000,
      availability: { wednesday: true, thursday: true },
      languages: ['Français', 'Soussou'],
      isActive: true,
      isAvailable: true,
      ratings: 4.5,
      reviews: [],
      createdBy: 'admin'
    }
  ];

  const getDefaultStages = (): Stage[] => [
    {
      id: '1',
      title: 'Stage en Arabe - Coran',
      description: 'Apprenez le Coran et la langue arabe',
      specialties: ['Coran', 'Arabe', 'Tajwid'],
      qualifications: ['Maîtrise du Coran', 'Diplôme en Arabe'],
      experience: 10,
      city: 'Conakry',
      address: 'Hamdallaye',
      phone: '+224 123 456 789',
      email: 'stage.arabe@email.com',
      consultationFee: 15000,
      availability: { monday: true, tuesday: true, wednesday: true },
      languages: ['Arabe', 'Français'],
      isActive: true,
      isAvailable: true,
      ratings: 4.9,
      reviews: [],
      createdBy: 'admin'
    },
    {
      id: '2',
      title: 'Stage en Arabe - Hadith',
      description: 'Étude des Hadiths et sciences islamiques',
      specialties: ['Hadith', 'Fiqh', 'Arabe'],
      qualifications: ['Maîtrise en Hadith', 'Diplôme en Fiqh'],
      experience: 8,
      city: 'Conakry',
      address: 'Kaloum',
      phone: '+224 987 654 321',
      email: 'stage.hadith@email.com',
      consultationFee: 18000,
      availability: { thursday: true, friday: true },
      languages: ['Arabe', 'Français'],
      isActive: true,
      isAvailable: true,
      ratings: 4.7,
      reviews: [],
      createdBy: 'admin'
    }
  ];

  const getDefaultCourses = (): Course[] => [
    {
      id: '1',
      title: 'Cours de Mathématiques',
      description: 'Cours complet de mathématiques niveau lycée',
      type: 'video',
      content: 'Contenu vidéo du cours',
      duration: 120,
      level: 'Lycée',
      category: 'Sciences',
      instructor: 'Dr. Alpha Diallo',
      materials: ['Livre de cours', 'Exercices'],
      isActive: true,
      createdBy: 'admin'
    },
    {
      id: '2',
      title: 'Cours de Français',
      description: 'Cours de français niveau collège',
      type: 'audio',
      content: 'Contenu audio du cours',
      duration: 90,
      level: 'Collège',
      category: 'Langues',
      instructor: 'Prof. Fatou Camara',
      materials: ['Manuel', 'Dictées'],
      isActive: true,
      createdBy: 'admin'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données éducatives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec Photo de Profil */}
      <Header userData={userData} />

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'formation-scientifique', label: 'Formation scientifique', icon: '📚' },
              { id: 'science', label: 'Science', icon: '🔬', link: '/science' },
              { id: 'defi-educatif', label: 'Défi éducatif', icon: '🎯' }
            ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if ('link' in tab && tab.link) {
                  navigate(tab.link);
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
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
        {activeTab === 'formation-scientifique' && (
          <div className="space-y-8">
            {/* Section 0: Professeur IA 100% Disponible - EN PREMIER */}
            <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-xl shadow-xl p-8 border-4 border-cyan-400 relative overflow-hidden">
              {/* Effet de brillance animé */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-4xl shadow-lg animate-bounce">
                    🤖
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      Professeur IA 100% Disponible
                    </h2>
                    <p className="text-lg text-gray-600">
                      Votre assistant d'apprentissage intelligent - Toujours disponible, toujours prêt à vous aider !
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold animate-pulse">
                      ✅ 100% DISPONIBLE
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Carte principale du professeur IA */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-cyan-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl">
                        🎓
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Professeur IA - Assistant Intelligent
                        </h3>
                        <p className="text-gray-600 mb-3">
                          Un professeur virtuel disponible 24/7 pour vous aider dans votre apprentissage. 
                          Posez vos questions et recevez des explications claires et détaillées.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            📚 Toutes matières
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            ⏰ 24/7 Disponible
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            🎯 Adaptatif
                          </span>
                          <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                            💬 Conversation naturelle
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-xl">✨</span>
                        <span className="text-sm"><strong>Spécialités :</strong> Français, Mathématiques, Sciences, Histoire, Géographie, et bien plus...</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-xl">🎯</span>
                        <span className="text-sm"><strong>Niveau :</strong> Du débutant à l'avancé - S'adapte à votre niveau</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-xl">💡</span>
                        <span className="text-sm"><strong>Tarif :</strong> <span className="text-green-600 font-bold">GRATUIT</span> - Disponible pour tous</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-xl">⭐</span>
                        <span className="text-sm"><strong>Note :</strong> 5.0/5 - Toujours disponible et efficace</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          // Ouvrir le professeur IA dans un nouvel onglet ou intégrer directement
                          window.open('/ia-sc', '_blank');
                        }}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        🚀 Commencer avec le Professeur IA
                      </button>
                      <button
                        onClick={() => {
                          // Option pour ouvrir dans une modal ou iframe
                          alert('Le professeur IA sera bientôt intégré directement ici !');
                        }}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        ℹ️ En savoir plus
                      </button>
                    </div>
                  </div>

                  {/* Avantages du professeur IA */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-300">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🌟</span> Pourquoi choisir le Professeur IA ?
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="font-semibold text-gray-900">Disponibilité 24/7</p>
                          <p className="text-sm text-gray-600">Apprenez quand vous voulez, jour et nuit</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                          <p className="font-semibold text-gray-900">Adaptation à votre niveau</p>
                          <p className="text-sm text-gray-600">S'adapte automatiquement à vos connaissances</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">💬</span>
                        <div>
                          <p className="font-semibold text-gray-900">Conversation naturelle</p>
                          <p className="text-sm text-gray-600">Posez vos questions comme à un vrai professeur</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📚</span>
                        <div>
                          <p className="font-semibold text-gray-900">Toutes les matières</p>
                          <p className="text-sm text-gray-600">Français, Maths, Sciences, Histoire, etc.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">💰</span>
                        <div>
                          <p className="font-semibold text-gray-900">100% Gratuit</p>
                          <p className="text-sm text-gray-600">Aucun coût, accessible à tous les apprenants</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">⚡</span>
                        <div>
                          <p className="font-semibold text-gray-900">Réponses instantanées</p>
                          <p className="text-sm text-gray-600">Pas d'attente, réponses immédiates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message d'encouragement */}
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-gray-800 font-medium">
                    💡 <strong>Astuce :</strong> Le Professeur IA est parfait pour réviser, comprendre des concepts difficiles, 
                    ou simplement poser des questions à tout moment. N'hésitez pas à l'utiliser autant que vous le souhaitez !
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Formations Disponibles */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
                  📚
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Formations Disponibles</h2>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formations.map((formation) => (
                  <div key={formation.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{formation.title}</h3>
                    <p className="text-gray-600 mb-4">{formation.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Catégorie:</span>
                        <span className="text-sm font-medium">{formation.category}</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Durée:</span>
                        <span className="text-sm font-medium">{formation.duration} mois</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Niveau:</span>
                        <span className="text-sm font-medium">{formation.level}</span>
                  </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Prix:</span>
                        <span className="text-sm font-medium">{formation.price.toLocaleString()} FG</span>
                  </div>
                    </div>
                    <button
                      onClick={() => handleFormationRegistration(formation)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      S'inscrire
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Mes Inscriptions */}
            {myRegistrations.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl">
                    ✅
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Mes Inscriptions</h3>
                </div>
                <div className="space-y-4">
                  {myRegistrations.map((registration) => (
                    <div key={registration.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{registration.formationTitle}</h4>
                          <p className="text-sm text-gray-600">Inscrit le: {new Date(registration.registeredAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                          registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {registration.status === 'approved' ? 'Approuvé' :
                           registration.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

            {/* Section 3: Professeurs Disponibles */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
                  👨‍🏫
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Professeurs Disponibles</h2>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {professors.map((professor) => (
                  <div key={professor.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{professor.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Spécialités:</span>
                        <span className="text-sm font-medium">{professor.specialties.join(', ')}</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Expérience:</span>
                        <span className="text-sm font-medium">{professor.experience} ans</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Ville:</span>
                        <span className="text-sm font-medium">{professor.city}</span>
                  </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tarif:</span>
                        <span className="text-sm font-medium">{professor.consultationFee.toLocaleString()} FG</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Note:</span>
                        <span className="text-sm font-medium">⭐ {professor.ratings}/5</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleProfessorRequest(professor)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Demander
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Contacter
                      </button>
                    </div>
                  </div>
                      ))}
                    </div>
                  </div>
                  
            {/* Section 4: Mes Demandes */}
            {myRequests.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-yellow-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-2xl">
                    📝
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Mes Demandes</h3>
                </div>
                <div className="space-y-4">
                  {myRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.professorName}</h4>
                          <p className="text-sm text-gray-600">Sujet: {request.subject}</p>
                          <p className="text-sm text-gray-600">Demandé le: {new Date(request.requestedAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'approved' ? 'Approuvé' :
                           request.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </span>
                      </div>
                    </div>
                  ))}
                  </div>
                  </div>
            )}

            {/* Section 5: Mes Cours */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-2xl">
                  🎯
          </div>
                <h2 className="text-3xl font-bold text-gray-900">Mes Cours</h2>
              </div>
              <nav className="flex space-x-4 mb-6">
                {[
                  { id: 'audio', label: 'Audio', icon: '🎵' },
                  { id: 'video', label: 'Vidéo', icon: '🎥' },
                  { id: 'written', label: 'Écrit', icon: '📝' },
                  { id: 'exercice', label: 'Exercice', icon: '📝' },
                  { id: 'library', label: 'Bibliothèque', icon: '📚' },
                  { id: 'progress', label: 'Progrès', icon: '📊' },
                  { id: 'certificates', label: 'Certificats', icon: '🏆' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCourseTab(tab.id as any)}
                    className={`py-2 px-4 rounded-lg font-medium ${
                      activeCourseTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Contenu des cours */}
          <div className="space-y-6">
                {activeCourseTab === 'audio' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🎵 Cours Audio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.filter(c => c.type === 'audio').map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Durée: {course.duration} min</span>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
                              Écouter
                  </button>
                          </div>
                </div>
              ))}
            </div>
          </div>
        )}

                {activeCourseTab === 'video' && (
          <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🎥 Cours Vidéo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.filter(c => c.type === 'video').map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Durée: {course.duration} min</span>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
                              Regarder
                            </button>
            </div>
                      </div>
                      ))}
                      </div>
                    </div>
                )}

                {activeCourseTab === 'written' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">📝 Cours Écrits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.filter(c => c.type === 'written').map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Pages: {course.duration}</span>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
                              Lire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                )}

                {activeCourseTab === 'exercice' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">📝 Exercices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Exercices disponibles</h4>
                        <p className="text-gray-600 text-sm mb-4">Pratiquez avec des exercices interactifs</p>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                          Commencer
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeCourseTab === 'library' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">📚 Bibliothèque</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {courses.filter(c => c.type === 'library').map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                          <div className="space-y-1">
                            {course.materials.map((material, index) => (
                              <div key={index} className="text-sm text-gray-500">• {material}</div>
                            ))}
                  </div>
                          <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
                            Consulter
                          </button>
                  </div>
                      ))}
                  </div>
                </div>
                )}
            
                {activeCourseTab === 'progress' && (
            <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Mon Progrès</h3>
                    <div className="space-y-4">
                      {myProgress.map((progress) => (
                        <div key={progress.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{progress.courseTitle}</h4>
                            <span className="text-sm text-gray-500">{progress.progress}%</span>
                    </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress.progress}%` }}
                            ></div>
                  </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Temps passé: {progress.totalTimeSpent} min</span>
                            <span>Dernière fois: {new Date(progress.lastAccessed).toLocaleDateString()}</span>
                </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCourseTab === 'certificates' && (
                    <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🏆 Mes Certificats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {myCertificates.map((certificate) => (
                        <div key={certificate.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{certificate.courseTitle}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              certificate.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {certificate.isValid ? 'Valide' : 'Expiré'}
                            </span>
                    </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Émis le: {new Date(certificate.issuedAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            Par: {certificate.issuedBy}
                          </p>
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                            Télécharger
                          </button>
                  </div>
                      ))}
                </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {activeTab === 'defi-educatif' && (
          <DefiEducatifContent userData={userData} />
        )}
      </div>

      {/* Modal d'inscription à une formation */}
        {showRegistrationForm && selectedFormation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              S'inscrire à: {selectedFormation.title}
              </h3>
              <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NumeroH
                </label>
                  <input
                    type="text"
                  value={registrationForm.numeroH}
                  onChange={(e) => setRegistrationForm({...registrationForm, numeroH: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre NumeroH"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivation
                </label>
                  <textarea
                  value={registrationForm.motivation}
                  onChange={(e) => setRegistrationForm({...registrationForm, motivation: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  placeholder="Pourquoi voulez-vous suivre cette formation ?"
                  />
                </div>
              </div>
            <div className="flex space-x-3 mt-6">
                <button
                onClick={() => setShowRegistrationForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                Annuler
                </button>
                <button
                onClick={submitFormationRegistration}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Modal de demande de professeur */}
      {showProfessorRequestForm && selectedProfessor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Demander: {selectedProfessor.name}
              </h3>
              <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NumeroH
                </label>
                  <input
                    type="text"
                  value={professorRequestForm.numeroH}
                  onChange={(e) => setProfessorRequestForm({...professorRequestForm, numeroH: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre NumeroH"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  value={professorRequestForm.subject}
                  onChange={(e) => setProfessorRequestForm({...professorRequestForm, subject: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sujet de votre demande"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                  <textarea
                  value={professorRequestForm.message}
                  onChange={(e) => setProfessorRequestForm({...professorRequestForm, message: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Décrivez votre demande..."
                  />
                </div>
              </div>
            <div className="flex space-x-3 mt-6">
                <button
                onClick={() => setShowProfessorRequestForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                Annuler
                </button>
                <button
                onClick={submitProfessorRequest}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Modal de demande de stage */}
      {showStageRequestForm && selectedStage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Demander: {selectedStage.title}
              </h3>
              <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NumeroH
                </label>
                  <input
                    type="text"
                  value={stageRequestForm.numeroH}
                  onChange={(e) => setStageRequestForm({...stageRequestForm, numeroH: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre NumeroH"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  value={stageRequestForm.subject}
                  onChange={(e) => setStageRequestForm({...stageRequestForm, subject: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sujet de votre demande"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                  <textarea
                  value={stageRequestForm.message}
                  onChange={(e) => setStageRequestForm({...stageRequestForm, message: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Décrivez votre demande..."
                  />
                </div>
              </div>
            <div className="flex space-x-3 mt-6">
                <button
                onClick={() => setShowStageRequestForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                Annuler
                </button>
                <button
                onClick={submitStageRequest}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}