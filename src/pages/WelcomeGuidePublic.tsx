import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import WelcomeLanding from '@/components/welcome-guide-public/WelcomeLanding';
import StepProgress from '@/components/welcome-guide-public/StepProgress';
import StepContent from '@/components/welcome-guide-public/StepContent';
import WelcomeStep from '@/components/welcome-guide-public/WelcomeStep';
import UpsellStep from '@/components/welcome-guide-public/UpsellStep';
import CompletionScreen from '@/components/welcome-guide-public/CompletionScreen';

// Standalone public page — no auth, no layout

interface Step {
  id: string;
  type: string;
  title: string;
  description: string;
  imageUrl?: string;
  validationLabel: string;
  isOptional: boolean;
  helpText?: string;
}

interface Upsell {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

const MOCK_DATA = {
  guestName: 'Benjamin',
  propertyName: 'Apt Bellecour – T2 Premium',
  cityName: 'Lyon 2e',
  checkIn: '15 juin',
  checkOut: '18 juin',
  nights: 3,
  hostName: 'Noé Conciergerie',
  heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
  welcomeMessage:
    'Bienvenue dans votre appartement ! Nous espérons que vous passerez un excellent séjour. N\'hésitez pas à nous contacter si besoin.',
  wifiName: 'Bellecour_Guest',
  wifiPassword: 'Welcome2024!',
  houseRules: ['Pas de bruit après 22h', 'Ne pas fumer', 'Trier les déchets'],
  steps: [
    {
      id: 's1',
      type: 'building_arrival',
      title: 'Arrivée au bâtiment',
      description: '12 Place Bellecour, Lyon 2e. Le bâtiment est à droite de la pharmacie.',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      validationLabel: 'Oui, je suis devant le bâtiment',
      isOptional: false,
    },
    {
      id: 's2',
      type: 'key_access',
      title: 'Récupération des clés',
      description: 'La boîte à clés se trouve à gauche. Code : 4589#',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
      validationLabel: "J'ai récupéré les clés",
      isOptional: false,
      helpText: 'Tournez le cadran vers la droite.',
    },
    {
      id: 's3',
      type: 'apartment_access',
      title: 'Accès au logement',
      description: '3ème étage, porte gauche.',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      validationLabel: 'Je suis entré dans le logement',
      isOptional: false,
    },
    {
      id: 's4',
      type: 'welcome',
      title: 'Bienvenue chez vous !',
      description: '',
      validationLabel: "C'est noté, merci !",
      isOptional: false,
    },
    {
      id: 's5',
      type: 'upsell',
      title: 'Améliorez votre séjour',
      description: '',
      validationLabel: 'Continuer',
      isOptional: true,
    },
  ] as Step[],
  upsells: [
    { id: 'u1', name: 'Check-out tardif (14h)', description: 'Profitez jusqu\'à 14h.', price: 35, currency: '€' },
    { id: 'u2', name: 'Ménage supplémentaire', description: 'Un ménage pendant votre séjour.', price: 45, currency: '€' },
    { id: 'u3', name: 'Pack linge premium', description: 'Draps et serviettes supplémentaires.', price: 20, currency: '€' },
  ] as Upsell[],
};

const WelcomeGuidePublic = () => {
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<'landing' | 'steps' | 'complete'>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [acceptedUpsells, setAcceptedUpsells] = useState<string[]>([]);

  const data = MOCK_DATA;
  const step = data.steps[currentStep];

  const handleStart = useCallback(() => setPhase('steps'), []);

  const handleValidate = useCallback(() => {
    if (animating || !step) return;
    setAnimating(true);
    setCompleted((prev) => [...prev, step.id]);

    // Fire confetti when entering apartment
    if (step.type === 'apartment_access') {
      setTimeout(() => {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, disableForReducedMotion: true });
      }, 200);
    }

    setTimeout(() => {
      if (currentStep < data.steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setPhase('complete');
      }
      setAnimating(false);
    }, 500);
  }, [animating, step, currentStep, data.steps.length]);

  const toggleUpsell = useCallback((id: string) => {
    setAcceptedUpsells((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  }, []);

  // Landing
  if (phase === 'landing') {
    return (
      <WelcomeLanding
        guestName={data.guestName}
        propertyName={data.propertyName}
        cityName={data.cityName}
        checkIn={data.checkIn}
        checkOut={data.checkOut}
        nights={data.nights}
        hostName={data.hostName}
        heroImage={data.heroImage}
        onStart={handleStart}
      />
    );
  }

  // Completion
  if (phase === 'complete') {
    return (
      <div className="min-h-[100dvh] bg-[#0a0a0f] flex flex-col">
        <CompletionScreen
          guestName={data.guestName}
          acceptedUpsells={data.upsells.filter((u) => acceptedUpsells.includes(u.id))}
        />
      </div>
    );
  }

  // Steps
  return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] flex flex-col">
      <StepProgress
        total={data.steps.length}
        current={currentStep}
        completedIds={completed}
        stepIds={data.steps.map((s) => s.id)}
      />

      <div className="flex-1 flex flex-col px-5 pb-8">
        {step?.type === 'welcome' ? (
          <WelcomeStep
            welcomeMessage={data.welcomeMessage}
            wifiName={data.wifiName}
            wifiPassword={data.wifiPassword}
            houseRules={data.houseRules}
            validationLabel={step.validationLabel}
            animating={animating}
            onValidate={handleValidate}
          />
        ) : step?.type === 'upsell' ? (
          <UpsellStep
            upsells={data.upsells}
            acceptedIds={acceptedUpsells}
            onToggle={toggleUpsell}
            validationLabel={step.validationLabel}
            animating={animating}
            onValidate={handleValidate}
          />
        ) : step ? (
          <StepContent
            title={step.title}
            description={step.description}
            imageUrl={step.imageUrl}
            validationLabel={step.validationLabel}
            isOptional={step.isOptional}
            helpText={step.helpText}
            animating={animating}
            onValidate={handleValidate}
          />
        ) : null}
      </div>

      <div className="px-6 pb-6 text-center">
        <p className="text-[10px] text-white/15">Powered by Noé · Livret d'accueil interactif</p>
      </div>
    </div>
  );
};

export default WelcomeGuidePublic;
