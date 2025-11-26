import { useState, useMemo, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  filters?: {
    label: string;
    key: string;
    options: { label: string; value: string }[];
  }[];
  onFilterChange?: (filters: Record<string, string>) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Rechercher...",
  onSearch,
  debounceMs = 300,
  filters = [],
  onFilterChange,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Debounce de la recherche avec useEffect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, onSearch]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: value || undefined,
    };
    
    // Nettoyer les filtres vides
    Object.keys(newFilters).forEach((key) => {
      if (!newFilters[key]) {
        delete newFilters[key];
      }
    });

    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setQuery("");
    setActiveFilters({});
    onSearch("");
    onFilterChange?.({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || query.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400 dark:text-gray-500 text-xl">🔍</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => handleQueryChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtres */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || ""}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}

