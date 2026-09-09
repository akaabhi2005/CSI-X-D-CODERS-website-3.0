"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, X, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/themeContext";
import { DataStore, EventItem } from "@/lib/dataStore";

type Category = "upcoming" | "current" | "past";

const tabs: { id: Category; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "current", label: "Current / Live" },
  { id: "past", label: "Past" },
];

export default function EventsPage() {
  const { config } = useTheme();
  const [activeTab, setActiveTab] = useState<Category>("upcoming");
  const [eventsData, setEventsData] = useState<EventItem[]>(() => DataStore.getEventsSync());
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const loadData = async () => {
    const data = await DataStore.getEvents();
    if (data && data.length > 0) {
      setEventsData(data);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = DataStore.subscribeToUpdates(loadData);
    return () => unsubscribe();
  }, []);

  // Helper to parse date string for sorting (newest first)
  const parseDateForSort = (dateStr: string) => {
    // Clean strings like "22 April onwards" or "Ongoing" to just dates if possible
    let cleanStr = dateStr.replace(/onwards/i, "").replace(/Multiple Days/i, "").replace(/Ongoing/i, "").trim();
    // If it's just a month and year like "February 2024", add a day so it parses correctly
    if (/^[A-Za-z]+\s+\d{4}$/.test(cleanStr)) {
      cleanStr = `1 ${cleanStr}`;
    }
    const timestamp = new Date(cleanStr).getTime();
    return isNaN(timestamp) ? 0 : timestamp;
  };

  const filteredEvents = eventsData
    .filter(event => DataStore.getEffectiveCategory(event) === activeTab)
    .sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));
    
  const visibleEvents = filteredEvents.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeTab]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" }
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
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
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
            Flagships &amp; Bootcamps
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-sky-300 mb-6 drop-shadow-lg">
            Events &amp; Workshops
          </h1>
          <div className={cn("w-24 h-1 mx-auto rounded-full bg-gradient-to-r mb-6", config.gradientText)} />
          <p className="max-w-2xl mx-auto text-lg text-slate-300 font-light leading-relaxed">
            From intense 48-hour hackathons to deep-dive technical workshops, discover what&apos;s happening at CSI_SRMCEM X D&apos;CODERS.
          </p>
        </motion.div>
      </section>

      {/* Floating Tab Bar */}
      <div className="sticky top-24 z-20 flex justify-center mb-16 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-full border border-slate-800 shadow-2xl flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-wider",
                activeTab === tab.id
                  ? "text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid (Enlarged Card Dimensions & Premium Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setSelectedEvent(event)}
                  className="group relative bg-slate-900/70 border border-slate-800 hover:border-sky-500/50 rounded-[28px] overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-500 flex flex-col justify-between hover:shadow-[0_0_35px_rgba(56,189,248,0.25)] hover:scale-[1.01] cursor-pointer"
                >
                  <div>
                    {/* Event Image Banner */}
                    <div className="relative h-48 sm:h-56 md:h-60 w-full overflow-hidden bg-slate-950">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        loading="lazy"
                        decoding="async"
                        suppressHydrationWarning
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400";
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-5 right-5">
                        <span className={cn(
                          "px-4 py-1.5 text-xs font-mono font-bold rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg border",
                          event.category === "upcoming" ? "bg-sky-500/25 text-sky-300 border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.3)]" :
                          event.category === "current" ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/40 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                          "bg-slate-900/90 text-slate-400 border-slate-700"
                        )} suppressHydrationWarning>
                          {event.category === "upcoming" ? "✦ Upcoming" : event.category === "current" ? "● Live Now" : "Past Event"}
                        </span>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 group-hover:text-sky-300 transition-colors tracking-tight" suppressHydrationWarning>
                        {event.title}
                      </h3>
                      
                      {/* Meta Information Pills */}
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs sm:text-sm font-mono text-slate-300">
                        <div className="flex items-center px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800" suppressHydrationWarning>
                          <Calendar className="w-4 h-4 mr-2 text-sky-400 shrink-0" />
                          <span suppressHydrationWarning>{event.date}</span>
                        </div>
                        <div className="flex items-center px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800" suppressHydrationWarning>
                          <Clock className="w-4 h-4 mr-2 text-sky-400 shrink-0" />
                          <span suppressHydrationWarning>{event.time}</span>
                        </div>
                        <div className="flex items-center px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800" suppressHydrationWarning>
                          <MapPin className="w-4 h-4 mr-2 text-sky-400 shrink-0" />
                          <span suppressHydrationWarning>{event.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed font-light line-clamp-2" suppressHydrationWarning>
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 pt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold flex items-center justify-center gap-2 text-sm shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    >
                      View Details &amp; Register
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-24 bg-slate-900/40 border border-slate-800 rounded-3xl"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800 text-sky-400 mb-5 border border-slate-700">
                  <Calendar className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Events in this Category</h3>
                <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto font-light">
                  Check back soon or explore other tabs to discover upcoming and past hackathons.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Load More Pagination */}
        {filteredEvents.length > visibleCount && (
          <div className="text-center mt-16">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-10 py-4 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/50 text-white font-bold text-sm transition-all shadow-xl hover:scale-105"
            >
              Load More Events
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* EVENT DETAILS & REGISTRATION MODAL POPUP */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[150] flex items-start justify-center p-3 sm:p-5 overflow-hidden pt-12 sm:pt-14 pb-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            {/* Shifted Upwards Scrollable Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.2)] z-10 max-h-[85vh] flex flex-col"
            >
              {/* Sticky Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all cursor-pointer shadow-lg backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Header Container (Full Height & Top Aligned Banner) */}
              <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden bg-slate-950 shrink-0 border-b border-slate-800/80">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400";
                  }}
                  className="w-full h-full object-cover object-top"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent z-10 pointer-events-none" />
              </div>

              {/* Scrollable Body Content Inside Card */}
              <div className="p-5 sm:p-7 relative z-10 bg-slate-900 overflow-y-auto flex-1 custom-scrollbar">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3 tracking-tight" suppressHydrationWarning>
                  {selectedEvent.title}
                </h2>

                {/* Key Details Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center text-xs sm:text-sm text-slate-200" suppressHydrationWarning>
                    <Calendar className="w-4 h-4 mr-2.5 text-sky-400 shrink-0" />
                    <span suppressHydrationWarning>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-slate-200" suppressHydrationWarning>
                    <Clock className="w-4 h-4 mr-2.5 text-sky-400 shrink-0" />
                    <span suppressHydrationWarning>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-slate-200" suppressHydrationWarning>
                    <MapPin className="w-4 h-4 mr-2.5 text-sky-400 shrink-0" />
                    <span suppressHydrationWarning>{selectedEvent.location}</span>
                  </div>
                </div>

                {/* Full Description */}
                <div className="mb-8">
                  <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider mb-2">About Event</h4>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line" suppressHydrationWarning>
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Registration Action Area */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
                  <div className="text-slate-400 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Organized by CSI_SRMCEM X D&apos;CODERS</span>
                  </div>

                  {selectedEvent.registrationUrl && selectedEvent.registrationUrl.trim() !== "" && selectedEvent.registrationUrl !== "#" ? (
                    <a
                      href={selectedEvent.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold flex items-center justify-center gap-2 text-sm shadow-[0_0_30px_rgba(56,189,248,0.35)] transition-all hover:scale-105 cursor-pointer"
                    >
                      <span>Register Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <a
                      href={`mailto:lead.csidcoders@gmail.com?subject=Registration Inquiry for ${encodeURIComponent(selectedEvent.title)}`}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold flex items-center justify-center gap-2 text-sm shadow-[0_0_30px_rgba(56,189,248,0.35)] transition-all hover:scale-105 cursor-pointer"
                    >
                      <span>Register Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

