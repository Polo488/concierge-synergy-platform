import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FAQAccordion } from '@/components/portal/FAQAccordion';

const plans = [
  {
    name: 'Noé',
    subtitle: 'Channel + PMS, prêt à l\'emploi',
    price: '4 €',
    period: '/ mois / logement',
    description: 'Tout ce qu\'il faut pour gérer vos locations courte durée efficacement.',
    features: [
      'Synchronisation multi-plateformes',
      'Calendrier unifié',
      'Planning ménage & maintenance',
      'Statistiques essentielles',
      'Accès multi-utilisateurs',
      'Support par email',
    ],
    addon: 'Module facturation : +2 € / facture générée',
    cta: 'Commencer avec Noé',
    ctaLink: '/contact',
    highlighted: false,
  },
  {
    name: 'Pimp my Noé',
    subtitle: 'Votre outil. Vos règles. Vos process.',
    price: '15 €',
    period: '/ mois / logement',
    description: 'Pour les conciergeries qui veulent un outil adapté à leur organisation.',
    features: [
      'Tout Noé inclus',
      'Configuration personnalisée',
      'Workflows sur mesure',
      'Règles d\'automatisation',
      'Accompagnement dédié',
      'Support prioritaire',
    ],
    cta: 'Parler à un expert',
    ctaLink: '/contact',
    highlighted: true,
  },
];

export default function PortalTarifs() {
  const faqItems = [
    {
      question: 'Y a-t-il un engagement ?',
      answer:
        'Non, vous pouvez résilier à tout moment. Nous facturons au mois et vous pouvez ajuster le nombre de logements selon vos besoins.',
    },
    {
      question: 'Puis-je commencer petit ?',
      answer:
        'Absolument. Vous pouvez démarrer avec quelques logements et ajouter les autres progressivement. C\'est même ce que nous recommandons.',
    },
    {
      question: 'Le channel manager est-il inclus ?',
      answer:
        'Oui, la synchronisation avec les plateformes (Airbnb, Booking, etc.) est incluse dans les deux offres. Pas de frais cachés.',
    },
    {
      question: 'À qui s\'adresse Pimp my Noé ?',
      answer:
        'Aux conciergeries qui ont des processus spécifiques ou qui veulent aller plus loin dans l\'automatisation. On adapte Noé à votre façon de travailler, pas l\'inverse.',
    },
  ];

  return (
    <div>
      {/* Header */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">Tarifs</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-6">
            Des tarifs simples et transparents
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deux façons d'utiliser Noé. Une seule promesse : vous simplifier la vie.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-3xl p-8 transition-all',
                  plan.highlighted
                    ? 'bg-foreground text-background shadow-2xl scale-[1.02]'
                    : 'bg-card border border-border/50'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Recommandé
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={cn(
                    'text-2xl font-bold mb-1',
                    plan.highlighted ? 'text-background' : 'text-foreground'
                  )}>
                    {plan.name}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    plan.highlighted ? 'text-background/70' : 'text-muted-foreground'
                  )}>
                    {plan.subtitle}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      'text-5xl font-bold tracking-tight',
                      plan.highlighted ? 'text-background' : 'text-foreground'
                    )}>
                      {plan.price}
                    </span>
                    <span className={cn(
                      'text-sm',
                      plan.highlighted ? 'text-background/70' : 'text-muted-foreground'
                    )}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={cn(
                    'text-sm mt-2',
                    plan.highlighted ? 'text-background/70' : 'text-muted-foreground'
                  )}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        plan.highlighted ? 'bg-background/20' : 'bg-primary/10'
                      )}>
                        <Check className={cn(
                          'h-3 w-3',
                          plan.highlighted ? 'text-background' : 'text-primary'
                        )} />
                      </div>
                      <span className={cn(
                        'text-sm',
                        plan.highlighted ? 'text-background' : 'text-foreground'
                      )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.addon && (
                  <div className={cn(
                    'p-3 rounded-xl mb-6 text-sm',
                    plan.highlighted
                      ? 'bg-background/10 text-background/80'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {plan.addon}
                  </div>
                )}

                <Button
                  size="lg"
                  className={cn(
                    'w-full',
                    plan.highlighted && 'bg-background text-foreground hover:bg-background/90'
                  )}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  <Link to={plan.ctaLink}>
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Questions fréquentes
            </h2>
          </div>
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Une question sur les tarifs ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Contactez-nous pour discuter de vos besoins. Nous vous aiderons à choisir la formule adaptée.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">
              Nous contacter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
