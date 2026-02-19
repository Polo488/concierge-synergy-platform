import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const platforms = [
  { name: 'Airbnb', color: 'hsl(0, 84%, 60%)' },
  { name: 'Booking.com', color: 'hsl(217, 91%, 60%)' },
  { name: 'Vrbo', color: 'hsl(210, 70%, 50%)' },
  { name: 'Abritel', color: 'hsl(25, 80%, 55%)' },
  { name: 'Expedia', color: 'hsl(45, 90%, 50%)' },
  { name: 'Direct', color: 'hsl(152, 50%, 45%)' },
];

export function DistributionEngineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activePulse, setActivePulse] = useState(-1);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActivePulse(p => (p + 1) % platforms.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <div>
            <motion.p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              Distribution
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-[2.6rem] font-semibold text-foreground leading-[1.15] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Un nœud central
              <br />
              <span className="text-muted-foreground">pour tous vos canaux.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Calendriers, tarifs et disponibilités synchronisés
              sur l'ensemble de vos plateformes.
              Chaque modification se propage en moins de 2 minutes.
            </motion.p>

            <motion.div
              className="mt-8 space-y-2.5"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {[
                'Propagation bidirectionnelle',
                'Gestion centralisée des tarifs',
                'Historique complet des syncs',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-primary/50" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Diagram */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <svg viewBox="0 0 400 400" className="w-full max-w-sm">
              {/* Center hub */}
              <motion.circle
                cx="200" cy="200" r="28"
                fill="hsla(220, 70%, 50%, 0.06)"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5 }}
              />
              <motion.text
                x="200" y="201"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] fill-primary font-medium"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                Noé
              </motion.text>

              {/* Sync pulse */}
              {activePulse >= 0 && (
                <motion.circle
                  cx="200" cy="200" r="28"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.5"
                  key={activePulse}
                  initial={{ r: 28, opacity: 0.3 }}
                  animate={{ r: 55, opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              )}

              {/* Platform nodes */}
              {platforms.map((p, i) => {
                const angle = (i * 60) - 90;
                const radius = 140;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const isActive = activePulse === i;

                return (
                  <g key={p.name}>
                    <motion.line
                      x1="200" y1="200"
                      x2={200 + x} y2={200 + y}
                      stroke={p.color}
                      strokeWidth="0.8"
                      strokeOpacity={isActive ? 0.5 : 0.15}
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : {}}
                      transition={{ duration: 0.7, delay: 0.3 + i * 0.12 }}
                    />
                    <motion.circle
                      cx={200 + x} cy={200 + y}
                      r={isActive ? 5 : 3.5}
                      fill={p.color}
                      fillOpacity={isActive ? 0.8 : 0.4}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                    />
                    <motion.text
                      x={200 + x * 1.22} y={200 + y * 1.22}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] fill-muted-foreground font-medium"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.7 + i * 0.12 }}
                    >
                      {p.name}
                    </motion.text>
                  </g>
                );
              })}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
