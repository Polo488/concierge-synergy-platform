import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const invoiceFields = [
  { label: 'Propriétaire', value: 'SCI Bellecour' },
  { label: 'Période', value: 'Janvier 2026' },
  { label: 'Réservations', value: '8' },
  { label: 'CA brut', value: '4 280,00€' },
  { label: 'Upsells', value: '340,00€' },
  { label: 'Commission (20%)', value: '924,00€' },
  { label: 'Charges', value: '124,50€' },
  { label: 'Net propriétaire', value: '3 571,50€' },
];

export function BillingEngineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [30, -20]);
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
    }, 260);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Invoice preview */}
          <motion.div
            className="order-2 lg:order-1 border border-border/40 rounded-2xl p-7 bg-card"
            initial={{ opacity: 0, x: -30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: cardY }}
            whileHover={{ scale: 1.01, boxShadow: '0 20px 50px -15px hsla(220, 70%, 50%, 0.08)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                  Facture
                </p>
                <p className="text-sm font-medium text-foreground mt-1">F-2026-0142</p>
              </div>
              <motion.span
                className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{
                  background: 'hsla(152, 45%, 45%, 0.08)',
                  color: 'hsl(var(--status-success))',
                }}
                initial={{ scale: 0 }}
                animate={visibleFields >= invoiceFields.length ? { scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Validée
              </motion.span>
            </div>

            <div className="space-y-0">
              {invoiceFields.map((field, i) => (
                <motion.div
                  key={field.label}
                  className="flex items-center justify-between py-2.5 border-b border-border/20 last:border-0"
                  initial={{ opacity: 0, x: -8 }}
                  animate={i < visibleFields ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-xs text-muted-foreground">{field.label}</span>
                  <span
                    className={`text-xs font-medium ${
                      i === invoiceFields.length - 1
                        ? 'text-foreground text-sm'
                        : 'text-foreground'
                    }`}
                  >
                    {field.value}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-5 pt-3 border-t border-border/20 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={visibleFields >= invoiceFields.length ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-success))]" />
              <span className="text-[10px] text-muted-foreground">
                Traçabilité complète · Horodatage · Audit-ready
              </span>
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <motion.p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Facturation
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Proposez des upsells.
              <br />
              <span className="text-muted-foreground">Sachez ce qu'ils génèrent vraiment.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Les factures sont générées à partir des données de réservation.
              Upsells, commissions et relevés propriétaires sont calculés automatiquement.
              Chaque flux de revenu devient traçable.
            </motion.p>

            <motion.div
              className="mt-8 inline-flex items-baseline gap-2 border border-border/40 rounded-xl px-5 py-3"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-2xl font-semibold text-foreground">2€</span>
              <span className="text-xs text-muted-foreground">par facture générée</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
