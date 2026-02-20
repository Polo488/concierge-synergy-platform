import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/* ── Mock data matching real ImportedDataSummary + invoice structures ── */

const tabConfig = [
  { id: 'bookings', label: 'Réservations', count: 8 },
  { id: 'properties', label: 'Propriétés', count: 5 },
  { id: 'payments', label: 'Paiements', count: 6 },
  { id: 'invoice', label: 'Facture propriétaire', count: 1 },
];

const bookings = [
  { id: 'R-2026-0891', property: 'Studio Vieux-Port', guest: 'Sophie Laurent', dates: '03 → 07 fév. 2026', amount: '536,00€', status: 'Booked', channel: 'airbnb' },
  { id: 'R-2026-0892', property: 'T2 Bellecour', guest: 'Jean-Pierre Martin', dates: '05 → 10 fév. 2026', amount: '875,00€', status: 'Booked', channel: 'booking' },
  { id: 'R-2026-0893', property: 'Maison Plage', guest: 'Claire Bonnet', dates: '01 → 04 fév. 2026', amount: '585,00€', status: 'Booked', channel: 'direct' },
  { id: 'R-2026-0894', property: 'Loft Part-Dieu', guest: 'Thomas Renard', dates: '08 → 11 fév. 2026', amount: '330,00€', status: 'Tentative', channel: 'booking' },
  { id: 'R-2026-0895', property: 'Villa Presqu\'île', guest: 'François Georges', dates: '01 → 06 fév. 2026', amount: '1 225,00€', status: 'Booked', channel: 'airbnb' },
];

const properties = [
  { name: 'Studio Vieux-Port', bedrooms: 1, bathrooms: 1, surface: '32m²', city: 'Marseille' },
  { name: 'T2 Bellecour', bedrooms: 2, bathrooms: 1, surface: '55m²', city: 'Lyon' },
  { name: 'Maison Plage', bedrooms: 3, bathrooms: 2, surface: '85m²', city: 'Marseille' },
  { name: 'Loft Part-Dieu', bedrooms: 2, bathrooms: 1, surface: '48m²', city: 'Lyon' },
  { name: 'Villa Presqu\'île', bedrooms: 4, bathrooms: 2, surface: '120m²', city: 'Lyon' },
];

const payments = [
  { id: 'PAY-4521', booking: 'R-2026-0891', amount: '536,00€', method: 'Carte', status: 'Captured', date: '28 jan. 2026' },
  { id: 'PAY-4522', booking: 'R-2026-0892', amount: '875,00€', method: 'Virement', status: 'Captured', date: '30 jan. 2026' },
  { id: 'PAY-4523', booking: 'R-2026-0893', amount: '585,00€', method: 'Carte', status: 'Captured', date: '25 jan. 2026' },
  { id: 'PAY-4524', booking: 'R-2026-0894', amount: '330,00€', method: 'Carte', status: 'Pending', date: '02 fév. 2026' },
  { id: 'PAY-4525', booking: 'R-2026-0895', amount: '1 225,00€', method: 'Carte', status: 'Captured', date: '20 jan. 2026' },
];

const invoiceFields = [
  { label: 'Propriétaire', value: 'SCI Bellecour' },
  { label: 'Période', value: 'Février 2026' },
  { label: 'Réservations', value: '8' },
  { label: 'CA brut', value: '4 280,00€' },
  { label: 'Upsells', value: '340,00€' },
  { label: 'Commission (20%)', value: '924,00€' },
  { label: 'Charges', value: '124,50€' },
  { label: 'Net propriétaire', value: '3 571,50€' },
];

const statusColors: Record<string, string> = {
  Booked: 'bg-[hsl(152,50%,45%)]/10 text-[hsl(152,50%,40%)]',
  Tentative: 'bg-[hsl(35,80%,50%)]/10 text-[hsl(35,80%,45%)]',
  Canceled: 'bg-[hsl(0,70%,55%)]/10 text-[hsl(0,70%,50%)]',
  Captured: 'bg-[hsl(152,50%,45%)]/10 text-[hsl(152,50%,40%)]',
  Pending: 'bg-[hsl(35,80%,50%)]/10 text-[hsl(35,80%,45%)]',
  Refunded: 'bg-[hsl(217,70%,55%)]/10 text-[hsl(217,70%,50%)]',
};

export function BillingEngineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setVisibleRows(prev => {
        if (prev >= 5) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Billing UI */}
          <motion.div
            className="order-2 lg:order-1 border border-border/40 rounded-2xl overflow-hidden bg-card"
            initial={{ opacity: 0, x: -30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: cardY }}
            whileHover={{ scale: 1.005, boxShadow: '0 20px 50px -15px hsla(220, 70%, 50%, 0.08)' }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,70%,55%)]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(35,80%,50%)]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(152,50%,45%)]/50" />
              </div>
              <span className="text-[10px] text-muted-foreground mx-auto">app.noe-conciergerie.com/billing</span>
            </div>

            {/* Success banner - matching ImportedDataSummary */}
            <motion.div
              className="mx-3 mt-3 px-3 py-2 rounded-lg border border-[hsl(152,50%,45%)]/20 bg-[hsl(152,50%,45%)]/5"
              initial={{ opacity: 0, y: -8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[11px] font-semibold text-foreground">Résumé de facturation</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                8 réservations, 5 propriétés, 6 paiements traités pour la période de février 2026.
              </p>
            </motion.div>

            {/* Tabs - matching ImportedDataSummary TabsList */}
            <div className="px-3 pt-3 border-b border-border/20">
              <div className="flex">
                {tabConfig.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setVisibleRows(0); setTimeout(() => setVisibleRows(5), 100); }}
                    className={cn(
                      'flex-1 px-2 py-1.5 text-[10px] font-medium border-b-2 transition-colors text-center',
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="max-h-[280px] overflow-y-auto">
              {activeTab === 'bookings' && (
                <div className="p-2 space-y-1.5">
                  {bookings.map((b, i) => (
                    <motion.div
                      key={b.id}
                      className="rounded-lg border border-border/30 p-2.5 hover:bg-muted/20 transition-colors"
                      initial={{ opacity: 0, x: -8 }}
                      animate={i < visibleRows ? { opacity: 1, x: 0 } : { opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-foreground">{b.property}</span>
                        <span className={cn('text-[8px] px-1.5 py-0.5 rounded-full font-medium', statusColors[b.status])}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-muted-foreground">Client: {b.guest}</span>
                        <span className="text-[10px] font-medium text-foreground">{b.amount}</span>
                      </div>
                      <p className="text-[8px] text-muted-foreground mt-0.5">Du {b.dates}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'properties' && (
                <div className="p-2 space-y-1.5">
                  {properties.map((p, i) => (
                    <motion.div
                      key={p.name}
                      className="rounded-lg border border-border/30 p-2.5"
                      initial={{ opacity: 0, x: -8 }}
                      animate={i < visibleRows ? { opacity: 1, x: 0 } : { opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="text-[11px] font-medium text-foreground">{p.name}</p>
                      <div className="grid grid-cols-2 gap-x-4 mt-1 text-[9px] text-muted-foreground">
                        <span>Chambres: {p.bedrooms}</span>
                        <span>SDB: {p.bathrooms}</span>
                        <span>Surface: {p.surface}</span>
                        <span>Ville: {p.city}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="p-2 space-y-1.5">
                  {payments.map((p, i) => (
                    <motion.div
                      key={p.id}
                      className="rounded-lg border border-border/30 p-2.5"
                      initial={{ opacity: 0, x: -8 }}
                      animate={i < visibleRows ? { opacity: 1, x: 0 } : { opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-foreground">
                          {p.id} · {p.booking}
                        </span>
                        <span className={cn('text-[8px] px-1.5 py-0.5 rounded-full font-medium', statusColors[p.status])}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-muted-foreground">Méthode: {p.method}</span>
                        <span className="text-[10px] font-medium text-foreground">{p.amount}</span>
                      </div>
                      <p className="text-[8px] text-muted-foreground mt-0.5">Date: {p.date}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'invoice' && (
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Facture</p>
                      <p className="text-[11px] font-medium text-foreground mt-0.5">F-2026-0142</p>
                    </div>
                    <motion.span
                      className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[hsl(152,50%,45%)]/10 text-[hsl(152,50%,40%)]"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
                    >
                      Validée
                    </motion.span>
                  </div>
                  <div className="space-y-0">
                    {invoiceFields.map((field, i) => (
                      <motion.div
                        key={field.label}
                        className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
                        initial={{ opacity: 0, x: -8 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.06 }}
                      >
                        <span className="text-[10px] text-muted-foreground">{field.label}</span>
                        <span className={cn(
                          'text-[10px] font-medium text-foreground',
                          i === invoiceFields.length - 1 && 'text-[11px] font-semibold'
                        )}>
                          {field.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className="mt-3 pt-2 border-t border-border/20 flex items-center gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(152,50%,45%)]" />
                    <span className="text-[8px] text-muted-foreground">
                      Traçabilité complète · Horodatage · Audit-ready
                    </span>
                  </motion.div>
                </div>
              )}
            </div>
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
              Interface de facturation complète avec import des réservations,
              suivi des paiements et génération automatique des relevés propriétaires.
              Chaque flux de revenu est traçable et auditable.
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
