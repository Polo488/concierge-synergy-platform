import { cn } from '@/lib/utils';
import { Sparkles, Clock, CheckCircle2, AlertCircle, User, MapPin, Calendar } from 'lucide-react';

interface CleaningTask {
  id: string;
  property: string;
  address: string;
  time: string;
  agent: string;
  status: 'pending' | 'in_progress' | 'completed' | 'issue';
  type: 'checkout' | 'checkin' | 'repasse';
}

const mockTasks: CleaningTask[] = [
  {
    id: '1',
    property: 'Appartement Bellecour',
    address: '12 Place Bellecour',
    time: '10:00',
    agent: 'Marie D.',
    status: 'completed',
    type: 'checkout',
  },
  {
    id: '2',
    property: 'Studio Confluence',
    address: '8 Rue Denuzière',
    time: '11:30',
    agent: 'Sophie L.',
    status: 'in_progress',
    type: 'checkout',
  },
  {
    id: '3',
    property: 'Villa Presqu\'île',
    address: '23 Rue de la République',
    time: '14:00',
    agent: 'Jean M.',
    status: 'pending',
    type: 'checkin',
  },
  {
    id: '4',
    property: 'Loft Part-Dieu',
    address: '45 Avenue Félix Faure',
    time: '15:30',
    agent: 'Claire B.',
    status: 'issue',
    type: 'repasse',
  },
];

const statusConfig = {
  pending: { label: 'À faire', color: 'bg-muted text-muted-foreground', icon: Clock },
  in_progress: { label: 'En cours', color: 'bg-status-info/10 text-status-info', icon: Sparkles },
  completed: { label: 'Terminé', color: 'bg-status-success/10 text-status-success', icon: CheckCircle2 },
  issue: { label: 'Problème', color: 'bg-status-error/10 text-status-error', icon: AlertCircle },
};

const typeConfig = {
  checkout: { label: 'Check-out', color: 'text-channel-airbnb' },
  checkin: { label: 'Check-in', color: 'text-status-success' },
  repasse: { label: 'Repasse', color: 'text-status-warning' },
};

export function CleaningPreview({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-2xl border border-border/50 shadow-elevated overflow-hidden", className)}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-status-error/60" />
          <div className="w-3 h-3 rounded-full bg-status-warning/60" />
          <div className="w-3 h-3 rounded-full bg-status-success/60" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com/cleaning</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Planning Ménage</h3>
            <p className="text-xs text-muted-foreground">Jeudi 30 janvier 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              8 tâches
            </span>
            <span className="px-2.5 py-1 bg-status-success/10 text-status-success text-xs font-medium rounded-full">
              3 terminées
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">8</p>
          <p className="text-2xs text-muted-foreground">Total</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-status-success">3</p>
          <p className="text-2xs text-muted-foreground">Terminés</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-status-info">2</p>
          <p className="text-2xs text-muted-foreground">En cours</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-status-error">1</p>
          <p className="text-2xs text-muted-foreground">Problèmes</p>
        </div>
      </div>

      {/* Task list */}
      <div className="p-3 space-y-2">
        {mockTasks.map((task) => {
          const status = statusConfig[task.status];
          const type = typeConfig[task.type];
          const StatusIcon = status.icon;

          return (
            <div
              key={task.id}
              className="p-3 bg-background rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{task.property}</span>
                    <span className={cn("text-2xs font-medium", type.color)}>
                      {type.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-2xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {task.address}
                    </span>
                  </div>
                </div>
                <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-2xs font-medium", status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-3 text-2xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {task.agent}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
