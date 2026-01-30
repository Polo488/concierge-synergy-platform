import { useState } from 'react';
import { ArrowRight, ArrowLeft, Calendar, MessageCircle, BarChart3, CheckCircle2, Users, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// IMPORTANT: Remplacez cette URL par votre vraie URL Calendly
const CALENDLY_URL = "https://calendly.com/votre-url";

interface FormData {
  name: string;
  email: string;
  company: string;
  propertyCount: string;
  needs: string;
}

const demoOutcomes = [
  {
    icon: CheckCircle2,
    title: "Audit express de vos process",
    description: "On analyse ensemble comment vous travaillez aujourd'hui.",
  },
  {
    icon: BarChart3,
    title: "Projection sur vos besoins",
    description: "On identifie ce qui peut être amélioré avec Noé.",
  },
  {
    icon: FileText,
    title: "Plan de déploiement",
    description: "On définit les étapes pour une mise en place réussie.",
  },
];

const steps = [
  { number: 1, label: "Vos informations" },
  { number: 2, label: "Votre activité" },
  { number: 3, label: "Choisir un créneau" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
            currentStep > step.number 
              ? "bg-status-success text-white" 
              : currentStep === step.number
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
          )}>
            {currentStep > step.number ? (
              <Check className="w-4 h-4" />
            ) : (
              step.number
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "w-12 h-0.5 mx-2",
              currentStep > step.number ? "bg-status-success" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function Step1Form({ formData, setFormData, onNext }: { 
  formData: FormData; 
  setFormData: (data: FormData) => void;
  onNext: () => void;
}) {
  const isValid = formData.name.trim() && formData.email.trim();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Vos coordonnées</h3>
        <p className="text-muted-foreground">Pour vous contacter et vous envoyer la confirmation.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Prénom & Nom *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Marie Dupont"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email professionnel *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="marie@conciergerie.com"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <Button 
        size="lg" 
        className="w-full" 
        onClick={onNext}
        disabled={!isValid}
      >
        Continuer
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function Step2Form({ formData, setFormData, onNext, onBack }: { 
  formData: FormData; 
  setFormData: (data: FormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid = formData.company.trim() && formData.propertyCount;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Votre activité</h3>
        <p className="text-muted-foreground">Pour préparer une démo adaptée à vos besoins.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nom de la société *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Conciergerie Côte d'Azur"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nombre de logements *
          </label>
          <select
            value={formData.propertyCount}
            onChange={(e) => setFormData({ ...formData, propertyCount: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">Sélectionner</option>
            <option value="1-10">1 - 10</option>
            <option value="10-30">10 - 30</option>
            <option value="30-50">30 - 50</option>
            <option value="50-100">50 - 100</option>
            <option value="100-200">100 - 200</option>
            <option value="200+">200+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Vos besoins principaux (optionnel)
          </label>
          <textarea
            value={formData.needs}
            onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
            rows={3}
            placeholder="Ex: synchronisation des calendriers, gestion des équipes ménage..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button 
          size="lg" 
          className="flex-1" 
          onClick={onNext}
          disabled={!isValid}
        >
          Choisir un créneau
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Step3Calendly({ formData, onBack }: { formData: FormData; onBack: () => void }) {
  // Build the Calendly URL with prefilled parameters
  const calendlyUrlWithParams = `${CALENDLY_URL}?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formData.company)}&a2=${encodeURIComponent(formData.propertyCount)}`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Choisissez votre créneau</h3>
        <p className="text-muted-foreground">Sélectionnez un horaire qui vous convient pour la démo.</p>
      </div>

      {/* Calendly Embed */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <iframe
          src={calendlyUrlWithParams}
          width="100%"
          height="630"
          frameBorder="0"
          title="Calendly - Réserver une démo"
          className="w-full"
        />
      </div>

      <Button variant="outline" size="lg" onClick={onBack} className="w-full">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Modifier mes informations
      </Button>
    </div>
  );
}

export function EnhancedContactSection({ className }: { className?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    propertyCount: '',
    needs: '',
  });

  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Multi-step Form */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Parlons de votre conciergerie
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              30 minutes pour comprendre vos enjeux et voir si Noé peut vous aider.
            </p>

            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} />

            {/* Step Content */}
            <div className="bg-card rounded-2xl border border-border/50 p-6">
              {currentStep === 1 && (
                <Step1Form 
                  formData={formData} 
                  setFormData={setFormData} 
                  onNext={() => setCurrentStep(2)} 
                />
              )}
              {currentStep === 2 && (
                <Step2Form 
                  formData={formData} 
                  setFormData={setFormData} 
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 3 && (
                <Step3Calendly 
                  formData={formData}
                  onBack={() => setCurrentStep(2)}
                />
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe. 
              Vos données sont traitées conformément à notre politique de confidentialité.
            </p>
          </div>

          {/* Right: Demo Outcomes */}
          <div className="lg:pt-16">
            <div className="bg-card rounded-3xl border border-border/50 p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Ce que vous obtiendrez en démo
              </h3>

              <div className="space-y-6 mb-8">
                {demoOutcomes.map((outcome, index) => {
                  const Icon = outcome.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">{outcome.title}</h4>
                        <p className="text-sm text-muted-foreground">{outcome.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4">
                  La démo dure environ 30 minutes. Vous pouvez inviter vos associés ou collaborateurs.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-status-success/20 border-2 border-card flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-status-success" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-status-info/20 border-2 border-card flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-status-info" />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    +150 conciergeries accompagnées
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-6 p-4 bg-muted/50 rounded-2xl border border-border/30 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="text-status-success">✓</span> Sans engagement 
                <span className="mx-2">•</span> 
                <span className="text-status-success">✓</span> Réponse sous 24h
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
