import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, ClipboardList, Sparkles, Wrench, RotateCcw, User, Clock, Home, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    <Badge variant="secondary" className={cn("text-xs", config[channel].className)}>
      {config[channel].label}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    confirmed: { label: 'Confirmé', className: 'bg-emerald-100 text-emerald-700' },
    pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700' },
    issue: { label: 'Problème', className: 'bg-red-100 text-red-700' },
    todo: { label: 'À faire', className: 'bg-gray-100 text-gray-700' },
    inProgress: { label: 'En cours', className: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Terminé', className: 'bg-emerald-100 text-emerald-700' },
    scheduled: { label: 'Planifié', className: 'bg-purple-100 text-purple-700' }
  };

  const cfg = config[status] || config.todo;

  return (
    <Badge variant="secondary" className={cn("text-xs", cfg.className)}>
      {cfg.label}
    </Badge>
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
    <Badge variant="secondary" className={cn("text-xs gap-1", cfg.className)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
};

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
        <Card 
          key={booking.id} 
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/calendar')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-emerald-100">
                <LogIn className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{booking.guestName}</span>
                  <ChannelBadge channel={booking.channel} />
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {booking.propertyName}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={booking.status} />
              <div className="flex items-center gap-1 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {booking.time}
              </div>
            </div>
          </div>
        </Card>
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
        <Card 
          key={booking.id} 
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/calendar')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-blue-100">
                <LogOut className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{booking.guestName}</span>
                  <ChannelBadge channel={booking.channel} />
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
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
              <div className="flex items-center gap-1 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {booking.time}
              </div>
            </div>
          </div>
        </Card>
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
      navigate('/maintenance');
    } else {
      navigate('/cleaning');
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className={cn(
            "p-4 hover:shadow-md transition-shadow cursor-pointer",
            !task.agent && "border-l-4 border-l-amber-500"
          )}
          onClick={() => handleClick(task)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TaskTypeBadge type={task.type} />
              <div>
                <div className="flex items-center gap-2">
                  <Home className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{task.property}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <User className="h-3 w-3" />
                  {task.agent || <span className="text-amber-600 font-medium">Non assigné</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={task.status} />
              <div className="flex items-center gap-1 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {task.time}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const DailyActivityTabs = ({ checkIns, checkOuts, tasks }: DailyActivityTabsProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Activité du jour</h2>
        <Badge variant="outline" className="text-xs">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Badge>
      </div>
      
      <Tabs defaultValue="checkins" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="checkins" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Check-ins ({checkIns.length})
          </TabsTrigger>
          <TabsTrigger value="checkouts" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Check-outs ({checkOuts.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
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
    </Card>
  );
};
