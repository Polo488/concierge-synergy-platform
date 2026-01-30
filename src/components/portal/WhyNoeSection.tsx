import { useEffect, useRef, useState } from 'react';
import { Layers, Eye, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const columns = [
  {
    icon: Layers,
    title: "On centralise",
    subtitle: "Tout au même endroit",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    problem: "Vous jonglez entre Airbnb, Booking, WhatsApp, Excel et 3 autres outils. L'info est partout, et nulle part.",
    solution: "Noé réunit réservations, tâches, messages et données dans une seule interface. Une source de vérité, partagée par toute l'équipe.",
    example: "\"Avant, je passais 2h par jour à synchroniser mes outils. Maintenant, tout est déjà là.\"",
  },
  {
    icon: Eye,
    title: "On éclaire",
    subtitle: "Voir ce qui compte vraiment",
    color: "text-status-success",
    bgColor: "bg-status-success/10",
    borderColor: "border-status-success/20",
    problem: "Vous pilotez à l'intuition. Pas de chiffres fiables, pas de vision claire. Les décisions se prennent au feeling.",
    solution: "Stats d'occupation, revenus, qualité ménage, performance par bien : Noé vous montre ce qui marche, ce qui coince, et pourquoi.",
    example: "\"J'ai enfin compris pourquoi mon T2 sous-performait : 15% de repasses en plus que les autres.\"",
  },
  {
    icon: Lightbulb,
    title: "On aide à décider",
    subtitle: "Moins d'intuition, plus de clarté",
    color: "text-nav-pilotage",
    bgColor: "bg-nav-pilotage/10",
    borderColor: "border-nav-pilotage/20",
    problem: "Vous savez que quelque chose ne va pas, mais vous ne savez pas quoi. Les urgences s'accumulent, les priorités sont floues.",
    solution: "Noé ne décide pas à votre place. Il vous donne les bonnes infos, au bon moment, pour prendre des décisions éclairées.",
    example: "\"On a optimisé nos tarifs et gagné 18% de revenus en 2 mois, grâce aux stats par période.\"",
  },
];

export function WhyNoeSection({ className }: { className?: string }) {
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
    <section ref={sectionRef} className={cn("py-20 lg:py-28 bg-muted/30", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div 
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Un partenaire, pas un vendeur
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Pourquoi Noé ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            On vous aide à voir clair, à structurer, et à décider. Pas à ajouter une couche de complexité.
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {columns.map((column, index) => {
            const Icon = column.icon;
            return (
              <div
                key={index}
                className={cn(
                  "bg-card rounded-2xl border p-8 transition-all duration-700 hover:shadow-elevated",
                  column.borderColor,
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0", column.bgColor)}>
                    <Icon className={cn("w-7 h-7", column.color)} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{column.title}</h3>
                    <p className="text-sm text-muted-foreground">{column.subtitle}</p>
                  </div>
                </div>

                {/* Problem */}
                <div className="mb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Le problème :</span> {column.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="mb-5">
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-medium">La solution :</span> {column.solution}
                  </p>
                </div>

                {/* Example quote */}
                <div className="pt-5 border-t border-border/50">
                  <p className="text-sm italic text-muted-foreground">
                    {column.example}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom message */}
        <div 
          className={cn(
            "text-center mt-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '700ms' }}
        >
          <p className="text-lg text-muted-foreground">
            <span className="text-foreground font-medium">On vous donne les chiffres.</span>{' '}
            Vous gardez le contrôle.
          </p>
        </div>
      </div>
    </section>
  );
}
