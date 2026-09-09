"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Search, Sparkles, Camera, Plus } from "lucide-react";
import { DataStore, GalleryItem } from "@/lib/dataStore";
import { useTheme } from "@/lib/themeContext";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState<GalleryItem[]>(() => DataStore.getGallerySync());
  const { config } = useTheme();

  const loadData = async () => {
    const data = await DataStore.getGallery();
    if (data && data.length > 0) {
      setGalleryData(data);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = DataStore.subscribeToUpdates(loadData);
    return () => unsubscribe();
  }, []);
  
  // Staggered Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-32">
      {/* Ambient Backgrounds */}
      <div className={cn("absolute top-0 left-0 w-full h-[500px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass1)} />
      <div className={cn("absolute top-1/3 right-0 w-[500px] h-[500px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass2)} />

      {/* Hero Section */}
      <section className="pt-32 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Camera className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
            Captured Moments
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-sky-300 mb-6 drop-shadow-lg">
            Our Gallery &amp; Events
          </h1>
          <div className={cn("w-24 h-1 mx-auto rounded-full bg-gradient-to-r mb-6", config.gradientText)} />
          <p className="max-w-2xl mx-auto text-lg text-slate-300 font-light leading-relaxed">
            A glimpse into the energy, passion, and innovation that drives CSI_SRMCEM X D&apos;CODERS at SRMCEM.
          </p>
        </motion.div>
      </section>

      {/* Elegant Staggered Bento Grid */}
      <section className="px-4 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[260px]"
        >
          {[...galleryData].reverse().map((item) => {
            // Layout spans for masonry / bento
            let spanClass = "col-span-1 row-span-1";
            if (item.size === "large") spanClass = "col-span-1 sm:col-span-2 md:col-span-2 row-span-1 sm:row-span-2";
            if (item.size === "wide") spanClass = "col-span-1 sm:col-span-2 row-span-1";
            if (item.size === "tall") spanClass = "col-span-1 row-span-1 sm:row-span-2";

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all duration-500 cursor-pointer ${spanClass}`}
              >
                {/* Background Image */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-700 opacity-80 group-hover:opacity-30"
                />



                {/* Restored Original Hover Details Overlay (Glassmorphism Slide-Up) */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-purple-950/85 via-slate-900/90 to-indigo-950/85 backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 z-20">
                  
                  {/* Plus Icon Accent on Top Right */}
                  <div className="absolute top-6 right-6 opacity-80 text-purple-300">
                    <Plus className="w-5 h-5 text-purple-400" />
                  </div>

                  {/* Circular Search / Inspect Icon */}
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-5 h-5 text-white" />
                  </div>

                  {/* Centered Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>

                  {/* Gradient Underline Divider */}
                  <div className={cn("w-12 h-1 mx-auto rounded-full bg-gradient-to-r mb-4 shadow-[0_0_10px_rgba(56,189,248,0.3)]", config.gradientText)} />

                  {/* Event Detail Description */}
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xs font-light">
                    {item.detail}
                  </p>
                </div>

                {/* Top Subtle Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}

