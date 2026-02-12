
import { useState } from 'react';
import { OnboardingStep, PropertyCreationActionData } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Building, CheckCircle2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyCreationStepProps {
  step: OnboardingStep;
  processId: string;
  onUpdateAction: (processId: string, stepId: string, data: PropertyCreationActionData) => void;
}

const DEFAULT_FIELDS = [
  { field: 'name', label: 'Nom du logement', completed: false },
  { field: 'address', label: 'Adresse complète', completed: false },
  { field: 'type', label: 'Type de logement (T1, T2, T3…)', completed: false },
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

export function PropertyCreationStep({ step, processId, onUpdateAction }: PropertyCreationStepProps) {
  const data = (step.actionData as PropertyCreationActionData) || { completionPercent: 0, requiredFields: DEFAULT_FIELDS };
  const [fields, setFields] = useState(data.requiredFields.length > 0 ? data.requiredFields : DEFAULT_FIELDS);

  const completedCount = fields.filter(f => f.completed).length;
  const percent = Math.round((completedCount / fields.length) * 100);
  const allComplete = completedCount === fields.length;

  const toggleField = (fieldName: string) => {
    const newFields = fields.map(f => f.field === fieldName ? { ...f, completed: !f.completed } : f);
    setFields(newFields);
    const newCompleted = newFields.filter(f => f.completed).length;
    const newPercent = Math.round((newCompleted / newFields.length) * 100);
    onUpdateAction(processId, step.id, {
      ...data,
      requiredFields: newFields,
      completionPercent: newPercent,
      propertyId: newCompleted === newFields.length ? `prop-${Date.now()}` : data.propertyId,
    });
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

      <Progress value={percent} className="h-2" />

      <div className="p-4 rounded-xl border border-border/50 bg-card space-y-2 max-h-[400px] overflow-y-auto">
        {fields.map(field => (
          <label
            key={field.field}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent/30 cursor-pointer transition-all"
          >
            <Checkbox checked={field.completed} onCheckedChange={() => toggleField(field.field)} />
            <span className={`text-sm ${field.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {field.label}
            </span>
            {field.completed && <CheckCircle2 size={12} className="text-emerald-500 ml-auto" />}
          </label>
        ))}
      </div>

      {allComplete && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-500/5 flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle2 size={14} />
          Fiche logement complète — Prêt pour la diffusion
        </div>
      )}

      <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('Redirection vers le module Propriétés')}>
        <ExternalLink size={14} className="mr-1.5" />
        Ouvrir dans le module Propriétés
      </Button>
    </div>
  );
}
