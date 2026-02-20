import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
}

const TYPES = [
  { id: "", label: "Tous", icon: "📋" },
  { id: "clinic", label: "Cliniques", icon: "🏥" },
  { id: "security_agency", label: "Sécurité", icon: "🛡️" },
  { id: "journalist", label: "Journalistes", icon: "📰" },
  { id: "enterprise", label: "Entreprises", icon: "🏢" },
  { id: "school", label: "Écoles", icon: "🎓" },
  { id: "supplier", label: "Fournisseurs", icon: "📦" },
];

export default function ListeProfessionnels() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [accounts, setAccounts] = useState<ProAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const filterType = searchParams.get("type") || "";

  useEffect(() => {
    loadAccounts();
  }, [filterType]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const url = filterType
        ? `http://localhost:5002/api/professionals/approved?type=${filterType}`
        : "http://localhost:5002/api/professionals/approved";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setAccounts(data.accounts || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) { loadAccounts(); return; }
    setLoading(true);
    try {
      const url = `http://localhost:5002/api/professionals/search?q=${encodeURIComponent(search)}&type=${filterType}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setAccounts(data.accounts || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = accounts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/compte")} className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition-colors">
            ← Retour
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Professionnels</h1>
        </div>

        {/* Recherche */}
        <div className="flex gap-2 mb-4">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Rechercher un nom, une ville..."
            className="flex-1 min-h-[44px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSearch} className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            🔍
          </button>
        </div>

        {/* Filtres par type */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-thin">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSearchParams(t.id ? { type: t.id } : {})}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] ${
                filterType === t.id
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500">Aucun professionnel trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pro) => {
              const typeInfo = TYPES.find(t => t.id === pro.type);
              return (
                <div key={pro.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{typeInfo?.icon || "📄"}</span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{pro.name}</h3>
                      <p className="text-sm text-gray-500">{pro.city}{pro.country ? `, ${pro.country}` : ""}</p>
                    </div>
                  </div>
                  {pro.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{pro.description}</p>
                  )}
                  {pro.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pro.specialties.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/rendez-vous/${pro.id}`)}
                    className="w-full min-h-[40px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    📅 Prendre rendez-vous
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
