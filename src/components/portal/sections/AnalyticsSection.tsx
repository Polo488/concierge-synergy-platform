import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const kpis = [
  { label: 'Taux d\'occupation', value: '87%', change: '+4.2%', positive: true },
  { label: 'RevPAR', value: '142€', change: '+12€', positive: true },
  { label: 'Durée moyenne séjour', value: '3.2j', change: '-0.3j', positive: false },
  { label: 'Note moyenne', value: '4.8', change: '+0.1', positive: true },
];

const monthlyData = [
  { month: 'Juil', value: 72 },
  { month: 'Aoû', value: 91 },
  { month: 'Sep', value: 78 },
  { month: 'Oct', value: 65 },
  { month: 'Nov', value: 58 },
  { month: 'Déc', value: 82 },
  { month: 'Jan', value: 87 },
];

const channelBreakdown = [
  { channel: 'Airbnb', pct: 42, color: 'hsl(0,84%,60%)' },
  { channel: 'Booking', pct: 31, color: 'hsl(217,91%,60%)' },
  { channel: 'Direct', pct: 18, color: 'hsl(152,50%,45%)' },
  { channel: 'Autres', pct: 9, color: 'hsl(var(--muted-foreground))' },
];

export function AnalyticsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -30]);

  const maxVal = Math.max(...monthlyData.map(d => d.value));

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="analytics">
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
              Analytique
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Vos données parlent.
              <br />
              <span className="text-muted-foreground">L'infrastructure traduit.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Occupation, revenus, performances par canal et par bien.
              Chaque métrique est calculée en temps réel à partir des données opérationnelles.
            </motion.p>

            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {['Tableaux de bord temps réel', 'Ventilation par canal', 'Export automatisé'].map((item, i) => (
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

          {/* Analytics Dashboard UI */}
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
              <span className="text-[10px] text-muted-foreground mx-auto">analytique · vue d'ensemble</span>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-4 gap-px bg-border/20">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  className="bg-card p-3 text-center group hover:bg-muted/20 transition-colors"
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <motion.p
                    className="text-lg font-bold text-foreground tabular-nums"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                  >
                    {kpi.value}
                  </motion.p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{kpi.label}</p>
                  <motion.span
                    className={`text-[9px] font-medium ${kpi.positive ? 'text-[hsl(152,50%,45%)]' : 'text-[hsl(0,70%,55%)]'}`}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    {kpi.change}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Chart area */}
            <div className="p-4">
              <p className="text-[10px] text-muted-foreground font-medium mb-3 uppercase tracking-wide">
                Taux d'occupation · 7 derniers mois
              </p>
              <div className="flex items-end gap-2 h-28">
                {monthlyData.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full rounded-t bg-primary/70 group-hover:bg-primary transition-colors relative overflow-hidden"
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${(d.value / maxVal) * 100}%` } : {}}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scaleX: 1.1 }}
                      style={{ minHeight: 4 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-primary/20"
                        initial={{ y: '100%' }}
                        whileHover={{ y: '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    <span className="text-[8px] text-muted-foreground">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel breakdown */}
            <div className="px-4 pb-4">
              <p className="text-[10px] text-muted-foreground font-medium mb-2 uppercase tracking-wide">
                Répartition par canal
              </p>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-2">
                {channelBreakdown.map((ch, i) => (
                  <motion.div
                    key={ch.channel}
                    className="h-full rounded-full"
                    style={{ backgroundColor: ch.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${ch.pct}%` } : {}}
                    transition={{ duration: 0.8, delay: 0.9 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                {channelBreakdown.map((ch, i) => (
                  <motion.div
                    key={ch.channel}
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.1 + i * 0.08 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className="text-[9px] text-muted-foreground">{ch.channel} {ch.pct}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
