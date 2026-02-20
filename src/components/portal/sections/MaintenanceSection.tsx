import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Wrench, AlertTriangle, User, Clock, CheckCircle, Calendar, House, Eye, UserPlus, FileText, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Real admin data matching MaintenanceTaskCard + MaintenanceStats ── */

const stats = [
  { title: 'En attente', value: '4', icon: ClipboardList, accent: 'text-primary' },
  { title: 'En cours', value: '3', icon: Clock, accent: 'text-[hsl(217,70%,55%)]' },
  { title: 'Critiques', value: '1', icon: AlertTriangle, accent: 'text-[hsl(0,70%,55%)]', change: { value: 1, type: 'increase' } },
  { title: 'Terminées (mois)', value: '12', icon: CheckCircle, accent: 'text-[hsl(152,50%,45%)]', change: { value: 5, type: 'increase' } },
];

const urgencyConfig: Record<string, { label: string; className: string }> = {
  high: { label: 'Urgent', className: 'bg-[hsl(0,70%,55%)]/15 text-[hsl(0,70%,50%)] border-[hsl(0,70%,55%)]/20' },
  medium: { label: 'Moyen', className: 'bg-[hsl(35,80%,50%)]/15 text-[hsl(35,80%,45%)] border-[hsl(35,80%,50%)]/20' },
  low: { label: 'Faible', className: 'bg-muted text-muted-foreground border-border/30' },
};

interface MockTask {
  id: string;
  title: string;
  description: string;
  property: string;
  internalName: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'inProgress' | 'completed';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  scheduledDate?: string;
  technician?: string;
  materials?: { name: string }[];
  notes?: string;
}

const tasks: MockTask[] = [
  {
    id: 'MNT-0127',
    title: 'Fuite robinet cuisine',
    description: 'Le locataire signale une fuite persistante sous l\'évier de la cuisine. Intervention urgente requise avant prochaine arrivée.',
    property: 'T2 Bellecour',
    internalName: 'BLC-02',
    urgency: 'high',
    status: 'pending',
    createdAt: '20 fév. 2026, 14:22',
    scheduledDate: '21 fév. 2026',
    materials: [{ name: 'Joint silicone' }, { name: 'Clé à molette' }, { name: 'Flexible inox' }],
  },
  {
    id: 'MNT-0126',
    title: 'Serrure porte entrée bloquée',
    description: 'Difficulté d\'ouverture signalée par le voyageur. Cylindre probablement grippé.',
    property: 'Studio Confluence',
    internalName: 'CNF-01',
    urgency: 'medium',
    status: 'inProgress',
    createdAt: '19 fév. 2026, 11:05',
    startedAt: '19 fév. 2026, 16:30',
    technician: 'Pierre Martin',
    materials: [{ name: 'Cylindre euro' }, { name: 'Dégrippant' }],
    notes: 'Pièce commandée, intervention prévue demain matin.',
  },
  {
    id: 'MNT-0125',
    title: 'Climatisation défaillante',
    description: 'Unité intérieure ne produit plus d\'air froid. Filtre vérifié, semble être un problème de gaz.',
    property: 'Loft Part-Dieu',
    internalName: 'PDU-03',
    urgency: 'low',
    status: 'completed',
    createdAt: '17 fév. 2026, 09:15',
    startedAt: '17 fév. 2026, 14:00',
    completedAt: '18 fév. 2026, 10:30',
    technician: 'Jean Dupont',
    materials: [{ name: 'Gaz R410A' }, { name: 'Kit recharge' }],
  },
];

const tabConfig = [
  { value: 'pending', label: 'En attente', count: 1 },
  { value: 'inProgress', label: 'En cours', count: 1 },
  { value: 'completed', label: 'Terminées', count: 1 },
];

export function MaintenanceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -30]);

  const [activeTab, setActiveTab] = useState('pending');
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setSimStep(1), 2200),
      setTimeout(() => setSimStep(2), 3400),
      setTimeout(() => setSimStep(3), 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  const filteredTasks = tasks.filter(t => t.status === activeTab);

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

          {/* Real Maintenance UI */}
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
              <span className="text-[10px] text-muted-foreground mx-auto">app.noe-conciergerie.com/maintenance</span>
            </div>

            {/* Stats row - matching MaintenanceStats */}
            <div className="grid grid-cols-4 gap-px bg-border/20 border-b border-border/20">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    className="bg-card p-3 text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <Icon size={14} className={cn('mx-auto mb-1', stat.accent)} />
                    <p className="text-lg font-bold text-foreground tabular-nums">{stat.value}</p>
                    <p className="text-[8px] text-muted-foreground">{stat.title}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Tabs - matching MaintainanceTabs */}
            <div className="px-4 pt-3 border-b border-border/20">
              <div className="flex gap-1">
                {tabConfig.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      'px-3 py-1.5 text-[11px] font-medium rounded-t-lg transition-colors border-b-2',
                      activeTab === tab.value
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Task cards - matching MaintenanceTaskCard */}
            <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
              {filteredTasks.map((task, i) => {
                const urgency = urgencyConfig[task.urgency];
                return (
                  <motion.div
                    key={task.id}
                    className="border border-border/30 rounded-xl p-3 bg-card hover:shadow-md transition-all duration-150 group"
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Urgency + date row */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-medium border', urgency.className)}>
                            {urgency.label}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            {task.status === 'completed'
                              ? `Terminé le ${task.completedAt}`
                              : task.status === 'inProgress'
                              ? `Commencé le ${task.startedAt}`
                              : `Créé le ${task.createdAt}`}
                          </span>
                          {task.scheduledDate && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded border border-border/30 bg-muted/30 text-muted-foreground flex items-center gap-0.5">
                              <Calendar size={8} />
                              {task.scheduledDate}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <p className="text-xs font-medium text-foreground mb-0.5">{task.title}</p>

                        {/* Property */}
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1.5">
                          <span>{task.property}</span>
                          <span className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/20 text-muted-foreground flex items-center gap-0.5">
                            <House size={8} />
                            {task.internalName}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{task.description}</p>

                        {/* Materials */}
                        {task.materials && task.materials.length > 0 && (
                          <div className="mb-2">
                            <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Matériel</p>
                            <div className="flex flex-wrap gap-1">
                              {task.materials.map((m, j) => (
                                <span key={j} className="text-[9px] px-1.5 py-0.5 rounded border border-border/30 bg-muted/20 text-muted-foreground">
                                  {m.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Technician */}
                        {task.technician && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-[7px] font-medium text-muted-foreground">
                                {task.technician.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-[9px] text-muted-foreground">{task.technician}</span>
                          </div>
                        )}

                        {/* Notes */}
                        {task.notes && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-muted-foreground">
                            <FileText size={9} />
                            <span>{task.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {task.status === 'pending' && (
                          <span className="text-[9px] px-2 py-1 rounded-md bg-primary text-primary-foreground font-medium flex items-center gap-1">
                            <UserPlus size={9} />
                            Assigner
                          </span>
                        )}
                        {task.status === 'inProgress' && (
                          <span className="text-[9px] px-2 py-1 rounded-md bg-primary text-primary-foreground font-medium flex items-center gap-1">
                            <CheckCircle size={9} />
                            Terminer
                          </span>
                        )}
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
                          <Eye size={12} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Simulation: new incident */}
            <motion.div
              className="mx-3 mb-3 mt-1 border border-[hsl(0,70%,55%)]/20 rounded-xl overflow-hidden bg-background"
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
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={simStep >= 1 ? { opacity: 1 } : {}}
                >
                  <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-medium border', urgencyConfig.high.className)}>
                    Urgent
                  </span>
                  <span className="text-xs font-medium text-foreground">Chauffe-eau en panne</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 text-[10px] text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={simStep >= 2 ? { opacity: 1 } : {}}
                >
                  <span>Villa Presqu'île</span>
                  <span className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/20 flex items-center gap-0.5">
                    <House size={8} /> PIL-01
                  </span>
                  <span className="text-[9px] text-muted-foreground">Qualification automatique</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={simStep >= 3 ? { opacity: 1 } : {}}
                >
                  <div className="w-5 h-5 rounded-full bg-[hsl(217,70%,55%)]/10 flex items-center justify-center">
                    <span className="text-[7px] font-medium text-[hsl(217,70%,55%)]">LR</span>
                  </div>
                  <span className="text-[10px] text-foreground font-medium">Lucas Renard assigné → Intervention J+0</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
