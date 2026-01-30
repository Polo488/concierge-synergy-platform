import { useState } from 'react';
import { Link2, Calendar, Sparkles, MessageCircle, BarChart3, X, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TourStep {
  id: string;
  number: number;
  icon: React.ElementType;
  title: string;
  shortTitle: string;
  benefits: string[];
  replaces: string[];
}

const tourSteps: TourStep[] = [
  {
    id: 'channels',
    number: 1,
    icon: Link2,
    title: 'Connexion canaux',
    shortTitle: 'Canaux',
    benefits: [
      'Synchronisation Airbnb, Booking et autres',
      'Import automatique des réservations',
      'Mise à jour des disponibilités en temps réel',
    ],
    replaces: ['Copier-coller entre plateformes', 'Vérifications manuelles quotidiennes', 'Risque de double réservation'],
  },
  {
    id: 'calendar',
    number: 2,
    icon: Calendar,
    title: 'Calendrier & disponibilités',
    shortTitle: 'Calendrier',
    benefits: [
      'Vue multi-lots sur une seule page',
      'Prix et règles par période',
      'Blocages et disponibilités en un clic',
    ],
    replaces: ['Tableurs Excel complexes', 'Calendriers papier', 'Allers-retours entre outils'],
  },
  {
    id: 'operations',
    number: 3,
    icon: Sparkles,
    title: 'Ménage, maintenance, repasse',
    shortTitle: 'Opérations',
    benefits: [
      'Tâches générées automatiquement',
      'Affectation aux agents terrain',
      'Suivi en temps réel des interventions',
    ],
    replaces: ['Groupes WhatsApp', 'Appels téléphoniques', 'Post-it et mémos'],
  },
  {
    id: 'messaging',
    number: 4,
    icon: MessageCircle,
    title: 'Messagerie voyageurs',
    shortTitle: 'Messagerie',
    benefits: [
      'Tous les messages au même endroit',
      'Contexte de réservation automatique',
      'Réponses rapides pré-configurées',
    ],
    replaces: ['Notifications dispersées', 'Recherche d\'historique', 'Réponses incohérentes'],
  },
  {
    id: 'stats',
    number: 5,
    icon: BarChart3,
    title: 'Stats & pilotage',
    shortTitle: 'Stats',
    benefits: [
      'Performance par bien et par période',
      'Taux d\'occupation et revenus',
      'Qualité ménage et incidents',
    ],
    replaces: ['Reporting manuel', 'Intuition sans données', 'Exports Excel laborieux'],
  },
];

function StepModal({ step, onClose }: { step: TourStep; onClose: () => void }) {
  const Icon = step.icon;
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground">Étape {step.number}</span>
              <DialogTitle className="text-xl">{step.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Screenshot placeholder */}
          <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-border/30 flex items-center justify-center">
            <div className="text-center">
              <Icon className="w-12 h-12 text-primary/40 mx-auto mb-2" />
              <span className="text-sm text-muted-foreground">Capture {step.shortTitle}</span>
            </div>
          </div>

          {/* Benefits & Replaces */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Ce que vous gagnez</h4>
              <ul className="space-y-2">
                {step.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-status-success mt-0.5">✓</span>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Ce que ça remplace</h4>
              <ul className="space-y-2">
                {step.replaces.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-status-error mt-0.5">✗</span>
                    <span className="text-muted-foreground line-through">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button asChild>
            <Link to="/contact">
              Demander une démo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProductTourSection({ className }: { className?: string }) {
  const [selectedStep, setSelectedStep] = useState<TourStep | null>(null);

  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Tour express
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Découvrez Noé en 90 secondes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            5 étapes pour comprendre comment Noé transforme votre quotidien.
          </p>
        </div>

        {/* Tour Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {tourSteps.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className="group relative bg-card rounded-2xl border border-border/50 p-6 text-left transition-all duration-300 hover:shadow-elevated hover:border-primary/30 hover:scale-[1.02]"
                >
                  {/* Step number */}
                  <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-foreground mb-1">{step.shortTitle}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{step.title}</p>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal */}
        {selectedStep && (
          <StepModal step={selectedStep} onClose={() => setSelectedStep(null)} />
        )}
      </div>
    </section>
  );
}
