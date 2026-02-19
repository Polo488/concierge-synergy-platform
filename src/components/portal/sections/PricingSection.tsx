import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'Noé',
    price: '4€',
    unit: 'HT / logement / mois',
    description: 'Channel Manager + PMS complet',
    features: [
      'Distribution multi-plateforme',
      'Calendrier unifié',
      'Gestion opérations',
      'Ménages & maintenance',
      'Messaging automatisé',
      'Tableau de bord & stats',
      'Conformité réglementaire',
      'Support standard',
    ],
    cta: 'Demander un accès',
    highlighted: false,
  },
  {
    name: 'Pimp my Noé',
    price: '15€',
    unit: 'HT / logement / mois',
    description: 'Sur-mesure + accompagnement',
    features: [
      'Tout Noé inclus',
      'Configuration sur-mesure',
      'Intégrations personnalisées',
      'Formation équipe dédiée',
      'Account manager',
      'Support prioritaire',
      'SLA garanti',
      'Audit & conseil',
    ],
    cta: 'Nous contacter',
    highlighted: true,
  },
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32" id="pricing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-6"
            style={{ background: 'hsla(220, 70%, 50%, 0.06)', color: 'hsl(var(--primary))' }}
          >
            TARIFICATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            Tarification transparente,
            <br />
            <span className="text-muted-foreground">sans surprise.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`rounded-2xl p-8 relative ${
                tier.highlighted
                  ? 'bg-foreground text-background'
                  : 'glass-panel'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.15 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <p className={`text-xs font-medium tracking-wide uppercase ${tier.highlighted ? 'opacity-60' : 'text-muted-foreground'}`}>
                {tier.name}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold">{tier.price}</span>
                <span className={`text-sm ${tier.highlighted ? 'opacity-60' : 'text-muted-foreground'}`}>{tier.unit}</span>
              </div>
              <p className={`text-sm mt-2 ${tier.highlighted ? 'opacity-70' : 'text-muted-foreground'}`}>{tier.description}</p>

              <div className="mt-6 space-y-2.5">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className={`w-3.5 h-3.5 ${tier.highlighted ? 'opacity-60' : 'text-[hsl(152,50%,45%)]'}`} />
                    <span className={`text-sm ${tier.highlighted ? 'opacity-80' : 'text-muted-foreground'}`}>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full mt-8 rounded-xl h-11 ${
                  tier.highlighted
                    ? 'bg-background text-foreground hover:bg-background/90'
                    : ''
                }`}
                variant={tier.highlighted ? 'secondary' : 'default'}
                asChild
              >
                <Link to="/contact">
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Billing module add-on */}
        <motion.div
          className="mt-6 glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div>
            <p className="text-sm font-medium text-foreground">Module Facturation</p>
            <p className="text-xs text-muted-foreground mt-0.5">Génération automatique, traçabilité complète, export comptable</p>
          </div>
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="text-2xl font-semibold text-foreground">2€</span>
            <span className="text-xs text-muted-foreground">/ facture</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
