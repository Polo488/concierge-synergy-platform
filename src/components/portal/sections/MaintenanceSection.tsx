import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Wrench, AlertTriangle, User, Clock, CheckCircle2 } from 'lucide-react';

const tickets = [
  { id: 'MNT-0127', issue: 'Fuite robinet cuisine', property: 'T2 Bellecour', priority: 'high', status: 'open', reported: '14:22' },
  { id: 'MNT-0126', issue: 'Serrure porte entrée', property: 'Studio Confluence', priority: 'medium', status: 'assigned', reported: '11:05', tech: 'Pierre M.' },
  { id: 'MNT-0125', issue: 'Climatisation défaillante', property: 'Loft Part-Dieu', priority: 'low', status: 'resolved', reported: 'Hier', tech: 'Jean D.' },
];

const priorityConfig = {
  high: { label: 'Urgent', color: 'text-[hsl(0,70%,55%)]', bg: 'bg-[hsl(0,70%,55%)]/10' },
  medium: { label: 'Moyen', color: 'text-[hsl(35,80%,50%)]', bg: 'bg-[hsl(35,80%,50%)]/10' },
  low: { label: 'Faible', color: 'text-muted-foreground', bg: 'bg-muted' },
};

const statusConfig = {
  open: { label: 'Ouvert', icon: AlertTriangle, color: 'text-[hsl(0,70%,55%)]' },
  assigned: { label: 'Assigné', icon: User, color: 'text-[hsl(217,70%,55%)]' },
  resolved: { label: 'Résolu', icon: CheckCircle2, color: 'text-[hsl(152,50%,45%)]' },
};

export function MaintenanceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -30]);

  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setSimStep(1), 2000),
      setTimeout(() => setSimStep(2), 3200),
      setTimeout(() => setSimStep(3), 4400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="maintenance">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <div>
            <motion.p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Maintenance
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Un incident se déclare.
              <br />
              <span className="text-muted-foreground">L'infrastructure réagit.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Suivi des incidents, qualification automatique, assignation des techniciens 
              et planification des interventions. Chaque signalement devient un ticket traçable.
            </motion.p>

            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {['Qualification automatique', 'Assignation par compétence', 'Historique complet par bien'].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.55 + i * 0.08 }}
                >
                  <div className="w-1 h-1 rounded-full bg-primary/40" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Maintenance UI */}
          <motion.div
            className="border border-border/40 rounded-2xl overflow-hidden bg-card"
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: cardY }}
            whileHover={{ boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.12)' }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,70%,55%)]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(35,80%,50%)]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(152,50%,45%)]/50" />
              </div>
              <span className="text-[10px] text-muted-foreground mx-auto">maintenance · tickets</span>
            </div>

            {/* Header */}
            <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench size={14} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">Tickets actifs</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">3</span>
              </div>
            </div>

            {/* Tickets */}
            <div className="divide-y divide-border/20">
              {tickets.map((ticket, i) => {
                const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig];
                const status = statusConfig[ticket.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={ticket.id}
                    className="px-4 py-3 hover:bg-muted/20 transition-colors group"
                    initial={{ opacity: 0, x: -16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.12 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground">{ticket.id}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${priority.bg} ${priority.color}`}>
                            {priority.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground mt-0.5">{ticket.issue}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">{ticket.property}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock size={9} /> {ticket.reported}
                          </span>
                          {ticket.tech && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <User size={9} /> {ticket.tech}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-[10px] font-medium ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Simulation: new incident */}
            <motion.div
              className="mx-3 mb-3 mt-1 border border-border/30 rounded-xl overflow-hidden bg-background"
              initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
              animate={simStep >= 1 ? { opacity: 1, height: 'auto', marginTop: 4, marginBottom: 12 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="px-3 py-2 bg-[hsl(0,70%,55%)]/5 border-b border-[hsl(0,70%,55%)]/10">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[hsl(0,70%,55%)]"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-medium text-[hsl(0,70%,55%)]">Nouvel incident signalé</span>
                </div>
              </div>
              <div className="px-3 py-2 space-y-1.5">
                <motion.p
                  className="text-xs font-medium text-foreground"
                  initial={{ opacity: 0 }}
                  animate={simStep >= 1 ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  Chauffe-eau en panne → Villa Presqu'île
                </motion.p>
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={simStep >= 2 ? { opacity: 1 } : {}}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(0,70%,55%)]/10 text-[hsl(0,70%,55%)] font-medium">
                    Urgent
                  </span>
                  <span className="text-[10px] text-muted-foreground">Qualification automatique</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={simStep >= 3 ? { opacity: 1 } : {}}
                  transition={{ delay: 0.1 }}
                >
                  <User size={10} className="text-[hsl(217,70%,55%)]" />
                  <span className="text-[10px] text-foreground font-medium">Tech. Plomberie assigné → Intervention J+0</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
