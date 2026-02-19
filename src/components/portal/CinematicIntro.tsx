import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<'logo' | 'reveal' | 'exit'>('logo');

  const handleSkip = useCallback(() => {
    setPhase('exit');
    setTimeout(onComplete, 500);
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 2200);
    const t2 = setTimeout(() => setPhase('exit'), 2700);
    const t3 = setTimeout(onComplete, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
        onClick={handleSkip}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'exit' ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: '#ffffff' }}
      >
        {/* Subtle grain that fades in during reveal */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'reveal' || phase === 'exit' ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* System grid that appears on reveal */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'reveal' ? 0.03 : 0 }}
          transition={{ duration: 1 }}
        >
          <svg width="100%" height="100%">
            <defs>
              <pattern id="intro-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#000" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#intro-grid)" />
          </svg>
        </motion.div>

        {/* Ripple on reveal */}
        {phase === 'reveal' && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 120,
              height: 120,
              border: '1px solid hsla(220, 70%, 50%, 0.08)',
            }}
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        )}

        {/* Logo — pure, centered, no container */}
        <motion.img
          src="/images/noe-logo-animated.gif"
          alt="Noé"
          className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 object-contain"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 1,
            scale: phase === 'reveal' ? 1.03 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Skip hint */}
        <motion.p
          className="absolute bottom-8 text-[11px] tracking-[0.2em] uppercase text-foreground/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          Cliquez pour passer
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
