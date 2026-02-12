
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStep, OnboardingProcess, PropertyCreationActionData, MandateActionData, RibActionData } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Building, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyCreationStepProps {
  step: OnboardingStep;
  processId: string;
  process: OnboardingProcess;
  onUpdateAction: (processId: string, stepId: string, data: PropertyCreationActionData) => void;
}

interface FieldDef {
  field: string;
  label: string;
  completed: boolean;
  preFilledFrom?: string;
  preFilledValue?: string;
}

const getPreFilledFields = (process: OnboardingProcess): FieldDef[] => {
  const mandateStep = process.steps.find(s => s.stepType === 'mandate');
  const mandateData = mandateStep?.actionData as MandateActionData | undefined;
  const ribStep = process.steps.find(s => s.stepType === 'rib');
  const ribData = ribStep?.actionData as RibActionData | undefined;

  return [
    { field: 'name', label: 'Nom du logement', completed: !!process.propertyName, preFilledFrom: 'Onboarding', preFilledValue: process.propertyName || undefined },
    { field: 'address', label: 'Adresse complète', completed: !!process.propertyAddress, preFilledFrom: 'Onboarding', preFilledValue: process.propertyAddress || undefined },
    { field: 'type', label: 'Type de logement (T1, T2, T3…)', completed: !!process.propertyType, preFilledFrom: 'Onboarding', preFilledValue: process.propertyType || undefined },
    { field: 'owner_name', label: 'Nom du propriétaire', completed: !!process.ownerName, preFilledFrom: 'Étape Lead', preFilledValue: process.ownerName || undefined },
    { field: 'owner_email', label: 'Email du propriétaire', completed: !!process.ownerEmail, preFilledFrom: 'Étape Lead', preFilledValue: process.ownerEmail || undefined },
    { field: 'owner_phone', label: 'Téléphone du propriétaire', completed: !!process.ownerPhone, preFilledFrom: 'Étape Lead', preFilledValue: process.ownerPhone || undefined },
    { field: 'commission', label: 'Taux de commission', completed: !!mandateData?.commissionRate, preFilledFrom: 'Étape Mandat', preFilledValue: mandateData?.commissionRate ? `${mandateData.commissionRate}%` : undefined },
    { field: 'surface', label: 'Surface (m²)', completed: false },
    { field: 'bedrooms', label: 'Nombre de chambres', completed: false },
    { field: 'bathrooms', label: 'Nombre de salles de bain', completed: false },
    { field: 'capacity', label: 'Capacité d\'accueil', completed: false },
    { field: 'description', label: 'Description du bien', completed: false },
    { field: 'amenities', label: 'Équipements', completed: false },
    { field: 'photos', label: 'Photos uploadées (min. 5)', completed: false },
    { field: 'pricing', label: 'Tarification configurée', completed: false },
    { field: 'rules', label: 'Règles de la maison', completed: false },
    { field: 'checkin', label: 'Instructions d\'arrivée', completed: false },
    { field: 'checkout', label: 'Instructions de départ', completed: false },
  ];
};

export function PropertyCreationStep({ step, processId, process, onUpdateAction }: PropertyCreationStepProps) {
  const navigate = useNavigate();
  const preFilledFields = useMemo(() => getPreFilledFields(process), [process]);
  const data = (step.actionData as PropertyCreationActionData) || { completionPercent: 0, requiredFields: [] };
  
  const [fields, setFields] = useState<FieldDef[]>(() => {
    if (data.requiredFields.length > 0) {
      // Merge saved state with pre-filled info
      return preFilledFields.map(pf => {
        const saved = data.requiredFields.find(r => r.field === pf.field);
        return {
          ...pf,
          completed: saved ? saved.completed : pf.completed,
        };
      });
    }
    return preFilledFields;
  });

  const completedCount = fields.filter(f => f.completed).length;
  const percent = Math.round((completedCount / fields.length) * 100);
  const allComplete = completedCount === fields.length;
  const preFilledCount = fields.filter(f => f.preFilledFrom && f.completed).length;

  const toggleField = (fieldName: string) => {
    const newFields = fields.map(f => f.field === fieldName ? { ...f, completed: !f.completed } : f);
    setFields(newFields);
    const newCompleted = newFields.filter(f => f.completed).length;
    const newPercent = Math.round((newCompleted / newFields.length) * 100);
    onUpdateAction(processId, step.id, {
      ...data,
      requiredFields: newFields.map(({ field, label, completed }) => ({ field, label, completed })),
      completionPercent: newPercent,
      propertyId: newCompleted === newFields.length ? `prop-${Date.now()}` : data.propertyId,
    });
  };

  const handleOpenProperties = () => {
    const mandateStep = process.steps.find(s => s.stepType === 'mandate');
    const mandateData = mandateStep?.actionData as MandateActionData | undefined;

    const prefillData = {
      fromOnboarding: true,
      onboardingProcessId: processId,
      propertyName: process.propertyName,
      propertyAddress: process.propertyAddress,
      propertyType: process.propertyType,
      ownerName: process.ownerName,
      ownerEmail: process.ownerEmail,
      ownerPhone: process.ownerPhone,
      commission: mandateData?.commissionRate,
      city: process.city,
    };
    navigate('/app/properties', { state: { prefillData } });
    toast.success('Données de l\'onboarding transférées vers le module Propriétés');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Building size={15} className="text-primary" />
          Fiche logement — Channel Manager
        </div>
        <Badge variant="outline" className={allComplete ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'}>
          {percent}% complet
        </Badge>
      </div>

      {preFilledCount > 0 && (
        <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-2 text-sm text-primary">
          <Sparkles size={14} />
          <span><strong>{preFilledCount} champ{preFilledCount > 1 ? 's' : ''}</strong> pré-rempli{preFilledCount > 1 ? 's' : ''} depuis l'onboarding</span>
        </div>
      )}

      <Progress value={percent} className="h-2" />

      <div className="p-4 rounded-xl border border-border/50 bg-card space-y-2 max-h-[400px] overflow-y-auto">
        {fields.map(field => (
          <label
            key={field.field}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent/30 cursor-pointer transition-all"
          >
            <Checkbox checked={field.completed} onCheckedChange={() => toggleField(field.field)} />
            <div className="flex-1 min-w-0">
              <span className={`text-sm ${field.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {field.label}
              </span>
              {field.preFilledValue && (
                <span className="block text-[11px] text-primary/70 truncate">
                  ← {field.preFilledFrom} : {field.preFilledValue}
                </span>
              )}
            </div>
            {field.completed && field.preFilledFrom && (
              <Badge variant="outline" className="text-[9px] py-0 h-4 bg-primary/10 text-primary border-primary/20">
                Auto
              </Badge>
            )}
            {field.completed && !field.preFilledFrom && (
              <CheckCircle2 size={12} className="text-emerald-500 ml-auto" />
            )}
          </label>
        ))}
      </div>

      {allComplete && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-500/5 flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle2 size={14} />
          Fiche logement complète — Prêt pour la diffusion
        </div>
      )}

      <Button variant="outline" size="sm" className="w-full" onClick={handleOpenProperties}>
        <ExternalLink size={14} className="mr-1.5" />
        Ouvrir dans le module Propriétés (données pré-remplies)
      </Button>
    </div>
  );
}
