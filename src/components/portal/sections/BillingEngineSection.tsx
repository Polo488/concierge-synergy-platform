import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const invoiceFields = [
  { label: 'Propriétaire', value: 'SCI Bellecour' },
  { label: 'Période', value: 'Janvier 2026' },
  { label: 'Réservations', value: '8' },
  { label: 'CA brut', value: '4 280,00€' },
  { label: 'Commission (20%)', value: '856,00€' },
  { label: 'Charges', value: '124,50€' },
  { label: 'Net propriétaire', value: '3 299,50€' },
];

export function BillingEngineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [visibleFields, setVisibleFields] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setVisibleFields((prev) => {
        if (prev >= invoiceFields.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Subtle bg */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="billing-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#billing-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Invoice preview */}
          <motion.div
            className="glass-panel rounded-2xl p-6 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Facture générée</p>
                <p className="text-sm font-semibold text-foreground mt-1">F-2026-0142</p>
              </div>
              <motion.div
                className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{
                  background: 'hsla(152, 45%, 45%, 0.1)',
                  color: 'hsl(var(--status-success))',
                }}
                initial={{ scale: 0 }}
                animate={visibleFields >= invoiceFields.length ? { scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Validée ✓
              </motion.div>
            </div>

            <div className="space-y-2.5">
              {invoiceFields.map((field, i) => (
                <motion.div
                  key={field.label}
                  className="flex items-center justify-between py-1.5 border-b last:border-0"
                  style={{ borderColor: 'hsla(220, 13%, 91%, 0.5)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={i < visibleFields ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-xs text-muted-foreground">{field.label}</span>
                  <span className={`text-xs font-medium ${i === invoiceFields.length - 1 ? 'text-primary text-sm' : 'text-foreground'}`}>
                    {field.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Traceability indicator */}
            <motion.div
              className="mt-4 pt-3 flex items-center gap-2"
              style={{ borderTop: '1px solid hsla(220, 13%, 91%, 0.5)' }}
              initial={{ opacity: 0 }}
              animate={visibleFields >= invoiceFields.length ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(152,50%,45%)]" />
              <span className="text-[10px] text-muted-foreground">Traçabilité complète · Horodatage · Audit-ready</span>
            </motion.div>
          </motion.div>

          {/* Right - text */}
          <div className="order-1 lg:order-2">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-6"
              style={{ background: 'hsla(25, 65%, 55%, 0.08)', color: 'hsl(var(--nav-revenus))' }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
            >
              MOTEUR DE FACTURATION
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Chaque euro,
              <br />
              <span className="text-muted-foreground">documenté et traçable.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-4 leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Facturation automatique à partir des données de réservation.
              Commission, charges, reversement propriétaire — tout est calculé
              et archivé.
            </motion.p>

            <motion.div
              className="mt-8 glass-panel rounded-xl p-4 inline-flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="text-2xl font-semibold text-foreground">2€</span>
              <div>
                <p className="text-xs text-muted-foreground">par facture générée</p>
                <p className="text-[10px] text-muted-foreground/70">Module optionnel · Sans engagement</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
