import { cn } from '@/lib/utils';
import { Link2, RefreshCw, Users, LineChart } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Connectez vos plateformes',
    description: 'Reliez Airbnb, Booking et vos autres canaux en quelques clics. Vos calendriers se synchronisent automatiquement.',
    visual: 'channels',
  },
  {
    number: '02',
    icon: RefreshCw,
    title: 'Centralisez vos réservations',
    description: 'Toutes vos réservations arrivent au même endroit. Plus besoin de jongler entre les plateformes.',
    visual: 'reservations',
  },
  {
    number: '03',
    icon: Users,
    title: 'Coordonnez vos équipes',
    description: 'Ménages, check-ins, maintenance : tout est planifié et assigné automatiquement à vos équipes.',
    visual: 'teams',
  },
  {
    number: '04',
    icon: LineChart,
    title: 'Pilotez votre activité',
    description: 'Suivez vos performances, identifiez les opportunités et prenez les bonnes décisions.',
    visual: 'dashboard',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Comment ça marche</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-4">
            Opérationnel en 4 étapes
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            De la connexion de vos premiers logements au pilotage quotidien.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative group"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}

                <div className="relative bg-card rounded-2xl border border-border/50 p-6 h-full hover:shadow-lg hover:border-border transition-all">
                  {/* Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-bold text-muted-foreground/20">{step.number}</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon size={20} className="text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
