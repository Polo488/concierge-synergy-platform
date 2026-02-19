import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const operations = [
  {
    label: 'Ménages',
    lines: ['Check-out 11h → T2 Bellecour', 'Assignation → Marie L.', 'Durée estimée → 1h30', 'Check-in 16h confirmé'],
  },
  {
    label: 'Maintenance',
    lines: ['Signalement → Fuite robinet', 'Priorité → Moyenne', 'Assignation → Tech. Plomberie', 'Intervention → J+1'],
  },
  {
    label: 'Facturation',
    lines: ['Réservation #2847', 'Montant → 892,00€', 'Commission → 178,40€', 'Facture générée ✓'],
  },
  {
    label: 'Messaging',
    lines: ['Réservation confirmée', '→ Bienvenue J-3', '→ Check-in J-1', '→ Avis J+1'],
  },
];

export function OperationsFlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-40" id="product">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-16">
          <motion.p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            Opérations
          </motion.p>

          <motion.h2
            className="text-3xl sm:text-[2.6rem] font-semibold text-foreground leading-[1.15] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Chaque événement
            <br />
            <span className="text-muted-foreground">déclenche le bon workflow.</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 rounded-2xl overflow-hidden">
          {operations.map((op, i) => (
            <motion.div
              key={op.label}
              className="bg-background p-6 group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              <p className="text-xs font-medium text-foreground tracking-wide mb-4">{op.label}</p>

              {/* Terminal simulation */}
              <div className="space-y-1.5">
                {op.lines.map((line, j) => (
                  <motion.p
                    key={j}
                    className="text-[11px] font-mono text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0, x: -6 }}
                    animate={isInView ? { opacity: 0.7, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 + j * 0.1 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* Hover reveal line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
