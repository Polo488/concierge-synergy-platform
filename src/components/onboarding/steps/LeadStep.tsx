
import { OnboardingStep, LeadActionData } from '@/types/onboarding';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, User, Tag, UserCheck } from 'lucide-react';

interface LeadStepProps {
  step: OnboardingStep;
  process: { ownerName: string; ownerEmail: string; ownerPhone: string; source: string; assignedToName: string; createdAt: string };
}

export function LeadStep({ step, process }: LeadStepProps) {
  const data = step.actionData as LeadActionData | undefined;
  const items = [
    { label: 'Contact', value: `${process.ownerName} – ${process.ownerEmail || 'Email non renseigné'}`, done: !!process.ownerName && !!process.ownerEmail, icon: User },
    { label: 'Source', value: process.source || 'Non renseignée', done: !!process.source, icon: Tag },
    { label: 'Responsable', value: process.assignedToName || 'Non assigné', done: !!process.assignedToName, icon: UserCheck },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
          <div className={`p-1.5 rounded-md ${item.done ? 'bg-emerald-500/10' : 'bg-muted'}`}>
            {item.done ? <CheckCircle2 size={14} className="text-emerald-500" /> : <item.icon size={14} className="text-muted-foreground" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
          </div>
          {item.done && <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">Validé</Badge>}
        </div>
      ))}
    </div>
  );
}
