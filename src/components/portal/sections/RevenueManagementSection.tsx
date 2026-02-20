import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const months = ['Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'];
const revenueData = [18400, 22600, 19800, 31200, 24500, 28900];
const maxRevenue = Math.max(...revenueData);

const kpis = [
  { label: 'Revenus bruts', value: '28 900 €', delta: '+14%', positive: true },
  { label: 'Commissions', value: '5 780 €', delta: '20%', positive: null },
  { label: 'Reversement propriétaires', value: '23 120 €', delta: '+14%', positive: true },
  { label: 'Upsells générés', value: '1 240 €', delta: '+32%', positive: true },
];

const reservations = [
  { ref: '#4821', property: 'Studio Vieux-Port', channel: 'Airbnb',      gross: '1 120 €', net: '896 €',   upsell: '45 €' },
  { ref: '#4820', property: 'Apt. Bellecour',    channel: 'Booking.com', gross: '876 €',   net: '701 €',   upsell: '—' },
  { ref: '#4819', property: "Villa Presqu'île",  channel: 'Airbnb',      gross: '2 450 €', net: '1 960 €', upsell: '120 €' },
  { ref: '#4818', property: 'Loft Part-Dieu',    channel: 'Direct',      gross: '658 €',   net: '560 €',   upsell: '—' },
];

const channelColors: Record<string, string> = {
  'Airbnb': 'hsl(0,84%,60%)',
  'Booking.com': 'hsl(217,91%,60%)',
  'Direct': 'hsl(152,50%,45%)',
};

export function RevenueManagementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [50, -35]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="revenue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <motion.p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
          >
            Revenue Management
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Chaque euro.
            <br />
            <span className="text-muted-foreground">Tracé, calculé, reversé.</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Upsells, commissions, reversements propriétaires — calculés automatiquement
            à chaque réservation. Sans tableur, sans approximation.
          </motion.p>
          <motion.p
            className="mt-4 text-sm text-muted-foreground/70 italic"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            Operational depth shouldn't depend on your budget.
          </motion.p>
        </div>

        {/* Revenue dashboard */}
        <motion.div
          className="border border-border/40 rounded-2xl overflow-hidden bg-card"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: cardY }}
          whileHover={{ boxShadow: '0 30px 80px -20px hsl(var(--primary) / 0.12)' }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-muted/30">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,70%,55%)]/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(35,80%,50%)]/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(152,50%,45%)]/40" />
            </div>
            <span className="text-[10px] text-muted-foreground mx-auto font-mono">app.noe.io / revenue</span>
          </div>

          <div className="p-5 lg:p-6">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  className="bg-muted/30 rounded-xl p-3.5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.07 }}
                >
                  <p className="text-[10px] text-muted-foreground mb-1.5">{kpi.label}</p>
                  <p className="text-lg font-semibold text-foreground tabular-nums">{kpi.value}</p>
                  {kpi.positive !== null && (
                    <p className={`text-[10px] mt-1 ${kpi.positive ? 'text-[hsl(152,50%,45%)]' : 'text-muted-foreground'}`}>
                      {kpi.delta}
                    </p>
                  )}
                  {kpi.positive === null && (
                    <p className="text-[10px] mt-1 text-muted-foreground">{kpi.delta} taux</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Revenue chart */}
            <div className="mb-6">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">Revenus bruts — 6 derniers mois</p>
              <div className="flex items-end gap-2 h-28">
                {revenueData.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/20 relative overflow-hidden"
                      style={{ height: `${(v / maxRevenue) * 100}%` }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-primary/60"
                        style={{ transformOrigin: 'bottom' }}
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservation table */}
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Dernières réservations</p>
              <div className="rounded-xl border border-border/20 overflow-hidden">
                <div className="grid text-[9px] font-medium text-muted-foreground uppercase tracking-wide px-3 py-1.5 bg-muted/20 border-b border-border/20" style={{ gridTemplateColumns: '60px 1fr 80px 70px 70px 60px' }}>
                  <span>Réf.</span><span>Logement</span><span>Canal</span><span>Brut</span><span>Net</span><span>Upsell</span>
                </div>
                {reservations.map((r, i) => (
                  <motion.div
                    key={r.ref}
                    className="grid items-center px-3 py-2 border-b border-border/10 last:border-b-0 hover:bg-muted/20 transition-colors"
                    style={{ gridTemplateColumns: '60px 1fr 80px 70px 70px 60px' }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
                  >
                    <span className="text-[10px] font-mono text-muted-foreground">{r.ref}</span>
                    <span className="text-[11px] text-foreground font-medium truncate pr-2">{r.property}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: channelColors[r.channel] || 'hsl(var(--muted-foreground))' }} />
                      <span className="text-[10px] text-muted-foreground truncate">{r.channel}</span>
                    </div>
                    <span className="text-[11px] text-foreground tabular-nums">{r.gross}</span>
                    <span className="text-[11px] text-[hsl(152,50%,45%)] tabular-nums font-medium">{r.net}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{r.upsell}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
