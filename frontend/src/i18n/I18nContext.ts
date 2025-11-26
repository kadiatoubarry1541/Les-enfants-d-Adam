import { createContext } from "react";
import { LANG_LABELS, type LangCode } from "./strings";

export interface I18nContextValue {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  labels: typeof LANG_LABELS;
}

export const I18nContext = createContext<I18nContextValue | undefined>(
  undefined,
);
