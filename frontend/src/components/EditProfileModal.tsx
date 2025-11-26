import { useState, useEffect, useRef } from "react";
import { config } from "../config/api";

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  photo?: string;
  email?: string;
  telephone?: string;
  tel1?: string;
  genre?: string;
  dateNaissance?: string;
  age?: number;
  generation?: string;
  ethnie?: string;
  region?: string;
  pays?: string;
  nationalite?: string;
  prenomPere?: string;
  nomFamillePere?: string;
  numeroHPere?: string;
  prenomMere?: string;
  nomFamilleMere?: string;
  numeroHMere?: string;
  [key: string]: any;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  userData: UserData | null;
  onUpdate: (updatedData: UserData) => void;
}

export default function EditProfileModal({
  open,
  onClose,
  userData,
  onUpdate,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserData | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && userData) {
      setFormData({ ...userData });
      setPhotoPreview(userData.photo || null);
      setPhotoFile(null);
      setError(null);
    }
  }, [open, userData]);

  const handleInputChange = (field: string, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = config.API_BASE_URL || "http://localhost:5002/api";

      // Mettre à jour la photo si nécessaire
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append("photo", photoFile);
        photoFormData.append("numeroH", formData.numeroH);

        const photoResponse = await fetch(`${API_BASE_URL}/auth/profile/photo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: photoFormData,
        });

        if (!photoResponse.ok) {
          const photoError = await photoResponse.json();
          throw new Error(photoError.message || "Erreur lors de la mise à jour de la photo");
        }

        const photoData = await photoResponse.json();
        formData.photo = photoData.photoUrl || formData.photo;
      }

      // Mettre à jour les informations
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numeroH: formData.numeroH,
          prenom: formData.prenom,
          nomFamille: formData.nomFamille,
          email: formData.email,
          telephone: formData.telephone || formData.tel1,
          tel1: formData.telephone || formData.tel1,
          genre: formData.genre,
          dateNaissance: formData.dateNaissance,
          age: formData.age,
          generation: formData.generation,
          ethnie: formData.ethnie,
          region: formData.region,
          pays: formData.pays,
          nationalite: formData.nationalite,
          prenomPere: formData.prenomPere,
          nomFamillePere: formData.nomFamillePere,
          numeroHPere: formData.numeroHPere,
          prenomMere: formData.prenomMere,
          nomFamilleMere: formData.nomFamilleMere,
          numeroHMere: formData.numeroHMere,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du profil");
      }

      const data = await response.json();
      onUpdate(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !formData) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Modifier mon profil</h3>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo de profil */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Photo de profil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-emerald-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-blue-500">
                  {formData.prenom?.charAt(0) || "👤"}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                📷 Choisir une photo
              </button>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.prenom || ""}
                onChange={(e) => handleInputChange("prenom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de famille *
              </label>
              <input
                type="text"
                value={formData.nomFamille || ""}
                onChange={(e) => handleInputChange("nomFamille", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.telephone || formData.tel1 || ""}
                onChange={(e) => {
                  handleInputChange("telephone", e.target.value);
                  handleInputChange("tel1", e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                value={formData.genre || ""}
                onChange={(e) => handleInputChange("genre", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="HOMME">Homme</option>
                <option value="FEMME">Femme</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance
              </label>
              <input
                type="date"
                value={formData.dateNaissance || ""}
                onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Âge
              </label>
              <input
                type="number"
                value={formData.age || ""}
                onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Génération
              </label>
              <input
                type="text"
                value={formData.generation || ""}
                onChange={(e) => handleInputChange("generation", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ethnie
              </label>
              <input
                type="text"
                value={formData.ethnie || ""}
                onChange={(e) => handleInputChange("ethnie", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Région
              </label>
              <input
                type="text"
                value={formData.region || ""}
                onChange={(e) => handleInputChange("region", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <input
                type="text"
                value={formData.pays || ""}
                onChange={(e) => handleInputChange("pays", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationalité
              </label>
              <input
                type="text"
                value={formData.nationalite || ""}
                onChange={(e) => handleInputChange("nationalite", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Informations familiales */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold mb-4">Informations familiales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom du père
                </label>
                <input
                  type="text"
                  value={formData.prenomPere || ""}
                  onChange={(e) => handleInputChange("prenomPere", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de famille du père
                </label>
                <input
                  type="text"
                  value={formData.nomFamillePere || ""}
                  onChange={(e) => handleInputChange("nomFamillePere", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NuméroH du père
                </label>
                <input
                  type="text"
                  value={formData.numeroHPere || ""}
                  onChange={(e) => handleInputChange("numeroHPere", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom de la mère
                </label>
                <input
                  type="text"
                  value={formData.prenomMere || ""}
                  onChange={(e) => handleInputChange("prenomMere", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de famille de la mère
                </label>
                <input
                  type="text"
                  value={formData.nomFamilleMere || ""}
                  onChange={(e) => handleInputChange("nomFamilleMere", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NuméroH de la mère
                </label>
                <input
                  type="text"
                  value={formData.numeroHMere || ""}
                  onChange={(e) => handleInputChange("numeroHMere", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

