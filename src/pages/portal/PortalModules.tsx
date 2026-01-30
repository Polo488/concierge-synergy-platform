import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  ShoppingBag,
  Check
} from 'lucide-react';

const modules = [
  {
    icon: Calendar,
    title: 'Calendrier & Channel Manager',
    tagline: 'Tout voir, tout comprendre, sans surcharger vos équipes.',
    description: 'Vue unifiée de toutes vos réservations sur tous les canaux. Plus de double réservation, plus de calendrier dispersé.',
    benefits: [
      'Synchronisation Airbnb, Booking, et autres',
      'Vue multi-propriétés claire et lisible',
      'Gestion des tarifs centralisée',
      'Alertes en cas de conflit',
    ],
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-500/10',
  },
  {
    icon: Sparkles,
    title: 'Ménage',
    tagline: 'Chaque intervention est tracée. Chaque problème est visible.',
    description: 'Planning automatique basé sur vos départs et arrivées. Attribution aux agents, suivi en temps réel, contrôle qualité.',
    benefits: [
      'Génération automatique des tâches',
      'Attribution aux agents de ménage',
      'Check-list personnalisables',
      'Photos et rapports de fin de ménage',
    ],
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    icon: Wrench,
    title: 'Maintenance',
    tagline: 'Les incidents sont signalés, suivis et résolus.',
    description: 'Signalement des problèmes par les équipes terrain, suivi des interventions, historique complet par logement.',
    benefits: [
      'Signalement simplifié avec photos',
      'Attribution aux techniciens',
      'Suivi du statut en temps réel',
      'Historique des interventions',
    ],
    color: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-500/10',
  },
  {
    icon: MessageCircle,
    title: 'Messagerie',
    tagline: 'Conversations centralisées, contexte voyageur intégré.',
    description: 'Tous les messages de toutes les plateformes au même endroit. Contexte de réservation automatique, réponses rapides.',
    benefits: [
      'Inbox unifiée multi-plateformes',
      'Contexte voyageur automatique',
      'Modèles de réponse',
      'Historique complet',
    ],
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: 'Statistiques',
    tagline: 'Des chiffres qui servent à décider, pas à décorer.',
    description: 'Taux d\'occupation, revenus, performance par bien. Des données fiables pour piloter votre activité.',
    benefits: [
      'Tableaux de bord clairs',
      'Comparaisons par période',
      'Export des données',
      'KPIs personnalisables',
    ],
    color: 'from-cyan-500/20 to-cyan-600/10',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-500/10',
  },
  {
    icon: FileText,
    title: 'Facturation',
    tagline: 'Factures générées, envoyées, suivies.',
    description: 'Génération automatique des factures propriétaires, suivi des paiements, exports comptables.',
    benefits: [
      'Génération automatique',
      'Personnalisation des modèles',
      'Suivi des paiements',
      'Export comptable',
    ],
    addon: '+2 € par facture générée',
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  {
    icon: Building2,
    title: 'Moyenne durée',
    tagline: 'Baux, loyers, locataires. Tout est géré.',
    description: 'Gestion des locations moyenne durée : baux, appels de loyer, suivi des paiements, documents légaux.',
    benefits: [
      'Génération de baux',
      'Appels de loyer automatiques',
      'Quittances et reçus',
      'Suivi des locataires',
    ],
    color: 'from-rose-500/20 to-rose-600/10',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-500/10',
  },
  {
    icon: Users,
    title: 'Équipes & Organisation',
    tagline: 'Rôles, permissions, plannings. Tout est clair.',
    description: 'Gestion des utilisateurs, rôles et permissions fines, planning RH, affectations aux propriétés.',
    benefits: [
      'Gestion des utilisateurs',
      'Rôles et permissions',
      'Planning des équipes',
      'Affectations par propriété',
    ],
    color: 'from-indigo-500/20 to-indigo-600/10',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-500/10',
  },
  {
    icon: ShoppingBag,
    title: 'Upsell & Services',
    tagline: 'Proposez plus, gagnez plus.',
    description: 'Gestion des services additionnels, suivi des ventes, intégration avec l\'expérience voyageur.',
    benefits: [
      'Catalogue de services',
      'Vente automatisée',
      'Suivi des revenus',
      'Intégration voyageur',
    ],
    color: 'from-pink-500/20 to-pink-600/10',
    iconColor: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-500/10',
  },
];

export default function PortalModules() {
  return (
    <div>
      {/* Header */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">Modules</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-6">
            Tout ce dont vous avez besoin
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des modules pensés pour le terrain, pas pour impressionner en démo. Chaque fonctionnalité répond à un problème concret.
          </p>
        </div>
      </section>

      {/* Modules */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.title}
                  className="relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Background gradient */}
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-30',
                    module.color
                  )} />

                  <div className="relative p-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Header */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={cn(
                            'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                            module.iconBg
                          )}>
                            <Icon size={28} className={module.iconColor} />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-1">{module.title}</h3>
                            <p className="text-primary font-medium">{module.tagline}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                          {module.description}
                        </p>

                        {module.addon && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground mb-4">
                            <span>{module.addon}</span>
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      <div className="bg-muted/50 rounded-xl p-6">
                        <p className="text-sm font-medium text-foreground mb-4">Ce que ça inclut</p>
                        <ul className="space-y-3">
                          {module.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-sm text-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Prêt à découvrir Noé ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            30 minutes pour comprendre comment Noé peut s'adapter à votre organisation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                Demander une démo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/tarifs">Voir les tarifs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
