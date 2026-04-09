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
    airbnb: { label: 'Airbnb', className: 'bg-[#FF5A5F] text-white hover:bg-[#FF5A5F]' },
    booking: { label: 'Booking', className: 'bg-[#003580] text-white hover:bg-[#003580]' },
    direct: { label: 'Direct', className: 'bg-gray-500 text-white hover:bg-gray-500' }
  };

  return (
    <Badge variant="secondary" className={cn('text-xs', config[channel].className)}>
      {config[channel].label}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    confirmed: { label: 'Confirmé', bg: 'rgba(34,197,94,0.1)', text: '#16A34A' },
    pending: { label: 'En attente', bg: 'rgba(245,200,66,0.15)', text: '#B45309' },
    issue: { label: 'Problème', bg: 'rgba(239,68,68,0.1)', text: '#DC2626' },
    todo: { label: 'À faire', bg: 'rgba(0,0,0,0.05)', text: '#555' },
    inProgress: { label: 'En cours', bg: 'rgba(59,130,246,0.1)', text: '#2563EB' },
    completed: { label: 'Terminé', bg: 'rgba(34,197,94,0.1)', text: '#16A34A' },
    scheduled: { label: 'Planifié', bg: 'rgba(139,92,246,0.1)', text: '#7C3AED' }
  };

  const cfg = config[status] || config.todo;

  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
};

const TaskTypeBadge = ({ type }: { type: 'cleaning' | 'maintenance' | 'repasse' }) => {
  const config = {
    cleaning: { label: 'Ménage', icon: Sparkles, className: 'bg-cyan-100 text-cyan-700' },
    maintenance: { label: 'Maintenance', icon: Wrench, className: 'bg-orange-100 text-orange-700' },
    repasse: { label: 'Repasse', icon: RotateCcw, className: 'bg-pink-100 text-pink-700' }
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
    className="p-4 rounded-[10px] cursor-pointer transition-colors"
    style={{ border: '1px solid rgba(0,0,0,0.06)' }}
    onClick={onClick}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(107,122,232,0.05)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full" style={{ background: 'rgba(107,122,232,0.15)' }}>
                <LogIn className="h-4 w-4" style={{ color: '#6B7AE8' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[15px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>{booking.guestName}</span>
                  <ChannelBadge channel={booking.channel} />
                </div>
                <div className="flex items-center gap-3 text-[13px] mt-1" style={{ color: 'rgba(26,26,46,0.45)' }}>
                  <span className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {booking.propertyName}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={booking.status} />
              <div className="flex items-center gap-1 text-sm font-bold" style={{ color: '#1A1A2E', fontFamily: 'Inter' }}>
                <Clock className="h-4 w-4" style={{ color: 'rgba(26,26,46,0.5)' }} />
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full" style={{ background: 'rgba(107,122,232,0.15)' }}>
                <LogOut className="h-4 w-4" style={{ color: '#6B7AE8' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[15px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>{booking.guestName}</span>
                  <ChannelBadge channel={booking.channel} />
                </div>
                <div className="flex items-center gap-3 text-[13px] mt-1" style={{ color: 'rgba(26,26,46,0.45)' }}>
                  <span className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {booking.propertyName}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {booking.cleaningTaskStatus && (
                <StatusBadge status={booking.cleaningTaskStatus} />
              )}
              <div className="flex items-center gap-1 text-sm font-bold" style={{ color: '#1A1A2E', fontFamily: 'Inter' }}>
                <Clock className="h-4 w-4" style={{ color: 'rgba(26,26,46,0.5)' }} />
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TaskTypeBadge type={task.type} />
              <div>
                <div className="flex items-center gap-2">
                  <Home className="h-3 w-3" style={{ color: 'rgba(26,26,46,0.5)' }} />
                  <span className="font-semibold text-[15px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>{task.property}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] mt-1" style={{ color: 'rgba(26,26,46,0.45)' }}>
                  <User className="h-3 w-3" />
                  {task.agent || <span className="text-amber-600 font-medium">Non assigné</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={task.status} />
              <div className="flex items-center gap-1 text-sm font-bold" style={{ color: '#1A1A2E', fontFamily: 'Inter' }}>
                <Clock className="h-4 w-4" style={{ color: 'rgba(26,26,46,0.5)' }} />
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
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[17px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>Activité du jour</h2>
        <span className="text-[13px]" style={{ color: 'rgba(26,26,46,0.4)', fontFamily: 'Inter' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>
      <div className="mb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }} />

      <Tabs defaultValue="checkins" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 p-[3px] rounded-[10px]" style={{ background: '#F0F0F0' }}>
          <TabsTrigger value="checkins" className="flex items-center gap-2 rounded-lg text-sm data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[rgba(26,26,46,0.45)] data-[state=inactive]:bg-transparent transition-all duration-150">
            <LogIn className="h-4 w-4" />
            Check-ins ({checkIns.length})
          </TabsTrigger>
          <TabsTrigger value="checkouts" className="flex items-center gap-2 rounded-lg text-sm data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[rgba(26,26,46,0.45)] data-[state=inactive]:bg-transparent transition-all duration-150">
            <LogOut className="h-4 w-4" />
            Check-outs ({checkOuts.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2 rounded-lg text-sm data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[rgba(26,26,46,0.45)] data-[state=inactive]:bg-transparent transition-all duration-150">
            <ClipboardList className="h-4 w-4" />
            Tâches ({tasks.length})
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
