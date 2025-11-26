import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ButtonDonZaka } from '../components/ButtonDonZaka';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface FaithPost {
  id: string;
  author: string;
  authorName: string;
  content: string;
  type: 'video' | 'audio' | 'message';
  mediaUrl?: string;
  likes: string[];
  comments: FaithComment[];
  createdAt: string;
}

interface FaithComment {
  id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface ReligiousCommunity {
  id: string;
  name: string;
  religion: string;
  description: string;
  members: string[];
  posts: FaithPost[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

interface HolyBook {
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
  language: string;
  category: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

interface PoorPerson {
  id: string;
  numeroH: string;
  prenom: string;
  nomFamille: string;
  age: number;
  location: string;
  situation: string;
  needs: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  religion?: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address: string;
  };
  verifiedBy: string;
  verifiedAt: string;
  isActive: boolean;
  donations: any[];
  totalDonations: number;
  profilePicture?: string;
  familySize?: number;
  occupation?: string;
  healthCondition?: string;
}

interface Donation {
  id: string;
  donor: string;
  donorName: string;
  recipient: string;
  recipientName: string;
  amount: number;
  currency: string;
  type: 'money' | 'food' | 'clothing' | 'medicine' | 'other';
  donationType: 'zakat' | 'sadaqah';
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

interface ZakatCalculation {
  id: string;
  user: string;
  userName: string;
  totalWealth: number;
  zakatAmount: number;
  currency: string;
  calculationDate: string;
  isPaid: boolean;
  paidAt?: string;
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

export default function Dokal() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'reflechissons' | 'livres'>('reflechissons');
  const [faithPosts, setFaithPosts] = useState<FaithPost[]>([]);
  const [communities, setCommunities] = useState<ReligiousCommunity[]>([]);
  const [holyBooks, setHolyBooks] = useState<HolyBook[]>([]);
  const [poorPeople, setPoorPeople] = useState<PoorPerson[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [zakatCalculations, setZakatCalculations] = useState<ZakatCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreateBook, setShowCreateBook] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showZakatForm, setShowZakatForm] = useState(false);
  const [selectedPoorPerson, setSelectedPoorPerson] = useState<PoorPerson | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedReligion, setSelectedReligion] = useState('');
  const [donationTypeFilter, setDonationTypeFilter] = useState<'zakat' | 'sadaqah' | 'all'>('all');
  // États pour formation-religieux
  const [formations, setFormations] = useState<Formation[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<FormationRegistration[]>([]);
  const [myStageRequests, setMyStageRequests] = useState<StageRequest[]>([]);
  const [myProgress, setMyProgress] = useState<Progress[]>([]);
  const [myCertificates, setMyCertificates] = useState<Certificate[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showStageRequestForm, setShowStageRequestForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<'audio' | 'video' | 'written' | 'exercice' | 'library' | 'progress' | 'certificates'>('audio');
  const [registrationForm, setRegistrationForm] = useState({
    numeroH: '',
    motivation: ''
  });
  const [stageRequestForm, setStageRequestForm] = useState({
    numeroH: '',
    subject: '',
    message: ''
  });
  const navigate = useNavigate();

  const [newPost, setNewPost] = useState({
    content: '',
    type: 'message' as 'video' | 'audio' | 'message'
  });

  const [newCommunity, setNewCommunity] = useState({
    name: '',
    religion: '',
    description: ''
  });

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    content: '',
    language: '',
    category: ''
  });

  const [donationForm, setDonationForm] = useState({
    amount: '',
    currency: 'FG',
    type: 'money' as 'money' | 'food' | 'clothing' | 'medicine' | 'other',
    donationType: 'sadaqah' as 'zakat' | 'sadaqah',
    description: '',
    recipient: ''
  });

  const [zakatForm, setZakatForm] = useState({
    totalWealth: '',
    currency: 'FG'
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
      loadData();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
    if (type === 'zaka') {
      setActiveTab('zaka');
      setZakaSubTab('pauvres');
    }
  }, [location]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFaithPosts(),
        loadCommunities(),
        loadHolyBooks(),
        loadPoorPeople(),
        loadDonations(),
        loadZakatCalculations()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Section formation-religieux supprimée

  const loadFormationReligieuxData = async () => {
    try {
      await Promise.all([
        loadFormations(),
        loadStages(),
        loadCourses(),
        loadMyRegistrations(),
        loadMyStageRequests(),
        loadMyProgress(),
        loadMyCertificates()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données de formation religieux:', error);
    }
  };

  const loadFormations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/formations?category=religieux', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormations(data.formations || []);
      } else {
        setFormations([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
      setFormations([]);
    }
  };

  const loadStages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/stages?category=religieux', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStages(data.stages || []);
      } else {
        setStages([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stages:', error);
      setStages([]);
    }
  };

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/courses?category=religieux', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      setCourses([]);
    }
  };

  const loadMyRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/my-registrations', {
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

  const loadMyStageRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/my-stage-requests', {
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
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/my-progress', {
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
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/my-certificates', {
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

  const submitFormationRegistration = async () => {
    if (!selectedFormation || !registrationForm.numeroH) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/formations/' + selectedFormation.id + '/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numeroH: registrationForm.numeroH,
          motivation: registrationForm.motivation
        })
      });
      
      if (response.ok) {
        alert('Inscription envoyée avec succès !');
        setShowRegistrationForm(false);
        setRegistrationForm({ numeroH: '', motivation: '' });
        loadMyRegistrations();
      } else {
        alert('Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'inscription');
    }
  };

  const submitStageRequest = async () => {
    if (!selectedStage || !stageRequestForm.numeroH) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/education/stages/' + selectedStage.id + '/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numeroH: stageRequestForm.numeroH,
          subject: stageRequestForm.subject,
          message: stageRequestForm.message
        })
      });
      
      if (response.ok) {
        alert('Demande envoyée avec succès !');
        setShowStageRequestForm(false);
        setStageRequestForm({ numeroH: '', subject: '', message: '' });
        loadMyStageRequests();
      } else {
        alert('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  const loadFaithPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/faith/posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFaithPosts(data.posts || []);
      } else {
        setFaithPosts(getDefaultFaithPosts());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      setFaithPosts(getDefaultFaithPosts());
    }
  };

  const loadCommunities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/faith/communities', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCommunities(data.communities || []);
      } else {
        setCommunities(getDefaultCommunities());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des communautés:', error);
      setCommunities(getDefaultCommunities());
    }
  };

  const loadHolyBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/faith/books', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHolyBooks(data.books || []);
      } else {
        setHolyBooks(getDefaultHolyBooks());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
      setHolyBooks(getDefaultHolyBooks());
    }
  };

  const getDefaultFaithPosts = (): FaithPost[] => [
    {
      id: '1',
      author: 'USER001',
      authorName: 'Imam Alpha Diallo',
      content: 'La patience est une vertu qui nous rapproche de Dieu. Dans les moments difficiles, rappelons-nous que chaque épreuve est une opportunité de grandir spirituellement.',
      type: 'message',
      likes: ['USER002', 'USER003', 'USER004'],
      comments: [
        {
          id: '1',
          author: 'USER002',
          authorName: 'Fatou Camara',
          content: 'Merci pour ces paroles réconfortantes',
          createdAt: '2024-01-20T11:00:00Z'
        }
      ],
      createdAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      author: 'USER005',
      authorName: 'Pasteur Mamadou Bah',
      content: 'Audio de méditation sur la paix intérieure',
      type: 'audio',
      mediaUrl: '/api/audio/meditation.mp3',
      likes: ['USER006', 'USER007'],
      comments: [],
      createdAt: '2024-01-19T15:30:00Z'
    }
  ];

  const getDefaultCommunities = (): ReligiousCommunity[] => [
    {
      id: '1',
      name: 'Communauté Musulmane de Conakry',
      religion: 'Islam',
      description: 'Communauté musulmane pour partager Dokal et les enseignements',
      members: ['USER001', 'USER002', 'USER003'],
      posts: [],
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Église Chrétienne de Guinée',
      religion: 'Christianisme',
      description: 'Communauté chrétienne pour la prière et l\'entraide',
      members: ['USER004', 'USER005', 'USER006'],
      posts: [],
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-10T09:00:00Z'
    },
    {
      id: '3',
      name: 'Croyants de Guinée',
      religion: 'Croyance Traditionnelle',
      description: 'Communauté des croyances traditionnelles guinéennes',
      members: ['USER007', 'USER008', 'USER009'],
      posts: [],
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-05T14:20:00Z'
    }
  ];

  const getDefaultHolyBooks = (): HolyBook[] => [
    {
      id: '1',
      title: 'Le Coran',
      author: 'Révélation Divine',
      description: 'Livre sacré de l\'Islam',
      content: 'Contenu du Coran...',
      language: 'Arabe',
      category: 'Livre Sacré',
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'La Bible',
      author: 'Révélation Divine',
      description: 'Livre sacré du Christianisme',
      content: 'Contenu de la Bible...',
      language: 'Français',
      category: 'Livre Sacré',
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      title: 'Les Traditions Guinéennes',
      author: 'Ancêtres Guinéens',
      description: 'Sagesse et traditions des ancêtres',
      content: 'Contenu des traditions...',
      language: 'Français',
      category: 'Sagesse Traditionnelle',
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  const loadPoorPeople = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/zakat/poor-people', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPoorPeople(data.poorPeople || []);
      } else {
        setPoorPeople(getDefaultPoorPeople());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des pauvres:', error);
      setPoorPeople(getDefaultPoorPeople());
    }
  };

  const loadDonations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/zakat/donations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des dons:', error);
    }
  };

  const loadZakatCalculations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/zakat/calculations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setZakatCalculations(data.calculations || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des calculs:', error);
    }
  };

  const getDefaultPoorPeople = (): PoorPerson[] => [
    {
      id: '1',
      numeroH: 'POOR001',
      prenom: 'Fatou',
      nomFamille: 'Camara',
      age: 65,
      location: 'Conakry',
      situation: 'Veuve avec 5 enfants orphelins',
      needs: ['Nourriture', 'Vêtements', 'Médicaments'],
      urgency: 'critical',
      contactInfo: {
        phone: '+224 123 456 789',
        address: 'Kaloum, Conakry'
      },
      verifiedBy: 'admin',
      verifiedAt: '2024-01-15T10:00:00Z',
      isActive: true,
      donations: [],
      totalDonations: 0,
      familySize: 6,
      occupation: 'Sans emploi',
      healthCondition: 'Maladie chronique'
    },
    {
      id: '2',
      numeroH: 'POOR002',
      prenom: 'Alpha',
      nomFamille: 'Diallo',
      age: 45,
      location: 'Kindia',
      situation: 'Handicapé, père de 3 enfants',
      needs: ['Nourriture', 'Frais médicaux', 'Éducation enfants'],
      urgency: 'high',
      contactInfo: {
        phone: '+224 987 654 321',
        address: 'Centre-ville, Kindia'
      },
      verifiedBy: 'admin',
      verifiedAt: '2024-01-10T14:30:00Z',
      isActive: true,
      donations: [],
      totalDonations: 0,
      familySize: 4,
      occupation: 'Vendeur ambulant',
      healthCondition: 'Handicap physique'
    },
    {
      id: '3',
      numeroH: 'POOR003',
      prenom: 'Mariama',
      nomFamille: 'Bah',
      age: 35,
      location: 'Kankan',
      situation: 'Mère célibataire avec 4 enfants',
      needs: ['Nourriture', 'Vêtements enfants', 'Loyer'],
      urgency: 'medium',
      contactInfo: {
        phone: '+224 555 123 456',
        address: 'Quartier populaire, Kankan'
      },
      verifiedBy: 'admin',
      verifiedAt: '2024-01-05T09:15:00Z',
      isActive: true,
      donations: [],
      totalDonations: 0,
      familySize: 5,
      occupation: 'Femme de ménage',
      healthCondition: 'Bon'
    },
    {
      id: '4',
      numeroH: 'POOR004',
      prenom: 'Ousmane',
      nomFamille: 'Barry',
      age: 70,
      location: 'Labé',
      situation: 'Vieux sans famille',
      needs: ['Nourriture', 'Médicaments', 'Soins médicaux'],
      urgency: 'high',
      contactInfo: {
        address: 'Vieux quartier, Labé'
      },
      verifiedBy: 'admin',
      verifiedAt: '2024-01-12T16:45:00Z',
      isActive: true,
      donations: [],
      totalDonations: 0,
      familySize: 1,
      occupation: 'Sans emploi',
      healthCondition: 'Problèmes de vue'
    },
    {
      id: '5',
      numeroH: 'POOR005',
      prenom: 'Aminata',
      nomFamille: 'Sow',
      age: 28,
      location: 'N\'Zérékoré',
      situation: 'Famille nombreuse, père malade',
      needs: ['Nourriture', 'Frais médicaux', 'Éducation'],
      urgency: 'medium',
      contactInfo: {
        phone: '+224 777 888 999',
        address: 'Banlieue, N\'Zérékoré'
      },
      verifiedBy: 'admin',
      verifiedAt: '2024-01-08T11:20:00Z',
      isActive: true,
      donations: [],
      totalDonations: 0,
      familySize: 8,
      occupation: 'Étudiante',
      healthCondition: 'Bon'
    }
  ];

  const handleDonation = (poorPerson: PoorPerson) => {
    setSelectedPoorPerson(poorPerson);
    // Si la personne est musulmane, proposer Zakat par défaut, sinon Sadaqah
    const defaultDonationType = poorPerson.religion === 'Islam' ? 'zakat' : 'sadaqah';
    setDonationForm({
      amount: '',
      currency: 'FG',
      type: 'money',
      donationType: defaultDonationType,
      description: '',
      recipient: poorPerson.id
    });
    setShowDonationForm(true);
  };

  const submitDonation = async () => {
    if (!donationForm.amount || !selectedPoorPerson) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/zakat/make-donation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donor: userData?.numeroH,
          donorName: `${userData?.prenom} ${userData?.nomFamille}`,
          recipient: selectedPoorPerson.id,
          recipientName: `${selectedPoorPerson.prenom} ${selectedPoorPerson.nomFamille}`,
          amount: parseFloat(donationForm.amount),
          currency: donationForm.currency,
          type: donationForm.type,
          donationType: donationForm.donationType,
          description: donationForm.description
        })
      });
      
      if (response.ok) {
        alert('Don effectué avec succès !');
        setShowDonationForm(false);
        loadDonations();
        loadPoorPeople();
      } else {
        alert('Erreur lors du don');
      }
    } catch (error) {
      console.error('Erreur lors du don:', error);
      alert('Erreur lors du don');
    }
  };

  const submitZakatCalculation = async () => {
    if (!zakatForm.totalWealth) return;

    const totalWealth = parseFloat(zakatForm.totalWealth);
    const zakatAmount = totalWealth * 0.025; // 2.5% pour la zakat

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/zakat/calculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userData?.numeroH,
          userName: `${userData?.prenom} ${userData?.nomFamille}`,
          totalWealth,
          zakatAmount,
          currency: zakatForm.currency
        })
      });
      
      if (response.ok) {
        alert(`Votre zakat s'élève à ${zakatAmount.toLocaleString()} ${zakatForm.currency}`);
        setShowZakatForm(false);
        loadZakatCalculations();
      } else {
        alert('Erreur lors du calcul');
      }
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      alert('Erreur lors du calcul');
    }
  };

  const filteredPoorPeople = poorPeople.filter(person => {
    const matchesSearch = person.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.nomFamille.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = !selectedUrgency || person.urgency === selectedUrgency;
    const matchesLocation = !selectedLocation || person.location === selectedLocation;
    const matchesReligion = !selectedReligion || person.religion === selectedReligion;
    // Si le filtre "Zakat" est activé, ne montrer que les pauvres musulmans
    // Si le filtre "Sadaqah" est activé, montrer tous les pauvres
    const matchesDonationType = donationTypeFilter === 'all' || 
                                 (donationTypeFilter === 'zakat' && person.religion === 'Islam') ||
                                 (donationTypeFilter === 'sadaqah'); // Sadaqah peut être donnée à tous
    return matchesSearch && matchesUrgency && matchesLocation && matchesReligion && matchesDonationType;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'Critique';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Inconnue';
    }
  };

  const handleCreatePost = () => {
    setNewPost({
      content: '',
      type: 'message'
    });
    setShowCreatePost(true);
  };

  const submitCreatePost = async () => {
    if (!newPost.content) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/faith/create-post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newPost.content,
          type: newPost.type,
          author: userData?.numeroH,
          authorName: `${userData?.prenom} ${userData?.nomFamille}`
        })
      });
      
      if (response.ok) {
        alert('Post créé avec succès !');
        setShowCreatePost(false);
        loadFaithPosts();
      } else {
        alert('Erreur lors de la création du post');
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création du post');
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/faith/join-community', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          communityId,
          userId: userData?.numeroH
        })
      });
      
      if (response.ok) {
        alert('Vous avez rejoint la communauté !');
        loadCommunities();
      } else {
        alert('Erreur lors de l\'adhésion');
      }
    } catch (error) {
      console.error('Erreur lors de l\'adhésion:', error);
      alert('Erreur lors de l\'adhésion');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de Dokal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤲 Entraide et Solidarité</h1>
              <p className="mt-2 text-gray-600">Aide aux pauvres, dons et zakat - Tous ensemble pour aider ceux dans le besoin</p>
            </div>
            <div className="flex space-x-4">
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
              { id: 'reflechissons', label: 'Réfléchissons', icon: '🤔' },
              { id: 'livres', label: 'Les Livres de Dieu Unique', icon: '📖' }
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
        {activeTab === 'reflechissons' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">🤔 Réfléchissons</h2>
              <button
                  onClick={handleCreatePost}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                  ➕ Nouveau Post
              </button>
            </div>
            
              <div className="space-y-6">
                {faithPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.type === 'video' ? 'bg-red-100 text-red-800' :
                        post.type === 'audio' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {post.type === 'video' ? '🎥 Vidéo' :
                         post.type === 'audio' ? '🎵 Audio' : '💬 Message'}
                      </span>
                    </div>

                    <p className="text-gray-800 mb-4">{post.content}</p>

                    {post.mediaUrl && (
                      <div className="mb-4">
                        {post.type === 'video' && (
                          <video controls className="w-full max-w-md rounded">
                            <source src={post.mediaUrl} type="video/mp4" />
                          </video>
                        )}
                        {post.type === 'audio' && (
                          <audio controls className="w-full">
                            <source src={post.mediaUrl} type="audio/mpeg" />
                          </audio>
                        )}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 mb-4">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                        <span>👍</span>
                        <span>{post.likes.length}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                        <span>💬</span>
                        <span>{post.comments.length}</span>
                      </button>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Commentaires:</h4>
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 rounded p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-medium text-gray-900">{comment.authorName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{comment.content}</p>
                          </div>
                        ))}
                  </div>
                    )}
                  </div>
                ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'livres' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">📖 Les Livres de Dieu Unique</h2>
                <button
                  onClick={() => setShowCreateBook(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ➕ Ajouter Livre
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {holyBooks.map((book) => (
                  <div key={book.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-gray-600 mb-4">{book.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">✍️</span>
                        <span>{book.author}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">🌍</span>
                        <span>{book.language}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📚</span>
                        <span>{book.category}</span>
                    </div>
                  </div>
                  
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        📖 Lire
                      </button>
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                        📥 Télécharger
                      </button>
                    </div>
                  </div>
                ))}
                </div>
            </div>
          </div>
        )}

        {/* Boutons de navigation vers Solidarité et Zaka */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🤝 Entraide et Solidarité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Bouton Solidarité - Pour tous */}
            <button
              onClick={() => navigate('/solidarite')}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center gap-3"
            >
              <span className="text-5xl">🤝</span>
              <span className="text-xl">Solidarité</span>
              <span className="text-sm opacity-90">Dons pour tous, toutes religions confondues</span>
            </button>

            {/* Bouton Zaka - Musulmans uniquement */}
            <button
              onClick={() => navigate('/zaka')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center gap-3"
            >
              <span className="text-5xl">🤲</span>
              <span className="text-xl">Zaka (Musulmans)</span>
              <span className="text-sm opacity-90">Aumône obligatoire pour les musulmans uniquement</span>
            </button>
          </div>
        </div>

        {/* Section formation-religieux supprimée */}
      </div>

      {/* Modal de création de post */}
      {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🤔 Nouveau Post</h3>
              <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de contenu
                </label>
                  <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({...newPost, type: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="message">💬 Message</option>
                    <option value="video">🎥 Vidéo</option>
                    <option value="audio">🎵 Audio</option>
                  </select>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                  <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  placeholder="Partagez vos réflexions spirituelles..."
                  />
                </div>
              </div>
            <div className="flex space-x-3 mt-6">
                <button
                onClick={() => setShowCreatePost(false)}
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

      {/* Modal de création de communauté */}
        {showCreateCommunity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Créer une Communauté</h3>
              <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la communauté
                </label>
                  <input
                    type="text"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de la communauté"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Religion
                </label>
                  <select
                    value={newCommunity.religion}
                    onChange={(e) => setNewCommunity({...newCommunity, religion: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une religion</option>
                    <option value="Islam">Islam</option>
                    <option value="Christianisme">Christianisme</option>
                  <option value="Croyance Traditionnelle">Croyance Traditionnelle</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                  <textarea
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  placeholder="Description de la communauté"
                  />
                </div>
              </div>
            <div className="flex space-x-3 mt-6">
                <button
                onClick={() => setShowCreateCommunity(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                Annuler
                </button>
                <button
                onClick={() => {
                  alert('Communauté créée !');
                  setShowCreateCommunity(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Créer
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Modal d'ajout de livre */}
      {showCreateBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📖 Ajouter un Livre</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du livre
                </label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Titre du livre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auteur
                </label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Auteur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newBook.description}
                  onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Description du livre"
                />
            </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Langue
                  </label>
                  <select
                    value={newBook.language}
                    onChange={(e) => setNewBook({...newBook, language: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Français">Français</option>
                    <option value="Arabe">Arabe</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Livre Sacré">Livre Sacré</option>
                    <option value="Sagesse Traditionnelle">Sagesse Traditionnelle</option>
                    <option value="Philosophie">Philosophie</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateBook(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Annuler
                      </button>
              <button
                onClick={() => {
                  alert('Livre ajouté !');
                  setShowCreateBook(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Ajouter
                      </button>
            </div>
            </div>
          </div>
        )}

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

      {/* Modal de formulaire de don */}
      {showDonationForm && selectedPoorPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💝 Aider {selectedPoorPerson.prenom} {selectedPoorPerson.nomFamille}
            </h3>
            <div className="space-y-4">
              {/* Type de don - Important pour les musulmans */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de don <span className="text-red-500">*</span>
                </label>
                <select
                  value={donationForm.donationType}
                  onChange={(e) => {
                    const newType = e.target.value as 'zakat' | 'sadaqah';
                    setDonationForm({...donationForm, donationType: newType});
                    // Si Zakat est sélectionné et la personne n'est pas musulmane, avertir
                    if (newType === 'zakat' && selectedPoorPerson.religion !== 'Islam') {
                      alert('⚠️ Attention : La Zakat est destinée aux pauvres musulmans uniquement. Veuillez sélectionner "Sadaqah" pour aider cette personne.');
                      setDonationForm({...donationForm, donationType: 'sadaqah'});
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="sadaqah">Sadaqah (Aumône facultative - Tous les pauvres)</option>
                  <option value="zakat" disabled={selectedPoorPerson.religion !== 'Islam'}>
                    Zakat (Aumône obligatoire - Musulmans uniquement)
                  </option>
                </select>
                {donationForm.donationType === 'zakat' && (
                  <p className="text-xs text-blue-600 mt-1">
                    ✓ La Zakat est destinée aux pauvres musulmans uniquement
                  </p>
                )}
                {donationForm.donationType === 'sadaqah' && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ La Sadaqah peut être donnée à tous les pauvres, quelle que soit leur religion
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={donationForm.amount}
                    onChange={(e) => setDonationForm({...donationForm, amount: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Montant"
                    min="0"
                    step="0.01"
                  />
                  <select
                    value={donationForm.currency}
                    onChange={(e) => setDonationForm({...donationForm, currency: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="FG">FG</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'aide
                </label>
                <select
                  value={donationForm.type}
                  onChange={(e) => setDonationForm({...donationForm, type: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="money">Argent</option>
                  <option value="food">Nourriture</option>
                  <option value="clothing">Vêtements</option>
                  <option value="medicine">Médicaments</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  value={donationForm.description}
                  onChange={(e) => setDonationForm({...donationForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Décrivez votre don..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDonationForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitDonation}
                disabled={!donationForm.amount || parseFloat(donationForm.amount) <= 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
              >
                Confirmer le don
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}