import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Activite from "./Activite";
import Education from "./Education";
import Dokal from "./Dokal";
import Pays from "./Pays";
import Histoire from "./Histoire";
import { EchangesProfessionnel } from "../components/EchangesProfessionnel";
import { ActivityIcon } from "../components/icons/ActivityIcon";
import { ExchangeIcon } from "../components/icons/ExchangeIcon";

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  generation: string;
  ethnie: string;
  region: string;
  photo?: string;
  photoPreview?: string;
  logo?: string;
  role?: string;
  isAdmin?: boolean;
  email?: string;
  pays?: string;
  nationalite?: string;
  prenomPere?: string;
  prenomMere?: string;
  numeroHPere?: string;
  numeroHMere?: string;
  genre?: string;
  dateNaissance?: string;
  age?: number;
  telephone?: string;
  tel1?: string;
  [key: string]: string | number | boolean | undefined;
}

interface TabIcon {
  className?: string;
  size?: number;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
  useSvg?: boolean;
  SvgIcon?: React.ComponentType<TabIcon>;
}

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage ou API
    const sessionData = JSON.parse(
      localStorage.getItem("session_user") || "{}",
    );
    const user = sessionData.userData || sessionData;
    if (!user.numeroH) {
      navigate("/login");
      return;
    }
    setUserData(user as UserData);
  }, [navigate]);

  const tabs: Tab[] = [
    { id: "pays", label: "Pays", icon: "🇬🇳", useSvg: false },
    { id: "activite", label: "Activité", icon: "⚙️", useSvg: true, SvgIcon: ActivityIcon },
    { id: "education", label: "Éducation", icon: "🎓", useSvg: false },
    { id: "dokal", label: "Dokal", icon: "📿", useSvg: false },
    { id: "histoire", label: "Histoire", icon: "📚", useSvg: false },
    { id: "echanges", label: "Échanges", icon: "🤝", useSvg: true, SvgIcon: ExchangeIcon },
  ];

  // Si aucun onglet n'est sélectionné, sélectionner le premier
  useEffect(() => {
    if (!activeTab && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, []);

  if (!userData) {
    return (
      <div className="user-dashboard bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-4 w-24 h-24 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Barre supérieure: Déconnexion en haut à droite */}
      <div className="flex items-center justify-end mb-4">
        <button className="btn secondary" onClick={() => navigate("/")}>
          Déconnexion
        </button>
      </div>

      {/* En-tête profil: photo + nom + NumeroH */}
      <div className="dashboard-header">
        <div className="flex justify-start">
          <div>
            <div
              className="profile-card bg-white/80 dark:bg-gray-800/80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-800/60 backdrop-blur rounded-3xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700 px-5 py-4"
              style={{ maxWidth: "420px", width: "100%" }}
            >
              <div
                className="user-info"
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div className="user-avatar" style={{ marginTop: "-6px" }}>
                  {userData.photo ? (
                    <img
                      src={userData.photo.startsWith('data:') ? userData.photo : (userData.photo.startsWith('http') ? userData.photo : `http://localhost:5002${userData.photo.startsWith('/') ? userData.photo : '/' + userData.photo}`)}
                      alt="Photo de profil"
                      className="profile-photo"
                      onError={(e) => {
                        // Afficher l'initiale si la photo ne peut pas être chargée
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.avatar-placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'avatar-placeholder';
                          placeholder.textContent = userData.prenom?.charAt(0) || "👤";
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {userData.prenom?.charAt(0) || "👤"}
                    </div>
                  )}
                  {userData.logo && (
                    <div className={`status-logo ${userData.logo}`}>
                      {getLogoIcon(userData.logo)}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h2 className="text-gray-900 dark:text-gray-100">
                    {userData.prenom} {userData.nomFamille}
                  </h2>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        userData.role === "admin" || userData.isAdmin
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {userData.role === "admin" || userData.isAdmin
                        ? "Administrateur"
                        : "Utilisateur"}
                    </span>
                  </div>
                  <div className="numero-h-container">
                    <span className="numero-h-label">NuméroH:</span>
                    <span className="numero-h-clickable">
                      {userData.numeroH}
                    </span>
                  </div>
                  <div className="mt-3">
                    <button className="btn" onClick={() => navigate("/moi")}>
                      MOI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets - Style Facebook compact */}
              <div className="dashboard-tabs">
        <div className="flex gap-1 sm:gap-1.5 flex-wrap justify-center px-1">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 p-1.5 sm:p-2 rounded-lg transition-all duration-200 min-w-[50px] sm:min-w-[55px] max-w-[60px] text-center border-none bg-transparent ${
                activeTab === tab.id 
                  ? "bg-blue-100/50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                  : "hover:bg-gray-100/50 dark:hover:bg-gray-700/30"
              }`}
            >
                {tab.id === "pays" ? (
                  <div className="w-6 h-4 sm:w-7 sm:h-5 mb-0.5 transition-transform duration-200 hover:scale-110 flex rounded-sm overflow-hidden shadow-sm border border-gray-300">
                    <div className="w-1/3 bg-[#CE1126]"></div>
                    <div className="w-1/3 bg-[#FCD116]"></div>
                    <div className="w-1/3 bg-[#009460]"></div>
                  </div>
                ) : tab.useSvg && tab.SvgIcon ? (
                  <tab.SvgIcon 
                    className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 transition-transform duration-200 hover:scale-110 text-gray-700 dark:text-gray-300" 
                    size={18}
                  />
                ) : (
                  <span className="text-lg sm:text-xl mb-0.5 transition-transform duration-200 hover:scale-110">{tab.icon}</span>
                )}
                <span className="text-[9px] sm:text-[10px] font-medium leading-tight text-gray-700 dark:text-gray-300 px-0.5">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="dashboard-content">
        {renderTabContent(activeTab, userData)}
      </div>
    </div>
  );
}

// Fonction pour obtenir l'icône du logo de statut
function getLogoIcon(logo: string) {
  const logos: Record<string, string> = {
    "roi-grand": "👑",
    "roi-moyen": "👑",
    "roi-petit": "👑",
    savant: "📖",
    prophete: "🌙",
    riche: "🥇",
  };
  return logos[logo] || "⭐";
}

// Fonction pour rendre le contenu de chaque onglet
function renderTabContent(tab: string, userData: UserData) {
  switch (tab) {
    case "moi":
      return <MoiTab />;
    case "pays":
      return <Pays />;
    case "activite":
      return <Activite />;
    case "education":
      return <Education />;
    case "dokal":
      return <Dokal />;
    case "histoire":
      return <Histoire />;
    case "echanges":
      return <EchangesProfessionnel userData={userData} />;
            default:
              return <div className="text-gray-900 dark:text-gray-100">Contenu non disponible</div>;
          }
}

// Composant pour l'onglet MOI
function MoiTab() {
  // Redirection automatique vers /moi
  useEffect(() => {
    window.location.href = "/moi";
  }, []);

  return (
    <div className="tab-content moi-tab">
      <div className="loading-redirect">
        <p>Redirection vers votre page personnelle...</p>
      </div>
    </div>
  );
}


export default UserDashboard;