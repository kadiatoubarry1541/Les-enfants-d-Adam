import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  findLocationByCode,
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
  name: string;
  description: string;
  location: string;
  members: UserData[];
  posts: any[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

interface ResidenceMessage {
  id: string;
  author: string;
  authorName: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
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
  
  // États pour le système de messagerie
  const [groups, setGroups] = useState<ResidenceGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ResidenceGroup | null>(null);
  const [messages, setMessages] = useState<ResidenceMessage[]>([]);
  const [newMessage, setNewMessage] = useState({
    content: '',
    messageType: 'text' as 'text' | 'image' | 'video' | 'audio',
    mediaFile: null as File | null
  });
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    neighborhood: '',
    district: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);

  // Récupérer les informations géographiques de l'utilisateur depuis la session
  const userContinent = userData?.continentCode ? findLocationByCode(userData.continentCode) : null;
  const userCountry = userData?.paysCode ? findLocationByCode(userData.paysCode) : null;
  const userRegion = userData?.regionCode ? findLocationByCode(userData.regionCode) : null;
  const userPrefecture = userData?.prefectureCode ? findLocationByCode(userData.prefectureCode) : null;
  const userSousPrefecture = userData?.sousPrefectureCode ? findLocationByCode(userData.sousPrefectureCode) : null;
  const userQuartier = userData?.quartierCode ? findLocationByCode(userData.quartierCode) : null;

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
      setIsAdmin(user.role === 'admin' || user.role === 'super-admin' || user.numeroH === 'G0C0P0R0E0F0 0');
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
  }, [activeTab, activeLieuTab, userData]);

  useEffect(() => {
    if (selectedGroup) {
      loadMessages();
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    if (!userData) return;
    
    try {
      const quartier = userData.quartier || userData.lieu1 || userData.lieuResidence1;
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5002/api/residences/lieu1/groups?location=${encodeURIComponent(quartier || '')}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      let filteredGroups = data.groups || [];
      
      // Si l'utilisateur n'est pas admin, filtrer par quartier
      if (!isAdmin && quartier) {
        filteredGroups = filteredGroups.filter((g: ResidenceGroup) => 
          g.location === quartier || g.location === userData.lieu1 || g.location === userData.lieuResidence1
        );
      }
      
      setGroups(filteredGroups);
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
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedGroup) return;
    
    const quartier = userData?.quartier || userData?.lieu1 || userData?.lieuResidence1;
    
    // Vérifier si l'utilisateur est admin ou si le groupe correspond à son quartier
    if (!isAdmin && selectedGroup.location !== quartier) {
      alert('Vous ne pouvez publier que dans votre quartier. Contactez un administrateur pour obtenir des droits de publication dans d\'autres quartiers.');
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
        setNewMessage({ content: '', messageType: 'text', mediaFile: null });
        loadMessages();
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur lors de l\'envoi du message' }));
        alert(error.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert(error.message || 'Erreur lors de l\'envoi du message');
    }
  };

  const createGroup = async () => {
    if (!userData) return;
    
    const quartier = userData.quartier || userData.lieu1 || userData.lieuResidence1;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/residences/lieu1/groups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newGroup,
          location: quartier,
          createdBy: userData.numeroH
        })
      });
      
      alert('Organisation créé avec succès !');
      setShowCreateGroup(false);
      setNewGroup({ name: '', description: '', neighborhood: '', district: '' });
      loadGroups();
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(error.message || 'Erreur lors de la création du Organisation');
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
                <p className="mt-0.5 sm:mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 break-words">Organisation géographique mondiale - Votre localisation</p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 overflow-hidden">
        {/* 1. Résidence */}
        {activeTab === 'lieux' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl">🏠</span>
                <span className="text-[11px] sm:text-xs md:text-sm lg:text-base">Résidence</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6">
                Votre localisation précise enregistrée lors de l'inscription
              </p>

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

              {userData?.continentCode && userData?.paysCode && userData?.regionCode && userData?.prefectureCode && userData?.sousPrefectureCode && userData?.quartierCode ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-800 mb-4">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription et ne peuvent pas être modifiées ici.
                    </p>
                  </div>

                  {/* Page Quartier */}
                  {activeLieuTab === 'quartier' && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                        <div className="text-center overflow-hidden">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🏘️</div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                            Mon Quartier : {userQuartier?.name || userData.quartier || userData.lieu1 || 'Non défini'}
                          </h3>
                          {userData.quartierCode && (
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                              Code : <span className="font-mono font-semibold">{userData.quartierCode}</span>
                            </p>
                          )}
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-blue-300 space-y-1 sm:space-y-1.5">
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Sous-préfecture :</strong> {userSousPrefecture?.name || userData.sousPrefecture || 'Non défini'}
                            </p>
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
                      
                      {/* Système de messagerie */}
                      {!selectedGroup ? (
                        <div className="mt-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">💬 Système de Messagerie - Groupes disponibles</h3>
                            <button
                              onClick={() => setShowCreateGroup(true)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              ➕ Créer un groupe
                            </button>
                          </div>
                          
                          {!isAdmin && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                              <p className="text-sm text-yellow-800">
                                • Vous ne pouvez publier que dans votre quartier
                              </p>
                            </div>
                          )}
                          
                          {/* Formulaire de création de groupe */}
                          {showCreateGroup && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h4 className="text-lg font-semibold mb-3">Créer un nouveau groupe</h4>
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={newGroup.name}
                                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                                  placeholder="Nom du groupe"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <textarea
                                  value={newGroup.description}
                                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                                  placeholder="Description"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={createGroup}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  >
                                    Créer
                                  </button>
                                  <button
                                    onClick={() => setShowCreateGroup(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Liste des groupes */}
                          <div className="space-y-2">
                            {groups.length === 0 ? (
                              <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <p className="text-gray-600 mb-4">Aucun groupe disponible pour le moment.</p>
                                <p className="text-sm text-gray-500">Créez un nouveau groupe pour commencer à échanger !</p>
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
                                    <h4 className="font-semibold text-gray-900">{group.name}</h4>
                                    {group.description && (
                                      <p className="text-sm text-gray-500 truncate">{group.description}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                      {group.members.length} membre{group.members.length > 1 ? 's' : ''}
                                    </p>
                                  </div>
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Interface WhatsApp style */
                        <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
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
                                <h3 className="font-semibold">{selectedGroup.name}</h3>
                              </div>
                            </div>
                          </div>
                          
                          {/* Zone de messages */}
                          <div className="flex-1 overflow-y-auto bg-gray-100 p-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                            {messages.length === 0 ? (
                              <div className="text-center text-gray-500 py-8">
                                <p>Aucun message pour le moment.</p>
                                <p className="text-sm">Soyez le premier à envoyer un message !</p>
                              </div>
                            ) : (
                              messages.map((msg) => {
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
                                      {msg.type === 'text' && msg.content && (
                                        <p className="text-sm">{msg.content}</p>
                                      )}
                                      {msg.type === 'image' && msg.mediaUrl && (
                                        <img
                                          src={msg.mediaUrl.startsWith('http') ? msg.mediaUrl : `http://localhost:5002${msg.mediaUrl.startsWith('/') ? msg.mediaUrl : '/' + msg.mediaUrl}`}
                                          alt="Image"
                                          className="max-w-full h-auto rounded-lg mb-1"
                                        />
                                      )}
                                      {msg.type === 'video' && msg.mediaUrl && (
                                        <video
                                          src={msg.mediaUrl.startsWith('http') ? msg.mediaUrl : `http://localhost:5002${msg.mediaUrl.startsWith('/') ? msg.mediaUrl : '/' + msg.mediaUrl}`}
                                          controls
                                          className="max-w-full h-auto rounded-lg mb-1"
                                        />
                                      )}
                                      {msg.type === 'audio' && msg.mediaUrl && (
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
                            )}
                          </div>
                          
                          {/* Zone de saisie */}
                          <div className="bg-gray-200 px-4 py-3 border-t">
                            <div className="flex gap-2">
                              <div className="flex gap-2 flex-1">
                                <select
                                  value={newMessage.messageType}
                                  onChange={(e) => setNewMessage({...newMessage, messageType: e.target.value as any, mediaFile: null})}
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
                                ) : (
                                  <input
                                    type="file"
                                    accept={newMessage.messageType === 'image' ? 'image/*' : newMessage.messageType === 'video' ? 'video/*' : 'audio/*'}
                                    onChange={(e) => setNewMessage({...newMessage, mediaFile: e.target.files?.[0] || null})}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                                  />
                                )}
                              </div>
                              <button
                                onClick={sendMessage}
                                disabled={newMessage.messageType === 'text' ? !newMessage.content.trim() : !newMessage.mediaFile}
                                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                              >
                                ➤
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Page Sous-préfecture */}
                  {activeLieuTab === 'sous-prefecture' && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                        <div className="text-center overflow-hidden">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🏛️</div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                            Ma Sous-préfecture : {userSousPrefecture?.name || userData.sousPrefecture || 'Non défini'}
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
                            Ma Préfecture : {userPrefecture?.name || userData.prefecture || 'Non défini'}
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

                  {/* Code complet - affiché sur toutes les sous-pages */}
                  <div className="mt-3 sm:mt-4 md:mt-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      📍 Code géographique complet
                    </label>
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg font-mono font-bold text-blue-600 break-all overflow-wrap-anywhere">
                      {userData.continentCode || ''}{userData.paysCode || ''}{userData.regionCode || ''}{userData.prefectureCode || ''}{userData.sousPrefectureCode || ''}{userData.quartierCode || ''}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1.5 sm:mt-2 break-words">
                      Ce code fait partie de votre NumeroH : <strong className="break-all">{userData.numeroH}</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800">
                    <strong>⚠️ Aucune localisation enregistrée</strong>
                    <br />
                    Vous n'avez pas encore enregistré vos informations géographiques lors de l'inscription.
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
                <span className="text-[11px] sm:text-xs md:text-sm break-words">Ma Région : {userRegion?.name || userData?.region || userData?.regionOrigine || 'Région'}</span>
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6">
                Votre région enregistrée lors de l'inscription
              </p>
              
              {userData?.regionCode ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-800 mb-1.5 sm:mb-2 md:mb-4 break-words">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

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
              {/* Afficher le titre avec le drapeau et le nom SEULEMENT si un pays est enregistré */}
              {userData?.paysCode && userCountry ? (
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl">{getCountryFlag(userData.paysCode, userCountry.name)}</span>
                  <span className="text-[11px] sm:text-xs md:text-sm break-words">Mon Pays : {userCountry.name}</span>
                </h2>
              ) : (
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl">🏳️</span>
                  <span className="text-[11px] sm:text-xs md:text-sm break-words">Mon Pays</span>
                </h2>
              )}
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6">
                Votre pays enregistré lors de l'inscription
              </p>
              
              {userData?.paysCode && userCountry ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-800 mb-1.5 sm:mb-2 md:mb-4 break-words">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

                  {/* Carte principale avec drapeau et nom du pays */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <div className="text-center overflow-hidden">
                      {/* Utiliser le paysCode pour obtenir le drapeau correct */}
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">
                        {getCountryFlag(userData.paysCode, userCountry.name)}
                      </div>
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Mon Pays</h3>
                      {/* Afficher SEULEMENT le nom du pays trouvé par findLocationByCode */}
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-purple-600 mb-2 sm:mb-3 break-words">
                        {userCountry.name}
                      </p>
                      {userData.paysCode && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                          Code : <span className="font-mono font-semibold">{userData.paysCode}</span>
                        </p>
                      )}
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
                <span className="text-[11px] sm:text-xs md:text-sm break-words">Mon Continent : {userContinent?.name || userData?.continent || 'Continent'}</span>
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6">
                Votre continent enregistré lors de l'inscription
              </p>
              
              {userData?.continentCode ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-800 mb-1.5 sm:mb-2 md:mb-4 break-words">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

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
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6 break-words">
                Accédez à l'espace communautaire mondial - Tous les membres de la Terre ADAM
              </p>
              
              <div className="text-center py-3 sm:py-4 md:py-6 lg:py-8 overflow-hidden">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🌎</div>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-700 mb-3 sm:mb-4 md:mb-6 break-words">
                  Bienvenue dans l'espace mondial de la Terre ADAM
                </p>
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
      </div>
    </div>
  );
}

