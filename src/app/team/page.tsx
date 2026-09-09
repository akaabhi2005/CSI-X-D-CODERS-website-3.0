"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { Sparkles, Mail } from "lucide-react";
import { useTheme } from "@/lib/themeContext";
import { cn } from "@/lib/utils";
import { DataStore, TeamMemberItem } from "@/lib/dataStore";

type OpenDirection = "left" | "right" | "bottom";

const HackerText = React.memo(({ text = "", className }: { text?: string; className?: string }) => {
  const safeText = text || "";
  const [displayText, setDisplayText] = useState(safeText);
  
  useEffect(() => {
    if (!safeText) {
      setDisplayText("");
      return;
    }
    let iteration = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    
    const interval = setInterval(() => {
      setDisplayText(
        safeText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return safeText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      if (iteration >= safeText.length) {
        clearInterval(interval);
      }
      iteration += 1;
    }, 45);
    
    return () => clearInterval(interval);
  }, [safeText]);

  return <span className={className}>{displayText}</span>;
});

const NetworkNode = ({ member, direction, isFaded, setHoveredId, size = "lg" }: { member: any, direction: OpenDirection, isFaded: boolean, setHoveredId: any, size?: "sm" | "lg" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { config } = useTheme();
  
  let closeTimeout: any;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsOpen(true);
    setHoveredId(member.id);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsOpen(false);
      setHoveredId((prev: string | null) => prev === member.id ? null : prev);
    }, 300);
  };

  const lineWidth = 120;

  const isRight = direction === "right";
  const isLeft = direction === "left";
  const isBottom = direction === "bottom";

  let wrapperPosClass = "";
  let flexClass = "";
  let cardInitial = {};
  
  if (isRight) {
    wrapperPosClass = "md:left-[calc(100%-20px)] md:top-1/2 md:-translate-y-1/2";
    flexClass = "md:flex-row";
    cardInitial = { x: -20 };
  } else if (isLeft) {
    wrapperPosClass = "md:right-[calc(100%-20px)] md:top-1/2 md:-translate-y-1/2";
    flexClass = "md:flex-row-reverse";
    cardInitial = { x: 20 };
  } else if (isBottom) {
    wrapperPosClass = "md:top-[calc(100%-10px)] md:left-1/2 md:-translate-x-1/2";
    flexClass = "md:flex-col";
    cardInitial = { y: -20 };
  }

  return (
    <div 
      className={`relative pointer-events-auto flex flex-col items-center transition-all duration-500 ${isOpen ? 'z-50' : 'z-20'} ${isFaded ? 'opacity-20 blur-sm grayscale' : 'opacity-100'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative group cursor-crosshair">
        
        {/* Glow Aura */}
        <div 
          className="absolute inset-0 rounded-full blur-[20px] opacity-30 group-hover:opacity-100 transition duration-500 -z-10" 
          style={{ backgroundColor: config.primaryAccent }}
        />
        
        {/* Profile Circle */}
        <motion.div 
          className={`${size === 'lg' ? 'w-32 h-32 md:w-40 md:h-40' : 'w-20 h-20 md:w-24 md:h-24'} rounded-full border-[3px] bg-slate-950/90 overflow-hidden relative z-30`}
          style={{ 
            boxShadow: `0 0 20px ${config.primaryAccent}40`,
            borderColor: isOpen ? config.primaryAccent : `${config.primaryAccent}60`
          }}
          animate={{ scale: isOpen ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img 
            src={member.image} 
            alt={member.name} 
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0f172a&color=38bdf8&bold=true`;
            }}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500 scale-100 group-hover:scale-110" 
          />
        </motion.div>

        {/* Floating Label (Hides when open) */}
        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 text-center w-max pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
          <h3 
            className={`text-white font-bold bg-slate-900/90 rounded-full border backdrop-blur-md shadow-xl ${size === 'lg' ? 'text-base md:text-lg px-5 py-2' : 'text-xs md:text-sm px-3 py-1'}`}
            style={{ borderColor: `${config.primaryAccent}40` }}
          >
            {member.name}
          </h3>
          <p 
            className={`mt-2 tracking-[0.2em] uppercase font-bold drop-shadow-md ${size === 'lg' ? 'text-xs md:text-sm' : 'text-[8px] md:text-[10px]'}`}
            style={{ color: config.secondaryAccent }}
          >
            {member.position}
          </p>
        </div>

        {/* HUD Details Callout */}
        <AnimatePresence>
          {isOpen && (
            <div 
              className={`fixed inset-x-4 top-[20%] md:absolute md:inset-auto pointer-events-none flex items-center justify-center z-[100] ${wrapperPosClass}`}
              onMouseEnter={handleMouseEnter} 
            >
              <div className={`flex flex-col items-center justify-center ${flexClass}`}>
                
                {/* Connecting Dot */}
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="hidden md:block w-3 h-3 rounded-full shrink-0" 
                  style={{ 
                    backgroundColor: config.primaryAccent, 
                    boxShadow: `0 0 15px ${config.primaryAccent}` 
                  }}
                />
                
                {/* Connecting Line */}
                <motion.div
                  initial={isBottom ? { height: 0, opacity: 0 } : { width: 0, opacity: 0 }}
                  animate={isBottom ? { height: 80, opacity: 1 } : { width: lineWidth, opacity: 1 }}
                  exit={isBottom ? { height: 0, opacity: 0 } : { width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`hidden md:flex shrink-0 items-center justify-center overflow-hidden ${isBottom ? 'w-[2px] my-2' : 'mx-2'}`}
                  style={isBottom ? {
                    background: `linear-gradient(to bottom, ${config.primaryAccent}, ${config.secondaryAccent})`,
                    boxShadow: `0 0 8px ${config.primaryAccent}80`
                  } : {}}
                >
                  {!isBottom && (
                    <svg width={lineWidth} height="60" viewBox={`0 0 ${lineWidth} 60`} className="overflow-visible">
                      <motion.path
                        d={isLeft 
                          ? `M ${lineWidth} 30 L 80 30 L 50 45 L 0 45` 
                          : `M 0 30 L 40 30 L 70 45 L ${lineWidth} 45`
                        }
                        fill="transparent"
                        stroke="url(#hudDynamicGradient)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ filter: `drop-shadow(0px 0px 6px ${config.primaryAccent})` }}
                      />
                      <defs>
                        <linearGradient id="hudDynamicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={isLeft ? config.secondaryAccent : config.primaryAccent} />
                          <stop offset="100%" stopColor={isLeft ? config.primaryAccent : config.secondaryAccent} />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </motion.div>

                {/* Details Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, ...cardInitial }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                  className="w-full max-w-[340px] md:w-[300px] md:max-w-none bg-slate-950/95 backdrop-blur-lg md:backdrop-blur-2xl border rounded-2xl p-6 pointer-events-auto shadow-2xl mx-auto"
                  style={{ 
                    borderColor: `${config.primaryAccent}60`,
                    boxShadow: `0 20px 60px -10px ${config.primaryAccent}35`
                  }}
                >
                  <div className="mb-4">
                    <h4 className="text-white font-black text-lg tracking-wide uppercase">
                      <HackerText text={member.name} />
                    </h4>
                    <p 
                      className="text-[10px] font-mono tracking-widest mt-1 uppercase"
                      style={{ color: config.secondaryAccent }}
                    >
                      <HackerText text={member.position} />
                    </p>
                  </div>
                  
                  <p 
                    className="text-slate-300 text-xs leading-relaxed mb-5 border-l-2 pl-3 font-light"
                    style={{ borderColor: `${config.primaryAccent}80` }}
                  >
                    {member.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills?.map((skill: string, i: number) => (
                       <span 
                         key={i} 
                         className="text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded border"
                         style={{ 
                           color: config.secondaryAccent,
                           borderColor: `${config.primaryAccent}50`,
                           backgroundColor: `${config.primaryAccent}15`
                         }}
                       >
                         {skill}
                       </span>
                    ))}
                  </div>

                  {member.branch && (
                    <div 
                      className="mb-5 flex items-center gap-2 border px-3 py-1.5 rounded-md w-max"
                      style={{
                        borderColor: `${config.primaryAccent}40`,
                        backgroundColor: `${config.primaryAccent}10`
                      }}
                    >
                       <span 
                         className="text-[8px] font-bold uppercase tracking-widest"
                         style={{ color: config.secondaryAccent }}
                       >
                         Branch:
                       </span>
                       <span className="text-[10px] font-bold text-white uppercase tracking-wider">{member.branch}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80">
                    {member.socials?.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors" title="LinkedIn">
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials?.github && (
                      <a href={member.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="GitHub">
                        <FaGithub className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials?.email && (
                      <a href={`mailto:${member.socials.email}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors" title={`Email: ${member.socials.email}`}>
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials?.instagram && (
                      <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-400 transition-colors" title="Instagram">
                        <FaInstagram className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TeamBranch = ({ title, members, hoveredId, setHoveredId, cardDirection = "right" }: { title: string, members: any[], hoveredId: string | null, setHoveredId: any, cardDirection?: OpenDirection }) => {
  const { config } = useTheme();
  if (!members || members.length === 0) return null;
  const isBranchActive = members.some(m => m.id === hoveredId);

  return (
    <div className={`flex flex-col items-start relative w-max mt-20 shrink-0 ${isBranchActive ? 'z-50' : 'z-20'}`}>
      <h3 
        className="text-xs md:text-sm font-black text-white tracking-[0.2em] uppercase bg-slate-950/90 backdrop-blur-md px-4 md:px-6 py-2 rounded-full border z-20 whitespace-nowrap"
        style={{ 
          borderColor: `${config.primaryAccent}50`, 
          boxShadow: `0 0 20px ${config.primaryAccent}25` 
        }}
      >
        {title}
      </h3>
      
      {/* Vertical Spine Line */}
      <div 
        className="absolute top-[36px] left-[30px] md:left-[40px] bottom-[40px] w-[2px] z-10" 
        style={{ 
          background: `linear-gradient(to bottom, ${config.primaryAccent}70, ${config.secondaryAccent}40, transparent)`,
          boxShadow: `0 0 10px ${config.primaryAccent}60`
        }}
      />

      <div className="flex flex-col gap-12 md:gap-16 pt-12 pl-[60px] md:pl-[80px] pr-4 relative z-20">
        {members.map((m) => (
          <div key={m.id} className="relative flex items-center">
            {/* Horizontal Branch Line connecting to spine */}
            <div 
              className="absolute right-full top-1/2 w-[30px] md:w-[40px] h-[2px] -translate-y-1/2" 
              style={{ 
                backgroundColor: `${config.primaryAccent}50`, 
                boxShadow: `0 0 5px ${config.primaryAccent}70` 
              }}
            />
            
            <NetworkNode 
              member={m} 
              direction={cardDirection} 
              size="sm"
              isFaded={hoveredId !== null && hoveredId !== m.id}
              setHoveredId={setHoveredId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TeamPage() {
  const [teamData, setTeamData] = useState<any[]>(() => DataStore.getTeamSync());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { config } = useTheme();

  useEffect(() => {
    const loadTeam = async () => {
      const data = await DataStore.getTeam();
      if (data && data.length > 0) {
        setTeamData(data);
      }
    };

    loadTeam();
    const unsubscribe = DataStore.subscribeToUpdates(loadTeam);
    return () => unsubscribe();
  }, []);

  const presidents = teamData.filter(m => m.level === 1);
  const vps = teamData.filter(m => m.level === 2);
  const rawHeads = teamData.filter(m => m.level === 3);
  const rawCoheads = teamData.filter(m => m.level === 4);
  const members = teamData.filter(m => m.level === 5);

  // Unified left-to-right domain sorting for Heads and Co-Heads
  const getDomainScore = (m: any) => {
    const p = (m.position || "").toLowerCase();
    const d = (m.domain || "").toLowerCase();
    if (p.includes("tech") || d === "technical") return 1;
    if (p.includes("content") || d === "content") return 2;
    if (p.includes("design") || d === "design" || d === "designing") return 3;
    if (p.includes("pr") || p.includes("market") || d === "pr" || d === "marketing") return 4;
    if (p.includes("photo") || p.includes("social") || p.includes("media") || d === "photo" || d === "photography") return 5;
    return 99;
  };

  const heads = [...rawHeads].sort((a, b) => getDomainScore(a) - getDomainScore(b));
  const coheads = [...rawCoheads].sort((a, b) => getDomainScore(a) - getDomainScore(b));
  
  const techMembers = members.filter(m => m.domain === "technical");
  const contentMembers = members.filter(m => m.domain === "content");
  const designMembers = members.filter(m => m.domain === "design");
  const prMembers = members.filter(m => m.domain === "pr");
  const photoMembers = members.filter(m => m.domain === "photo");

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-32">
      {/* Ambient Background Glows */}
      <div className={cn("absolute top-0 left-0 w-full h-[500px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass1)} />
      <div className={cn("absolute top-1/3 right-0 w-[500px] h-[500px] blur-[80px] md:blur-[150px] opacity-60 md:opacity-100 pointer-events-none -z-10", config.glowClass2)} />

      {/* Hero Section */}
      <section className="pt-20 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span 
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border inline-block mb-6 shadow-sm backdrop-blur-md"
            style={{ 
              color: config.secondaryAccent, 
              borderColor: `${config.primaryAccent}40`, 
              backgroundColor: `${config.primaryAccent}15` 
            }}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1" style={{ color: config.secondaryAccent }} />
            The Builders &amp; Innovators
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-sky-300 mb-6 drop-shadow-lg">
            Meet Our Team
          </h1>
          <div className={cn("w-24 h-1 mx-auto rounded-full bg-gradient-to-r mb-12", config.gradientText)} />
        </motion.div>
      </section>

      {/* Hierarchical Neural Tree */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center gap-32 md:gap-48 mb-32">
        
        {/* Background Vertical Connection Line */}
        <div 
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] -z-10" 
          style={{
            background: `linear-gradient(to bottom, ${config.primaryAccent}70, ${config.secondaryAccent}40, transparent)`,
            boxShadow: `0 0 10px ${config.primaryAccent}40`
          }}
        />

        {/* Level 1: President */}
        <div className="relative flex justify-center w-full">
          {presidents.map((m) => (
            <NetworkNode 
              key={m.id} 
              member={m} 
              direction="right" 
              isFaded={hoveredId !== null && hoveredId !== m.id}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>

        {/* Level 2: VP */}
        <div className="relative flex justify-center w-full">
          {vps.map((m) => (
            <NetworkNode 
              key={m.id} 
              member={m} 
              direction="left" 
              isFaded={hoveredId !== null && hoveredId !== m.id}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>

        {/* Level 3: Heads */}
        <div className="relative flex flex-wrap justify-center items-center gap-x-12 gap-y-20 md:gap-x-24 md:gap-y-24 w-full max-w-[1400px] z-30 px-4">
          {heads.map((member, idx) => (
            <NetworkNode 
              key={member.id} 
              member={member} 
              direction={idx < heads.length / 2 ? "right" : "left"} 
              isFaded={hoveredId !== null && hoveredId !== member.id}
              setHoveredId={setHoveredId} 
            />
          ))}
        </div>

        {/* Level 4: Co-heads */}
        <div className="relative flex flex-wrap justify-center items-center gap-x-12 gap-y-20 md:gap-x-24 md:gap-y-24 w-full max-w-[1400px] z-20 px-4">
          {coheads.map((member, idx) => (
            <NetworkNode 
              key={member.id} 
              member={member} 
              direction={idx < coheads.length / 2 ? "right" : "left"} 
              isFaded={hoveredId !== null && hoveredId !== member.id}
              setHoveredId={setHoveredId} 
            />
          ))}
        </div>

        {/* Level 5: Team Members (Domain Columns) */}
        <div 
          className="relative flex flex-wrap justify-center items-start gap-x-12 gap-y-20 md:gap-x-20 w-full max-w-[1400px] pt-20 pb-16 px-4"
        >
          <TeamBranch title="Technical" members={techMembers} hoveredId={hoveredId} setHoveredId={setHoveredId} cardDirection="right" />
          <TeamBranch title="Content" members={contentMembers} hoveredId={hoveredId} setHoveredId={setHoveredId} cardDirection="right" />
          <TeamBranch title="Design" members={designMembers} hoveredId={hoveredId} setHoveredId={setHoveredId} cardDirection="bottom" />
          <TeamBranch title="PR & Mktg" members={prMembers} hoveredId={hoveredId} setHoveredId={setHoveredId} cardDirection="left" />
          <TeamBranch title="Photo & Social" members={photoMembers} hoveredId={hoveredId} setHoveredId={setHoveredId} cardDirection="left" />
        </div>

      </div>

    </div>
  );
}

