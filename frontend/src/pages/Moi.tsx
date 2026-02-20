import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function Moi() {
  const navigate = useNavigate();

  return (
    <div className="moi-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4">
        {/* En-tête et navigation "Moi" (dans Famille) */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Moi
          </h1>
          <nav
            className="flex flex-wrap gap-2"
            aria-label="Navigation Moi"
          >
            <NavLink
              to="/famille/moi/arbre"
              end
              className={({ isActive }) =>
                `min-h-[44px] px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`
              }
            >
              🌳 Mon arbre
            </NavLink>
            <button
              type="button"
              onClick={() => navigate("/famille")}
              className="min-h-[44px] px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
            >
              ← Retour à Famille
            </button>
          </nav>
        </div>

        {/* Contenu : Mon arbre */}
        <div className="moi-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
