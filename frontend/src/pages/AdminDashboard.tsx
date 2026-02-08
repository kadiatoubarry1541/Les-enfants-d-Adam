import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminPanel } from "../components/AdminPanel";
import { getSessionUser, isAdmin, isMasterAdmin } from "../utils/auth";
import { getStats, getAllUsers, getAllFamilies } from "../utils/adminApi";

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  role?: string;
  isAdmin?: boolean;
  [key: string]: string | number | boolean | undefined;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalVivants: number;
  totalDefunts: number;
  totalAdmins: number;
  totalFamilies: number;
  recentUsers?: any[];
}

export default function AdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier la session de manière plus robuste
    const user = getSessionUser();
    const token = localStorage.getItem("token");
    
    if (!user) {
      // Si pas de session mais token existe, l'utilisateur peut être connecté
      // Ne pas rediriger immédiatement, permettre l'accès si admin
      if (!token) {
        navigate("/login");
        setLoading(false);
        return;
      }
      // Si token existe mais pas de session, essayer de continuer
      // L'utilisateur peut être connecté mais la session peut être corrompue
      console.warn("Token trouvé mais session manquante - tentative de récupération");
      // Ne pas rediriger, permettre l'accès si c'est un admin
      // L'utilisateur pourra toujours accéder aux données via le token
      setLoading(false);
      return;
    }
    
    // Vérifier si c'est un admin
    if (!isAdmin(user)) {
      alert("Accès refusé - Privilèges administrateur requis");
      navigate("/moi");
      setLoading(false);
      return;
    }
    
    setUserData(user);
    setLoading(false);
    
    // Charger les statistiques
    loadStats();
    loadRecentUsers();
  }, [navigate]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getStats();
      setStats(response.stats || null);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadRecentUsers = async () => {
    try {
      const response = await getAllUsers({ limit: 5 });
      setRecentUsers(response.users || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs récents:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement du tableau de bord administrateur...</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête Administrateur */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">👑 Tableau de Bord Administrateur</h1>
            <p className="text-xl opacity-90">
              Bienvenue, {userData.prenom} {userData.nomFamille}
            </p>
            <p className="text-sm opacity-75 mt-2">
              NuméroH: {userData.numeroH} | Rôle: {userData.role || 'admin'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl mb-2">🔐</div>
            <div className="text-sm opacity-75">Accès Complet</div>
          </div>
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <button
          onClick={() => navigate("/moi")}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 text-center"
        >
          <div className="text-3xl mb-2">👤</div>
          <div className="text-sm font-medium text-gray-700">Mon Profil</div>
        </button>
        
        <button
          onClick={() => navigate("/famille")}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 text-center"
        >
          <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
          <div className="text-sm font-medium text-gray-700">Familles</div>
        </button>
        
        <button
          onClick={() => navigate("/sante")}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 text-center"
        >
          <div className="text-3xl mb-2">🏥</div>
          <div className="text-sm font-medium text-gray-700">Santé</div>
        </button>
        
        <button
          onClick={() => navigate("/activite")}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 text-center"
        >
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-sm font-medium text-gray-700">Activité</div>
        </button>
      </div>

      {/* Accès rapide aux gestionnaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">🎖️</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Gestion des Badges</h3>
              <p className="text-sm text-blue-700">Créer et assigner des badges</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/badges")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Ouvrir Gestionnaire
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">🎨</div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Gestion des Logos</h3>
              <p className="text-sm text-purple-700">Créer et assigner des logos</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/logos")}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Ouvrir Gestionnaire
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">👥</div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Gestion des Utilisateurs</h3>
              <p className="text-sm text-green-700">Voir et gérer tous les utilisateurs</p>
            </div>
          </div>
          <button
            onClick={() => {
              // Scroller vers le panneau d'administration qui est déjà sur la page
              const panelElement = document.querySelector('[data-admin-panel]');
              if (panelElement) {
                panelElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                // Si on n'est pas sur la page admin, naviguer vers elle
                navigate("/admin");
              }
            }}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Ouvrir Panneau
          </button>
        </div>
      </div>

      {/* Panneau d'administration principal — badge couronne réservé à l'admin principal */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" data-admin-panel>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">⚙️ Administration Système</h2>
          <div className="flex items-center gap-2">
            {isMasterAdmin(userData) && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                👑 Administrateur Principal
              </span>
            )}
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              ← Retour
            </button>
          </div>
        </div>
        
        <AdminPanel userData={userData} />
      </div>

      {/* Statistiques en temps réel */}
      {stats && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{stats.totalUsers || 0}</div>
            <div className="text-sm opacity-90">Total Utilisateurs</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{stats.activeUsers || 0}</div>
            <div className="text-sm opacity-90">Actifs</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{stats.inactiveUsers || 0}</div>
            <div className="text-sm opacity-90">Inactifs</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{stats.totalVivants || 0}</div>
            <div className="text-sm opacity-90">Vivants</div>
          </div>
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{stats.totalDefunts || 0}</div>
            <div className="text-sm opacity-90">Défunts</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{stats.totalAdmins || 0}</div>
            <div className="text-sm opacity-90">Admins</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{stats.totalFamilies || 0}</div>
            <div className="text-sm opacity-90">Familles</div>
          </div>
        </div>
      )}

      {/* Informations système avec actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📊 Statistiques Générales</h3>
          {statsLoading ? (
            <div className="space-y-2 text-sm text-blue-700">
              <div>• Chargement...</div>
            </div>
          ) : stats ? (
            <div className="space-y-2 text-sm">
              <div className="text-blue-700">• Total utilisateurs: <strong className="text-blue-900">{stats.totalUsers || 0}</strong></div>
              <div className="text-blue-700">• Utilisateurs actifs: <strong className="text-blue-900">{stats.activeUsers || 0}</strong></div>
              <div className="text-blue-700">• Familles enregistrées: <strong className="text-blue-900">{stats.totalFamilies || 0}</strong></div>
              <div className="text-blue-700">• Administrateurs: <strong className="text-blue-900">{stats.totalAdmins || 0}</strong></div>
              <div className="text-blue-700">• Vivants: <strong className="text-blue-900">{stats.totalVivants || 0}</strong></div>
              <div className="text-blue-700">• Défunts: <strong className="text-blue-900">{stats.totalDefunts || 0}</strong></div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-blue-700">
              <div>• Aucune donnée disponible</div>
            </div>
          )}
          <button
            onClick={loadStats}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            🔄 Actualiser
          </button>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-3">🔧 Actions Rapides</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                const panelElement = document.querySelector('[data-admin-panel]');
                if (panelElement) {
                  panelElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  // Activer l'onglet utilisateurs dans AdminPanel
                  setTimeout(() => {
                    const usersTab = document.querySelector('[data-tab="users"]') as HTMLElement;
                    if (usersTab) usersTab.click();
                  }, 500);
                }
              }}
              className="w-full text-left text-sm text-green-700 hover:text-green-900 hover:bg-green-100 p-2 rounded transition-colors"
            >
              👥 Gérer les utilisateurs
            </button>
            <button
              onClick={() => navigate("/admin/badges")}
              className="w-full text-left text-sm text-green-700 hover:text-green-900 hover:bg-green-100 p-2 rounded transition-colors"
            >
              🎖️ Gérer les badges et logos
            </button>
            <button
              onClick={() => {
                const panelElement = document.querySelector('[data-admin-panel]');
                if (panelElement) {
                  panelElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setTimeout(() => {
                    const reportsTab = document.querySelector('[data-tab="reports"]') as HTMLElement;
                    if (reportsTab) reportsTab.click();
                  }, 500);
                }
              }}
              className="w-full text-left text-sm text-green-700 hover:text-green-900 hover:bg-green-100 p-2 rounded transition-colors"
            >
              📊 Voir les rapports
            </button>
            <button
              onClick={() => {
                const panelElement = document.querySelector('[data-admin-panel]');
                if (panelElement) {
                  panelElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setTimeout(() => {
                    const settingsTab = document.querySelector('[data-tab="settings"]') as HTMLElement;
                    if (settingsTab) settingsTab.click();
                  }, 500);
                }
              }}
              className="w-full text-left text-sm text-green-700 hover:text-green-900 hover:bg-green-100 p-2 rounded transition-colors"
            >
              ⚙️ Configurer le système
            </button>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">🛡️ Sécurité</h3>
          <div className="space-y-2 text-sm text-purple-700">
            <div>• Surveiller les connexions</div>
            <div>• Gérer les permissions</div>
            <div>• Auditer les actions</div>
            <div>• Sauvegardes automatiques</div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-2">👥 Utilisateurs récents</h4>
            {recentUsers.length > 0 ? (
              <div className="space-y-1">
                {recentUsers.slice(0, 3).map((user) => (
                  <div key={user.numeroH} className="text-xs text-purple-700">
                    • {user.prenom} {user.nomFamille}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-purple-600">Aucun utilisateur récent</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}















