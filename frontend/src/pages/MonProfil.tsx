import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IdentiteModal from "../components/IdentiteModal";
import EditProfileModal from "../components/EditProfileModal";
import { AdminPanel } from "../components/AdminPanel";
import { config } from "../config/api";

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

export default function MonProfil() {
  const [userData, setUserData] = useState<{
    prenom?: string;
    nomFamille?: string;
    numeroH?: string;
    role?: string;
    isAdmin?: boolean;
    photo?: string;
    email?: string;
    genre?: string;
    dateNaissance?: string;
    age?: number;
    generation?: string;
    [key: string]: string | number | boolean | undefined;
  } | null>(null);
  const [userLogos, setUserLogos] = useState<UserLogo[]>([]);
  const [open, setOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("session_user");
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const u = parsed.userData || parsed;
      setUserData(u);
      loadUserLogos(u.numeroH);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const loadUserLogos = async (numeroH?: string) => {
    if (!numeroH) return;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        ← Retour
      </button>

      {/* Header Principal */}
      <div
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200 mb-8"
        style={{ borderLeftWidth: "4px", borderLeftColor: "#3b82f6" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar avec gradient professionnel */}
            <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white relative overflow-hidden">
              {userData.photo ? (
                <img
                  src={userData.photo.startsWith('data:') ? userData.photo : (userData.photo.startsWith('http') ? userData.photo : `${config.API_BASE_URL.replace('/api', '')}${userData.photo}`)}
                  alt="Photo de profil"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    // Si la photo ne peut pas être chargée, afficher l'initiale
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = userData.prenom?.charAt(0) || "👤";
                    }
                  }}
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
                      borderColor: userLogo.logo.color || '#3B82F6',
                      bottom: `${20 + y}px`,
                      right: `${20 - x}px`,
                      zIndex: 10 + index
                    }}
                  >
                    <span style={{ color: userLogo.logo.color || '#3B82F6' }}>
                      {userLogo.logo.icon}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Informations utilisateur */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">
                {userData.prenom} {userData.nomFamille}
              </h2>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {userData.role === "admin" || userData.isAdmin
                    ? "👑 Administrateur"
                    : "👤 Utilisateur"}
                </span>
              </div>

              <div className="text-slate-600">
                <span className="font-medium">NuméroH:</span>{" "}
                <span className="text-blue-600 font-semibold">
                  {userData.numeroH}
                </span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setOpen(true)}
              className="min-w-[140px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              ✨ Identité
            </button>
            <button
              onClick={() => setShowEditProfile(true)}
              className="min-w-[140px] px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              ✏️ Modifier mon profil
            </button>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="min-w-[140px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              ⚙️ Administration
            </button>
          </div>
        </div>
      </div>

      <IdentiteModal open={open} onClose={() => setOpen(false)} />

      <EditProfileModal
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={userData}
        onUpdate={(updatedData) => {
          setUserData(updatedData);
          // Mettre à jour le localStorage
          const raw = localStorage.getItem("session_user");
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              parsed.userData = updatedData;
              localStorage.setItem("session_user", JSON.stringify(parsed));
            } catch {}
          }
        }}
      />

      {showAdmin && (
        <div
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8"
          style={{ borderLeftWidth: "4px", borderLeftColor: "#3b82f6" }}
        >
          <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
            ⚙️ Panneau d'Administration
          </h3>
          <AdminPanel userData={userData} />
        </div>
      )}
    </div>
  );
}
