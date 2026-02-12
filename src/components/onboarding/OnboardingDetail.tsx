
import { OnboardingProcess, OnboardingStepStatus, StepActionData } from '@/types/onboarding';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, CheckCircle2, Lock, Loader2, Clock, AlertTriangle, 
  User, MapPin, Phone, Mail, Calendar, FileText, ChevronDown, ChevronUp,
  Plug
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LeadStep } from './steps/LeadStep';
import { AppointmentStep } from './steps/AppointmentStep';
import { MandateStep } from './steps/MandateStep';
import { RibStep } from './steps/RibStep';
import { PreparationStep } from './steps/PreparationStep';
import { PropertyCreationStep } from './steps/PropertyCreationStep';
import { PublicationStep } from './steps/PublicationStep';
import { ClosureStep } from './steps/ClosureStep';

interface OnboardingDetailProps {
  process: OnboardingProcess;
  onBack: () => void;
  onUpdateStepAction: (processId: string, stepId: string, data: StepActionData) => void;
}

const stepStatusConfig: Record<OnboardingStepStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  locked: { label: 'Verrouillée', icon: Lock, color: 'text-muted-foreground', bg: 'bg-muted' },
  todo: { label: 'À faire', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  in_progress: { label: 'En cours', icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-500/15' },
  waiting: { label: 'En attente', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  completed: { label: 'Validée', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  blocked: { label: 'Bloquée', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export function OnboardingDetail({ process, onBack, onUpdateStepAction }: OnboardingDetailProps) {
  const [expandedSteps, setExpandedSteps] = useState<string[]>(
    process.steps.filter(s => s.status !== 'locked' && s.status !== 'completed').map(s => s.id)
  );

  const toggleExpand = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const renderStepAction = (step: typeof process.steps[0]) => {
    switch (step.stepType) {
      case 'lead':
        return <LeadStep step={step} process={process} />;
      case 'appointment':
        return <AppointmentStep step={step} processId={process.id} onUpdateAction={onUpdateStepAction as any} />;
      case 'mandate':
        return <MandateStep step={step} processId={process.id} ownerName={process.ownerName} ownerEmail={process.ownerEmail} propertyAddress={process.propertyAddress} onUpdateAction={onUpdateStepAction as any} />;
      case 'rib':
        return <RibStep step={step} processId={process.id} onUpdateAction={onUpdateStepAction as any} />;
      case 'preparation':
        return <PreparationStep step={step} processId={process.id} onUpdateAction={onUpdateStepAction as any} />;
      case 'property_creation':
        return <PropertyCreationStep step={step} processId={process.id} onUpdateAction={onUpdateStepAction as any} />;
      case 'publication':
        return <PublicationStep step={step} processId={process.id} onUpdateAction={onUpdateStepAction as any} />;
      case 'closure':
        return <ClosureStep step={step} processId={process.id} onUpdateAction={onUpdateStepAction as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="mt-0.5">
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-foreground">{process.propertyName}</h2>
            <Badge variant="outline" className={
              process.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
              process.status === 'blocked' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'
            }>
              {process.status === 'completed' ? 'Terminé' : process.status === 'blocked' ? 'Bloqué' : 'En cours'}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={process.progress} className="h-2.5 flex-1 max-w-md" />
            <span className="text-sm font-bold text-foreground">{process.progress}%</span>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border border-border/50">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">Propriétaire</p>
            <p className="font-semibold text-foreground flex items-center gap-2"><User size={14} />{process.ownerName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail size={11} />{process.ownerEmail}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone size={11} />{process.ownerPhone}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">Logement</p>
            <p className="font-semibold text-foreground flex items-center gap-2"><MapPin size={14} />{process.propertyAddress}</p>
            <p className="text-xs text-muted-foreground">Type : {process.propertyType} • Source : {process.source}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">Suivi</p>
            <p className="text-sm text-foreground flex items-center gap-2">
              <Calendar size={14} />
              Démarré le {format(new Date(process.createdAt), 'dd MMMM yyyy', { locale: fr })}
            </p>
            <p className="text-xs text-muted-foreground">Responsable : {process.assignedToName}</p>
            {process.totalDays && <p className="text-xs text-muted-foreground">Durée : {process.totalDays} jours</p>}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Timeline Steps */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <FileText size={16} />
          Parcours d'onboarding
        </h3>
        
        <div className="relative">
          <div className="absolute left-[19px] top-8 bottom-4 w-0.5 bg-border" />
          
          <div className="space-y-2">
            {process.steps.map((step, i) => {
              const cfg = stepStatusConfig[step.status];
              const isExpanded = expandedSteps.includes(step.id);
              const isLocked = step.status === 'locked';

              return (
                <div key={step.id} className={cn("relative", isLocked && "opacity-50")}>
                  <div 
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                      "hover:bg-accent/30",
                      isExpanded && "bg-accent/20"
                    )}
                    onClick={() => !isLocked && toggleExpand(step.id)}
                  >
                    <div className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2",
                      step.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                      step.status === 'in_progress' ? 'bg-blue-500 border-blue-500 text-white' :
                      step.status === 'blocked' ? 'bg-red-500 border-red-500 text-white' :
                      step.status === 'todo' ? 'bg-background border-blue-300 text-blue-500' :
                      'bg-muted border-border text-muted-foreground'
                    )}>
                      {step.status === 'completed' ? <CheckCircle2 size={18} /> :
                       step.status === 'locked' ? <Lock size={14} /> :
                       <span className="text-sm font-bold">{i + 1}</span>}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{step.title}</span>
                        <Badge variant="outline" className={cn('text-[10px] py-0 h-5', cfg.bg, cfg.color)}>
                          {cfg.label}
                        </Badge>
                        {step.linkedModule && (
                          <Badge variant="secondary" className="text-[9px] py-0 h-4 gap-0.5">
                            <Plug size={8} />{step.linkedModule}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{step.description}</p>
                    </div>
                    
                    {!isLocked && (
                      isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : 
                      <ChevronDown size={16} className="text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Expanded action UI */}
                  {isExpanded && !isLocked && (
                    <div className="ml-[52px] pb-3 pr-2">
                      {renderStepAction(step)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audit trail */}
      {process.auditTrail.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Historique</h3>
            <div className="space-y-1">
              {process.auditTrail.map(entry => (
                <div key={entry.id} className="flex items-center gap-3 text-xs text-muted-foreground py-1">
                  <span>{format(new Date(entry.date), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
                  <span className="font-medium text-foreground">{entry.userName}</span>
                  <span>{entry.action}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
