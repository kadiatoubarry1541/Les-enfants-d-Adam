import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

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

const CONFIRM_DELETE_TEXT = "SUPPRIMER";

export default function Identite() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
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
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
            🆔 Mon Identité
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(true);
                setDeletePassword("");
                setDeleteConfirmText("");
                setDeleteError("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-colors duration-200 border border-red-200"
            >
              🗑️ Supprimer mon compte
            </button>
            <button
              onClick={() => navigate("/moi/profil")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors duration-200"
            >
              ✏️ Modifier mon profil
            </button>
          </div>
        </div>
        
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

      {/* Modal suppression de compte */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !deleteLoading && setShowDeleteModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-800">Supprimer mon compte</h3>
            <p className="text-sm text-slate-600">
              Cette action est irréversible. Saisissez votre mot de passe et tapez <strong>{CONFIRM_DELETE_TEXT}</strong> pour confirmer.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(""); }}
                placeholder="Votre mot de passe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={deleteLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taper &quot;{CONFIRM_DELETE_TEXT}&quot; pour confirmer
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(""); }}
                placeholder={CONFIRM_DELETE_TEXT}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={deleteLoading}
              />
            </div>
            {deleteError && (
              <p className="text-sm text-red-600">{deleteError}</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => !deleteLoading && setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                disabled={deleteLoading}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!deletePassword.trim()) {
                    setDeleteError("Veuillez saisir votre mot de passe.");
                    return;
                  }
                  if (deleteConfirmText.trim() !== CONFIRM_DELETE_TEXT) {
                    setDeleteError(`Veuillez taper exactement "${CONFIRM_DELETE_TEXT}" pour confirmer.`);
                    return;
                  }
                  setDeleteLoading(true);
                  setDeleteError("");
                  const result = await api.deleteAccount(deletePassword.trim());
                  setDeleteLoading(false);
                  if (result.success) {
                    localStorage.removeItem("session_user");
                    localStorage.removeItem("token");
                    setShowDeleteModal(false);
                    navigate("/", { replace: true });
                    window.location.reload();
                  } else {
                    setDeleteError(result.message || "Erreur lors de la suppression du compte.");
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Suppression…" : "Supprimer mon compte"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}