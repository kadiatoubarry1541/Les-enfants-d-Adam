import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProAccount {
  id: string;
  type: string;
  name: string;
  description: string;
  city: string;
  country: string;
  phone: string;
  services: string[];
  specialties: string[];
  status: string;
}

interface ProSectionProps {
  type: "clinic" | "security_agency" | "journalist" | "enterprise" | "school" | "supplier" | "scientist" | "ngo";
  title: string;
  icon: string;
  description: string;
  /** Si fourni, le formulaire est contrôlé depuis l'extérieur (ex: bouton dans le header) */
  showForm?: boolean;
  onShowFormChange?: (show: boolean) => void;
  /** Ne pas afficher le message "Aucun X disponible" quand la liste est vide */
  hideEmptyMessage?: boolean;
}

const TYPE_FORM_FIELDS: Record<string, { servicePlaceholder: string; specialtyPlaceholder: string }> = {
  clinic: { servicePlaceholder: "Ex: Consultation, Chirurgie, Urgence", specialtyPlaceholder: "Ex: Cardiologie, Pédiatrie" },
  security_agency: { servicePlaceholder: "Ex: Surveillance, Protection, Escorte", specialtyPlaceholder: "Ex: Sécurité privée, Événementiel" },
  journalist: { servicePlaceholder: "Ex: Reportage, Interview, Enquête", specialtyPlaceholder: "Ex: Politique, Sport, Économie" },
  enterprise: { servicePlaceholder: "Ex: Construction, Transport, Informatique", specialtyPlaceholder: "Ex: BTP, Logistique, Développement" },
  school: { servicePlaceholder: "Ex: Formation, Cours, Tutorat", specialtyPlaceholder: "Ex: Mathématiques, Langues, Informatique" },
  supplier: { servicePlaceholder: "Ex: Livraison, Gros, Détail", specialtyPlaceholder: "Ex: Alimentaire, Électronique, Textile" },
  scientist: { servicePlaceholder: "Ex: Recherche, Conférence, Publication", specialtyPlaceholder: "Ex: Physique, Chimie, Biologie, Astronomie" },
  ngo: { servicePlaceholder: "Ex: Aide alimentaire, Santé, Éducation", specialtyPlaceholder: "Ex: Urgence, Développement, Enfance" },
};

export default function ProSection({ type, title, icon, description, showForm: controlledShowForm, onShowFormChange, hideEmptyMessage }: ProSectionProps) {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<ProAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalShowForm, setInternalShowForm] = useState(false);
  const showForm = controlledShowForm !== undefined ? controlledShowForm : internalShowForm;
  const setShowForm = onShowFormChange ?? setInternalShowForm;
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", address: "", city: "", country: "", phone: "", email: "",
    services: "", specialties: "",
  });

  useEffect(() => { loadAccounts(); }, [type]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5002/api/professionals/approved?type=${type}`);
      const data = await res.json();
      if (data.success) setAccounts(data.accounts || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSending(true);
    setSuccessMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/professionals/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type,
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
        setSuccessMsg(type === "journalist"
          ? "Votre inscription a été envoyée. Attendez d'être accepté par l'administrateur pour pouvoir publier des informations sur Terre ADAM."
          : "Inscription envoyée ! En attente de validation par l'administrateur.");
        setForm({ name: "", description: "", address: "", city: "", country: "", phone: "", email: "", services: "", specialties: "" });
        setShowForm(false);
      } else {
        setSuccessMsg(data.message || "Erreur");
      }
    } catch {
      setSuccessMsg("Erreur de connexion");
    } finally {
      setSending(false);
    }
  };

  const filtered = accounts.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  const fields = TYPE_FORM_FIELDS[type] || TYPE_FORM_FIELDS.clinic;

  return (
    <div className="mt-8" id={`section-${type}`}>
      {/* Titre section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {icon} {title}
        </h2>
        {controlledShowForm === undefined && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="min-h-[40px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {showForm ? "Fermer" : `+ S'inscrire`}
          </button>
        )}
      </div>
      {description && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>}

      {successMsg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${successMsg.includes("attente") ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"}`}>
          {successMsg}
        </div>
      )}

      {/* Formulaire d'inscription */}
      {showForm && (
        <form onSubmit={handleRegister} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-5 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Inscription - {title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nom de l'établissement *" className="w-full min-h-[40px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                placeholder="Description de votre activité" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" />
            </div>
            <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
              placeholder="Ville" className="w-full min-h-[40px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" />
            <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
              placeholder="Pays" className="w-full min-h-[40px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" />
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="Adresse" className="w-full min-h-[40px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" />
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="Téléphone" className="w-full min-h-[40px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" />
            <input type="text" value={form.services} onChange={e => setForm({ ...form, services: e.target.value })}
              placeholder={fields.servicePlaceholder} className="w-full min-h-[40px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" />
            <input type="text" value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })}
              placeholder={fields.specialtyPlaceholder} className="w-full min-h-[40px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" />
          </div>
          <button type="submit" disabled={sending}
            className="mt-4 min-h-[40px] px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors text-sm">
            {sending ? "Envoi..." : "Envoyer ma demande"}
          </button>
        </form>
      )}

      {/* Recherche */}
      {accounts.length > 0 && (
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou ville..."
          className="w-full min-h-[40px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4 text-sm" />
      )}

      {/* Liste des comptes approuvés */}
      {loading ? (
        <div className="text-center py-6 text-gray-500 text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        hideEmptyMessage ? null : (
          <div className="text-center py-6 text-gray-500 text-sm">
            Aucun {title.toLowerCase()} disponible pour le moment.
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pro) => (
            <div key={pro.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{pro.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{pro.city}{pro.country ? `, ${pro.country}` : ""}</p>
              {pro.description && <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{pro.description}</p>}
              {pro.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {pro.specialties.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">{s}</span>
                  ))}
                </div>
              )}
              <button onClick={() => navigate(`/rendez-vous/${pro.id}`)}
                className="w-full min-h-[36px] px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                📅 Prendre rendez-vous
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
