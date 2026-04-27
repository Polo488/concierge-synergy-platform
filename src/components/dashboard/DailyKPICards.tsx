import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, MessageCircle, CheckSquare } from 'lucide-react';
import { DashboardStats } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface DailyKPICardsProps {
  stats: DashboardStats;
}

interface KPICardProps {
  title: string;
  value: number;
  Icon: React.ElementType;
  onClick: () => void;
}

const KPICard = ({ title, value, Icon, onClick }: KPICardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "glass-surface text-left w-full p-5 h-[120px] flex flex-col justify-between",
      "transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99]",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ios-orange)/_0.4)]"
    )}
  >
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium text-[hsl(240_6%_25%/_0.6)]">{title}</span>
      <span className="h-7 w-7 rounded-full bg-black/[0.04] flex items-center justify-center">
        <Icon size={14} strokeWidth={2} className="text-[hsl(240_6%_25%/_0.5)]" />
      </span>
    </div>
    <div
      className="text-[36px] leading-none font-bold tabular tracking-[-0.025em] text-[hsl(var(--label-1))]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}
    >
      {value}
    </div>
  </button>
);

export const DailyKPICards = ({ stats }: DailyKPICardsProps) => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: "Check-ins",
      value: stats.checkInsToday,
      Icon: LogIn,
      onClick: () => navigate('/app/calendar'),
    },
    {
      title: "Check-outs",
      value: stats.checkOutsToday,
      Icon: LogOut,
      onClick: () => navigate('/app/calendar'),
    },
    {
      title: "Messages",
      value: stats.scheduledMessages,
      Icon: MessageCircle,
      onClick: () => navigate('/app/guest-experience'),
    },
    {
      title: "Tâches",
      value: stats.unassignedTasks,
      Icon: CheckSquare,
      onClick: () => navigate('/app/cleaning'),
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
};
