import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Sparkles, 
  Wrench, 
  MessageCircle, 
  BarChart3, 
  FileText, 
  Building2, 
  Users,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const modules = [
  {
    icon: Calendar,
    title: 'Calendrier & Channel',
    description: 'Synchronisation des réservations, gestion des disponibilités, vue unifiée multi-plateformes.',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Sparkles,
    title: 'Ménage',
    description: 'Planning automatique, assignation des agents, suivi en temps réel, contrôle qualité.',
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Wrench,
    title: 'Maintenance',
    description: 'Signalement des incidents, suivi des interventions, historique par logement.',
    color: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: MessageCircle,
    title: 'Messagerie',
    description: 'Conversations centralisées, réponses automatiques, contexte voyageur intégré.',
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: BarChart3,
    title: 'Statistiques',
    description: 'Taux d\'occupation, revenus, performance par bien, tendances et comparaisons.',
    color: 'from-cyan-500/20 to-cyan-600/10',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    icon: FileText,
    title: 'Facturation',
    description: 'Génération automatique des factures, suivi des paiements, exports comptables.',
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Building2,
    title: 'Moyenne durée',
    description: 'Gestion des baux, appels de loyer, suivi des locataires, documents légaux.',
    color: 'from-rose-500/20 to-rose-600/10',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    icon: Users,
    title: 'Équipes',
    description: 'Gestion des utilisateurs, rôles et permissions, planning RH, affectations.',
    color: 'from-indigo-500/20 to-indigo-600/10',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
];

export function ModulesGrid() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Modules</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des modules pensés pour le terrain, pas pour impressionner en démo.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.title}
                className="group relative bg-card rounded-2xl border border-border/50 p-6 hover:border-border hover:shadow-lg transition-all cursor-pointer"
              >
                {/* Background gradient */}
                <div className={cn(
                  'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity',
                  module.color
                )} />

                <div className="relative">
                  <div className={cn(
                    'w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform',
                    module.iconColor
                  )}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{module.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{module.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link to="/modules">
              Voir tous les détails
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
