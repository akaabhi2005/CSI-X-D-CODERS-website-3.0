"use client";

import { useState, useEffect } from "react";
import { 
  ArrowRight, Code, Cpu, Globe, Sparkles, Flame, Users, CheckCircle2, ExternalLink 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/themeContext";
import { cn } from "@/lib/utils";
import { HeroLogo } from "@/components/ui/HeroLogo";
import { DataStore, ClubStats, EventItem } from "@/lib/dataStore";

export default function Home() {
  const { config } = useTheme();
  const [stats, setStats] = useState<ClubStats>(() => DataStore.getStatsSync());
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>(() => {
    const events = DataStore.getEventsSync();
    const featured = events.filter(e => e.isFeatured || DataStore.getEffectiveCategory(e) === "upcoming" || DataStore.getEffectiveCategory(e) === "current");
    return featured;
  });
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (key: string) => {
    setFlippedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const loadData = async () => {
    const [statsData, eventsData] = await Promise.all([
      DataStore.getStats(),
      DataStore.getEvents()
    ]);
    if (statsData) setStats(statsData);
    if (eventsData && eventsData.length > 0) {
      const featured = eventsData.filter(e => e.isFeatured || DataStore.getEffectiveCategory(e) === "upcoming" || DataStore.getEffectiveCategory(e) === "current");
      setFeaturedEvents(featured.length > 0 ? featured : (eventsData.length > 0 ? [eventsData[0]] : []));
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = DataStore.subscribeToUpdates(loadData);
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative overflow-x-clip transition-colors duration-300">
      {/* Background ambient glows */}
      <div className={cn("absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none transition-colors duration-500", config.glowClass1)} />
      <div className={cn("absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none transition-colors duration-500", config.glowClass2)} />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="min-h-[85vh] lg:min-h-[90vh] flex items-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 relative z-10 pt-20 sm:pt-24 lg:pt-16 pb-12">
        <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Side: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-left w-full"
          >
            <div className="inline-block mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-300 bg-sky-500/10 rounded-full border border-sky-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                SRMCEM&apos;s Premier Tech Club
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold tracking-tighter mb-4 sm:mb-5 leading-none">
              <span className={cn(
                "block text-transparent bg-clip-text bg-gradient-to-r",
                config.titlePrimaryGradient,
                config.titleGlow1
              )}>
                CSI_SRMCEM
              </span>
              <span className={cn(
                "block text-transparent bg-clip-text bg-gradient-to-r mt-1 sm:mt-2",
                config.titleSecondaryGradient,
                config.titleGlow2
              )}>
                X D&apos;CODERS
              </span>
            </h1>
            
            <p className="max-w-xl text-base sm:text-lg md:text-xl text-slate-300 mb-8 leading-relaxed font-normal">
              Empowering students through technology, innovation, and collaboration. We are building the future of engineering.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/events"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full hover:scale-105 shadow-[0_0_25px_rgba(56,189,248,0.35)] overflow-hidden"
              >
                Explore Events
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3.5 font-semibold text-slate-300 hover:text-white transition-all duration-300 bg-white/5 border border-white/10 hover:border-sky-500/30 rounded-full hover:bg-white/10"
              >
                About Us
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Orbital Quantum Rings Animated Logo */}
          <div className="flex-1 flex justify-center items-center relative w-full shrink-0">
            <HeroLogo />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHAT WE DO SECTION (ORIGINAL 3 FLIP CARDS RESTORED PER REFERENCE) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 md:px-16 lg:px-24 relative overflow-hidden border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              What We Do
            </h2>
            <div className={cn("w-24 h-1 mx-auto rounded-full bg-gradient-to-r", config.gradientText)} />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Hackathons */}
            <div 
              onClick={() => toggleCardFlip('hackathons')}
              className="group h-84 [perspective:1000px] cursor-pointer"
            >
              <div className={cn(
                "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105",
                flippedCards['hackathons'] && "[transform:rotateY(180deg)] scale-105"
              )}>
                {/* Front Side */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-start justify-center backdrop-blur-xl shadow-xl group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all">
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6 inline-block text-purple-400">
                    <Code className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Hackathons</h3>
                  <ul className="text-slate-300 text-sm space-y-2.5">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> 24-48 hour coding marathons
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Creative problem solving
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Industry expert mentorship
                    </li>
                  </ul>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950/90 border border-purple-500/50 rounded-3xl p-8 flex flex-col items-start justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider mb-3 border border-purple-500/30">
                    Competitions
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">Build &amp; Win</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Our hackathons bring together top engineering talent to solve real-world industry problems. Winners receive exclusive placement referrals, cash grants, and verified certificates.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Workshops */}
            <div 
              onClick={() => toggleCardFlip('workshops')}
              className="group h-84 [perspective:1000px] cursor-pointer"
            >
              <div className={cn(
                "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105",
                flippedCards['workshops'] && "[transform:rotateY(180deg)] scale-105"
              )}>
                {/* Front Side */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-start justify-center backdrop-blur-xl shadow-xl group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 inline-block text-blue-400">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Workshops</h3>
                  <ul className="text-slate-300 text-sm space-y-2.5">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Hands-on technical sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> AI/ML &amp; Web3 focused
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Live project building
                    </li>
                  </ul>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-950/90 border border-blue-500/50 rounded-3xl p-8 flex flex-col items-start justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider mb-3 border border-blue-500/30">
                    Masterclasses
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">Industry Ready</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Gain practical skills that are directly applied in modern tech companies. We cover production full-stack systems, cloud architectures, and machine learning pipelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Open Source */}
            <div 
              onClick={() => toggleCardFlip('opensource')}
              className="group h-84 [perspective:1000px] cursor-pointer"
            >
              <div className={cn(
                "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105",
                flippedCards['opensource'] && "[transform:rotateY(180deg)] scale-105"
              )}>
                {/* Front Side */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-start justify-center backdrop-blur-xl shadow-xl group-hover:border-orange-500/50 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all">
                  <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6 inline-block text-orange-400">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Open Source</h3>
                  <ul className="text-slate-300 text-sm space-y-2.5">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> GitHub contributions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Community driven tools
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Code reviews &amp; PRs
                    </li>
                  </ul>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-orange-950/80 via-slate-900 to-slate-950/90 border border-orange-500/50 rounded-3xl p-8 flex flex-col items-start justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider mb-3 border border-orange-500/30">
                    Collaboration
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">Global Impact</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Collaborate on open-source repositories and internal community tooling. Learn Git workflows, collaborative pull requests, and real codebase reviews.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CLUB STATS SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-sky-950/30 via-slate-900/50 to-blue-950/30 border border-slate-800 rounded-3xl p-12 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-300 mb-2" suppressHydrationWarning>
                {stats.placementRate}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Placement Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-300 mb-2" suppressHydrationWarning>
                {stats.eventsHosted}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-300 mb-2" suppressHydrationWarning>
                {stats.activeMembers}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Active Members</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-300 mb-2" suppressHydrationWarning>
                {stats.liveProjects}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Live Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY JOIN CSI_SRMCEM X D'CODERS & UNMATCHED PLACEMENT SUCCESS */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 md:px-16 lg:px-24 relative overflow-hidden border-t border-slate-800/80">
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] blur-[80px] md:blur-[140px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass1)} />
        
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-16 p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 backdrop-blur-md shadow-none">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Where Code Meets Innovation
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
              Why Join <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Us?</span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-4 font-light">
              CSI_SRMCEM X D&apos;CODERS is more than a college club—it&apos;s a high-performance tech ecosystem built for developers, problem-solvers, and innovators. We create an environment where curiosity evolves into expertise through hands-on development, competitive coding, hackathons, technical workshops, and collaborative innovation.
            </p>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              Whether you&apos;re writing your first line of code or shipping your next project, you&apos;ll be surrounded by a community that pushes you to build faster, think deeper, and grow stronger.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900/90 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Code. Build. Deploy.</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Work on real-world projects with practical, hands-on development experience.
                </p>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/90 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Competitive Edge</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Master DSA, coding contests, and hackathons that sharpen problem-solving under pressure.
                </p>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Tech-First Culture</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Explore AI, Web Development, Cybersecurity, Cloud, and emerging technologies.
                </p>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Network &amp; Lead</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Collaborate with mentors, seniors, and passionate developers while building leadership and teamwork.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ORIGINAL 2-COLUMN PLACEMENT SECTION WITH EXACT GRADIENT BORDER & ORB EFFECTS */}
          {/* ========================================================================= */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-16 pt-4">
            <div className="flex-1 text-left">
              <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 mb-4 inline-block shadow-sm">
                Member Advantages
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                Accelerate Your Tech Career
              </h3>
              <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed font-light">
                Being a part of the <strong className="text-white font-medium">CSI_SRMCEM X D&apos;CODERS</strong> chapter at SRMCEM opens doors to unparalleled technical growth, verified hands-on projects, and direct industry networking.
              </p>
              <ul className="space-y-4 mb-4">
                <li className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 font-bold">✓</div>
                  <span className="text-slate-200 text-sm md:text-base">Access to exclusive research papers and technical publications.</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 font-bold">✓</div>
                  <span className="text-slate-200 text-sm md:text-base">Global networking with IT professionals and industry leaders.</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 font-bold">✓</div>
                  <span className="text-slate-200 text-sm md:text-base">Subsidized rates for national tech events and certifications.</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold">✓</div>
                  <span className="text-slate-200 text-sm md:text-base">Daily DSA interview preparation and tier-1 company referrals.</span>
                </li>
              </ul>
            </div>
            
            {/* The Original Rainbow Gradient Border Card with Inner Glow Effect */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <div className="relative p-1 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 shadow-[0_0_50px_rgba(139,92,246,0.35)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-shadow duration-500">
                <div className="bg-slate-950 rounded-[22px] p-10 md:p-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/25 blur-[60px] rounded-full pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/25 blur-[60px] rounded-full pointer-events-none" />
                  
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-300 mb-2">
                    Verified Club Milestone
                  </span>
                  <h3 className="text-2xl text-slate-200 font-semibold mb-2">Unmatched Success</h3>
                  <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 mb-4 drop-shadow-lg">
                    {stats.placementRate}
                  </div>
                  <div className="text-2xl text-white font-bold tracking-wider uppercase mb-4">
                    Placement Record
                  </div>
                  <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                    Every active CSI member at SRMCEM has successfully secured top-tier placements in the tech industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED EVENT BANNER */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 5. DYNAMIC FEATURED HIGHLIGHTS SECTION (MANAGED FROM ADMIN PANEL) */}
      {/* ========================================================================= */}
      {featuredEvents.length > 0 && (
        <section className="py-24 px-4 md:px-16 lg:px-24 relative overflow-hidden border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 mb-3 inline-block shadow-sm">
                  Live &amp; Flagship Programs
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                  Featured Highlights
                </h2>
              </div>
              <Link
                href="/events"
                className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline shrink-0"
              >
                <span>View All Events ({featuredEvents.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group relative bg-slate-900/80 border border-slate-800/90 hover:border-sky-500/50 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 shadow-2xl flex flex-col justify-between hover:shadow-[0_0_35px_rgba(56,189,248,0.2)] hover:scale-[1.01]"
                >
                  <div className="space-y-4">
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "px-3 py-1 text-[11px] font-mono font-bold rounded-full uppercase tracking-wider border backdrop-blur-md",
                        event.category === "upcoming" ? "bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]" :
                        event.category === "current" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse" :
                        "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      )}>
                        {event.category === "upcoming" ? "UPCOMING" : event.category === "current" ? "LIVE NOW" : "WORKSHOP / FLAGSHIP"}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{event.date}</span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-sky-300 transition-colors tracking-tight mb-2">
                        {event.title}
                      </h3>
                      <p className="text-slate-300 text-sm font-light leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 justify-between">
                    {event.registrationUrl && event.registrationUrl.trim() !== "" && event.registrationUrl !== "#" ? (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold flex items-center gap-2 text-xs shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:scale-105 cursor-pointer"
                      >
                        <span>Register Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <a
                        href={`mailto:lead.csidcoders@gmail.com?subject=Registration Inquiry for ${encodeURIComponent(event.title)}`}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold flex items-center gap-2 text-xs shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:scale-105 cursor-pointer"
                      >
                        <span>Register Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <Link
                      href="/events"
                      className="text-xs font-mono font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}

