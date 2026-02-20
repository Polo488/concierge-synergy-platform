import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Rocket, Lock, UserCheck, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  { icon: Rocket, label: 'Onboarding prioritaire' },
  { icon: Shield, label: 'Assistance à la migration' },
  { icon: Lock, label: 'Tarif de lancement verrouillé à vie' },
  { icon: UserCheck, label: 'Spécialiste d\'onboarding dédié' },
  { icon: GitBranch, label: 'Accès direct à la roadmap produit' },
];

const maskReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: { clipPath: 'inset(0 0% 0 0)' },
};

export function EarlyAccessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Déploiement limité
          </motion.p>

          <motion.h2
            className="text-3xl sm:text-[2.6rem] font-semibold text-foreground leading-[1.1] tracking-tight max-w-xl"
            variants={maskReveal}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            Nous intégrons un groupe restreint de sociétés de gestion pour migrer leur portefeuille en priorité.
          </motion.h2>
        </motion.div>

        <motion.p
          className="mt-6 text-lg text-muted-foreground max-w-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Les partenaires early recevront :
        </motion.p>

        <motion.div className="mt-10 grid sm:grid-cols-2 gap-4" style={{ y }}>
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 group"
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[15px] font-medium text-foreground">{b.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            size="lg"
            className="text-[15px] px-8 h-12 rounded-xl"
            onClick={() => {
              document.getElementById('pre-register')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Demander un accès anticipé
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
