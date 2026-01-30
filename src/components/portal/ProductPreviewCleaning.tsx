import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, User } from 'lucide-react';

export function ProductPreviewCleaning({ className }: { className?: string }) {
  const tasks = [
    { property: 'Studio Vieux-Port', time: '10:00', agent: 'Marie L.', status: 'completed', type: 'Départ' },
    { property: 'Appartement Centre', time: '11:30', agent: 'Pierre D.', status: 'in_progress', type: 'Départ' },
    { property: 'Maison Plage', time: '14:00', agent: 'Sophie M.', status: 'pending', type: 'Arrivée' },
    { property: 'Loft Design', time: '15:30', agent: 'À assigner', status: 'unassigned', type: 'Départ' },
  ];

  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-[hsl(152,50%,45%)]', bg: 'bg-[hsl(152,50%,45%)]/10', label: 'Terminé' },
    in_progress: { icon: Clock, color: 'text-[hsl(217,70%,50%)]', bg: 'bg-[hsl(217,70%,50%)]/10', label: 'En cours' },
    pending: { icon: Clock, color: 'text-[hsl(38,75%,50%)]', bg: 'bg-[hsl(38,75%,50%)]/10', label: 'Planifié' },
    unassigned: { icon: AlertCircle, color: 'text-[hsl(0,65%,55%)]', bg: 'bg-[hsl(0,65%,55%)]/10', label: 'Non assigné' },
  };

  return (
    <div className={cn('bg-card rounded-xl border border-border/50 overflow-hidden shadow-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Ménages du jour</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">4 tâches</span>
        </div>
        <span className="text-xs text-muted-foreground">Vendredi 31 janvier</span>
      </div>

      {/* Tasks List */}
      <div className="divide-y divide-border/30">
        {tasks.map((task, i) => {
          const config = statusConfig[task.status as keyof typeof statusConfig];
          const Icon = config.icon;
          
          return (
            <div key={i} className="px-4 py-3 hover:bg-muted/20 transition-colors flex items-center gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', config.bg)}>
                <Icon size={16} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{task.property}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{task.type}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{task.time}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User size={10} />
                    {task.agent}
                  </span>
                </div>
              </div>
              <span className={cn('text-xs font-medium px-2 py-1 rounded-md', config.bg, config.color)}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
