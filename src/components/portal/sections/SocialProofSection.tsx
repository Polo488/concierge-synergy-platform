import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function Counter({
  target,
  suffix = '',
  delay = 0,
  isVisible,
}: {
  target: number;
  suffix?: string;
  delay?: number;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const timeout = setTimeout(() => {
      const duration = 1300;
      const start = Date.now();
      const animate = () => {
        const progress = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isVisible, target, delay]);

  return (
    <span>
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

const metrics = [
  { value: 850, suffix: '+', label: 'Logements gérés' },
  { value: 12, suffix: '', label: 'Villes couvertes' },
  { value: 45, suffix: 'k+', label: 'Réservations traitées' },
  { value: 99, suffix: '.9%', label: 'Uptime système' },
];

export function SocialProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.p
          className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          En production
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/25 rounded-xl overflow-hidden">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="bg-background py-10 px-6 text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
            >
              <p className="text-3xl sm:text-4xl font-semibold text-foreground tabular-nums">
                <Counter
                  target={m.value}
                  suffix={m.suffix}
                  isVisible={isInView}
                  delay={180 + i * 100}
                />
              </p>
              <p className="text-xs text-muted-foreground mt-2">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
