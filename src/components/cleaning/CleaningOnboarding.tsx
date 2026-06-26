import { useState } from 'react';
import { CheckCircle2, Users, Settings, Home, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCleaningTeam } from '@/contexts/CleaningTeamContext';
import { CleaningAgenciesDialog } from './CleaningAgenciesDialog';
import { CleaningAssignmentDialog } from './CleaningAssignmentDialog';

export const CleaningOnboarding = () => {
  const { setupSteps } = useCleaningTeam();
  const [agenciesOpen, setAgenciesOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const steps = [
    {
      id: 'agencies',
      done: setupSteps.agencies,
      icon: <Users className="h-5 w-5" />,
      title: 'Ajoutez vos agences de ménage',
      desc: "Une agence = un compte unique avec ses jours travaillés et son volume max par jour.",
      cta: 'Ajouter une agence',
      onAction: () => setAgenciesOpen(true),
    },
    {
      id: 'mode',
      done: setupSteps.mode,
      icon: <Settings className="h-5 w-5" />,
      title: "Choisissez le mode d'assignation",
      desc: 'Priorité, Rotation ou Dédié — selon votre organisation.',
      cta: "Configurer l'assignation",
      onAction: () => setAssignOpen(true),
    },
    {
      id: 'properties',
      done: setupSteps.properties,
      icon: <Home className="h-5 w-5" />,
      title: 'Rattachez vos logements',
      desc: 'Chaque logement à son agence ou son mode. Les ménages futurs seront affectés automatiquement.',
      cta: 'Rattacher les logements',
      onAction: () => setAssignOpen(true),
    },
  ];

  const currentStep = steps.find((s) => !s.done) ?? steps[steps.length - 1];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-[22px] font-bold text-foreground">
          Construisons votre équipe de ménage
        </h2>
        <p className="text-[13px] text-muted-foreground mt-1.5 max-w-md mx-auto">
          Trois étapes pour que les ménages s'organisent tout seuls. Vous reprenez la main quand vous voulez.
        </p>

        {/* Checklist progress */}
        <div className="mt-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Étape {doneCount + (currentStep.done ? 0 : 1)} / 3
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums">{doneCount} / 3</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            />
          </div>

          <div className="mt-5 space-y-2 text-left">
            {steps.map((s) => {
              const active = s.id === currentStep.id;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                    s.done
                      ? 'border-[hsl(142,71%,85%)] bg-[hsl(142,71%,97%)]'
                      : active
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      s.done
                        ? 'bg-[hsl(142,71%,40%)] text-white'
                        : active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s.done ? <CheckCircle2 className="h-4 w-4" /> : s.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-foreground truncate">{s.title}</p>
                    <p className="text-[12px] text-muted-foreground truncate">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {!setupSteps.agencies || !setupSteps.mode || !setupSteps.properties ? (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-5"
              >
                <Button
                  size="lg"
                  onClick={currentStep.onAction}
                  className="h-12 px-6 rounded-[14px] text-[14px] font-semibold gap-2 shadow-md"
                >
                  {currentStep.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <CleaningAgenciesDialog open={agenciesOpen} onOpenChange={setAgenciesOpen} />
      <CleaningAssignmentDialog open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  );
};
