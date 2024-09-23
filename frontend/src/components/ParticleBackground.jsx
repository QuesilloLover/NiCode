import React from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticleBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "#000" },
        particles: { 
          color: { value: "#ffffff" }, 
          move: { enable: true, speed: 1 }, 
          number: { value: 50 },
          size: { value: 3 },
        },
      }}
    />
  );
}
