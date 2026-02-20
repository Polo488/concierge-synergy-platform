import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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
  { value: 24, suffix: '', label: 'Entreprises en onboarding' },
  { value: 1850, suffix: '+', label: 'Unités pré-enregistrées' },
  { value: 87, suffix: '', label: 'Demandes d\'accès anticipé' },
  { value: 99, suffix: '.9%', label: 'Disponibilité système' },
];

export function SocialProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.p
          className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-12 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          En production
        </motion.p>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/25 rounded-xl overflow-hidden"
          style={{ scale }}
        >
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="bg-background py-10 px-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-3xl sm:text-4xl font-semibold text-foreground tabular-nums">
                <Counter
                  target={m.value}
                  suffix={m.suffix}
                  isVisible={isInView}
                  delay={180 + i * 100}
                />
              </p>
              <motion.p
                className="text-xs text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {m.label}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
