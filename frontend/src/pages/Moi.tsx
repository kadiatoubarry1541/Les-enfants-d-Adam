import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  photo?: string;
  genre: "HOMME" | "FEMME" | "AUTRE";
  prenomPere?: string;
  nomFamillePere?: string;
  numeroHPere?: string;
  prenomMere?: string;
  nomFamilleMere?: string;
  numeroHMere?: string;
  role?: string;
  isAdmin?: boolean;
  [key: string]: string | number | boolean | undefined;
}

interface UserLogo {
  id: string;
  logoId: string;
  numeroH: string;
  assignedAt: string;
  logo: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    category: string;
  };
}

export function Moi() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLogos, setUserLogos] = useState<UserLogo[]>([]);
  const navigate = useNavigate();

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
      loadUserLogos(user.numeroH);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const loadUserLogos = async (numeroH: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5002/api/logos/my-logos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserLogos(data.logos || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des logos:', error);
    }
  };


  if (!userData) return null;

  // Navigation items
  const navItems = [
    { id: "famille", label: "Famille", icon: "👨‍👩‍👧‍👦", type: "link", path: "/famille" },
    { id: "sante", label: "Santé", icon: "🏥", type: "link", path: "/sante" },
    { id: "securite", label: "Sécurité", icon: "🛡️", type: "link", path: "/securite" },
    { id: "solidarite", label: "Solidarité", icon: "🤝", type: "link", path: "/solidarite" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header responsive */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xs:flex-row justify-between items-stretch xs:items-center gap-3 py-4 sm:py-6">
            <div className="min-w-0">
              <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Moi
              </h1>
              <p className="mt-1 sm:mt-2 text-sm xs:text-base text-gray-600 dark:text-gray-400">Espace personnel et profil</p>
            </div>
            <button
              onClick={() => navigate("/compte")}
              className="self-start xs:self-center min-h-[44px] px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors text-sm sm:text-base font-medium"
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Carte de profil - Style UserDashboard */}
        <div className="mb-8">
          <div className="bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur rounded-3xl shadow-md ring-1 ring-gray-200 px-6 py-5 max-w-md">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {userData.photo ? (
                    <img
                      src={userData.photo}
                      alt="Photo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    userData.prenom?.charAt(0) || "👤"
                  )}
                </div>
                {/* Logos professionnels en bas de la photo (jusqu'à 3) */}
                {userLogos.slice(0, 3).map((userLogo, index) => {
                  if (!userLogo?.logo) return null;
                  // Positionnement en cercle autour du bas de l'avatar
                  const angle = (index * 120) - 60; // Répartition sur 120 degrés
                  const radius = 38;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  const size = index === 0 ? 'w-8 h-8 text-lg' : index === 1 ? 'w-7 h-7 text-base' : 'w-6 h-6 text-sm';
                  return (
                    <div 
                      key={userLogo.id}
                      className={`absolute ${size} rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center`}
                      title={userLogo.logo.name}
                      style={{ 
                        borderColor: userLogo.logo.color || '#10B981',
                        bottom: `${20 + y}px`,
                        right: `${20 - x}px`,
                        zIndex: 10 + index
                      }}
                    >
                      <span style={{ color: userLogo.logo.color || '#10B981' }}>
                        {userLogo.logo.icon}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Infos */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {userData.prenom} {userData.nomFamille}
                </h2>
                {(userData.role === 'admin' || userData.isAdmin) && (
                  <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                    Administrateur
                  </span>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  NuméroH: <span className="font-semibold text-gray-800">{userData.numeroH}</span>
                </p>
              </div>
            </div>

            {/* Bouton MOI */}
            <div className="mt-4 flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => navigate("/moi/profil")}
                className="flex-1 min-w-[120px] min-h-[44px] px-3 sm:px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                <span className="mr-1" aria-hidden>👤</span>
                Mon profil
              </button>
              {(userData.role === 'admin' || userData.isAdmin) && (
                <button
                  onClick={() => navigate("/admin")}
                  className="min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2.5 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-lg transition-colors shadow-sm"
                  aria-label="Administration"
                >
                  👑
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation horizontale - Style Facebook compact */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-1.5 sm:gap-2 min-w-max px-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path!)}
                className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ring-1 ring-gray-200 dark:ring-gray-700"
              >
                <div className="text-xl sm:text-2xl mb-0.5">{item.icon}</div>
                <span 
                  className="text-[9px] sm:text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center px-1 leading-tight"
                  translate="no"
                  suppressHydrationWarning
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenu de la page Moi */}
        <div className="bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-8">
            <div className="text-center py-8 sm:py-12">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">🎯</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Bienvenue dans votre espace personnel</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Espace Moi - Profil personnel</p>
          </div>
        </div>

      </div>
    </div>
  );
}
