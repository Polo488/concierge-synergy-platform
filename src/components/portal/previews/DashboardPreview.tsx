import { LogIn, LogOut, MessageSquare, AlertCircle, Sparkles, Wrench, Clock, Calendar, TrendingUp, Home, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const kpiCards = [
  { title: "Check-ins aujourd'hui", value: 4, icon: LogIn, color: "text-status-success", bg: "bg-status-success/10" },
  { title: "Check-outs aujourd'hui", value: 3, icon: LogOut, color: "text-status-info", bg: "bg-status-info/10" },
  { title: "Messages programmés", value: 8, icon: MessageSquare, color: "text-status-pending", bg: "bg-status-pending/10" },
  { title: "Tâches non assignées", value: 2, icon: AlertCircle, color: "text-status-warning", bg: "bg-status-warning/10" },
];

const activityTabs = [
  { id: 'checkins', label: 'Check-ins', icon: LogIn, count: 4, active: true },
  { id: 'checkouts', label: 'Check-outs', icon: LogOut, count: 3 },
  { id: 'tasks', label: 'Tâches', icon: Calendar, count: 6 },
];

const checkInsData = [
  { guest: 'Marie Dubois', property: 'Apt. 12 Rue du Port', channel: 'airbnb', time: '15:00', status: 'confirmed' },
  { guest: 'Pierre Martin', property: 'Studio 8 Avenue Fleurs', channel: 'booking', time: '16:00', status: 'confirmed' },
  { guest: 'Jean-Luc Bernard', property: 'Loft 72 Rue des Arts', channel: 'airbnb', time: '17:00', status: 'pending' },
];

const agendaItems = [
  { title: 'Appel propriétaire - M. Durand', time: '10:00', type: 'call' },
  { title: 'Vérifier stock produits ménage', time: '14:00', type: 'task' },
  { title: 'Relance assurance Apt. Bellecour', time: '16:00', type: 'reminder' },
];

const ChannelBadge = ({ channel }: { channel: string }) => (
  <span className={cn(
    "text-2xs px-1.5 py-0.5 rounded font-medium text-white",
    channel === 'airbnb' ? "bg-channel-airbnb" : "bg-channel-booking"
  )}>
    {channel === 'airbnb' ? 'Airbnb' : 'Booking'}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn(
    "text-2xs px-1.5 py-0.5 rounded font-medium",
    status === 'confirmed' ? "bg-status-success/10 text-status-success" : "bg-status-warning/10 text-status-warning"
  )}>
    {status === 'confirmed' ? 'Confirmé' : 'En attente'}
  </span>
);

export function DashboardPreview({ className }: { className?: string }) {
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
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com/dashboard</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Tableau de bord</h3>
            <p className="text-xs text-muted-foreground">Vue opérationnelle de votre activité du jour</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-status-success/10 text-status-success text-xs font-medium rounded-full flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              87% occupation
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 bg-muted/20">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.title} className="bg-card rounded-xl p-3 border border-border/30 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xs text-muted-foreground font-medium">{kpi.title}</span>
                  <div className={cn("p-1.5 rounded-lg", kpi.bg)}>
                    <Icon className={cn("w-3.5 h-3.5", kpi.color)} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        {/* Two column layout - Activity + Agenda */}
        <div className="grid grid-cols-2 gap-4">
          {/* Daily Activity Card */}
          <div className="bg-card rounded-xl border border-border/30 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
              <h4 className="text-xs font-semibold text-foreground">Activité du jour</h4>
              <span className="text-2xs text-muted-foreground">Vendredi 30 janvier</span>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-border/30">
              {activityTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 text-2xs font-medium transition-colors",
                      tab.active 
                        ? "text-primary border-b-2 border-primary bg-primary/5" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {tab.label} ({tab.count})
                  </button>
                );
              })}
            </div>
            
            {/* Check-ins list */}
            <div className="p-2 space-y-2 max-h-[180px] overflow-y-auto">
              {checkInsData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="p-1.5 rounded-full bg-status-success/10">
                    <LogIn className="w-3 h-3 text-status-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground truncate">{item.guest}</span>
                      <ChannelBadge channel={item.channel} />
                    </div>
                    <div className="flex items-center gap-1 text-2xs text-muted-foreground mt-0.5">
                      <Home className="w-2.5 h-2.5" />
                      <span className="truncate">{item.property}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={item.status} />
                    <div className="flex items-center gap-0.5 text-2xs font-medium text-foreground">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda Preview */}
          <div className="bg-card rounded-xl border border-border/30 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
              <h4 className="text-xs font-semibold text-foreground">Agenda interne</h4>
              <span className="text-2xs text-primary font-medium cursor-pointer hover:underline">Voir tout</span>
            </div>

            <div className="p-2 space-y-2">
              <div className="text-2xs font-semibold text-muted-foreground px-1 mb-1">Aujourd'hui</div>
              {agendaItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <div className="w-1 h-8 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-2xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
              
              <div className="text-2xs font-semibold text-muted-foreground px-1 mt-3 mb-1">Demain</div>
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg opacity-70">
                <div className="w-1 h-8 rounded-full bg-muted-foreground/30" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Réunion équipe ménage</p>
                  <p className="text-2xs text-muted-foreground">09:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl border border-border/30 p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">24 890€</p>
              <p className="text-2xs text-muted-foreground">Revenus ce mois</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border/30 p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-success/10">
              <Sparkles className="w-4 h-4 text-status-success" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">12</p>
              <p className="text-2xs text-muted-foreground">Ménages aujourd'hui</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border/30 p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-warning/10">
              <Wrench className="w-4 h-4 text-status-warning" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">3</p>
              <p className="text-2xs text-muted-foreground">Maintenances en cours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
