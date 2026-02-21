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
  /** Ne pas afficher le message "Aucun X disponible" quand la liste est vide */
  hideEmptyMessage?: boolean;
}

export default function ProSection({ type, title, icon, description, hideEmptyMessage }: ProSectionProps) {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<ProAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = accounts.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-8" id={`section-${type}`}>
      {/* Titre section */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {icon} {title}
        </h2>
      </div>
      {description && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>}

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
