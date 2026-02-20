import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stockItems = [
  { name: 'Draps housse 140', stock: 48, max: 60, unit: 'pièces' },
  { name: 'Serviettes bain', stock: 72, max: 100, unit: 'pièces' },
  { name: 'Gel douche 300ml', stock: 15, max: 50, unit: 'flacons' },
  { name: 'Capsules café', stock: 120, max: 200, unit: 'capsules' },
  { name: 'Kit accueil', stock: 8, max: 30, unit: 'kits' },
];

const cleaningEvent = {
  property: 'T2 Bellecour',
  task: 'Ménage check-out',
  deductions: [
    { item: 'Draps housse 140', qty: -2 },
    { item: 'Serviettes bain', qty: -4 },
    { item: 'Gel douche 300ml', qty: -1 },
    { item: 'Capsules café', qty: -6 },
    { item: 'Kit accueil', qty: -1 },
  ],
};

export function InventorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -30]);

  const [showDeduction, setShowDeduction] = useState(false);
  const [deductedItems, setDeductedItems] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setShowDeduction(true), 1800);
    return () => clearTimeout(t1);
  }, [isInView]);

  useEffect(() => {
    if (!showDeduction) return;
    cleaningEvent.deductions.forEach((_, i) => {
      setTimeout(() => {
        setDeductedItems((prev) => [...prev, i]);
      }, 400 + i * 350);
    });
  }, [showDeduction]);

  const getAdjustedStock = (index: number) => {
    const item = stockItems[index];
    const deduction = cleaningEvent.deductions[index];
    if (deductedItems.includes(index) && deduction) {
      return Math.max(0, item.stock + deduction.qty);
    }
    return item.stock;
  };

  const getStockColor = (stock: number, max: number) => {
    const ratio = stock / max;
    if (ratio < 0.2) return 'hsl(0, 70%, 55%)';
    if (ratio < 0.4) return 'hsl(35, 80%, 50%)';
    return 'hsl(var(--primary))';
  };

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <div>
            <motion.p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Inventaire
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Plus de savon.
              <br />
              <span className="text-muted-foreground">Plus de linge. Et personne ne sait.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Avec Noé, le stock suit les opérations automatiquement.
              Chaque ménage déduit les consommables. Les alertes préviennent avant la rupture.
            </motion.p>
            <motion.p
              className="mt-4 text-sm text-muted-foreground/70 italic"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              Infrastructure-level tooling. Entry-level pricing.
            </motion.p>

            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {['Aucun rapprochement nécessaire', 'Aucun suivi manuel', 'Alertes seuil automatiques'].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.55 + i * 0.08 }}
                >
                  <div className="w-1 h-1 rounded-full bg-primary/40" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stock dashboard preview */}
          <motion.div
            className="border border-border/40 rounded-2xl p-6 bg-card"
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: cardY }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                  Stock temps réel
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">5 catégories suivies</p>
              </div>
              <motion.div
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-primary/8 text-primary"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ type: 'spring', delay: 0.6 }}
              >
                Synchronisé
              </motion.div>
            </div>

            {/* Stock bars */}
            <div className="space-y-3">
              {stockItems.map((item, i) => {
                const adjusted = getAdjustedStock(i);
                const color = getStockColor(adjusted, item.max);
                const width = (adjusted / item.max) * 100;
                const wasDeducted = deductedItems.includes(i);

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                      <motion.span
                        className="text-xs font-medium tabular-nums"
                        style={{ color }}
                        key={adjusted}
                        initial={wasDeducted ? { scale: 1.3 } : {}}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        {adjusted} {item.unit}
                      </motion.span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Cleaning event trigger */}
            <motion.div
              className="mt-5 pt-4 border-t border-border/20"
              initial={{ opacity: 0, y: 10 }}
              animate={showDeduction ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'hsl(var(--status-success))' }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  Événement détecté
                </span>
              </div>
              <p className="text-xs text-foreground font-medium">
                {cleaningEvent.task} → {cleaningEvent.property}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cleaningEvent.deductions.map((d, i) => (
                  <motion.span
                    key={d.item}
                    className="px-2 py-0.5 rounded text-[9px] font-mono bg-muted text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={deductedItems.includes(i) ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: 'spring', delay: 0.1 }}
                  >
                    {d.qty} {d.item.split(' ')[0]}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
