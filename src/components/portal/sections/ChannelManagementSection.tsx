import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const channels = {
  airbnb:  { label: 'Airbnb',      dot: 'hsl(0,84%,60%)',    bg: 'hsl(0,84%,60%,0.08)',   border: 'hsl(0,84%,60%,0.2)'   },
  booking: { label: 'Booking.com', dot: 'hsl(217,91%,60%)',  bg: 'hsl(217,91%,60%,0.08)', border: 'hsl(217,91%,60%,0.2)' },
  vrbo:    { label: 'Vrbo',        dot: 'hsl(210,70%,50%)',   bg: 'hsl(210,70%,50%,0.08)', border: 'hsl(210,70%,50%,0.2)' },
  direct:  { label: 'Direct',      dot: 'hsl(152,50%,45%)',   bg: 'hsl(152,50%,45%,0.08)', border: 'hsl(152,50%,45%,0.2)' },
} as const;
type Ch = keyof typeof channels;

const properties = [
  { name: 'Studio Vieux-Port',  type: 'T1', price: '89€',  bookings: [{ start: 0, dur: 3, guest: 'Martin D.',      ch: 'airbnb'  as Ch }, { start: 5, dur: 2, guest: 'Sophie L.',   ch: 'booking' as Ch }] },
  { name: 'Apt. Bellecour',     type: 'T2', price: '125€', bookings: [{ start: 1, dur: 4, guest: 'Jean-Pierre M.', ch: 'airbnb'  as Ch }] },
  { name: 'Maison Plage',       type: 'T3', price: '195€', bookings: [{ start: 0, dur: 2, guest: 'Claire B.',      ch: 'direct'  as Ch }, { start: 3, dur: 4, guest: 'Thomas R.',   ch: 'booking' as Ch }] },
  { name: 'Loft Part-Dieu',     type: 'T2', price: '110€', bookings: [{ start: 2, dur: 3, guest: 'Marie V.',       ch: 'vrbo'    as Ch }] },
  { name: "Villa Presqu'île",   type: 'T4', price: '245€', bookings: [{ start: 0, dur: 5, guest: 'François G.',    ch: 'airbnb'  as Ch }] },
];

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const dates = [27, 28, 29, 30, 31, 1, 2];

export function ChannelManagementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [60, -40]);

  const [syncStep, setSyncStep] = useState(0);
  const [newBooking, setNewBooking] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setSyncStep(1), 2800);
    const t2 = setTimeout(() => { setNewBooking(true); setSyncStep(2); }, 4000);
    const t3 = setTimeout(() => setSyncStep(3), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="channel-management">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <motion.p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Channel Management
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Un inventaire.
            <br />
            <span className="text-muted-foreground">Partout, en simultané.</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Calendriers, tarifs et disponibilités propagés instantanément sur chaque plateforme.
            Une réservation bloque tout — sans délai, sans surréservation.
          </motion.p>
          <motion.p
            className="mt-4 text-sm text-muted-foreground/70 italic"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            Infrastructure-level tooling. Entry-level pricing.
          </motion.p>
        </div>

        {/* Multi-calendar UI */}
        <motion.div
          className="border border-border/40 rounded-2xl overflow-hidden bg-card shadow-sm"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
            <span className="text-[10px] text-muted-foreground mx-auto font-mono">app.noe.io / calendar</span>
            <div className="flex items-center gap-2">
              {Object.entries(channels).map(([k, ch]) => (
                <div key={k} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: ch.dot }} />
                  <span className="text-[9px] text-muted-foreground hidden sm:block">{ch.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar row */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-muted/10">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold text-foreground">Janvier 2026</span>
              <div className="flex gap-1">
                {['◂', '▸'].map(a => (
                  <button key={a} className="w-6 h-6 text-[10px] rounded bg-muted text-muted-foreground flex items-center justify-center">{a}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[10px] text-muted-foreground">5 logements · 4 canaux</div>
              <div className="px-2 py-0.5 rounded-full text-[9px] bg-primary/10 text-primary font-medium">Synchronisé</div>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="overflow-x-auto">
            {/* Day headers */}
            <div className="grid min-w-[600px]" style={{ gridTemplateColumns: '140px repeat(7, 1fr)' }}>
              <div className="h-9 bg-muted/20 border-b border-border/15" />
              {days.map((d, i) => (
                <div key={d} className={cn('h-9 flex flex-col items-center justify-center border-l border-b border-border/15', i === 4 && 'bg-primary/[0.03]')}>
                  <span className="text-[9px] text-muted-foreground">{d}</span>
                  <span className={cn('text-[11px] font-semibold', i === 4 ? 'text-primary' : 'text-foreground')}>{dates[i]}</span>
                </div>
              ))}
            </div>

            {/* Property rows */}
            {properties.map((prop, pi) => (
              <motion.div
                key={prop.name}
                className="grid min-w-[600px] border-b border-border/10 last:border-b-0"
                style={{ gridTemplateColumns: '140px repeat(7, 1fr)' }}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.35 + pi * 0.07 }}
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/10 border-r border-border/10">
                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-primary">{prop.type}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-foreground truncate">{prop.name}</p>
                    <p className="text-[9px] text-muted-foreground">{prop.price}/nuit</p>
                  </div>
                </div>
                <div className="col-span-7 relative" style={{ minHeight: 44 }}>
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                    {days.map((_, ci) => (
                      <div key={ci} className={cn('border-l border-border/8', ci === 4 && 'bg-primary/[0.015]')} />
                    ))}
                  </div>
                  {/* Booking pills */}
                  {prop.bookings.map((b, bi) => {
                    const ch = channels[b.ch];
                    const isNew = pi === 4 && bi === 0 && newBooking;
                    return (
                      <motion.div
                        key={bi}
                        className="absolute top-2 bottom-2 rounded flex items-center px-2 gap-1.5 border text-[9px] font-medium cursor-pointer"
                        style={{
                          left: `${(b.start / 7) * 100}%`,
                          width: `${(b.dur / 7) * 100}%`,
                          background: ch.bg,
                          borderColor: ch.border,
                          color: ch.dot,
                          zIndex: 2,
                        }}
                        initial={isNew ? { opacity: 0, scale: 0.85, y: -8 } : { opacity: 0 }}
                        animate={isNew ? { opacity: 1, scale: 1, y: 0 } : (isInView ? { opacity: 1 } : {})}
                        transition={isNew ? { type: 'spring', duration: 0.5 } : { duration: 0.4, delay: 0.5 + pi * 0.06 + bi * 0.08 }}
                      >
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ background: ch.dot }} />
                        <span className="truncate">{b.guest}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sync footer */}
          <div className="border-t border-border/20 px-4 py-2.5 flex items-center justify-between bg-muted/15">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: syncStep >= 3 ? 'hsl(152,50%,45%)' : syncStep >= 1 ? 'hsl(35,80%,50%)' : 'hsl(var(--muted-foreground))' }}
                animate={syncStep >= 1 && syncStep < 3 ? { scale: [1, 1.6, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span className="text-[10px] text-muted-foreground">
                {syncStep === 0 && 'Tous les canaux synchronisés'}
                {syncStep === 1 && 'Réservation entrante — Booking.com'}
                {syncStep === 2 && 'Propagation → blocage Airbnb · Vrbo · Direct'}
                {syncStep === 3 && 'Sync complète · 4 canaux mis à jour'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {Object.entries(channels).map(([k, ch]) => (
                <motion.div
                  key={k}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: `${ch.dot}18` }}
                  initial={{ scale: 0 }}
                  animate={syncStep >= 3 ? { scale: 1 } : {}}
                  transition={{ type: 'spring', delay: 0.05 * Object.keys(channels).indexOf(k) }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke={ch.dot} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
