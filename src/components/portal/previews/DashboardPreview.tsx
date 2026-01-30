import { LogIn, LogOut, MessageSquare, AlertCircle, Sparkles, Wrench, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const kpiCards = [
  { title: "Check-ins", value: 4, icon: LogIn, color: "text-status-success", bg: "bg-status-success/10" },
  { title: "Check-outs", value: 3, icon: LogOut, color: "text-status-info", bg: "bg-status-info/10" },
  { title: "Messages", value: 8, icon: MessageSquare, color: "text-status-pending", bg: "bg-status-pending/10" },
  { title: "Non assignées", value: 2, icon: AlertCircle, color: "text-status-warning", bg: "bg-status-warning/10" },
];

const todayTasks = [
  { type: 'cleaning', property: 'Apt. 12 Rue du Port', agent: 'Marie L.', time: '11:00', status: 'inProgress' },
  { type: 'cleaning', property: 'Studio 8 Avenue Fleurs', agent: 'Jean P.', time: '14:00', status: 'todo' },
  { type: 'maintenance', property: 'Loft 72 Rue Arts', agent: 'Pierre M.', time: '09:00', status: 'completed' },
];

const upcomingBookings = [
  { guest: 'Marie Dubois', property: 'Apt. 12 Rue du Port', time: '15:00', channel: 'airbnb' },
  { guest: 'Pierre Martin', property: 'Studio 8 Avenue Fleurs', time: '16:00', channel: 'booking' },
];

export function DashboardPreview({ className }: { className?: string }) {
  return (
    <div className={cn("bg-background rounded-xl border border-border/50 overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Tableau de bord</h3>
            <p className="text-xs text-muted-foreground">Vendredi 30 janvier 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-status-success/10 text-status-success text-xs font-medium rounded-full">
              87% occupation
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-2">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.title} className="bg-card rounded-lg p-3 border border-border/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{kpi.title}</span>
                  <div className={cn("p-1.5 rounded-lg", kpi.bg)}>
                    <Icon className={cn("w-3 h-3", kpi.color)} />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Today's Tasks */}
          <div className="bg-card rounded-lg border border-border/30 p-3">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-medium text-foreground">Tâches du jour</h4>
            </div>
            <div className="space-y-2">
              {todayTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    task.type === 'cleaning' ? "bg-status-success/10" : "bg-status-warning/10"
                  )}>
                    {task.type === 'cleaning' ? (
                      <Sparkles className="w-3 h-3 text-status-success" />
                    ) : (
                      <Wrench className="w-3 h-3 text-status-warning" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{task.property}</p>
                    <p className="text-2xs text-muted-foreground">{task.agent} • {task.time}</p>
                  </div>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-2xs font-medium",
                    task.status === 'completed' && "bg-status-success/10 text-status-success",
                    task.status === 'inProgress' && "bg-status-info/10 text-status-info",
                    task.status === 'todo' && "bg-muted text-muted-foreground"
                  )}>
                    {task.status === 'completed' ? '✓' : task.status === 'inProgress' ? 'En cours' : 'À faire'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Check-ins */}
          <div className="bg-card rounded-lg border border-border/30 p-3">
            <div className="flex items-center gap-2 mb-3">
              <LogIn className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-medium text-foreground">Arrivées à venir</h4>
            </div>
            <div className="space-y-2">
              {upcomingBookings.map((booking, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold text-white",
                    booking.channel === 'airbnb' ? "bg-channel-airbnb" : "bg-channel-booking"
                  )}>
                    {booking.channel === 'airbnb' ? 'A' : 'B'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{booking.guest}</p>
                    <p className="text-2xs text-muted-foreground truncate">{booking.property}</p>
                  </div>
                  <span className="text-xs text-primary font-medium">{booking.time}</span>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">24 890€</p>
                <p className="text-2xs text-muted-foreground">Revenus mois</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-status-success">4.8</p>
                <p className="text-2xs text-muted-foreground">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
