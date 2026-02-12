
import { OnboardingStep, ClosureActionData } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Power, CheckCircle2, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';

interface ClosureStepProps {
  step: OnboardingStep;
  processId: string;
  onUpdateAction: (processId: string, stepId: string, data: ClosureActionData) => void;
}

export function ClosureStep({ step, processId, onUpdateAction }: ClosureStepProps) {
  const data = (step.actionData as ClosureActionData) || { messageSent: false, propertyActivated: false };

  const handleSendMessage = () => {
    onUpdateAction(processId, step.id, {
      ...data,
      messageSent: true,
      messageSentAt: new Date().toISOString(),
    });
    toast.success('Message de fin d\'onboarding envoyé au propriétaire');
  };

  const handleActivate = () => {
    onUpdateAction(processId, step.id, {
      ...data,
      propertyActivated: true,
      activatedAt: new Date().toISOString(),
    });
    toast.success('Logement activé — Début du suivi opérationnel');
  };

  const allDone = data.messageSent && data.propertyActivated;

  return (
    <div className="space-y-4">
      {allDone && (
        <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-500/5 text-center space-y-3">
          <PartyPopper size={32} className="text-emerald-500 mx-auto" />
          <h4 className="text-lg font-bold text-emerald-700">Onboarding terminé ! 🎉</h4>
          <p className="text-sm text-muted-foreground">
            Le logement est maintenant actif et suivi dans tous les modules : Ménage, Stats, Finance, Communication.
          </p>
        </div>
      )}

      {/* Send message */}
      <div className="p-4 rounded-xl border border-border/50 bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${data.messageSent ? 'bg-emerald-500/10' : 'bg-muted'}`}>
            <Send size={14} className={data.messageSent ? 'text-emerald-500' : 'text-muted-foreground'} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Message de fin d'onboarding</p>
            <p className="text-xs text-muted-foreground">
              {data.messageSent
                ? `Envoyé le ${data.messageSentAt && new Date(data.messageSentAt).toLocaleDateString('fr-FR')}`
                : 'Envoyer un message de bienvenue au propriétaire'}
            </p>
          </div>
        </div>
        {data.messageSent ? (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600"><CheckCircle2 size={10} className="mr-1" />Envoyé</Badge>
        ) : (
          <Button size="sm" onClick={handleSendMessage}>
            <Send size={14} className="mr-1.5" />
            Envoyer
          </Button>
        )}
      </div>

      {/* Activate property */}
      <div className="p-4 rounded-xl border border-border/50 bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${data.propertyActivated ? 'bg-emerald-500/10' : 'bg-muted'}`}>
            <Power size={14} className={data.propertyActivated ? 'text-emerald-500' : 'text-muted-foreground'} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Activer le logement</p>
            <p className="text-xs text-muted-foreground">
              {data.propertyActivated
                ? `Activé le ${data.activatedAt && new Date(data.activatedAt).toLocaleDateString('fr-FR')}`
                : 'Passer le logement en statut "Actif" dans le système'}
            </p>
          </div>
        </div>
        {data.propertyActivated ? (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600"><CheckCircle2 size={10} className="mr-1" />Actif</Badge>
        ) : (
          <Button size="sm" onClick={handleActivate} disabled={!data.messageSent}>
            <Power size={14} className="mr-1.5" />
            Activer
          </Button>
        )}
      </div>
    </div>
  );
}
