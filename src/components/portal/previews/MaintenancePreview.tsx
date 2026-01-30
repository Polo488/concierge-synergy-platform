import { cn } from '@/lib/utils';
import { Wrench, Clock, CheckCircle2, AlertTriangle, User, MapPin, Calendar } from 'lucide-react';

interface MaintenanceTask {
  id: string;
  title: string;
  property: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  technician: string;
  dueDate: string;
}

const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Fuite robinet salle de bain',
    property: 'Appartement Bellecour',
    priority: 'urgent',
    status: 'in_progress',
    technician: 'Thomas P.',
    dueDate: 'Aujourd\'hui',
  },
  {
    id: '2',
    title: 'Serrure porte entrée bloquée',
    property: 'Studio Confluence',
    priority: 'high',
    status: 'pending',
    technician: 'Marc L.',
    dueDate: 'Demain',
  },
  {
    id: '3',
    title: 'Chauffe-eau à remplacer',
    property: 'Villa Presqu\'île',
    priority: 'medium',
    status: 'pending',
    technician: 'Non assigné',
    dueDate: 'Cette semaine',
  },
  {
    id: '4',
    title: 'Prise électrique défectueuse',
    property: 'Loft Part-Dieu',
    priority: 'low',
    status: 'completed',
    technician: 'Thomas P.',
    dueDate: 'Terminé',
  },
];

const priorityConfig = {
  low: { label: 'Faible', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Moyen', color: 'bg-status-info/10 text-status-info' },
  high: { label: 'Haute', color: 'bg-status-warning/10 text-status-warning' },
  urgent: { label: 'Urgent', color: 'bg-status-error/10 text-status-error' },
};

const statusConfig = {
  pending: { label: 'En attente', icon: Clock, color: 'text-muted-foreground' },
  in_progress: { label: 'En cours', icon: Wrench, color: 'text-status-info' },
  completed: { label: 'Terminé', icon: CheckCircle2, color: 'text-status-success' },
};

export function MaintenancePreview({ className }: { className?: string }) {
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
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com/maintenance</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Maintenance</h3>
            <p className="text-xs text-muted-foreground">Suivi des interventions</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-status-error/10 text-status-error text-xs font-medium rounded-full">
              2 urgents
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">12</p>
          <p className="text-2xs text-muted-foreground">Total</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-status-error">2</p>
          <p className="text-2xs text-muted-foreground">Urgents</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-status-info">4</p>
          <p className="text-2xs text-muted-foreground">En cours</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-status-success">6</p>
          <p className="text-2xs text-muted-foreground">Terminés</p>
        </div>
      </div>

      {/* Task list */}
      <div className="p-3 space-y-2">
        {mockTasks.map((task) => {
          const priority = priorityConfig[task.priority];
          const status = statusConfig[task.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={task.id}
              className="p-3 bg-background rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{task.title}</span>
                    <span className={cn("px-1.5 py-0.5 rounded text-2xs font-medium", priority.color)}>
                      {priority.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-2xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {task.property}
                    </span>
                  </div>
                </div>
                <div className={cn("flex items-center gap-1.5 text-2xs font-medium", status.color)}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-3 text-2xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {task.technician}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {task.dueDate}
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
