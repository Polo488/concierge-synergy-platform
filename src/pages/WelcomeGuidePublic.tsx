
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, HelpCircle, Wifi, ChevronRight, X, BookOpen, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Standalone public page — no auth, no layout, Apple-inspired mobile-first design

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

// Mock data loader (in production, fetch by token)
const MOCK_DATA = {
  guestName: 'Jean',
  propertyName: 'Apt Bellecour – T2 Premium',
  welcomeMessage: 'Bienvenue dans votre appartement ! Nous espérons que vous passerez un excellent séjour.',
  wifiName: 'Bellecour_Guest',
  wifiPassword: 'Welcome2024!',
  houseRules: ['Pas de bruit après 22h', 'Ne pas fumer', 'Trier les déchets'],
  steps: [
    { id: 's1', type: 'building_arrival', title: 'Arrivée au bâtiment', description: '12 Place Bellecour, Lyon 2e. Le bâtiment est à droite de la pharmacie.', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', validationLabel: 'Oui, je suis devant le bâtiment', isOptional: false },
    { id: 's2', type: 'key_access', title: 'Récupération des clés', description: 'La boîte à clés se trouve à gauche. Code : 4589#', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', validationLabel: 'J\'ai récupéré les clés', isOptional: false, helpText: 'Tournez le cadran vers la droite.' },
    { id: 's3', type: 'apartment_access', title: 'Accès au logement', description: '3ème étage, porte gauche.', imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', validationLabel: 'Je suis entré dans le logement', isOptional: false },
    { id: 's4', type: 'welcome', title: 'Bienvenue chez vous !', description: '', validationLabel: 'C\'est noté, merci !', isOptional: false },
    { id: 's5', type: 'upsell', title: 'Améliorez votre séjour', description: '', validationLabel: 'Continuer', isOptional: true },
  ] as Step[],
  upsells: [
    { id: 'u1', name: 'Check-out tardif (14h)', description: 'Profitez jusqu\'à 14h.', price: 35, currency: '€' },
    { id: 'u2', name: 'Ménage supplémentaire', description: 'Un ménage pendant votre séjour.', price: 45, currency: '€' },
    { id: 'u3', name: 'Pack linge premium', description: 'Draps et serviettes supplémentaires.', price: 20, currency: '€' },
  ] as Upsell[],
};

const WelcomeGuidePublic = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [acceptedUpsells, setAcceptedUpsells] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  const data = MOCK_DATA;
  const step = data.steps[currentStep];
  const isComplete = completed.length === data.steps.length;

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
  }, []);

  const handleValidate = () => {
    if (animating || !step) return;
    setAnimating(true);
    setCompleted(prev => [...prev, step.id]);
    setTimeout(() => {
      if (currentStep < data.steps.length - 1) setCurrentStep(prev => prev + 1);
      setAnimating(false);
      setShowHelp(false);
    }, 500);
  };

  const toggleUpsell = (id: string) => {
    setAcceptedUpsells(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Status bar spacer */}
      <div className="h-safe-top" />

      {/* Progress dots */}
      <div className={cn('px-6 pt-6 pb-2 transition-all duration-700', loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4')}>
        <div className="flex items-center gap-1.5">
          {data.steps.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                'h-1 rounded-full flex-1 transition-all duration-500',
                completed.includes(s.id)
                  ? 'bg-emerald-500'
                  : i === currentStep
                    ? 'bg-emerald-500/40'
                    : 'bg-slate-200 dark:bg-slate-700'
              )}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2 font-medium tracking-wide">
          ÉTAPE {currentStep + 1} SUR {data.steps.length}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-5 pb-8">
        {!isComplete && step ? (
          <div className={cn(
            'flex-1 flex flex-col transition-all duration-500',
            animating ? 'opacity-0 scale-95 translate-y-6' : 'opacity-100 scale-100 translate-y-0'
          )}>
            {/* Image */}
            {step.imageUrl && (
              <div className="rounded-3xl overflow-hidden mt-4 mb-5 aspect-[4/3] shadow-xl relative">
                <img src={step.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {step.title}
            </h1>

            {/* Content based on type */}
            {step.type === 'welcome' ? (
              <div className="mt-4 space-y-3 flex-1">
                <div className="p-5 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-sm">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{data.welcomeMessage}</p>
                </div>
                {data.wifiName && (
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Wifi size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">WiFi</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{data.wifiName}</p>
                      <p className="text-xs text-slate-500 font-mono">{data.wifiPassword}</p>
                    </div>
                  </div>
                )}
                {data.houseRules.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2">Règles</p>
                    {data.houseRules.map((rule, i) => (
                      <p key={i} className="text-sm text-slate-700 dark:text-slate-200 py-1">• {rule}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : step.type === 'upsell' ? (
              <div className="mt-4 space-y-3 flex-1">
                <p className="text-sm text-slate-500">Sélectionnez les services qui vous intéressent :</p>
                {data.upsells.map(u => {
                  const accepted = acceptedUpsells.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      onClick={() => toggleUpsell(u.id)}
                      className={cn(
                        'w-full p-4 rounded-2xl text-left transition-all duration-300 border',
                        accepted
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 shadow-md shadow-emerald-500/10'
                          : 'bg-white/80 dark:bg-white/5 border-slate-200/50 dark:border-white/10'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{u.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className="text-base font-bold text-slate-900 dark:text-white">{u.price}{u.currency}</span>
                          <div className={cn(
                            'h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300',
                            accepted ? 'bg-emerald-500 scale-110' : 'bg-slate-100 dark:bg-slate-700'
                          )}>
                            {accepted && <Check size={14} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed flex-1">
                {step.description}
              </p>
            )}

            {/* Help */}
            {step.helpText && (
              <div className="mt-3">
                <button onClick={() => setShowHelp(!showHelp)} className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <HelpCircle size={14} /> Besoin d'aide ?
                </button>
                {showHelp && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-sm text-slate-700 dark:text-slate-200 animate-fade-in border border-emerald-100 dark:border-emerald-500/20">
                    {step.helpText}
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-6">
              <button
                onClick={handleValidate}
                className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-xl shadow-slate-900/20 dark:shadow-white/10"
              >
                {step.validationLabel}
                <ChevronRight size={18} />
              </button>
              {step.isOptional && (
                <button onClick={handleValidate} className="w-full text-center mt-3 text-sm text-slate-400 font-medium">
                  Passer
                </button>
              )}
            </div>
          </div>
        ) : isComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-scale-in">
            <div className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-8">
              <Check size={44} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Bienvenue, {data.guestName} ! 🎉
            </h1>
            <p className="text-slate-500 mt-3 max-w-xs text-sm leading-relaxed">
              Votre parcours est terminé. Profitez de votre séjour !
            </p>
            {acceptedUpsells.length > 0 && (
              <div className="mt-6 p-5 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 w-full max-w-xs">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2">Services ajoutés</p>
                {data.upsells.filter(u => acceptedUpsells.includes(u.id)).map(u => (
                  <div key={u.id} className="flex justify-between py-1.5 text-sm">
                    <span className="text-slate-700 dark:text-slate-200">{u.name}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{u.price}{u.currency}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 dark:border-white/10 mt-2 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-slate-700 dark:text-slate-200">Total</span>
                  <span className="text-slate-900 dark:text-white">
                    {data.upsells.filter(u => acceptedUpsells.includes(u.id)).reduce((s, u) => s + u.price, 0)} €
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Legal disclaimer */}
      <div className="px-6 pb-6 text-center">
        <p className="text-[10px] text-slate-300 dark:text-slate-600">Powered by Noé · Livret d'accueil interactif</p>
      </div>
    </div>
  );
};

export default WelcomeGuidePublic;
