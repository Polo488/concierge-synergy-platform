
import { useState } from 'react';
import { OnboardingStep, MandateActionData, MandateStatus } from '@/types/onboarding';
import { useSignatureContext } from '@/contexts/SignatureContext';
import { useAuth } from '@/contexts/AuthContext';
import { SignatureSessionTracker } from '@/components/signature/SignatureSessionTracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, PenTool, CheckCircle2, Plus, UserPlus, Copy, Check, Send } from 'lucide-react';
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
  sent: { label: 'Compte créé', color: 'bg-blue-500/10 text-blue-600' },
  signed: { label: 'Signé', color: 'bg-emerald-500/10 text-emerald-600' },
};

export function MandateStep({ step, processId, ownerName, ownerEmail, propertyAddress, onUpdateAction }: MandateStepProps) {
  const data = (step.actionData as MandateActionData) || { status: 'draft' as MandateStatus };
  const [commission, setCommission] = useState(data.commissionRate?.toString() || '20');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [ownerAccountCreated, setOwnerAccountCreated] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const { register } = useAuth();
  const {
    templates, createSession, getSessionByOnboarding,
    getSessionEvents, signSession, viewSession, sendSession,
  } = useSignatureContext();

  const session = getSessionByOnboarding(processId);
  const events = session ? getSessionEvents(session.id) : [];
  const activeTemplates = templates.filter(t => t.isActive);
  const effectiveTemplateId = selectedTemplateId || (activeTemplates.length > 0 ? activeTemplates[0].id : '');

  const resolvedEmail = ownerEmail || `${ownerName.toLowerCase().replace(/ /g, '.')}@email.com`;

  const handleCreateSession = async () => {
    if (!effectiveTemplateId) {
      toast.error('Sélectionnez un modèle de document');
      return;
    }
    const newSession = await createSession(effectiveTemplateId, processId, {
      ownerName,
      ownerEmail: resolvedEmail,
      propertyAddress,
      commissionRate: parseFloat(commission),
    });
    if (newSession) {
      toast.success('Session de signature créée');
    }
  };

  const handleCreateOwnerAccount = async () => {
    if (!session) {
      toast.error('Créez d\'abord le mandat électronique');
      return;
    }

    // Generate a simple password for demo
    const password = 'owner' + Math.random().toString(36).slice(2, 6);
    
    // Register the owner account
    await register(resolvedEmail, password, ownerName, 'owner');
    
    setGeneratedPassword(password);
    setOwnerAccountCreated(true);

    // Update step status
    onUpdateAction(processId, step.id, {
      ...data,
      status: 'sent',
      ownerName,
      propertyAddress,
      commissionRate: parseFloat(commission),
      sentAt: new Date().toISOString(),
    });

    toast.success('Compte propriétaire créé ! Le propriétaire peut maintenant se connecter et signer depuis son espace.');
  };

  const handleCopyCredentials = () => {
    const text = `Email : ${resolvedEmail}\nMot de passe : ${generatedPassword}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Identifiants copiés');
  };

  const handleSendMandate = async () => {
    if (!session) return;
    await sendSession(session.id);
    toast.success('Mandat envoyé — le propriétaire peut maintenant le consulter et le signer depuis son espace.');
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
          onSend={() => {}}
          onResend={() => {}}
        />
      )}

      {/* Create owner account button */}
      {session && session.status !== 'signed' && data.status !== 'signed' && !ownerAccountCreated && (
        <Card className="border border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus size={16} className="text-primary" />
              <span className="text-sm font-medium">Inviter le propriétaire</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Créez un compte pour <strong>{ownerName}</strong> ({resolvedEmail}). 
              Il pourra se connecter, suivre l'avancement et signer le mandat depuis son espace.
            </p>
            <Button onClick={handleCreateOwnerAccount} size="sm">
              <UserPlus size={14} className="mr-1.5" />
              Créer le compte propriétaire
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Show credentials after account creation */}
      {ownerAccountCreated && generatedPassword && (
        <Card className="border border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" />
              <span className="text-sm font-medium">Compte propriétaire créé</span>
            </div>
            <div className="bg-background rounded-lg p-3 space-y-2 text-sm border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-mono text-sm">{resolvedEmail}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mot de passe</p>
                <p className="font-mono text-sm">{generatedPassword}</p>
              </div>
            </div>
            <Button onClick={handleCopyCredentials} size="sm" variant="outline">
              {copied ? <Check size={14} className="mr-1.5" /> : <Copy size={14} className="mr-1.5" />}
              {copied ? 'Copié !' : 'Copier les identifiants'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Transmettez ces identifiants au propriétaire. Il se connecte sur la page de connexion et accède directement à son espace.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Send mandate button - appears after account created and session not yet sent */}
      {session && ownerAccountCreated && session.status === 'draft' && data.status !== 'signed' && (
        <Card className="border border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Send size={16} className="text-primary" />
              <span className="text-sm font-medium">Envoyer le mandat</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Le propriétaire pourra consulter et signer le mandat depuis son espace personnel.
            </p>
            <Button onClick={handleSendMandate} size="sm">
              <Send size={14} className="mr-1.5" />
              Envoyer le mandat au propriétaire
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sent confirmation */}
      {session && session.status === 'sent' && data.status !== 'signed' && (
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-500/5 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
            <CheckCircle2 size={14} />
            Mandat envoyé — en attente de signature
          </div>
          <p className="text-xs text-muted-foreground">Le propriétaire peut maintenant consulter et signer le mandat depuis son portail.</p>
        </div>
      )}

      {/* Simulate sign button (for demo/testing) */}
      {session && session.status !== 'signed' && data.status !== 'signed' && ownerAccountCreated && session.status === 'sent' && (
        <Button onClick={handleSimulateSign} size="sm" variant="outline">
          <PenTool size={14} className="mr-1.5" />
          Simuler la signature (démo)
        </Button>
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
