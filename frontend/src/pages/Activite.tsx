import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/api';

const API_BASE_URL = config.API_BASE_URL || 'http://localhost:5002/api';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  genre?: string;
  dateNaissance?: string;
  date_naissance?: string;
  role?: string;
  [key: string]: any;
}

interface ActivityGroup {
  id: string;
  name: string;
  description: string;
  activity: 'Activité1' | 'Activité2' | 'Activité3';
  members: string[];
  posts: ActivityPost[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

interface ActivityPost {
  id: string;
  author: string;
  authorName: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  category?: 'information' | 'rencontre' | 'deces' | 'reunion';
  likes: string[];
  comments: ActivityComment[];
  createdAt: string;
  numeroH?: string;
  messageType?: string;
}

interface ActivityComment {
  id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: string;
}


export default function Activite() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'Activité1' | 'Activité2' | 'Activité3' | 'Organisation'>('Activité1');
  const [orgActiveSubTab, setOrgActiveSubTab] = useState<'hommes' | 'femmes' | 'enfants'>('hommes');
  
  // Fonction pour calculer l'âge
  const calculateAge = (dateNaissance: string | undefined): number | null => {
    if (!dateNaissance) return null;
    const birthDate = new Date(dateNaissance);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = userData?.role === 'admin' || userData?.role === 'Admin' || userData?.role === 'ADMIN';

  // Déterminer automatiquement la section Organisation selon le genre et l'âge (seulement si pas admin)
  const getAutoOrgSubTab = (): 'hommes' | 'femmes' | 'enfants' => {
    if (!userData) return 'hommes';
    
    const dateNaissance = userData.dateNaissance || userData.date_naissance;
    const age = calculateAge(dateNaissance);
    
    // Si moins de 18 ans, afficher la page enfants
    if (age !== null && age < 18) {
      return 'enfants';
    }
    
    // Sinon, selon le genre
    const genre = userData.genre?.toUpperCase();
    if (genre === 'HOMME' || genre === 'M' || genre === 'MASCULIN' || genre === 'MALE') {
      return 'hommes';
    } else if (genre === 'FEMME' || genre === 'F' || genre === 'FEMININ' || genre === 'FEMALE') {
      return 'femmes';
    }
    
    // Par défaut, hommes
    return 'hommes';
  };

  // Utiliser useMemo pour recalculer seulement si nécessaire
  const currentOrgSubTab = useMemo(() => {
    if (isAdmin) {
      return orgActiveSubTab; // Admin garde son choix (peut naviguer)
    }
    return getAutoOrgSubTab(); // Utilisateurs normaux : calcul automatique
  }, [userData, isAdmin, orgActiveSubTab]);

  // Mettre à jour orgActiveSubTab si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!isAdmin && userData) {
      const autoTab = getAutoOrgSubTab();
      setOrgActiveSubTab(autoTab);
    }
  }, [userData, isAdmin]);
  const [groups, setGroups] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<ActivityGroup | null>(null);
  const [activityMessages, setActivityMessages] = useState<any[]>([]);
  const [orgMessages, setOrgMessages] = useState<any[]>([]);
  const [isRecordingActivity, setIsRecordingActivity] = useState(false);
  const [isRecordingOrg, setIsRecordingOrg] = useState(false);
  const [mediaRecorderActivity, setMediaRecorderActivity] = useState<MediaRecorder | null>(null);
  const [mediaRecorderOrg, setMediaRecorderOrg] = useState<MediaRecorder | null>(null);
  const messagesEndRefActivity = useRef<HTMLDivElement>(null);
  const messagesEndRefOrg = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [newActivityPost, setNewActivityPost] = useState({
    content: '',
    type: 'text' as 'text' | 'image' | 'video' | 'audio',
    category: 'information' as 'information' | 'rencontre' | 'deces' | 'reunion',
    mediaFile: null as File | null
  });

  const [newOrgPost, setNewOrgPost] = useState({
    content: '',
    type: 'text' as 'text' | 'image' | 'video' | 'audio',
    category: 'information' as 'information' | 'rencontre' | 'deces' | 'reunion',
    mediaFile: null as File | null
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

  const loadData = async () => {
    try {
      setLoading(true);
      await loadActivityGroups();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction helper pour obtenir le logo selon la catégorie
  const getCategoryLogo = (category: string) => {
    switch (category) {
      case 'information':
        return 'ℹ️';
      case 'rencontre':
        return '🤝';
      case 'deces':
        return '🕯️';
      case 'reunion':
        return '👥';
      default:
        return 'ℹ️';
    }
  };

  // Fonction helper pour obtenir le nom de la catégorie
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'information':
        return 'Information';
      case 'rencontre':
        return 'Rencontre';
      case 'deces':
        return 'Décès';
      case 'reunion':
        return 'Réunion';
      default:
        return 'Information';
    }
  };

  const loadActivityGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/activities/groups?activity=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const groups = data.groups || [];
        setGroups(groups);
        
        // Auto-sélectionner le premier groupe pour permettre la publication directe
        if (groups.length > 0 && (!selectedGroup || selectedGroup.activity !== activeTab)) {
          const firstGroup = groups[0];
          if (!firstGroup.members.includes(userData?.numeroH || '')) {
            await joinActivityGroup(firstGroup.id);
            // Recharger les groupes après avoir rejoint
            const updatedResponse = await fetch(`${API_BASE_URL}/activities/groups?activity=${activeTab}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (updatedResponse.ok) {
              const updatedData = await updatedResponse.json();
              const updatedGroups = updatedData.groups || groups;
              setGroups(updatedGroups);
              const updatedGroup = updatedGroups.find((g: ActivityGroup) => g.id === firstGroup.id) || firstGroup;
              setSelectedGroup(updatedGroup);
      } else {
              setSelectedGroup(firstGroup);
            }
          } else {
            setSelectedGroup(firstGroup);
          }
        } else if (groups.length > 0 && selectedGroup && selectedGroup.activity === activeTab) {
          // Mettre à jour le groupe sélectionné si les données ont changé
          const updatedGroup = groups.find((g: ActivityGroup) => g.id === selectedGroup.id);
          if (updatedGroup) {
            setSelectedGroup(updatedGroup);
          }
        }
      } else {
        const defaultGroups = getDefaultActivityGroups();
        setGroups(defaultGroups);
        // Auto-sélectionner le premier groupe par défaut pour permettre la publication
        if (defaultGroups.length > 0) {
          if (!selectedGroup || selectedGroup.activity !== activeTab) {
            setSelectedGroup(defaultGroups[0]);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
      const defaultGroups = getDefaultActivityGroups();
      setGroups(defaultGroups);
      // Auto-sélectionner le premier groupe par défaut pour permettre la publication
      if (defaultGroups.length > 0) {
        if (!selectedGroup || selectedGroup.activity !== activeTab) {
          setSelectedGroup(defaultGroups[0]);
        }
      }
    }
  };

  const getDefaultActivityGroups = (): ActivityGroup[] => [
    {
      id: '1',
      name: 'Organisation Sport Conakry',
      description: 'Rencontres sportives et activités physiques à Conakry',
      activity: 'Activité1',
      members: ['USER001', 'USER002', 'USER003'],
      posts: [
        {
          id: '1',
          author: 'USER001',
          authorName: 'Alpha Diallo',
          content: 'Match de football demain à 16h au stade du 28 septembre',
          type: 'text',
          likes: ['USER002', 'USER003'],
          comments: [],
          createdAt: '2024-01-20T10:00:00Z'
        }
      ],
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Artistes Guinéens',
      description: 'Communauté d\'artistes et créateurs guinéens',
      activity: 'Activité2',
      members: ['USER004', 'USER005', 'USER006'],
      posts: [
        {
          id: '2',
          author: 'USER004',
          authorName: 'Fatou Camara',
          content: 'Exposition d\'art prévue pour le mois prochain',
          type: 'text',
          likes: ['USER005'],
          comments: [],
          createdAt: '2024-01-19T14:30:00Z'
        }
      ],
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-10T09:00:00Z'
    },
    {
      id: '3',
      name: 'Entrepreneurs Guinée',
      description: 'Réseau d\'entrepreneurs et de business guinéens',
      activity: 'Activité3',
      members: ['USER007', 'USER008', 'USER009'],
      posts: [
        {
          id: '3',
          author: 'USER007',
          authorName: 'Mamadou Bah',
          content: 'Nouvelle opportunité d\'investissement disponible',
          type: 'text',
          likes: ['USER008', 'USER009'],
          comments: [],
          createdAt: '2024-01-18T16:45:00Z'
        }
      ],
      isActive: true,
      createdBy: 'admin',
      createdAt: '2024-01-05T11:20:00Z'
    }
  ];

  const joinActivityGroup = async (groupId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/activities/join-group`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          groupId,
          userId: userData?.numeroH
        })
      });

      if (response.ok) {
        loadActivityGroups();
      }
    } catch (error) {
      // Erreur silencieuse
    }
  };

  const loadActivityMessages = async () => {
    if (!selectedGroup) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/activities/groups/${selectedGroup.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActivityMessages((data.messages || []).reverse());
        // Scroller vers le bas après le chargement
        setTimeout(() => {
          messagesEndRefActivity.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const sendActivityMessage = async () => {
    if (!selectedGroup) {
      alert('Veuillez sélectionner un groupe');
      return;
    }
    
    if (newActivityPost.type === 'text' && !newActivityPost.content.trim()) {
      alert('Veuillez entrer un message');
      return;
    }
    
    if (newActivityPost.type !== 'text' && !newActivityPost.mediaFile) {
      alert('Veuillez sélectionner un fichier média');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('content', newActivityPost.content);
      formData.append('messageType', newActivityPost.type);
      formData.append('category', newActivityPost.category);
      
      if (newActivityPost.mediaFile) {
        formData.append('media', newActivityPost.mediaFile);
      }
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/activities/groups/${selectedGroup.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.message) {
          setNewActivityPost({ content: '', type: 'text', category: 'information', mediaFile: null });
          await loadActivityMessages();
          setTimeout(() => {
            messagesEndRefActivity.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      } else {
          alert('Erreur lors de l\'envoi du message');
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erreur lors de l\'envoi du message' }));
        alert(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message?.includes('fetch')) {
        alert(`❌ Erreur de connexion: Impossible de se connecter au serveur.\n\nVérifiez que:\n1. Le backend est démarré sur le port 5002\n2. L'URL ${API_BASE_URL} est correcte\n3. Votre connexion internet fonctionne\n\nPour démarrer le backend:\ncd backend\nnpm run dev`);
      } else {
        alert(`Erreur: ${error.message || 'Impossible d\'envoyer le message. Vérifiez votre connexion.'}`);
      }
    }
  };

  // Fonction pour démarrer l'enregistrement audio (activité)
  const startRecordingActivity = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'audio-recording.webm', { type: 'audio/webm' });
        setNewActivityPost({ ...newActivityPost, type: 'audio', mediaFile: audioFile });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorderActivity(recorder);
      setIsRecordingActivity(true);
    } catch (error) {
      console.error('Erreur lors de l\'accès au micro:', error);
      alert('Impossible d\'accéder au micro. Vérifiez les permissions.');
    }
  };

  // Fonction pour arrêter l'enregistrement audio (activité)
  const stopRecordingActivity = () => {
    if (mediaRecorderActivity && isRecordingActivity) {
      mediaRecorderActivity.stop();
      setIsRecordingActivity(false);
      setMediaRecorderActivity(null);
    }
  };

  useEffect(() => {
    if (selectedGroup && activeTab !== 'Organisation') {
      loadActivityMessages();
      // Optimisation : Augmenter l'intervalle à 10 secondes et vérifier la visibilité
      const interval = setInterval(() => {
        // Ne recharger que si la page est visible et active
        if (document.visibilityState === 'visible' && !document.hidden) {
          loadActivityMessages();
        }
      }, 10000); // Augmenté de 5s à 10s pour réduire la charge
      return () => clearInterval(interval);
    }
  }, [selectedGroup, activeTab]);

  useEffect(() => {
    if (activeTab !== 'Organisation') {
      loadActivityGroups();
    }
  }, [activeTab]);

  const filteredGroups = groups.filter(group => group.activity === activeTab);


  const loadOrgMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/organizations/posts?category=demographie&subcategory=${currentOrgSubTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrgMessages((data.posts || []).reverse());
        setTimeout(() => {
          messagesEndRefOrg.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const sendOrgMessage = async () => {
    if (newOrgPost.type === 'text' && !newOrgPost.content.trim()) {
      alert('Veuillez entrer un message');
      return;
    }
    
    if (newOrgPost.type !== 'text' && !newOrgPost.mediaFile) {
      alert('Veuillez sélectionner un fichier média');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('content', newOrgPost.content);
      formData.append('messageType', newOrgPost.type);
      formData.append('category', 'demographie');
      formData.append('subcategory', currentOrgSubTab);
      formData.append('postCategory', newOrgPost.category);
      
      if (newOrgPost.mediaFile) {
        formData.append('media', newOrgPost.mediaFile);
      }
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/organizations/create-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
          const data = await response.json();
        if (data.success && data.post) {
          setNewOrgPost({ content: '', type: 'text', category: 'information', mediaFile: null });
          await loadOrgMessages();
          setTimeout(() => {
            messagesEndRefOrg.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          alert('Erreur lors de l\'envoi du message');
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erreur lors de l\'envoi du message' }));
        alert(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message?.includes('fetch')) {
        alert(`❌ Erreur de connexion: Impossible de se connecter au serveur.\n\nVérifiez que:\n1. Le backend est démarré sur le port 5002\n2. L'URL ${API_BASE_URL} est correcte\n3. Votre connexion internet fonctionne\n\nPour démarrer le backend:\ncd backend\nnpm run dev`);
      } else {
        alert(`Erreur: ${error.message || 'Impossible d\'envoyer le message. Vérifiez votre connexion.'}`);
      }
    }
  };

  // Fonction pour démarrer l'enregistrement audio (organisation)
  const startRecordingOrg = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'audio-recording.webm', { type: 'audio/webm' });
        setNewOrgPost({ ...newOrgPost, type: 'audio', mediaFile: audioFile });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorderOrg(recorder);
      setIsRecordingOrg(true);
    } catch (error) {
      console.error('Erreur lors de l\'accès au micro:', error);
      alert('Impossible d\'accéder au micro. Vérifiez les permissions.');
    }
  };

  // Fonction pour arrêter l'enregistrement audio (organisation)
  const stopRecordingOrg = () => {
    if (mediaRecorderOrg && isRecordingOrg) {
      mediaRecorderOrg.stop();
      setIsRecordingOrg(false);
      setMediaRecorderOrg(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'Organisation' && userData) {
      loadOrgMessages();
      // Optimisation : Augmenter l'intervalle à 10 secondes et vérifier la visibilité
      const interval = setInterval(() => {
        // Ne recharger que si la page est visible et active
        if (document.visibilityState === 'visible' && !document.hidden) {
          loadOrgMessages();
        }
      }, 10000); // Augmenté de 5s à 10s pour réduire la charge
      return () => clearInterval(interval);
    }
  }, [activeTab, currentOrgSubTab, userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des activités...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === 'Organisation' ? '🤝 Organisation' : '🎯 Activités'}
              </h1>
              <p className="mt-2 text-gray-600">
                {activeTab === 'Organisation' 
                  ? currentOrgSubTab === 'hommes' ? 'Hommes' :
                    currentOrgSubTab === 'femmes' ? 'Femmes' :
                    'Enfants (Moins de 18 ans)'
                  : 'Rencontres entre personnes ayant les mêmes activités'
                }
              </p>
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
            { id: 'Activité1', label: 'Activité 1', icon: '🏃‍♂️' },
            { id: 'Activité2', label: 'Activité 2', icon: '👷‍♂️👷‍♀️' },
            { id: 'Activité3', label: 'Activité 3', icon: '💼' },
            { id: 'Organisation', label: 'Organisation', icon: '🤝' }
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
        {activeTab !== 'Organisation' && (
          <div className="space-y-6">
            {/* Liste des groupes - Affichée seulement si aucun groupe n'est sélectionné */}
            {!selectedGroup && (
              <div className="space-y-2 mb-6">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      onClick={async () => {
                        if (!group.members.includes(userData?.numeroH || '')) {
                          await joinActivityGroup(group.id);
                        }
                        setSelectedGroup(group);
                      }}
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
              </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">
                      {activeTab === 'Activité1' && '🏃‍♂️'}
                      {activeTab === 'Activité2' && '👷‍♂️👷‍♀️'}
                      {activeTab === 'Activité3' && '💼'}
            </div>
                    <p className="text-gray-500 mb-4">Aucun Organisation pour cette activité</p>
                    <p className="text-sm text-gray-400">Les organisations sont créées automatiquement lors de l'enregistrement des utilisateurs. Les personnes ayant la même activité se retrouvent dans le même groupe.</p>
              </div>
                )}
            </div>
            )}

            {/* Interface de publication - Affichée directement sans header */}
            {selectedGroup && (
              <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '500px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
                {/* Zone de messages */}
                <div className="flex-1 overflow-y-auto bg-gray-100 p-4" style={{ minHeight: '300px', maxHeight: 'calc(70vh - 200px)' }}>
                  {activityMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Aucun message pour le moment.</p>
                </div>
                  ) : (
                    activityMessages.map((msg) => {
                      const isMyMessage = msg.numeroH === userData?.numeroH;
                      return (
                        <div
                          key={msg.id}
                          className={`mb-4 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isMyMessage
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-gray-900'
                            }`}
                          >
                            {!isMyMessage && (
                              <p className="text-xs font-semibold mb-1 opacity-75">{msg.authorName || msg.numeroH}</p>
                            )}
                            {/* Logo et nom de la catégorie */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{getCategoryLogo(msg.category || 'information')}</span>
                              <span className={`text-xs font-medium ${isMyMessage ? 'text-green-100' : 'text-gray-600'}`}>
                                {getCategoryName(msg.category || 'information')}
                        </span>
                      </div>
                            {msg.messageType === 'text' && msg.content && (
                              <p className="text-sm">{msg.content}</p>
                            )}
                            {msg.messageType === 'image' && msg.mediaUrl && (
                              <img
                                src={`${API_BASE_URL.replace('/api', '')}${msg.mediaUrl}`}
                                alt="Image"
                                className="max-w-full h-auto rounded-lg mb-1"
                              />
                            )}
                            {msg.messageType === 'video' && msg.mediaUrl && (
                              <video
                                src={`${API_BASE_URL.replace('/api', '')}${msg.mediaUrl}`}
                                controls
                                className="max-w-full h-auto rounded-lg mb-1"
                              />
                          )}
                            {msg.messageType === 'audio' && msg.mediaUrl && (
                              <audio
                                src={`${API_BASE_URL.replace('/api', '')}${msg.mediaUrl}`}
                                controls
                                className="w-full mb-1"
                              />
                            )}
                            <p className={`text-xs mt-1 ${isMyMessage ? 'text-green-100' : 'text-gray-500'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRefActivity} />
                      </div>

                {/* Zone de saisie */}
                <div className="bg-gray-200 px-4 py-2 border-t">
                        <div className="space-y-2">
                    {/* Sélecteur de catégorie */}
                    <div className="flex gap-2">
                      <select
                        value={newActivityPost.category}
                        onChange={(e) => setNewActivityPost({...newActivityPost, category: e.target.value as any})}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="information">ℹ️ Information</option>
                        <option value="rencontre">🤝 Rencontre</option>
                        <option value="deces">🕯️ Décès</option>
                        <option value="reunion">👥 Réunion</option>
                      </select>
                              </div>
                    {/* Zone de saisie */}
                    <div className="flex gap-2">
                      <div className="flex gap-2 flex-1">
                        <select
                          value={newActivityPost.type}
                          onChange={(e) => {
                            setNewActivityPost({...newActivityPost, type: e.target.value as any, mediaFile: null});
                            if (e.target.value !== 'audio' && isRecordingActivity) {
                              stopRecordingActivity();
                            }
                          }}
                          className="px-2 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                        >
                          <option value="text">📝</option>
                          <option value="image">🖼️</option>
                          <option value="video">🎥</option>
                          <option value="audio">🎵</option>
                        </select>
                        {newActivityPost.type === 'text' ? (
                          <input
                            type="text"
                            value={newActivityPost.content}
                            onChange={(e) => setNewActivityPost({...newActivityPost, content: e.target.value})}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendActivityMessage();
                              }
                            }}
                            placeholder="Tapez un message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        ) : newActivityPost.type === 'audio' ? (
                          <div className="flex gap-2 flex-1 items-center">
                            {!isRecordingActivity && !newActivityPost.mediaFile ? (
                              <>
                                <button
                                  type="button"
                                  onClick={startRecordingActivity}
                                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                  🎤 Enregistrer
                                </button>
                                <input
                                  type="file"
                                  accept="audio/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    if (file) {
                                      setNewActivityPost({...newActivityPost, type: 'audio', mediaFile: file});
                                    } else {
                                      setNewActivityPost({...newActivityPost, mediaFile: null});
                                    }
                                  }}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                                />
                              </>
                            ) : isRecordingActivity ? (
                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
                                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm text-red-700">Enregistrement...</span>
                            </div>
                                <button
                                  type="button"
                                  onClick={stopRecordingActivity}
                                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                >
                                  ⏹️ Arrêter
                                </button>
                </div>
              ) : (
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-sm text-gray-600">Audio prêt</span>
                    <button
                                  type="button"
                                  onClick={() => setNewActivityPost({...newActivityPost, mediaFile: null})}
                                  className="text-red-500 hover:text-red-700 text-sm"
                    >
                                  ✕
                    </button>
                </div>
              )}
            </div>
                        ) : (
                          <input
                            type="file"
                            accept={newActivityPost.type === 'image' ? 'image/*' : 'video/*'}
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file) {
                                let detectedType = newActivityPost.type;
                                if (file.type.startsWith('image/')) {
                                  detectedType = 'image';
                                } else if (file.type.startsWith('video/')) {
                                  detectedType = 'video';
                                } else if (file.type.startsWith('audio/')) {
                                  detectedType = 'audio';
                                }
                                setNewActivityPost({...newActivityPost, type: detectedType, mediaFile: file});
                              } else {
                                setNewActivityPost({...newActivityPost, mediaFile: null});
                              }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                          />
                        )}
                      </div>
                      <button
                        onClick={sendActivityMessage}
                        disabled={newActivityPost.type === 'text' ? !newActivityPost.content.trim() : !newActivityPost.mediaFile}
                        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        ▶
                      </button>
                      </div>
                      </div>
                    </div>
                              </div>
            )}
                      </div>
                    )}

        {activeTab === 'Organisation' && (
          <div className="space-y-6">
            {/* Navigation pour Admin - Afficher les 3 onglets */}
            {isAdmin && (
              <div className="bg-white border-b rounded-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'hommes', label: 'Hommes', icon: '👨‍👨' },
                      { id: 'femmes', label: 'Femmes', icon: '🧕🏿🧕🏻' },
                      { id: 'enfants', label: 'Enfants (Moins de 18 ans)', icon: '👫🏿' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setOrgActiveSubTab(tab.id as 'hommes' | 'femmes' | 'enfants')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          currentOrgSubTab === tab.id
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
            )}

            {/* Titre de la section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <span className="text-4xl mr-4">
                  {currentOrgSubTab === 'hommes' && '👨‍👨'}
                  {currentOrgSubTab === 'femmes' && '🧕🏿🧕🏻'}
                  {currentOrgSubTab === 'enfants' && '👫🏿'}
                </span>
              <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentOrgSubTab === 'hommes' && 'Hommes'}
                    {currentOrgSubTab === 'femmes' && 'Femmes'}
                    {currentOrgSubTab === 'enfants' && 'Enfants (Moins de 18 ans)'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentOrgSubTab === 'hommes' && 'Organisation dédiée aux hommes'}
                    {currentOrgSubTab === 'femmes' && 'Organisation dédiée aux femmes'}
                    {currentOrgSubTab === 'enfants' && 'Organisation dédiée aux enfants de moins de 18 ans'}
                  </p>
              </div>
              </div>
              </div>

            {/* Interface de publication - Affichée directement sans navigation */}
            <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '500px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
              {/* Zone de messages */}
              <div className="flex-1 overflow-y-auto bg-gray-100 p-4" style={{ minHeight: '300px', maxHeight: 'calc(70vh - 200px)' }}>
                {orgMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Aucun message pour le moment.</p>
            </div>
                ) : (
                  orgMessages.map((msg) => {
                    const isMyMessage = msg.numeroH === userData?.numeroH || msg.author === userData?.numeroH;
                    return (
                      <div
                        key={msg.id}
                        className={`mb-4 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isMyMessage
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-900'
                          }`}
                        >
                          {!isMyMessage && (
                            <p className="text-xs font-semibold mb-1 opacity-75">{msg.authorName || msg.author || msg.numeroH}</p>
                          )}
                          {/* Logo et nom de la catégorie */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{getCategoryLogo(msg.category || msg.postCategory || 'information')}</span>
                            <span className={`text-xs font-medium ${isMyMessage ? 'text-green-100' : 'text-gray-600'}`}>
                              {getCategoryName(msg.category || msg.postCategory || 'information')}
                            </span>
            </div>
                          {msg.messageType === 'text' && msg.content && (
                            <p className="text-sm">{msg.content}</p>
                          )}
                          {msg.messageType === 'image' && msg.mediaUrl && (
                            <img
                              src={`${API_BASE_URL.replace('/api', '')}${msg.mediaUrl}`}
                              alt="Image"
                              className="max-w-full h-auto rounded-lg mb-1"
                            />
                          )}
                          {msg.messageType === 'video' && msg.mediaUrl && (
                            <video
                              src={`${API_BASE_URL.replace('/api', '')}${msg.mediaUrl}`}
                              controls
                              className="max-w-full h-auto rounded-lg mb-1"
                            />
                          )}
                          {msg.messageType === 'audio' && msg.mediaUrl && (
                            <audio
                              src={`${API_BASE_URL.replace('/api', '')}${msg.mediaUrl}`}
                              controls
                              className="w-full mb-1"
                            />
                          )}
                          <p className={`text-xs mt-1 ${isMyMessage ? 'text-green-100' : 'text-gray-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
          </div>
        </div>
                    );
                  })
                )}
                <div ref={messagesEndRefOrg} />
              </div>
              
              {/* Zone de saisie */}
              <div className="bg-gray-200 px-4 py-2 border-t">
                <div className="space-y-2">
                  {/* Sélecteur de catégorie */}
                  <div className="flex gap-2">
                <select
                      value={newOrgPost.category}
                      onChange={(e) => setNewOrgPost({...newOrgPost, category: e.target.value as any})}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                >
                      <option value="information">ℹ️ Information</option>
                      <option value="rencontre">🤝 Rencontre</option>
                      <option value="deces">🕯️ Décès</option>
                      <option value="reunion">👥 Réunion</option>
                </select>
              </div>
                  {/* Zone de saisie */}
                  <div className="flex gap-2">
                    <div className="flex gap-2 flex-1">
                      <select
                        value={newOrgPost.type}
                        onChange={(e) => {
                          setNewOrgPost({...newOrgPost, type: e.target.value as any, mediaFile: null});
                          if (e.target.value !== 'audio' && isRecordingOrg) {
                            stopRecordingOrg();
                          }
                        }}
                        className="px-2 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                      >
                        <option value="text">📝</option>
                        <option value="image">🖼️</option>
                        <option value="video">🎥</option>
                        <option value="audio">🎵</option>
                      </select>
                      {newOrgPost.type === 'text' ? (
                        <input
                          type="text"
                  value={newOrgPost.content}
                  onChange={(e) => setNewOrgPost({...newOrgPost, content: e.target.value})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendOrgMessage();
                            }
                          }}
                          placeholder="Tapez un message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : newOrgPost.type === 'audio' ? (
                        <div className="flex gap-2 flex-1 items-center">
                          {!isRecordingOrg && !newOrgPost.mediaFile ? (
                            <>
                              <button
                                type="button"
                                onClick={startRecordingOrg}
                                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                              >
                                🎤 Enregistrer
                              </button>
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  if (file) {
                                    setNewOrgPost({...newOrgPost, type: 'audio', mediaFile: file});
                                  } else {
                                    setNewOrgPost({...newOrgPost, mediaFile: null});
                                  }
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                              />
                            </>
                          ) : isRecordingOrg ? (
                            <div className="flex items-center gap-2 flex-1">
                              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-red-700">Enregistrement...</span>
              </div>
              <button
                                type="button"
                                onClick={stopRecordingOrg}
                                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                                ⏹️ Arrêter
              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm text-gray-600">Audio prêt</span>
              <button
                                type="button"
                                onClick={() => setNewOrgPost({...newOrgPost, mediaFile: null})}
                                className="text-red-500 hover:text-red-700 text-sm"
              >
                                ✕
              </button>
        </div>
      )}
              </div>
                      ) : (
                        <input
                          type="file"
                          accept={newOrgPost.type === 'image' ? 'image/*' : 'video/*'}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file) {
                              let detectedType = newOrgPost.type;
                              if (file.type.startsWith('image/')) {
                                detectedType = 'image';
                              } else if (file.type.startsWith('video/')) {
                                detectedType = 'video';
                              } else if (file.type.startsWith('audio/')) {
                                detectedType = 'audio';
                              }
                              setNewOrgPost({...newOrgPost, type: detectedType, mediaFile: file});
                            } else {
                              setNewOrgPost({...newOrgPost, mediaFile: null});
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                />
                      )}
              </div>
              <button
                      onClick={sendOrgMessage}
                      disabled={newOrgPost.type === 'text' ? !newOrgPost.content.trim() : !newOrgPost.mediaFile}
                      className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                      ▶
              </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}