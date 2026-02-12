
import { useSearchParams } from 'react-router-dom';
import { SigningFlow } from '@/components/signature/SigningFlow';
import { useSignature } from '@/hooks/useSignature';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertTriangle } from 'lucide-react';

export default function Sign() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { getSessionByToken, templates, getSessionZoneData, completeZone, signSession, viewSession } = useSignature();

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle size={32} className="mx-auto text-amber-500" />
            <h1 className="text-lg font-bold text-foreground">Lien invalide</h1>
            <p className="text-sm text-muted-foreground">Ce lien de signature est invalide ou a expiré.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const session = getSessionByToken(token);
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <FileText size={32} className="mx-auto text-muted-foreground" />
            <h1 className="text-lg font-bold text-foreground">Document introuvable</h1>
            <p className="text-sm text-muted-foreground">Ce document n'existe pas ou a été archivé.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const template = templates.find(t => t.id === session.templateId);
  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle size={32} className="mx-auto text-amber-500" />
            <h1 className="text-lg font-bold text-foreground">Template introuvable</h1>
            <p className="text-sm text-muted-foreground">Le modèle de document associé n'est plus disponible.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const zoneData = getSessionZoneData(session.id);

  return (
    <SigningFlow
      template={template}
      session={session}
      zoneData={zoneData}
      onCompleteZone={completeZone}
      onSign={signSession}
      onView={viewSession}
    />
  );
}
