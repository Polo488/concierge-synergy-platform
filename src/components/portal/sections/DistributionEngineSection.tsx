import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/* ── channel config ─────────────────────────────── */
const channels = {
  airbnb:  { label: 'Airbnb',      bg: 'bg-[hsl(0,84%,60%)]/12',  border: 'border-[hsl(0,84%,60%)]/25',  text: 'text-[hsl(0,84%,55%)]',  dot: 'hsl(0,84%,60%)' },
  booking: { label: 'Booking.com', bg: 'bg-[hsl(217,91%,60%)]/12', border: 'border-[hsl(217,91%,60%)]/25', text: 'text-[hsl(217,91%,50%)]', dot: 'hsl(217,91%,60%)' },
  vrbo:    { label: 'Vrbo',        bg: 'bg-[hsl(210,70%,50%)]/12', border: 'border-[hsl(210,70%,50%)]/25', text: 'text-[hsl(210,70%,45%)]', dot: 'hsl(210,70%,50%)' },
  direct:  { label: 'Direct',      bg: 'bg-[hsl(152,50%,45%)]/12', border: 'border-[hsl(152,50%,45%)]/25', text: 'text-[hsl(152,50%,40%)]', dot: 'hsl(152,50%,45%)' },
} as const;
type Channel = keyof typeof channels;

/* ── mock data ──────────────────────────────────── */
const days   = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const dates  = [27, 28, 29, 30, 31, 1, 2];

const properties = [
  { name: 'Studio Vieux-Port',    type: 'T1', price: '89€' },
  { name: 'Apt. Bellecour',       type: 'T2', price: '125€' },
  { name: 'Maison Plage',         type: 'T3', price: '195€' },
  { name: 'Loft Part-Dieu',       type: 'T2', price: '110€' },
  { name: 'Villa Presqu\'île',    type: 'T4', price: '245€' },
];

interface Booking {
  property: number;
  start: number;
  duration: number;
  guest: string;
  channel: Channel;
  status: 'confirmed' | 'pending';
}

const initialBookings: Booking[] = [
  { property: 0, start: 0, duration: 3, guest: 'Martin D.',       channel: 'airbnb',  status: 'confirmed' },
  { property: 0, start: 5, duration: 2, guest: 'Sophie L.',       channel: 'booking', status: 'pending' },
  { property: 1, start: 1, duration: 4, guest: 'Jean-Pierre M.',  channel: 'airbnb',  status: 'confirmed' },
  { property: 2, start: 0, duration: 2, guest: 'Claire B.',       channel: 'direct',  status: 'confirmed' },
  { property: 2, start: 3, duration: 4, guest: 'Thomas R.',       channel: 'booking', status: 'confirmed' },
  { property: 3, start: 2, duration: 3, guest: 'Marie V.',        channel: 'vrbo',    status: 'confirmed' },
  { property: 4, start: 0, duration: 5, guest: 'François G.',     channel: 'airbnb',  status: 'confirmed' },
];

/* simulated incoming booking that propagates */
const incomingBooking: Booking = {
  property: 4, start: 5, duration: 2, guest: 'Laura K.', channel: 'booking', status: 'pending',
};

/* ── component ──────────────────────────────────── */
export function DistributionEngineSection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [50, -35]);

  /* simulation state */
  const [bookings, setBookings]     = useState(initialBookings);
  const [syncStep, setSyncStep]     = useState(0);    // 0-off  1-incoming  2-blocked  3-confirmed
  const [blockedCells, setBlocked]  = useState<string[]>([]);

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setSyncStep(1), 3000);
    const t2 = setTimeout(() => {
      setBookings(prev => [...prev, incomingBooking]);
      setSyncStep(2);
    }, 4200);
    const t3 = setTimeout(() => {
      setBlocked(['4-5', '4-6']);          // block cells on other channels
      setSyncStep(3);
    }, 5400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="distribution">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <motion.p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Distribution
          </motion.p>

          <motion.h2
            className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Un calendrier.
            <br />
            <span className="text-muted-foreground">Tous vos canaux synchronisés.</span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Disponibilités, tarifs et réservations propagés instantanément
            sur Airbnb, Booking.com, Vrbo et vos canaux directs.
            Chaque réservation bloque automatiquement les autres plateformes.
          </motion.p>
        </div>

        {/* Calendar UI */}
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
            <span className="text-[10px] text-muted-foreground mx-auto">app.noe-conciergerie.com/calendar</span>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Janvier 2026</span>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M6 2L3 5L6 8" stroke="currentColor" strokeWidth="1.2" className="text-muted-foreground"/></svg>
                </div>
                <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4 2L7 5L4 8" stroke="currentColor" strokeWidth="1.2" className="text-muted-foreground"/></svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {Object.entries(channels).map(([key, ch]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: ch.dot }} />
                  <span className="text-[10px] text-muted-foreground">{ch.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-x-auto">
            {/* Day headers */}
            <div className="grid" style={{ gridTemplateColumns: '160px repeat(7, 1fr)' }}>
              <div className="p-2 text-[10px] text-muted-foreground bg-muted/20 border-b border-border/20" />
              {days.map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    'p-2 text-center border-l border-b border-border/20',
                    i === 4 && 'bg-primary/[0.04]'
                  )}
                >
                  <div className="text-[10px] text-muted-foreground font-medium">{day}</div>
                  <div className={cn(
                    'text-xs font-semibold mt-0.5',
                    i === 4 ? 'text-primary' : 'text-foreground'
                  )}>
                    {dates[i]}
                  </div>
                </div>
              ))}
            </div>

            {/* Property rows */}
            {properties.map((property, propIndex) => (
              <motion.div
                key={property.name}
                className="grid border-b border-border/15 last:border-b-0"
                style={{ gridTemplateColumns: '160px repeat(7, 1fr)' }}
                initial={{ opacity: 0, x: -12 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.35 + propIndex * 0.07 }}
              >
                {/* Property name cell */}
                <div className="p-2.5 bg-muted/10 flex items-center gap-2.5 border-r border-border/15">
                  <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-primary">{property.type}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-foreground font-medium truncate block">{property.name}</span>
                    <span className="text-[9px] text-muted-foreground">{property.price}/nuit</span>
                  </div>
                </div>

                {/* Day cells */}
                <div className="col-span-7 relative" style={{ minHeight: 52 }}>
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-7">
                    {days.map((_, i) => {
                      const cellKey = `${propIndex}-${i}`;
                      const isBlockedCell = blockedCells.includes(cellKey);
                      return (
                        <div
                          key={i}
                          className={cn(
                            'border-l border-border/10',
                            i === 0 && 'border-l-0',
                            i === 4 && 'bg-primary/[0.02]'
                          )}
                        >
                          {isBlockedCell && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.06]">
                                <pattern id={`hatch-${cellKey}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                                  <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" />
                                </pattern>
                                <rect width="100%" height="100%" fill={`url(#hatch-${cellKey})`} />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Booking pills */}
                  {bookings
                    .filter((b) => b.property === propIndex)
                    .map((booking, i) => {
                      const ch = channels[booking.channel];
                      const isNew = booking === incomingBooking;
                      return (
                        <motion.div
                          key={`${booking.guest}-${i}`}
                          className={cn(
                            'absolute top-2 bottom-2 rounded-md border flex items-center px-2.5 gap-2 cursor-pointer transition-shadow',
                            ch.bg, ch.border,
                            'hover:shadow-md hover:scale-[1.02]'
                          )}
                          style={{
                            left: `${(booking.start / 7) * 100}%`,
                            width: `${(booking.duration / 7) * 100}%`,
                            zIndex: 2,
                          }}
                          initial={isNew ? { opacity: 0, scale: 0.85, y: -8 } : { opacity: 0, x: -6 }}
                          animate={isNew
                            ? { opacity: 1, scale: 1, y: 0 }
                            : (isInView ? { opacity: 1, x: 0 } : {})
                          }
                          transition={isNew
                            ? { duration: 0.5, type: 'spring' }
                            : { duration: 0.5, delay: 0.5 + propIndex * 0.06 + i * 0.08 }
                          }
                        >
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ch.dot }} />
                          <span className={cn('text-[10px] font-medium truncate', ch.text)}>
                            {booking.guest}
                          </span>
                          {booking.status === 'pending' && (
                            <span className="text-[8px] px-1 py-px rounded bg-[hsl(35,80%,50%)]/15 text-[hsl(35,80%,50%)] font-medium shrink-0 ml-auto">
                              En attente
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sync simulation footer */}
          <motion.div
            className="border-t border-border/20 px-4 py-2.5 flex items-center justify-between bg-muted/20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: syncStep >= 3 ? 'hsl(152,50%,45%)' : syncStep >= 1 ? 'hsl(35,80%,50%)' : 'hsl(var(--muted-foreground))' }}
                animate={syncStep >= 1 && syncStep < 3 ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-[10px] text-muted-foreground font-medium">
                {syncStep === 0 && 'Tous les canaux synchronisés'}
                {syncStep === 1 && 'Réservation entrante détectée — Booking.com'}
                {syncStep === 2 && 'Propagation en cours → blocage Airbnb, Vrbo, Direct'}
                {syncStep === 3 && 'Synchronisation complète · 4 canaux mis à jour'}
              </span>
            </div>
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={syncStep >= 3 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              {Object.entries(channels).map(([key, ch]) => (
                <motion.div
                  key={key}
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: `${ch.dot}20` }}
                  initial={{ scale: 0 }}
                  animate={syncStep >= 3 ? { scale: 1 } : {}}
                  transition={{ type: 'spring', delay: Math.random() * 0.3 }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke={ch.dot} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
