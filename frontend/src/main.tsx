import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/globals.css";
import App from "./App.tsx";
import { I18nProvider } from "./i18n/I18nProvider";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import {
  initTestAccount,
  ensureTestAccountsExist,
} from "./utils/initTestAccount";

// 🔧 INITIALISATION AUTOMATIQUE DES COMPTES DE TEST
// Ceci garantit qu'il y a toujours au moins un compte disponible pour se connecter
console.log("🚀 Initialisation de l'application VivasAr...");
initTestAccount();
ensureTestAccountsExist();
console.log("✅ Comptes de test initialisés");

// Configuration du basename pour GitHub Pages
const basename = import.meta.env.PROD ? '/Les-enfants-d-Adam' : '';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <ThemeProvider>
          <I18nProvider>
            <App />
          </I18nProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
