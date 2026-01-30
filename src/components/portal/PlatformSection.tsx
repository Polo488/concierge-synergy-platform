import { Link } from 'react-router-dom';
import { ArrowRight, Boxes, LayoutGrid, Users, MessageCircle, Wallet, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const platformPillars = [
  {
    icon: LayoutGrid,
    title: "Réservations",
    description: "Toutes vos plateformes synchronisées, calendrier unifié",
    color: "from-primary/10 to-transparent",
  },
  {
    icon: Boxes,
    title: "Opérations",
    description: "Ménage, maintenance, repasse : planifiés et suivis",
    color: "from-status-success/10 to-transparent",
  },
  {
    icon: Users,
    title: "Équipes",
    description: "Rôles, droits, affectations : tout est clair",
    color: "from-status-info/10 to-transparent",
  },
  {
    icon: MessageCircle,
    title: "Voyageurs",
    description: "Messagerie centralisée avec contexte automatique",
    color: "from-status-warning/10 to-transparent",
  },
  {
    icon: Wallet,
    title: "Finances",
    description: "Revenus, facturation, statistiques financières",
    color: "from-nav-revenus/10 to-transparent",
  },
  {
    icon: Shield,
    title: "Qualité",
    description: "Performance ménage, incidents, notes : tout mesuré",
    color: "from-nav-pilotage/10 to-transparent",
  },
];

const differentiators = [
  {
    title: "Terrain-first",
    description: "Conçu pour ceux qui gèrent vraiment les opérations au quotidien.",
  },
  {
    title: "Exécution ops",
    description: "Pas juste du planning : du suivi jusqu'à la validation.",
  },
  {
    title: "Stats actionnables",
    description: "Des données utiles pour décider, pas des tableaux décoratifs.",
  },
  {
    title: "Multi-rôles",
    description: "Chaque profil voit ce dont il a besoin, rien de plus.",
  },
  {
    title: "Simplicité",
    description: "Prise en main rapide, interface épurée, pas de formation requise.",
  },
];

const integrations = [
  { name: 'Airbnb', color: 'bg-channel-airbnb/10 text-channel-airbnb' },
  { name: 'Booking.com', color: 'bg-channel-booking/10 text-channel-booking' },
  { name: 'Vrbo', color: 'bg-primary/10 text-primary' },
  { name: 'Abritel', color: 'bg-status-info/10 text-status-info' },
  { name: 'Channel Manager', color: 'bg-muted text-muted-foreground' },
];

export function PlatformSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 lg:py-28 bg-muted/30", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Plateforme complète
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Le système d'exploitation des conciergeries
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Noé centralise tout ce dont vous avez besoin pour piloter votre activité.
          </p>
        </div>

        {/* 6 Pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {platformPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="relative bg-card rounded-2xl border border-border/50 p-6 overflow-hidden hover:shadow-elevated transition-all duration-300"
              >
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-50",
                  `bg-gradient-to-br ${pillar.color}`
                )} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Single Source of Truth */}
        <div className="bg-card rounded-3xl border border-border/50 p-8 lg:p-12 mb-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Une seule source de vérité
              </h3>
              <p className="text-muted-foreground mb-6">
                Chaque action dans Noé est traçable : réservations, tâches, incidents, repasses. 
                Plus de doutes, plus de questions, plus de ressaisies.
              </p>
              <ul className="space-y-3">
                {[
                  "Créer une repasse depuis un problème signalé",
                  "Créer une maintenance depuis la messagerie",
                  "Stats repasse automatiquement alimentées",
                  "Historique complet par bien et par agent",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-status-success mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-muted/50 rounded-2xl aspect-video flex items-center justify-center">
              <div className="text-center">
                <Boxes className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Schéma flux de données</p>
              </div>
            </div>
          </div>
        </div>

        {/* Differentiators */}
        <div className="mb-20">
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">
            Ce qui rend Noé différent
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {differentiators.map((diff, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border/50 p-5 hover:border-primary/30 transition-colors"
              >
                <h4 className="text-sm font-semibold text-primary mb-2">{diff.title}</h4>
                <p className="text-xs text-muted-foreground">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Intégrations & Canaux
          </h3>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {integrations.map((integration, i) => (
              <span
                key={i}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  integration.color
                )}
              >
                {integration.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            Connecté via Channel Manager (Channex compatible). D'autres intégrations à venir.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                Demander une démo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/tarifs">
                Voir les tarifs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
