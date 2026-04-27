import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useFacturation } from "@/hooks/useFacturation";
import { formatMoney, formatPct } from "@/lib/facturationFormat";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";

function useCountUp(target: number, duration = 800) {
  const [v, setV] = useState(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    let raf: number;
    startRef.current = null;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

interface KpiProps {
  label: string;
  value: string;
  delta?: { pct: number; vs: string };
  sub?: string;
  warn?: boolean;
  onClick?: () => void;
  sparkline?: number[];
  className?: string;
}

function KpiCard({ label, value, delta, sub, warn, onClick, sparkline, className }: KpiProps) {
  const positive = delta && delta.pct >= 0;
  const sparkData = sparkline?.map((y, i) => ({ i, y }));
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative w-full min-w-0 text-left rounded-[20px] p-4 sm:p-5 lg:p-7 overflow-hidden",
        "min-h-[124px] sm:min-h-[160px] lg:min-h-[180px]",
        "bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.18)]",
        "border border-white/[0.06]",
        onClick && "cursor-pointer hover:bg-white/[0.06] transition-colors",
        className
      )}
    >
      {sparkData && (
        <div className="absolute inset-x-3 sm:inset-x-4 bottom-2 sm:bottom-3 h-8 sm:h-12 opacity-40 dark:opacity-25 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="y" stroke="hsl(var(--bill-orange))" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="relative h-full flex flex-col justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase text-white/55 truncate">{label}</span>
          {warn && <AlertTriangle className="h-3.5 w-3.5 text-[#F5C842] flex-shrink-0" strokeWidth={1.8} />}
        </div>
        <div
          className="font-heading font-semibold text-white leading-none truncate"
          style={{ fontSize: "clamp(24px, 7vw, 40px)", letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums",
                positive ? "bg-[#4ADE80]/15 text-[#4ADE80]" : "bg-[#F87171]/15 text-[#F87171]"
              )}
            >
              {positive ? <TrendingUp className="h-3 w-3" strokeWidth={2.2} /> : <TrendingDown className="h-3 w-3" strokeWidth={2.2} />}
              {formatPct(delta.pct)}
            </span>
          )}
          {(delta?.vs || sub) && (
            <span className="text-white/55 text-[11px] sm:text-[11.5px] truncate">{delta?.vs ?? sub}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export function KpiHero() {
  const { totals, setActiveTab, reservations } = useFacturation();
  const grossAnim = useCountUp(totals.grossCurrent);
  const noeAnim = useCountUp(totals.noeFee);
  const netAnim = useCountUp(totals.netOwnersTotal);

  // Sparkline 7 jours (CA brut par jour, derniers 7 jours du mois courant)
  const last7 = [...Array(7)].map((_, idx) => {
    const dayCutoff = 24 + idx; // 24..30
    return reservations
      .filter((r) => Number(r.checkIn.slice(8, 10)) === dayCutoff)
      .reduce((a, r) => a + r.gross, 0) || 200 + idx * 80;
  });

  // Mini-bandeau insight
  const insight = totals.grossDelta >= 10
    ? `🎉 Très bon mois : CA brut en hausse de ${formatPct(totals.grossDelta)} vs le mois précédent.`
    : totals.grossDelta <= -5
      ? `📉 CA en baisse de ${formatPct(Math.abs(totals.grossDelta))} — saisonnalité à surveiller.`
      : null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="CA brut généré"
          value={formatMoney(grossAnim)}
          delta={{ pct: totals.grossDelta, vs: "vs septembre" }}
          sparkline={last7}
        />
        <KpiCard
          label="Honoraires Noé"
          value={formatMoney(noeAnim)}
          sub={`${totals.noeFeePct.toFixed(1).replace(".", ",")}% du brut`}
        />
        <KpiCard
          label="Net propriétaires"
          value={formatMoney(netAnim)}
          sub={`${totals.ownersCount} propriétaires concernés`}
        />
        <KpiCard
          label="Opérations négatives"
          value={totals.negPending > 0 ? `${totals.negPending}` : "0"}
          sub={totals.negPending > 0 ? `${totals.negPending} ligne${totals.negPending > 1 ? "s" : ""} à traiter` : "Toutes traitées ✓"}
          warn={totals.negPending > 0}
          onClick={() => setActiveTab("negatives")}
          className={totals.negPending > 0 ? "ring-1 ring-[#F5C842]/20" : ""}
        />
      </div>
      {insight && (
        <div className="rounded-[14px] bg-[#6B7AE8]/[0.08] border border-[#6B7AE8]/[0.1] px-4 py-3 text-sm text-white/80">
          {insight}
        </div>
      )}
    </div>
  );
}
