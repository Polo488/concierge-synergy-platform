import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function AnimatedCounter({ target, suffix = '', prefix = '', delay = 0, isVisible }: { target: number; suffix?: string; prefix?: string; delay?: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 1500;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isVisible, target, delay]);

  return <span>{prefix}{count.toLocaleString('fr-FR')}{suffix}</span>;
}

const metrics = [
  { value: 850, suffix: '+', label: 'Logements gérés', sub: 'Portefeuille actif' },
  { value: 12, suffix: '', label: 'Villes couvertes', sub: 'France métropolitaine' },
  { value: 45, suffix: 'k+', label: 'Réservations traitées', sub: 'Depuis le lancement' },
  { value: 99, suffix: '.9%', label: 'Disponibilité', sub: 'Uptime système' },
];

export function SocialProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-6"
            style={{ background: 'hsla(220, 70%, 50%, 0.06)', color: 'hsl(var(--primary))' }}
          >
            INFRASTRUCTURE DÉPLOYÉE
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            Un système en production.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="glass-panel rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <p className="text-3xl sm:text-4xl font-semibold text-foreground tabular-nums">
                <AnimatedCounter target={m.value} suffix={m.suffix} isVisible={isInView} delay={200 + i * 150} />
              </p>
              <p className="text-sm font-medium text-foreground mt-2">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
