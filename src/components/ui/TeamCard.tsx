"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  skills: string[];
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
    instagram?: string;
  };
}

interface TeamCardProps {
  member: TeamMember;
  className?: string;
}

export function TeamCard({ member, className }: TeamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn("relative h-[420px] w-full max-w-[320px] perspective-1000", className)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col items-center justify-between p-6">
          <div className="w-full h-48 rounded-xl overflow-hidden relative mb-4">
            {/* Fallback gradient if no image */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20" />
            <img 
              src={member.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300"} 
              alt={member.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300";
              }}
            />
          </div>
          <div className="text-center w-full">
            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider">{member.position}</p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1 mt-4">
            View Details <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Back of the card */}
        <div 
          className="absolute inset-0 backface-hidden bg-slate-900 rounded-2xl p-6 border-2 flex flex-col justify-between"
          style={{ 
            transform: "rotateY(180deg)",
            boxShadow: isFlipped ? "0 0 20px rgba(249, 115, 22, 0.2)" : "none",
            borderColor: isFlipped ? "rgba(249, 115, 22, 0.5)" : "transparent"
          }}
        >
          {/* Subtle gradient background mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-transparent rounded-2xl" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-4">{member.position}</p>
            
            <p className="text-sm text-slate-300 leading-relaxed mb-6 line-clamp-4">
              {member.bio}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {member.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-3 py-1 text-xs font-medium bg-slate-800 text-slate-200 rounded-full border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10 w-full mt-auto">
            <div className="flex items-center gap-3">
              {member.socials.linkedin && (
                <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-colors">
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
              {member.socials.github && (
                <a href={member.socials.github} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {member.socials.email && (
                <a href={`mailto:${member.socials.email}`} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
            
            <a href="#" className="text-xs font-semibold text-orange-500 flex items-center gap-1 hover:text-orange-400 transition-colors">
              View Profile <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
