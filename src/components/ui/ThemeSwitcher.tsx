"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Sparkles } from "lucide-react";
import { useTheme, THEMES, ThemeKey } from "@/lib/themeContext";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, config } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative z-50", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change Color Theme"
        className="flex items-center gap-2.5 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-sky-500/40 rounded-full text-white text-xs font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.15)] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] group"
      >
        <div className="relative flex items-center justify-center">
          <Palette className="w-4 h-4 text-sky-400 group-hover:rotate-45 transition-transform duration-300" />
        </div>
        <span className="hidden sm:inline-block font-medium tracking-wide text-slate-200">
          {config.name}
        </span>
        {/* Color Swatch Dots */}
        <div className="flex items-center -space-x-1">
          {config.swatchColors.map((col, idx) => (
            <span
              key={idx}
              className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-sm"
              style={{ backgroundColor: col }}
            />
          ))}
        </div>
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-72 sm:w-80 p-3 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 mb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Blue + Black Themes
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">2 Palettes</span>
            </div>

            {/* Theme List */}
            <div className="space-y-1.5">
              {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
                const item = THEMES[key];
                const isActive = theme === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all duration-200 group border",
                      isActive
                        ? "bg-slate-900/90 border-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                        : "bg-slate-900/30 border-transparent hover:bg-slate-900/60 hover:border-slate-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Swatch Pill */}
                      <div className="flex flex-col gap-0.5 p-1 rounded-lg bg-black/40 border border-white/5">
                        <div className="flex items-center gap-1">
                          {item.swatchColors.map((col, idx) => (
                            <span
                              key={idx}
                              className="w-2.5 h-2.5 rounded-full border border-black/50"
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Text details */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "text-xs font-bold tracking-tight transition-colors",
                              isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                            )}
                          >
                            {item.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {item.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Checkmark indicator */}
                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
