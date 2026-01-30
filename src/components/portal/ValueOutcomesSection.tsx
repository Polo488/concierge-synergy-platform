import { useEffect, useRef, useState } from 'react';
import { Calendar, Sparkles, MessageCircle, BarChart3, FileText, Shield, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const outcomes = [
  {
    icon: Calendar,
    title: "Calendrier unifié",
    metric: "-2h/jour",
    description: "Plus de jonglage entre plateformes",
    detail: "Airbnb, Booking, direct : tout synchronisé en temps réel.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Sparkles,
    title: "Opérations automatisées",
    metric: "0 oubli",
    description: "Tâches générées automatiquement",
    detail: "Chaque départ déclenche le ménage, chaque check-in est préparé.",
    color: "from-status-success/20 to-status-success/5",
  },
  {
    icon: MessageCircle,
    title: "Réactivité maximale",
    metric: "-80%",
    description: "de temps de réponse voyageur",
    detail: "Tous les messages au même endroit, avec le contexte automatique.",
    color: "from-status-info/20 to-status-info/5",
  },
  {
    icon: BarChart3,
    title: "Pilotage éclairé",
    metric: "+18%",
    description: "de revenus en moyenne",
    detail: "Des décisions basées sur des données fiables, pas sur l'intuition.",
    color: "from-nav-pilotage/20 to-nav-pilotage/5",
  },
  {
    icon: Shield,
    title: "Qualité mesurée",
    metric: "100%",
    description: "de traçabilité",
    detail: "Taux de repasse, incidents, performance par agent : tout est suivi.",
    color: "from-status-warning/20 to-status-warning/5",
  },
  {
    icon: Clock,
    title: "Temps récupéré",
    metric: "10h+",
    description: "par semaine libérées",
    detail: "Moins de tâches manuelles, plus de temps pour ce qui compte.",
    color: "from-nav-revenus/20 to-nav-revenus/5",
  },
];

export function ValueOutcomesSection({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div 
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-status-success/10 text-status-success text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Résultats visibles rapidement
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Ce que vous gagnez dès la première semaine
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des bénéfices concrets, mesurables, immédiats. Pas des promesses.
          </p>
        </div>

        {/* Outcomes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outcomes.map((outcome, index) => {
            const Icon = outcome.icon;
            return (
              <div
                key={index}
                className={cn(
                  "group relative bg-card rounded-2xl border border-border/50 p-6 hover:shadow-elevated transition-all duration-700 overflow-hidden",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Background gradient */}
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-50 transition-opacity group-hover:opacity-70",
                  `bg-gradient-to-br ${outcome.color}`
                )} />
                
                <div className="relative">
                  {/* Icon + Metric */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {outcome.metric}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {outcome.title}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-2">
                    {outcome.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {outcome.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social proof */}
        <div 
          className={cn(
            "mt-16 text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '800ms' }}
        >
          <p className="text-muted-foreground">
            Rejoint par des conciergeries de <span className="text-foreground font-medium">10 à 300+ logements</span>
          </p>
        </div>
      </div>
    </section>
  );
}
