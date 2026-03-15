import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPhotoUrl, getNumeroHForDisplay } from "../utils/auth";
import { api } from "../utils/api";

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  photo?: string;
  genre?: string;
  prenomPere?: string;
  prenomMere?: string;
  numeroHPere?: string;
  numeroHMere?: string;
  [key: string]: any;
}

const CONFIRM_DELETE_TEXT = "SUPPRIMER";

export default function IdentiteModal({
  open,
  onClose,
  onEditProfile,
}: {
  open: boolean;
  onClose: () => void;
  onEditProfile?: () => void;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const raw = localStorage.getItem("session_user");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const u = parsed.userData || parsed;
      setUserData(u);
    } catch {}
  }, [open]);

  if (!open) return null;
  if (open && !userData) return null;

  const photoUrl = getPhotoUrl(userData?.photo);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-xl p-6 max-w-2xl w-11/12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-2xl font-bold">Identité</h3>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
              onClick={() => {
                if (onEditProfile) {
                  onEditProfile();
                } else {
                  onClose();
                }
              }}
            >
              ✏️ Modifier mon profil
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-6 items-start">
          <div className="relative">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Photo de profil"
                className="w-28 h-28 rounded-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  // Si l'image ne charge pas, masquer l'img et afficher l'initiale
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".avatar-placeholder")) {
                    const placeholder = document.createElement("div");
                    placeholder.className =
                      "w-28 h-28 rounded-full bg-emerald-500 text-white flex items-center justify-center text-4xl font-bold avatar-placeholder";
                    placeholder.textContent =
                      userData!.prenom?.charAt(0) || "👤";
                    parent.appendChild(placeholder);
                  }
                }}
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-emerald-500 text-white flex items-center justify-center text-4xl font-bold">
                {userData!.prenom?.charAt(0) || "👤"}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {userData!.prenom} {userData!.nomFamille}
            </h2>
            <div className="mt-2 text-sm">
              NuméroH:{" "}
              <span className="font-semibold text-blue-700">
                {getNumeroHForDisplay(userData!.numeroH, true, false)}
              </span>
            </div>

            <div className="mt-4 bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-4 text-gray-800">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <div className="font-semibold">Génération</div>
                  <div>{userData!.generation || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">E-mail</div>
                  <div>{userData!.email || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Région</div>
                  <div>{userData!.region || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Ethnie</div>
                  <div>{userData!.ethnie || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Pays</div>
                  <div>{userData!.pays || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Nationalité</div>
                  <div>{userData!.nationalite || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Genre</div>
                  <div>{userData!.genre || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Date de naissance</div>
                  <div>{userData!.dateNaissance || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Âge</div>
                  <div>{userData!.age ?? "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Téléphone</div>
                  <div>{userData!.telephone || userData!.tel1 || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Père</div>
                  <div>{userData!.prenomPere || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Mère</div>
                  <div>{userData!.prenomMere || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">NuméroH Père</div>
                  <div>{userData!.numeroHPere || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">NuméroH Mère</div>
                  <div>{userData!.numeroHMere || "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone « Supprimer le compte » en bas, à part */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setShowDeleteModal(true);
              setDeletePassword("");
              setDeleteConfirmText("");
              setDeleteError("");
            }}
            className="text-sm text-red-600 hover:text-red-700 hover:underline"
          >
            🗑️ Supprimer définitivement mon compte
          </button>
        </div>

        {/* Modal suppression de compte */}
        {showDeleteModal && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/40 rounded-xl" onClick={() => !deleteLoading && setShowDeleteModal(false)}>
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
                      onClose();
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
    </div>
  );
}
