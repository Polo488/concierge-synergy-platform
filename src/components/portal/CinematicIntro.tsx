import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<'logo' | 'expand' | 'exit'>('logo');

  const handleSkip = useCallback(() => {
    setPhase('exit');
    setTimeout(onComplete, 600);
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('expand'), 2000);
    const t2 = setTimeout(() => setPhase('exit'), 2600);
    const t3 = setTimeout(onComplete, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={handleSkip}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'exit' ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: 'hsl(220 20% 97%)' }}
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating glass panels */}
        <motion.div
          className="absolute w-72 h-48 rounded-2xl"
          style={{
            background: 'hsla(220, 70%, 50%, 0.03)',
            backdropFilter: 'blur(40px)',
            border: '1px solid hsla(220, 70%, 50%, 0.06)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
            rotate: [0, 2, -1, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '15%', left: '10%' }}
        />
        <motion.div
          className="absolute w-56 h-36 rounded-2xl"
          style={{
            background: 'hsla(220, 70%, 50%, 0.02)',
            backdropFilter: 'blur(40px)',
            border: '1px solid hsla(220, 70%, 50%, 0.04)',
          }}
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 15, -25, 0],
            rotate: [0, -1, 2, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ bottom: '20%', right: '12%' }}
        />

        {/* Light gradient particles */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(220, 70%, 50%, 0.06), transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Logo */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: phase === 'logo' ? 1 : phase === 'expand' ? 1 : 0,
            scale: phase === 'logo' ? 1 : phase === 'expand' ? 1.05 : 1.1,
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/images/noe-logo-animated.gif"
            alt="Noé"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
          />
        </motion.div>

        {/* Glow ripple on expand */}
        {phase === 'expand' && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, hsla(220, 70%, 50%, 0.15), transparent 70%)',
            }}
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}

        {/* Data flow lines on expand */}
        {phase === 'expand' && (
          <>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.div
                key={angle}
                className="absolute h-px"
                style={{
                  width: '40vw',
                  background: 'linear-gradient(90deg, transparent, hsla(220, 70%, 50%, 0.2), transparent)',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'left center',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 0.6, 0] }}
                transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
              />
            ))}
          </>
        )}

        {/* Skip hint */}
        <motion.p
          className="absolute bottom-8 text-xs tracking-widest uppercase"
          style={{ color: 'hsla(220, 13%, 18%, 0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Cliquez pour passer
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
