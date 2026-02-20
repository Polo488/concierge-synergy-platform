import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Rocket, Lock, UserCheck, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  { icon: Rocket, label: 'Priority onboarding' },
  { icon: Shield, label: 'Migration assistance' },
  { icon: Lock, label: 'Launch pricing locked for life' },
  { icon: UserCheck, label: 'Dedicated onboarding specialist' },
  { icon: GitBranch, label: 'Direct product roadmap input' },
];

export function EarlyAccessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Limited rollout
          </p>
          <h2 className="text-3xl sm:text-[2.6rem] font-semibold text-foreground leading-[1.1] tracking-tight max-w-xl">
            We are onboarding a small group of management companies to migrate their portfolio early.
          </h2>
        </motion.div>

        <motion.p
          className="mt-6 text-lg text-muted-foreground max-w-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Early partners will receive:
        </motion.p>

        <motion.div
          className="mt-10 grid sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[15px] font-medium text-foreground">{b.label}</span>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Button
            size="lg"
            className="text-[15px] px-8 h-12 rounded-xl"
            onClick={() => {
              document.getElementById('pre-register')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Apply for Early Access
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
