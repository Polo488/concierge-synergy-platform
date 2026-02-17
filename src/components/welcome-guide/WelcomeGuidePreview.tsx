import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Clock, CheckCircle, Play } from 'lucide-react';
import { WelcomeGuideTemplate } from '@/types/welcomeGuide';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Utensils, Bus, Landmark } from 'lucide-react';
import WelcomeLanding from '@/components/welcome-guide-public/WelcomeLanding';
import StepProgress from '@/components/welcome-guide-public/StepProgress';
import StepContent from '@/components/welcome-guide-public/StepContent';
import WelcomeStep from '@/components/welcome-guide-public/WelcomeStep';
import UpsellStep from '@/components/welcome-guide-public/UpsellStep';
import CompletionScreen from '@/components/welcome-guide-public/CompletionScreen';
import GuideHub from '@/components/welcome-guide-public/GuideHub';

interface Props {
  template: WelcomeGuideTemplate;
  onBack: () => void;
}

type SimulationMode = 'before_arrival' | 'day_of' | 'completed';
type Phase = 'landing' | 'hub' | 'steps' | 'complete';

const MOCK_RECOMMENDATIONS = [
  {
    category: 'Restaurants & bars',
    icon: Utensils,
    color: 'text-orange-600',
    bg: 'bg-orange-50/80 border-orange-200/30',
    items: [
      { name: 'Le Comptoir du Vin', detail: '5 min à pied' },
      { name: 'Café Mokka', detail: 'brunch le week-end' },
    ],
  },
  {
    category: 'Transports',
    icon: Bus,
    color: 'text-blue-600',
    bg: 'bg-blue-50/80 border-blue-200/30',
    items: [
      { name: 'Métro Bellecour', detail: 'ligne A/D, 2 min' },
      { name: "Station Vélo'v", detail: 'en face' },
    ],
  },
  {
    category: 'À découvrir',
    icon: Landmark,
    color: 'text-pink-600',
    bg: 'bg-pink-50/80 border-pink-200/30',
    items: [
      { name: 'Place Bellecour', detail: '1 min' },
      { name: 'Vieux Lyon', detail: '8 min' },
    ],
  },
];

export function WelcomeGuidePreview({ template, onBack }: Props) {
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('day_of');
  const [phase, setPhase] = useState<Phase>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [acceptedUpsells, setAcceptedUpsells] = useState<string[]>([]);
  const [hubSection, setHubSection] = useState('menu');

  const activeSteps = template.steps.filter(s => s.isActive);
  const activeUpsells = template.upsells.filter(u => u.isActive);
  const step = activeSteps[currentStep];

  const isJourneyUnlocked = simulationMode !== 'before_arrival';
  const unlockLabel = simulationMode === 'before_arrival' ? 'Se débloque dans 3 jours (simulation)' : '';

  // Reset on mode/template change
  useEffect(() => {
    setPhase('landing');
    setCurrentStep(0);
    setCompleted([]);
    setAcceptedUpsells([]);
    setHubSection('menu');
  }, [template.id, simulationMode]);

  const handleStartJourney = useCallback(() => {
    if (isJourneyUnlocked) {
      setPhase('steps');
      setCurrentStep(0);
    }
  }, [isJourneyUnlocked]);

  const handleValidate = useCallback(() => {
    if (!step) return;
    setCompleted(prev => [...prev, step.id]);
    if (step.type === 'apartment_access') {
      setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, disableForReducedMotion: true }), 400);
    }
    setTimeout(() => {
      if (currentStep < activeSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setPhase('complete');
      }
    }, 100);
  }, [step, currentStep, activeSteps.length]);

  const handleGoBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
    else setPhase('landing');
  }, [currentStep]);

  const toggleUpsell = useCallback((id: string) => {
    setAcceptedUpsells(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  }, []);

  const upsellsForHub = activeUpsells.map(u => ({
    id: u.id,
    name: u.name,
    description: u.description,
    price: u.price,
    currency: u.currency,
  }));

  const stepsForProgress = activeSteps.map(s => ({ id: s.id }));

  const pageTransition = {
    initial: { opacity: 0, y: 30, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.97 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  };

  const stepTransition = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  };

  const simModes: { key: SimulationMode; label: string; icon: React.ElementType }[] = [
    { key: 'before_arrival', label: 'Avant arrivée', icon: Clock },
    { key: 'day_of', label: 'Jour J', icon: Play },
    { key: 'completed', label: 'Terminé', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50">
      {/* Admin bar */}
      <div className="w-full max-w-md mx-auto px-4 py-3 flex items-center gap-2 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft size={16} /> Retour
        </Button>
        <Badge variant="outline" className="ml-auto text-xs gap-1">
          <Eye size={10} /> Preview
        </Badge>
      </div>

      {/* Simulation mode selector */}
      <div className="w-full max-w-md mx-auto px-4 py-2 flex gap-1.5 bg-white/60 backdrop-blur-xl border-b border-slate-100">
        {simModes.map(m => (
          <button
            key={m.key}
            onClick={() => setSimulationMode(m.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
              simulationMode === m.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <m.icon size={12} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Phone frame */}
      <div className="w-full max-w-md mx-auto relative overflow-hidden" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <AnimatePresence mode="wait">
          {phase === 'landing' && (
            <motion.div key="landing" {...pageTransition} className="min-h-[calc(100vh-100px)]">
              <WelcomeLanding
                guestName="Noé"
                propertyName={template.propertyName || template.name}
                checkIn="2026-02-20"
                checkOut="2026-02-22"
                nights={2}
                hostName="Noé Conciergerie"
                hostInitial="N"
                heroImage="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"
                onStart={handleStartJourney}
                onNavigate={(section) => { setHubSection(section); setPhase('hub'); }}
                journeyLocked={!isJourneyUnlocked}
                unlockLabel={unlockLabel}
              />
            </motion.div>
          )}

          {phase === 'hub' && (
            <motion.div key="hub" {...pageTransition} className="min-h-[calc(100vh-100px)]">
              <GuideHub
                propertyName={template.propertyName || template.name}
                hostName="Noé Conciergerie"
                welcomeMessage={template.welcomeMessage}
                wifiName={template.wifiName}
                wifiPassword={template.wifiPassword}
                houseRules={template.houseRules || []}
                upsells={upsellsForHub}
                acceptedUpsells={acceptedUpsells}
                onToggleUpsell={toggleUpsell}
                recommendations={MOCK_RECOMMENDATIONS}
                onBack={() => setPhase('landing')}
                initialSection={hubSection}
                journeyLocked={!isJourneyUnlocked}
                unlockLabel={unlockLabel}
                onStartJourney={handleStartJourney}
              />
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div key="complete" {...pageTransition} className="min-h-[calc(100vh-100px)] flex flex-col">
              <CompletionScreen
                guestName="Noé"
                acceptedUpsells={activeUpsells.filter(u => acceptedUpsells.includes(u.id)).map(u => ({
                  id: u.id, name: u.name, price: u.price, currency: u.currency,
                }))}
                propertyName={template.propertyName || template.name}
                onGoToHub={() => { setHubSection('menu'); setPhase('hub'); }}
              />
            </motion.div>
          )}

          {phase === 'steps' && (
            <motion.div key="steps" {...pageTransition} className="min-h-[calc(100vh-100px)] flex flex-col">
              <StepProgress
                total={activeSteps.length}
                current={currentStep}
                completedIds={completed}
                stepIds={activeSteps.map(s => s.id)}
              />
              <div className="flex-1 flex flex-col px-5 pb-6 relative">
                <AnimatePresence mode="wait">
                  <motion.div key={step?.id ?? currentStep} {...stepTransition} className="flex-1 flex flex-col">
                    {step?.type === 'welcome' ? (
                      <WelcomeStep
                        welcomeMessage={template.welcomeMessage}
                        wifiName={template.wifiName}
                        wifiPassword={template.wifiPassword}
                        houseRules={template.houseRules || []}
                        validationLabel={step.validationLabel}
                        animating={false}
                        onValidate={handleValidate}
                        onBack={handleGoBack}
                      />
                    ) : step?.type === 'upsell' ? (
                      <UpsellStep
                        upsells={upsellsForHub}
                        acceptedIds={acceptedUpsells}
                        onToggle={toggleUpsell}
                        validationLabel={step.validationLabel}
                        animating={false}
                        onValidate={handleValidate}
                        onBack={handleGoBack}
                      />
                    ) : step ? (
                      <StepContent
                        title={step.title}
                        description={step.description}
                        imageUrl={step.imageUrl}
                        videoUrl={step.videoUrl}
                        validationLabel={step.validationLabel}
                        isOptional={step.isOptional}
                        helpText={step.helpText}
                        animating={false}
                        onValidate={handleValidate}
                        onBack={handleGoBack}
                      />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="px-5 pb-5 text-center">
                <p className="text-[10px] text-slate-300 tracking-wider">Powered by Noé</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
