import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  genre: "HOMME" | "FEMME" | "AUTRE";
  dateNaissance?: string;
  lieuNaissance?: string;
  ethnie?: string;
  regionOrigine?: string;
  pays?: string;
  nationalite?: string;
  religion?: string;
  [key: string]: string | number | boolean | undefined;
}

export default function Identite() {
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

  if (!userData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        ← Retour
      </button>

      <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-blue-500 border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
        <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
          🆔 Mon Identité
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                value={userData.prenom || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de famille</label>
              <input
                type="text"
                value={userData.nomFamille || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NuméroH</label>
              <input
                type="text"
                value={userData.numeroH || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <input
                type="text"
                value={userData.genre || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
              <input
                type="text"
                value={userData.dateNaissance || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance</label>
              <input
                type="text"
                value={userData.lieuNaissance || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ethnie</label>
              <input
                type="text"
                value={userData.ethnie || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
              <input
                type="text"
                value={userData.pays || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            ℹ️ Ces informations sont protégées et ne peuvent être modifiées que par un administrateur.
          </p>
        </div>
      </div>
    </div>
  );
}