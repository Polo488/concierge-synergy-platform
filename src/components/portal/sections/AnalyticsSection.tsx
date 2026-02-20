import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp, TrendingDown, Percent, Euro, BarChart3, Bed,
  CalendarDays, Sparkles, MapPin, Moon, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';

/* ── Tab definitions ────────────────────────────── */
const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble' },
  { id: 'finance', label: 'Finance' },
  { id: 'cleaning', label: 'Ménage' },
  { id: 'geo', label: 'Géographie' },
] as const;
type TabId = typeof tabs[number]['id'];

/* ── Mock data ──────────────────────────────────── */

// Overview KPIs with sparklines
const overviewKpis = [
  { label: 'Réservations', value: '127', change: 12.3, icon: CalendarDays, spark: [45, 52, 48, 61, 58, 72, 68] },
  { label: 'Taux d\'occupation', value: '87.2%', change: 4.1, icon: Percent, spark: [78, 82, 80, 85, 83, 88, 87] },
  { label: 'Chiffre d\'affaires', value: '48 750€', change: 8.7, icon: Euro, spark: [35, 42, 38, 45, 52, 48, 55] },
  { label: 'RevPAR', value: '142€', change: 6.2, icon: BarChart3, spark: [110, 125, 118, 135, 130, 145, 142] },
];

const secondaryKpis = [
  { label: 'Nuits réservées', value: '412', change: 5.8, icon: Moon },
  { label: 'Durée moy. séjour', value: '3.2j', change: -2.1, icon: Clock },
  { label: 'Note moyenne', value: '4.8', change: 1.5, icon: Sparkles },
];

const monthComparison = [
  { label: 'CA', current: 48750, previous: 44850, icon: Euro, format: 'currency' as const },
  { label: 'Occupation', current: 87.2, previous: 83.1, icon: Percent, format: 'percent' as const },
  { label: 'Réservations', current: 127, previous: 113, icon: CalendarDays, format: 'number' as const },
  { label: 'ADR', current: 118, previous: 112, icon: Bed, format: 'currency' as const },
  { label: 'RevPAR', current: 142, previous: 134, icon: BarChart3, format: 'currency' as const },
];

// Finance data
const revenueTrend = [
  { month: 'Juil', value: 38200 }, { month: 'Aoû', value: 52100 }, { month: 'Sep', value: 41800 },
  { month: 'Oct', value: 35600 }, { month: 'Nov', value: 31200 }, { month: 'Déc', value: 44500 }, { month: 'Jan', value: 48750 },
];

const channelRevenue = [
  { channel: 'Airbnb', revenue: 20475, pct: 42, bookings: 53, color: 'hsl(0,84%,60%)' },
  { channel: 'Booking.com', revenue: 15113, pct: 31, bookings: 39, color: 'hsl(217,91%,60%)' },
  { channel: 'Direct', revenue: 8775, pct: 18, bookings: 23, color: 'hsl(152,50%,45%)' },
  { channel: 'Vrbo', revenue: 4387, pct: 9, bookings: 12, color: 'hsl(210,70%,50%)' },
];

const financeKpis = [
  { label: 'CA total', value: '48 750€', change: 8.7, icon: Euro },
  { label: 'ADR', value: '118€', change: 5.4, icon: Bed },
  { label: 'Rev. moy/séjour', value: '384€', change: 3.2, icon: TrendingUp },
  { label: 'RevPAR', value: '142€', change: 6.2, icon: BarChart3 },
  { label: 'Occupation', value: '87.2%', change: 4.1, icon: Percent },
  { label: 'Nuits dispo.', value: '475', change: 0, icon: CalendarDays },
  { label: 'Nuits réservées', value: '412', change: 5.8, icon: Moon },
  { label: 'Val. moy résa.', value: '384€', change: 3.2, icon: Euro },
];

// Cleaning data
const cleaningKpis = [
  { label: 'Ménages effectués', value: '89', change: 7.2, icon: Sparkles },
  { label: 'Taux de repasse', value: '4.2%', change: -18.5, icon: AlertTriangle, inverse: true },
  { label: 'Note qualité moy.', value: '4.7/5', change: 2.1, icon: CheckCircle },
  { label: 'Incidents', value: '3', change: -25, icon: AlertTriangle, inverse: true },
];

const agentPerformance = [
  { name: 'Marie L.', tasks: 28, rating: 4.9, repasse: '2.1%', status: 'good' },
  { name: 'Pierre D.', tasks: 24, rating: 4.7, repasse: '4.5%', status: 'good' },
  { name: 'Sophie M.', tasks: 22, rating: 4.6, repasse: '5.8%', status: 'warning' },
  { name: 'Jean K.', tasks: 15, rating: 4.3, repasse: '8.2%', status: 'risk' },
];

// Geo data
const geoProperties = [
  { name: 'Vieux-Port', occupancy: 92, revenue: 12400, coords: [43.295, 5.374] },
  { name: 'Bellecour', occupancy: 88, revenue: 9800, coords: [45.757, 4.832] },
  { name: 'Part-Dieu', occupancy: 85, revenue: 8600, coords: [45.760, 4.859] },
  { name: 'Confluence', occupancy: 79, revenue: 7200, coords: [45.738, 4.818] },
  { name: 'Presqu\'île', occupancy: 91, revenue: 10750, coords: [45.764, 4.835] },
];

/* ── Helpers ─────────────────────────────────────── */
function ChangeTag({ change, inverse }: { change: number; inverse?: boolean }) {
  const effective = inverse ? -change : change;
  const positive = effective > 0;
  const negative = effective < 0;
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full',
      positive && 'bg-[hsl(152,50%,45%)]/10 text-[hsl(152,50%,40%)]',
      negative && 'bg-[hsl(0,70%,55%)]/10 text-[hsl(0,70%,55%)]',
      !positive && !negative && 'bg-muted text-muted-foreground',
    )}>
      {positive ? <TrendingUp size={8} /> : negative ? <TrendingDown size={8} /> : null}
      {positive && '+'}{change.toFixed(1)}%
    </span>
  );
}

/* ── Sub-panels ──────────────────────────────────── */

function OverviewPanel({ isInView }: { isInView: boolean }) {
  return (
    <div className="space-y-4">
      {/* Priority KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/20 rounded-xl overflow-hidden">
        {overviewKpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              className="bg-card p-3 hover:bg-muted/20 transition-colors group"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="p-1.5 rounded-lg bg-primary/8">
                  <Icon size={12} className="text-primary" />
                </div>
                <ChangeTag change={kpi.change} />
              </div>
              <motion.p
                className="text-xl font-bold text-foreground tabular-nums"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              >
                {kpi.value}
              </motion.p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{kpi.label}</p>
              {/* Mini sparkline */}
              <div className="flex items-end gap-px h-6 mt-2">
                {kpi.spark.map((v, j) => {
                  const max = Math.max(...kpi.spark);
                  return (
                    <motion.div
                      key={j}
                      className="flex-1 rounded-t bg-primary/50"
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${(v / max) * 100}%` } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.05 + j * 0.03 }}
                    />
                  );
                })}
              </div>
              <p className="text-[7px] text-muted-foreground text-right mt-0.5">7 derniers jours</p>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary KPIs */}
      <div className="space-y-1.5">
        {secondaryKpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 + i * 0.06 }}
            >
              <div className="flex items-center gap-2">
                <Icon size={12} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{kpi.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground tabular-nums">{kpi.value}</span>
                <ChangeTag change={kpi.change} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Month comparison bars */}
      <div className="pt-2 border-t border-border/20">
        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Ce mois vs mois précédent</p>
        <div className="space-y-2">
          {monthComparison.map((m, i) => {
            const Icon = m.icon;
            const max = Math.max(m.current, m.previous);
            const change = m.previous > 0 ? ((m.current - m.previous) / m.previous * 100) : 0;
            return (
              <motion.div
                key={m.label}
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.06 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon size={10} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{m.label}</span>
                  </div>
                  <ChangeTag change={change} />
                </div>
                <div className="flex gap-1 items-center">
                  <motion.div
                    className="h-1.5 rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(m.current / max) * 70}%` } : {}}
                    transition={{ duration: 0.6, delay: 1 + i * 0.06 }}
                  />
                  <span className="text-[8px] text-foreground font-medium tabular-nums w-12 text-right">
                    {m.format === 'currency' ? `${m.current.toLocaleString('fr-FR')}€` : m.format === 'percent' ? `${m.current}%` : m.current}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <motion.div
                    className="h-1.5 rounded-full bg-muted-foreground/30"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(m.previous / max) * 70}%` } : {}}
                    transition={{ duration: 0.6, delay: 1.05 + i * 0.06 }}
                  />
                  <span className="text-[8px] text-muted-foreground tabular-nums w-12 text-right">
                    {m.format === 'currency' ? `${m.previous.toLocaleString('fr-FR')}€` : m.format === 'percent' ? `${m.previous}%` : m.previous}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FinancePanel({ isInView }: { isInView: boolean }) {
  const maxRev = Math.max(...revenueTrend.map(d => d.value));
  return (
    <div className="space-y-4">
      {/* Finance KPIs grid */}
      <div className="grid grid-cols-4 gap-px bg-border/20 rounded-xl overflow-hidden">
        {financeKpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              className="bg-card p-2.5 hover:bg-muted/20 transition-colors"
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div className="flex items-center gap-1 mb-1">
                <div className="p-1 rounded bg-[hsl(25,80%,55%)]/10">
                  <Icon size={10} className="text-[hsl(25,80%,55%)]" />
                </div>
              </div>
              <p className="text-sm font-bold text-foreground tabular-nums">{kpi.value}</p>
              <p className="text-[8px] text-muted-foreground">{kpi.label}</p>
              {kpi.change !== 0 && <ChangeTag change={kpi.change} />}
            </motion.div>
          );
        })}
      </div>

      {/* Revenue chart */}
      <div>
        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mb-2">
          Évolution CA · 7 derniers mois
        </p>
        <div className="flex items-end gap-1.5 h-24">
          {revenueTrend.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t bg-[hsl(25,80%,55%)]/60 hover:bg-[hsl(25,80%,55%)] transition-colors relative group"
                initial={{ height: 0 }}
                animate={isInView ? { height: `${(d.value / maxRev) * 100}%` } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.07 }}
                style={{ minHeight: 4 }}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-foreground font-medium bg-card border border-border/30 px-1 py-0.5 rounded whitespace-nowrap">
                  {(d.value / 1000).toFixed(1)}k€
                </div>
              </motion.div>
              <span className="text-[7px] text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Channel donut + breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mb-2">CA par canal</p>
          {/* Simple donut via stacked bar */}
          <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mb-2">
            {channelRevenue.map((ch, i) => (
              <motion.div
                key={ch.channel}
                className="h-full"
                style={{ backgroundColor: ch.color }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${ch.pct}%` } : {}}
                transition={{ duration: 0.7, delay: 0.8 + i * 0.08 }}
              />
            ))}
          </div>
          {channelRevenue.map((ch) => (
            <div key={ch.channel} className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                <span className="text-[9px] text-muted-foreground">{ch.channel}</span>
              </div>
              <span className="text-[9px] font-medium text-foreground">{ch.pct}%</span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Réservations/canal</p>
          {channelRevenue.map((ch, i) => (
            <motion.div key={ch.channel} className="mb-1.5"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 + i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] text-muted-foreground">{ch.channel}</span>
                <span className="text-[9px] font-medium text-foreground">{ch.bookings}</span>
              </div>
              <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: ch.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(ch.bookings / 53) * 100}%` } : {}}
                  transition={{ duration: 0.6, delay: 1 + i * 0.06 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CleaningPanel({ isInView }: { isInView: boolean }) {
  return (
    <div className="space-y-4">
      {/* Cleaning KPIs */}
      <div className="grid grid-cols-2 gap-px bg-border/20 rounded-xl overflow-hidden">
        {cleaningKpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              className="bg-card p-3 hover:bg-muted/20 transition-colors"
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className={cn('p-1.5 rounded-lg', i < 1 ? 'bg-primary/8' : i === 1 || i === 3 ? 'bg-[hsl(152,50%,45%)]/10' : 'bg-primary/8')}>
                  <Icon size={12} className={i === 1 || i === 3 ? 'text-[hsl(152,50%,45%)]' : 'text-primary'} />
                </div>
                <ChangeTag change={kpi.change} inverse={kpi.inverse} />
              </div>
              <p className="text-lg font-bold text-foreground tabular-nums">{kpi.value}</p>
              <p className="text-[9px] text-muted-foreground">{kpi.label}</p>
              {/* Performance badge */}
              {kpi.inverse && kpi.change < -10 && (
                <motion.span
                  className="inline-flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded-full bg-[hsl(152,50%,45%)]/10 text-[hsl(152,50%,40%)] font-medium mt-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.08 }}
                >
                  <CheckCircle size={7} /> Performant
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Agent performance table */}
      <div>
        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Performance agents</p>
        <div className="rounded-xl border border-border/20 overflow-hidden">
          <div className="grid grid-cols-12 gap-1 px-3 py-1.5 bg-muted/30 text-[8px] text-muted-foreground font-medium">
            <div className="col-span-4">Agent</div>
            <div className="col-span-2 text-center">Tâches</div>
            <div className="col-span-2 text-center">Note</div>
            <div className="col-span-2 text-center">Repasse</div>
            <div className="col-span-2 text-center">Statut</div>
          </div>
          {agentPerformance.map((agent, i) => (
            <motion.div
              key={agent.name}
              className="grid grid-cols-12 gap-1 px-3 py-2 border-t border-border/10 items-center hover:bg-muted/15 transition-colors"
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              <div className="col-span-4 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-primary">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <span className="text-[10px] font-medium text-foreground">{agent.name}</span>
              </div>
              <div className="col-span-2 text-center text-[10px] font-medium text-foreground">{agent.tasks}</div>
              <div className="col-span-2 text-center text-[10px] font-medium text-foreground">{agent.rating}</div>
              <div className="col-span-2 text-center text-[10px] font-medium text-foreground">{agent.repasse}</div>
              <div className="col-span-2 flex justify-center">
                <span className={cn(
                  'text-[7px] px-1.5 py-0.5 rounded-full font-medium',
                  agent.status === 'good' && 'bg-[hsl(152,50%,45%)]/10 text-[hsl(152,50%,40%)]',
                  agent.status === 'warning' && 'bg-[hsl(35,80%,50%)]/10 text-[hsl(35,80%,50%)]',
                  agent.status === 'risk' && 'bg-[hsl(0,70%,55%)]/10 text-[hsl(0,70%,55%)]',
                )}>
                  {agent.status === 'good' ? 'Performant' : agent.status === 'warning' ? 'À surveiller' : 'Sous-perf.'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeoPanel({ isInView }: { isInView: boolean }) {
  return (
    <div className="space-y-4">
      {/* Map placeholder */}
      <motion.div
        className="rounded-xl bg-muted/30 border border-border/20 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        style={{ height: 180 }}
      >
        {/* Simulated map grid */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 400 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Grid */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25} stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 28} y1="0" x2={i * 28} y2="180" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
            ))}
            {/* Roads */}
            <path d="M0,90 C100,85 200,95 400,88" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none" opacity="0.15" />
            <path d="M180,0 C185,60 175,120 190,180" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none" opacity="0.15" />
            <path d="M50,0 C60,50 80,100 200,140 S350,170 400,160" stroke="hsl(var(--muted-foreground))" strokeWidth="1" fill="none" opacity="0.1" />
          </svg>
        </div>

        {/* Property markers */}
        {geoProperties.map((p, i) => {
          const x = 60 + i * 70;
          const y = 50 + (i % 3) * 40;
          return (
            <motion.div
              key={p.name}
              className="absolute flex flex-col items-center group cursor-pointer"
              style={{ left: x, top: y }}
              initial={{ opacity: 0, scale: 0, y: -10 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ type: 'spring', delay: 0.5 + i * 0.12 }}
            >
              <div className="relative">
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 border-card flex items-center justify-center shadow-md',
                  p.occupancy >= 90 ? 'bg-[hsl(152,50%,45%)]' : p.occupancy >= 80 ? 'bg-primary' : 'bg-[hsl(35,80%,50%)]'
                )}>
                  <MapPin size={10} className="text-white" />
                </div>
                <motion.div
                  className="absolute -inset-1 rounded-full"
                  style={{ background: p.occupancy >= 90 ? 'hsl(152,50%,45%)' : p.occupancy >= 80 ? 'hsl(var(--primary))' : 'hsl(35,80%,50%)' }}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              </div>
              {/* Tooltip on hover */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border/30 rounded-lg px-2 py-1 shadow-lg whitespace-nowrap z-10">
                <p className="text-[9px] font-medium text-foreground">{p.name}</p>
                <p className="text-[8px] text-muted-foreground">{p.occupancy}% · {(p.revenue / 1000).toFixed(1)}k€</p>
              </div>
            </motion.div>
          );
        })}

        {/* Map label */}
        <div className="absolute bottom-2 left-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded text-[8px] text-muted-foreground border border-border/20">
          Lyon & Marseille · 5 biens
        </div>
      </motion.div>

      {/* Property geo table */}
      <div>
        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mb-2">KPIs par quartier</p>
        <div className="space-y-1.5">
          {geoProperties.map((p, i) => (
            <motion.div
              key={p.name}
              className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.06 }}
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  p.occupancy >= 90 ? 'bg-[hsl(152,50%,45%)]' : p.occupancy >= 80 ? 'bg-primary' : 'bg-[hsl(35,80%,50%)]'
                )} />
                <span className="text-[10px] font-medium text-foreground">{p.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-muted-foreground">{p.occupancy}%</span>
                <span className="text-[9px] font-medium text-foreground tabular-nums">{(p.revenue / 1000).toFixed(1)}k€</span>
                {/* Mini bar */}
                <div className="w-12 h-1 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full',
                      p.occupancy >= 90 ? 'bg-[hsl(152,50%,45%)]' : p.occupancy >= 80 ? 'bg-primary' : 'bg-[hsl(35,80%,50%)]'
                    )}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${p.occupancy}%` } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + i * 0.06 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ────────────────────────────────── */
export function AnalyticsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [50, -35]);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="analytics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-xl mb-14">
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
            Comprendre. Ajuster.
            <br />
            <span className="text-muted-foreground">Performer.</span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Quatre tableaux de bord interconnectés. Activité, finance, qualité opérationnelle
            et analyse géographique — calculés en temps réel depuis vos données.
          </motion.p>
        </div>

        {/* Dashboard UI */}
        <motion.div
          className="border border-border/40 rounded-2xl overflow-hidden bg-card"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: cardY }}
          whileHover={{ boxShadow: '0 25px 70px -20px hsl(var(--primary) / 0.10)' }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-muted/30">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,70%,55%)]/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(35,80%,50%)]/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(152,50%,45%)]/50" />
            </div>
            <span className="text-[10px] text-muted-foreground mx-auto">app.noe-conciergerie.com/stats</span>
          </div>

          {/* Toolbar with tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border/20 bg-muted/15 overflow-x-auto">
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, y: -6 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {tab.label}
              </motion.button>
            ))}
            <div className="flex-1" />
            <motion.span
              className="text-[9px] text-muted-foreground px-2 py-1 bg-muted/30 rounded"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              Janvier 2026
            </motion.span>
          </div>

          {/* Tab content */}
          <div className="p-4 min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === 'overview' && <OverviewPanel isInView={isInView} />}
                {activeTab === 'finance' && <FinancePanel isInView={isInView} />}
                {activeTab === 'cleaning' && <CleaningPanel isInView={isInView} />}
                {activeTab === 'geo' && <GeoPanel isInView={isInView} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-border/20 px-4 py-2 flex items-center justify-between bg-muted/15">
            <span className="text-[9px] text-muted-foreground">
              Dernière mise à jour · il y a 2 minutes
            </span>
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[hsl(152,50%,45%)]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[9px] text-muted-foreground">Temps réel</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
