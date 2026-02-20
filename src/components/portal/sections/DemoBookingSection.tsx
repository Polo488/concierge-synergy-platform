import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Calendar } from 'lucide-react';

// IMPORTANT: Replace with your real calendar link
const CALENDAR_URL = 'https://calendly.com/your-url';

export function DemoBookingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [30, -20]);

  return (
    <section ref={ref} className="py-28 lg:py-40 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <motion.p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Démo privée
          </motion.p>

          <motion.h2
            className="text-3xl sm:text-[2.4rem] font-semibold text-foreground leading-[1.12] tracking-tight"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Voir l'infrastructure en action.
          </motion.h2>

          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Réservez un walkthrough privé. Nous parcourons votre cas d'usage réel en 30 minutes.
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-card rounded-2xl border border-border/50 overflow-hidden"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: cardY }}
        >
          {CALENDAR_URL.includes('your-url') ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <motion.div
                className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center mb-5"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ type: 'spring', delay: 0.4 }}
              >
                <Calendar className="w-7 h-7 text-primary" />
              </motion.div>
              <motion.p
                className="text-muted-foreground text-[15px]"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.55 }}
              >
                Le module de calendrier apparaîtra ici une fois configuré.
              </motion.p>
              <motion.p
                className="text-xs text-muted-foreground/60 mt-2"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.65 }}
              >
                Mettre à jour <code className="font-mono bg-muted px-1.5 py-0.5 rounded">CALENDAR_URL</code> dans DemoBookingSection.tsx
              </motion.p>
            </div>
          ) : (
            <iframe
              src={CALENDAR_URL}
              width="100%"
              height="650"
              frameBorder="0"
              title="Réserver une démo"
              className="w-full"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
