
import { useState } from 'react';
import { OnboardingStep, PreparationActionData } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SprayCan, Camera, CheckCircle2, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';

interface PreparationStepProps {
  step: OnboardingStep;
  processId: string;
  onUpdateAction: (processId: string, stepId: string, data: PreparationActionData) => void;
}

export function PreparationStep({ step, processId, onUpdateAction }: PreparationStepProps) {
  const data = (step.actionData as PreparationActionData) || { cleaningCompleted: false, photoCompleted: false };
  const [cleanDate, setCleanDate] = useState(data.cleaningDate || '');
  const [cleanAgent, setCleanAgent] = useState(data.cleaningAgent || '');
  const [photoDate, setPhotoDate] = useState(data.photoDate || '');
  const [photoProvider, setPhotoProvider] = useState(data.photoProvider || '');

  const handlePlanCleaning = () => {
    if (!cleanDate || !cleanAgent) {
      toast.error('Veuillez renseigner la date et l\'agent de ménage');
      return;
    }
    const newData: PreparationActionData = {
      ...data,
      cleaningDate: cleanDate,
      cleaningAgent: cleanAgent,
      cleaningTaskId: `cleaning-${Date.now()}`,
      cleaningCompleted: true,
    };
    onUpdateAction(processId, step.id, newData);
    toast.success('Mission ménage créée dans le module Ménage');
  };

  const handlePlanPhoto = () => {
    if (!photoDate || !photoProvider) {
      toast.error('Veuillez renseigner la date et le prestataire photo');
      return;
    }
    const newData: PreparationActionData = {
      ...data,
      photoDate: photoDate,
      photoProvider: photoProvider,
      photoSessionId: `photo-${Date.now()}`,
      photoCompleted: true,
    };
    onUpdateAction(processId, step.id, newData);
    toast.success('Séance photo planifiée dans l\'agenda');
  };

  return (
    <div className="space-y-4">
      {/* Cleaning */}
      <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <SprayCan size={15} className="text-primary" />
            Premier ménage
          </div>
          {data.cleaningCompleted && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px]">
              <CheckCircle2 size={10} className="mr-1" />Planifié
            </Badge>
          )}
        </div>

        {!data.cleaningCompleted ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Date</Label>
                <Input type="date" value={cleanDate} onChange={e => setCleanDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Agent</Label>
                <Select value={cleanAgent} onValueChange={setCleanAgent}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                    <SelectItem value="Fatima El Amrani">Fatima El Amrani</SelectItem>
                    <SelectItem value="Ana Kovac">Ana Kovac</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handlePlanCleaning} size="sm" className="w-full">
              <CalendarPlus size={14} className="mr-1.5" />
              Planifier le ménage
            </Button>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            {data.cleaningDate && new Date(data.cleaningDate).toLocaleDateString('fr-FR')} — {data.cleaningAgent}
          </div>
        )}
      </div>

      {/* Photos */}
      <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Camera size={15} className="text-primary" />
            Séance photo
          </div>
          {data.photoCompleted && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px]">
              <CheckCircle2 size={10} className="mr-1" />Planifiée
            </Badge>
          )}
        </div>

        {!data.photoCompleted ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Date</Label>
                <Input type="date" value={photoDate} onChange={e => setPhotoDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prestataire</Label>
                <Select value={photoProvider} onValueChange={setPhotoProvider}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Studio Lumière">Studio Lumière</SelectItem>
                    <SelectItem value="Photo Immo Pro">Photo Immo Pro</SelectItem>
                    <SelectItem value="Interne">Équipe interne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handlePlanPhoto} size="sm" className="w-full">
              <CalendarPlus size={14} className="mr-1.5" />
              Planifier la séance photo
            </Button>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            {data.photoDate && new Date(data.photoDate).toLocaleDateString('fr-FR')} — {data.photoProvider}
          </div>
        )}
      </div>
    </div>
  );
}
