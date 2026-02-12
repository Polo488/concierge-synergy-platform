
import { OnboardingStep, PublicationActionData, PlatformStatus } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PublicationStepProps {
  step: OnboardingStep;
  processId: string;
  onUpdateAction: (processId: string, stepId: string, data: PublicationActionData) => void;
}

const platformIcons: Record<string, string> = {
  Airbnb: '🏠',
  Booking: '🅱️',
  Abritel: '🏡',
};

const statusConfig: Record<PlatformStatus, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'En attente', icon: Clock, color: 'bg-muted text-muted-foreground' },
  published: { label: 'Publié', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-600' },
  error: { label: 'Erreur', icon: AlertTriangle, color: 'bg-red-500/10 text-red-600' },
};

export function PublicationStep({ step, processId, onUpdateAction }: PublicationStepProps) {
  const data = (step.actionData as PublicationActionData) || {
    platforms: [
      { name: 'Airbnb', status: 'pending' as PlatformStatus },
      { name: 'Booking', status: 'pending' as PlatformStatus },
      { name: 'Abritel', status: 'pending' as PlatformStatus },
    ],
  };

  const handlePublish = (platformName: string) => {
    const newPlatforms = data.platforms.map(p =>
      p.name === platformName ? { ...p, status: 'published' as PlatformStatus, publishedAt: new Date().toISOString() } : p
    );
    onUpdateAction(processId, step.id, { platforms: newPlatforms });
    toast.success(`Annonce publiée sur ${platformName}`);
  };

  const hasOnePublished = data.platforms.some(p => p.status === 'published');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Globe size={15} className="text-primary" />
        Publication sur les plateformes
      </div>

      <div className="space-y-2">
        {data.platforms.map(platform => {
          const cfg = statusConfig[platform.status];
          return (
            <div key={platform.name} className="p-4 rounded-xl border border-border/50 bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{platformIcons[platform.name] || '🌐'}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{platform.name}</p>
                  {platform.publishedAt && (
                    <p className="text-[11px] text-muted-foreground">
                      Publié le {new Date(platform.publishedAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cfg.color}>
                  <cfg.icon size={10} className="mr-1" />
                  {cfg.label}
                </Badge>
                {platform.status === 'pending' && (
                  <Button size="sm" variant="outline" onClick={() => handlePublish(platform.name)}>
                    Publier
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasOnePublished && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-500/5 flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle2 size={14} />
          Au moins une plateforme active — étape validée
        </div>
      )}
    </div>
  );
}
