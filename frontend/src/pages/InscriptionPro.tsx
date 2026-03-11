import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PRO_TYPES = [
  { id: "clinic", label: "Clinique / Hôpital", icon: "🏥", desc: "Recevez et gérez les rendez-vous des patients" },
  { id: "security_agency", label: "Agence de sécurité", icon: "🛡️", desc: "Proposez vos services de sécurité" },
  { id: "journalist", label: "Journaliste", icon: "📰", desc: "Publiez des informations sur Terre Adam" },
  { id: "enterprise", label: "Entreprise", icon: "🏢", desc: "Publiez des outils de travail sur Activité" },
  { id: "school", label: "École / Professeur", icon: "🎓", desc: "Publiez des formations et recevez des rendez-vous" },
  // Types liés au secteur Échanges
  { id: "vendor", label: "Vendeur", icon: "🛒", desc: "Vente directe de produits (primaire, secondaire, tertiaire)" },
  { id: "supplier", label: "Fournisseur / Grossiste", icon: "📦", desc: "Approvisionnement et gros pour les autres vendeurs" },
  { id: "producer", label: "Entreprise de production", icon: "🏭", desc: "Production / transformation de biens pour les échanges" },
  { id: "broker", label: "Démarcheur / Location de maison", icon: "🏘️", desc: "Mise en relation pour location de maisons et biens tertiaires" },
  { id: "scientist", label: "Chercheur / Scientifique", icon: "🔬", desc: "Partagez vos travaux et publications" },
  { id: "ngo", label: "ONG / Association", icon: "🤝", desc: "Gérez vos projets humanitaires et bénévoles" },
];

/** Pour chaque type : ce qu'on attend + où vous serez visible sur la plateforme */
const PRO_TYPE_INFO: Record<string, { expect: string; page: string }> = {
  clinic: {
    expect: "Nous attendons que vous proposiez des soins ou services médicaux (consultations, urgences, spécialités) et que vous acceptiez les demandes de rendez-vous des utilisateurs.",
    page: "Vous serez visible et publié sur la page **Santé** : les utilisateurs pourront vous trouver, voir vos services et prendre rendez-vous avec vous.",
  },
  security_agency: {
    expect: "Nous attendons que vous proposiez des services de sécurité (surveillance, gardiennage, protection) et que vous répondiez aux demandes de la communauté.",
    page: "Vous serez visible et publié sur la page **Sécurité** : les utilisateurs pourront vous contacter et prendre rendez-vous pour vos services.",
  },
  journalist: {
    expect: "Nous attendons que vous publiiez des informations, reportages ou actualités utiles à la communauté, dans le respect de l’éthique et des faits.",
    page: "Vous serez visible et publié sur la page **Terre ADAM** (section Lieux / informations) : vos contenus pourront être diffusés aux utilisateurs de la plateforme.",
  },
  enterprise: {
    expect: "Nous attendons que vous proposiez des outils, services ou produits pour le travail et l’activité professionnelle (formations, conseil, équipements, etc.).",
    page: "Vous serez visible et publié sur la page **Activité** : les utilisateurs pourront découvrir vos offres et vous contacter ou prendre rendez-vous.",
  },
  school: {
    expect: "Nous attendons que vous proposiez des formations, cours ou accompagnement pédagogique et que vous gériez les demandes de rendez-vous ou d’inscription des utilisateurs.",
    page: "Vous serez visible et publié sur la page **Éducation** : les utilisateurs pourront voir vos formations et prendre rendez-vous ou s’inscrire à vos cours.",
  },
  supplier: {
    expect:
      "Nous attendons que vous proposiez des produits ou services en tant que fournisseur ou grossiste (approvisionnement des vendeurs, contrats réguliers, livraison en quantité).",
    page:
      "Vous serez visible et publié sur les pages **Échanges** (primaire, secondaire, tertiaire) comme fournisseur/grossiste : les vendeurs et entreprises pourront vous contacter pour s’approvisionner.",
  },
  vendor: {
    expect:
      "Nous attendons que vous vendiez directement des produits (aliments, vêtements, véhicules, matériaux, etc.) au détail ou en petite quantité, avec des annonces claires et à jour.",
    page:
      "Vous serez visible et publié dans les niveaux **Échanges Primaire / Secondaire / Tertiaire** selon vos produits, afin que les utilisateurs puissent facilement vous trouver et acheter.",
  },
  producer: {
    expect:
      "Nous attendons que vous produisiez, transformiez ou fabriquiez des biens (production agricole, ateliers, usines, artisanat organisé) pour les mettre à disposition dans les échanges.",
    page:
      "Vous serez visible et publié dans les pages **Échanges** en tant qu’**entreprise de production**, souvent mise en avant en bas des pages pour représenter les structures de production.",
  },
  broker: {
    expect:
      "Nous attendons que vous mettiez en relation des propriétaires et des locataires (maisons, appartements, biens tertiaires) de manière sérieuse et transparente.",
    page:
      "Vous serez visible surtout dans la page **Échanges Tertiaire** (location de maisons, biens tertiaires) comme **démarcheur / agent**, pour aider les utilisateurs à trouver un logement ou un bien à louer.",
  },
  scientist: {
    expect: "Nous attendons que vous partagiez des travaux, publications ou contenus scientifiques validés, dans un langage accessible, pour éclairer la communauté.",
    page: "Vous serez visible et publié sur la page **Science** : les utilisateurs pourront consulter vos contenus et vous contacter pour des échanges ou collaborations.",
  },
  ngo: {
    expect: "Nous attendons que vous présentiez vos projets humanitaires ou solidaires, vos besoins en bénévoles ou en dons, et que vous répondiez aux demandes de la communauté.",
    page: "Vous serez visible et publié sur la page **Solidarité** (onglet ONG) : les utilisateurs pourront découvrir vos actions et prendre rendez-vous ou vous contacter pour participer ou faire un don.",
  },
};

const PRO_TYPE_IDS = new Set(PRO_TYPES.map((t) => t.id));

export default function InscriptionPro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get("type") || "";
  const initialType = typeFromUrl && PRO_TYPE_IDS.has(typeFromUrl) ? typeFromUrl : "";

  const [selectedType, setSelectedType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    mediaUrl: "",
    justificatifDocument: "",
    services: "",
    specialties: "",
  });
  const [justificatifFileName, setJustificatifFileName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) { setError("Veuillez choisir un type de compte."); return; }
    if (!form.name.trim()) { setError("Le nom est requis"); return; }
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/professionals/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: selectedType,
          name: form.name.trim(),
          description: (form.description.trim() || "") + (form.website.trim() ? `\nSite: ${form.website.trim()}` : ""),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          photo: form.mediaUrl.trim() || undefined,
          justificatifDocument: form.justificatifDocument.trim() || undefined,
          services: form.services ? form.services.split(",").map(s => s.trim()).filter(Boolean) : [],
          specialties: form.specialties ? form.specialties.split(",").map(s => s.trim()).filter(Boolean) : [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Inscription envoyée !</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Votre demande est en attente de validation par l'administrateur.
            Vous recevrez une notification dès qu'elle sera approuvée.
          </p>
          <button onClick={() => navigate("/compte")} className="w-full min-h-[44px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => navigate("/compte")} className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition-colors">
            ← Retour
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Inscription Professionnelle
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700 p-6 sm:p-8">
          {/* Type déjà choisi en amont : on l'affiche, pas de liste déroulante */}
          {selectedType ? (
            <div className="mb-6 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Vous vous inscrivez en tant que :</span>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {PRO_TYPES.find((t) => t.id === selectedType)?.icon} {PRO_TYPES.find((t) => t.id === selectedType)?.label}
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de compte *</label>
              <select
                required
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir un type...</option>
                {PRO_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                ))}
              </select>
            </div>
          )}

          {selectedType && PRO_TYPE_INFO[selectedType] && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-left space-y-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                📋 Ce qu’on attend de vous :
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {PRO_TYPE_INFO[selectedType].expect}
              </p>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                📍 Où vous serez publié sur la plateforme :
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {PRO_TYPE_INFO[selectedType].page.replace(/\*\*(.*?)\*\*/g, "$1")}
              </p>
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de votre établissement" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez votre activité..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image ou vidéo de présentation (max ~30s)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Choisissez une photo ou une courte vidéo (≈ 30 secondes). Le fichier sera converti automatiquement.
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      setForm(f => ({ ...f, mediaUrl: "" }));
                      return;
                    }
                    // Option simple: limiter la taille (ex. 20 Mo) pour éviter les fichiers trop lourds
                    if (file.size > 20 * 1024 * 1024) {
                      setError("Le fichier ne doit pas dépasser 20 Mo.");
                      setForm(f => ({ ...f, mediaUrl: "" }));
                      return;
                    }
                    setError("");
                    const reader = new FileReader();
                    reader.onload = () => {
                      // on stocke le base64 dans mediaUrl, comme prévu côté backend
                      setForm(f => ({ ...f, mediaUrl: String(reader.result) }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays</label>
                <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Services (séparés par virgule)</label>
                <input type="text" value={form.services} onChange={e => setForm({ ...form, services: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Consultation, Chirurgie, Urgence" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spécialités (séparées par virgule)</label>
                <input type="text" value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Cardiologie, Pédiatrie, Sécurité privée" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Justificatif d'activité (optionnel)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Si vous en avez, joignez un document : diplôme, agrément, papiers (école, clinique…), Kbis, etc. PDF ou image. Taille max : 10 Mo. Réservé à l’administrateur pour validation ; personne d’autre ne le verra.
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      setForm(f => ({ ...f, justificatifDocument: "" }));
                      setJustificatifFileName("");
                      return;
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      setError("Le fichier ne doit pas dépasser 10 Mo.");
                      setForm(f => ({ ...f, justificatifDocument: "" }));
                      setJustificatifFileName("");
                      return;
                    }
                    setError("");
                    const reader = new FileReader();
                    reader.onload = () => setForm(f => ({ ...f, justificatifDocument: String(reader.result) }));
                    reader.readAsDataURL(file);
                    setJustificatifFileName(file.name);
                  }}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300"
                />
                {justificatifFileName && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">Fichier sélectionné : {justificatifFileName}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site web (optionnel)</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={e => setForm({ ...form, website: e.target.value })}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: https://www.macliniquediallo.com"
                />
              </div>
            </div>

          <button type="submit" disabled={loading}
            className="mt-6 w-full min-h-[44px] px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors shadow-sm">
            {loading ? "Envoi en cours..." : "Envoyer ma demande d'inscription"}
          </button>
        </form>
      </div>
    </div>
  );
}
