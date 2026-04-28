import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { useSession } from "@/hooks/useFacturationSession";
import { fmtNoCents } from "@/mocks/facturation";
import { cn } from "@/lib/utils";

function CountUp({ to, duration = 1200, fmt: fmtFn }: { to: number; duration?: number; fmt?: (n: number) => string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTs = performance.now();
    let raf = 0;
    const tick = (ts: number) => {
      const t = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(start + (to - start) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{fmtFn ? fmtFn(val) : Math.round(val).toLocaleString("fr-FR")}</>;
}

const SLIDES = [
  { key: "open", title: "Mars 2026", subtitle: "est dans la boîte." },
  { key: "vol", overline: "Tu as facturé", figure: 41, sub: "propriétaires", footer: "sur 41 logements actifs" },
  { key: "ca", figure: 127432, sub: "ont transité pour tes propriétaires", isCurrency: true, chip: "↑ +12% vs février" },
  { key: "honos", overline: "Tu as facturé", figure: 18720, sub: "de prestations ce mois", isCurrency: true, breakdown: [
    { l: "Commission", v: 11240 }, { l: "Ménage (marge)", v: 4200 }, { l: "Keynest", v: 1580 }, { l: "Maintenance + fixes", v: 1700 },
  ] },
  { key: "perf", title: "Meilleur mois depuis octobre 2025", subtitle: "" },
  { key: "arpu", figure: 456, sub: "de revenu moyen par logement", isCurrency: true, chip: "+18€ vs février" },
  { key: "speed", figure: 47, sub: "minutes pour boucler la session", footer: "Plus rapide que ton record précédent ⚡" },
  { key: "recap", title: "Mars 2026 en chiffres", recap: [
    ["Propriétaires", "41"], ["CA transité", "127 432 €"], ["Honoraires", "18 720 €"],
    ["Revenu / logement", "456 €"], ["Durée session", "47 min"], ["Factures en retard", "0"],
  ] },
];

export function WrapCinematic({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = window.setTimeout(() => {
      if (idx < total - 1) setIdx(idx + 1);
    }, 4500) as unknown as number;
    return () => { if (intervalRef.current) window.clearTimeout(intervalRef.current); };
  }, [idx, paused, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx(i => Math.min(total - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx(i => Math.max(0, i - 1));
      if (e.key === " ") { e.preventDefault(); setPaused(p => !p); }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, onClose]);

  const s = SLIDES[idx];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0F0F1E] flex flex-col">
      {/* progress */}
      <div className="flex gap-1 px-6 pt-6">
        {SLIDES.map((_, i) => (
          <div key={i} className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              animate={{ width: i < idx ? "100%" : i === idx ? "100%" : "0%" }}
              transition={{ duration: i === idx && !paused ? 4.5 : 0.2, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 transition-colors z-10">
        <X className="h-5 w-5 text-white/60" strokeWidth={1.5} />
      </button>

      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute inset-0 -z-0 opacity-60 bg-[radial-gradient(circle_at_30%_20%,rgba(255,92,26,0.10),transparent_45%),radial-gradient(circle_at_75%_80%,rgba(107,122,232,0.10),transparent_45%)]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-[820px] text-center px-6"
          >
            {/* Slide rendering */}
            {s.key === "open" && (
              <>
                <h1 className="text-[88px] md:text-[112px] font-extralight tracking-tight text-white leading-none">{s.title}</h1>
                <p className="mt-4 text-[22px] md:text-[26px] text-white/55">{s.subtitle}</p>
              </>
            )}
            {s.key === "vol" && (
              <>
                <p className="text-[20px] text-white/55">{s.overline}</p>
                <p className="mt-3 text-[120px] md:text-[160px] font-extralight text-white leading-none tabular-nums"><CountUp to={s.figure!} /></p>
                <p className="mt-3 text-[24px] text-white/75">{s.sub}</p>
                <p className="mt-6 text-[14px] text-white/40">{s.footer}</p>
              </>
            )}
            {(s.key === "ca" || s.key === "honos" || s.key === "arpu" || s.key === "speed") && (
              <>
                {s.overline && <p className="text-[20px] text-white/55 mb-3">{s.overline}</p>}
                <p className="text-[88px] md:text-[120px] font-extralight text-white leading-none tabular-nums">
                  <CountUp to={s.figure as number} fmt={s.isCurrency ? fmtNoCents : undefined} />
                </p>
                <p className="mt-4 text-[22px] text-white/75">{s.sub}</p>
                {s.chip && (
                  <span className="inline-block mt-5 px-3 py-1 rounded-full bg-[#4ADE80]/12 text-[#4ADE80] text-[12px] font-medium">{s.chip}</span>
                )}
                {s.footer && <p className="mt-5 text-[13px] text-white/45">{s.footer}</p>}
                {s.breakdown && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                    {s.breakdown.map(b => (
                      <div key={b.l} className="rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.05] p-4">
                        <p className="text-[10.5px] uppercase tracking-wider text-white/40">{b.l}</p>
                        <p className="mt-1.5 text-[18px] font-medium text-white tabular-nums">{fmtNoCents(b.v)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {s.key === "perf" && (
              <h2 className="text-[44px] md:text-[60px] font-light text-white tracking-tight leading-tight">{s.title}</h2>
            )}
            {s.key === "recap" && (
              <>
                <h2 className="text-[40px] font-light text-white tracking-tight">{s.title}</h2>
                <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-4 max-w-xl mx-auto text-left">
                  {s.recap!.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-[13px] text-white/55">{k}</span>
                      <span className="text-[15px] text-white font-medium tabular-nums">{v}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-6 pb-6 z-10">
        <button onClick={() => setPaused(!paused)} className="text-[12px] text-white/45 hover:text-white/80 flex items-center gap-1.5">
          <Play className="h-3 w-3" strokeWidth={1.8} /> {paused ? "Reprendre" : "Pause"}
        </button>
        <div className="flex gap-2">
          <button onClick={() => setIdx(i => Math.max(0, i - 1))} className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/70 text-[11.5px]">←</button>
          <button onClick={() => setIdx(i => Math.min(total - 1, i + 1))} className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/70 text-[11.5px]">→</button>
        </div>
        <button onClick={onClose} className="text-[12px] text-white/45 hover:text-white/80">Passer →</button>
      </div>
    </div>
  );
}

export function StepWrap() {
  const { wrapSeen, setWrapSeen } = useSession();
  const [autoPlay, setAutoPlay] = useState(!wrapSeen);

  if (autoPlay) {
    return <WrapCinematic onClose={() => { setAutoPlay(false); setWrapSeen(true); }} />;
  }

  return (
    <div className="rounded-[20px] bg-white/[0.03] ring-1 ring-inset ring-white/[0.06] p-10 max-w-[640px] mx-auto text-center">
      <h2 className="text-[28px] font-light text-white">Mars 2026</h2>
      <p className="text-[14px] text-white/55 mt-1.5">Bilan disponible</p>

      <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-3 max-w-md mx-auto text-left">
        {[
          ["Propriétaires", "41"], ["CA transité", "127 432 €"], ["Honoraires", "18 720 €"],
          ["Revenu / logement", "456 €"], ["Session", "47 min"], ["En retard", "0"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <span className="text-[12.5px] text-white/55">{k}</span>
            <span className="text-[14px] text-white font-medium tabular-nums">{v}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setAutoPlay(true)}
        className="mt-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[13px] font-semibold"
      >
        <Play className="h-4 w-4" strokeWidth={1.8} /> Rejouer la cinématique
      </button>
    </div>
  );
}
