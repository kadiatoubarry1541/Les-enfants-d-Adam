import { useEffect, useState } from "react";
import { getPhotoUrl } from "../utils/auth";

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
        className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-11/12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
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
                {userData!.numeroH}
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
      </div>
    </div>
  );
}
