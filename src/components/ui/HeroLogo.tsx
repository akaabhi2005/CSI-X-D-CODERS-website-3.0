"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, type Variants } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/lib/themeContext";
import { cn } from "@/lib/utils";
import { Shield, Zap } from "lucide-react";

export function HeroLogo() {
  const { config } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Smooth Interactive 3D Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseSpringConfig = { damping: 30, stiffness: 180, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), mouseSpringConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), mouseSpringConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["10%", "90%"]), mouseSpringConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["10%", "90%"]), mouseSpringConfig);

  // Scroll logic for Bubble Burst Out Animation
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      // Trigger burst out only when user scrolls past the hero section threshold (~280px)
      if (latest > 280) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }, [scrollY]);

  // Bubble Particles Configuration (Stable across renders) - Wide horizontal left/right & downward radial dispersion
  const bubbleParticles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      // 360-degree radial angles with expansive left and right horizontal fan-out
      const angle = Math.random() * Math.PI * 2;
      const baseDistance = 220 + Math.random() * 1150;
      
      // Horizontal expansion factor ensuring prominent left and right scatter
      const horizontalStretch = 1.45;
      const targetX = Math.cos(angle) * baseDistance * horizontalStretch;
      
      // Gentle downward bias as user scrolls
      const targetY = Math.sin(angle) * baseDistance + (Math.sin(angle) > 0 ? Math.random() * 220 : 0);

      const size = Math.random() < 0.65 ? Math.random() * 14 + 5 : Math.random() * 26 + 14;
      const isCyan = i % 3 === 0;
      const isBlue = i % 3 === 1;

      return {
        id: i,
        size,
        targetX,
        targetY,
        scale: Math.random() * 1.9 + 0.8,
        duration: 1.1 + Math.random() * 1.3,
        delay: Math.random() * 0.22,
        borderColor: isCyan 
          ? "border-cyan-300/90" 
          : isBlue 
          ? "border-blue-400/90" 
          : "border-sky-300/90",
        bgColor: isCyan 
          ? "bg-cyan-400/25" 
          : isBlue 
          ? "bg-blue-500/25" 
          : "bg-sky-400/25",
        boxShadow: isCyan
          ? "0 0 14px rgba(6, 182, 212, 0.9), inset 0 0 10px rgba(255, 255, 255, 0.7)"
          : isBlue
          ? "0 0 14px rgba(59, 130, 246, 0.9), inset 0 0 10px rgba(255, 255, 255, 0.7)"
          : "0 0 14px rgba(56, 189, 248, 0.9), inset 0 0 10px rgba(255, 255, 255, 0.7)",
      };
    });
  }, []);

  // Bubble animation variants for out animation
  const logoBurstVariants: Variants = {
    intact: { 
      scale: 1, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: "easeOut" }
    },
    burst: { 
      scale: 1.45, 
      opacity: 0, 
      filter: "blur(20px)",
      transition: { duration: 0.45, ease: "easeIn" }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* ========================================================================= */}
      {/* 1. THE MAIN LOGO WITH BUBBLE BURST OUT ANIMATION */}
      {/* ========================================================================= */}
      <motion.div
        ref={containerRef}
        initial="intact"
        animate={isScrolled ? "burst" : "intact"}
        variants={logoBurstVariants}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onDragStart={(e) => e.preventDefault()}
        draggable={false}
        style={{
          perspective: 1100,
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        className="relative flex items-center justify-center w-[270px] h-[270px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] lg:w-[460px] lg:h-[460px] xl:w-[540px] xl:h-[540px] max-w-full select-none cursor-pointer transform-gpu will-change-transform"
      >
        {/* Ambient Volumetric Breathing Glow Dome */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 transform-gpu">
          <motion.div
            animate={{
              scale: isHovered ? 1.2 : [0.94, 1.1, 0.94],
              opacity: isHovered ? 0.65 : [0.35, 0.5, 0.35],
            }}
            transition={{
              duration: 4.5,
              repeat: isHovered ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "w-56 h-56 sm:w-72 sm:h-72 md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] rounded-full blur-[80px] sm:blur-[60px] md:blur-[100px] opacity-60 md:opacity-100 transition-colors duration-500",
              config.glowClass1
            )}
          />
        </div>

        {/* Interactive 3D Gyroscope Layer */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full flex items-center justify-center pointer-events-none transform-gpu"
        >
          {/* --- LAYER A: Outer Precision HUD Calibrated Ring (Tilted 3D Gimbal Alpha Plane) --- */}
          <div
            style={{
              transform: "rotateX(18deg) rotateY(10deg) translateZ(5px)",
            }}
            className="absolute inset-1 sm:inset-3 md:inset-4 rounded-full pointer-events-none transform-gpu"
          >
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border border-sky-500/25 relative flex items-center justify-center"
            >
              {/* Degree Tick Marks */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 flex justify-between px-1 pointer-events-none"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="w-2 h-2 bg-sky-400/40 rounded-full" />
                  <div className="w-2 h-2 bg-sky-400/40 rounded-full" />
                </div>
              ))}

              {/* Glowing Laser Comet Head on Alpha Track */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-300 shadow-[0_0_16px_#38bdf8] animate-pulse" />
                <div className="absolute -left-6 w-8 h-1 bg-gradient-to-r from-transparent via-sky-400/50 to-sky-300 rounded-full blur-xs" />
              </div>

              {/* Technical HUD Tag */}
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950/90 border border-sky-500/30 text-[10px] font-mono font-bold tracking-widest text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.35)] pointer-events-none whitespace-nowrap">
                CSI_SRMCEM // D&apos;CODERS
              </div>
            </motion.div>
          </div>

          {/* --- LAYER B: Counter-Rotating Gyro Arc (Tilted 3D Gimbal Beta Plane) --- */}
          <div
            style={{
              transform: "rotateX(-18deg) rotateY(-12deg) translateZ(12px)",
            }}
            className="absolute inset-7 sm:inset-10 md:inset-12 rounded-full pointer-events-none transform-gpu"
          >
            <motion.div
              animate={{ rotateZ: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-2 border-dashed border-sky-400/30 relative flex items-center justify-center"
            >
              {/* Cyan Satellite Node on Beta Track */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 shadow-[0_0_15px_#06b6d4] animate-pulse" />
                <div className="absolute w-7 h-7 rounded-full bg-cyan-400/25 blur-xs" />
              </div>

              {/* Electric Blue Node (Opposite) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
              </div>
            </motion.div>
          </div>

          {/* --- LAYER C: High-Speed Concentric Laser Accelerator (Gamma Plane) --- */}
          <div
            style={{
              transform: "translateZ(20px)",
            }}
            className="absolute inset-12 sm:inset-16 md:inset-18 rounded-full pointer-events-none transform-gpu"
          >
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-t-2 border-l-2 border-transparent border-t-sky-400/90 border-l-blue-500/80 shadow-[0_0_25px_rgba(56,189,248,0.45)]"
            />
          </div>

          {/* --- LAYER D: 4 Segmented HUD Corner Blast Brackets --- */}
          {/* Top-Left Bracket */}
          <div
            style={{ transform: "translateZ(15px)" }}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 w-6 h-6 border-t-2 border-l-2 border-sky-400/40 pointer-events-none"
          />

          {/* Top-Right Bracket */}
          <div
            style={{ transform: "translateZ(15px)" }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-6 h-6 border-t-2 border-r-2 border-sky-400/40 pointer-events-none"
          />

          {/* Bottom-Left Bracket */}
          <div
            style={{ transform: "translateZ(15px)" }}
            className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-6 h-6 border-b-2 border-l-2 border-sky-400/40 pointer-events-none"
          />

          {/* Bottom-Right Bracket */}
          <div
            style={{ transform: "translateZ(15px)" }}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-6 h-6 border-b-2 border-r-2 border-sky-400/40 pointer-events-none"
          />

          {/* --- LAYER E: Floating Satellite Badges --- */}
          {/* Top-Right Badge: D'CODERS */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="absolute top-0 right-0 sm:top-2 sm:right-2 md:top-4 md:right-4 z-30 transform-gpu"
          >
            <motion.div
              animate={{
                y: [-4, 4, -4],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-sky-500/40 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center gap-1.5 group-hover:border-sky-400 transition-colors pointer-events-none"
            >
              <Zap className="w-4 h-4 text-sky-400 animate-pulse" />
              <span className="text-xs font-extrabold tracking-wider text-white">D&apos;CODERS</span>
            </motion.div>
          </div>

          {/* Bottom-Left Badge: EST. 1965 */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="absolute bottom-0 left-0 sm:bottom-2 sm:left-2 md:bottom-4 md:left-4 z-30 transform-gpu"
          >
            <motion.div
              animate={{
                y: [4, -4, 4],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-blue-500/40 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center gap-1.5 group-hover:border-blue-400 transition-colors pointer-events-none"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-bold tracking-wider text-slate-300 font-mono">EST. 1965</span>
            </motion.div>
          </div>

          {/* --- LAYER F: The Central Emblem Core (Enlarged Lens) --- */}
          <div
            style={{ transform: "translateZ(28px)" }}
            className={cn(
              "relative z-20 w-52 h-52 sm:w-68 sm:h-68 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full p-1 sm:p-2 bg-slate-950/90 border border-sky-500/30 shadow-[0_0_60px_rgba(56,189,248,0.35)] transition-all duration-300 flex items-center justify-center overflow-hidden pointer-events-none select-none transform-gpu will-change-transform",
              isHovered && "border-sky-400 shadow-[0_0_80px_rgba(56,189,248,0.6)]"
            )}
          >
            {/* Gentle Floating Motion */}
            <motion.div
              animate={{
                y: isHovered ? -2 : [-4, 4, -4],
              }}
              transition={{
                duration: 5,
                repeat: isHovered ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-full relative flex items-center justify-center pointer-events-none rounded-full [perspective:1000px]"
            >
              {/* Dynamic Specular Sheen Overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-full z-20"
                style={{
                  background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22) 0%, rgba(56,189,248,0.08) 40%, transparent 70%)`,
                }}
              />

              {/* Inner Subtle Cyber Ring */}
              <div className="absolute inset-1 rounded-full border border-sky-400/15 pointer-events-none z-20" />

              {/* CONTINUOUS 3D FLIPPING LOGO (FRONT: CSI, BACK: D'CODERS) */}
              <motion.div
                className="w-[96%] h-[96%] relative [transform-style:preserve-3d] flex items-center justify-center pointer-events-none"
                animate={{ rotateY: 360 }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* FRONT FACE: CSI LOGO */}
                <div 
                  className="absolute inset-0 w-full h-full flex items-center justify-center rounded-full"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <Image
                    src="/csi-logo.png"
                    alt="CSI SRMCEM Logo"
                    width={500}
                    height={500}
                    priority
                    draggable={false}
                    className="w-full h-full object-contain rounded-full drop-shadow-[0_0_35px_rgba(56,189,248,0.8)] pointer-events-none select-none"
                  />
                </div>

                {/* BACK FACE: D'CODERS LOGO */}
                <div 
                  className="absolute inset-0 w-full h-full flex items-center justify-center rounded-full"
                  style={{ 
                    backfaceVisibility: "hidden", 
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <Image
                    src="/decoders-logo.png"
                    alt="D'CODERS Logo"
                    width={500}
                    height={500}
                    priority
                    draggable={false}
                    className="w-full h-full object-contain rounded-full drop-shadow-[0_0_35px_rgba(59,130,246,0.9)] pointer-events-none select-none"
                  />
                </div>
              </motion.div>

              {/* Top Specular Reflection Highlight */}
              <div className="absolute top-1 left-1/4 right-1/4 h-1/4 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-t-full pointer-events-none z-20" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. BUBBLE PARTICLES EXPLOSION BURST EFFECT (TRIGGERS ON SCROLL OUT) */}
      {/* ========================================================================= */}
      {isScrolled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-visible">
          {bubbleParticles.map((bubble) => (
            <motion.div
              key={`bubble-${bubble.id}`}
              className={cn(
                "absolute rounded-full border-[1.5px] backdrop-blur-xs transform-gpu will-change-transform",
                bubble.borderColor,
                bubble.bgColor
              )}
              style={{
                width: bubble.size,
                height: bubble.size,
                boxShadow: bubble.boxShadow,
              }}
              initial={{ x: 0, y: 0, scale: 0.3, opacity: 1 }}
              animate={{
                x: bubble.targetX,
                y: bubble.targetY,
                scale: bubble.scale,
                opacity: 0,
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

