import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function DataFlowBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle system grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Horizontal flow lines */}
      {[20, 38, 55, 72, 86].map((top, i) => (
        <motion.div
          key={i}
          className="absolute h-px left-0 right-0"
          style={{
            top: `${top}%`,
            background: `linear-gradient(90deg, transparent, hsla(220, 70%, 50%, ${0.03 + i * 0.008}), transparent)`,
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 14 + i * 4,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
        />
      ))}

      {/* Pulsing nodes */}
      {[
        { x: '12%', y: '28%' },
        { x: '82%', y: '35%' },
        { x: '50%', y: '75%' },
        { x: '90%', y: '15%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/15"
          style={{ left: pos.x, top: pos.y }}
          animate={{ scale: [1, 2.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 1.1 }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [ctaVisible, setCtaVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCtaVisible(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[94vh] flex items-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <DataFlowBackground />
      </motion.div>

      <motion.div
        className="relative max-w-5xl mx-auto px-4 sm:px-6 w-full py-20 lg:py-28"
        style={{ opacity: contentOpacity }}
      >
        <div className="max-w-2xl">
          {/* Editorial headline */}
          <motion.h1
            className="text-[clamp(2rem,5vw,3.8rem)] font-semibold text-foreground leading-[1.08] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Vous n'avez pas besoin
            <br />
            d'un outil plus gros.
            <br />
            <span className="text-muted-foreground">
              Vous avez besoin d'une
              <br />
              meilleure infrastructure.
            </span>
          </motion.h1>

          {/* Positioning — no pricing here */}
          <motion.p
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Infrastructure opérationnelle pour les sociétés de gestion courte durée.
            <br />
            <span className="text-foreground font-medium">Profondeur enterprise. Coût d'entrée.</span>
          </motion.p>

          {/* CTA — delayed appearance */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button size="lg" className="text-[15px] px-7 h-12 rounded-xl" asChild>
              <Link to="/contact">
                Demander une démo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-[15px] px-7 h-12 rounded-xl text-muted-foreground"
              asChild
            >
              <a href="#operations">Explorer le système</a>
            </Button>
          </motion.div>

          {/* Credibility markers */}
          <motion.div
            className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            {[
              'Distribution multi-plateforme',
              'Opérations automatisées',
              'Reporting audit-ready',
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary/30" />
                {t}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
