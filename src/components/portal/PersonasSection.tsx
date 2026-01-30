import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Building, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const personas = [
  {
    icon: Building2,
    title: "Conciergerie 10–50 lots",
    before: [
      "Planning sur tableur difficile à maintenir",
      "Confusion entre les tâches urgentes",
      "Suivi qualité inexistant",
    ],
    after: [
      "Vue calendrier unifiée et claire",
      "Tâches automatiquement générées",
      "Stats de performance par bien",
    ],
    color: "from-primary/10 to-transparent",
    borderColor: "hover:border-primary/50",
  },
  {
    icon: Building,
    title: "Conciergerie 50–300 lots",
    before: [
      "Équipes terrain non coordonnées",
      "WhatsApp pour tout, rien de tracé",
      "Impossible de déléguer sereinement",
    ],
    after: [
      "Affectation automatique des agents",
      "Messagerie centralisée et contextuelle",
      "Droits et rôles par utilisateur",
    ],
    color: "from-status-success/10 to-transparent",
    borderColor: "hover:border-status-success/50",
    featured: true,
  },
  {
    icon: Globe,
    title: "Property manager multi-villes",
    before: [
      "Outils différents par équipe",
      "Vision globale impossible",
      "Temps perdu en reporting",
    ],
    after: [
      "Une seule plateforme unifiée",
      "Dashboard multi-sites temps réel",
      "Exports et stats automatiques",
    ],
    color: "from-nav-pilotage/10 to-transparent",
    borderColor: "hover:border-nav-pilotage/50",
  },
];

export function PersonasSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 lg:py-28 bg-muted/30", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Cas d'usage
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Pour qui est fait Noé ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Que vous gériez 10 ou 300 logements, Noé s'adapte à votre organisation.
          </p>
        </div>

        {/* Personas Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <div
                key={index}
                className={cn(
                  "relative bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300",
                  persona.borderColor,
                  persona.featured && "lg:scale-105 shadow-elevated"
                )}
              >
                {/* Top gradient */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-32 bg-gradient-to-b",
                  persona.color
                )} />

                {persona.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Le plus courant
                  </div>
                )}

                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{persona.title}</h3>
                  </div>

                  {/* Before */}
                  <div className="mb-6">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avant</span>
                    <ul className="mt-2 space-y-2">
                      {persona.before.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-status-error">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* After */}
                  <div className="mb-6">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avec Noé</span>
                    <ul className="mt-2 space-y-2">
                      {persona.after.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="text-status-success">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/modules">
                      Voir les modules adaptés
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
