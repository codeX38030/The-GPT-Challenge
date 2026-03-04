import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { Appearance, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "@/constants/translations";
import { DiagnosisResult } from "@/constants/knowledgeBase";

export type ThemeMode = "system" | "light" | "dark";

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  diagnoses: DiagnosisResult[];
  addDiagnosis: (d: DiagnosisResult) => void;
  deleteDiagnosis: (id: string) => void;
  clearDiagnoses: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_LANGUAGE = "@farmphile_language";
const STORAGE_DIAGNOSES = "@farmphile_diagnoses";
const STORAGE_THEME = "@farmphile_theme";

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    (async () => {
      try {
        const lang = await AsyncStorage.getItem(STORAGE_LANGUAGE);
        if (lang) setLanguageState(lang as Language);

        const storedDiagnoses = await AsyncStorage.getItem(STORAGE_DIAGNOSES);
        if (storedDiagnoses) setDiagnoses(JSON.parse(storedDiagnoses));

        const theme = await AsyncStorage.getItem(STORAGE_THEME);
        if (theme) {
          const t = theme as ThemeMode;
          setThemeModeState(t);
          applyColorScheme(t);
        }
      } catch {}
    })();
  }, []);

  const applyColorScheme = (mode: ThemeMode) => {
    if (Platform.OS !== "web") {
      try {
        if (mode === "dark") {
          Appearance.setColorScheme("dark");
        } else if (mode === "light") {
          Appearance.setColorScheme("light");
        } else {
          Appearance.setColorScheme(null);
        }
      } catch {}
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_LANGUAGE, lang);
    } catch {}
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    applyColorScheme(mode);
    try {
      await AsyncStorage.setItem(STORAGE_THEME, mode);
    } catch {}
  };

  const addDiagnosis = async (d: DiagnosisResult) => {
    setDiagnoses((prev) => {
      const updated = [d, ...prev].slice(0, 50);
      AsyncStorage.setItem(STORAGE_DIAGNOSES, JSON.stringify(updated)).catch(
        () => {}
      );
      return updated;
    });
  };

  const deleteDiagnosis = async (id: string) => {
    setDiagnoses((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      AsyncStorage.setItem(STORAGE_DIAGNOSES, JSON.stringify(updated)).catch(
        () => {}
      );
      return updated;
    });
  };

  const clearDiagnoses = async () => {
    setDiagnoses([]);
    try {
      await AsyncStorage.removeItem(STORAGE_DIAGNOSES);
    } catch {}
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      themeMode,
      setThemeMode,
      diagnoses,
      addDiagnosis,
      deleteDiagnosis,
      clearDiagnoses,
    }),
    [language, themeMode, diagnoses]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
