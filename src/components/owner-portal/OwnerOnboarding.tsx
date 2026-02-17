
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Lock, AlertCircle, User, FileText, Building2, Sparkles, Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingStep } from '@/types/onboarding';

const stepIcons: Record<string, React.ElementType> = {
  lead: User, appointment: Clock, mandate: FileText, rib: Building2,
  preparation: Sparkles, property_creation: Home, publication: ChevronRight, closure: Check,
};

const getStepStatusConfig = (status: string) => {
  switch (status) {
    case 'completed': return { color: 'bg-emerald-500', textColor: 'text-emerald-600', label: 'Terminé' };
    case 'in_progress': case 'todo': return { color: 'bg-amber-500', textColor: 'text-amber-600', label: 'En cours' };
    case 'blocked': return { color: 'bg-red-500', textColor: 'text-red-600', label: 'Bloqué' };
    default: return { color: 'bg-muted', textColor: 'text-muted-foreground', label: 'À venir' };
  }
};

export function OwnerOnboarding() {
  const { user } = useAuth();
  const { allProcesses } = useOnboarding();
  const ownerProcesses = allProcesses.filter(p => p.ownerEmail === user?.email);

  if (ownerProcesses.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Aucun onboarding en cours</h2>
          <p className="text-muted-foreground">Tous vos biens sont déjà en gestion active.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Suivi de l'onboarding</h1>
        <p className="text-muted-foreground mt-1">Suivez l'avancement de la mise en gestion de vos biens</p>
      </div>

      {ownerProcesses.map(process => (
        <Card key={process.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{process.propertyName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{process.propertyAddress}</p>
              </div>
              <Badge variant={process.status === 'completed' ? 'default' : 'secondary'}>
                {process.status === 'completed' ? 'Terminé' : 'En cours'}
              </Badge>
            </div>
            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{process.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${process.progress}%` }} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {process.steps.map((step, i) => {
                const config = getStepStatusConfig(step.status);
                const StepIcon = stepIcons[step.stepType] || Clock;
                const isLast = i === process.steps.length - 1;
                return (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0",
                        step.status === 'completed' ? 'bg-emerald-500 text-white' :
                        step.status === 'in_progress' || step.status === 'todo' ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-300' :
                        step.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground'
                      )}>
                        {step.status === 'completed' ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                      </div>
                      {!isLast && <div className={cn("w-0.5 flex-1 min-h-[24px]", step.status === 'completed' ? 'bg-emerald-300' : 'bg-border')} />}
                    </div>
                    <div className={cn("pb-5 flex-1", isLast && "pb-0")}>
                      <div className="flex items-center gap-2">
                        <h4 className={cn("font-medium text-sm", step.status === 'locked' ? 'text-muted-foreground' : 'text-foreground')}>{step.title}</h4>
                        {step.status !== 'locked' && (
                          <Badge variant="outline" className={cn("text-xs", config.textColor)}>{config.label}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      {step.completedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Complété le {new Date(step.completedAt).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
