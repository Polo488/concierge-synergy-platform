import { useEffect, useRef, useState } from 'react';
import { Calendar, Sparkles, MessageCircle, BarChart3, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const outcomes = [
  {
    icon: Calendar,
    title: "Calendrier clair",
    description: "Fin des doubles réservations",
    detail: "Vue unifiée de toutes vos plateformes. Synchronisation en temps réel.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Sparkles,
    title: "Tâches terrain automatisées",
    description: "Ménage, repasse, maintenance",
    detail: "Chaque départ génère automatiquement les tâches nécessaires.",
    color: "from-status-success/20 to-status-success/5",
  },
  {
    icon: MessageCircle,
    title: "Réactivité voyageur",
    description: "Messagerie unifiée + contexte",
    detail: "Répondez plus vite avec tout l'historique sous les yeux.",
    color: "from-status-info/20 to-status-info/5",
  },
  {
    icon: Shield,
    title: "Qualité mesurée",
    description: "Stats ménage + incidents + repasses",
    detail: "Suivez la performance de chaque agent, de chaque bien.",
    color: "from-status-warning/20 to-status-warning/5",
  },
  {
    icon: BarChart3,
    title: "Pilotage complet",
    description: "Stats activité + finance + ops",
    detail: "Prenez des décisions basées sur des données fiables.",
    color: "from-nav-pilotage/20 to-nav-pilotage/5",
  },
  {
    icon: FileText,
    title: "Facturation simplifiée",
    description: "Module additionnel à 2€/facture",
    detail: "Générez et envoyez vos factures en quelques clics.",
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
          <span className="inline-block px-3 py-1 rounded-full bg-status-success/10 text-status-success text-sm font-medium mb-4">
            Résultats visibles
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Ce que vous gagnez en 7 jours
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des bénéfices concrets, mesurables, dès la première semaine.
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
                  "group relative bg-card rounded-2xl border border-border/50 p-6 hover:shadow-elevated transition-all duration-700 overflow-hidden hover:scale-[1.02]",
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
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {outcome.title}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-2">
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
      </div>
    </section>
  );
}
