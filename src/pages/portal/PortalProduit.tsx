import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Users, Shield, BarChart3, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PortalProduit() {
  const problems = [
    'Calendriers dispersés sur plusieurs plateformes',
    'Messages et appels incessants pour coordonner les équipes',
    'Erreurs de réservation et doubles réservations',
    'Aucune visibilité sur la performance réelle',
    'Perte de temps sur des tâches répétitives',
  ];

  const centralizes = [
    { icon: Check, text: 'Réservations', description: 'Toutes les plateformes, un seul calendrier' },
    { icon: Users, text: 'Équipes', description: 'Ménage, maintenance, check-in coordonnés' },
    { icon: Zap, text: 'Opérations', description: 'Tâches planifiées et suivies automatiquement' },
    { icon: Shield, text: 'Qualité', description: 'Contrôle systématique, incidents tracés' },
    { icon: BarChart3, text: 'Données', description: 'Statistiques fiables pour décider' },
  ];

  const steps = [
    {
      number: '1',
      title: 'Vous connectez vos logements',
      description: 'Reliez vos plateformes en quelques clics. Airbnb, Booking, et les autres. Vos calendriers se synchronisent automatiquement.',
    },
    {
      number: '2',
      title: 'Les réservations se centralisent',
      description: 'Toutes vos réservations arrivent au même endroit. Plus besoin de vérifier chaque plateforme séparément.',
    },
    {
      number: '3',
      title: 'Les équipes savent quoi faire',
      description: 'Ménages, check-ins, maintenance : tout est planifié et assigné. Chacun connaît ses tâches du jour.',
    },
    {
      number: '4',
      title: 'Vous gardez le contrôle',
      description: 'Vue d\'ensemble, alertes en temps réel, statistiques claires. Vous pilotez sereinement.',
    },
  ];

  return (
    <div>
      {/* Header */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">Le produit</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              Pourquoi Noé existe
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Trop d'outils. Trop de messages. Trop d'erreurs. Les conciergeries jonglent entre les calendriers, les équipes et les plateformes. Noé rassemble tout au même endroit.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(0,65%,55%)]/10 text-[hsl(0,65%,55%)] mb-6">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">Le problème</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-6">
                Sans outil adapté, chaque journée est une course
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Vous passez plus de temps à coordonner qu'à développer. Les erreurs se multiplient. Vos équipes improvisent.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
              <ul className="space-y-4">
                {problems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(0,65%,55%)]/5 border border-[hsl(0,65%,55%)]/10">
                    <div className="w-6 h-6 rounded-full bg-[hsl(0,65%,55%)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[hsl(0,65%,55%)]">!</span>
                    </div>
                    <span className="text-foreground">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Noé centralizes */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">La solution</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Ce que Noé centralise
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Un seul outil pour tout gérer. Moins de friction, plus de contrôle.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {centralizes.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border/50 hover:border-border hover:shadow-lg transition-all text-center"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-base font-semibold text-foreground mb-1">{item.text}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Fonctionnement</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Comment ça marche
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcome */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Moins d'erreurs. Moins de stress.
            <br />
            <span className="text-muted-foreground">Plus de visibilité.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Noé vous libère du temps pour ce qui compte vraiment : vos voyageurs et la croissance de votre activité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8" asChild>
              <Link to="/modules">
                Voir les modules
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <Link to="/contact">Demander une démo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
