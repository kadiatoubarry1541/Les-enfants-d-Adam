import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminPanel } from "../components/AdminPanel";
import { getSessionUser, isAdmin, isMasterAdmin } from "../utils/auth";
import { getStats, getAllUsers, getAllFamilies } from "../utils/adminApi";

interface ProfessionalAccount {
  id: string;
  type: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  services: string[];
  specialties: string[];
  ownerNumeroH: string;
  status: string;
  created_at: string;
}

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

interface CoupleLink {
  id: string;
  numeroH1: string;
  numeroH2: string;
  numeroMariageMairie?: string;
  status: string;
  confirmedAt?: string;
  isActive: boolean;
  created_at: string;
  user1?: { prenom: string; nomFamille: string; numeroH: string };
  user2?: { prenom: string; nomFamille: string; numeroH: string };
}

interface ParentChildLink {
  id: string;
  parentNumeroH: string;
  childNumeroH: string;
  codeLiaison?: string;
  numeroMaternite?: string;
  parentType?: string;
  status: string;
  confirmedAt?: string;
  isActive: boolean;
  created_at: string;
  parent?: { prenom: string; nomFamille: string; numeroH: string };
  child?: { prenom: string; nomFamille: string; numeroH: string };
}

interface FamilyGroup {
  nomFamille: string;
  memberCount: number;
  members: { numeroH: string; prenom: string; nomFamille: string; type?: string }[];
}

export default function AdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingPros, setPendingPros] = useState<ProfessionalAccount[]>([]);
  const [allPros, setAllPros] = useState<ProfessionalAccount[]>([]);
  const [proFilter, setProFilter] = useState<string>("pending");
  const [couples, setCouples] = useState<CoupleLink[]>([]);
  const [couplesLoading, setCouplesLoading] = useState(false);
  const [parentChildLinks, setParentChildLinks] = useState<ParentChildLink[]>([]);
  const [pcLoading, setPcLoading] = useState(false);
  const [families, setFamilies] = useState<FamilyGroup[]>([]);
  const [familiesLoading, setFamiliesLoading] = useState(false);
  const [adminSection, setAdminSection] = useState<string>("overview");
  const [searchFamily, setSearchFamily] = useState("");
  const [searchCouple, setSearchCouple] = useState("");
  const [searchPC, setSearchPC] = useState("");
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
    loadPendingPros();
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

  const loadPendingPros = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/professionals/admin/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPendingPros(data.accounts || []);
    } catch (error) {
      console.error('Erreur chargement comptes pro:', error);
    }
  };

  const loadCouples = async () => {
    setCouplesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/couple/admin/all-links", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCouples(data.links || []);
    } catch (error) {
      console.error("Erreur chargement couples:", error);
    } finally {
      setCouplesLoading(false);
    }
  };

  const loadParentChildLinks = async () => {
    setPcLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/parent-child/admin/all-links", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setParentChildLinks(data.links || []);
    } catch (error) {
      console.error("Erreur chargement liens parent-enfant:", error);
    } finally {
      setPcLoading(false);
    }
  };

  const loadFamilies = async () => {
    setFamiliesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/admin/families", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setFamilies(data.families || []);
    } catch (error) {
      console.error("Erreur chargement familles:", error);
    } finally {
      setFamiliesLoading(false);
    }
  };

  const loadAllPros = async (filter: string) => {
    try {
      const token = localStorage.getItem("token");
      const url = filter === "pending"
        ? "http://localhost:5002/api/professionals/admin/pending"
        : `http://localhost:5002/api/professionals/admin/all?status=${filter}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setAllPros(data.accounts || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5002/api/professionals/admin/approve/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        loadPendingPros();
        loadAllPros(proFilter);
      }
    } catch (error) {
      console.error('Erreur approbation:', error);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Raison du rejet (optionnel):");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5002/api/professionals/admin/reject/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "" })
      });
      const data = await res.json();
      if (data.success) {
        loadPendingPros();
        loadAllPros(proFilter);
      }
    } catch (error) {
      console.error('Erreur rejet:', error);
    }
  };

  const typeLabels: Record<string, { label: string; icon: string }> = {
    clinic: { label: "Clinique/Hôpital", icon: "🏥" },
    security_agency: { label: "Agence sécurité", icon: "🛡️" },
    journalist: { label: "Journaliste", icon: "📰" },
    enterprise: { label: "Entreprise", icon: "🏢" },
    school: { label: "École/Professeur", icon: "🎓" },
    supplier: { label: "Fournisseur", icon: "📦" },
    scientist: { label: "Scientifique/Chercheur", icon: "🔬" },
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

  const adminTabs = [
    { id: "overview", label: "Vue d'ensemble", icon: "📊" },
    { id: "families", label: "Familles", icon: "👨‍👩‍👧‍👦" },
    { id: "couples", label: "Couples", icon: "💑" },
    { id: "parent-child", label: "Parent-Enfant", icon: "👶" },
    { id: "pros", label: "Professionnels", icon: "📋" },
    { id: "users", label: "Utilisateurs", icon: "👥" },
    { id: "tools", label: "Outils", icon: "🔧" },
  ];

  const filteredFamilies = families.filter(f =>
    !searchFamily || f.nomFamille.toLowerCase().includes(searchFamily.toLowerCase()) ||
    f.members.some(m => m.prenom.toLowerCase().includes(searchFamily.toLowerCase()))
  );

  const filteredCouples = couples.filter(c =>
    !searchCouple ||
    c.user1?.prenom?.toLowerCase().includes(searchCouple.toLowerCase()) ||
    c.user1?.nomFamille?.toLowerCase().includes(searchCouple.toLowerCase()) ||
    c.user2?.prenom?.toLowerCase().includes(searchCouple.toLowerCase()) ||
    c.user2?.nomFamille?.toLowerCase().includes(searchCouple.toLowerCase()) ||
    c.numeroH1.includes(searchCouple) || c.numeroH2.includes(searchCouple)
  );

  const filteredPC = parentChildLinks.filter(pc =>
    !searchPC ||
    pc.parent?.prenom?.toLowerCase().includes(searchPC.toLowerCase()) ||
    pc.parent?.nomFamille?.toLowerCase().includes(searchPC.toLowerCase()) ||
    pc.child?.prenom?.toLowerCase().includes(searchPC.toLowerCase()) ||
    pc.child?.nomFamille?.toLowerCase().includes(searchPC.toLowerCase()) ||
    pc.parentNumeroH.includes(searchPC) || pc.childNumeroH.includes(searchPC)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête Administrateur */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-xl shadow-lg p-6 sm:p-8 mb-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">👑 Administration Complète</h1>
            <p className="text-lg opacity-90">
              {userData.prenom} {userData.nomFamille}
            </p>
            <p className="text-sm opacity-75 mt-1">
              NuméroH: {userData.numeroH} | Rôle: {userData.role || 'admin'}
            </p>
          </div>
          <button onClick={() => navigate("/compte")} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            ← Retour
          </button>
        </div>
      </div>

      {/* Statistiques en temps réel */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {[
            { val: stats.totalUsers, label: "Utilisateurs", from: "from-blue-500", to: "to-blue-600" },
            { val: stats.activeUsers, label: "Actifs", from: "from-green-500", to: "to-green-600" },
            { val: stats.inactiveUsers, label: "Inactifs", from: "from-red-500", to: "to-red-600" },
            { val: stats.totalVivants, label: "Vivants", from: "from-purple-500", to: "to-purple-600" },
            { val: stats.totalDefunts, label: "Défunts", from: "from-gray-500", to: "to-gray-600" },
            { val: stats.totalAdmins, label: "Admins", from: "from-yellow-500", to: "to-yellow-600" },
            { val: stats.totalFamilies, label: "Familles", from: "from-indigo-500", to: "to-indigo-600" },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.from} ${s.to} rounded-xl p-4 text-white shadow-lg`}>
              <div className="text-2xl font-bold">{s.val || 0}</div>
              <div className="text-xs opacity-90">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setAdminSection(tab.id);
                if (tab.id === "families" && families.length === 0) loadFamilies();
                if (tab.id === "couples" && couples.length === 0) loadCouples();
                if (tab.id === "parent-child" && parentChildLinks.length === 0) loadParentChildLinks();
                if (tab.id === "pros" && allPros.length === 0) loadAllPros(proFilter);
              }}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                adminSection === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === "pros" && pendingPros.length > 0 && (
                <span className="ml-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">{pendingPros.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ========== VUE D'ENSEMBLE ========== */}
          {adminSection === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🎖️</span>
                    <div>
                      <h3 className="font-semibold text-blue-900">Gestion des Badges</h3>
                      <p className="text-xs text-blue-700">Créer et assigner des badges</p>
                    </div>
                  </div>
                  <button onClick={() => navigate("/admin/badges")} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Ouvrir
                  </button>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🎨</span>
                    <div>
                      <h3 className="font-semibold text-purple-900">Gestion des Logos</h3>
                      <p className="text-xs text-purple-700">Créer et assigner des logos</p>
                    </div>
                  </div>
                  <button onClick={() => navigate("/admin/logos")} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Ouvrir
                  </button>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">👥</span>
                    <div>
                      <h3 className="font-semibold text-green-900">Gestion Utilisateurs</h3>
                      <p className="text-xs text-green-700">Voir et gérer tous les comptes</p>
                    </div>
                  </div>
                  <button onClick={() => setAdminSection("users")} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Ouvrir
                  </button>
                </div>
              </div>

              {/* Aperçu rapide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">📊 Statistiques</h3>
                  {statsLoading ? <p className="text-sm text-gray-500">Chargement...</p> : stats ? (
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Total utilisateurs</span><strong>{stats.totalUsers}</strong></div>
                      <div className="flex justify-between"><span className="text-gray-600">Actifs</span><strong className="text-green-600">{stats.activeUsers}</strong></div>
                      <div className="flex justify-between"><span className="text-gray-600">Familles</span><strong className="text-indigo-600">{stats.totalFamilies}</strong></div>
                      <div className="flex justify-between"><span className="text-gray-600">Vivants / Défunts</span><strong>{stats.totalVivants} / {stats.totalDefunts}</strong></div>
                    </div>
                  ) : <p className="text-sm text-gray-500">Aucune donnée</p>}
                  <button onClick={loadStats} className="mt-3 w-full px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs transition-colors">Actualiser</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">👥 Utilisateurs récents</h3>
                  {recentUsers.length > 0 ? (
                    <div className="space-y-2">
                      {recentUsers.slice(0, 5).map((u) => (
                        <div key={u.numeroH} className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {u.prenom?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{u.prenom} {u.nomFamille}</div>
                            <div className="text-xs text-gray-500">{u.numeroH}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-gray-500">Aucun utilisateur récent</p>}
                </div>
              </div>
            </div>
          )}

          {/* ========== FAMILLES ========== */}
          {adminSection === "families" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-gray-800">👨‍👩‍👧‍👦 Toutes les Familles ({families.length})</h2>
                <div className="flex gap-2">
                  <input
                    type="text" value={searchFamily} onChange={e => setSearchFamily(e.target.value)}
                    placeholder="Rechercher une famille..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[200px]"
                  />
                  <button onClick={loadFamilies} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Actualiser</button>
                </div>
              </div>

              {familiesLoading ? (
                <div className="text-center py-12 text-gray-500">Chargement des familles...</div>
              ) : filteredFamilies.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Aucune famille trouvée</div>
              ) : (
                <div className="space-y-3">
                  {filteredFamilies.map((fam, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {fam.nomFamille?.charAt(0) || "?"}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">Famille {fam.nomFamille}</h3>
                            <p className="text-sm text-gray-500">{fam.memberCount} membre{fam.memberCount > 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                          {fam.memberCount} membres
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {fam.members.slice(0, 6).map((m) => (
                          <div key={m.numeroH} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-lg">
                            <span className={`w-2 h-2 rounded-full ${m.type === 'defunt' ? 'bg-gray-400' : 'bg-green-400'}`}></span>
                            <span className="text-gray-800">{m.prenom} {m.nomFamille}</span>
                            <span className="text-xs text-gray-400 ml-auto">{m.type === 'defunt' ? '(D)' : ''}</span>
                          </div>
                        ))}
                        {fam.memberCount > 6 && (
                          <div className="text-xs text-gray-500 p-2">+{fam.memberCount - 6} autres...</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== COUPLES ========== */}
          {adminSection === "couples" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-gray-800">💑 Tous les Couples ({couples.length})</h2>
                <div className="flex gap-2">
                  <input
                    type="text" value={searchCouple} onChange={e => setSearchCouple(e.target.value)}
                    placeholder="Rechercher un couple..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[200px]"
                  />
                  <button onClick={loadCouples} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Actualiser</button>
                </div>
              </div>

              {/* Stats couples */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{couples.filter(c => c.status === 'active').length}</div>
                  <div className="text-xs text-green-600">Actifs</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-700">{couples.filter(c => c.status === 'pending').length}</div>
                  <div className="text-xs text-yellow-600">En attente</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-700">{couples.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>

              {couplesLoading ? (
                <div className="text-center py-12 text-gray-500">Chargement des couples...</div>
              ) : filteredCouples.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Aucun couple trouvé</div>
              ) : (
                <div className="space-y-3">
                  {filteredCouples.map((c) => (
                    <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* Partenaire 1 */}
                        <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                            {c.user1?.prenom?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{c.user1?.prenom || c.numeroH1} {c.user1?.nomFamille || ""}</div>
                            <div className="text-xs text-gray-500">{c.numeroH1}</div>
                          </div>
                        </div>
                        {/* Coeur */}
                        <div className="text-2xl">💕</div>
                        {/* Partenaire 2 */}
                        <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {c.user2?.prenom?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{c.user2?.prenom || c.numeroH2} {c.user2?.nomFamille || ""}</div>
                            <div className="text-xs text-gray-500">{c.numeroH2}</div>
                          </div>
                        </div>
                        {/* Status */}
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {c.status === 'active' ? 'Confirmé' : 'En attente'}
                          </span>
                          {c.numeroMariageMairie && (
                            <span className="text-xs text-gray-500">N° Mariage: {c.numeroMariageMairie}</span>
                          )}
                          <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== PARENT-ENFANT ========== */}
          {adminSection === "parent-child" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-gray-800">👶 Liens Parent-Enfant ({parentChildLinks.length})</h2>
                <div className="flex gap-2">
                  <input
                    type="text" value={searchPC} onChange={e => setSearchPC(e.target.value)}
                    placeholder="Rechercher..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[200px]"
                  />
                  <button onClick={loadParentChildLinks} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Actualiser</button>
                </div>
              </div>

              {/* Stats parent-enfant */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{parentChildLinks.filter(l => l.status === 'active').length}</div>
                  <div className="text-xs text-green-600">Actifs</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-700">{parentChildLinks.filter(l => l.status === 'pending').length}</div>
                  <div className="text-xs text-yellow-600">En attente</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-700">{parentChildLinks.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>

              {pcLoading ? (
                <div className="text-center py-12 text-gray-500">Chargement des liens...</div>
              ) : filteredPC.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Aucun lien trouvé</div>
              ) : (
                <div className="space-y-3">
                  {filteredPC.map((link) => (
                    <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* Parent */}
                        <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                            {link.parent?.prenom?.charAt(0) || "P"}
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase font-medium">{link.parentType === 'mere' ? 'Mère' : 'Père'}</div>
                            <div className="font-medium text-gray-900 text-sm">{link.parent?.prenom || link.parentNumeroH} {link.parent?.nomFamille || ""}</div>
                            <div className="text-xs text-gray-500">{link.parentNumeroH}</div>
                          </div>
                        </div>
                        {/* Flèche */}
                        <div className="text-xl text-gray-400">→</div>
                        {/* Enfant */}
                        <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
                            {link.child?.prenom?.charAt(0) || "E"}
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase font-medium">Enfant</div>
                            <div className="font-medium text-gray-900 text-sm">{link.child?.prenom || link.childNumeroH} {link.child?.nomFamille || ""}</div>
                            <div className="text-xs text-gray-500">{link.childNumeroH}</div>
                          </div>
                        </div>
                        {/* Status */}
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            link.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {link.status === 'active' ? 'Confirmé' : 'En attente'}
                          </span>
                          {link.codeLiaison && <span className="text-xs text-gray-500">Code: {link.codeLiaison}</span>}
                          {link.numeroMaternite && <span className="text-xs text-gray-500">N° Mat: {link.numeroMaternite}</span>}
                          <span className="text-xs text-gray-400">{new Date(link.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== PROFESSIONNELS ========== */}
          {adminSection === "pros" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-gray-800">
                  📋 Comptes Professionnels
                  {pendingPros.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-7 h-7 text-sm font-bold text-white bg-red-500 rounded-full">{pendingPros.length}</span>
                  )}
                </h2>
                <div className="flex gap-2">
                  {["pending", "approved", "rejected"].map((f) => (
                    <button key={f} onClick={() => { setProFilter(f); loadAllPros(f); }}
                      className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                        proFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}>
                      {f === "pending" ? "En attente" : f === "approved" ? "Approuvés" : "Rejetés"}
                    </button>
                  ))}
                </div>
              </div>

              {(proFilter === "pending" ? pendingPros : allPros).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {proFilter === "pending" ? "Aucune demande en attente" : "Aucun compte trouvé"}
                </div>
              ) : (
                <div className="space-y-3">
                  {(proFilter === "pending" ? pendingPros : allPros).map((pro) => (
                    <div key={pro.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-3xl">{typeLabels[pro.type]?.icon || "📄"}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900">{pro.name}</div>
                        <div className="text-sm text-gray-600">{typeLabels[pro.type]?.label || pro.type} • {pro.city || "?"}, {pro.country || ""}</div>
                        <div className="text-xs text-gray-400 mt-1">Propriétaire: {pro.ownerNumeroH} • {new Date(pro.created_at).toLocaleDateString("fr-FR")}</div>
                        {pro.description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{pro.description}</div>}
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        {pro.status === "pending" && (
                          <>
                            <button onClick={() => handleApprove(pro.id)} className="min-h-[40px] px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">Approuver</button>
                            <button onClick={() => handleReject(pro.id)} className="min-h-[40px] px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">Rejeter</button>
                          </>
                        )}
                        {pro.status === "approved" && <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">Approuvé</span>}
                        {pro.status === "rejected" && <span className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-full">Rejeté</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== UTILISATEURS (AdminPanel) ========== */}
          {adminSection === "users" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">👥 Gestion des Utilisateurs</h2>
                {isMasterAdmin(userData) && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">👑 Admin Principal</span>
                )}
              </div>
              <AdminPanel userData={userData} />
            </div>
          )}

          {/* ========== OUTILS ========== */}
          {adminSection === "tools" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">🔧 Outils d'Administration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button onClick={() => navigate("/admin/badges")} className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-5 text-left transition-colors">
                  <div className="text-2xl mb-2">🎖️</div>
                  <div className="font-semibold text-blue-900">Badges</div>
                  <div className="text-xs text-blue-700">Créer et assigner des badges aux utilisateurs</div>
                </button>
                <button onClick={() => navigate("/admin/logos")} className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-5 text-left transition-colors">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-semibold text-purple-900">Logos</div>
                  <div className="text-xs text-purple-700">Créer et assigner des logos professionnels</div>
                </button>
                <button onClick={() => navigate("/famille")} className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-5 text-left transition-colors">
                  <div className="text-2xl mb-2">🌳</div>
                  <div className="font-semibold text-green-900">Arbre Généalogique</div>
                  <div className="text-xs text-green-700">Voir et gérer les arbres familiaux</div>
                </button>
                <button onClick={() => navigate("/sante")} className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl p-5 text-left transition-colors">
                  <div className="text-2xl mb-2">🏥</div>
                  <div className="font-semibold text-red-900">Santé</div>
                  <div className="text-xs text-red-700">Cliniques, hôpitaux, rendez-vous</div>
                </button>
                <button onClick={() => navigate("/securite")} className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-xl p-5 text-left transition-colors">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-semibold text-yellow-900">Sécurité</div>
                  <div className="text-xs text-yellow-700">Agences de sécurité, agents</div>
                </button>
                <button onClick={() => { setAdminSection("pros"); loadAllPros("pending"); }} className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl p-5 text-left transition-colors">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-semibold text-orange-900">Comptes Pro</div>
                  <div className="text-xs text-orange-700">Approuver et gérer les professionnels</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}















