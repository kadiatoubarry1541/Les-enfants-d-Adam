import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface Friend {
  id: string;
  numeroH: string;
  prenom: string;
  nomFamille: string;
  email?: string;
  phone?: string;
  status: 'pending' | 'accepted' | 'blocked';
  requestedAt: string;
  acceptedAt?: string;
  mutualFriends: number;
  commonInterests: string[];
  bio?: string;
  location?: string;
  occupation?: string;
  hobbies?: string[];
  lastSeen?: string;
  isOnline?: boolean;
  profilePicture?: string;
}

interface FriendRequest {
  id: string;
  fromUser: string;
  fromUserName: string;
  toUser: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
}

interface UserInfo {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  hobbies?: string[];
  interests?: string[];
  education?: string;
  birthDate?: string;
  maritalStatus?: string;
  children?: number;
  languages?: string[];
  profilePicture?: string;
  isPublic: boolean;
}

export default function MesAmours() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'info'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const [addFriendForm, setAddFriendForm] = useState({
    numeroH: '',
    message: ''
  });

  const [editInfoForm, setEditInfoForm] = useState({
    bio: '',
    location: '',
    occupation: '',
    hobbies: '',
    interests: '',
    education: '',
    birthDate: '',
    maritalStatus: '',
    children: '',
    languages: '',
    isPublic: true
  });

  useEffect(() => {
    const session = localStorage.getItem("session_user");
    if (!session) {
      return;
    }

    try {
      const parsed = JSON.parse(session);
      const user = parsed.userData || parsed;
      if (!user || !user.numeroH) {
        return;
      }
      
      setUserData(user);
      loadData();
    } catch {
      // Ignore
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFriends(),
        loadFriendRequests(),
        loadUserInfo()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/friends/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      } else {
        setFriends(getDefaultFriends());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des amis:', error);
      setFriends(getDefaultFriends());
    }
  };

  const loadFriendRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/friends/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data.requests || []);
      } else {
        setFriendRequests(getDefaultFriendRequests());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      setFriendRequests(getDefaultFriendRequests());
    }
  };

  const loadUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/user/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.info || getDefaultUserInfo());
      } else {
        setUserInfo(getDefaultUserInfo());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des informations:', error);
      setUserInfo(getDefaultUserInfo());
    }
  };

  const getDefaultFriends = (): Friend[] => [
    {
      id: '1',
      numeroH: 'FRIEND001',
      prenom: 'Fatou',
      nomFamille: 'Camara',
      email: 'fatou.camara@email.com',
      phone: '+224 123 456 789',
      status: 'accepted',
      requestedAt: '2024-01-15T10:00:00Z',
      acceptedAt: '2024-01-15T10:30:00Z',
      mutualFriends: 5,
      commonInterests: ['Musique', 'Voyage'],
      bio: 'Passionnée de musique et de voyage',
      location: 'Conakry',
      occupation: 'Enseignante',
      hobbies: ['Chant', 'Danse', 'Lecture'],
      lastSeen: '2024-01-20T15:30:00Z',
      isOnline: true,
      profilePicture: '/api/placeholder/100/100'
    },
    {
      id: '2',
      numeroH: 'FRIEND002',
      prenom: 'Alpha',
      nomFamille: 'Diallo',
      email: 'alpha.diallo@email.com',
      phone: '+224 987 654 321',
      status: 'accepted',
      requestedAt: '2024-01-10T09:00:00Z',
      acceptedAt: '2024-01-10T09:15:00Z',
      mutualFriends: 3,
      commonInterests: ['Sport', 'Cinéma'],
      bio: 'Sportif et cinéphile',
      location: 'Kindia',
      occupation: 'Ingénieur',
      hobbies: ['Football', 'Cinéma', 'Gaming'],
      lastSeen: '2024-01-20T12:00:00Z',
      isOnline: false,
      profilePicture: '/api/placeholder/100/100'
    }
  ];

  const getDefaultFriendRequests = (): FriendRequest[] => [
    {
      id: '1',
      fromUser: 'REQUEST001',
      fromUserName: 'Mariama Bah',
      toUser: userData?.numeroH || '',
      message: 'Salut ! J\'aimerais être ton amie',
      status: 'pending',
      createdAt: '2024-01-20T14:00:00Z'
    },
    {
      id: '2',
      fromUser: 'REQUEST002',
      fromUserName: 'Ousmane Barry',
      toUser: userData?.numeroH || '',
      message: 'Bonjour, nous avons des amis en commun',
      status: 'pending',
      createdAt: '2024-01-19T16:30:00Z'
    }
  ];

  const getDefaultUserInfo = (): UserInfo => ({
    numeroH: userData?.numeroH || '',
    prenom: userData?.prenom || '',
    nomFamille: userData?.nomFamille || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    bio: 'Partagez vos informations personnelles',
    location: '',
    occupation: '',
    hobbies: [],
    interests: [],
    education: '',
    birthDate: '',
    maritalStatus: '',
    children: 0,
    languages: [],
    profilePicture: '/api/placeholder/200/200',
    isPublic: true
  });

  const handleAddFriend = () => {
    setAddFriendForm({
      numeroH: '',
      message: ''
    });
    setShowAddFriend(true);
  };

  const submitAddFriend = async () => {
    if (!addFriendForm.numeroH) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/friends/send-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toUser: addFriendForm.numeroH,
          message: addFriendForm.message
        })
      });

      if (response.ok) {
        alert('Demande d\'amitié envoyée !');
        setShowAddFriend(false);
        loadFriendRequests();
      } else {
        alert('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/friends/respond-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId,
          action
        })
      });

      if (response.ok) {
        alert(action === 'accept' ? 'Demande acceptée !' : 'Demande rejetée');
        loadFriendRequests();
        loadFriends();
      } else {
        alert('Erreur lors de la réponse');
      }
    } catch (error) {
      console.error('Erreur lors de la réponse:', error);
      alert('Erreur lors de la réponse');
    }
  };

  const handleViewFriendInfo = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowInfoModal(true);
  };

  const handleEditInfo = () => {
    if (userInfo) {
      setEditInfoForm({
        bio: userInfo.bio || '',
        location: userInfo.location || '',
        occupation: userInfo.occupation || '',
        hobbies: userInfo.hobbies?.join(', ') || '',
        interests: userInfo.interests?.join(', ') || '',
        education: userInfo.education || '',
        birthDate: userInfo.birthDate || '',
        maritalStatus: userInfo.maritalStatus || '',
        children: userInfo.children?.toString() || '',
        languages: userInfo.languages?.join(', ') || '',
        isPublic: userInfo.isPublic
      });
      setShowEditInfo(true);
    }
  };

  const submitEditInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/user/update-info', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bio: editInfoForm.bio,
          location: editInfoForm.location,
          occupation: editInfoForm.occupation,
          hobbies: editInfoForm.hobbies.split(',').map(h => h.trim()).filter(h => h),
          interests: editInfoForm.interests.split(',').map(i => i.trim()).filter(i => i),
          education: editInfoForm.education,
          birthDate: editInfoForm.birthDate,
          maritalStatus: editInfoForm.maritalStatus,
          children: parseInt(editInfoForm.children) || 0,
          languages: editInfoForm.languages.split(',').map(l => l.trim()).filter(l => l),
          isPublic: editInfoForm.isPublic
        })
      });

      if (response.ok) {
        alert('Informations mises à jour !');
        setShowEditInfo(false);
        loadUserInfo();
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos amours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bouton Retour */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Link
            to="/famille"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
          >
            <span aria-hidden>←</span>
            Retour à Famille
          </Link>
        </div>
      </div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💕 Mes Amours</h1>
              <Link to="/famille/inspir" className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm font-medium rounded-lg transition-colors border border-yellow-300">
                🤝 Inspir
              </Link>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAddFriend}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ➕ Ajouter un ami
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
              { id: 'friends', label: 'Mes Amis', icon: '👥' },
              { id: 'requests', label: 'Demandes', icon: '📨' },
              { id: 'info', label: 'Informations', icon: 'ℹ️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
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
        {activeTab === 'friends' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">👥 Ma Liste d'Amis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map((friend) => (
                  <div key={friend.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <img
                          src={friend.profilePicture || '/api/placeholder/60/60'}
                          alt={`${friend.prenom} ${friend.nomFamille}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {friend.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">
                          {friend.prenom} {friend.nomFamille}
                        </h3>
                        <p className="text-sm text-gray-600">{friend.numeroH}</p>
                        {friend.isOnline ? (
                          <p className="text-xs text-green-600">En ligne</p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Vu {new Date(friend.lastSeen || '').toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {friend.bio && (
                      <p className="text-sm text-gray-600 mb-3">{friend.bio}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      {friend.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          <span>{friend.location}</span>
                        </div>
                      )}
                      {friend.occupation && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">💼</span>
                          <span>{friend.occupation}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">👥</span>
                        <span>{friend.mutualFriends} amis en commun</span>
                      </div>
                    </div>

                    {friend.commonInterests.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Intérêts communs:</h4>
                        <div className="flex flex-wrap gap-1">
                          {friend.commonInterests.map((interest, index) => (
                            <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewFriendInfo(friend)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Voir infos
                      </button>
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📨 Demandes d'Amitié</h2>
              <div className="space-y-4">
                {friendRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {request.fromUserName}
                        </h3>
                        {request.message && (
                          <p className="text-gray-600 mb-3">{request.message}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Demande envoyée le: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleFriendRequest(request.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          ✓ Accepter
                        </button>
                        <button
                          onClick={() => handleFriendRequest(request.id, 'reject')}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          ✗ Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {friendRequests.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune demande d'amitié en attente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">ℹ️ Mes Informations</h2>
                <button
                  onClick={handleEditInfo}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ✏️ Modifier
                </button>
              </div>

              {userInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <p className="text-gray-900">{userInfo.bio || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                      <p className="text-gray-900">{userInfo.location || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                      <p className="text-gray-900">{userInfo.occupation || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Éducation</label>
                      <p className="text-gray-900">{userInfo.education || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                      <p className="text-gray-900">{userInfo.birthDate || 'Non renseigné'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut marital</label>
                      <p className="text-gray-900">{userInfo.maritalStatus || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants</label>
                      <p className="text-gray-900">{userInfo.children || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                      <div className="flex flex-wrap gap-1">
                        {userInfo.hobbies && userInfo.hobbies.length > 0 ? (
                          userInfo.hobbies.map((hobby, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {hobby}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">Non renseigné</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Intérêts</label>
                      <div className="flex flex-wrap gap-1">
                        {userInfo.interests && userInfo.interests.length > 0 ? (
                          userInfo.interests.map((interest, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">Non renseigné</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Langues</label>
                      <div className="flex flex-wrap gap-1">
                        {userInfo.languages && userInfo.languages.length > 0 ? (
                          userInfo.languages.map((language, index) => (
                            <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              {language}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">Non renseigné</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visibilité</label>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        userInfo.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {userInfo.isPublic ? 'Public' : 'Privé'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal d'ajout d'ami */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">➕ Ajouter un Ami</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NumeroH de l'ami
                </label>
                <input
                  type="text"
                  value={addFriendForm.numeroH}
                  onChange={(e) => setAddFriendForm({...addFriendForm, numeroH: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Entrez le NumeroH"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optionnel)
                </label>
                <textarea
                  value={addFriendForm.message}
                  onChange={(e) => setAddFriendForm({...addFriendForm, message: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  placeholder="Message d'invitation..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddFriend(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitAddFriend}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'informations d'ami */}
      {showInfoModal && selectedFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ℹ️ Informations de {selectedFriend.prenom} {selectedFriend.nomFamille}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src={selectedFriend.profilePicture || '/api/placeholder/60/60'}
                  alt={`${selectedFriend.prenom} ${selectedFriend.nomFamille}`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedFriend.prenom} {selectedFriend.nomFamille}
                  </h4>
                  <p className="text-sm text-gray-600">{selectedFriend.numeroH}</p>
                </div>
              </div>

              {selectedFriend.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <p className="text-gray-900">{selectedFriend.bio}</p>
                </div>
              )}

              {selectedFriend.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <p className="text-gray-900">{selectedFriend.location}</p>
                </div>
              )}

              {selectedFriend.occupation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <p className="text-gray-900">{selectedFriend.occupation}</p>
                </div>
              )}

              {selectedFriend.hobbies && selectedFriend.hobbies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedFriend.hobbies.map((hobby, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amis en commun</label>
                <p className="text-gray-900">{selectedFriend.mutualFriends}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intérêts communs</label>
                <div className="flex flex-wrap gap-1">
                  {selectedFriend.commonInterests.map((interest, index) => (
                    <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowInfoModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Fermer
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                Envoyer un message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition des informations */}
      {showEditInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✏️ Modifier mes Informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editInfoForm.bio}
                  onChange={(e) => setEditInfoForm({...editInfoForm, bio: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                <input
                  type="text"
                  value={editInfoForm.location}
                  onChange={(e) => setEditInfoForm({...editInfoForm, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <input
                  type="text"
                  value={editInfoForm.occupation}
                  onChange={(e) => setEditInfoForm({...editInfoForm, occupation: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Éducation</label>
                <input
                  type="text"
                  value={editInfoForm.education}
                  onChange={(e) => setEditInfoForm({...editInfoForm, education: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={editInfoForm.birthDate}
                  onChange={(e) => setEditInfoForm({...editInfoForm, birthDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut marital</label>
                <select
                  value={editInfoForm.maritalStatus}
                  onChange={(e) => setEditInfoForm({...editInfoForm, maritalStatus: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf/Veuve">Veuf/Veuve</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants</label>
                <input
                  type="number"
                  value={editInfoForm.children}
                  onChange={(e) => setEditInfoForm({...editInfoForm, children: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies (séparés par des virgules)</label>
                <input
                  type="text"
                  value={editInfoForm.hobbies}
                  onChange={(e) => setEditInfoForm({...editInfoForm, hobbies: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Musique, Sport, Lecture"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intérêts (séparés par des virgules)</label>
                <input
                  type="text"
                  value={editInfoForm.interests}
                  onChange={(e) => setEditInfoForm({...editInfoForm, interests: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Voyage, Cinéma, Art"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langues (séparées par des virgules)</label>
                <input
                  type="text"
                  value={editInfoForm.languages}
                  onChange={(e) => setEditInfoForm({...editInfoForm, languages: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Français, Anglais, Soussou"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editInfoForm.isPublic}
                    onChange={(e) => setEditInfoForm({...editInfoForm, isPublic: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Rendre mes informations publiques</span>
                </label>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditInfo(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitEditInfo}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

