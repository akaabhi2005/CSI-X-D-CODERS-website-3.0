"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useTheme } from "@/lib/themeContext";
import { DataStore, EventItem } from "@/lib/dataStore";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "News", href: "/news" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const pathname = usePathname();
  const { config } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  const loadNavbarEvents = async () => {
    try {
      const allEvents = await DataStore.getEvents();
      const featured = allEvents.filter(e => e.isFeatured || e.category === "upcoming" || e.category === "current");
      setFeaturedEvents(featured.length > 0 ? featured.slice(0, 2) : allEvents.slice(0, 2));
    } catch (err) {
      console.error("Error loading navbar events:", err);
    }
  };

  useEffect(() => {
    loadNavbarEvents();
    const unsubscribe = DataStore.subscribeToUpdates(loadNavbarEvents);
    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-[110] px-4 sm:px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/10 transition-colors duration-300">
        
        {/* Top Left: 3 Logos (CSI - SRMCEM - D'CODERS) with no text */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 z-50 group">
          {/* 1. CSI Logo */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-sky-500/20 blur-sm group-hover:bg-sky-500/40 transition-colors" />
            <Image 
              src="/csi-logo.png" 
              alt="CSI Logo" 
              width={40}
              height={40}
              priority
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full relative drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] bg-slate-950/40 p-0.5 border border-white/10 group-hover:border-sky-400/50 transition-all"
            />
          </div>

          {/* 2. SRMCEM Logo */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-blue-500/20 blur-sm group-hover:bg-blue-500/40 transition-colors" />
            <Image 
              src="/srmcem-logo.png" 
              alt="SRMCEM Logo" 
              width={40}
              height={40}
              priority
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full relative drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] bg-slate-950/40 p-0.5 border border-white/10 group-hover:border-blue-400/50 transition-all"
            />
          </div>

          {/* 3. D'CODERS Logo */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-cyan-500/20 blur-sm group-hover:bg-cyan-500/40 transition-colors" />
            <Image 
              src="/decoders-logo.png" 
              alt="D'CODERS Logo" 
              width={40}
              height={40}
              priority
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full relative drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] bg-slate-950/40 p-0.5 border border-white/10 group-hover:border-cyan-400/50 transition-all"
            />
          </div>
        </Link>

        {/* Top Middle: CSI_SRMCEM X D'CODERS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 hidden lg:block pointer-events-none">
          <h1 className={cn(
            "text-lg md:text-xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text drop-shadow-lg bg-gradient-to-r whitespace-nowrap",
            config.gradientText
          )}>
            CSI_SRMCEM X D&apos;CODERS
          </h1>
        </div>
        
        {/* Top Right: Theme Switcher + Hamburger Menu */}
        <div className="flex items-center gap-3 z-50">
          <ThemeSwitcher />

          <button 
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="w-11 h-11 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-sky-500/40 rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Fancy Animated Full-Width Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%", transition: { delay: 0.2, duration: 0.4 } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl overflow-y-auto overflow-x-hidden pt-24 sm:pt-28 pb-12 px-4 sm:px-6 flex flex-col justify-start md:justify-center items-center min-h-screen"
          >
            {/* Decorative Background Elements */}
            <div className={cn("absolute top-1/4 left-1/4 w-96 h-96 blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 rounded-full pointer-events-none", config.glowClass1)} />
            <div className={cn("absolute bottom-1/4 right-1/4 w-96 h-96 blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 rounded-full pointer-events-none", config.glowClass2)} />

            <div className="w-full max-w-4xl mx-auto my-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
              
              {/* Left Side: Large Links */}
              <div className="flex flex-col space-y-1.5 sm:space-y-3">
                {links.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl transition-all duration-300 hover:bg-white/5"
                      >
                        <span className={cn(
                          "text-2xl sm:text-3xl md:text-5xl font-black tracking-tight transition-all duration-300",
                          isActive ? cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText) : "text-slate-400 group-hover:text-white"
                        )}>
                          {link.name}
                        </span>
                        <ChevronRight className={cn(
                          "w-5 h-5 sm:w-7 sm:h-7 transition-all duration-300 opacity-0 -translate-x-4",
                          isActive ? "opacity-100 translate-x-0 text-sky-400" : "group-hover:opacity-100 group-hover:translate-x-0 text-slate-300"
                        )} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Side: Dynamic Featured Cards inside Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="hidden md:flex flex-col justify-center space-y-4 max-w-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold text-lg">Featured Highlights</span>
                  <Link href="/events" onClick={() => setIsOpen(false)} className="text-xs text-sky-400 hover:underline">
                    View All &rarr;
                  </Link>
                </div>
                
                {featuredEvents.length > 0 ? (
                  featuredEvents.map((event) => (
                    <Link 
                      key={event.id}
                      href="/events" 
                      onClick={() => setIsOpen(false)} 
                      className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl relative overflow-hidden group cursor-pointer hover:border-sky-500/50 transition-all duration-300 block"
                    >
                      <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={cn(
                          "px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider border",
                          event.category === "upcoming" ? "bg-sky-500/20 text-sky-400 border-sky-500/30" :
                          event.category === "current" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                          "bg-slate-800 text-slate-400 border-slate-700"
                        )}>
                          {event.category === "upcoming" ? "Upcoming" : event.category === "current" ? "Live Now" : "Past Event"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{event.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-1 group-hover:text-sky-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-slate-400 text-xs mb-2 line-clamp-2 leading-relaxed">
                        {event.description || `${event.title} organized by CSI x D'CODERS.`}
                      </p>
                      <span className="text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors flex items-center gap-1">
                        Explore Details &rarr;
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-slate-800 rounded-xl">
                    No featured events available right now.
                  </div>
                )}

              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

