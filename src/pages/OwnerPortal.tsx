
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useSignatureContext } from '@/contexts/SignatureContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check, Clock, Lock, AlertCircle, Home, MapPin, User, 
  FileText, PenTool, ChevronRight, Building2, Sparkles
} from 'lucide-react';
import { OnboardingStep, OnboardingProcess } from '@/types/onboarding';
import { SigningFlow } from '@/components/signature/SigningFlow';
import { cn } from '@/lib/utils';

const stepIcons: Record<string, React.ElementType> = {
  lead: User,
  appointment: Clock,
  mandate: FileText,
  rib: Building2,
  preparation: Sparkles,
  property_creation: Home,
  publication: ChevronRight,
  closure: Check,
};

const getStepStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return { color: 'bg-emerald-500', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50', label: 'Terminé', icon: Check };
    case 'in_progress':
    case 'todo':
      return { color: 'bg-amber-500', textColor: 'text-amber-600', bgColor: 'bg-amber-50', label: 'En cours', icon: Clock };
    case 'blocked':
      return { color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50', label: 'Bloqué', icon: AlertCircle };
    default:
      return { color: 'bg-muted', textColor: 'text-muted-foreground', bgColor: 'bg-muted/30', label: 'À venir', icon: Lock };
  }
};

export default function OwnerPortal() {
  const { user } = useAuth();
  const { allProcesses } = useOnboarding();
  const sig = useSignatureContext();
  const [showSigning, setShowSigning] = useState(false);

  // Find onboardings linked to this owner's email
  const ownerProcesses = allProcesses.filter(
    p => p.ownerEmail === user?.email
  );

  // Find an active session for this owner
  const ownerSession = sig.sessions.find(
    s => s.ownerEmail === user?.email && s.status !== 'signed'
  );
  const sessionTemplate = ownerSession 
    ? sig.templates.find(t => t.id === ownerSession.templateId) 
    : null;
  const sessionZoneData = ownerSession 
    ? sig.getSessionZoneData(ownerSession.id) 
    : [];

  if (showSigning && ownerSession && sessionTemplate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => setShowSigning(false)} 
          className="mb-4"
        >
          ← Retour à mon espace
        </Button>
        <SigningFlow
          template={sessionTemplate}
          session={ownerSession}
          zoneData={sessionZoneData}
          onCompleteZone={sig.completeZone}
          onSign={sig.signSession}
          onView={sig.viewSession}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenue, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Suivez l'avancement de la mise en gestion de votre bien
        </p>
      </div>

      {ownerProcesses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucun bien en cours</h2>
            <p className="text-muted-foreground">
              Votre gestionnaire n'a pas encore initié le processus pour votre bien.
            </p>
          </CardContent>
        </Card>
      ) : (
        ownerProcesses.map(process => (
          <OwnerProcessCard 
            key={process.id} 
            process={process}
            onSign={() => setShowSigning(true)}
          />
        ))
      )}
    </div>
  );
}

function OwnerProcessCard({ process, onSign }: { process: OnboardingProcess; onSign: () => void }) {
  const sig = useSignatureContext();
  const hasSignatureSession = sig.sessions.some(
    s => s.ownerEmail === process.ownerEmail && s.status !== 'signed'
  );
  const mandateStep = process.steps.find(s => s.stepType === 'mandate');
  const canSign = mandateStep && (mandateStep.status === 'in_progress' || mandateStep.status === 'todo') && hasSignatureSession;

  return (
    <div className="space-y-6">
      {/* Property Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{process.propertyName}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{process.propertyAddress}</span>
              </div>
            </div>
            <Badge variant={process.status === 'completed' ? 'default' : 'secondary'}>
              {process.status === 'completed' ? 'Terminé' : 
               process.status === 'blocked' ? 'En attente' : 'En cours'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Responsable : {process.assignedToName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>{process.propertyType}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{process.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${process.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signing CTA */}
      {canSign && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Mandat de gestion à signer</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre mandat est prêt. Signez-le pour poursuivre la mise en gestion.
                  </p>
                </div>
              </div>
              <Button onClick={onSign} size="lg">
                Signer le mandat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Étapes de mise en gestion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {process.steps.map((step, index) => (
              <StepTimelineItem 
                key={step.id} 
                step={step} 
                isLast={index === process.steps.length - 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StepTimelineItem({ step, isLast }: { step: OnboardingStep; isLast: boolean }) {
  const config = getStepStatusConfig(step.status);
  const StepIcon = stepIcons[step.stepType] || Clock;

  return (
    <div className="flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
          step.status === 'completed' ? 'bg-emerald-500 text-white' :
          step.status === 'in_progress' || step.status === 'todo' ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-300' :
          step.status === 'blocked' ? 'bg-red-100 text-red-600' :
          'bg-muted text-muted-foreground'
        )}>
          {step.status === 'completed' ? (
            <Check className="h-5 w-5" />
          ) : (
            <StepIcon className="h-5 w-5" />
          )}
        </div>
        {!isLast && (
          <div className={cn(
            "w-0.5 flex-1 min-h-[32px]",
            step.status === 'completed' ? 'bg-emerald-300' : 'bg-border'
          )} />
        )}
      </div>

      {/* Content */}
      <div className={cn("pb-6 flex-1", isLast && "pb-0")}>
        <div className="flex items-center gap-2">
          <h4 className={cn(
            "font-medium",
            step.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
          )}>
            {step.title}
          </h4>
          {step.status !== 'locked' && (
            <Badge variant="outline" className={cn("text-xs", config.textColor)}>
              {config.label}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
        {step.completedAt && (
          <p className="text-xs text-muted-foreground mt-1">
            Complété le {new Date(step.completedAt).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
    </div>
  );
}
