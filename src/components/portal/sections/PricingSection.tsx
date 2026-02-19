import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-40" id="pricing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.p
          className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          Tarification
        </motion.p>

        <motion.h2
          className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Optimisé par design.
          <br />
          <span className="text-muted-foreground">Pas par compromis.</span>
        </motion.h2>

        <motion.p
          className="text-muted-foreground mt-5 leading-relaxed max-w-lg text-[15px]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          Une architecture lean qui réduit le coût sans réduire le périmètre.
        </motion.p>

        {/* Two-column pricing grid */}
        <motion.div
          className="mt-14 grid sm:grid-cols-2 gap-px bg-border/30 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Channel Manager */}
          <div className="bg-background p-8 lg:p-10">
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
              Channel Manager
            </p>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold text-foreground">4€</span>
              <span className="text-sm text-muted-foreground">HT / logement / mois</span>
            </div>
            <div className="mt-7 space-y-2.5">
              {[
                'Distribution multi-plateforme',
                'Calendrier unifié',
                'Ménages & maintenance',
                'Messaging automatisé',
                'Tableau de bord',
                'Conformité réglementaire',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-primary/30" />
                  {f}
                </div>
              ))}
            </div>
            <Button className="w-full mt-8 h-11 rounded-xl" asChild>
              <Link to="/contact">
                Demander un accès
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Billing Module */}
          <div className="bg-background p-8 lg:p-10">
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
              Module Facturation
            </p>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold text-foreground">2€</span>
              <span className="text-sm text-muted-foreground">par facture générée</span>
            </div>
            <div className="mt-7 space-y-2.5">
              {[
                'Génération automatique',
                'Calcul commission',
                'Reversement propriétaire',
                'Export comptable',
                'Traçabilité complète',
                'Horodatage audit-ready',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-primary/30" />
                  {f}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8 h-11 rounded-xl" asChild>
              <Link to="/contact">
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Average cost */}
        <motion.p
          className="mt-6 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Coût moyen total :{' '}
          <span className="text-foreground font-medium">~6€ / logement / mois</span>
        </motion.p>
      </div>
    </section>
  );
}
