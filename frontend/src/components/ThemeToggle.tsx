import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`Basculer vers le mode ${theme === "light" ? "sombre" : "clair"}`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-900 shadow-lg transition-transform ${
          theme === "dark" ? "translate-x-7" : "translate-x-1"
        }`}
      >
        <span className="flex items-center justify-center h-full">
          {theme === "dark" ? (
            <span className="text-yellow-400 text-sm">🌙</span>
          ) : (
            <span className="text-yellow-500 text-sm">☀️</span>
          )}
        </span>
      </span>
    </button>
  );
}

export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Basculer vers le mode ${theme === "light" ? "sombre" : "clair"}`}
      title={`Mode ${theme === "light" ? "clair" : "sombre"}`}
    >
      {theme === "dark" ? (
        <span className="text-xl">🌙</span>
      ) : (
        <span className="text-xl">☀️</span>
      )}
    </button>
  );
}

