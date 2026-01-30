import { Link } from 'react-router-dom';
import { Check, ArrowRight, HelpCircle, Building2, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FAQAccordion } from './FAQAccordion';

const plans = [
  {
    name: 'Noé',
    subtitle: 'Channel + PMS complet',
    price: '4 €',
    period: '/ mois / logement',
    description: 'Tout ce qu\'il faut pour professionnaliser vos opérations.',
    recommendedFor: 'Conciergeries de 10 à 100 lots en croissance',
    icon: Building2,
    features: [
      'Synchronisation multi-canaux',
      'Calendrier unifié multi-lots',
      'Planning ménage automatisé',
      'Gestion maintenance & repasse',
      'Messagerie voyageurs centralisée',
      'Statistiques activité & finance',
      'Multi-utilisateurs & rôles',
      'Support par email',
    ],
    addon: {
      name: 'Module Facturation',
      price: '+2 € / facture générée',
      description: 'Générez factures et avoirs en quelques clics',
    },
    cta: 'Commencer avec Noé',
    ctaLink: '/contact',
    highlighted: false,
  },
  {
    name: 'Pimp my Noé',
    subtitle: 'Votre outil. Vos process. Vos règles.',
    price: '15 €',
    period: '/ mois / logement',
    description: 'Pour les organisations qui veulent un outil parfaitement adapté.',
    recommendedFor: 'Conciergeries 50+ lots avec process spécifiques',
    icon: Rocket,
    features: [
      'Tout Noé inclus',
      'Configuration sur mesure',
      'Workflows personnalisés',
      'Règles d\'automatisation avancées',
      'Accompagnement setup dédié',
      'Support prioritaire',
      'Évolutions sur demande',
      'Account manager dédié',
    ],
    cta: 'Parler à un expert',
    ctaLink: '/contact',
    highlighted: true,
  },
];

const comparisonFeatures = [
  { feature: 'Channel Manager', noe: true, pimp: true },
  { feature: 'Calendrier multi-lots', noe: true, pimp: true },
  { feature: 'Planning ménage', noe: true, pimp: true },
  { feature: 'Maintenance & repasse', noe: true, pimp: true },
  { feature: 'Messagerie voyageurs', noe: true, pimp: true },
  { feature: 'Statistiques', noe: true, pimp: true },
  { feature: 'Multi-utilisateurs', noe: true, pimp: true },
  { feature: 'Configuration personnalisée', noe: false, pimp: true },
  { feature: 'Workflows sur mesure', noe: false, pimp: true },
  { feature: 'Accompagnement dédié', noe: false, pimp: true },
  { feature: 'Support prioritaire', noe: false, pimp: true },
];

const faqItems = [
  {
    question: "Y a-t-il un engagement minimum ?",
    answer: "Non, Noé fonctionne sans engagement. Vous pouvez résilier à tout moment. La facturation est mensuelle, basée sur le nombre de logements actifs."
  },
  {
    question: "Comment se passe la migration de mes données ?",
    answer: "Notre équipe vous accompagne pour importer vos réservations existantes et configurer vos intégrations. L'onboarding est inclus dans tous les plans."
  },
  {
    question: "Le support est-il inclus ?",
    answer: "Oui, le support par email est inclus dans Noé. Avec Pimp my Noé, vous bénéficiez d'un support prioritaire et d'un account manager dédié."
  },
  {
    question: "Combien d'utilisateurs puis-je ajouter ?",
    answer: "Noé est multi-utilisateurs sans limite. Vous pouvez inviter autant de membres que nécessaire et définir leurs droits selon leur rôle."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Vos données sont hébergées en Europe, chiffrées au repos et en transit. Nous respectons le RGPD et effectuons des sauvegardes quotidiennes."
  },
  {
    question: "Puis-je connecter mes canaux existants ?",
    answer: "Oui, Noé se connecte à vos canaux via Channel Manager (compatible Channex). Airbnb, Booking.com, Vrbo et d'autres plateformes sont supportées."
  },
];

export function EnhancedPricingSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Tarifs transparents
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Un prix simple, une valeur immense
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez la formule qui correspond à votre organisation. Sans surprise.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-3xl p-8 transition-all",
                  plan.highlighted
                    ? "bg-foreground text-background shadow-2xl scale-[1.02]"
                    : "bg-card border border-border/50"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Recommandé
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    plan.highlighted ? "bg-background/20" : "bg-primary/10"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6",
                      plan.highlighted ? "text-background" : "text-primary"
                    )} />
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-2xl font-bold",
                      plan.highlighted ? "text-background" : "text-foreground"
                    )}>
                      {plan.name}
                    </h3>
                    <p className={cn(
                      "text-sm",
                      plan.highlighted ? "text-background/70" : "text-muted-foreground"
                    )}>
                      {plan.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "text-5xl font-bold tracking-tight",
                      plan.highlighted ? "text-background" : "text-foreground"
                    )}>
                      {plan.price}
                    </span>
                    <span className={cn(
                      "text-sm",
                      plan.highlighted ? "text-background/70" : "text-muted-foreground"
                    )}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm mt-2",
                    plan.highlighted ? "text-background/70" : "text-muted-foreground"
                  )}>
                    {plan.description}
                  </p>
                </div>

                {/* Recommended For */}
                <div className={cn(
                  "p-3 rounded-xl mb-6 text-sm",
                  plan.highlighted
                    ? "bg-background/10 text-background/90"
                    : "bg-primary/5 text-primary"
                )}>
                  <span className="font-medium">Recommandé pour :</span> {plan.recommendedFor}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        plan.highlighted ? "bg-background/20" : "bg-primary/10"
                      )}>
                        <Check className={cn(
                          "h-3 w-3",
                          plan.highlighted ? "text-background" : "text-primary"
                        )} />
                      </div>
                      <span className={cn(
                        "text-sm",
                        plan.highlighted ? "text-background" : "text-foreground"
                      )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.addon && (
                  <div className={cn(
                    "p-4 rounded-xl mb-6 border",
                    plan.highlighted
                      ? "bg-background/10 border-background/20"
                      : "bg-muted/50 border-border/50"
                  )}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn(
                        "font-medium text-sm",
                        plan.highlighted ? "text-background" : "text-foreground"
                      )}>
                        {plan.addon.name}
                      </span>
                      <span className={cn(
                        "text-sm font-semibold",
                        plan.highlighted ? "text-background" : "text-primary"
                      )}>
                        {plan.addon.price}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs",
                      plan.highlighted ? "text-background/70" : "text-muted-foreground"
                    )}>
                      {plan.addon.description}
                    </p>
                  </div>
                )}

                <Button
                  size="lg"
                  className={cn(
                    "w-full",
                    plan.highlighted && "bg-background text-foreground hover:bg-background/90"
                  )}
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link to={plan.ctaLink}>
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-16">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-semibold text-foreground">Comparatif détaillé</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fonctionnalité</th>
                  <th className="p-4 text-center text-sm font-medium text-foreground">Noé</th>
                  <th className="p-4 text-center text-sm font-medium text-foreground bg-primary/5">Pimp my Noé</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={index} className="border-b border-border/30 last:border-0">
                    <td className="p-4 text-sm text-foreground">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.noe ? (
                        <Check className="w-5 h-5 text-status-success mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      {row.pimp ? (
                        <Check className="w-5 h-5 text-status-success mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Questions fréquentes</h3>
          </div>
          <FAQAccordion items={faqItems} />
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Parlons de votre organisation
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Chaque conciergerie est unique. Réservez une démo pour voir comment Noé peut s'adapter à vos besoins.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">
              Demander une démo personnalisée
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
