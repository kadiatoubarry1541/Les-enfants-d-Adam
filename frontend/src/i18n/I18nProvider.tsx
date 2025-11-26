import React, { useCallback, useMemo, useState } from "react";
import { LANG_LABELS, STRINGS, type LangCode } from "./strings";
import { I18nContext } from "./I18nContext";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const stored = (localStorage.getItem("lang") as LangCode) || "fr";
  const [lang, setLangState] = useState<LangCode>(stored);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = STRINGS[lang] || STRINGS.fr;
      return dict[key] ?? key;
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, labels: LANG_LABELS }),
    [lang, setLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
