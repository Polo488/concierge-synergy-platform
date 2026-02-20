import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<'playing' | 'exit'>('playing');

  const handleSkip = useCallback(() => {
    if (phase === 'exit') return;
    setPhase('exit');
    setTimeout(onComplete, 600);
  }, [onComplete, phase]);

  useEffect(() => {
    // Let the GIF animation play fully (~4s), then fade out
    const t1 = setTimeout(() => setPhase('exit'), 4000);
    const t2 = setTimeout(onComplete, 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
        onClick={handleSkip}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'exit' ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: '#ffffff' }}
      >
        <img
          src="/images/noe-logo-animated.gif"
          alt="Noé"
          className="w-[600px] max-w-[80vw] object-contain select-none"
          draggable={false}
        />

        <motion.p
          className="absolute bottom-8 text-[10px] tracking-[0.25em] uppercase select-none"
          style={{ color: 'hsla(220, 13%, 18%, 0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          Cliquez pour passer
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}