import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogIn, LogOut, Sparkles, Wrench, RotateCcw, 
  Clock, User, Home 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TodayBooking, TodayTask } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface DailyTimelineProps {
  checkIns: TodayBooking[];
  checkOuts: TodayBooking[];
  tasks: TodayTask[];
}

type TimelineEventType = 'checkin' | 'checkout' | 'cleaning' | 'maintenance' | 'repasse';

interface TimelineEvent {
  id: string;
  time: string;
  type: TimelineEventType;
  title: string;
  subtitle: string;
  agent?: string | null;
  status: string;
  channel?: 'airbnb' | 'booking' | 'direct';
}

const eventConfig: Record<TimelineEventType, { 
  icon: typeof LogIn; 
  bgColor: string; 
  iconColor: string;
  label: string;
}> = {
  checkin: { 
    icon: LogIn, 
    bgColor: 'bg-emerald-100', 
    iconColor: 'text-emerald-600',
    label: 'Check-in'
  },
  checkout: { 
    icon: LogOut, 
    bgColor: 'bg-blue-100', 
    iconColor: 'text-blue-600',
    label: 'Check-out'
  },
  cleaning: { 
    icon: Sparkles, 
    bgColor: 'bg-cyan-100', 
    iconColor: 'text-cyan-600',
    label: 'Ménage'
  },
  maintenance: { 
    icon: Wrench, 
    bgColor: 'bg-orange-100', 
    iconColor: 'text-orange-600',
    label: 'Maintenance'
  },
  repasse: { 
    icon: RotateCcw, 
    bgColor: 'bg-pink-100', 
    iconColor: 'text-pink-600',
    label: 'Repasse'
  }
};

const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
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

const TimelineItem = ({ event, isLast }: { event: TimelineEvent; isLast: boolean }) => {
  const navigate = useNavigate();
  const config = eventConfig[event.type];
  const Icon = config.icon;

  const handleClick = () => {
    if (event.type === 'checkin' || event.type === 'checkout') {
      navigate('/calendar');
    } else if (event.type === 'maintenance') {
      navigate('/maintenance');
    } else {
      navigate('/cleaning');
    }
  };

  return (
    <div className="flex gap-4">
      {/* Time column */}
      <div className="w-14 flex-shrink-0 text-right">
        <span className="text-sm font-semibold text-foreground">{event.time}</span>
      </div>

      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className={cn("p-2 rounded-full z-10", config.bgColor)}>
          <Icon className={cn("h-4 w-4", config.iconColor)} />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-border min-h-[40px]" />
        )}
      </div>

      {/* Content */}
      <Card 
        className={cn(
          "flex-1 p-3 mb-3 cursor-pointer transition-all hover:shadow-md",
          !event.agent && (event.type === 'cleaning' || event.type === 'maintenance' || event.type === 'repasse') 
            && "border-l-4 border-l-amber-500"
        )}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
              {event.channel && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    event.channel === 'airbnb' && "bg-[#FF5A5F] text-white",
                    event.channel === 'booking' && "bg-[#003580] text-white",
                    event.channel === 'direct' && "bg-gray-500 text-white"
                  )}
                >
                  {event.channel === 'airbnb' ? 'Airbnb' : event.channel === 'booking' ? 'Booking' : 'Direct'}
                </Badge>
              )}
            </div>
            <p className="font-medium mt-1 truncate">{event.title}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1 truncate">
                <Home className="h-3 w-3 flex-shrink-0" />
                {event.subtitle}
              </span>
              {event.agent !== undefined && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 flex-shrink-0" />
                  {event.agent || <span className="text-amber-600 font-medium">Non assigné</span>}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={event.status} />
        </div>
      </Card>
    </div>
  );
};

export const DailyTimeline = ({ checkIns, checkOuts, tasks }: DailyTimelineProps) => {
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add check-ins
    checkIns.forEach(booking => {
      events.push({
        id: `checkin-${booking.id}`,
        time: booking.time,
        type: 'checkin',
        title: booking.guestName,
        subtitle: booking.propertyName,
        status: booking.status,
        channel: booking.channel
      });
    });

    // Add check-outs
    checkOuts.forEach(booking => {
      events.push({
        id: `checkout-${booking.id}`,
        time: booking.time,
        type: 'checkout',
        title: booking.guestName,
        subtitle: booking.propertyName,
        status: booking.cleaningTaskStatus || booking.status,
        channel: booking.channel
      });
    });

    // Add tasks
    tasks.forEach(task => {
      events.push({
        id: `task-${task.id}`,
        time: task.time,
        type: task.type,
        title: task.type === 'cleaning' ? 'Ménage' : task.type === 'maintenance' ? 'Maintenance' : 'Repasse',
        subtitle: task.property,
        agent: task.agent,
        status: task.status
      });
    });

    // Sort by time
    return events.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  }, [checkIns, checkOuts, tasks]);

  // Group events by hour for better visualization
  const currentHour = new Date().getHours();

  if (timelineEvents.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline du jour
          </h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Aucune activité prévue aujourd'hui
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline du jour
        </h2>
        <Badge variant="outline" className="text-xs">
          {timelineEvents.length} événements
        </Badge>
      </div>

      <div className="relative">
        {timelineEvents.map((event, index) => (
          <TimelineItem 
            key={event.id} 
            event={event} 
            isLast={index === timelineEvents.length - 1}
          />
        ))}
      </div>
    </Card>
  );
};
