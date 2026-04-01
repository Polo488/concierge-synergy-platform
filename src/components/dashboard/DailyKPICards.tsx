import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, MessageSquare, AlertCircle } from 'lucide-react';
import { DashboardStats } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface DailyKPICardsProps {
  stats: DashboardStats;
}

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  onClick: () => void;
  iconColorClass: string;
  iconBgClass: string;
}

const KPICard = ({ title, value, icon, onClick, iconColorClass, iconBgClass }: KPICardProps) => (
  <div 
    className={cn(
      "bg-card rounded-xl cursor-pointer transition-all duration-200",
      "hover:shadow-card",
      "p-5 max-md:p-3"
    )}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm max-md:text-[11px] text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl max-md:text-xl font-semibold text-foreground">{value}</p>
      </div>
      <div className={cn("p-3 max-md:p-2 rounded-xl", iconBgClass)}>
        <div className={iconColorClass}>{icon}</div>
      </div>
    </div>
  </div>
);

export const DailyKPICards = ({ stats }: DailyKPICardsProps) => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: "Check-ins aujourd'hui",
      value: stats.checkInsToday,
      icon: <LogIn className="h-5 w-5" />,
      onClick: () => navigate('/app/calendar'),
      iconColorClass: 'text-status-success',
      iconBgClass: 'bg-status-success-light'
    },
    {
      title: "Check-outs aujourd'hui",
      value: stats.checkOutsToday,
      icon: <LogOut className="h-5 w-5" />,
      onClick: () => navigate('/app/calendar'),
      iconColorClass: 'text-status-info',
      iconBgClass: 'bg-status-info-light'
    },
    {
      title: "Messages programmés",
      value: stats.scheduledMessages,
      icon: <MessageSquare className="h-5 w-5" />,
      onClick: () => navigate('/app/guest-experience'),
      iconColorClass: 'text-status-pending',
      iconBgClass: 'bg-status-pending-light'
    },
    {
      title: "Tâches non assignées",
      value: stats.unassignedTasks,
      icon: <AlertCircle className="h-5 w-5" />,
      onClick: () => navigate('/app/cleaning'),
      iconColorClass: 'text-status-warning',
      iconBgClass: 'bg-status-warning-light'
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((kpi) => (
        <KPICard
          key={kpi.title}
          {...kpi}
        />
      ))}
    </div>
  );
};
