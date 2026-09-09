"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, FileText, Sparkles, Layers, CheckCircle2, Search, 
  Mail, Send, BookOpen, ZoomIn, ZoomOut, RotateCcw, BellRing 
} from "lucide-react";
import { useTheme } from "@/lib/themeContext";
import { cn } from "@/lib/utils";
import { DataStore, NewsIssueItem } from "@/lib/dataStore";

export default function NewsPage() {
  const { config } = useTheme();
  const [issues, setIssues] = useState<NewsIssueItem[]>(() => DataStore.getNewsIssuesSync());
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 15, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoom(100);

  const loadData = async () => {
    const data = await DataStore.getNewsIssues();
    if (data && data.length > 0) {
      setIssues(data);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = DataStore.subscribeToUpdates(loadData);
    return () => unsubscribe();
  }, []);

  const currentEdition = issues.find(i => i.isCurrent) || issues[0] || {
    id: "default",
    volume: "Vol. 01",
    month: "Current",
    year: "2024",
    title: "CSI_SRMCEM X D'CODERS Monthly Gazette",
    description: "Welcome to the official monthly gazette of CSI_SRMCEM X D'CODERS.",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=1000",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "5.0 MB",
    pageCount: 16,
    topics: ["Technology", "Workshops", "Hackathons"],
    isCurrent: true
  };

  const pastIssues = issues.filter(i => i.id !== currentEdition.id);

  const filteredPastIssues = pastIssues.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.year.includes(searchQuery) ||
    issue.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await DataStore.addSubscriber(email);
    setIsSubscribed(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">
      {/* Ambient Background Glows */}
      <div className={cn("absolute top-0 left-0 w-full h-[500px] blur-[80px] md:blur-[160px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass1)} />
      <div className={cn("absolute top-1/3 right-0 w-[500px] h-[500px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass2)} />

      {/* 1. Hero Header */}
      <section className="pt-32 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
            Official Publications &amp; Monthly Gazette
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-sky-300 mb-6 drop-shadow-lg">
            News &amp; Gazette
          </h1>
          <div className={cn("w-24 h-1 mx-auto rounded-full bg-gradient-to-r mb-6", config.gradientText)} />
          <p className="max-w-2xl mx-auto text-lg text-slate-300 font-light leading-relaxed">
            Read our latest monthly technical publications directly in your browser, or download previous editions from our archive library.
          </p>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CURRENT MONTH'S ISSUE — DIRECT EMBEDDED PDF READER FRAME */}
      {/* ========================================================================= */}
      <section className="px-4 md:px-16 lg:px-24 max-w-7xl mx-auto mb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-[2.5rem] bg-slate-900/60 border border-slate-800 backdrop-blur-2xl shadow-2xl p-6 md:p-10 relative overflow-hidden"
        >
          {/* Top Metadata & Action Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 mb-8 border-b border-slate-800/80">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  Current Live Issue
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-300 bg-slate-800/60 border border-slate-700">
                  {currentEdition.month} {currentEdition.year} // {currentEdition.volume}
                </span>
                <span className="text-xs text-slate-400">
                  • {currentEdition.pageCount} Pages • {currentEdition.fileSize}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                {currentEdition.title}
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light mb-4">
                {currentEdition.description}
              </p>
              {/* Topic Badges */}
              <div className="flex flex-wrap gap-2">
                {currentEdition.topics.map((topic, i) => (
                  <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
              <a
                href={currentEdition.pdfUrl}
                download={`CSI_SRMCEM_DCODERS_News_${currentEdition.month}_${currentEdition.year}.pdf`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Custom Sleek In-Browser Reader */}
          <div className="w-full rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-950 shadow-2xl flex flex-col">
            {/* Custom Reader Top Control Bar */}
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-mono font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  {currentEdition.title}.pdf
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono hidden md:inline">
                  Interactive Reader
                </span>
              </div>

              {/* Minimal Clean Zoom Operations (No Fullscreen, No Browser Clutter) */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner">
                {/* Zoom Out Button (-) */}
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out (-)"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                {/* Current Zoom Percentage Badge (Click to reset to 100%) */}
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Click to reset zoom (100%)"
                  className="px-2.5 py-1 text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  {zoom}%
                </button>

                {/* Zoom In Button (+) */}
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In (+)"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-4 bg-slate-800 mx-1" />

                {/* Reset Zoom to default */}
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Fit to Default"
                  className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-sky-300 flex items-center justify-center transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Direct Hardware-Accelerated Native Smooth Scrolling Display Frame */}
            <div className="relative w-full h-[680px] md:h-[840px] bg-slate-950">
              <iframe
                key={`pdf-frame-${zoom}`}
                src={`${currentEdition.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=${zoom}`}
                title={currentEdition.title}
                className="w-full h-full border-0 rounded-b-2xl bg-white"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PAST ISSUES ARCHIVE (DOWNLOAD ONLY) */}
      {/* ========================================================================= */}
      <section className="px-4 md:px-16 lg:px-24 max-w-7xl mx-auto mb-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-block mb-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Archive Library
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Past <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Issues</span>
            </h2>
            <p className="text-slate-400 text-base mt-2 max-w-xl">
              Missed an edition? Download any of our past monthly publications directly below.
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, month or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500 transition-all backdrop-blur-xl"
            />
          </div>
        </div>

        {/* Past Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPastIssues.length > 0 ? (
            filteredPastIssues.map((issue, idx) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden hover:shadow-[0_0_30px_rgba(56,189,248,0.18)]"
              >
                {/* Cover Image & Volume Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={issue.coverImage}
                    alt={issue.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Month & Vol Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-950/90 text-sky-300 border border-sky-500/30 backdrop-blur-md shadow-md">
                      {issue.month} {issue.year}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-black/60 text-slate-400 border border-white/10 backdrop-blur-md">
                      {issue.volume}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-4 text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-white/10">
                    {issue.fileSize}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-sky-300 transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                      {issue.description}
                    </p>

                    {/* Topics Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {issue.topics.map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Download Only Button */}
                  <a
                    href={issue.pdfUrl}
                    download={`CSI_SRMCEM_DCODERS_News_${issue.month}_${issue.year}.pdf`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-200 text-xs font-bold rounded-xl transition-all duration-300 border border-slate-700/60 hover:border-sky-400 shadow-md group/btn"
                  >
                    <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                    <span>Download PDF Issue</span>
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-slate-900/30 rounded-3xl border border-slate-800">
              <BookOpen className="w-10 h-10 mx-auto text-slate-500 mb-3" />
              <p className="text-base">No past issues match your search query.</p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. NOTIFICATION SUBSCRIPTION CARD (WITH 3D FLOATING ANIMATIONS) */}
      {/* ========================================================================= */}
      <section className="px-4 md:px-16 lg:px-24 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl p-8 md:p-12 lg:p-14 overflow-hidden group hover:border-sky-500/40 transition-all"
        >
          {/* Ambient Glows Inside Card */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/15 rounded-full blur-[60px] md:blur-[100px] opacity-60 md:opacity-100 pointer-events-none -z-10" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[60px] md:blur-[100px] opacity-60 md:opacity-100 pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Content & Input */}
            <div className="lg:col-span-7 text-left">
              <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 mb-4 inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Exclusive Updates
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                Stay Ahead of <br className="hidden sm:inline" />
                <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>the Tech Curve.</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-light">
                Join 1,000+ students and developers who receive our weekly insights, hackathon alerts, Daily DSA digests, and exclusive workshop invitations directly in their inbox.
              </p>

              {isSubscribed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-6 py-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-400 font-semibold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>You&apos;re subscribed to all official CSI_SRMCEM X D&apos;CODERS updates!</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 max-w-md">
                  <div className="relative w-full">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter college email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500 shadow-inner font-mono transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:scale-105 flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: 3D Floating Interactive Animated Elements */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[300px] sm:min-h-[340px]">
              
              {/* Central Ambient Pulse Orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-sky-500/25 rounded-full blur-[70px] pointer-events-none" />

              {/* Main Floating 3D Glowing Mail Box */}
              <motion.div 
                animate={{ 
                  y: [0, -16, 0],
                  rotate: [-4, -1, -4]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative z-20 bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-950 border border-slate-700/80 p-8 sm:p-10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl group-hover:border-sky-500/50 group-hover:shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/15 to-blue-500/15 rounded-3xl" />
                <Mail className="w-24 h-24 sm:w-28 sm:h-28 text-sky-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]" />
              </motion.div>

              {/* Floating Top-Right Notification Bell Badge */}
              <motion.div 
                animate={{ 
                  y: [0, -14, 0],
                  rotate: [10, 16, 10]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  delay: 1, 
                  ease: "easeInOut" 
                }}
                className="absolute top-4 right-4 sm:right-8 z-30 bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-xl backdrop-blur-xl group-hover:border-amber-500/40"
              >
                <BellRing className="w-6 h-6 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
              </motion.div>

              {/* Floating Bottom-Left Star / Sparkle Badge */}
              <motion.div 
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [-12, -6, -12]
                }}
                transition={{ 
                  duration: 6.5, 
                  repeat: Infinity, 
                  delay: 2, 
                  ease: "easeInOut" 
                }}
                className="absolute bottom-4 left-4 sm:left-8 z-30 bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-xl backdrop-blur-xl group-hover:border-sky-500/40"
              >
                <Sparkles className="w-6 h-6 text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
              </motion.div>

              {/* Floating Ambient Glowing Particles */}
              <motion.div 
                animate={{ y: [0, -25, 0], opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 bg-sky-400 w-2.5 h-2.5 rounded-full blur-[1px] shadow-[0_0_8px_#38bdf8]"
              />
              <motion.div 
                animate={{ y: [0, -35, 0], opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 5.5, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 bg-blue-500 w-3 h-3 rounded-full blur-[1px] shadow-[0_0_10px_#3b82f6]"
              />

            </div>

          </div>
        </motion.div>
      </section>
    </div>
  );
}

