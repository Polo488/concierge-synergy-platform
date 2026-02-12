
import { useState } from 'react';
import { OnboardingStep, AppointmentActionData, AppointmentStatus } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface AppointmentStepProps {
  step: OnboardingStep;
  processId: string;
  onUpdateAction: (processId: string, stepId: string, data: AppointmentActionData) => void;
}

const statusLabels: Record<AppointmentStatus, { label: string; color: string }> = {
  scheduled: { label: 'Planifié', color: 'bg-blue-500/10 text-blue-600' },
  completed: { label: 'Réalisé', color: 'bg-emerald-500/10 text-emerald-600' },
  cancelled: { label: 'Annulé', color: 'bg-red-500/10 text-red-600' },
};

export function AppointmentStep({ step, processId, onUpdateAction }: AppointmentStepProps) {
  const data = (step.actionData as AppointmentActionData) || { status: 'scheduled' as AppointmentStatus };
  const [date, setDate] = useState(data.date || '');
  const [time, setTime] = useState(data.time || '');

  const handleSchedule = () => {
    if (!date || !time) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }
    const newData: AppointmentActionData = {
      date,
      time,
      status: 'scheduled',
      agendaEventId: `agenda-${Date.now()}`,
      notes: data.notes,
    };
    onUpdateAction(processId, step.id, newData);
    toast.success('Rendez-vous planifié et synchronisé avec l\'agenda');
  };

  const handleMarkCompleted = () => {
    onUpdateAction(processId, step.id, { ...data, status: 'completed' });
    toast.success('Rendez-vous marqué comme réalisé');
  };

  const handleCancel = () => {
    onUpdateAction(processId, step.id, { ...data, status: 'cancelled' });
    toast.info('Rendez-vous annulé');
  };

  const isScheduled = !!data.agendaEventId && data.status !== 'cancelled';

  return (
    <div className="space-y-4">
      {/* Scheduler */}
      <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar size={15} className="text-primary" />
          Planifier le rendez-vous
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} disabled={data.status === 'completed'} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Heure</Label>
            <Input type="time" value={time} onChange={e => setTime(e.target.value)} disabled={data.status === 'completed'} />
          </div>
        </div>
        {!isScheduled && data.status !== 'completed' && (
          <Button onClick={handleSchedule} size="sm" className="w-full">
            <Calendar size={14} className="mr-1.5" />
            Planifier et synchroniser avec l'agenda
          </Button>
        )}
      </div>

      {/* Status */}
      {isScheduled && (
        <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {data.date && format(new Date(data.date), 'EEEE d MMMM yyyy', { locale: fr })} à {data.time}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Clock size={11} /> Synchronisé avec l'agenda
              </p>
            </div>
            <Badge variant="outline" className={statusLabels[data.status].color}>
              {statusLabels[data.status].label}
            </Badge>
          </div>

          {data.status === 'scheduled' && (
            <div className="flex gap-2">
              <Button onClick={handleMarkCompleted} size="sm" className="flex-1">
                <CheckCircle2 size={14} className="mr-1.5" />
                Marquer comme réalisé
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <XCircle size={14} className="mr-1.5" />
                Annuler
              </Button>
            </div>
          )}

          {data.status === 'completed' && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <CheckCircle2 size={14} />
              Rendez-vous réalisé — étape validée
            </div>
          )}
        </div>
      )}
    </div>
  );
}
