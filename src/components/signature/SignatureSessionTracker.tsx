
import { SignatureSession, SignatureEvent, SESSION_STATUS_CONFIG } from '@/types/signature';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, Send, Eye, PenTool, Clock, RefreshCw, 
  CheckCircle2, ExternalLink, Shield, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Props {
  session: SignatureSession | null;
  events: SignatureEvent[];
  onSend: () => void;
  onResend: () => void;
  signingUrl?: string;
}

export function SignatureSessionTracker({ session, events, onSend, onResend, signingUrl }: Props) {
  if (!session) return null;

  const cfg = SESSION_STATUS_CONFIG[session.status];

  const timelineEvents = [
    { icon: FileText, label: 'Mandat créé', date: session.createdAt, done: true },
    { icon: Send, label: 'Envoyé au propriétaire', date: session.sentAt, done: !!session.sentAt },
    { icon: Eye, label: 'Consulté par le propriétaire', date: session.viewedAt, done: !!session.viewedAt },
    { icon: PenTool, label: 'Signé électroniquement', date: session.signedAt, done: !!session.signedAt },
  ];

  const daysSinceSent = session.sentAt 
    ? Math.floor((Date.now() - new Date(session.sentAt).getTime()) / 86400000)
    : 0;

  return (
    <div className="space-y-4">
      {/* Status header */}
      <div className="flex items-center gap-2">
        <FileText size={15} className="text-primary" />
        <span className="text-sm font-medium">Signature électronique</span>
        <Badge variant="outline" className={cn(cfg.bgColor, cfg.color)}>{cfg.label}</Badge>
        {session.status === 'sent' && daysSinceSent > 3 && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 text-[10px]">
            <AlertTriangle size={10} className="mr-0.5" />
            {daysSinceSent}j sans réponse
          </Badge>
        )}
      </div>

      {/* Timeline */}
      <Card className="border border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-border" />
            <div className="space-y-4">
              {timelineEvents.map((evt, i) => {
                const Icon = evt.icon;
                return (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10',
                      evt.done ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                    )}>
                      {evt.done ? <CheckCircle2 size={12} /> : <Icon size={12} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-medium', evt.done ? 'text-foreground' : 'text-muted-foreground')}>
                        {evt.label}
                      </p>
                      {evt.date && (
                        <p className="text-[10px] text-muted-foreground">
                          {format(new Date(evt.date), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        {session.status === 'draft' && (
          <Button onClick={onSend} size="sm" className="flex-1">
            <Send size={14} className="mr-1.5" />
            Envoyer pour signature
          </Button>
        )}
        {(session.status === 'sent' || session.status === 'viewed') && (
          <>
            <Button onClick={onResend} variant="outline" size="sm" className="flex-1">
              <RefreshCw size={14} className="mr-1.5" />
              Relancer
            </Button>
            {signingUrl && (
              <Button variant="outline" size="sm" onClick={() => window.open(signingUrl, '_blank')}>
                <ExternalLink size={14} className="mr-1.5" />
                Lien
              </Button>
            )}
          </>
        )}
      </div>

      {/* Signing proof */}
      {session.status === 'signed' && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-500/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
            <Shield size={14} />
            Mandat signé électroniquement
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Signé le {session.signedAt && format(new Date(session.signedAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
            <p>IP : {session.signerIp || 'Non disponible'}</p>
            <p>Token : {session.token.substring(0, 8)}...</p>
          </div>
        </div>
      )}

      {/* Audit log */}
      {events.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Journal d'événements</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {events.map(evt => (
              <div key={evt.id} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="font-mono">{format(new Date(evt.createdAt), 'HH:mm:ss')}</span>
                <span className="font-medium text-foreground">{evt.eventType}</span>
                {evt.actor && <span>par {evt.actor}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
