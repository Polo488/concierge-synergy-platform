import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Building, Globe, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const personas = [
  {
    icon: Building2,
    title: "10–50 logements",
    subtitle: "Conciergerie en croissance",
    before: [
      "Planning sur Excel, difficile à maintenir",
      "Pas de vision claire sur la rentabilité",
      "Suivi qualité inexistant",
    ],
    after: [
      "Vue calendrier unifiée et claire",
      "Stats par bien, par mois, par canal",
      "Traçabilité ménage complète",
    ],
    quote: "\"Avant Noé, je passais mes dimanches à mettre à jour mon Excel.\"",
    color: "from-primary/10 to-transparent",
    borderColor: "hover:border-primary/50",
  },
  {
    icon: Building,
    title: "50–300 logements",
    subtitle: "Multi-équipes, multi-sites",
    before: [
      "Équipes terrain non coordonnées",
      "WhatsApp pour tout, rien de tracé",
      "Impossible de déléguer sereinement",
    ],
    after: [
      "Tâches auto-générées et assignées",
      "Messagerie centralisée contextuelle",
      "Droits et rôles par utilisateur",
    ],
    quote: "\"On a enfin pu structurer nos opérations sans micro-manager.\"",
    color: "from-status-success/10 to-transparent",
    borderColor: "hover:border-status-success/50",
    featured: true,
  },
  {
    icon: Globe,
    title: "300+ logements",
    subtitle: "Property manager multi-villes",
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
    quote: "\"On pilote 3 villes depuis le même dashboard.\"",
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
            Pour toutes les tailles
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Noé s'adapte à votre organisation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Que vous gériez 10 ou 300+ logements, les problèmes changent. Les solutions aussi.
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
                  "relative bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-elevated",
                  persona.borderColor,
                  persona.featured && "lg:scale-105 shadow-elevated border-status-success/30"
                )}
              >
                {/* Top gradient */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-32 bg-gradient-to-b",
                  persona.color
                )} />

                {persona.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-status-success text-white text-xs font-medium rounded-full">
                    Le plus courant
                  </div>
                )}

                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{persona.title}</h3>
                      <p className="text-sm text-muted-foreground">{persona.subtitle}</p>
                    </div>
                  </div>

                  {/* Before */}
                  <div className="mb-5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avant</span>
                    <ul className="mt-2 space-y-2">
                      {persona.before.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <X className="w-4 h-4 text-status-error flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* After */}
                  <div className="mb-5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avec Noé</span>
                    <ul className="mt-2 space-y-2">
                      {persona.after.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quote */}
                  <div className="pt-5 border-t border-border/50">
                    <p className="text-sm italic text-muted-foreground">
                      {persona.quote}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild>
            <Link to="/contact">
              Discuter de votre situation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
