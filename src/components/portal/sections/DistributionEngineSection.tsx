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

function ConnectionNode({ platform, index, isVisible }: { platform: typeof platforms[0]; index: number; isVisible: boolean }) {
  const angle = (index * 60) - 90;
  const radius = 160;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <>
      {/* Connection line */}
      <motion.line
        x1="200" y1="200"
        x2={200 + x} y2={200 + y}
        stroke={platform.color}
        strokeWidth="1"
        strokeOpacity="0.3"
        initial={{ pathLength: 0 }}
        animate={isVisible ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
      />
      {/* Sync pulse */}
      <motion.circle
        cx={200 + x} cy={200 + y}
        r="4"
        fill={platform.color}
        initial={{ scale: 0, opacity: 0 }}
        animate={isVisible ? { scale: [0, 1.2, 1], opacity: [0, 1, 0.8] } : {}}
        transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
      />
      {/* Platform label */}
      <motion.text
        x={200 + x * 1.25} y={200 + y * 1.25}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[10px] fill-muted-foreground font-medium"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.8 + index * 0.15 }}
      >
        {platform.name}
      </motion.text>
    </>
  );
}

export function DistributionEngineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [syncPulse, setSyncPulse] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setSyncPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-6"
              style={{
                background: 'hsla(220, 70%, 50%, 0.06)',
                color: 'hsl(var(--primary))',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              MOTEUR DE DISTRIBUTION
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Un nœud central
              <br />
              <span className="text-muted-foreground">pour tous vos canaux.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-4 leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Calendriers, tarifs et disponibilités synchronisés en temps réel
              sur l'ensemble de vos plateformes de distribution.
              Chaque modification se propage en moins de 2 minutes.
            </motion.p>

            <motion.div
              className="mt-8 space-y-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {[
                'Propagation bidirectionnelle des réservations',
                'Gestion centralisée des tarifs et restrictions',
                'Historique complet des synchronisations',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Interactive diagram */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <svg viewBox="0 0 400 400" className="w-full max-w-md">
              {/* Center hub */}
              <motion.circle
                cx="200" cy="200" r="30"
                fill="hsla(220, 70%, 50%, 0.1)"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5 }}
              />
              <motion.text
                x="200" y="200"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-primary font-semibold"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                Noé
              </motion.text>

              {/* Sync pulse ring */}
              <motion.circle
                cx="200" cy="200" r="30"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                animate={syncPulse ? { r: [30, 50], opacity: [0.4, 0] } : { r: 30, opacity: 0 }}
                transition={{ duration: 1 }}
              />

              {/* Platform nodes */}
              {platforms.map((p, i) => (
                <ConnectionNode key={p.name} platform={p} index={i} isVisible={isInView} />
              ))}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
