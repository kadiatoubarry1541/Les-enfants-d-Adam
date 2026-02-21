import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProAccount {
  id: string;
  type: string;
  name: string;
  description: string;
  city: string;
  status: string;
  created_at: string;
}

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  clinic: { label: "Clinique / Hôpital", icon: "🏥" },
  security_agency: { label: "Agence de sécurité", icon: "🛡️" },
  journalist: { label: "Journaliste", icon: "📰" },
  enterprise: { label: "Entreprise", icon: "🏢" },
  school: { label: "École / Professeur", icon: "🎓" },
  supplier: { label: "Fournisseur", icon: "📦" },
  ngo: { label: "ONG / Association", icon: "🤝" },
};

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approuvé", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rejeté", cls: "bg-red-100 text-red-700" },
};

export default function MesComptesPro() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<ProAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAccounts(); }, []);

  const loadAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/professionals/my-accounts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAccounts(data.accounts || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/compte")} className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition-colors">
            ← Retour
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Mes comptes professionnels</h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Aucun compte professionnel</h3>
            <p className="text-gray-500 mb-2">Vous n'avez pas encore de compte professionnel.</p>
            <p className="text-sm text-gray-400">
              Pour créer un compte, allez dans{' '}
              <button
                onClick={() => navigate('/mon-profil')}
                className="text-blue-600 hover:underline font-medium"
              >
                Mon Profil
              </button>{' '}
              puis cliquez sur le bouton <strong>🚀 Actions</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((acc) => {
              const typeInfo = TYPE_LABELS[acc.type] || { label: acc.type, icon: "📄" };
              const statusInfo = STATUS_STYLES[acc.status] || { label: acc.status, cls: "bg-gray-100 text-gray-700" };
              return (
                <div key={acc.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="text-3xl">{typeInfo.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 dark:text-gray-100">{acc.name}</div>
                    <div className="text-sm text-gray-500">{typeInfo.label} • {acc.city || "Ville non précisée"}</div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.cls}`}>{statusInfo.label}</span>
                  {acc.status === "approved" && (
                    <button onClick={() => navigate(`/espace-pro/${acc.id}`)}
                      className="min-h-[40px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                      Ouvrir espace
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
