import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  { label: 'Géolocalisation', desc: 'Identification commune' },
  { label: 'Analyse réglementaire', desc: 'Règles locales détectées' },
  { label: 'Score de risque', desc: 'Évaluation temps réel' },
  { label: 'Conformité', desc: 'Statut vérifié' },
];

export function ComplianceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const stepsY = useTransform(scrollYProgress, [0, 1], [30, -20]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Conformité
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Chaque logement,
              <br />
              <span className="text-muted-foreground">conforme et monitoré.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Surveillance réglementaire par commune.
              Score de risque dynamique et alertes proactives
              pour chaque bien du portefeuille.
            </motion.p>
          </div>

          {/* Workflow steps */}
          <motion.div className="space-y-3" style={{ y: stepsY }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-5 border border-border/30 rounded-xl px-5 py-4 group"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.01, borderColor: 'hsl(var(--primary) / 0.2)' }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary/30 shrink-0"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.12, type: 'spring' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-success))]"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.12, type: 'spring' }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
