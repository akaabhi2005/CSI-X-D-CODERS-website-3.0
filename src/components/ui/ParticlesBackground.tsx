"use client";

import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "@/lib/themeContext";

export const ParticlesBackground = React.memo(function ParticlesBackground() {
  const [init, setInit] = useState(false);
  const { config, theme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return (
    <Particles
      key={theme}
      id="tsparticles"
      className="absolute inset-0 -z-10 pointer-events-none"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 30,
        interactivity: {
          events: {
            onHover: {
              enable: false,
              mode: "repulse",
            },
            resize: {
              enable: true,
            },
          },
          modes: {
            repulse: {
              distance: 80,
              duration: 0.3,
            },
          },
        },
        particles: {
          color: {
            value: config.particleColors,
          },
          links: {
            color: config.primaryAccent,
            distance: 110,
            enable: true,
            opacity: 0.12,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 0.4,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 18,
          },
          opacity: {
            value: 0.35,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2.5 },
          },
        },
        detectRetina: false,
      }}
    />
  );
});
