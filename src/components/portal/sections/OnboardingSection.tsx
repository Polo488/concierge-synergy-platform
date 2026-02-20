import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const onboardingSteps = [
  { id: 1, label: 'Création du compte société',     status: 'done',    time: '09:14' },
  { id: 2, label: 'Ajout des logements (import)',   status: 'done',    time: '09:15' },
  { id: 3, label: 'Connexion des canaux OTA',       status: 'done',    time: '09:22' },
  { id: 4, label: 'Configuration des workflows',    status: 'done',    time: '09:31' },
  { id: 5, label: 'Signature mandat de gestion',    status: 'active',  time: '09:38' },
  { id: 6, label: 'Validation conformité',          status: 'pending', time: '—' },
  { id: 7, label: 'Activation opérationnelle',      status: 'pending', time: '—' },
];

const docFields = [
  { label: 'Société',          value: 'Conciergerie Sud SARL' },
  { label: 'Mandant',          value: 'Jean-Pierre Moreau' },
  { label: 'Portefeuille',     value: '23 logements' },
  { label: 'Commission',       value: '20%' },
  { label: 'Date de début',    value: '01/02/2026' },
];

const userRoles = [
  { name: 'Admin',          color: 'hsl(217,91%,60%)',  perms: ['Tout accès', 'Facturation', 'Équipe'] },
  { name: 'Manager',        color: 'hsl(152,50%,45%)',  perms: ['Réservations', 'Opérations', 'Rapports'] },
  { name: 'Ménage',         color: 'hsl(35,80%,50%)',   perms: ['Tâches assignées', 'Checklist'] },
  { name: 'Propriétaire',   color: 'hsl(0,84%,60%)',    perms: ['Ses biens', 'Revenus', 'Relevés'] },
];

export function OnboardingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [50, -35]);

  const [signStep, setSignStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setSignStep(1), 2000);
    const t2 = setTimeout(() => setSignStep(2), 3400);
    const t3 = setTimeout(() => setSignStep(3), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="onboarding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: text + onboarding checklist */}
          <div>
            <motion.p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
            >
              Onboarding Digital
            </motion.p>
            <motion.h2
              className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              De l'intégration
              <br />
              <span className="text-muted-foreground">à l'activation opérationnelle.</span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Onboarding employés, signature de mandats, configuration des accès.
              Zéro paperasse, zéro chaos.
            </motion.p>
            <motion.p
              className="mt-4 text-sm text-muted-foreground/70 italic"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              Built to scale portfolios, not software bills.
            </motion.p>

            {/* Onboarding checklist */}
            <motion.div
              className="mt-10 border border-border/40 rounded-2xl overflow-hidden bg-card"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              style={{ y: cardY }}
              whileHover={{ boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.10)' }}
            >
              <div className="px-4 py-3 border-b border-border/20 bg-muted/20 flex items-center justify-between">
                <p className="text-[11px] font-medium text-foreground">Checklist d'intégration</p>
                <span className="text-[10px] text-muted-foreground">4/7 complétées</span>
              </div>
              <div className="p-3 space-y-1">
                {onboardingSteps.map((step, i) => (
                  <motion.div
                    key={step.id}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                      step.status === 'active' && 'bg-primary/5 border border-primary/15',
                    )}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.07 }}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                      step.status === 'done' && 'bg-[hsl(152,50%,45%)]/15',
                      step.status === 'active' && 'bg-primary/15',
                      step.status === 'pending' && 'bg-muted',
                    )}>
                      {step.status === 'done' && (
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="hsl(152,50%,45%)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {step.status === 'active' && (
                        <motion.div className="w-2 h-2 rounded-full bg-primary" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                      )}
                    </div>
                    <span className={cn(
                      'text-[12px] flex-1',
                      step.status === 'done' && 'text-muted-foreground line-through',
                      step.status === 'active' && 'text-foreground font-medium',
                      step.status === 'pending' && 'text-muted-foreground/60',
                    )}>
                      {step.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">{step.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: signature module + user roles */}
          <div className="space-y-4 lg:mt-24">
            {/* Document signature */}
            <motion.div
              className="border border-border/40 rounded-2xl overflow-hidden bg-card"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.10)' }}
            >
              <div className="px-4 py-3 border-b border-border/20 bg-muted/20 flex items-center justify-between">
                <p className="text-[11px] font-medium text-foreground">Mandat de gestion — Signature électronique</p>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-[9px] text-primary">En attente de signature</span>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-1.5 mb-4">
                  {docFields.map((f, i) => (
                    <div key={f.label} className="flex items-center justify-between py-1 border-b border-border/10 last:border-b-0">
                      <span className="text-[10px] text-muted-foreground">{f.label}</span>
                      <span className="text-[11px] text-foreground font-medium">{f.value}</span>
                    </div>
                  ))}
                </div>
                {/* Signature zone */}
                <div className="rounded-xl border-2 border-dashed border-border/40 p-4 flex flex-col items-center justify-center min-h-[80px] relative overflow-hidden">
                  {signStep === 0 && (
                    <p className="text-[10px] text-muted-foreground">Zone de signature</p>
                  )}
                  {signStep >= 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <svg width="180" height="60" viewBox="0 0 180 60">
                        <motion.path
                          d="M20,40 C35,15 45,50 60,30 S85,10 100,35 S130,55 150,25 S165,10 175,20"
                          stroke="hsl(var(--primary))"
                          strokeWidth="1.8"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: 'easeInOut' }}
                        />
                      </svg>
                    </motion.div>
                  )}
                  {signStep >= 2 && (
                    <motion.div
                      className="absolute bottom-2 right-2 flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <div className="w-3 h-3 rounded-full bg-[hsl(152,50%,45%)]/20 flex items-center justify-center">
                        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                          <path d="M1 3L2.5 4.5L5 2" stroke="hsl(152,50%,45%)" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span className="text-[8px] text-[hsl(152,50%,45%)]">Signé · horodaté</span>
                    </motion.div>
                  )}
                </div>
                {signStep >= 3 && (
                  <motion.div
                    className="mt-3 flex items-center gap-2 p-2 bg-[hsl(152,50%,45%)]/8 rounded-lg"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring' }}
                  >
                    <div className="w-4 h-4 rounded-full bg-[hsl(152,50%,45%)]/20 flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="hsl(152,50%,45%)" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="text-[10px] text-[hsl(152,50%,45%)] font-medium">Mandat signé — Activation en cours</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* User roles panel */}
            <motion.div
              className="border border-border/40 rounded-2xl overflow-hidden bg-card"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.10)' }}
            >
              <div className="px-4 py-3 border-b border-border/20 bg-muted/20">
                <p className="text-[11px] font-medium text-foreground">Rôles & Permissions équipe</p>
              </div>
              <div className="p-3 space-y-1.5">
                {userRoles.map((role, i) => (
                  <motion.div
                    key={role.name}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.07 }}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: role.color }} />
                    <span className="text-[11px] font-medium text-foreground w-20 shrink-0">{role.name}</span>
                    <div className="flex gap-1 flex-wrap">
                      {role.perms.map(p => (
                        <span key={p} className="px-1.5 py-0.5 rounded text-[9px] bg-muted text-muted-foreground">{p}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
