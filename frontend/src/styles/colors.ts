// Configuration des couleurs professionnelles pour le système
// Utilise uniquement les classes Tailwind CSS existantes

export const COLORS = {
  // Couleur principale - Bleu professionnel
  primary: {
    50: 'bg-blue-50 text-blue-950',
    100: 'bg-blue-100 text-blue-900',
    200: 'bg-blue-200 text-blue-800',
    300: 'bg-blue-300 text-blue-700',
    400: 'bg-blue-400 text-blue-600',
    500: 'bg-blue-500 text-white',
    600: 'bg-blue-600 text-white',
    700: 'bg-blue-700 text-white',
    800: 'bg-blue-800 text-white',
    900: 'bg-blue-900 text-white',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    border: 'border-blue-500',
    ring: 'ring-blue-500',
    focus: 'focus:ring-blue-500 focus:border-blue-500'
  },

  // Couleur secondaire - Vert succès
  success: {
    50: 'bg-emerald-50 text-emerald-950',
    100: 'bg-emerald-100 text-emerald-900',
    200: 'bg-emerald-200 text-emerald-800',
    300: 'bg-emerald-300 text-emerald-700',
    400: 'bg-emerald-400 text-emerald-600',
    500: 'bg-emerald-500 text-white',
    600: 'bg-emerald-600 text-white',
    700: 'bg-emerald-700 text-white',
    800: 'bg-emerald-800 text-white',
    900: 'bg-emerald-900 text-white',
    gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500',
    focus: 'focus:ring-emerald-500 focus:border-emerald-500'
  },

  // Couleur d'attention - Orange/Amber
  warning: {
    50: 'bg-amber-50 text-amber-950',
    100: 'bg-amber-100 text-amber-900',
    200: 'bg-amber-200 text-amber-800',
    300: 'bg-amber-300 text-amber-700',
    400: 'bg-amber-400 text-amber-600',
    500: 'bg-amber-500 text-white',
    600: 'bg-amber-600 text-white',
    700: 'bg-amber-700 text-white',
    800: 'bg-amber-800 text-white',
    900: 'bg-amber-900 text-white',
    gradient: 'bg-gradient-to-r from-amber-500 to-amber-600',
    border: 'border-amber-500',
    ring: 'ring-amber-500',
    focus: 'focus:ring-amber-500 focus:border-amber-500'
  },

  // Couleur neutre - Gris professionnel
  neutral: {
    50: 'bg-slate-50 text-slate-950',
    100: 'bg-slate-100 text-slate-900',
    200: 'bg-slate-200 text-slate-800',
    300: 'bg-slate-300 text-slate-700',
    400: 'bg-slate-400 text-slate-600',
    500: 'bg-slate-500 text-white',
    600: 'bg-slate-600 text-white',
    700: 'bg-slate-700 text-white',
    800: 'bg-slate-800 text-white',
    900: 'bg-slate-900 text-white',
    gradient: 'bg-gradient-to-r from-slate-600 to-slate-700',
    border: 'border-slate-400',
    ring: 'ring-slate-400',
    focus: 'focus:ring-slate-400 focus:border-slate-400'
  },

  // Couleur d'accent - Violet/Purple
  accent: {
    50: 'bg-purple-50 text-purple-950',
    100: 'bg-purple-100 text-purple-900',
    200: 'bg-purple-200 text-purple-800',
    300: 'bg-purple-300 text-purple-700',
    400: 'bg-purple-400 text-purple-600',
    500: 'bg-purple-500 text-white',
    600: 'bg-purple-600 text-white',
    700: 'bg-purple-700 text-white',
    800: 'bg-purple-800 text-white',
    900: 'bg-purple-900 text-white',
    gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
    border: 'border-purple-500',
    ring: 'ring-purple-500',
    focus: 'focus:ring-purple-500 focus:border-purple-500'
  }
} as const;

// Classes de composants réutilisables
export const COMPONENT_STYLES = {
  // Cartes
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200',
    primary: 'bg-white rounded-xl shadow-sm border-l-4 border-l-blue-500 border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200',
    success: 'bg-white rounded-xl shadow-sm border-l-4 border-l-emerald-500 border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200',
    warning: 'bg-white rounded-xl shadow-sm border-l-4 border-l-amber-500 border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200',
    accent: 'bg-white rounded-xl shadow-sm border-l-4 border-l-purple-500 border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200'
  },

  // Boutons
  button: {
    primary: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    secondary: 'px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
    success: 'px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
    warning: 'px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
    accent: 'px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
    outline: 'px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
    ghost: 'px-4 py-2 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2'
  },

  // Inputs
  input: {
    base: 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200',
    error: 'w-full px-3 py-2 border border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200',
    success: 'w-full px-3 py-2 border border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200'
  },

  // Badges/Tags
  badge: {
    primary: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    success: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800',
    warning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800',
    neutral: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800',
    accent: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
  },

  // Sections
  section: {
    base: 'py-12 px-4 sm:px-6 lg:px-8',
    primary: 'py-12 px-4 sm:px-6 lg:px-8 bg-blue-50',
    neutral: 'py-12 px-4 sm:px-6 lg:px-8 bg-slate-50'
  },

  // Headers
  header: {
    h1: 'text-3xl font-bold text-slate-900 mb-2',
    h2: 'text-2xl font-bold text-slate-800 mb-2',
    h3: 'text-xl font-semibold text-slate-700 mb-2',
    h4: 'text-lg font-medium text-slate-600 mb-1'
  },

  // Text
  text: {
    primary: 'text-slate-900',
    secondary: 'text-slate-600',
    muted: 'text-slate-500',
    accent: 'text-blue-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600'
  },

  // Containers
  container: {
    base: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'
  },

  // Grids
  grid: {
    cols1: 'grid grid-cols-1 gap-6',
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
  },

  // Animations et transitions
  animation: {
    fadeIn: 'animate-fade-in opacity-0',
    slideUp: 'transform translate-y-4 opacity-0 transition-all duration-300 ease-out',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin'
  },

  // States
  state: {
    loading: 'opacity-50 pointer-events-none',
    disabled: 'opacity-50 cursor-not-allowed',
    active: 'bg-blue-50 border-blue-200 text-blue-900',
    hover: 'hover:bg-slate-50 transition-colors duration-200'
  }
} as const;

// Utilitaires pour combiner les classes
export const combineClasses = (...classes: (string | undefined | false | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Fonction helper pour appliquer les styles de thème
export const getThemeStyles = (theme: 'primary' | 'success' | 'warning' | 'neutral' | 'accent' = 'primary') => {
  return COLORS[theme];
};
