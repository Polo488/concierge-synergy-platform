import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const operations = [
  {
    label: 'Ménages',
    lines: [
      'Check-out 11h → T2 Bellecour',
      'Assignation → Marie L.',
      'Durée estimée → 1h30',
      'Check-in 16h confirmé',
    ],
  },
  {
    label: 'Maintenance',
    lines: [
      'Signalement → Fuite robinet',
      'Priorité → Moyenne',
      'Assignation → Tech. Plomberie',
      'Intervention → J+1',
    ],
  },
  {
    label: 'Facturation',
    lines: [
      'Réservation #2847',
      'Montant → 892,00€',
      'Commission → 178,40€',
      'Facture générée ✓',
    ],
  },
  {
    label: 'Messaging',
    lines: [
      'Réservation confirmée',
      '→ Bienvenue J-3',
      '→ Check-in J-1',
      '→ Avis J+1',
    ],
  },
];

export function OperationsFlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const gridY = useTransform(scrollYProgress, [0, 1], [30, -20]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="operations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="max-w-xl mb-16">
          <motion.p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Opérations
          </motion.p>

          <motion.h2
            className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Chaque réservation
            <br />
            <span className="text-muted-foreground">déclenche l'exécution.</span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Ménages, maintenance et communications sont déployés automatiquement
            à chaque événement de réservation.
          </motion.p>
        </div>

        {/* Grid of operation cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30 rounded-2xl overflow-hidden"
          style={{ y: gridY }}
        >
          {operations.map((op, i) => (
            <motion.div
              key={op.label}
              className="bg-background p-6 lg:p-7 group relative"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ backgroundColor: 'hsl(var(--card))' }}
            >
              <motion.p
                className="text-[13px] font-medium text-foreground tracking-wide mb-5"
                initial={{ opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {op.label}
              </motion.p>

              {/* Terminal simulation */}
              <div className="space-y-1.5">
                {op.lines.map((line, j) => (
                  <motion.p
                    key={j}
                    className="text-[11px] font-mono text-muted-foreground/70 leading-relaxed"
                    initial={{ opacity: 0, x: -8 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.1 + j * 0.08 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-transparent group-hover:bg-primary/15 transition-colors duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
