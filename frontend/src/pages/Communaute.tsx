import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  religion?: string;
  [key: string]: any;
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  religion: string;
  members: UserData[];
  posts: CommunityPost[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

interface CommunityPost {
  id: string;
  author: string;
  authorName: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  likes: string[];
  comments: CommunityComment[];
  createdAt: string;
}

interface CommunityComment {
  id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export default function Communaute() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const navigate = useNavigate();

  const [newPost, setNewPost] = useState({
    content: '',
    type: 'text' as 'text' | 'image' | 'video' | 'audio',
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
      loadGroups();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const loadGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/foi/communautes?religion=${userData?.religion}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups || []);
      } else {
        setGroups(getDefaultGroups());
      }
    } catch (error) {
      console.error('Erreur:', error);
      setGroups(getDefaultGroups());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultGroups = (): CommunityGroup[] => [
    {
      id: '1',
      name: userData?.religion ? `Communauté ${userData.religion}` : 'Communauté religieuse',
      description: 'Échangez avec les membres de votre communauté de foi',
      religion: userData?.religion || 'Général',
      members: userData ? [userData] : [],
      posts: [],
      isActive: true,
      createdBy: userData?.numeroH || 'G0C0P0R0E0F0 0',
      createdAt: new Date().toISOString()
    }
  ];

  const joinGroup = async (groupId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/foi/communautes/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numeroH: userData?.numeroH })
      });
      
      if (response.ok) {
        alert('Vous avez rejoint la communauté !');
        loadGroups();
      } else {
        alert('Erreur lors de l\'adhésion');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'adhésion');
    }
  };

  const createPost = async () => {
    if (!selectedGroup || !newPost.content.trim()) return;
    
    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      formData.append('type', newPost.type);
      formData.append('author', userData?.numeroH || '');
      formData.append('authorName', `${userData?.prenom} ${userData?.nomFamille}`);
      
      if (newPost.mediaFile) {
        formData.append('media', newPost.mediaFile);
      }
      
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/foi/communautes/${selectedGroup.id}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        alert('Publication créée !');
        setNewPost({ content: '', type: 'text', mediaFile: null });
        loadGroups();
      } else {
        alert('Erreur lors de la publication');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la publication');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement de la communauté...</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/solidarite')}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        ← Retour à Foi
      </button>

      <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-purple-500 border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">🕌</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communauté</h1>
            <p className="text-gray-600">Connectez-vous avec les membres de votre religion</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{groups.length}</div>
            <div className="text-sm text-purple-800">Communautés actives</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {groups.reduce((total, g) => total + g.members.length, 0)}
            </div>
            <div className="text-sm text-blue-800">Membres</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {groups.reduce((total, g) => total + g.posts.length, 0)}
            </div>
            <div className="text-sm text-green-800">Publications</div>
          </div>
        </div>

        {/* Liste des communautés */}
        {!selectedGroup ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🕌</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.religion}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{group.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{group.members.length} membres</span>
                  <span className="text-sm text-gray-600">{group.posts.length} publications</span>
                </div>
                <button
                  onClick={() => setSelectedGroup(group)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  💬 Rejoindre la discussion
                </button>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="text-center text-gray-500 py-12 col-span-full">
                <div className="text-6xl mb-4">🕌</div>
                <p>Aucune communauté trouvée pour votre religion.</p>
              </div>
            )}
          </div>
        ) : (
          /* Interface de discussion */
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">💬 {selectedGroup.name}</h2>
              <button
                onClick={() => setSelectedGroup(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                ← Retour
              </button>
            </div>

            {/* Formulaire de publication */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Publier dans la communauté</h3>
              <div className="space-y-4">
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({...newPost, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="text">📝 Texte</option>
                  <option value="image">🖼️ Image</option>
                  <option value="video">🎥 Vidéo</option>
                  <option value="audio">🎵 Audio</option>
                </select>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Partagez vos pensées avec la communauté..."
                />
                {newPost.type !== 'text' && (
                  <input
                    type="file"
                    accept={newPost.type === 'image' ? 'image/*' : newPost.type === 'video' ? 'video/*' : 'audio/*'}
                    onChange={(e) => setNewPost({...newPost, mediaFile: e.target.files?.[0] || null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                )}
                <button
                  onClick={createPost}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  📤 Publier
                </button>
              </div>
            </div>

            {/* Publications */}
            <div className="space-y-4">
              {selectedGroup.posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{post.authorName}</h4>
                      <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                        ❤️ {post.likes.length}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                        💬 {post.comments.length}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  {post.mediaUrl && (
                    <div className="mb-3">
                      {post.type === 'image' && (
                        <img src={post.mediaUrl} alt="" className="max-w-full h-auto rounded-lg" />
                      )}
                      {post.type === 'video' && (
                        <video src={post.mediaUrl} controls className="max-w-full h-auto rounded-lg" />
                      )}
                      {post.type === 'audio' && (
                        <audio src={post.mediaUrl} controls className="w-full" />
                      )}
                    </div>
                  )}
                  {post.comments.length > 0 && (
                    <div className="border-t pt-3 mt-3 space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">{comment.authorName}</h5>
                              <p className="text-gray-700 text-sm">{comment.content}</p>
                            </div>
                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {selectedGroup.posts.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <p>Aucune publication pour le moment.</p>
                  <p>Soyez le premier à partager quelque chose !</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

