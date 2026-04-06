import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const symbols = ['{ }', '< >', '( )', 'py', 'js', 'java', '#', '//', '/* */', 'const', 'def', 'class'];

export const ClickBurst = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        angle: (Math.random() * 360) * (Math.PI / 180),
        velocity: Math.random() * 100 + 50,
      }));

      setParticles((prev) => [...prev, ...newParticles]);

      // Cleanup
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              opacity: 1, 
              scale: 0.5,
              rotate: 0 
            }}
            animate={{ 
              x: particle.x + Math.cos(particle.angle) * particle.velocity,
              y: particle.y + Math.sin(particle.angle) * particle.velocity,
              opacity: 0,
              scale: 1.5,
              rotate: particle.angle * 100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-sm font-mono font-bold select-none whitespace-nowrap"
            style={{ color: 'var(--primary)' }}
          >
            {particle.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ClickBurst;
