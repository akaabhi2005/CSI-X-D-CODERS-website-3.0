"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { 
  Code, Users, Cpu, Terminal, Sparkles, ChevronDown, CheckCircle2, Flame, 
  Award, Mail, ExternalLink, PenTool, Calendar, Camera, Layers, Lightbulb
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/themeContext";
import { DataStore } from "@/lib/dataStore";

const getSubTeamIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("tech") || t.includes("code") || t.includes("dev")) return Code;
  if (t.includes("design") || t.includes("media") || t.includes("ui")) return PenTool;
  if (t.includes("event") || t.includes("hack") || t.includes("manage")) return Calendar;
  if (t.includes("pr") || t.includes("outreach") || t.includes("sponsor")) return Users;
  if (t.includes("photo") || t.includes("social") || t.includes("camera")) return Camera;
  return Layers;
};

const getCoreValueIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("hack") || t.includes("talk") || t.includes("workshop")) return Terminal;
  if (t.includes("dsa") || t.includes("contest") || t.includes("algo")) return Flame;
  if (t.includes("project") || t.includes("stack") || t.includes("dev")) return Cpu;
  if (t.includes("leader") || t.includes("community") || t.includes("team")) return Users;
  return Lightbulb;
};

// --- 1. INTERNAL SUB-TEAMS (ORIGINAL 5 DOMAINS ECOSYSTEM) --- //
const subTeams = [
  {
    title: "Technical Team",
    category: "Core Engineering",
    icon: Code,
    color: "sky",
    frontDesc: "Core developers building real-world projects & scalable tools.",
    backDesc: "We focus on production engineering, algorithmic mastery, and building award-winning hackathon products across modern full-stack, Web3, and AI architectures.",
    points: ["Full-Stack & Web3 Development", "AI / ML & Cloud Infrastructure", "Open-Source Tooling & PRs"]
  },
  {
    title: "Content Team",
    category: "Writing & Strategy",
    icon: Sparkles,
    color: "blue",
    frontDesc: "Crafting engaging technical content and insightful blogs.",
    backDesc: "We bring stories to life. The Content team writes tech blogs, scripts for videos, and plans strategies to keep the community engaged with the latest tech trends.",
    points: ["Technical Blogs & Articles", "Video Scripting", "Content Strategy"]
  },
  {
    title: "Designing Team",
    category: "UI/UX & Branding",
    icon: PenTool,
    color: "purple",
    frontDesc: "The creative minds behind aesthetics, 3D graphics & UI/UX.",
    backDesc: "From Figma wireframes to sleek 3D motion graphics and brand identity, we ensure every digital asset touches a world-class standard.",
    points: ["Figma UI/UX & Prototypes", "3D Graphics & Animations", "Visual Brand Identity"]
  },
  {
    title: "PR & Marketing",
    category: "Sponsorships & Connect",
    icon: Users,
    color: "indigo",
    frontDesc: "Handling sponsorships, institutional partnerships & reach.",
    backDesc: "We are the public ambassadors of the chapter. We secure corporate sponsorships, collaborate with top tech communities, and expand alumni networks.",
    points: ["Corporate Sponsorships", "Inter-College Outreach", "Alumni Career Guidance"]
  },
  {
    title: "Photography and Social Media",
    category: "Media & Social Channels",
    icon: Camera,
    color: "cyan",
    frontDesc: "Capturing moments & managing our digital social presence.",
    backDesc: "We capture high-octane moments from our tech events, produce cinematic recaps, and manage high-engagement channels on LinkedIn, Instagram & YouTube.",
    points: ["Cinematic Event Shoots", "Social Media Campaigns", "Post-Event Video Recaps"]
  }
];

// --- 2. CORE VALUES PILLARS (4 DOMAINS) --- //
const coreValues = [
  {
    title: "Hackathons & Tech Talks",
    category: "Innovation & Build",
    icon: Terminal,
    color: "sky",
    frontDesc: "Workshops, Speaker Sessions & 48h Hackathons exploring cutting-edge technology.",
    backDesc: "We regularly organize 24-48 hour Hackathons and Tech Talks where students interact with experienced industry speakers, gain valuable real-world insights, and convert ambitious ideas into production-ready software.",
    points: ["24-48 Hour Code Sprints", "Industry Expert Speakers", "Hands-on Tech Workshops"]
  },
  {
    title: "Daily DSA & Contests",
    category: "Algorithmic Excellence",
    icon: Flame,
    color: "blue",
    frontDesc: "Daily Algorithm Practice & Live Coding Contests to sharpen problem solving under pressure.",
    backDesc: "Focusing heavily on coding excellence through Daily DSA sessions with guided explanations, discussions, and practice. Regular contests challenge students to improve their algorithmic reasoning in a healthy, competitive environment.",
    points: ["Daily Problem Practice", "Live Coding Contests", "Placement Interview Prep"]
  },
  {
    title: "Real-World Projects",
    category: "Full-Stack & Systems",
    icon: Cpu,
    color: "cyan",
    frontDesc: "Hands-on Development & Industry Stacks across Web, AI/ML, Cloud & Cybersecurity.",
    backDesc: "Collaborative software development bridging the gap between classroom theory and production engineering. Students build scalable web platforms, machine learning models, and open-source tooling with senior mentorship.",
    points: ["Production-Grade Apps", "Open-Source Collaboration", "Mentorship from Seniors"]
  },
  {
    title: "Leadership & Community",
    category: "Team & Growth",
    icon: Users,
    color: "indigo",
    frontDesc: "Teamwork, Content Creation & Growth cultivating the next generation of tech leaders.",
    backDesc: "Beyond technical learning, we promote teamwork, technical content creation, and community engagement, ensuring every member gets opportunities to lead initiatives, collaborate, and build enduring networks.",
    points: ["Peer Mentorship Network", "Technical Leadership Roles", "Alumni Career Guidance"]
  }
];

const ecosystemStyles: Record<string, {
  border: string;
  hoverBorder: string;
  frontGlow: string;
  iconBg: string;
  iconColor: string;
  backBg: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}> = {
  sky: {
    border: "border-slate-800",
    hoverBorder: "group-hover:border-sky-500/60",
    frontGlow: "group-hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    backBg: "bg-gradient-to-br from-slate-900 via-sky-950/60 to-slate-950 border-sky-500/60 shadow-[0_0_30px_rgba(56,189,248,0.3)]",
    badgeBg: "bg-sky-500/20",
    badgeText: "text-sky-300",
    badgeBorder: "border-sky-500/30",
  },
  blue: {
    border: "border-slate-800",
    hoverBorder: "group-hover:border-blue-500/60",
    frontGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    backBg: "bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-950 border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    badgeBg: "bg-blue-500/20",
    badgeText: "text-blue-300",
    badgeBorder: "border-blue-500/30",
  },
  purple: {
    border: "border-slate-800",
    hoverBorder: "group-hover:border-purple-500/60",
    frontGlow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    backBg: "bg-gradient-to-br from-slate-900 via-purple-950/60 to-slate-950 border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    badgeBg: "bg-purple-500/20",
    badgeText: "text-purple-300",
    badgeBorder: "border-purple-500/30",
  },
  cyan: {
    border: "border-slate-800",
    hoverBorder: "group-hover:border-cyan-500/60",
    frontGlow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    backBg: "bg-gradient-to-br from-slate-900 via-cyan-950/60 to-slate-950 border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    badgeBg: "bg-cyan-500/20",
    badgeText: "text-cyan-300",
    badgeBorder: "border-cyan-500/30",
  },
  indigo: {
    border: "border-slate-800",
    hoverBorder: "group-hover:border-indigo-500/60",
    frontGlow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    backBg: "bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border-indigo-500/60 shadow-[0_0_30px_rgba(99,102,241,0.3)]",
    badgeBg: "bg-indigo-500/20",
    badgeText: "text-indigo-300",
    badgeBorder: "border-indigo-500/30",
  }
};

// --- MILESTONE TIMELINE DATA --- //
const milestones = [
  {
    year: "2020",
    title: "The Genesis",
    description: "Founded independently as D'Coders Club by passionate students to discuss logic, algorithms, and build a coding circle outside college labs."
  },
  {
    year: "2021-2022",
    title: "The Mega Merger",
    description: "A major turning point. D'Coders merged with the Computer Society of India (CSI) Student Chapter to form CSI x D'Coders SRMCEM, gaining national credibility."
  },
  {
    year: "2023",
    title: "Digital Expansion",
    description: "Launched our Discord server and 'The Insight Talk' webinar series, introducing freshers to Cyber Security, SecOps, and advanced coding roadmaps."
  },
  {
    year: "2024-2025",
    title: "Cupid Code Dominance",
    description: "Expanded signature events like 'Cupid Code' on HackerRank. Members successfully represented the college in GSoC and national hackathons."
  },
  {
    year: "2026",
    title: "Modernization Drive",
    description: "Continued restructuring with a massive recruitment drive for Core Coordinators, Content Leads, and Design Leads to power the next generation of the club."
  }
];

// --- PAST CLUB HEADS (HALL OF FAME) DATA --- //
const pastHeads = [
  {
    name: "Shraddha Singh",
    role: "Lead (AIML)",
    image: "/team/shraddha.jpg.png",
    placedAt: "CSI Leadership",
    backBio: "Lead at CSI SRMCEM. Driving technical excellence in Artificial Intelligence and Machine Learning."
  },
  {
    name: "Aastha Prakash",
    role: "Chapter Lead (2024-2025)",
    image: "/team/aastha.jpg.png",
    placedAt: "Josh Technology Group",
    backBio: "Former Chapter Lead at CSI SRMCEM. Currently working as a Software Quality Analyst at Josh Technology Group."
  }
];

// --- FAQS DATA --- //
const faqs = [
  { question: "How can I join CSI_SRMCEM X D'CODERS?", answer: "We open recruitment drives at the beginning of academic semesters. Keep an eye on our events page and social media announcements for registration links!" },
  { question: "Do I need to already be an expert programmer to join?", answer: "Not at all! We provide Daily DSA guidance, beginner-friendly workshops, and hands-on mentorship from scratch. All passionate learners are welcome." },
  { question: "What are the key activities of the club?", answer: "We conduct Daily DSA sessions, competitive coding contests, 24-48 hour hackathons, expert tech talks, hands-on development workshops, and open-source project sprints." },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const { config } = useTheme();

  const [subTeamsList, setSubTeamsList] = useState(() => 
    DataStore.getSubTeamsSync().map(s => ({ ...s, icon: getSubTeamIcon(s.title) }))
  );
  const [coreValuesList, setCoreValuesList] = useState(() => 
    DataStore.getCoreValuesSync().map(c => ({ ...c, icon: getCoreValueIcon(c.title) }))
  );
  const [legacyList, setLegacyList] = useState(() => 
    DataStore.getLegacyHeadsSync().map(l => ({
      name: l.name,
      role: l.role,
      image: l.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
      placedAt: l.placedAt || "Top Tech Tier",
      backBio: l.bio
    }))
  );

  useEffect(() => {
    const loadData = async () => {
      const [storedSubTeams, storedCoreValues, storedLegacy] = await Promise.all([
        DataStore.getSubTeams(),
        DataStore.getCoreValues(),
        DataStore.getLegacyHeads()
      ]);
      if (storedSubTeams) {
        setSubTeamsList(storedSubTeams.map(s => ({
          ...s,
          icon: getSubTeamIcon(s.title)
        })));
      }
      if (storedCoreValues) {
        setCoreValuesList(storedCoreValues.map(c => ({
          ...c,
          icon: getCoreValueIcon(c.title)
        })));
      }
      if (storedLegacy) {
        setLegacyList(storedLegacy.map(l => ({
          name: l.name,
          role: l.role,
          image: l.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
          placedAt: l.placedAt || "Top Tech Tier",
          backBio: l.bio
        })));
      }
    };

    loadData();
    window.addEventListener("csi_data_updated", loadData);
    return () => window.removeEventListener("csi_data_updated", loadData);
  }, []);

  const toggleCardFlip = (key: string) => {
    setFlippedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative overflow-hidden pb-32">
      {/* Ambient Backgrounds */}
      <div className={cn("absolute top-0 left-0 w-full h-[500px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass1)} />
      <div className={cn("absolute top-1/3 right-0 w-[500px] h-[500px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass2)} />

      {/* ========================================================================= */}
      {/* 1. HERO & OUR STORY */}
      {/* ========================================================================= */}
      <section className="pt-32 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto mb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
            Our Journey &amp; Vision
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-sky-300 mb-6 drop-shadow-lg">
            About Us
          </h1>
          <div className={cn("w-24 h-1 mx-auto rounded-full bg-gradient-to-r mb-10", config.gradientText)} />

          <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-xl p-8 md:p-12 rounded-3xl text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-sky-500 to-blue-600" />
            <h2 className="text-3xl font-extrabold text-white mb-6">Our Mission &amp; Vision</h2>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-6 font-light">
              <strong className="text-white font-semibold">CSI_SRMCEM X D&apos;CODERS</strong> is a premier student tech ecosystem at SRMCEM where developers, problem-solvers, and innovators unite to learn, create, and build the future of software engineering.
            </p>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              We bridge classroom theory with industry reality by providing practical exposure through high-octane hackathons, daily algorithm mastery, interactive tech talks, and production-grade project collaborations.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR ECOSYSTEM (OFFICIAL CONTENT SECTION WITH 3D FLIP CARDS) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto relative">
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass1)} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-4 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
            The High-Performance Environment
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Our <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Ecosystem</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            A collaborative student tech ecosystem driving real-world impact across software engineering, creative design, and technical leadership.
          </p>
        </motion.div>

        {/* 5 Interactive Sub-Teams Domain Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 xl:gap-6">
          {subTeamsList.map((item, i) => {
            const style = ecosystemStyles[item.color] || ecosystemStyles.sky;
            const Icon = item.icon || Layers;
            return (
              <motion.div
                key={item.title + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => toggleCardFlip(`subteam-${i}`)}
                className="group h-[300px] [perspective:1000px] cursor-pointer"
              >
                <div className={cn(
                  "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]",
                  flippedCards[`subteam-${i}`] && "[transform:rotateY(180deg)]"
                )}>
                  
                  {/* Front Side */}
                  <div className={cn(
                    "absolute inset-0 [backface-visibility:hidden] bg-slate-900/70 border rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 backdrop-blur-xl",
                    style.border,
                    style.hoverBorder,
                    style.frontGlow
                  )}>
                    <div>
                      <div className={cn("w-12 h-12 rounded-2xl mb-4 border border-white/5 flex items-center justify-center shadow-sm", style.iconBg)}>
                        <Icon className={cn("w-6 h-6", style.iconColor)} />
                      </div>
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-2 inline-block border", style.badgeBg, style.badgeText, style.badgeBorder)}>
                        {item.category}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.frontDesc}</p>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className={cn(
                    "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border rounded-3xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300",
                    style.backBg
                  )}>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={cn("w-5 h-5", style.iconColor)} />
                        <h4 className="text-sm font-bold text-white tracking-wide">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-light mb-3">
                        {item.backDesc}
                      </p>

                      <div className="space-y-1.5">
                        {item.points.map((pt, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                            <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", style.iconColor)} />
                            <span className="line-clamp-1">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-8 h-0.5 rounded-full bg-white/20 mt-1" />
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE VALUES (THE 4 FOUNDATIONAL PILLARS) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto relative border-t border-slate-800/80">
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass2)} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-4 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
            Guiding Principles
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Core <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Values</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            The foundational pillars that guide our members towards engineering mastery, collaborative innovation, and leadership.
          </p>
        </motion.div>

        {/* 4 Interactive Core Values Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValuesList.map((item, i) => {
            const style = ecosystemStyles[item.color] || ecosystemStyles.sky;
            const Icon = item.icon || Lightbulb;
            return (
              <motion.div
                key={item.title + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => toggleCardFlip(`core-${i}`)}
                className="group h-[380px] [perspective:1000px] cursor-pointer"
              >
                <div className={cn(
                  "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]",
                  flippedCards[`core-${i}`] && "[transform:rotateY(180deg)]"
                )}>
                  
                  {/* Front Side */}
                  <div className={cn(
                    "absolute inset-0 [backface-visibility:hidden] bg-slate-900/70 border rounded-3xl p-7 flex flex-col justify-between shadow-xl transition-all duration-300 backdrop-blur-xl",
                    style.border,
                    style.hoverBorder,
                    style.frontGlow
                  )}>
                    <div>
                      <div className={cn("w-14 h-14 rounded-2xl mb-5 border border-white/5 flex items-center justify-center shadow-sm", style.iconBg)}>
                        <Icon className={cn("w-7 h-7", style.iconColor)} />
                      </div>
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-2.5 inline-block border", style.badgeBg, style.badgeText, style.badgeBorder)}>
                        {item.category}
                      </span>
                      <h3 className="text-xl font-extrabold text-white mb-2.5 tracking-tight">{item.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.frontDesc}</p>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className={cn(
                    "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border rounded-3xl p-7 flex flex-col justify-between overflow-hidden transition-all duration-300",
                    style.backBg
                  )}>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={cn("w-5 h-5", style.iconColor)} />
                        <h4 className="text-base font-bold text-white tracking-wide">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-light mb-4">
                        {item.backDesc}
                      </p>

                      <div className="space-y-2">
                        {item.points.map((pt, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                            <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", style.iconColor)} />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-8 h-0.5 rounded-full bg-white/20 mt-2" />
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MILESTONE TIMELINE (RESTORED WITH ELECTRIC BLUE & STEALTH OBSIDIAN THEME) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 md:px-16 lg:px-24 max-w-5xl mx-auto relative border-t border-slate-800/80">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-4 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            Our Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Milestone <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Timeline</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Tracking our growth, major technological triumphs, and legacy through the years.</p>
        </motion.div>

        <div className="relative border-l-2 border-slate-800 md:border-l-0 md:flex md:flex-col md:items-center">
          {/* Central Glowing Vertical Axis Line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-sky-500 via-blue-500 to-indigo-600 opacity-40 shadow-[0_0_15px_rgba(56,189,248,0.5)]" />

          {milestones.map((milestone, i) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative flex flex-col md:flex-row items-center justify-between w-full mb-14 pl-6 md:pl-0"
            >
              {/* Central Glowing Orb Node */}
              <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 w-3.5 h-3.5 rounded-full bg-sky-400 shadow-[0_0_15px_#38bdf8] border-2 border-slate-950 z-10" />

              {i % 2 === 0 ? (
                <>
                  <div className="w-full md:w-5/12 text-left md:text-right md:pr-12 bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-xl hover:border-sky-500/50 transition-colors">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 font-mono">{milestone.year}</span>
                    <h3 className="text-xl font-bold text-white mt-2 mb-2">{milestone.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                  <div className="hidden md:block w-5/12" />
                </>
              ) : (
                <>
                  <div className="hidden md:block w-5/12" />
                  <div className="w-full md:w-5/12 text-left md:pl-12 bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-xl hover:border-blue-500/50 transition-colors">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-mono">{milestone.year}</span>
                    <h3 className="text-xl font-bold text-white mt-2 mb-2">{milestone.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FACULTY COORDINATORS — "OUR GUIDING FORCE" (HOVER GLASSMORPHISM GRID) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-4 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            Visionary Mentorship
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Faculty <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Coordinators</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Guiding CSI_SRMCEM X D&apos;CODERS towards technical excellence, innovation, and leadership.
          </p>
        </motion.div>

        {/* 2-Column Responsive Hover Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Coordinator 1: Dr. Pankaj Kumar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(56,189,248,0.25)] transition-all duration-500 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-[50px] group-hover:bg-sky-500/20 transition-all pointer-events-none" />

            <div>
              {/* Header Badge & Avatar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.2)] shrink-0 bg-slate-950 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/team/pankajkumar.jpg.jpeg"
                    alt="Dr. Pankaj Kumar"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center sm:text-left flex-1">
                  <span className="px-3 py-1 bg-sky-500/15 text-sky-300 text-xs font-mono font-bold rounded-full uppercase tracking-wider mb-2.5 inline-block border border-sky-500/30">
                    CSI Faculty Coordinator
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5 tracking-tight group-hover:text-sky-300 transition-colors">
                    Dr. Pankaj Kumar
                  </h3>
                  <p className="text-sm font-semibold text-slate-300">
                    Head of Department (HOD)
                  </p>
                  <p className="text-xs text-sky-400 font-mono mt-0.5">
                    Computer Science &amp; Engineering (CSE)
                  </p>
                </div>
              </div>

              {/* Bio & Guidance */}
              <p className="text-slate-300 text-sm leading-relaxed font-light mb-8">
                &ldquo;Guiding students to bridge technical excellence with real-world innovation, driving industry-leading achievements and 100% placement readiness.&rdquo;
              </p>
            </div>

            {/* Action Area */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">SRMCEM, Lucknow</span>
              <a 
                href="https://www.linkedin.com/in/dr-pankaj-kumar-47950476/" 
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/40 text-slate-200 hover:text-white transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-sm group/btn"
              >
                <FaLinkedin className="w-4 h-4 text-sky-400 group-hover/btn:scale-110 transition-transform" />
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </motion.div>

          {/* Coordinator 2: Er. Saurabh Bahadur Bais */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group relative bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] transition-all duration-500 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-all pointer-events-none" />

            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)] shrink-0 bg-slate-950 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/team/saurabh.jpg.png"
                    alt="Er. Saurabh Bahadur Bais"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Saurabh+Bahadur+Bais&background=0f172a&color=38bdf8&bold=true";
                    }}
                  />
                </div>

                <div className="text-center sm:text-left flex-1">
                  <span className="px-3 py-1 bg-blue-500/15 text-blue-300 text-xs font-mono font-bold rounded-full uppercase tracking-wider mb-2.5 inline-block border border-blue-500/30">
                    D&apos;CODERS Faculty Coordinator
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5 tracking-tight group-hover:text-blue-300 transition-colors">
                    Saurabh Bahadur Bais
                  </h3>
                  <p className="text-sm font-semibold text-slate-300">
                    Assistant Professor
                  </p>
                  <p className="text-xs text-blue-400 font-mono mt-0.5">
                    Computer Science &amp; Engineering (CSE)
                  </p>
                </div>
              </div>

              {/* Bio & Guidance */}
              <p className="text-slate-300 text-sm leading-relaxed font-light mb-8">
                &ldquo;Fostering hands-on development, competitive programming, and problem-solving mindsets to empower the next generation of software engineers.&rdquo;
              </p>
            </div>

            {/* Action Area */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">SRMCEM, Lucknow</span>
              <a 
                href="https://www.linkedin.com/in/saurabhbahadur/" 
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-200 hover:text-white transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-sm group/btn"
              >
                <FaLinkedin className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PAST CLUB HEADS — "HALL OF FAME" (3D FLIP CARDS RESTORED) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto relative border-t border-slate-800/80">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-4 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            Alumni Legacy
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Hall of <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Fame</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">The visionaries and student leaders who led CSI_SRMCEM X D&apos;CODERS to historic heights.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-8 justify-center">
          {legacyList.map((head, i) => (
            <motion.div
              key={head.name + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => toggleCardFlip(`head-${i}`)}
              className="group h-[360px] w-full max-w-[320px] mx-auto [perspective:1000px] cursor-pointer"
            >
              <div className={cn(
                "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]",
                flippedCards[`head-${i}`] && "[transform:rotateY(180deg)]"
              )}>

                {/* Front Side */}
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 group-hover:border-sky-500/50 shadow-xl transition-all duration-300">
                  <img
                    src={head.image}
                    alt={head.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                    <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider mb-2 inline-block">
                      {head.role}
                    </span>
                    <h3 className="text-xl font-bold text-white">{head.name}</h3>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/70 border border-sky-500/50 rounded-3xl p-6 flex flex-col justify-between text-center shadow-[0_0_25px_rgba(56,189,248,0.25)] backdrop-blur-xl">
                  <div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
                      Successfully Placed
                    </span>
                    <h3 className="text-2xl font-extrabold text-white mb-1 tracking-tight">{head.placedAt}</h3>
                    <p className="text-xs text-sky-400 font-mono mb-4">{head.role}</p>
                    <div className="w-12 h-[1px] bg-sky-500/40 mx-auto mb-4" />
                    <p className="text-slate-300 text-xs leading-relaxed font-light">{head.backBio}</p>
                  </div>

                  <div className="w-8 h-0.5 rounded-full bg-white/20 mx-auto" />
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 md:px-16 lg:px-24 max-w-3xl mx-auto border-t border-slate-800/80">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-4">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Frequently Asked <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden backdrop-blur-xl transition-colors duration-200 hover:border-slate-700 shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-bold text-base focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={cn("w-5 h-5 text-sky-400 transition-transform duration-300 shrink-0 ml-4", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed border-t border-slate-800/80 pt-4 font-light">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

