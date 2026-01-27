import { lazy, Suspense, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Banner } from "./components/Banner";
import { ThemeToggleCompact } from "./components/ThemeToggle";
import { useI18n } from "./i18n/useI18n";
import { LANG_LABELS } from "./i18n/strings";
import { FloatingMessenger } from "./components/FloatingMessenger";
import { getSessionUser } from "./utils/auth";

// Lazy loading de toutes les pages pour améliorer les performances
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Inscription = lazy(() => import("./pages/Inscription").then(m => ({ default: m.Inscription })));
const RegistrationChoice = lazy(() => import("./pages/RegistrationChoice").then(m => ({ default: m.RegistrationChoice })));
const LivingWizard = lazy(() => import("./pages/living/LivingWizard").then(m => ({ default: m.LivingWizard })));
const DeceasedWizard = lazy(() => import("./pages/deceased/DeceasedWizard").then(m => ({ default: m.DeceasedWizard })));
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const LoginMembre = lazy(() => import("./pages/LoginMembre").then(m => ({ default: m.LoginMembre })));
const Account = lazy(() => import("./pages/Account").then(m => ({ default: m.Account })));
const Moi = lazy(() => import("./pages/Moi").then(m => ({ default: m.Moi })));
const MonProfil = lazy(() => import("./pages/MonProfil"));
const Donations = lazy(() => import("./pages/Donations").then(m => ({ default: m.Donations })));
const Famille = lazy(() => import("./pages/famille/Famille"));
const Parents = lazy(() => import("./pages/famille/Parents"));
const Partenaire = lazy(() => import("./pages/famille/Partenaire"));
const Arbre = lazy(() => import("./pages/famille/Arbre"));
const Membres = lazy(() => import("./pages/famille/Membres"));
const Enfants = lazy(() => import("./pages/famille/Enfants"));
const MesAmours = lazy(() => import("./pages/famille/MesAmours"));
const Sante = lazy(() => import("./pages/Sante"));
const Securite = lazy(() => import("./pages/Securite"));
const Identite = lazy(() => import("./pages/Identite"));
const Activite = lazy(() => import("./pages/Activite"));
const Education = lazy(() => import("./pages/Education"));
const Solidarite = lazy(() => import("./pages/Solidarite"));
const Zaka = lazy(() => import("./pages/Zaka"));
const ZakaEtDons = lazy(() => import("./pages/ZakaEtDons"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminBadges = lazy(() => import("./pages/AdminBadges"));
const AdminGovernments = lazy(() => import("./pages/AdminGovernments"));
const TerreAdam = lazy(() => import("./pages/TerreAdam"));
const Histoire = lazy(() => import("./pages/Histoire"));
const ARetenir = lazy(() => import("./pages/ARetenir"));
const HistoireHumanite = lazy(() => import("./pages/HistoireHumanite"));
const EchangesProfessionnel = lazy(() => import("./components/EchangesProfessionnel").then(m => ({ default: m.EchangesProfessionnel })));
const EchangePrimaire = lazy(() => import("./pages/EchangePrimaire"));
const EchangeNourriture = lazy(() => import("./pages/EchangeNourriture"));
const EchangeMedicament = lazy(() => import("./pages/EchangeMedicament"));
const EchangeSecondaire = lazy(() => import("./pages/EchangeSecondaire"));
const Science = lazy(() => import("./pages/Science"));
const ProfesseurIA = lazy(() => import("./pages/ProfesseurIA"));

// Composant de chargement optimisé
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const { t, lang, setLang } = useI18n();
  const { pathname } = useLocation();
  
  // Optimisation : mémoriser la vérification de session pour éviter les recalculs
  const isLoggedIn = useMemo(() => {
    const user = getSessionUser();
    return user !== null;
  }, [pathname]); // Recalculer seulement si le pathname change
  
  const isHome = pathname === "/";
  const showFullHeader = !isLoggedIn || isHome;
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-gray-900 overflow-x-hidden">
      {showFullHeader && <Banner />}

      {/* Header responsive: PC, tablette, mobile */}
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 safe-area-inset-top">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0" aria-label="Accueil">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-9 w-9 xs:h-10 xs:w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('/logo.png')) {
                    target.src = '/1.png';
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end min-h-[44px]">
              <ThemeToggleCompact />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 hidden xs:inline">Lang</label>
                <select
                  className="min-h-[44px] px-2 py-2 sm:py-1 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
                  value={lang}
                  onChange={(e) =>
                    setLang(e.target.value as "fr" | "en" | "ar" | "man" | "pul")
                  }
                  aria-label="Choisir la langue"
                >
                  {Object.entries(LANG_LABELS).map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - padding adapté mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/choix" element={<RegistrationChoice />} />
          <Route path="/vivant/*" element={<LivingWizard />} />
          <Route path="/defunt/*" element={<DeceasedWizard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-membre" element={<LoginMembre />} />
          <Route path="/compte" element={<Account />} />
          <Route path="/moi" element={<Moi />} />
          <Route path="/moi/profil" element={<MonProfil />} />
          <Route path="/sante" element={<Sante />} />
          <Route path="/securite" element={<Securite />} />
          <Route path="/mes-amours" element={<Navigate to="/famille/mes-amours" replace />} />
          <Route path="/identite" element={<Identite />} />
          <Route path="/activite" element={<Activite />} />
          <Route path="/education" element={<Education />} />
          <Route path="/dokal" element={<Navigate to="/solidarite" replace />} />
          <Route path="/foi" element={<Navigate to="/solidarite" replace />} />
          <Route path="/solidarite" element={<Solidarite />} />
          <Route path="/dons" element={<Navigate to="/solidarite" replace />} />
          <Route path="/zaka" element={<Zaka />} />
          <Route path="/zaka-et-dons" element={<Navigate to="/solidarite" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/badges" element={<AdminBadges />} />
          <Route path="/admin/logos" element={<Navigate to="/admin/badges?tab=logos" replace />} />
          <Route path="/admin/governments" element={<AdminGovernments />} />
          <Route path="/famille" element={<Famille />} />
          <Route path="/famille/parents" element={<Parents />} />
          <Route path="/famille/femmes" element={<Partenaire />} />
          <Route path="/famille/mari" element={<Partenaire />} />
          <Route path="/famille/enfants" element={<Enfants />} />
          <Route path="/famille/arbre" element={<Arbre />} />
          <Route path="/famille/arbre/membres" element={<Membres />} />
          <Route path="/famille/mes-amours" element={<MesAmours />} />
          <Route path="/lieux-residence" element={<Navigate to="/terre-adam" replace />} />
          <Route path="/pays" element={<Navigate to="/terre-adam" replace />} />
          <Route path="/terre-adam" element={<TerreAdam />} />
          <Route path="/organisation" element={<Navigate to="/activite" replace />} />
          <Route path="/histoire" element={<Histoire />} />
          <Route path="/a-retenir" element={<ARetenir />} />
          <Route path="/histoire-humanite" element={<HistoireHumanite />} />
          <Route path="/science" element={<Science />} />
            <Route path="/echange" element={<EchangesProfessionnel userData={null} />} />
          <Route path="/echange/primaire" element={<EchangePrimaire />} />
            <Route path="/echange/nourriture" element={<EchangeNourriture />} />
            <Route path="/echange/medicament" element={<EchangeMedicament />} />
          <Route path="/echange/secondaire" element={<EchangeSecondaire />} />
          <Route path="/ia-sc" element={<ProfesseurIA />} />
          <Route path="/professeur-ia" element={<ProfesseurIA />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>

      {/* Footer responsive */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white py-4 sm:py-6 mt-auto safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 text-center">
          <p className="text-gray-300 dark:text-gray-400 text-xs xs:text-sm sm:text-base">
            2025 Les Enfants d'Adam et Eve - Système d'enregistrement généalogique
          </p>
        </div>
      </footer>

      {/* Messenger global */}
      {!(isHome || pathname === "/inscription" || pathname === "/login") && <FloatingMessenger />}
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--toast-bg, #fff)",
            color: "var(--toast-color, #1f2937)",
            borderRadius: "0.75rem",
            padding: "1rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          className: "dark:bg-gray-800 dark:text-gray-100",
        }}
      />
    </div>
  );
}

export default App;
