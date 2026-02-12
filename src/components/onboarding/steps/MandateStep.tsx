
import { useState, useMemo } from 'react';
import { OnboardingStep, MandateActionData, MandateStatus } from '@/types/onboarding';
import { useSignatureContext } from '@/contexts/SignatureContext';
import { SignatureSessionTracker } from '@/components/signature/SignatureSessionTracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Send, PenTool, CheckCircle2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MandateStepProps {
  step: OnboardingStep;
  processId: string;
  ownerName: string;
  ownerEmail?: string;
  propertyAddress: string;
  onUpdateAction: (processId: string, stepId: string, data: MandateActionData) => void;
}

const statusConfig: Record<MandateStatus, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-muted text-muted-foreground' },
  sent: { label: 'Envoyé', color: 'bg-blue-500/10 text-blue-600' },
  signed: { label: 'Signé', color: 'bg-emerald-500/10 text-emerald-600' },
};

export function MandateStep({ step, processId, ownerName, ownerEmail, propertyAddress, onUpdateAction }: MandateStepProps) {
  const data = (step.actionData as MandateActionData) || { status: 'draft' as MandateStatus };
  const [commission, setCommission] = useState(data.commissionRate?.toString() || '20');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const {
    templates, createSession, sendSession, getSessionByOnboarding,
    getSessionEvents, getSessionZoneData, signSession, viewSession,
  } = useSignatureContext();

  const session = getSessionByOnboarding(processId);
  const events = session ? getSessionEvents(session.id) : [];
  const activeTemplates = templates.filter(t => t.isActive);

  // Auto-select first template if none selected
  const effectiveTemplateId = selectedTemplateId || (activeTemplates.length > 0 ? activeTemplates[0].id : '');

  const handleCreateSession = async () => {
    if (!effectiveTemplateId) {
      toast.error('Sélectionnez un modèle de document');
      return;
    }
    const newSession = await createSession(effectiveTemplateId, processId, {
      ownerName,
      ownerEmail: ownerEmail || `${ownerName.toLowerCase().replace(' ', '.')}@email.com`,
      propertyAddress,
      commissionRate: parseFloat(commission),
    });
    if (newSession) {
      toast.success('Session de signature créée');
    }
  };

  const handleSend = async () => {
    if (!session) return;
    await sendSession(session.id);
    onUpdateAction(processId, step.id, {
      ...data,
      status: 'sent',
      ownerName,
      propertyAddress,
      commissionRate: parseFloat(commission),
      signatureLink: `${window.location.origin}/sign?token=${session.token}`,
      sentAt: new Date().toISOString(),
    });
    toast.success('Lien de signature envoyé au propriétaire');
  };

  const handleSimulateSign = async () => {
    if (!session) return;
    await signSession(session.id);
    onUpdateAction(processId, step.id, {
      ...data,
      status: 'signed',
      signedAt: new Date().toISOString(),
    });
    toast.success('Mandat signé électroniquement — étape validée');
  };

  const signingUrl = session ? `${window.location.origin}/sign?token=${session.token}` : undefined;

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex items-center gap-2">
        <FileText size={15} className="text-primary" />
        <span className="text-sm font-medium">Mandat de gestion</span>
        <Badge variant="outline" className={statusConfig[data.status].color}>{statusConfig[data.status].label}</Badge>
      </div>

      {/* If no session yet, show creation form */}
      {!session && data.status !== 'signed' && (
        <Card className="border border-border/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Créer une session de signature électronique</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Modèle de document</Label>
                <Select value={effectiveTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTemplates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Commission (%)</Label>
                <Input type="number" value={commission} onChange={e => setCommission(e.target.value)} min={0} max={100} className="h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Propriétaire</Label>
                <Input value={ownerName} disabled className="h-8 text-xs bg-muted/30" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Adresse du bien</Label>
                <Input value={propertyAddress} disabled className="h-8 text-xs bg-muted/30" />
              </div>
            </div>
            <Button onClick={handleCreateSession} size="sm" disabled={!effectiveTemplateId}>
              <Plus size={14} className="mr-1.5" />
              Créer le mandat électronique
            </Button>
          </CardContent>
        </Card>
      )}

      {/* If session exists, show signature tracker */}
      {session && (
        <SignatureSessionTracker
          session={session}
          events={events}
          onSend={handleSend}
          onResend={handleSend}
          signingUrl={signingUrl}
        />
      )}

      {/* Quick action buttons */}
      {session && session.status !== 'signed' && data.status !== 'signed' && (
        <div className="flex gap-2">
          {(session.status === 'sent' || session.status === 'viewed') && (
            <Button onClick={handleSimulateSign} size="sm" variant="outline" className="flex-1">
              <PenTool size={14} className="mr-1.5" />
              Simuler la signature
            </Button>
          )}
        </div>
      )}

      {data.status === 'signed' && !session && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-500/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
            <CheckCircle2 size={14} />
            Mandat signé électroniquement
          </div>
          <p className="text-xs text-muted-foreground">Signé le {data.signedAt && new Date(data.signedAt).toLocaleDateString('fr-FR')}</p>
        </div>
      )}
    </div>
  );
}
