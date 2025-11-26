import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rarity: string;
  requirements?: any;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface UserBadge {
  id: number;
  numeroH: string;
  badgeId: number;
  awardedAt: string;
  awardedBy: string;
  reason?: string;
  isVisible: boolean;
  badge: Badge;
}

interface BadgeManagerProps {
  userData: any;
}

export default function BadgeManager({ userData }: BadgeManagerProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'create' | 'award' | 'manage' | 'stats'>('create');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    icon: '🏆',
    color: '#FFD700',
    category: 'achievement',
    rarity: 'common',
    requirements: ''
  });

  const [awardData, setAwardData] = useState({
    numeroH: '',
    badgeId: '',
    reason: ''
  });

  useEffect(() => {
    loadBadges();
    loadUserBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/admin/badges', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des badges:', error);
      toast.error('Erreur lors du chargement des badges');
    }
  };

  const loadUserBadges = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/badges/user/${selectedUser}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des badges utilisateur:', error);
    }
  };

  const createBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/admin/badges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newBadge,
          requirements: newBadge.requirements ? JSON.parse(newBadge.requirements) : null
        })
      });

      if (response.ok) {
        toast.success('Badge créé avec succès !');
        setNewBadge({
          name: '',
          description: '',
          icon: '🏆',
          color: '#FFD700',
          category: 'achievement',
          rarity: 'common',
          requirements: ''
        });
        loadBadges();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de la création du badge');
      }
    } catch (error) {
      console.error('Erreur lors de la création du badge:', error);
      toast.error('Erreur lors de la création du badge');
    }
  };

  const awardBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/admin/badges/award', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(awardData)
      });

      if (response.ok) {
        toast.success('Badge attribué avec succès !');
        setAwardData({
          numeroH: '',
          badgeId: '',
          reason: ''
        });
        loadUserBadges();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de l\'attribution du badge');
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution du badge:', error);
      toast.error('Erreur lors de l\'attribution du badge');
    }
  };

  const deleteBadge = async (badgeId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce badge ?')) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/badges/${badgeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Badge supprimé avec succès !');
        loadBadges();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de la suppression du badge');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du badge:', error);
      toast.error('Erreur lors de la suppression du badge');
    }
  };

  const filteredBadges = badges.filter(badge =>
    badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    badge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return '🏆';
      case 'education': return '📚';
      case 'faith': return '🙏';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'health': return '🏥';
      case 'social': return '👥';
      case 'special': return '⭐';
      default: return '🏆';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🏆 Gestion des Badges et Logos</h2>
        <p className="opacity-90">Créez et gérez les badges pour récompenser vos utilisateurs</p>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'create', label: 'Créer Badge', icon: '➕' },
          { id: 'award', label: 'Attribuer', icon: '🎖️' },
          { id: 'manage', label: 'Gérer', icon: '⚙️' },
          { id: 'stats', label: 'Statistiques', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Onglet Créer Badge */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4">➕ Créer un Nouveau Badge</h3>
          
          <form onSubmit={createBadge} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Badge *
                </label>
                <input
                  type="text"
                  value={newBadge.name}
                  onChange={(e) => setNewBadge({...newBadge, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icône
                </label>
                <input
                  type="text"
                  value={newBadge.icon}
                  onChange={(e) => setNewBadge({...newBadge, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🏆"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newBadge.description}
                onChange={(e) => setNewBadge({...newBadge, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={newBadge.category}
                  onChange={(e) => setNewBadge({...newBadge, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="achievement">🏆 Réussite</option>
                  <option value="education">📚 Éducation</option>
                  <option value="faith">🙏 Foi</option>
                  <option value="family">👨‍👩‍👧‍👦 Famille</option>
                  <option value="health">🏥 Santé</option>
                  <option value="social">👥 Social</option>
                  <option value="special">⭐ Spécial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rareté
                </label>
                <select
                  value={newBadge.rarity}
                  onChange={(e) => setNewBadge({...newBadge, rarity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="common">Commun</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Épique</option>
                  <option value="legendary">Légendaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur
                </label>
                <input
                  type="color"
                  value={newBadge.color}
                  onChange={(e) => setNewBadge({...newBadge, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Critères d'obtention (JSON)
              </label>
              <textarea
                value={newBadge.requirements}
                onChange={(e) => setNewBadge({...newBadge, requirements: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder='{"minPosts": 10, "category": "education"}'
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              🏆 Créer le Badge
            </button>
          </form>
        </div>
      )}

      {/* Onglet Attribuer Badge */}
      {activeTab === 'award' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4">🎖️ Attribuer un Badge</h3>
          
          <form onSubmit={awardBadge} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NumeroH de l'utilisateur *
                </label>
                <input
                  type="text"
                  value={awardData.numeroH}
                  onChange={(e) => setAwardData({...awardData, numeroH: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="GC0P0R0E0F0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge à attribuer *
                </label>
                <select
                  value={awardData.badgeId}
                  onChange={(e) => setAwardData({...awardData, badgeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un badge</option>
                  {badges.map(badge => (
                    <option key={badge.id} value={badge.id}>
                      {badge.icon} {badge.name} ({badge.rarity})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison de l'attribution
              </label>
              <textarea
                value={awardData.reason}
                onChange={(e) => setAwardData({...awardData, reason: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Expliquez pourquoi ce badge est attribué..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              🎖️ Attribuer le Badge
            </button>
          </form>
        </div>
      )}

      {/* Onglet Gérer */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">⚙️ Gérer les Badges</h3>
            <input
              type="text"
              placeholder="Rechercher un badge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map(badge => (
              <div key={badge.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <h4 className="font-semibold">{badge.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBadge(badge.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{getCategoryIcon(badge.category)} {badge.category}</span>
                  <span>Couleur: <span style={{color: badge.color}}>●</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onglet Statistiques */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4">📊 Statistiques des Badges</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{badges.length}</div>
              <div className="text-sm text-blue-800">Total Badges</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {badges.filter(b => b.rarity === 'legendary').length}
              </div>
              <div className="text-sm text-green-800">Légendaires</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {badges.filter(b => b.rarity === 'epic').length}
              </div>
              <div className="text-sm text-purple-800">Épiques</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {badges.filter(b => b.rarity === 'rare').length}
              </div>
              <div className="text-sm text-yellow-800">Rares</div>
            </div>
          </div>

          <div className="space-y-4">
            {['achievement', 'education', 'faith', 'family', 'health', 'social', 'special'].map(category => {
              const categoryBadges = badges.filter(b => b.category === category);
              if (categoryBadges.length === 0) return null;
              
              return (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryBadges.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {categoryBadges.map(badge => (
                      <div key={badge.id} className="flex items-center space-x-2 text-sm">
                        <span>{badge.icon}</span>
                        <span>{badge.name}</span>
                        <span className={`px-1 py-0.5 rounded text-xs ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}



