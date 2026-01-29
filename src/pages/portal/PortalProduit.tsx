import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Users, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PortalProduit() {
  const centralizes = [
    { icon: Check, text: 'Réservations' },
    { icon: Users, text: 'Équipes' },
    { icon: Zap, text: 'Opérations' },
    { icon: Shield, text: 'Qualité' },
    { icon: BarChart3, text: 'Données' },
  ];

  const steps = [
    {
      number: '1',
      title: 'Vous connectez vos logements',
      description: 'Reliez vos plateformes en quelques clics. Airbnb, Booking, et les autres.',
    },
    {
      number: '2',
      title: 'Les réservations se synchronisent',
      description: 'Toutes vos réservations arrivent au même endroit, automatiquement.',
    },
    {
      number: '3',
      title: 'Les équipes savent quoi faire',
      description: 'Ménages, check-ins, maintenance : tout est planifié et assigné.',
    },
    {
      number: '4',
      title: 'Vous gardez le contrôle',
      description: 'Vue d\'ensemble, alertes, statistiques. Vous pilotez sereinement.',
    },
  ];

  return (
    <div>
      {/* Header */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              Pourquoi Noé existe
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trop d'outils. Trop de messages. Trop d'erreurs. Les conciergeries jonglent entre les calendriers, les équipes et les plateformes. Noé rassemble tout au même endroit.
            </p>
          </div>
        </div>
      </section>

      {/* What Noé centralizes */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-8">
            Ce que Noé centralise
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {centralizes.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border/50"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-12">
            Comment ça marche
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border/50"
              >
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcome */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-transparent to-primary/3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Moins d'erreurs. Moins de stress. Plus de visibilité.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Noé vous libère du temps pour ce qui compte vraiment : vos voyageurs et la croissance de votre activité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/modules">
                Voir les modules
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Demander une démo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
