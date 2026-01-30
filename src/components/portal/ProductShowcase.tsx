import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Sparkles, MessageCircle, BarChart3, Wrench, Users } from 'lucide-react';
import { ProductPreviewCalendar } from './ProductPreviewCalendar';
import { ProductPreviewCleaning } from './ProductPreviewCleaning';
import { ProductPreviewMessaging } from './ProductPreviewMessaging';
import { ProductPreviewStats } from './ProductPreviewStats';

const showcaseSections = [
  {
    id: 'calendar',
    icon: Calendar,
    title: 'Un calendrier que vos équipes comprennent',
    description: 'Vue unifiée de toutes vos réservations, par bien et par période. Plus de doute sur qui arrive, qui part, et quand.',
    benefit: 'Fini les doubles réservations et les oublis de check-in.',
    component: ProductPreviewCalendar,
  },
  {
    id: 'cleaning',
    icon: Sparkles,
    title: 'Ménage et maintenance enfin structurés',
    description: 'Chaque intervention est planifiée, assignée et suivie. Vos équipes savent quoi faire, sans appel ni message.',
    benefit: 'Des logements toujours prêts, sans stress.',
    component: ProductPreviewCleaning,
  },
  {
    id: 'messaging',
    icon: MessageCircle,
    title: 'Messagerie voyageurs, connectée aux opérations',
    description: 'Tous les messages au même endroit. Historique complet, réponses rapides, contexte automatique.',
    benefit: 'Une communication fluide qui renforce votre image.',
    component: ProductPreviewMessaging,
  },
  {
    id: 'stats',
    icon: BarChart3,
    title: 'Des statistiques qui aident à décider',
    description: 'Taux d\'occupation, revenus, performance par bien. Des chiffres utiles, pas des tableaux décoratifs.',
    benefit: 'Pilotez votre activité avec des données fiables.',
    component: ProductPreviewStats,
  },
];

export function ProductShowcase() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-24">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Découvrir le produit</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-4">
            Ce que Noé fait pour vous
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque fonctionnalité répond à un problème concret du quotidien des conciergeries.
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
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                    <Icon size={16} />
                    <span className="text-sm font-medium">Module</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
                    {section.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-6 h-6 rounded-full bg-[hsl(152,50%,45%)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="hsl(152,50%,45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-sm text-foreground font-medium">{section.benefit}</p>
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
