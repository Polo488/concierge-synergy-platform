import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

const teamMembers = [
  {
    name: 'Sarah K.',
    role: 'Manager',
    roleColor: 'hsl(217,91%,60%)',
    properties: ['Studio Vieux-Port', 'Apt. Bellecour', 'Loft Part-Dieu'],
    status: 'online',
    tasks: 3,
  },
  {
    name: 'Marie L.',
    role: 'Ménage',
    roleColor: 'hsl(35,80%,50%)',
    properties: ['Studio Vieux-Port', 'Maison Plage'],
    status: 'busy',
    tasks: 2,
  },
  {
    name: 'Thomas R.',
    role: 'Maintenance',
    roleColor: 'hsl(0,84%,60%)',
    properties: ['Villa Presqu\'île', 'Apt. Bellecour'],
    status: 'online',
    tasks: 1,
  },
  {
    name: 'Claire B.',
    role: 'Propriétaire',
    roleColor: 'hsl(152,50%,45%)',
    properties: ['Maison Plage', 'Villa Presqu\'île'],
    status: 'offline',
    tasks: 0,
  },
  {
    name: 'François G.',
    role: 'Manager',
    roleColor: 'hsl(217,91%,60%)',
    properties: ['Villa Presqu\'île', 'Loft Part-Dieu'],
    status: 'online',
    tasks: 4,
  },
];

const propertyAssignments = [
  { property: 'Studio Vieux-Port',  T: 'T1', assigned: ['Sarah K.', 'Marie L.'],            coverage: 'Complet' },
  { property: 'Apt. Bellecour',     T: 'T2', assigned: ['Sarah K.', 'Thomas R.'],            coverage: 'Complet' },
  { property: 'Maison Plage',       T: 'T3', assigned: ['Marie L.', 'Claire B.'],            coverage: 'Partiel' },
  { property: 'Loft Part-Dieu',     T: 'T2', assigned: ['Sarah K.', 'François G.'],          coverage: 'Complet' },
  { property: "Villa Presqu'île",   T: 'T4', assigned: ['Thomas R.', 'Claire B.', 'François G.'], coverage: 'Complet' },
];

const statusColor: Record<string, string> = {
  online: 'hsl(152,50%,45%)',
  busy: 'hsl(35,80%,50%)',
  offline: 'hsl(var(--muted-foreground))',
};

export function TeamManagementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [50, -35]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <div>
            <motion.p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
            >
              Gestion d'équipe
            </motion.p>
            <motion.h2
              className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Structurez les équipes.
              <br />
              <span className="text-muted-foreground">Pas le chaos.</span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Rôles, permissions, attributions par logement.
              Chaque membre accède exactement à ce qu'il doit voir — et rien de plus.
            </motion.p>
            <motion.p
              className="mt-4 text-sm text-muted-foreground/70 italic"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              Built for scale, not pricing tiers.
            </motion.p>

            {/* Team member list */}
            <motion.div
              className="mt-10 border border-border/40 rounded-2xl overflow-hidden bg-card"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              style={{ y: cardY }}
              whileHover={{ boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.10)' }}
            >
              <div className="px-4 py-3 border-b border-border/20 bg-muted/20 flex items-center justify-between">
                <p className="text-[11px] font-medium text-foreground">Membres de l'équipe</p>
                <span className="text-[10px] text-muted-foreground">5 utilisateurs · 4 rôles</span>
              </div>
              <div className="divide-y divide-border/10">
                {teamMembers.map((m, i) => (
                  <motion.div
                    key={m.name}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.07 }}
                  >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative"
                      style={{ background: `${m.roleColor}20` }}>
                      <span className="text-[10px] font-bold" style={{ color: m.roleColor }}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </span>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                        style={{ background: statusColor[m.status] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-foreground">{m.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                          style={{ background: `${m.roleColor}15`, color: m.roleColor }}>
                          {m.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {m.properties.slice(0, 2).join(' · ')}{m.properties.length > 2 ? ` +${m.properties.length - 2}` : ''}
                      </p>
                    </div>
                    {m.tasks > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[9px] text-primary font-bold">{m.tasks}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Property assignment panel */}
          <div className="lg:mt-24">
            <motion.div
              className="border border-border/40 rounded-2xl overflow-hidden bg-card"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.10)' }}
            >
              <div className="px-4 py-3 border-b border-border/20 bg-muted/20">
                <p className="text-[11px] font-medium text-foreground">Attribution par logement</p>
              </div>
              <div className="divide-y divide-border/10">
                {propertyAssignments.map((pa, i) => (
                  <motion.div
                    key={pa.property}
                    className="px-4 py-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-primary">{pa.T}</span>
                        </div>
                        <span className="text-[12px] font-medium text-foreground">{pa.property}</span>
                      </div>
                      <span className={cn(
                        'text-[9px] px-1.5 py-0.5 rounded-full font-medium',
                        pa.coverage === 'Complet' ? 'bg-[hsl(152,50%,45%)]/10 text-[hsl(152,50%,45%)]' : 'bg-[hsl(35,80%,50%)]/10 text-[hsl(35,80%,50%)]'
                      )}>
                        {pa.coverage}
                      </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {pa.assigned.map(name => {
                        const member = teamMembers.find(m => m.name === name);
                        return (
                          <div key={name} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: member?.roleColor || 'hsl(var(--muted-foreground))' }} />
                            <span className="text-[9px] text-muted-foreground">{name}</span>
                          </div>
                        );
                      })}
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
