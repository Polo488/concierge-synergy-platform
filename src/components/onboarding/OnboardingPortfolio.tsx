
import { OnboardingProcess } from '@/types/onboarding';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, User, Calendar, ChevronRight, AlertTriangle, 
  CheckCircle2, Loader2, Clock 
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OnboardingPortfolioProps {
  processes: OnboardingProcess[];
  onSelect: (id: string) => void;
}

const statusConfig = {
  in_progress: { label: 'En cours', color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: Loader2 },
  completed: { label: 'Terminé', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: CheckCircle2 },
  blocked: { label: 'Bloqué', color: 'bg-amber-500/10 text-amber-600 border-amber-200', icon: AlertTriangle },
  cancelled: { label: 'Annulé', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: Clock },
};

export function OnboardingPortfolio({ processes, onSelect }: OnboardingPortfolioProps) {
  if (processes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Aucun onboarding trouvé</p>
        <p className="text-sm mt-1">Créez votre premier onboarding pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {processes.map(process => {
        const cfg = statusConfig[process.status];
        const currentStep = process.steps[process.currentStepIndex];
        
        return (
          <Card
            key={process.id}
            className="border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
            onClick={() => onSelect(process.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2.5">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{process.propertyName}</h3>
                    <Badge variant="outline" className={cfg.color}>
                      <cfg.icon size={12} className="mr-1" />
                      {cfg.label}
                    </Badge>
                    {process.city && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin size={10} className="mr-1" />
                        {process.city}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Info row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {process.ownerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(new Date(process.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </span>
                    <span>Assigné à {process.assignedToName}</span>
                    {process.totalDays && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {process.totalDays}j
                      </span>
                    )}
                  </div>
                  
                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    <Progress value={process.progress} className="h-2 flex-1" />
                    <span className="text-sm font-medium text-foreground w-10 text-right">{process.progress}%</span>
                  </div>
                  
                  {/* Current step */}
                  {currentStep && process.status !== 'completed' && (
                    <div className="text-xs text-muted-foreground">
                      Étape en cours : <span className="font-medium text-foreground">{currentStep.title}</span>
                      <span className="ml-2 text-muted-foreground">
                        ({currentStep.subTasks.filter(st => st.completed).length}/{currentStep.subTasks.length} sous-tâches)
                      </span>
                    </div>
                  )}
                </div>
                
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
