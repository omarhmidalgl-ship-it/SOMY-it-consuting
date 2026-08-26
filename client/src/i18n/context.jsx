import { createContext, useContext, useState } from "react";
import en from "./en.json";
import ar from "./ar.json";
import fr from "./fr.json";

const translations = { en, ar, fr };
const LANG_ORDER = ["en", "fr", "ar"];
const LANG_LABELS = { en: "EN", fr: "FR", ar: "عربي" };
const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("somy_lang") || "en");

  const toggleLang = () => {
    const idx = LANG_ORDER.indexOf(lang);
    const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
    setLang(next);
    localStorage.setItem("somy_lang", next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
  };

  const t = (path) => {
    const keys = path.split(".");
    let val = translations[lang];
    for (const k of keys) {
      if (val && typeof val === "object") val = val[k];
      else return path;
    }
    return val ?? path;
  };

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang, langLabel: LANG_LABELS[lang], dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
