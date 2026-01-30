import { cn } from '@/lib/utils';
import { Calendar, Sparkles, MessageCircle, BarChart3, Eye, Lightbulb, Target } from 'lucide-react';
import { CalendarPreview, CleaningPreview, MessagingPreview, StatsPreview } from './previews';

const showcaseSections = [
  {
    id: 'calendar',
    icon: Calendar,
    eyebrow: 'Ce que vous voyez',
    title: 'Un calendrier que tout le monde comprend',
    description: 'Toutes vos réservations, tous vos canaux, sur une seule vue. Fini les allers-retours entre Airbnb et Booking.',
    benefits: [
      'Synchronisation temps réel multi-plateformes',
      'Vue multi-lots sur une seule page',
      'Check-ins et check-outs du jour en évidence',
    ],
    result: 'Zéro double réservation, zéro oubli.',
    component: CalendarPreview,
  },
  {
    id: 'operations',
    icon: Sparkles,
    eyebrow: 'Ce que vous déléguez',
    title: 'Ménage et maintenance, enfin sous contrôle',
    description: 'Chaque départ génère automatiquement les tâches nécessaires. Vos équipes savent quoi faire, sans appel ni message.',
    benefits: [
      'Tâches générées automatiquement',
      'Affectation par zone ou par agent',
      'Suivi en temps réel des interventions',
    ],
    result: 'Des logements toujours prêts, sans stress.',
    component: CleaningPreview,
  },
  {
    id: 'messaging',
    icon: MessageCircle,
    eyebrow: 'Ce que vous fluidifiez',
    title: 'Messagerie voyageurs, avec le contexte',
    description: 'Tous les messages au même endroit. Pour chaque conversation, le contexte de la réservation est automatiquement affiché.',
    benefits: [
      'Historique complet par voyageur',
      'Contexte de réservation automatique',
      'Réponses rapides pré-configurées',
    ],
    result: 'Une réactivité qui renforce votre image.',
    component: MessagingPreview,
  },
  {
    id: 'stats',
    icon: BarChart3,
    eyebrow: 'Ce que vous comprenez',
    title: 'Des chiffres qui aident à décider',
    description: 'Taux d\'occupation, revenus, performance par bien. Des données utiles, pas des tableaux décoratifs.',
    benefits: [
      'Performance par bien et par période',
      'Comparaison mois par mois',
      'Insights automatiques sur les anomalies',
    ],
    result: 'Moins d\'intuition, plus de décisions éclairées.',
    component: StatsPreview,
  },
];

export function ProductShowcase() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-24">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Le produit</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-4">
            Voilà comment Noé vous accompagne
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pas un tunnel technique. Un partenaire qui vous aide à voir, comprendre et décider.
          </p>
        </div>

        {/* Showcase Sections */}
        <div className="space-y-24 lg:space-y-32">
          {showcaseSections.map((section, index) => {
            const Icon = section.icon;
            const PreviewComponent = section.component;
            const isEven = index % 2 === 0;

            return (
              <div
                key={section.id}
                className={cn(
                  'grid lg:grid-cols-2 gap-12 lg:gap-16 items-center',
                  !isEven && 'lg:flex-row-reverse'
                )}
              >
                {/* Content */}
                <div className={cn('space-y-6', !isEven && 'lg:order-2')}>
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                    <Icon size={16} />
                    <span className="text-sm font-medium">{section.eyebrow}</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
                    {section.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>

                  {/* Benefits list */}
                  <ul className="space-y-3">
                    {section.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-status-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="hsl(var(--status-success))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Result */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Résultat</p>
                      <p className="text-sm text-muted-foreground">{section.result}</p>
                    </div>
                  </div>
                </div>

                {/* Product Preview */}
                <div className={cn(
                  'relative',
                  !isEven && 'lg:order-1'
                )}>
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-2xl opacity-50" />
                  <PreviewComponent className="relative" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
