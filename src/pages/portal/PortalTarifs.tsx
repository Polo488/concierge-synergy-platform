import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PricingCard } from '@/components/portal/PricingCard';
import { FAQAccordion } from '@/components/portal/FAQAccordion';

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
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-6">
            Des tarifs simples et transparents
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deux façons d'utiliser Noé. Une seule promesse : vous simplifier la vie.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <PricingCard
              title="Noé"
              subtitle="Channel + PMS, prêt à l'emploi"
              price="4 €"
              period="/ mois / logement"
              features={[
                'Synchronisation des réservations',
                'Pilotage des équipes',
                'Statistiques essentielles',
                'Accès multi-utilisateurs',
                'Support par email',
              ]}
              addon="Module facturation : 2 € / facture"
              cta="Choisir Noé"
              ctaLink="/contact"
            />
            <PricingCard
              title="Pimp my Noé"
              subtitle="Votre outil. Vos règles. Vos process."
              price="15 €"
              period="/ mois / logement"
              features={[
                'Tout Noé inclus',
                'Paramétrage selon votre organisation',
                'Workflows sur mesure',
                'Accompagnement dédié',
                'Support prioritaire',
              ]}
              cta="Parler à un expert"
              ctaLink="/contact"
              highlighted
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-8 text-center">
            Questions fréquentes
          </h2>
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Une question sur les tarifs ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Contactez-nous pour discuter de vos besoins. Nous vous aiderons à choisir la formule adaptée.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
