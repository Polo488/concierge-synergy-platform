import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';

function DataFlowCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Flowing data lines */}
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{
            width: `${20 + i * 8}%`,
            left: `${10 + i * 12}%`,
            top: `${15 + i * 15}%`,
            background: `linear-gradient(90deg, transparent, hsla(220, 70%, 50%, ${0.06 + i * 0.02}), transparent)`,
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 4 + i * 1.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Floating nodes */}
      {[
        { x: '15%', y: '25%', delay: 0 },
        { x: '75%', y: '20%', delay: 1.2 },
        { x: '85%', y: '60%', delay: 0.6 },
        { x: '25%', y: '70%', delay: 1.8 },
        { x: '55%', y: '40%', delay: 0.3 },
      ].map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: node.x,
            top: node.y,
            background: 'hsla(220, 70%, 50%, 0.15)',
            boxShadow: '0 0 20px hsla(220, 70%, 50%, 0.1)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: node.delay,
          }}
        />
      ))}

      {/* Large ambient glow */}
      <div
        className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(220, 70%, 50%, 0.04), transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(220, 70%, 50%, 0.03), transparent 70%)',
        }}
      />
    </div>
  );
}

function SystemCard({ title, value, sub, delay }: { title: string; value: string; sub: string; delay: number }) {
  return (
    <motion.div
      className="glass-panel rounded-xl p-4 flex-1 min-w-[140px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{title}</p>
      <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </motion.div>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <DataFlowCanvas />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* System status badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
            style={{
              background: 'hsla(220, 70%, 50%, 0.06)',
              border: '1px solid hsla(220, 70%, 50%, 0.1)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(152,50%,45%)] animate-pulse" />
            <span className="text-xs font-medium text-foreground tracking-wide">Channel Manager + PMS</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-foreground leading-[1.08] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Infrastructure de distribution
            <br />
            <span className="text-muted-foreground">et d'opérations locatives.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed mt-6 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Connectez vos canaux de distribution. Automatisez vos opérations.
            Tracez chaque flux financier. Un système, pas un outil.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Button size="lg" className="text-sm px-6 h-12 rounded-xl" asChild>
              <Link to="/contact">
                Demander un accès
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-6 h-12 rounded-xl" asChild>
              <Link to="/produit">Explorer l'architecture</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex items-center gap-8 mt-10 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {['Distribution multi-plateforme', 'Traçabilité financière', 'Conformité réglementaire'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[hsl(152,50%,45%)]" />
                <span>{t}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* System metrics cards */}
        <motion.div
          className="flex flex-wrap gap-3 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <SystemCard title="Coût / logement" value="4€" sub="HT / mois" delay={1.0} />
          <SystemCard title="Canaux connectés" value="12+" sub="OTAs & directs" delay={1.1} />
          <SystemCard title="Sync" value="<2min" sub="Temps de propagation" delay={1.2} />
          <SystemCard title="Uptime" value="99.9%" sub="Disponibilité système" delay={1.3} />
        </motion.div>
      </div>
    </section>
  );
}
