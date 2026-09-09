"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export type ThemeKey = "electric-cyber" | "stealth-obsidian";

export interface ThemeConfig {
  id: ThemeKey;
  name: string;
  tagline: string;
  bgHex: string;
  primaryAccent: string;
  secondaryAccent: string;
  borderHex: string;
  swatchColors: [string, string, string];
  particleColors: string[];
  titlePrimaryGradient: string;
  titleSecondaryGradient: string;
  titleGlow1: string;
  titleGlow2: string;
  gradientText: string;
  glowClass1: string;
  glowClass2: string;
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  "electric-cyber": {
    id: "electric-cyber",
    name: "Electric Cyber",
    tagline: "Deep Void & Electric Cyan (Recommended)",
    bgHex: "#030712",
    primaryAccent: "#38bdf8",
    secondaryAccent: "#3b82f6",
    borderHex: "#1e293b",
    swatchColors: ["#030712", "#38bdf8", "#3b82f6"],
    particleColors: ["#38bdf8", "#3b82f6", "#60a5fa"],
    titlePrimaryGradient: "from-white via-sky-200 to-cyan-400",
    titleSecondaryGradient: "from-sky-400 via-cyan-400 to-blue-500",
    titleGlow1: "drop-shadow-[0_0_35px_rgba(56,189,248,0.35)]",
    titleGlow2: "drop-shadow-[0_0_45px_rgba(6,182,212,0.45)]",
    gradientText: "from-sky-400 via-blue-500 to-indigo-400",
    glowClass1: "bg-sky-500/15",
    glowClass2: "bg-blue-600/20",
  },
  "stealth-obsidian": {
    id: "stealth-obsidian",
    name: "Stealth Obsidian",
    tagline: "Pitch Black & Royal Azure",
    bgHex: "#000000",
    primaryAccent: "#2563eb",
    secondaryAccent: "#60a5fa",
    borderHex: "#18181b",
    swatchColors: ["#000000", "#2563eb", "#60a5fa"],
    particleColors: ["#2563eb", "#60a5fa", "#93c5fd"],
    titlePrimaryGradient: "from-white via-white to-slate-100",
    titleSecondaryGradient: "from-white via-slate-200 to-blue-400",
    titleGlow1: "drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]",
    titleGlow2: "drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]",
    gradientText: "from-white via-slate-200 to-blue-400",
    glowClass1: "bg-blue-600/15",
    glowClass2: "bg-sky-600/10",
  },
};

interface ThemeContextType {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "electric-cyber",
  setTheme: () => {},
  config: THEMES["electric-cyber"],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>("electric-cyber");

  useEffect(() => {
    const saved = localStorage.getItem("csi_theme") as ThemeKey | null;
    if (saved && THEMES[saved]) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      setThemeState("electric-cyber");
      document.documentElement.setAttribute("data-theme", "electric-cyber");
      if (saved && !THEMES[saved]) {
        localStorage.setItem("csi_theme", "electric-cyber");
      }
    }
  }, []);

  const setTheme = useCallback((newTheme: ThemeKey) => {
    setThemeState(newTheme);
    localStorage.setItem("csi_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }, []);

  const config = THEMES[theme] || THEMES["electric-cyber"];

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    config
  }), [theme, setTheme, config]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
