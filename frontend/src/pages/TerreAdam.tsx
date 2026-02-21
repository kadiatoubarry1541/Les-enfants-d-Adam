import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProSection from '../components/ProSection';
import {
  findLocationByCode,
  getLocationGroupTitle,
  getAllLocationsForGroups,
  type GeographicLocation
} from '../utils/worldGeography';
import { getCountryFlag, getContinentIcon, getRegionIcon } from '../utils/countryFlags';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface ResidenceGroup {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  location: string;
  displayPath?: string;
  members: UserData[] | string[];
  posts?: any[];
  isActive?: boolean;
  createdBy?: string;
  createdAt?: string;
}

interface ResidenceMessage {
  id: string;
  author: string;
  authorName: string;
  content: string;
  type?: 'text' | 'image' | 'video' | 'audio';
  messageType?: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  category?: string;
  likes: string[];
  comments: any[];
  createdAt: string;
  numeroH: string;
}

export default function TerreAdam() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'lieux' | 'region' | 'pays' | 'continent' | 'mondial'>('lieux');
  const [activeLieuTab, setActiveLieuTab] = useState<'quartier' | 'sous-prefecture' | 'prefecture'>('quartier');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // ✅ Étiquettes dynamiques pour afficher les véritables noms des lieux
  const [tabLabels, setTabLabels] = useState<string>('Quartier');
  
  // États pour le système de messagerie
  const [groups, setGroups] = useState<ResidenceGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ResidenceGroup | null>(null);
  const [messages, setMessages] = useState<ResidenceMessage[]>([]);
  const [newMessage, setNewMessage] = useState({
    content: '',
    messageType: 'text' as 'text' | 'image' | 'video' | 'audio',
    category: 'information' as string,
    mediaFile: null as File | null
  });
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // ✅ Vérifier si l'utilisateur est journaliste
  const [isJournalist, setIsJournalist] = useState(false);
  const [filterScope, setFilterScope] = useState<'all' | 'quartier'>('quartier');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  // Filtre du fil quartier : tout ou par besoin (décès, mariage, baptême, etc.)
  const [feedFilter, setFeedFilter] = useState<string>('all');

  // Récupérer les informations géographiques de l'utilisateur depuis la session
  const userContinent = userData?.continentCode ? findLocationByCode(userData.continentCode) : null;
  const userCountry = userData?.paysCode ? findLocationByCode(userData.paysCode) : null;
  const userRegion = userData?.regionCode ? findLocationByCode(userData.regionCode) : null;
  const userPrefecture = userData?.prefectureCode ? findLocationByCode(userData.prefectureCode) : null;
  const userSousPrefecture = userData?.sousPrefectureCode ? findLocationByCode(userData.sousPrefectureCode) : null;
  const userQuartier = userData?.quartierCode ? findLocationByCode(userData.quartierCode) : null;

  /** Liste des codes des 1 à 3 quartiers de l'utilisateur (formulaire d'inscription) */
  const userQuartierCodes = [
    userData?.quartierCode || userData?.lieu1 || userData?.lieuResidence1,
    userData?.quartierCode2 || userData?.lieu2 || userData?.lieuResidence2,
    userData?.quartierCode3 || userData?.lieu3 || userData?.lieuResidence3
  ].filter(Boolean) as string[];

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
      
      // ❌ Les défunts n'ont pas de compte et ne peuvent pas accéder à cette page
      if (user.type === 'defunt' || user.isDeceased || user.numeroHD) {
        alert("⚠️ Les défunts n'ont pas de compte. Leurs informations sont dans l'arbre généalogique.");
        navigate("/");
        return;
      }
      
      setUserData(user);
      const admin = user.role === 'admin' || user.role === 'super-admin' || user.numeroH === 'G0C0P0R0E0F0 0';
      setIsAdmin(admin);
      // ✅ Vérifier si l'utilisateur est journaliste
      const journalist = user.role === 'journalist' || user.isJournalist || admin;
      setIsJournalist(journalist);
      if (admin) setFilterScope('all');
      
      // ✅ Dynamiquement renommer le label du quartier
      const quartierName = user.quartierCode ? findLocationByCode(user.quartierCode)?.name : 'Quartier';
      setTabLabels(quartierName || 'Quartier');
      
      if (activeTab === 'lieux' && activeLieuTab === 'quartier') {
        loadGroups();
      } else {
        setLoading(false);
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'lieux' && activeLieuTab === 'quartier' && userData) {
      loadGroups();
    }
  }, [activeTab, activeLieuTab, userData, filterScope]);

  useEffect(() => {
    if (selectedGroup) {
      loadMessages();
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    if (!userData) return;

    const token = localStorage.getItem("token");
    try {
      // Admin avec filtre "Tout voir" : tous les groupes
      if (isAdmin && filterScope === 'all') {
        const response = await fetch(`http://localhost:5002/api/residences/groups?location=`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        const mapped = (data.groups || []).map((g: any) => {
          const displayName = findLocationByCode(g.location) ? getLocationGroupTitle(g.location) : (g.title || g.name);
          return { ...g, name: displayName, title: displayName, members: g.members || [] };
        });
        setGroups(mapped);
        setLoading(false);
        return;
      }

      // Utilisateur : groupes de ses 1 à 3 quartiers (lieu1, lieu2, lieu3)
      const quartiersToLoad = userQuartierCodes.length > 0 ? userQuartierCodes : [userData.quartier || userData.lieu1 || userData.lieuResidence1].filter(Boolean);
      if (quartiersToLoad.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      const allGroups: any[] = [];
      const seenIds = new Set<string>();
      for (const loc of quartiersToLoad) {
        const response = await fetch(`http://localhost:5002/api/residences/groups?location=${encodeURIComponent(loc)}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        for (const g of data.groups || []) {
          if (seenIds.has(g.id)) continue;
          seenIds.add(g.id);
          const displayName = findLocationByCode(g.location) ? getLocationGroupTitle(g.location) : (g.title || g.name);
          allGroups.push({ ...g, name: displayName, title: displayName, members: g.members || [] });
        }
      }

      setGroups(allGroups);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };


  const loadMessages = async () => {
    if (!selectedGroup) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5002/api/residences/groups/${selectedGroup.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setMessages((data.messages || []).reverse());
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  // Catégories quartier : besoins du quartier (décès, mariage, baptême, etc.)
  const QUARTIER_CATEGORIES = [
    { id: 'information', label: 'Information', icon: 'ℹ️' },
    { id: 'rencontre', label: 'Rencontre', icon: '🤝' },
    { id: 'deces', label: 'Décès', icon: '🕯️' },
    { id: 'mariage', label: 'Mariage', icon: '💒' },
    { id: 'bapteme', label: 'Baptême', icon: '⛪' },
    { id: 'naissance', label: 'Naissance', icon: '👶' },
    { id: 'solidarite', label: 'Solidarité / Entraide', icon: '🤲' },
    { id: 'fete', label: 'Fête / Événement', icon: '🎉' },
    { id: 'annonce', label: 'Annonce', icon: '📢' },
    { id: 'securite', label: 'Sécurité / Urgence', icon: '🚨' },
    { id: 'reunion', label: 'Réunion', icon: '👥' }
  ] as const;

  const getCategoryLogo = (category: string) => {
    const c = QUARTIER_CATEGORIES.find((x) => x.id === category);
    return c ? c.icon : 'ℹ️';
  };

  const getCategoryName = (category: string) => {
    const c = QUARTIER_CATEGORIES.find((x) => x.id === category);
    return c ? c.label : 'Information';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'audio-recording.webm', { type: 'audio/webm' });
        setNewMessage({ ...newMessage, messageType: 'audio', mediaFile: audioFile });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur accès micro:', error);
      alert('Impossible d\'accéder au micro. Vérifiez les permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const sendMessage = async () => {
    if (!selectedGroup) return;
    
    // ✅ PERMISSIONS JOURNALISTES - Vérifier les droits selon le niveau
    // - Niveau "Quartier" : Tous les utilisateurs peuvent publier dans l'un de leurs 3 quartiers
    // - Niveau "Sous-préfecture/Préfecture/..." : Seuls les journalistes et admins
    if (activeLieuTab !== 'quartier' && !isJournalist) {
      alert('❌ Vous n\'avez pas les droits pour publier à ce niveau.\n\nSeuls les journalistes approuvés peuvent publier des informations au niveau Sous-préfecture, Préfecture, Région, Pays ou Continent.\n\nVous pouvez publier librement dans votre Quartier.');
      return;
    }

    // Vérifier si l'utilisateur est admin ou si le groupe correspond à l'un de ses 1 à 3 quartiers
    const canPublishInGroup = isAdmin || (activeLieuTab === 'quartier' && userQuartierCodes.length > 0 && userQuartierCodes.includes(selectedGroup.location));
    if (!canPublishInGroup) {
      alert('Vous ne pouvez publier que dans l\'un de vos quartiers (résidence 1, 2 ou 3). Contactez un administrateur pour obtenir des droits dans d\'autres quartiers.');
      return;
    }
    
    if (newMessage.messageType === 'text' && !newMessage.content.trim()) {
      alert('Veuillez entrer un message');
      return;
    }
    
    if (newMessage.messageType !== 'text' && !newMessage.mediaFile) {
      alert('Veuillez sélectionner un fichier média');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('content', newMessage.content);
      formData.append('messageType', newMessage.messageType);
      formData.append('category', newMessage.category);
      
      if (newMessage.mediaFile) {
        formData.append('media', newMessage.mediaFile);
      }
      
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5002/api/residences/groups/${selectedGroup.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setNewMessage({ content: '', messageType: 'text', category: 'information', mediaFile: null });
        await loadMessages();
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur lors de l\'envoi du message' }));
        alert(error.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert(error.message || 'Erreur lors de l\'envoi du message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 md:py-6 overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 overflow-hidden flex-1 min-w-0">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl flex-shrink-0">
                {userData?.continentCode ? getContinentIcon(userData.continentCode, userContinent?.name) : '🌍'}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 break-words">
                  Terre ADAM {userContinent?.name ? `- ${userContinent.name}` : ''}
                </h1>
                <p className="mt-0.5 sm:mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 break-words"></p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/moi')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap"
              >
                ← Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8 overflow-x-auto">
            {[
              { 
                id: 'lieux', 
                label: 'Résidence', 
                icon: '🏠',
                customLabel: userQuartier ? `Mon Quartier` : 'Résidence'
              },
              { 
                id: 'region', 
                label: 'Région', 
                icon: getRegionIcon(userData?.regionCode, userRegion?.name || userData?.region || userData?.regionOrigine),
                customLabel: userRegion ? `Ma Région` : 'Région'
              },
              { 
                id: 'pays', 
                label: 'Pays', 
                icon: userData?.paysCode ? getCountryFlag(userData.paysCode, userCountry?.name) : '🏳️',
                customLabel: userCountry ? `Mon Pays` : 'Pays'
              },
              { 
                id: 'continent', 
                label: 'Continent', 
                icon: userData?.continentCode ? getContinentIcon(userData.continentCode, userContinent?.name) : '🌐',
                customLabel: userContinent ? `Mon Continent` : 'Continent'
              },
              { id: 'mondial', label: 'Mondial', icon: '🌎' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 sm:py-2 md:py-3 px-0.5 sm:px-1 md:px-2 border-b-2 font-medium text-[10px] sm:text-xs md:text-sm flex items-center gap-0.5 sm:gap-1 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-xs sm:text-sm md:text-base">{tab.icon}</span>
                <span className="text-[10px] sm:text-xs md:text-sm leading-tight">{tab.customLabel || tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6 overflow-hidden">
        {/* 1. Résidence */}
        {activeTab === 'lieux' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl">🏠</span>
                <span className="text-[11px] sm:text-xs md:text-sm lg:text-base">Résidence</span>
              </h2>
              {/* Sous-onglets pour Résidence */}
              <div className="border-b border-gray-200 mb-3 sm:mb-4 md:mb-6 overflow-hidden">
                <nav className="flex space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto">
                  {[
                    { id: 'quartier', label: 'Quartier', icon: '🏘️' },
                    { id: 'sous-prefecture', label: 'Sous-préfecture', icon: '🏛️' },
                    { id: 'prefecture', label: 'Préfecture', icon: '🏢' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveLieuTab(tab.id as any)}
                      className={`py-1.5 sm:py-2 px-0.5 sm:px-1 md:px-2 border-b-2 font-medium text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1 ${
                        activeLieuTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm md:text-base">{tab.icon}</span>
                      <span className="text-[10px] sm:text-xs leading-tight break-words">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {((userData?.continentCode && userData?.paysCode && userData?.regionCode && userData?.prefectureCode && userData?.sousPrefectureCode) || isAdmin) ? (
                <div className="space-y-4">
                  {/* Page Quartier */}
                  {activeLieuTab === 'quartier' && (
                    <div className="space-y-3 sm:space-y-4">
                      {/* Affichage des 3 emplacements quartiers : 1 à 3 remplis, le reste = bouton Ajouter */}
                      {(() => {
                        const codes = [
                          userData?.quartierCode || userData?.lieu1 || userData?.lieuResidence1,
                          userData?.quartierCode2 || userData?.lieu2 || userData?.lieuResidence2,
                          userData?.quartierCode3 || userData?.lieu3 || userData?.lieuResidence3
                        ];
                        const slots: { num: number; code: string | null; name: string | null }[] = [1, 2, 3].map((num, i) => {
                          const code = codes[i] || null;
                          const loc = code ? findLocationByCode(code) : null;
                          return { num, code: code || null, name: loc?.name || null };
                        });

                        return (
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-5 overflow-hidden">
                            <div className="text-center mb-4">
                              <div className="text-2xl sm:text-3xl mb-1">🏘️</div>
                              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                Mes quartiers (résidence 1, 2, 3)
                              </h3>
                            </div>
                            {/* Toujours 3 emplacements : quartier rempli ou bouton pour ajouter */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                              {slots.map((slot) => (
                                slot.name ? (
                                  <div
                                    key={slot.num}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow border-2 border-blue-300 dark:border-blue-700"
                                  >
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                      Résidence {slot.num}
                                    </p>
                                    <p className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300 break-words">
                                      {slot.name}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-500 font-mono mt-2">
                                      {slot.code}
                                    </p>
                                  </div>
                                ) : (
                                  <button
                                    key={slot.num}
                                    type="button"
                                    onClick={() => navigate('/moi/profil')}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors flex flex-col items-center justify-center min-h-[100px] text-center"
                                  >
                                    <span className="text-2xl mb-1">➕</span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                      Résidence {slot.num}
                                    </span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                                      Ajouter un quartier
                                    </span>
                                  </button>
                                )
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-blue-300 dark:border-blue-700 space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                              <p><strong>Sous-préfecture :</strong> {userSousPrefecture?.name || userData.sousPrefecture || 'Non défini'}</p>
                              <p><strong>Préfecture :</strong> {userPrefecture?.name || userData.prefecture || 'Non défini'}</p>
                              <p><strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}</p>
                              <p><strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}</p>
                              <p><strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}</p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Système de messagerie – après les 3 quartiers */}
                      <div className="mt-8 sm:mt-10 space-y-4">
                        {/* En-tête avec filtres */}
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            💬 Système de Messagerie – Groupes disponibles
                            {!isAdmin && (
                              <span className="block sm:inline mt-1 sm:mt-0 sm:ml-2 text-sm font-normal text-amber-700">
                                {userQuartierCodes.length > 1 ? '(Vos quartiers : résidence 1, 2 et 3)' : '(Votre quartier uniquement)'}
                              </span>
                            )}
                            {isAdmin && (
                              <span className="block sm:inline mt-1 sm:mt-0 sm:ml-2 text-sm font-normal text-emerald-700">
                                ({filterScope === 'all' ? 'Tous les quartiers' : 'Mon quartier'})
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 text-gray-700 text-sm font-medium transition-colors"
                              >
                                <span>🔽</span>
                                Filtres
                              </button>
                              {showFilterDropdown && (
                                <div className="absolute left-0 top-full mt-1 py-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  {isAdmin ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => { setFilterScope('all'); setShowFilterDropdown(false); loadGroups(); }}
                                        className={`w-full text-left px-4 py-2 text-sm ${filterScope === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                                      >
                                        🌍 Tout voir
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => { setFilterScope('quartier'); setShowFilterDropdown(false); loadGroups(); }}
                                        className={`w-full text-left px-4 py-2 text-sm ${filterScope === 'quartier' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                                      >
                                        🏘️ {userQuartierCodes.length > 1 ? 'Mes quartiers' : 'Mon quartier'}
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setShowFilterDropdown(false)}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-600"
                                    >
                                      🏘️ {userQuartierCodes.length > 1 ? 'Mes quartiers' : 'Mon quartier'} (seul filtre disponible)
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {!selectedGroup ? (
                          /* Liste des groupes */
                          <div className="space-y-2">
                            {groups.length === 0 ? (
                              <div className="bg-gray-50 rounded-lg p-6 text-center">
                                <p className="text-gray-600">Aucun groupe pour le moment.</p>
                                <p className="text-sm text-gray-500 mt-2">Les groupes sont créés automatiquement par le système.</p>
                              </div>
                            ) : (
                              groups.map((group) => (
                                <div
                                  key={group.id}
                                  onClick={() => setSelectedGroup(group)}
                                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200 cursor-pointer flex items-center gap-4"
                                >
                                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                    👥
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{group.title || group.name}</h4>
                                    {group.description && (
                                      <p className="text-sm text-gray-500 truncate">{group.description}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                      {group.members?.length ?? 0} membre{(group.members?.length ?? 0) > 1 ? 's' : ''}
                                    </p>
                                  </div>
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                        /* Interface même système que page Activité : blocs besoins + filtre + messages */
                        <div className="mt-4 space-y-4">
                          {/* Blocs besoins du quartier (Décès, Mariage, Baptême, etc.) */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                            {QUARTIER_CATEGORIES.filter((c) => ['deces', 'mariage', 'bapteme', 'naissance', 'solidarite', 'fete', 'securite', 'annonce'].includes(c.id)).map((cat) => {
                              const count = messages.filter((m: ResidenceMessage) => (m.category || 'information') === cat.id).length;
                              return (
                                <div
                                  key={cat.id}
                                  onClick={() => setFeedFilter(feedFilter === cat.id ? 'all' : cat.id)}
                                  className={`bg-white rounded-xl shadow-sm border-2 p-3 cursor-pointer transition-all ${
                                    feedFilter === cat.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                                  }`}
                                >
                                  <span className="text-xl sm:text-2xl">{cat.icon}</span>
                                  <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 truncate">{cat.label}</p>
                                  <p className="text-[10px] text-gray-500">{count} partage(s)</p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Filtre du fil */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setFeedFilter('all')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                feedFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Tout le fil
                            </button>
                            {QUARTIER_CATEGORIES.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFeedFilter(feedFilter === cat.id ? 'all' : cat.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                  feedFilter === cat.id ? 'bg-green-600 text-white' : 'bg-green-50 text-green-800 hover:bg-green-100'
                                }`}
                              >
                                {cat.icon} {cat.label}
                              </button>
                            ))}
                          </div>

                        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '400px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
                          {/* Header */}
                          <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setSelectedGroup(null)}
                                className="text-white hover:bg-green-700 rounded-full p-2 transition-colors"
                              >
                                ←
                              </button>
                              <div>
                                <h3 className="font-semibold">{selectedGroup.title || selectedGroup.name}</h3>
                                <p className="text-xs text-green-100 opacity-90">{selectedGroup.members?.length ?? 0} membre(s)</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Zone de messages */}
                          <div className="flex-1 overflow-y-auto bg-gray-100 p-4" style={{ minHeight: '250px', maxHeight: 'calc(70vh - 140px)', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                            {(() => {
                              const filtered = feedFilter === 'all' ? messages : messages.filter((m: ResidenceMessage) => (m.category || 'information') === feedFilter);
                              const emptyMsg = feedFilter === 'all' ? 'Aucun message pour le moment.' : `Aucun message « ${getCategoryName(feedFilter)} ». Soyez le premier !`;
                              return filtered.length === 0 ? (
                              <div className="text-center text-gray-500 py-8">
                                <p>{emptyMsg}</p>
                                <p className="text-sm mt-1">Soyez le premier à envoyer un message !</p>
                              </div>
                            ) : (
                              filtered.map((msg: ResidenceMessage) => {
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
                                        <p className="text-xs font-semibold mb-1 opacity-75">{msg.authorName}</p>
                                      )}
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm">{getCategoryLogo(msg.category || 'information')}</span>
                                        <span className={`text-xs font-medium ${isMyMessage ? 'text-green-100' : 'text-gray-600'}`}>
                                          {getCategoryName(msg.category || 'information')}
                                        </span>
                                      </div>
                                      {(msg.type === 'text' || msg.messageType === 'text') && msg.content && (
                                        <p className="text-sm">{msg.content}</p>
                                      )}
                                      {(msg.type === 'image' || msg.messageType === 'image') && msg.mediaUrl && (
                                        <img
                                          src={msg.mediaUrl.startsWith('http') ? msg.mediaUrl : `http://localhost:5002${msg.mediaUrl.startsWith('/') ? msg.mediaUrl : '/' + msg.mediaUrl}`}
                                          alt="Image"
                                          className="max-w-full h-auto rounded-lg mb-1"
                                        />
                                      )}
                                      {(msg.type === 'video' || msg.messageType === 'video') && msg.mediaUrl && (
                                        <video
                                          src={msg.mediaUrl.startsWith('http') ? msg.mediaUrl : `http://localhost:5002${msg.mediaUrl.startsWith('/') ? msg.mediaUrl : '/' + msg.mediaUrl}`}
                                          controls
                                          className="max-w-full h-auto rounded-lg mb-1"
                                        />
                                      )}
                                      {(msg.type === 'audio' || msg.messageType === 'audio') && msg.mediaUrl && (
                                        <audio
                                          src={msg.mediaUrl.startsWith('http') ? msg.mediaUrl : `http://localhost:5002${msg.mediaUrl.startsWith('/') ? msg.mediaUrl : '/' + msg.mediaUrl}`}
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
                            );
                            })()}
                            <div ref={messagesEndRef} />
                          </div>
                          
                          {/* Zone de saisie (même système que page Activité) – catégories besoins du quartier */}
                          <div className="bg-gray-200 px-4 py-2 border-t">
                            <div className="space-y-2">
                              <div className="flex gap-2 flex-wrap">
                                <select
                                  value={newMessage.category}
                                  onChange={(e) => setNewMessage({...newMessage, category: e.target.value})}
                                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                                >
                                  {QUARTIER_CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex gap-2 flex-1">
                                  <select
                                    value={newMessage.messageType}
                                    onChange={(e) => {
                                      setNewMessage({...newMessage, messageType: e.target.value as any, mediaFile: null});
                                      if (e.target.value !== 'audio' && isRecording) stopRecording();
                                    }}
                                    className="px-2 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                                  >
                                    <option value="text">📝</option>
                                    <option value="image">🖼️</option>
                                    <option value="video">🎥</option>
                                    <option value="audio">🎵</option>
                                  </select>
                                  {newMessage.messageType === 'text' ? (
                                    <input
                                      type="text"
                                      value={newMessage.content}
                                      onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          sendMessage();
                                        }
                                      }}
                                      placeholder="Tapez un message..."
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                  ) : newMessage.messageType === 'audio' ? (
                                    <div className="flex gap-2 flex-1 items-center">
                                      {!isRecording && !newMessage.mediaFile ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={startRecording}
                                            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                                          >
                                            🎤 Enregistrer
                                          </button>
                                          <input
                                            type="file"
                                            accept="audio/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0] || null;
                                              if (file) setNewMessage({...newMessage, messageType: 'audio', mediaFile: file});
                                              else setNewMessage({...newMessage, mediaFile: null});
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                                          />
                                        </>
                                      ) : isRecording ? (
                                        <div className="flex items-center gap-2 flex-1">
                                          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                            <span className="text-sm text-red-700">Enregistrement...</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={stopRecording}
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
                                            onClick={() => setNewMessage({...newMessage, mediaFile: null})}
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
                                      accept={newMessage.messageType === 'image' ? 'image/*' : 'video/*'}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        if (file) {
                                          let detectedType = newMessage.messageType;
                                          if (file.type.startsWith('image/')) detectedType = 'image';
                                          else if (file.type.startsWith('video/')) detectedType = 'video';
                                          else if (file.type.startsWith('audio/')) detectedType = 'audio';
                                          setNewMessage({...newMessage, messageType: detectedType, mediaFile: file});
                                        } else setNewMessage({...newMessage, mediaFile: null});
                                      }}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                                    />
                                  )}
                                </div>
                                <button
                                  onClick={sendMessage}
                                  disabled={newMessage.messageType === 'text' ? !newMessage.content.trim() : !newMessage.mediaFile}
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
                  )}

                  {/* Page Sous-préfecture */}
                  {activeLieuTab === 'sous-prefecture' && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                        <div className="text-center overflow-hidden">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🏛️</div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                            {userSousPrefecture?.name || userData.sousPrefecture || 'Non défini'}
                          </h3>
                          {userData.sousPrefectureCode && (
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                              Code : <span className="font-mono font-semibold">{userData.sousPrefectureCode}</span>
                            </p>
                          )}
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-300 space-y-1 sm:space-y-1.5">
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Préfecture :</strong> {userPrefecture?.name || userData.prefecture || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 md:mt-6">
                        <button
                          onClick={() => {
                            alert('Accès à l\'espace communautaire de votre sous-préfecture');
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                        >
                          ✅ Accéder à l'espace Sous-préfecture
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Page Préfecture */}
                  {activeLieuTab === 'prefecture' && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                        <div className="text-center overflow-hidden">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🏢</div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                            {userPrefecture?.name || userData.prefecture || 'Non défini'}
                          </h3>
                          {userData.prefectureCode && (
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                              Code : <span className="font-mono font-semibold">{userData.prefectureCode}</span>
                            </p>
                          )}
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-purple-300 space-y-1 sm:space-y-1.5">
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 md:mt-6">
                        <button
                          onClick={() => {
                            alert('Accès à l\'espace communautaire de votre préfecture');
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                        >
                          ✅ Accéder à l'espace Préfecture
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                  <p className="text-[10px] sm:text-xs md:text-sm text-yellow-800 break-words">
                    <strong>⚠️ Aucun lieu de résidence enregistré</strong>
                    <br />
                    Vous n'avez pas encore enregistré vos lieux de résidence lors de l'inscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Région */}
        {activeTab === 'region' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                <span className="text-base sm:text-lg md:text-xl">{getRegionIcon(userData?.regionCode, userRegion?.name || userData?.region || userData?.regionOrigine)}</span>
                <span className="text-[11px] sm:text-xs md:text-sm break-words">{userRegion?.name || userData?.region || userData?.regionOrigine || 'Région'}</span>
              </h2>

              {userData?.regionCode ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <div className="text-center overflow-hidden">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">{getRegionIcon(userData.regionCode, userRegion?.name || userData.region || userData.regionOrigine)}</div>
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                        {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                      </h3>
                      {userData.regionCode && (
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                          Code : <span className="font-mono font-semibold">{userData.regionCode}</span>
                        </p>
                      )}
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-300">
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                          <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                        </p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                          <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre région');
                        // Ici, vous pouvez naviguer vers l'espace de la région
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                    >
                      ✅ Accéder à l'espace Région
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                  <p className="text-[10px] sm:text-xs md:text-sm text-yellow-800 break-words">
                    <strong>⚠️ Aucune région enregistrée</strong>
                    <br />
                    Vous n'avez pas encore enregistré votre région lors de l'inscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Pays */}
        {activeTab === 'pays' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl">{userData?.paysCode ? getCountryFlag(userData.paysCode, userCountry?.name) : '🏳️'}</span>
                <span className="text-[11px] sm:text-xs md:text-sm break-words">{userCountry?.name || 'Pays'}</span>
              </h2>

              {userData?.paysCode && userCountry ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <div className="text-center overflow-hidden">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">
                        {getCountryFlag(userData.paysCode, userCountry.name)}
                      </div>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-purple-600 mb-2 sm:mb-3 break-words">
                        {userCountry.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre pays');
                        // Ici, vous pouvez naviguer vers l'espace du pays
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                    >
                      ✅ Accéder à l'espace Pays
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                  <p className="text-[10px] sm:text-xs md:text-sm text-yellow-800 break-words">
                    <strong>⚠️ Aucun pays enregistré</strong>
                    <br />
                    Vous n'avez pas encore enregistré votre pays lors de l'inscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Continent */}
        {activeTab === 'continent' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                <span className="text-base sm:text-lg md:text-xl">{getContinentIcon(userData?.continentCode, userContinent?.name)}</span>
                <span className="text-[11px] sm:text-xs md:text-sm break-words">{userContinent?.name || userData?.continent || 'Continent'}</span>
              </h2>

              {userData?.continentCode ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <div className="text-center overflow-hidden">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">{getContinentIcon(userData.continentCode, userContinent?.name)}</div>
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                        {userContinent?.name || userData.continent || 'Non défini'}
                      </h3>
                      {userData.continentCode && (
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                          Code : <span className="font-mono font-semibold">{userData.continentCode}</span>
                        </p>
                      )}
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-orange-300">
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 break-words">
                          <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre continent');
                        // Ici, vous pouvez naviguer vers l'espace du continent
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                    >
                      ✅ Accéder à l'espace Continent
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                  <p className="text-[10px] sm:text-xs md:text-sm text-yellow-800 break-words">
                    <strong>⚠️ Aucun continent enregistré</strong>
                    <br />
                    Vous n'avez pas encore enregistré votre continent lors de l'inscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Mondial */}
        {activeTab === 'mondial' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <span className="text-base sm:text-lg md:text-xl">🌎</span>
                <span className="text-[11px] sm:text-xs md:text-sm">Mondial</span>
              </h2>

              <div className="text-center py-3 sm:py-4 md:py-6 lg:py-8 overflow-hidden">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🌎</div>
                <button
                  onClick={() => {
                    alert('Accès à l\'espace mondial');
                    // Ici, vous pouvez naviguer vers l'espace mondial
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 lg:px-8 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm lg:text-base font-medium"
                >
                  ✅ Accéder à l'espace Mondial
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Journalistes Professionnels (approuvés par l'admin) */}
        <ProSection
          type="journalist"
          title="Journalistes"
          icon="📰"
          description=""
          hideEmptyMessage
        />
      </div>
    </div>
  );
}

