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
    setTimeout(onComplete, 1100);
  }, [onComplete, phase]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 4000);
    const t2 = setTimeout(onComplete, 5100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {(
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
          onClick={handleSkip}
          style={{ background: '#ffffff' }}
          initial={{ opacity: 1 }}
          animate={
            phase === 'exit'
              ? { opacity: 0, scale: 1.15 }
              : { opacity: 1, scale: 1 }
          }
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.img
            src="/images/noe-logo-animated.gif"
            alt="Noé"
            className="w-[600px] max-w-[80vw] object-contain select-none"
            draggable={false}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={
              phase === 'exit'
                ? { opacity: 0, scale: 1.1 }
                : { opacity: 1, scale: 1 }
            }
            transition={{
              opacity: { duration: phase === 'exit' ? 0.8 : 0.6, delay: phase === 'exit' ? 0 : 0.2 },
              scale: { duration: phase === 'exit' ? 1 : 0.8, ease: [0.22, 1, 0.36, 1] },
            }}
          />

          <motion.p
            className="absolute bottom-8 text-[10px] tracking-[0.25em] uppercase select-none"
            style={{ color: 'hsla(220, 13%, 18%, 0.2)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'exit' ? 0 : 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            Cliquez pour passer
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
