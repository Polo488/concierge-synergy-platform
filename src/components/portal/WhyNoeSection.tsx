import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Layers, Eye, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const columns = [
  {
    icon: AlertTriangle,
    title: "Moins d'erreurs",
    color: "text-status-error",
    bgColor: "bg-status-error-light",
    painPoints: [
      { pain: "Réservations manquées", solution: "Alertes automatiques" },
      { pain: "Double réservation", solution: "Synchronisation temps réel" },
      { pain: "Tâches oubliées", solution: "Planning automatisé" },
    ],
    proof: "Pensé pour le terrain",
  },
  {
    icon: Layers,
    title: "Moins d'outils",
    color: "text-status-warning",
    bgColor: "bg-status-warning-light",
    painPoints: [
      { pain: "Excel, WhatsApp, emails...", solution: "Tout au même endroit" },
      { pain: "Infos éparpillées", solution: "Une seule source de vérité" },
      { pain: "Ressaisie manuelle", solution: "Données synchronisées" },
    ],
    proof: "Conçu pour multi-équipes",
  },
  {
    icon: Eye,
    title: "Plus de contrôle",
    color: "text-status-success",
    bgColor: "bg-status-success-light",
    painPoints: [
      { pain: "Vision floue", solution: "Dashboard en temps réel" },
      { pain: "Pas de traçabilité", solution: "Historique complet" },
      { pain: "Décisions à l'aveugle", solution: "Stats actionnables" },
    ],
    proof: "Workflow opérationnel",
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
            La différence Noé
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Pourquoi Noé ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un outil construit autour des vrais problèmes des conciergeries.
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
                  "bg-card rounded-2xl border border-border/50 p-8 hover:shadow-elevated transition-all duration-700 hover:scale-[1.02]",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", column.bgColor)}>
                    <Icon className={cn("w-6 h-6", column.color)} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{column.title}</h3>
                </div>

                {/* Pain → Solution bullets */}
                <div className="space-y-4 mb-6">
                  {column.painPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-status-success mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-muted-foreground line-through text-sm">{point.pain}</span>
                        <span className="text-foreground text-sm ml-2">→ {point.solution}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Micro-proof */}
                <div className="pt-4 border-t border-border/50">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {column.proof}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
