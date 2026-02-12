
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, HelpCircle, Wifi, BookOpen, ShoppingCart, ChevronRight, X } from 'lucide-react';
import { WelcomeGuideTemplate } from '@/types/welcomeGuide';
import { cn } from '@/lib/utils';

interface Props {
  template: WelcomeGuideTemplate;
  onBack: () => void;
}

export function WelcomeGuidePreview({ template, onBack }: Props) {
  const activeSteps = template.steps.filter(s => s.isActive);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [acceptedUpsells, setAcceptedUpsells] = useState<string[]>([]);

  const currentStep = activeSteps[currentStepIndex];
  const progress = (completedSteps.length / activeSteps.length) * 100;
  const isComplete = completedSteps.length === activeSteps.length;

  const handleValidate = () => {
    if (!currentStep || animating) return;
    setAnimating(true);
    setCompletedSteps(prev => [...prev, currentStep.id]);

    setTimeout(() => {
      if (currentStepIndex < activeSteps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setShowConfetti(true);
      }
      setAnimating(false);
    }, 600);
  };

  const toggleUpsell = (id: string) => {
    setAcceptedUpsells(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };

  // Reset on template change
  useEffect(() => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setShowConfetti(false);
    setAcceptedUpsells([]);
  }, [template.id]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Admin bar */}
      <div className="w-full max-w-md mx-auto px-4 py-3 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft size={16} /> Retour admin
        </Button>
        <Badge variant="outline" className="ml-auto text-xs">Prévisualisation</Badge>
      </div>

      {/* Mobile frame */}
      <div className="w-full max-w-md mx-auto relative" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background rounded-3xl -z-10" />

        {/* Progress bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            {activeSteps.map((step, i) => (
              <div
                key={step.id}
                className={cn(
                  'h-1 rounded-full flex-1 transition-all duration-500',
                  completedSteps.includes(step.id) ? 'bg-primary' : i === currentStepIndex ? 'bg-primary/40' : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Étape {currentStepIndex + 1} / {activeSteps.length}
          </p>
        </div>

        {/* Content area */}
        {!isComplete && currentStep ? (
          <div className={cn('px-6 py-4 transition-all duration-500', animating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0')}>
            {/* Step image */}
            {currentStep.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video shadow-lg">
                <img src={currentStep.imageUrl} alt={currentStep.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            {/* Step content */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">{currentStep.title}</h2>

              {currentStep.type === 'welcome' ? (
                <div className="space-y-4">
                  {/* Welcome card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
                    <p className="text-sm text-foreground leading-relaxed">{template.welcomeMessage}</p>
                  </div>

                  {/* WiFi card */}
                  {template.wifiName && (
                    <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/20 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Wifi size={18} className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">WiFi</p>
                        <p className="text-sm font-medium text-foreground">{template.wifiName}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{template.wifiPassword}</p>
                      </div>
                    </div>
                  )}

                  {/* House rules */}
                  {template.houseRules && template.houseRules.length > 0 && (
                    <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/20">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Règles du logement</p>
                      <ul className="space-y-1.5">
                        {template.houseRules.map((rule, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : currentStep.type === 'upsell' ? (
                <div className="space-y-3">
                  {template.upsells.filter(u => u.isActive).map(upsell => {
                    const accepted = acceptedUpsells.includes(upsell.id);
                    return (
                      <button
                        key={upsell.id}
                        onClick={() => toggleUpsell(upsell.id)}
                        className={cn(
                          'w-full p-4 rounded-2xl text-left transition-all duration-300 border',
                          accepted
                            ? 'bg-primary/10 border-primary/30 shadow-md'
                            : 'bg-card/80 border-border/20 hover:border-primary/20'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{upsell.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{upsell.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-3 shrink-0">
                            <span className="text-sm font-bold text-foreground">{upsell.price} {upsell.currency}</span>
                            <div className={cn(
                              'h-6 w-6 rounded-full flex items-center justify-center transition-all',
                              accepted ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted'
                            )}>
                              {accepted && <Check size={12} />}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {acceptedUpsells.length > 0 && (
                    <div className="text-center text-xs text-muted-foreground pt-2">
                      {acceptedUpsells.length} service(s) sélectionné(s) · Total : {template.upsells.filter(u => acceptedUpsells.includes(u.id)).reduce((sum, u) => sum + u.price, 0)} €
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">{currentStep.description}</p>
              )}
            </div>

            {/* Help button */}
            {currentStep.helpText && (
              <>
                <button
                  onClick={() => setShowHelp(true)}
                  className="mt-4 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <HelpCircle size={14} /> Besoin d'aide ?
                </button>
                {showHelp && (
                  <div className="mt-2 p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm text-foreground animate-fade-in">
                    <div className="flex items-start justify-between">
                      <p>{currentStep.helpText}</p>
                      <button onClick={() => setShowHelp(false)} className="ml-2 shrink-0"><X size={14} /></button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* CTA */}
            <div className="mt-8 pb-8">
              <Button
                onClick={handleValidate}
                size="lg"
                className="w-full h-14 text-base rounded-2xl shadow-lg gap-2 active:scale-[0.97] transition-all"
              >
                {currentStep.validationLabel}
                <ChevronRight size={18} />
              </Button>
              {currentStep.isOptional && (
                <button
                  onClick={handleValidate}
                  className="w-full text-center mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Passer cette étape
                </button>
              )}
            </div>
          </div>
        ) : isComplete ? (
          <div className="px-6 py-12 text-center animate-scale-in">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenue ! 🎉</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Votre parcours d'accueil est terminé. Profitez bien de votre séjour !
            </p>
            {acceptedUpsells.length > 0 && (
              <div className="mt-6 p-4 rounded-2xl bg-primary/5">
                <p className="text-sm text-muted-foreground">Vos services ajoutés :</p>
                <div className="mt-2 space-y-1">
                  {template.upsells.filter(u => acceptedUpsells.includes(u.id)).map(u => (
                    <p key={u.id} className="text-sm font-medium text-foreground">{u.name} – {u.price} {u.currency}</p>
                  ))}
                </div>
              </div>
            )}
            <Button variant="outline" onClick={onBack} className="mt-8">
              Retour à l'admin
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', variant === 'outline' ? 'border-border text-muted-foreground' : 'bg-primary/10 text-primary border-primary/20', className)}>
      {children}
    </span>
  );
}
