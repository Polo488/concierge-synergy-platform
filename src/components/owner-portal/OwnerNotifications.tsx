
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, FileText, PenTool, CheckCircle2, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'invoice' | 'signature' | 'onboarding' | 'info';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'invoice', title: 'Nouvelle facture disponible', message: 'La facture FAC-2026-0042 de février 2026 est disponible dans votre espace.', date: '2026-02-15T10:30:00', read: false },
  { id: '2', type: 'onboarding', title: 'Onboarding en cours', message: 'L\'onboarding de votre bien Studio Montmartre a démarré. Suivez l\'avancement depuis la section dédiée.', date: '2026-02-10T14:00:00', read: false },
  { id: '3', type: 'signature', title: 'Document signé avec succès', message: 'Votre mandat de gestion pour l\'Appartement Marais a été signé et archivé.', date: '2025-06-15T16:45:00', read: true },
  { id: '4', type: 'invoice', title: 'Facture payée', message: 'La facture FAC-2026-0028 de janvier 2026 a été réglée.', date: '2026-01-20T09:00:00', read: true },
  { id: '5', type: 'info', title: 'Bienvenue sur Noé', message: 'Votre espace propriétaire est maintenant actif. Explorez vos différentes sections.', date: '2025-06-01T08:00:00', read: true },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  invoice: { icon: Receipt, color: 'bg-blue-500/10 text-blue-600' },
  signature: { icon: PenTool, color: 'bg-emerald-500/10 text-emerald-600' },
  onboarding: { icon: CheckCircle2, color: 'bg-amber-500/10 text-amber-600' },
  info: { icon: Bell, color: 'bg-primary/10 text-primary' },
};

export function OwnerNotifications() {
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unread > 0 ? `${unread} notification${unread > 1 ? 's' : ''} non lue${unread > 1 ? 's' : ''}` : 'Toutes vos notifications sont lues'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {MOCK_NOTIFICATIONS.map(notif => {
          const config = typeConfig[notif.type] || typeConfig.info;
          const Icon = config.icon;
          return (
            <Card key={notif.id} className={cn("border shadow-sm transition-all", !notif.read && "border-primary/20 bg-primary/[0.02]")}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", config.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn("text-sm", !notif.read ? "font-semibold" : "font-medium text-muted-foreground")}>{notif.title}</h3>
                    {!notif.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {new Date(notif.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
