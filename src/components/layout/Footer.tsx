"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter, FaEnvelope } from "react-icons/fa6";
import { useTheme } from "@/lib/themeContext";
import { cn } from "@/lib/utils";

export function Footer() {
  const { config } = useTheme();

  return (
    <footer className="w-full bg-black/60 border-t border-white/10 backdrop-blur-md pt-12 pb-6 px-4 md:px-16 lg:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Side: Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className={cn("text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r mb-2", config.gradientText)}>
            CSI_SRMCEM X D&apos;CODERS
          </Link>
          <p className="text-sm text-slate-500">
            &copy; <Link href="/admin" className="cursor-default hover:text-slate-400 transition-colors">{new Date().getFullYear()}</Link> Computer Society of India. All rights reserved.
          </p>
        </div>

        {/* Right Side: Social Links */}
        <div className="flex items-center gap-4">
          <a href="mailto:lead.csidcoders@gmail.com" aria-label="Email" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-950/30 transition-all duration-300 shadow-sm">
            <FaEnvelope className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/company/computer-society-of-india-csi-srmcem/posts/?feedView=all" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-950/30 transition-all duration-300 shadow-sm">
            <FaLinkedin className="w-4 h-4" />
          </a>
          <a href="https://github.com/leadcsidcoders-beep" target="_blank" rel="noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all duration-300 shadow-sm">
            <FaGithub className="w-4 h-4" />
          </a>
          <a href="https://www.instagram.com/csi_srmcem?igsi=MWN1eWR0YnphdWhwag==" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-950/30 transition-all duration-300 shadow-sm">
            <FaInstagram className="w-4 h-4" />
          </a>
        </div>

      </div>
    </footer>
  );
}
