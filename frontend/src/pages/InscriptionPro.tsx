import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PRO_TYPES = [
  { id: "clinic", label: "Clinique / Hôpital", icon: "🏥", desc: "Recevez et gérez les rendez-vous des patients" },
  { id: "security_agency", label: "Agence de sécurité", icon: "🛡️", desc: "Proposez vos services de sécurité" },
  { id: "journalist", label: "Journaliste", icon: "📰", desc: "Publiez des informations sur Terre Adam" },
  { id: "enterprise", label: "Entreprise", icon: "🏢", desc: "Publiez des outils de travail sur Activité" },
  { id: "school", label: "École / Professeur", icon: "🎓", desc: "Publiez des formations et recevez des rendez-vous" },
  { id: "supplier", label: "Fournisseur", icon: "📦", desc: "Proposez vos produits et services" },
];

export default function InscriptionPro() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", description: "", address: "", city: "", country: "", phone: "", email: "",
    services: "",
    specialties: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          description: form.description.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
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
          <button onClick={() => step === "form" ? setStep("choose") : navigate("/compte")} className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition-colors">
            ← Retour
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Inscription Professionnelle
          </h1>
        </div>

        {step === "choose" ? (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Choisissez le type de compte que vous souhaitez créer :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRO_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedType(t.id); setStep("form"); }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-6 text-left transition-all hover:scale-[1.02]"
                >
                  <div className="text-4xl mb-3">{t.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{t.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.desc}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{PRO_TYPES.find(t => t.id === selectedType)?.icon}</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {PRO_TYPES.find(t => t.id === selectedType)?.label}
              </h2>
            </div>

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
            </div>

            <button type="submit" disabled={loading}
              className="mt-6 w-full min-h-[44px] px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors shadow-sm">
              {loading ? "Envoi en cours..." : "Envoyer ma demande d'inscription"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
