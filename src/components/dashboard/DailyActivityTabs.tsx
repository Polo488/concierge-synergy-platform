import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, ClipboardList, Sparkles, Wrench, RotateCcw, User, Clock, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TodayBooking, TodayTask } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface DailyActivityTabsProps {
  checkIns: TodayBooking[];
  checkOuts: TodayBooking[];
  tasks: TodayTask[];
}

const ChannelBadge = ({ channel }: { channel: 'airbnb' | 'booking' | 'direct' }) => {
  const config = {
    airbnb: { label: 'Airbnb', style: { background: 'rgba(255,90,95,0.12)', color: '#FF5A5F' } },
    booking: { label: 'Booking', style: { background: 'rgba(0,59,149,0.12)', color: '#003B95' } },
    direct: { label: 'Direct', style: { background: 'hsla(240,6%,15%,0.08)', color: 'hsl(var(--label-1))' } }
  };

  return (
    <span
      className="inline-flex items-center h-[18px] px-2 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={config[channel].style}
    >
      {config[channel].label}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; bg: string; color: string }> = {
    confirmed:  { label: 'Confirmé',  bg: 'rgba(52,199,89,0.12)', color: '#1F8A3F' },
    pending:    { label: 'En attente', bg: 'rgba(255,204,0,0.15)', color: '#8B6B00' },
    issue:      { label: 'Problème',  bg: 'rgba(255,59,48,0.12)', color: '#C8281F' },
    todo:       { label: 'À faire',   bg: 'hsla(240,6%,15%,0.08)', color: 'hsl(var(--label-2))' },
    inProgress: { label: 'En cours',  bg: 'rgba(0,122,255,0.12)', color: '#0064D6' },
    completed:  { label: 'Terminé',   bg: 'rgba(52,199,89,0.12)', color: '#1F8A3F' },
    scheduled:  { label: 'Planifié',  bg: 'rgba(157,99,209,0.12)', color: '#6A3DA8' },
  };
  const cfg = config[status] || config.todo;
  return (
    <span
      className="inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
};

const TaskTypeBadge = ({ type }: { type: 'cleaning' | 'maintenance' | 'repasse' }) => {
  const config = {
    cleaning: { label: 'Ménage', icon: Sparkles, className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
    maintenance: { label: 'Maintenance', icon: Wrench, className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    repasse: { label: 'Repasse', icon: RotateCcw, className: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' }
  };

  const cfg = config[type];
  const Icon = cfg.icon;

  return (
    <Badge variant="secondary" className={cn('text-xs gap-1', cfg.className)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
};

const ListItem = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <div
    className="px-4 py-3 rounded-[14px] cursor-pointer transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
    onClick={onClick}
  >
    {children}
  </div>
);

const CheckInsList = ({ checkIns }: { checkIns: TodayBooking[] }) => {
  const navigate = useNavigate();

  if (checkIns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun check-in prévu aujourd'hui
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {checkIns.map((booking) => (
        <ListItem key={booking.id} onClick={() => navigate('/app/calendar')}>
          <div className="flex items-start gap-3 sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-full bg-accent flex-shrink-0">
                <LogIn className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-[15px] font-heading text-foreground break-words">{booking.guestName}</span>
                  <ChannelBadge channel={booking.channel} />
                </div>
                <div className="flex items-center gap-3 text-[13px] mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1 min-w-0">
                    <Home className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{booking.propertyName}</span>
                  </span>
                </div>
                {/* Mobile: status + time inline under text */}
                <div className="flex items-center gap-2 mt-2 sm:hidden flex-wrap">
                  <StatusBadge status={booking.status} />
                  <div className="flex items-center gap-1 text-[13px] font-bold text-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {booking.time}
                  </div>
                </div>
              </div>
            </div>
            {/* Desktop: right-aligned status + time */}
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              <StatusBadge status={booking.status} />
              <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {booking.time}
              </div>
            </div>
          </div>
        </ListItem>
      ))}
    </div>
  );
};

const CheckOutsList = ({ checkOuts }: { checkOuts: TodayBooking[] }) => {
  const navigate = useNavigate();

  if (checkOuts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun check-out prévu aujourd'hui
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {checkOuts.map((booking) => (
        <ListItem key={booking.id} onClick={() => navigate('/app/calendar')}>
          <div className="flex items-start gap-3 sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-full bg-accent flex-shrink-0">
                <LogOut className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-[15px] font-heading text-foreground break-words">{booking.guestName}</span>
                  <ChannelBadge channel={booking.channel} />
                </div>
                <div className="flex items-center gap-3 text-[13px] mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1 min-w-0">
                    <Home className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{booking.propertyName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:hidden flex-wrap">
                  {booking.cleaningTaskStatus && <StatusBadge status={booking.cleaningTaskStatus} />}
                  <div className="flex items-center gap-1 text-[13px] font-bold text-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {booking.time}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              {booking.cleaningTaskStatus && (
                <StatusBadge status={booking.cleaningTaskStatus} />
              )}
              <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {booking.time}
              </div>
            </div>
          </div>
        </ListItem>
      ))}
    </div>
  );
};

const TasksList = ({ tasks }: { tasks: TodayTask[] }) => {
  const navigate = useNavigate();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune tâche prévue aujourd'hui
      </div>
    );
  }

  const handleClick = (task: TodayTask) => {
    if (task.type === 'maintenance') {
      navigate('/app/maintenance');
    } else {
      navigate('/app/cleaning');
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <ListItem key={task.id} onClick={() => handleClick(task)}>
          <div className="flex items-start gap-3 sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <TaskTypeBadge type={task.type} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Home className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="font-semibold text-[15px] font-heading text-foreground truncate">{task.property}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] mt-1 text-muted-foreground min-w-0">
                  <User className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {task.agent || <span className="text-amber-600 dark:text-amber-400 font-medium">Non assigné</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:hidden flex-wrap">
                  <StatusBadge status={task.status} />
                  <div className="flex items-center gap-1 text-[13px] font-bold text-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {task.time}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              <StatusBadge status={task.status} />
              <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {task.time}
              </div>
            </div>
          </div>
        </ListItem>
      ))}
    </div>
  );
};

export const DailyActivityTabs = ({ checkIns, checkOuts, tasks }: DailyActivityTabsProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-[hsl(var(--label-1))]">Activité du jour</h2>
        <span className="text-[13px] text-[hsl(var(--label-2))] tabular">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>

      <Tabs defaultValue="checkins" className="w-full">
        <TabsList className="ios-segmented mb-4 h-auto bg-transparent p-[2px] w-auto inline-flex">
          <TabsTrigger
            value="checkins"
            className="flex items-center gap-2 rounded-[8px] px-3.5 py-2 text-[13px] font-semibold text-[hsl(var(--label-2))] data-[state=active]:text-[hsl(var(--label-1))] data-[state=active]:shadow-none transition-all duration-200"
          >
            <LogIn className="h-4 w-4" />
            Check-ins <span className="text-[hsl(var(--label-3))]">({checkIns.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="checkouts"
            className="flex items-center gap-2 rounded-[8px] px-3.5 py-2 text-[13px] font-semibold text-[hsl(var(--label-2))] data-[state=active]:text-[hsl(var(--label-1))] data-[state=active]:shadow-none transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Check-outs <span className="text-[hsl(var(--label-3))]">({checkOuts.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="flex items-center gap-2 rounded-[8px] px-3.5 py-2 text-[13px] font-semibold text-[hsl(var(--label-2))] data-[state=active]:text-[hsl(var(--label-1))] data-[state=active]:shadow-none transition-all duration-200"
          >
            <ClipboardList className="h-4 w-4" />
            Tâches <span className="text-[hsl(var(--label-3))]">({tasks.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkins" className="mt-0">
          <CheckInsList checkIns={checkIns} />
        </TabsContent>

        <TabsContent value="checkouts" className="mt-0">
          <CheckOutsList checkOuts={checkOuts} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-0">
          <TasksList tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
