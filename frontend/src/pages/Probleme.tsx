import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Etat } from "../components/Etat";

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

export default function Probleme() {
  const [userData, setUserData] = useState<UserData | null>(null);
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
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">
            Chargement de vos informations de problèmes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚨 Problèmes de la famille</h1>
              <p className="mt-2 text-gray-600">
                Page réservée aux <strong>problèmes de la famille</strong> (maladie, situations difficiles, alertes importantes).
                Quand quelqu&apos;un est malade, c&apos;est ici que l&apos;information et les preuves (vidéos, etc.) sont centralisées.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate("/moi")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                ← Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cartes principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => navigate("/sante")}
            className="text-left bg-white rounded-xl shadow-sm border border-red-100 hover:border-red-400 hover:shadow-md transition-all p-5 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏥</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Problèmes de santé
                </h2>
                <p className="text-sm text-gray-600">
                  Accéder à la page Santé pour trouver des hôpitaux,
                  médecins et services de soins.
                </p>
              </div>
            </div>
            <span className="mt-2 inline-flex items-center text-sm font-medium text-red-600">
              Ouvrir la page Santé →
            </span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-5 flex flex-col gap-3 opacity-80">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👨‍👩‍👧‍👦</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Problèmes familiaux & sociaux
                </h2>
                <p className="text-sm text-gray-600">
                  Relations avec la famille et la communauté.
                </p>
              </div>
            </div>
            <span className="mt-2 text-xs text-gray-500">
              Section en préparation.
            </span>
          </div>
        </div>

        {/* Arbre / tableau de bord des états (inclut l'état de santé) */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <Etat userData={userData} />
        </div>
      </div>
    </div>
  );
}

