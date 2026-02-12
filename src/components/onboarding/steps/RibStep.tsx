
import { useState } from 'react';
import { OnboardingStep, RibActionData } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface RibStepProps {
  step: OnboardingStep;
  processId: string;
  onUpdateAction: (processId: string, stepId: string, data: RibActionData) => void;
}

export function RibStep({ step, processId, onUpdateAction }: RibStepProps) {
  const data = (step.actionData as RibActionData) || { validated: false };
  const [iban, setIban] = useState(data.iban || '');
  const [bic, setBic] = useState(data.bic || '');
  const [holder, setHolder] = useState(data.accountHolder || '');

  const formatIban = (val: string) => {
    return val.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().toUpperCase();
  };

  const handleValidate = () => {
    if (!iban || !holder) {
      toast.error('Veuillez renseigner l\'IBAN et le titulaire');
      return;
    }
    if (iban.replace(/\s/g, '').length < 14) {
      toast.error('IBAN invalide');
      return;
    }
    onUpdateAction(processId, step.id, {
      iban: iban.replace(/\s/g, ''),
      bic,
      accountHolder: holder,
      validated: true,
      validatedAt: new Date().toISOString(),
    });
    toast.success('RIB validé — connecté au module Finance');
  };

  if (data.validated) {
    return (
      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-500/5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
          <CheckCircle2 size={14} />
          RIB validé et enregistré
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-foreground font-medium">{data.accountHolder}</p>
          <p className="text-muted-foreground font-mono text-xs">{formatIban(data.iban || '')}</p>
          {data.bic && <p className="text-muted-foreground text-xs">BIC: {data.bic}</p>}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck size={11} />
          Lié au module Finance / Facturation
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <CreditCard size={15} className="text-primary" />
        Coordonnées bancaires du propriétaire
      </div>

      <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Titulaire du compte *</Label>
          <Input value={holder} onChange={e => setHolder(e.target.value)} placeholder="Marie Dupont" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">IBAN *</Label>
          <Input
            value={formatIban(iban)}
            onChange={e => setIban(e.target.value.replace(/\s/g, ''))}
            placeholder="FR76 1234 5678 9012 3456 7890 123"
            className="font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">BIC (optionnel)</Label>
          <Input value={bic} onChange={e => setBic(e.target.value.toUpperCase())} placeholder="BNPAFRPP" className="font-mono" />
        </div>
        <Button onClick={handleValidate} size="sm" className="w-full">
          <ShieldCheck size={14} className="mr-1.5" />
          Valider le RIB
        </Button>
      </div>
    </div>
  );
}
