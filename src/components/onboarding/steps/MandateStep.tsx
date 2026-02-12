
import { useState } from 'react';
import { OnboardingStep, MandateActionData, MandateStatus } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Send, PenTool, CheckCircle2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface MandateStepProps {
  step: OnboardingStep;
  processId: string;
  ownerName: string;
  propertyAddress: string;
  onUpdateAction: (processId: string, stepId: string, data: MandateActionData) => void;
}

const statusConfig: Record<MandateStatus, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-muted text-muted-foreground' },
  sent: { label: 'Envoyé', color: 'bg-blue-500/10 text-blue-600' },
  signed: { label: 'Signé', color: 'bg-emerald-500/10 text-emerald-600' },
};

export function MandateStep({ step, processId, ownerName, propertyAddress, onUpdateAction }: MandateStepProps) {
  const data = (step.actionData as MandateActionData) || { status: 'draft' as MandateStatus };
  const [commission, setCommission] = useState(data.commissionRate?.toString() || '20');
  const [content, setContent] = useState(data.documentContent || generateTemplate(ownerName, propertyAddress, data.commissionRate || 20));

  function generateTemplate(owner: string, address: string, rate: number) {
    return `MANDAT DE GESTION LOCATIVE\n\nEntre :\nLe mandant : ${owner}\nAdresse du bien : ${address}\n\nEt :\nLa société Noé Conciergerie\n\nIl est convenu ce qui suit :\n\nArticle 1 – Objet\nLe mandant confie au mandataire la gestion locative du bien situé à l'adresse ci-dessus.\n\nArticle 2 – Commission\nLe mandataire percevra une commission de ${rate}% sur les revenus locatifs bruts.\n\nArticle 3 – Durée\nLe présent mandat est conclu pour une durée d'un (1) an, renouvelable par tacite reconduction.\n\nArticle 4 – Obligations du mandataire\n- Gestion des réservations\n- Accueil des voyageurs\n- Coordination du ménage\n- Maintenance courante\n\nFait en deux exemplaires.`;
  }

  const handleSave = () => {
    onUpdateAction(processId, step.id, {
      ...data,
      status: 'draft',
      documentContent: content,
      ownerName,
      propertyAddress,
      commissionRate: parseFloat(commission),
    });
    toast.success('Mandat sauvegardé');
  };

  const handleSend = () => {
    onUpdateAction(processId, step.id, {
      ...data,
      status: 'sent',
      documentContent: content,
      ownerName,
      propertyAddress,
      commissionRate: parseFloat(commission),
      signatureLink: `https://sign.noe.app/${Date.now()}`,
      sentAt: new Date().toISOString(),
    });
    toast.success('Lien de signature envoyé au propriétaire');
  };

  const handleSign = () => {
    onUpdateAction(processId, step.id, {
      ...data,
      status: 'signed',
      signedAt: new Date().toISOString(),
    });
    toast.success('Mandat signé électroniquement — étape validée');
  };

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex items-center gap-2">
        <FileText size={15} className="text-primary" />
        <span className="text-sm font-medium">Mandat de gestion</span>
        <Badge variant="outline" className={statusConfig[data.status].color}>{statusConfig[data.status].label}</Badge>
      </div>

      {data.status !== 'signed' && (
        <>
          {/* Editor */}
          <Card className="border border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Propriétaire</Label>
                  <Input value={ownerName} disabled className="bg-muted/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Commission (%)</Label>
                  <Input type="number" value={commission} onChange={e => setCommission(e.target.value)} min={0} max={100} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Contenu du mandat</Label>
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={12}
                  className="font-mono text-xs leading-relaxed"
                />
              </div>
              <Button onClick={handleSave} variant="outline" size="sm">
                <Save size={14} className="mr-1.5" />
                Sauvegarder le brouillon
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            {data.status === 'draft' && (
              <Button onClick={handleSend} size="sm" className="flex-1">
                <Send size={14} className="mr-1.5" />
                Envoyer pour signature
              </Button>
            )}
            {data.status === 'sent' && (
              <Button onClick={handleSign} size="sm" className="flex-1">
                <PenTool size={14} className="mr-1.5" />
                Simuler la signature électronique
              </Button>
            )}
          </div>
        </>
      )}

      {data.status === 'signed' && (
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
